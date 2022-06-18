# aws-node-express-api-project

## Instalation

Install the serverless CLI via NPM:

```bash
npm install -g serverless
```

## Usage

### Deployment

Install dependencies with:

```bash
npm install
```

and then deploy with:

```bash
npm run [deploy | deploy-production]
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-express-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-express-api-project-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-api-project-dev-api (766 kB)
```

Note: To deploy the application to AWS you need a key and secret that are obtained in the Amazon account.

```bash
sls config credentials --provider aws --key XXXXXXXXX --secret XXXXXXXXXXXXXXXXXXXXX --profile deploy-aws
```

### Local development

It is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
npm run start
```

After running start, you should see output similar to:

```bash
Starting Offline at stage dev (us-east-2)

Offline [http for lambda] listening on http://localhost:3002
Function names exposed for local invocation by aws-sdk:
           * api: aws-node-express-api-project-dev-api

   ┌───────────────────────────────────────────────────────────────────────┐
   │                                                                       │
   │   ANY | http://localhost:3000/{default*}                              │
   │   POST | http://localhost:3000/2015-03-31/functions/api/invocations   │
   │                                                                       │
   └───────────────────────────────────────────────────────────────────────┘

Server ready: http://localhost:3000 🚀
```
