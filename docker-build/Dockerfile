# Set node base image
FROM node:4

MAINTAINER cuong3ihut@gmail.com

RUN apt-get update

RUN npm install -g --unsafe-perm node-red
RUN cd /usr/local/lib/node_modules/node-red/ && npm install node-red-contrib-selenium-webdriver

RUN apt-get install -y \
	xvfb wget openjdk-7-jre \
	google-chrome-stable

ENV DISPLAY :1.0

RUN npm install -g webdriver-manager
RUN webdriver-manager update
    
# expose port
EXPOSE 1880

# Run app using nodemon
CMD Xvfb :1 -screen 0 1280x1024x24+32 &
CMD ["webdriver-manager", "start"]
CMD ["node-red"]
