# pull base image
FROM node:16.20.2-buster
# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ENV NODE_ENV $NODE_ENV

# default to port 19006 for node, and 19001 and 19002 (tests) for debug
ARG PORT=19006
ENV PORT $PORT
EXPOSE $PORT 19001 19002

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH

RUN npm i --unsafe-perm -g npm@9.6.5 expo-cli@6.2.1

WORKDIR /usr/src/react_native_app
COPY ./package.json ./package-lock.json ./
RUN chown -R node:node /usr/src/react_native_app
WORKDIR /usr/src/react_native_app/app
COPY ./ .
WORKDIR /usr/src/react_native_app
USER node
ENV PATH /usr/src/react_native_app/.bin:$PATH
RUN npm install
USER root
RUN chown -R node:node /usr/src/react_native_app/app/.expo
USER node
WORKDIR /usr/src/react_native_app/app

ENTRYPOINT ["npm", "run"]
CMD ["web"]

