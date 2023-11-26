# pull base image
FROM node:16.20.2-buster

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# default to port 19006 for node, and 19001 and 19002 (tests) for debug
ARG PORT=19006
ENV PORT $PORT
EXPOSE $PORT 19001 19002

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i -g npm@9.6.5 expo-cli@6.2.1

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
WORKDIR /opt/react_native_app
RUN chown -R node:node /opt/react_native_app
ENV PATH /opt/react_native_app/.bin:$PATH
USER root
COPY ./package.json ./package-lock.json ./
RUN npm install
USER node

# copy in our source code last, as it changes the most
WORKDIR /opt/react_native_app/app
# for development, we bind mount volumes; comment out for production
#COPY ./ .

ENTRYPOINT ["npm", "run"]
CMD ["web"]
