# node-red-contrib-selenium-webdriver
The automation framework which allows to create UI test flow by visual IDE tool for web application

[![npm version](https://badge.fury.io/js/node-red-contrib-selenium-webdriver.svg)](https://badge.fury.io/js/node-red-contrib-selenium-webdriver)
[![npm](https://img.shields.io/npm/dm/node-red-contrib-selenium-webdriver.svg?maxAge=2592000)]()
[![Docker Pulls](https://img.shields.io/docker/pulls/cuongquay/node-red-ui-automation.svg?maxAge=2592000)]()

Local Development Environment
=============================

**Install Selenium Server**

npm install -g webdriver-manager

**Setting up a Selenium Server**

Prior to starting the selenium server, download the selenium server jar and driver binaries. By default it will download the selenium server jar and chromedriver binary.

webdriver-manager update

**Starting the Selenium Server**

By default, the selenium server will run on http://localhost:4444/wd/hub.

webdriver-manager start

**Install Node-RED and nodes**

npm install -g --unsafe-perm node-red

cd ~/.node-red && npm install node-red-contrib-selenium-webdriver

Automated UI Test /w Docker Environment
==================================

1. Install Docker Tool Box from https://www.docker.com/products/docker-toolbox

2. Create **docker-compose.xml** to your local folder

   ```
   version: '2'
   services:
     node-red:
       image: cuongquay/node-red-ui-automation
       ports:
        - 1880:1880
     selenium-hub:
       image: selenium/hub
       ports:
        - 4444:4444
     node-chrome:
       image: selenium/node-chrome
       depends_on:
        - selenium-hub
       environment:
        - HUB_PORT_4444_TCP_ADDR=selenium-hub
```

3. Run with **docker-compose up** command

   ```
   eval "$(docker-machine env default)"
   docker-compose up -d --force-recreate
   ```

4. Launch Kitematic, choose **node-red-ui-automation** container and look for the Access URL from HOME tab. 

5. Browsing the application by http://ACCESS_URL:1880/ (usually it's http://192.168.99.100:1880/)


**Example flow**

```javascript
[{"id":"fb07c885.3874c8","type":"function","z":"a3fe32e2.a1b96","name":"ErrorHandle","func":"if (msg.error) {\n    msg.statusCode = 400;\n    msg.payload = msg.error;\n}\nreturn msg;","outputs":1,"noerr":0,"x":830,"y":140,"wires":[["2f3d9e67.eb9d52"]]},{"id":"e1d1fc61.92093","type":"inject","z":"a3fe32e2.a1b96","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":100,"y":60,"wires":[["b334ff56.fb323"]]},{"id":"2f3d9e67.eb9d52","type":"debug","z":"a3fe32e2.a1b96","name":"","active":true,"console":"false","complete":"false","x":990,"y":140,"wires":[]},{"id":"b334ff56.fb323","type":"open-web","z":"a3fe32e2.a1b96","name":"","weburl":"https://www.google.com/","width":"480","height":"640","webtitle":"Google","timeout":"3000","maximized":false,"server":"d404327f.b8517","x":270,"y":60,"wires":[["aa60f00c.b5221"]]},{"id":"473291bb.ff669","type":"close-web","z":"a3fe32e2.a1b96","name":"","waitfor":"1500","x":670,"y":140,"wires":[["fb07c885.3874c8"]]},{"id":"ae932825.695ad8","type":"delay","z":"a3fe32e2.a1b96","name":"","pauseType":"delay","timeout":"1","timeoutUnits":"seconds","rate":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"x":520,"y":140,"wires":[["473291bb.ff669"]]},{"id":"aa60f00c.b5221","type":"find-object","z":"a3fe32e2.a1b96","name":"","selector":"name","target":"btnK","timeout":"1000","waitfor":"1500","x":460,"y":60,"wires":[["bc933182.599ed"]]},{"id":"bc933182.599ed","type":"get-value","z":"a3fe32e2.a1b96","name":"CheckButton","expected":"Tìm với Google","selector":"name","target":"btnK","timeout":"1000","waitfor":"1500","savetofile":false,"x":650,"y":60,"wires":[["62aa9f69.b07a8"]]},{"id":"62aa9f69.b07a8","type":"send-keys","z":"a3fe32e2.a1b96","name":"","text":"cuongdd1","selector":"xpath","target":"//*[@id=\"lst-ib\"]","timeout":"1000","waitfor":"1500","clearval":false,"x":830,"y":60,"wires":[["b72c1331.d769d"]]},{"id":"1fb4e2ff.3a2a2d","type":"click-on","z":"a3fe32e2.a1b96","name":"","selector":"name","target":"btnG","timeout":"10000","waitfor":"1500","clickon":false,"x":180,"y":140,"wires":[["1d0e4aca.6e3825"]]},{"id":"1d0e4aca.6e3825","type":"run-script","z":"a3fe32e2.a1b96","name":"","func":"\nreturn arguments[0].innerHTML;","selector":"name","target":"","timeout":"10000","waitfor":"1500","x":350,"y":140,"wires":[["ae932825.695ad8"]]},{"id":"7689f307.deb30c","type":"link in","z":"a3fe32e2.a1b96","name":"","links":["b72c1331.d769d"],"x":35,"y":140,"wires":[["1fb4e2ff.3a2a2d"]]},{"id":"b72c1331.d769d","type":"link out","z":"a3fe32e2.a1b96","name":"","links":["7689f307.deb30c"],"x":955,"y":60,"wires":[]},{"id":"d404327f.b8517","type":"selenium-server","z":"a3fe32e2.a1b96","remoteurl":"http://localhost:4444/wd/hub","browser":"chrome"}]
```
**Demo Screenshot**

![Demo](https://raw.githubusercontent.com/cuongquay/node-red-contrib-selenium-webdriver/master/images/test-spec.png)
![Demo](https://raw.githubusercontent.com/cuongquay/node-red-contrib-selenium-webdriver/master/images/test-scen.png)


