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

