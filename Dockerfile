FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# The PORT variable is used by the server
ENV PORT=10000

# Expose the server port
EXPOSE 10000

# Default command is just to start the server
CMD [ "npm", "start" ]
