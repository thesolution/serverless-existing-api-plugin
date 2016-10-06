Serverless Existing API Plugin
=====================

Oh, no! I already have an AWS API Gateway Rest API!

By default Serverless wants to own the entire API.  But if you are using Serverless to deploy to an existing api, check this out.

This plugin adds support for deploying to existing APIGateways to Serverless
 - Specify the API Id and Root Resource Id of the existing API
 - The plugin creates a unique Stage for testing so your existing stage is not clobbered
 - Deploying to a public state can be done with AWS CLI

*Note*: This plugin supports Serverless Version 1.0 commit:242ad7bab4d44bf4c23c4476662e640452f2c5b9.  See Installation instructions.

### Installation

 - make sure that aws is installed
 - @see http://docs.aws.amazon.com/cli/latest/userguide/installing.html
 - install serverless from the commit this plugin was tested against
 - install this plugin to your projects node_modules folder

```
cd projectfolder
npm install git+http://gitlab.trad.tradestation.com/colin/serverless-existing-api-plugin.git
```

 - Add the plugin to your ```serverless.yml```

```
# Enable the plugin for your project
plugins:
  - serverless-existing-api-plugin

# Tell the plugin which existing api to deploy to
custom:
  apiId: kzv4ton5o1
  rootResource: c3p7pdz0od
```

### Install Specific version of Serverless

```
git clone --depth 1 -n https://github.com/serverless/serverless.git
git checkout 242ad7bab4d44bf4c23c4476662e640452f2c5b9
cd serverless
npm install 
npm link
```

### Push your code!

 - this plugin will deploy to your existing api
 - that's all!
 
### Deploy to a Public Stage

```
> aws apigateway create-deployment --rest-api-id 33645q629e --stage-name dev --description "Version 0.5.1"
```