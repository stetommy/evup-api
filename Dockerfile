# Use an official Node.js runtime as a parent image
FROM node:18.18.0

# Set the working directory in the container
WORKDIR /usr/src

# Copy package.json and package-lock.json to the working directory
# Copy dist folder is not needed to copy packege.json
COPY package*.json ./

#RUN apt-get update -y && apt-get upgrade -y
# Update npm
#RUN npm install -g npm@9.6.7

# Install the application dependencies
# Copy dist folder is not needed to install
RUN yarn install

# Copy the application code to the container
COPY ./dist/src .
# Copy .env file
COPY ./.env /usr/src
# Copy statics html file
COPY ./src/app/statics/emails /usr/src/app/statics/emails
COPY ./src/app/statics/pages /usr/src/app/statics/pages

# Expose the port your app runs on
ENV PORT=8000
EXPOSE $PORT

# Define the command to run your application
CMD ["node", "index.js"]

# HOW TO RUN DOCKERFILE

# set [const prodEnvPath = './.env';] in /root/index.ts file
# yarn build
# docker build -t lvdere-api:2.4.0 .
# docker tag lvdere-api:2.4.0 stetommy/lvdere-api:2.4.0
# docker push stetommy/lvdere-api:2.4.0

# REMOVE PUSHED
# docker rmi <repository_url>/<image_name>:<tag>
