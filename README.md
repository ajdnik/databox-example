# databox-example

This solution demonstrates an example databox integration service which runs periodically to collect metrics from various services and pushes them to databox for processing.

### Getting Started
Make sure you have [Node v14](https://nodejs.org/en/) and [Docker](https://www.docker.com) installed on your machine.

Before running the service you need to have the following environment variables configured:
```
GITHUB_USERNAME=**GITHUB USERNAME**
GITHUB_TOKEN=**GITHUB PERSONAL ACCESS TOKEN**
GITHUB_DATABOX_TOKEN=**DATABOX PUSH TOKEN WHERE GITHUB KPIS WILL BE PUSHED**
INSTAGRAM_USERNAME=**INSTAGRAM USERNAME**
INSTAGRAM_PASSWORD=**INSTAGRAM PASSWORD**
INSTAGRAM_DATABOX_TOKEN=**DATABOX PUSH TOKEN WHERE INSTAGRAM KPIS WILL BE PUSHED**
BITBUCKET_USERNAME=**BITBUCKET USERNAME**
BITBUCKET_PASSWORD=**BITBUCKET APP PASSWORD**
BITBUCKET_DATABOX_TOKEN=**DATABOX PUSH TOKEN WHERE BITBUCKET KPIS WILL BE PUSHED**
```
You can store then in the project directory in the `.env` file for convenience.

Run the following commands in order to install third-party dependencies, compile TypeScript, build Docker image and run it:
``` bash
$ npm install
audited 476 packages in 1.78s

48 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

$ npm run build

> databox-example@1.0.0 build /Users/ajdnik/Documents/Code/databox-example
> npm run build:typescript && npm run build:docker


> databox-example@1.0.0 build:typescript /Users/ajdnik/Documents/Code/databox-example
> tsc --build


> databox-example@1.0.0 build:docker /Users/ajdnik/Documents/Code/databox-example
> docker build -t databox-example .

[+] Building 0.9s (11/11) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 37B
 => [internal] load .dockerignore
 => => transferring context: 2B
 => [internal] load metadata for docker.io/library/node:14-alpine
 => [1/6] FROM docker.io/library/node:14-alpine@sha256:f07ead757c93bc5e9e79978075217851d45a5d8e5c48eaf823e7f12d9bbc1d3c
 => [internal] load build context
 => => transferring context: 1.30kB
 => CACHED [2/6] RUN mkdir -p /var/log/databox/
 => CACHED [3/6] WORKDIR /app
 => CACHED [4/6] COPY package.json /app
 => CACHED [5/6] RUN npm install --only=prod
 => CACHED [6/6] COPY ./dist /app
 => exporting to image
 => => exporting layers
 => => writing image sha256:854aefb73ae6fc52374ad6f87fc16d7701c8525221f0e85316c1bd2fd27f04b9
 => => naming to docker.io/library/databox-example

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them

$ npm start

> databox-example@1.0.0 start /Users/ajdnik/Documents/Code/databox-example
> docker compose up

[+] Running 1/0
 ⠿ Container 9ae3b15a819b_databox  Recreated                                                                                                                                                                                                                                                                                                    0.0s
Attaching to 9ae3b15a819b_databox
9ae3b15a819b_databox  | {"pushId":"1622764800b2331050701b18d1b742","metrics":["919085|repositories|owner","919085|repository_additions|owner","919085|repository_deletions|owner","919085|repository_commits|owner"],"kpiCount":31,"level":"info","message":"KPIs sent to Databox successfully","timestamp":"2021-06-04T08:36:51.945Z","service":"databox-example"}
9ae3b15a819b_databox exited with code 0
```

