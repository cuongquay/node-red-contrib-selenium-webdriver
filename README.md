# node-red-contrib-selenium-webdriver
The Node-RED selenium webdriver nodes which allow you to create selenium test flow by visual IDE tool

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
[{"id":"d4f67063.581c2","type":"selenium-server","z":"ef79898e.2bdbb8","remoteurl":"http://localhost:4444/wd/hub","browser":"chrome"},{"id":"e933d4ec.0a6bf8","type":"subflow","name":"TestCase-01","info":"","in":[{"x":50,"y":30,"wires":[{"id":"e52ce15f.f476a"}]}],"out":[{"x":752,"y":193,"wires":[{"id":"616fe464.e9250c","port":0}]}]},{"id":"e52ce15f.f476a","type":"open-web","z":"e933d4ec.0a6bf8","name":"","weburl":"https://www.google.com/","width":"480","height":"640","webtitle":"Google","webtimeout":"3000","maximized":true,"server":"d4f67063.581c2","x":160,"y":187,"wires":[["14ba83b0.a77a2c"]]},{"id":"616fe464.e9250c","type":"close-web","z":"e933d4ec.0a6bf8","name":"","x":655,"y":171,"wires":[[]]},{"id":"4924301d.963c5","type":"delay","z":"e933d4ec.0a6bf8","name":"","pauseType":"delay","timeout":"3","timeoutUnits":"seconds","rate":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"x":659,"y":256,"wires":[["616fe464.e9250c"]]},{"id":"14ba83b0.a77a2c","type":"find-object","z":"e933d4ec.0a6bf8","name":"","selector":"name","text":"btnK","x":177,"y":364,"wires":[["f47da5a6.582a68"]]},{"id":"f47da5a6.582a68","type":"get-value","z":"e933d4ec.0a6bf8","name":"CheckButton","expected":"Google Search - X","x":302,"y":287,"wires":[["f098de24.4c9bb","5e6c101e.73768"]]},{"id":"f098de24.4c9bb","type":"find-object","z":"e933d4ec.0a6bf8","name":"","selector":"name","text":"q","x":371,"y":111,"wires":[["2db66375.01407c"]]},{"id":"2db66375.01407c","type":"send-keys","z":"e933d4ec.0a6bf8","name":"","text":"cuongdd1","x":409,"y":174,"wires":[["4bbbe027.b7f09"]]},{"id":"4bbbe027.b7f09","type":"find-object","z":"e933d4ec.0a6bf8","name":"","selector":"name","text":"btnG","x":470,"y":242,"wires":[["d3b4441c.a7cfa8"]]},{"id":"d3b4441c.a7cfa8","type":"click-on","z":"e933d4ec.0a6bf8","name":"","x":492,"y":322,"wires":[["12c0ac5a.2e07f4"]]},{"id":"12c0ac5a.2e07f4","type":"run-script","z":"e933d4ec.0a6bf8","name":"","func":"\nreturn arguments[0].innerHTML;","x":559,"y":378,"wires":[["4924301d.963c5"]]},{"id":"5e6c101e.73768","type":"debug","z":"e933d4ec.0a6bf8","name":"","active":true,"console":"false","complete":"errors","x":350.5,"y":393,"wires":[]},{"id":"63dfa7bd.79d568","type":"subflow:e933d4ec.0a6bf8","z":"ef79898e.2bdbb8","x":317,"y":88,"wires":[["23659ac1.d0aa26"]]},{"id":"4acd22ba.55f5fc","type":"http response","z":"ef79898e.2bdbb8","name":"","x":637,"y":88,"wires":[]},{"id":"23659ac1.d0aa26","type":"function","z":"ef79898e.2bdbb8","name":"ErrorHandle","func":"if (msg.errors) {\n    msg.statusCode = 400;\n    msg.payload = msg.errors;\n}\nreturn msg;","outputs":1,"noerr":0,"x":497,"y":88,"wires":[["4acd22ba.55f5fc"]]},{"id":"3c6c9972.4c8e26","type":"http in","z":"ef79898e.2bdbb8","name":"","url":"/api/spec/1","method":"get","swaggerDoc":"","x":123,"y":88,"wires":[["63dfa7bd.79d568"]]}]
```
**Demo Screenshot**

![Demo](https://raw.githubusercontent.com/cuongquay/node-red-contrib-selenium-webdriver/master/images/test-spec.png)
![Demo](https://raw.githubusercontent.com/cuongquay/node-red-contrib-selenium-webdriver/master/images/test-scen.png)


