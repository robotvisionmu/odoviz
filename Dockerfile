FROM node:14.17.3-alpine3.14

RUN apk update && apk add git yarn

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && yarn install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

RUN mkdir -p /tmp/client
ADD client/package.json /tmp/client/package.json
RUN cd /tmp/client && yarn install
RUN mkdir -p /opt/app/client && cp -a /tmp/client/node_modules /opt/app/client/

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /opt/app
ADD . /opt/app

WORKDIR /opt/app/client
RUN NODE_ENV='production' yarn run build

# value for ARG can be provided during the build
# otherwise the default below will be used
ARG odoviz_port=3001
ARG odoviz_data_dir=/data

# the ENV variables can be replaced when the container is created
ENV ODOVIZ_PORT=$odoviz_port
ENV ODOVIZ_DATA_DIR=$odoviz_data_dir

EXPOSE $odoviz_port

WORKDIR /opt/app
CMD ["yarn", "start"]
