# node-red-contrib-selenium-webdriver
The Node-RED selenium webdriver nodes which allow you to create selenium test flow by visual IDE tool

[![npm version](https://badge.fury.io/js/node-red-contrib-selenium-webdriver.svg)](https://badge.fury.io/js/node-red-contrib-selenium-webdriver)

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

**Example flow**

```javascript
[{"id":"8d37d15c.e4bca","type":"selenium-server","z":"9bf7a909.2b7ce8","remoteurl":"http://localhost:4444/wd/hub","browser":"chrome"},{"id":"9eb839a4.576da8","type":"subflow","name":"TestCase-01","info":"","in":[{"x":40,"y":40,"wires":[{"id":"eaa1dc4e.b80e4"}]}],"out":[{"x":820,"y":140,"wires":[{"id":"7784e451.3db55c","port":0}]}]},{"id":"eaa1dc4e.b80e4","type":"open-web","z":"9eb839a4.576da8","name":"","weburl":"https://www.google.com/","width":"480","height":"640","webtitle":"Google","timeout":"3000","maximized":false,"server":"8d37d15c.e4bca","x":150,"y":40,"wires":[["a510c39e.b7d1e"]]},{"id":"7784e451.3db55c","type":"close-web","z":"9eb839a4.576da8","name":"","x":730,"y":140,"wires":[[]]},{"id":"eb9dc5b7.daede8","type":"delay","z":"9eb839a4.576da8","name":"","pauseType":"delay","timeout":"1","timeoutUnits":"seconds","rate":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"x":720,"y":40,"wires":[["7784e451.3db55c"]]},{"id":"a510c39e.b7d1e","type":"find-object","z":"9eb839a4.576da8","name":"","selector":"name","target":"btnK","timeout":"1000","x":140,"y":140,"wires":[["97132bb7.d0c7f8"]]},{"id":"97132bb7.d0c7f8","type":"get-value","z":"9eb839a4.576da8","name":"CheckButton","expected":"Tìm với Google","selector":"name","target":"btnK","timeout":"1000","x":350,"y":40,"wires":[["a857b117.96698"]]},{"id":"a857b117.96698","type":"send-keys","z":"9eb839a4.576da8","name":"","text":"cuongdd1","selector":"xpath","target":"//*[@id=\"lst-ib\"]","timeout":"1000","x":350,"y":140,"wires":[["2104be19.890932"]]},{"id":"2104be19.890932","type":"click-on","z":"9eb839a4.576da8","name":"","selector":"name","target":"btnG","timeout":"10000","x":540,"y":40,"wires":[["d34a20c2.032b3"]]},{"id":"d34a20c2.032b3","type":"run-script","z":"9eb839a4.576da8","name":"","func":"\nreturn arguments[0].innerHTML;","selector":"name","target":"","timeout":"10000","x":550,"y":140,"wires":[["eb9dc5b7.daede8"]]},{"id":"1822e678.218c9a","type":"function","z":"9bf7a909.2b7ce8","name":"ErrorHandle","func":"if (msg.error) {\n    msg.statusCode = 400;\n    msg.payload = msg.error;\n}\nreturn msg;","outputs":1,"noerr":0,"x":490,"y":180,"wires":[["25be5899.42e508"]]},{"id":"3a40c2f8.8cb59e","type":"inject","z":"9bf7a909.2b7ce8","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":140,"y":180,"wires":[["75b10a63.4f1274"]]},{"id":"25be5899.42e508","type":"debug","z":"9bf7a909.2b7ce8","name":"","active":true,"console":"false","complete":"false","x":670,"y":180,"wires":[]},{"id":"75b10a63.4f1274","type":"subflow:9eb839a4.576da8","z":"9bf7a909.2b7ce8","x":310,"y":180,"wires":[["1822e678.218c9a"]]}]
```
**Demo Screenshot**

![Demo](https://raw.githubusercontent.com/cuongquay/node-red-contrib-selenium-webdriver/master/images/test-spec.png)
![Demo](https://raw.githubusercontent.com/cuongquay/node-red-contrib-selenium-webdriver/master/images/test-scen.png)


