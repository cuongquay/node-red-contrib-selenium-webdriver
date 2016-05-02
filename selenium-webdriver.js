/**
 * Author: DUONG Dinh Cuong, cuong3ihut@gmail.com.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
	"use strict";
	var q = require('q');
	var util = require("util");
	var isReachable = require('is-reachable');
	var webdriver = require("selenium-webdriver"),
	    By = webdriver.By,
	    until = webdriver.until;
	var isUtf8 = require('is-utf8');

	function SeleniumServerSetup(n) {
		RED.nodes.createNode(this, n);

		this.connected = false;
		this.connecting = false;
		this.usecount = 0;
		// Config node state
		this.remoteurl = n.remoteurl;
		this.browser = n.browser;

		var node = this;
		this.register = function() {
			node.usecount += 1;
		};

		this.deregister = function() {
			node.usecount -= 1;
			if (node.usecount == 0) {
			}
		};

		this.connect = function() {
			var deferred = q.defer();
			if (!node.connected && !node.connecting) {
				node.connecting = true;
				var url = require('url').parse(node.remoteurl);
				isReachable(url.host, function(error, reachable) {
					if (!error && reachable) {
						node.driver = new webdriver.Builder().forBrowser(node.browser).usingServer(node.remoteurl);
						node.log(RED._("connected", {
							server : (node.browser ? node.browser + "@" : "") + node.remoteurl
						}));
						node.connected = true;
						node.emit('connected');
						deferred.resolve(node.driver);
					} else {
						node.connecting = false;
						node.connected = false;
						deferred.reject({
							Error : "Invalid configuration."
						});
					}
				});
			} else {
				if (node.driver)
					deferred.resolve(node.driver);
			}
			return deferred.promise;
		};

		this.on('close', function(closecomplete) {
			if (this.connected) {
				this.on('disconnected', function() {
					closecomplete();
				});
				node.driver.quit();
			} else {
				closecomplete();
			}
		});
	}


	RED.nodes.registerType("selenium-server", SeleniumServerSetup);

	function SeleniumOpenURLNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.server = n.server;
		this.weburl = n.weburl;
		this.webtitle = n.webtitle;
		this.webtimeout = n.webtimeout;
		this.serverObj = RED.nodes.getNode(this.server);
		var node = this;
		if (node.serverObj) {
			node.serverObj.register();
			node.serverObj.connect().then(function(webdriver) {
				node.status({
					fill : "green",
					shape : "ring",
					text : "common.status.connected"
				});
			}, function(error) {
				node.status({
					fill : "red",
					shape : "ring",
					text : "common.status.disconnected"
				});
			});
		} else {
			node.error(RED._("common.status.not-connected"));
		}
		this.on("input", function(msg) {
			node.serverObj.connect().then(function(webdriver) {
				var driver = webdriver.build();
				driver.get(node.weburl);
				if (node.webtitle) {
					driver.wait(until.titleIs(node.webtitle), parseInt(node.webtimeout)).catch(function(errorback) {
						node.status({
							fill : "red",
							shape : "ring",
							text : "common.status.expected-failure"
						});
					}).then(function() {
						driver.getTitle().then(function(title) {
							node.send({
								driver : driver,
								payload : title
							});
						});
					});
				}
				node.status({
					fill : "green",
					shape : "ring",
					text : "common.status.connected"
				});
			}, function(error) {
				node.status({
					fill : "red",
					shape : "ring",
					text : "common.status.disconnected"
				});
			});
		});
		this.on('close', function() {
			if (node.serverConn) {
				node.serverObj.deregister();
			}
		});
	}


	RED.nodes.registerType("open-web", SeleniumOpenURLNode);

	function SeleniumCloseBrowserNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		var node = this;
		this.on("input", function(msg) {
			msg.driver.quit();
			node.send(msg);
		});
	}


	RED.nodes.registerType("close-web", SeleniumCloseBrowserNode);

	function SeleniumFindElementNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.selector = n.selector;
		this.value = n.text;
		var node = this;
		this.on("input", function(msg) {
			msg.element = msg.driver.findElement(By[node.selector](node.value));
			node.send(msg);
		});
	}

	RED.nodes.registerType("find-object", SeleniumFindElementNode);
	
	function SeleniumSendKeysNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.keys = n.text;
		var node = this;
		this.on("input", function(msg) {
			msg.element.sendKeys(node.keys).then(function() {
				node.send(msg);	
			});
		});
	}

	RED.nodes.registerType("send-keys", SeleniumSendKeysNode);

	function SeleniumClickOnNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		var node = this;
		this.on("input", function(msg) {
			msg.element.click().then(function() {
				node.send(msg);	
			});
		});
	}


	RED.nodes.registerType("click-on", SeleniumClickOnNode);
	
	function SeleniumSetValueNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.value = n.text;
		var node = this;
		this.on("input", function(msg) {
			msg.driver.executeScript("arguments[0].setAttribute('value', '" + node.value + "')", msg.element).then(function() {
				node.send(msg);	
			});
		});
	}

	RED.nodes.registerType("set-value", SeleniumSetValueNode);

	function SeleniumGetValueNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		var node = this;
		this.on("input", function(msg) {
			msg.element.getAttribute("value").then(function(text) {
				msg.payload = text;
				node.send(msg);	
			});
		});
	}

	RED.nodes.registerType("get-value", SeleniumGetValueNode);
	
	function SeleniumGetTextNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		var node = this;
		this.on("input", function(msg) {
			msg.element.getText().then(function(text) {
				msg.payload = text;
				node.send(msg);	
			});
			
		});
	}

	RED.nodes.registerType("get-text", SeleniumGetTextNode);
	
	function SeleniumTakeScreenshotNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		var node = this;
		this.on("input", function(msg) {
			msg.element.takeScreenshot().then(function() {
				node.send(msg);	
			});
		});
	}
	
	RED.nodes.registerType("screenshot", SeleniumTakeScreenshotNode);
	
	function SeleniumNavToNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.url = n.url;
		var node = this;
		this.on("input", function(msg) {
			msg.driver.navigate().to(node.url).then(function() {
				node.send(msg);	
			});
		});
	}
	
	RED.nodes.registerType("nav-to", SeleniumNavToNode);
	
	function SeleniumNavBackNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		var node = this;
		this.on("input", function(msg) {
			msg.driver.navigate().back().then(function() {
				node.send(msg);	
			});
		});
	}
	
	RED.nodes.registerType("nav-back", SeleniumNavBackNode);
	
	function SeleniumNavForwardNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		var node = this;
		this.on("input", function(msg) {
			msg.driver.navigate().forward().then(function() {
				node.send(msg);	
			});
		});
	}
	
	RED.nodes.registerType("nav-forward", SeleniumNavForwardNode);
	
	function SeleniumNavRefreshNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		var node = this;
		this.on("input", function(msg) {
			msg.driver.navigate().refresh().then(function() {
				node.send(msg);	
			});
		});
	}
	
	RED.nodes.registerType("nav-refresh", SeleniumNavRefreshNode);
	
	function SeleniumRunScriptNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.func = n.func;
		var node = this;
		this.on("input", function(msg) {
			msg.driver.executeScript(node.func, msg.element).then(function(results) {
				msg.payload = results;
				node.send(msg);	
			});
		});
	}
	
	RED.nodes.registerType("run-script", SeleniumRunScriptNode);
};
