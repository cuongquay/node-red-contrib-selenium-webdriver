# docker-node-red-selenium-webdriver
The Node-RED selenium webdriver Docker image which allow to create selenium test flow by visual IDE Node-RED tool.

```javascript
$ docker run -d -P --name selenium-hub selenium/hub
```

```javascript
$ docker run -d --link selenium-hub:hub selenium/node-chrome --name node-chrome
```

```javascript
$ docker run -d --link selenium-hub:hub selenium/node-firefox --name node-firefox
```

```javascript
$ docker run -d --link selenium-hub:hub cuongquay/docker-node-red-selenium-webdriver --name node-red-selenium
```