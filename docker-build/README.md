# node-red-ui-automation
The automation framework which allows to create UI test flow by visual IDE tool for web application

```javascript
$ docker run -d -P --name selenium-hub selenium/hub
```

```javascript
$ docker run -d --name node-chrome --link selenium-hub:hub selenium/node-chrome
```

```javascript
$ docker run -d --name node-firefox --link selenium-hub:hub selenium/node-firefox
```

```javascript
$ docker run -d -P --name node-red --link selenium-hub:hub cuongquay/node-red-ui-automation
```