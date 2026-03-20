FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Default PORT if not provided
ENV PORT=4000
# Expose the port (informative)
EXPOSE 4000

# Default command is just to start the server
CMD [ "npm", "start" ]
