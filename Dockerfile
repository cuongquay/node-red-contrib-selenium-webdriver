# Set node base image
FROM node:5.11.0

MAINTAINER cuong3ihut@gmail.com

RUN npm install -g --unsafe-perm node-red
RUN npm install -g webdriver-manager
RUN webdriver-manager update
RUN cd ~/.node-red/nodes/ && npm install node-red-contrib-selenium-webdriver

# expose port
EXPOSE 1880

# Run app using nodemon
CMD ["webdriver-manager", "start"]
CMD ["node-red"]