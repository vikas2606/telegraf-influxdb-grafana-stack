# select base image to start with
FROM node:14-alpine3.12

# Create app directory
# this is the location where you will be inside the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# copying packages first helps take advantage of docker layers
COPY package*.json ./

RUN npm install
RUN npm install ws

# Bundle app source
COPY . .

# Make this port accessible from outside the container
EXPOSE 8080
EXPOSE 9003

ENV PORT1=8080
ENV PORT2=9003

# Command to run when the container is ready
CMD [ "npm", "run", "start"]
CMD node ./appmanager.js & node ./ueserver.js
