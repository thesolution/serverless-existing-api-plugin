'use strict';

class RedirectPlugin {
  constructor(sls, options) {
    this.serverless = sls;
    this.options = options;
    this.commands = {
      deploy: {
        lifecycleEvents: [ ]
      },
    };
    this.apiResourceName = 'ApiGatewayRestApi';
    this.apiId = '';
    this.rootResource = '';
    this.write = false;
    this.hooks = {
        'after:deploy:compileEvents': () => {
            this.apiId = this.serverless.service.custom.apiId;
            this.rootResource = this.serverless.service.custom.rootResource;
            const resources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
            const parameters = this.serverless.service.provider.compiledCloudFormationTemplate.Parameters;
            const outputs = this.serverless.service.provider.compiledCloudFormationTemplate.Outputs;
            Object.keys(resources).forEach(resourceName => {
              let resource = resources[resourceName];
              // Remove the new Rest API Creation statement
              if ( resource.Type == "AWS::ApiGateway::RestApi") {
                this.apiResourceName = resourceName;
              }
              // Make the Stage name the deployment goes to unique
              if ( resource.Type == 'AWS::ApiGateway::Deployment') {
                let stackName = this.serverless.service.service.replace(/-/g,'_');
                resource.Properties.StageName += `_${stackName}`; 
              }
            });
            delete resources[this.apiResourceName];

            // Add the existing API id to the Parmeters section
            parameters[this.apiResourceName] = {
              Default: this.apiId,
              Type: "String"
            };
            
            // Replace any calls to / "Fn::GetAtt": ["ApiGatewayRestApi","RootResourceId"] ' with ApiRootId
            this.replaceGetAttCalls(resources);
            this.replaceGetAttCalls(outputs);
        }
    };
  }
  
  replaceGetAttCalls(properties) {
      if (Array.isArray(properties)) {
        for(var i=0; i < properties.length; i++){
          properties[i] = this.replaceGetAttCalls(properties[i]);
        }
      } else if ( typeof properties == 'object') {
        Object.keys(properties).forEach( propName => {
      
          if (propName == "Fn::GetAtt") {
              if (properties[propName][0] == this.apiResourceName) {
                properties = this.rootResource;
              }
          } else {
            properties[propName] = this.replaceGetAttCalls(properties[propName]);
          }
        });
      } 
      return properties
  }
}

module.exports = RedirectPlugin;
