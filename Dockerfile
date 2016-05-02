# Set node base image
FROM node:5.11.0

MAINTAINER cuong3ihut@gmail.com

RUN npm install -g --unsafe-perm node-red
RUN npm install -g node-red-contrib-selenium-webdriver
RUN npm install -g webdriver-manager
RUN webdriver-manager update

# expose port
EXPOSE 1880

# Run app using nodemon
CMD ["webdriver-manager", "start"]
CMD ["node-red"]