FROM mhart/alpine-node
MAINTAINER DUONG Dinh Cuong <cuong3ihut@gmail.com>

RUN apt-get update -y
RUN apt-get install -y wget imagemagick
RUN npm install -g --unsafe-perm node-red
RUN cd /usr/local/lib/node_modules/node-red/ && npm install node-red-contrib-selenium-webdriver

ADD settings.js /root/.node-red/settings.js
ADD flows.json /root/.node-red/flows.json

# expose port
EXPOSE 1880

# Container's entry point, executing supervisord in the foreground
CMD ["/usr/bin/node-red"]
