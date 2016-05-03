# docker-node-red-selenium-webdriver
The Node-RED selenium webdriver Docker image which allow to create selenium test flow by visual IDE Node-RED tool.

docker pull cuongquay/docker-node-red-selenium-webdriver

Open your web browser and navigate to http://{docker-weburl}:1880

Import this flow into Node-RED editor and DEPLOY to experiment yourself 

**Example flow**

```javascript
[{"id":"e7a9ce0.e6f693","type":"selenium-server","z":"4db3238f.fca37c","remoteurl":"http://localhost:4444/wd/hub","browser":"chrome"},{"id":"a16a7c24.d776a","type":"inject","z":"4db3238f.fca37c","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":160,"y":53,"wires":[["80eeb1a1.f02ae"]]},{"id":"80eeb1a1.f02ae","type":"open-web","z":"4db3238f.fca37c","name":"","weburl":"https://www.google.com/","webtitle":"Google","webtimeout":"3000","server":"e7a9ce0.e6f693","x":163,"y":168,"wires":[["632a81c7.729ac"]]},{"id":"aace9a31.01c908","type":"close-web","z":"4db3238f.fca37c","name":"","x":658,"y":152,"wires":[["857abde6.c1aca"]]},{"id":"7f649520.1413fc","type":"delay","z":"4db3238f.fca37c","name":"","pauseType":"delay","timeout":"3","timeoutUnits":"seconds","rate":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"x":662,"y":237,"wires":[["aace9a31.01c908"]]},{"id":"632a81c7.729ac","type":"find-object","z":"4db3238f.fca37c","name":"","selector":"name","text":"btnK","x":180,"y":345,"wires":[["b194e24a.bec94"]]},{"id":"b194e24a.bec94","type":"get-value","z":"4db3238f.fca37c","name":"","x":295,"y":268,"wires":[["92fcddff.3dedf"]]},{"id":"92fcddff.3dedf","type":"find-object","z":"4db3238f.fca37c","name":"","selector":"name","text":"q","x":374,"y":92,"wires":[["f44d45a0.6cf408"]]},{"id":"f44d45a0.6cf408","type":"send-keys","z":"4db3238f.fca37c","name":"","text":"cuongdd1","x":412,"y":155,"wires":[["911de2ad.d1fcb"]]},{"id":"911de2ad.d1fcb","type":"find-object","z":"4db3238f.fca37c","name":"","selector":"name","text":"btnG","x":473,"y":223,"wires":[["83dbadeb.e8e5b"]]},{"id":"83dbadeb.e8e5b","type":"click-on","z":"4db3238f.fca37c","name":"","x":495,"y":303,"wires":[["52440fe.32b24f"]]},{"id":"857abde6.c1aca","type":"debug","z":"4db3238f.fca37c","name":"","active":true,"console":"false","complete":"false","x":648,"y":64,"wires":[]},{"id":"52440fe.32b24f","type":"run-script","z":"4db3238f.fca37c","name":"","func":"\nreturn arguments[0].innerHTML;","x":562,"y":359,"wires":[["7f649520.1413fc"]]}]
```
**Demo Screenshot**

![Demo](https://raw.githubusercontent.com/cuongquay/node-red-contrib-selenium-webdriver/master/images/demo.png)

*For your contribution, please visit:*

https://github.com/cuongquay/node-red-contrib-selenium-webdriver

