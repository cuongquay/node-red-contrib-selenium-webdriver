# Set node base image
FROM node:4

MAINTAINER cuong3ihut@gmail.com

RUN apt-get update

RUN npm install -g --unsafe-perm node-red
RUN cd /usr/local/lib/node_modules/node-red/ && npm install node-red-contrib-selenium-webdriver
RUN apt-get update -y && apt-get install -y supervisor

RUN mkdir -p /var/log/supervisor

# Add main configuration file
ADD supervisord.conf /etc/supervisor/supervisor.conf

# Add service defintions for Xvfb, Selenium and Protractor runner
ADD supervisord/*.conf /etc/supervisor/conf.d/

ADD settings.js /root/.node-red/settings.js
ADD flows.json /root/.node-red/flows.json

# expose port
EXPOSE 1880

# Container's entry point, executing supervisord in the foreground
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisor.conf"]
