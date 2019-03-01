# RS Feed Proxy
## Proxy for skøytestasjonapi for json data.

## Environment variables
TIMEOUT - connect timeout api (ms)

PORT - Port server is listening on

## run locally dev environment
npm run dev

## Run in docker environment
### Install node modules
docker run -it -w=/home/node/app --user node --rm --volume $PWD:/home/node/app node npm install

### run docker dev mode
docker-compose up

### Arbeidsflyt: Git Flow - develop

```bash
# init git flow
git flow init

# start a new feature
git flow feature start <my-new-feature>

# finish feature
git flow feature finish <my-new-feature>
```
### Arbeidsflyt: Git Flow - publish
```bash
# start a new publish
git flow publish start  

# bump version number in package.json

# publish new package
git flow publish finish
```
