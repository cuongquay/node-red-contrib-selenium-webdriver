# Set node base image
FROM node:4

MAINTAINER cuong3ihut@gmail.com

RUN apt-get update

RUN npm install -g --unsafe-perm node-red
RUN cd /usr/local/lib/node_modules/node-red/ && npm install node-red-contrib-selenium-webdriver

RUN apt-get install -y \
	xvfb wget openjdk-7-jre \
	wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg --unpack google-chrome-stable_current_amd64.deb && \
    apt-get install -f -y && \
    apt-get clean && \
    rm google-chrome-stable_current_amd64.deb

RUN npm install -g webdriver-manager
RUN webdriver-manager update
    
# expose port
EXPOSE 1880

# Run app using nodemon
CMD ["webdriver-manager", "start"]
CMD ["node-red"]
