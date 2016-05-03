# Set node base image
FROM node:4

MAINTAINER cuong3ihut@gmail.com

RUN apt-get update

RUN npm install -g --unsafe-perm node-red
RUN cd /usr/local/lib/node_modules/node-red/ && npm install node-red-contrib-selenium-webdriver

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list

RUN apt-get update -y && apt-get install -y xvfb openjdk-7-jre google-chrome-stable

ENV DISPLAY :1.0

RUN npm install -g webdriver-manager
RUN webdriver-manager update
RUN webdriver-manager start
RUN Xvfb :1 -screen 0 1280x1024x24+32 &
    
# expose port
EXPOSE 1880

# Run app using nodemon
CMD ["node-red"]
