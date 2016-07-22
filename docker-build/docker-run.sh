sh docker run -d -P --name selenium-hub selenium/hub
sh docker run -d --name node-chrome --link selenium-hub:hub selenium/node-chrome
sh docker run -d --name node-firefox --link selenium-hub:hub selenium/node-firefox
sh docker run -d -P --name node-red --link selenium-hub:hub cuongquay/node-red-ui-automation