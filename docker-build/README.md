# docker-node-red-selenium-webdriver
The Node-RED selenium webdriver Docker image which allow to create selenium test flow by visual IDE Node-RED tool.

$ docker run -d -P --name selenium-hub selenium/hub
$ docker run -d --link selenium-hub:hub selenium/node-chrome
$ docker run -d --link selenium-hub:hub selenium/node-firefox
$ docker run -d --link selenium-hub:hub cuongquay/node-red-selenium-webdriver