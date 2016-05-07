# node-red-contrib-selenium-webdriver
The Node-RED selenium webdriver node which allow to create selenium test flow by visual IDE tool

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
[{"id":"d4f67063.581c2","type":"selenium-server","z":"ef79898e.2bdbb8","remoteurl":"http://localhost:4444/wd/hub","browser":"chrome"},{"id":"deb0bcc4.f2399","type":"inject","z":"ef79898e.2bdbb8","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":177,"y":109,"wires":[["b6f77d7e.100c6"]]},{"id":"b6f77d7e.100c6","type":"open-web","z":"ef79898e.2bdbb8","name":"","weburl":"https://www.google.com/","webtitle":"Google","webtimeout":"3000","server":"d4f67063.581c2","x":180,"y":224,"wires":[["7793c131.35515"]]},{"id":"7d2f1c2b.532854","type":"close-web","z":"ef79898e.2bdbb8","name":"","x":675,"y":208,"wires":[["7aa6be72.c2427"]]},{"id":"779e68.fadad198","type":"delay","z":"ef79898e.2bdbb8","name":"","pauseType":"delay","timeout":"3","timeoutUnits":"seconds","rate":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"x":679,"y":293,"wires":[["7d2f1c2b.532854"]]},{"id":"7793c131.35515","type":"find-object","z":"ef79898e.2bdbb8","name":"","selector":"name","text":"btnK","x":197,"y":401,"wires":[["4a540ada.673654"]]},{"id":"4a540ada.673654","type":"get-value","z":"ef79898e.2bdbb8","name":"","expected":"Google Search1","x":312,"y":324,"wires":[["6870873b.5511b8","a9fc3003.39cdc"]]},{"id":"6870873b.5511b8","type":"find-object","z":"ef79898e.2bdbb8","name":"","selector":"name","text":"q","x":391,"y":148,"wires":[["8da49b19.99a9b8"]]},{"id":"8da49b19.99a9b8","type":"send-keys","z":"ef79898e.2bdbb8","name":"","text":"cuongdd1","x":429,"y":211,"wires":[["ca1c4a72.d680c8"]]},{"id":"ca1c4a72.d680c8","type":"find-object","z":"ef79898e.2bdbb8","name":"","selector":"name","text":"btnG","x":490,"y":279,"wires":[["a9e170ec.c05af"]]},{"id":"a9e170ec.c05af","type":"click-on","z":"ef79898e.2bdbb8","name":"","x":512,"y":359,"wires":[["8721fdfd.7dd18"]]},{"id":"7aa6be72.c2427","type":"debug","z":"ef79898e.2bdbb8","name":"","active":true,"console":"false","complete":"false","x":665,"y":120,"wires":[]},{"id":"8721fdfd.7dd18","type":"run-script","z":"ef79898e.2bdbb8","name":"","func":"\nreturn arguments[0].innerHTML;","x":579,"y":415,"wires":[["779e68.fadad198"]]},{"id":"a9fc3003.39cdc","type":"debug","z":"ef79898e.2bdbb8","name":"","active":true,"console":"false","complete":"errors","x":370.5,"y":430,"wires":[]}]
```
**Demo Screenshot**

![Demo](https://raw.githubusercontent.com/cuongquay/node-red-contrib-selenium-webdriver/master/images/demo.png)

*For your contribution, please visit:*

https://github.com/cuongquay/node-red-contrib-selenium-webdriver

