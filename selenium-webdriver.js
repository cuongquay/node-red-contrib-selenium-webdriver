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
	var fs = require("fs-extra");
	var easyimg = require("easyimage");
	var isReachable = require('is-reachable');
	var webdriver = require("selenium-webdriver"),
	    By = webdriver.By,
	    until = webdriver.until;
	var isUtf8 = require('is-utf8');
	var ___msgs = {};

	function saveToFile(node, msg) {
		node.filename = msg.filename || node.filename;
		var data = msg.payload;
		if (( typeof data === "object") && (!Buffer.isBuffer(data))) {
			data = JSON.stringify(data);
		}
		if ( typeof data === "boolean") {
			data = data.toString();
		}
		if ( typeof data === "number") {
			data = data.toString();
		}
		fs.writeFile(node.filename, data, "utf8", function(err) {
			if (err) {
				if ((err.code === "ENOENT") && node.createDir) {
					fs.ensureFile(node.filename, function(err) {
						if (err) {
							node.error(RED._("file.errors.createfail", {
								error : err.toString()
							}), msg);
						} else {
							fs.writeFile(node.filename, data, "utf8", function(err) {
								if (err) {
									node.error(RED._("file.errors.writefail", {
										error : err.toString()
									}), msg);
								}
							});
						}
						node.send(msg);
					});
				} else {
					node.error(RED._("file.errors.writefail", {
						error : err.toString()
					}), msg);
					node.send(msg);
				}
			} else {
				node.send(msg);
			}
		});
	}

	function waitUntilElementLocated(node, msg, callback) {
		node.selector = (node.selector && node.selector != "") ? node.selector : msg.selector;
		node.target = (node.target && node.target != "") ? node.target : msg.target;
		node.timeout = (node.timeout && node.timeout != "") ? node.timeout : msg.timeout;
		node.waitfor = msg.waitfor || node.waitfor;
		node.status({});
		if (msg.error) {
			node.send(msg);
		} else if (node.target && node.target != "") {
			try {
				node.status({
					fill : "blue",
					shape : "dot",
					text : "locating"
				});
				setTimeout(function() {
					if (msg.driver) {
						msg.driver.wait(until.elementLocated(By[node.selector](node.target)), parseInt(node.timeout)).catch(function(errorback) {
							msg.error = {
								name : node.name,
								selector : node.selector,
								target : node.target,
								value : "catch timeout after " + node.timeout + " seconds"
							};
							node.status({
								fill : "red",
								shape : "ring",
								text : "error"
							});
						}).then(function() {
							if (msg.error) {
								node.send(msg);
							} else {
								msg.element = msg.driver.findElement(By[node.selector](node.target));
								if ( typeof (callback) !== "undefined") {
									node.status({});
									callback(msg.element);
								}
							}
						}, function(err) {
							node.status({
								fill : "red",
								shape : "ring",
								text : "error"
							});
							node.send(msg);
						});
					} else {
						if ( typeof (callback) !== "undefined") {
							node.status({});
							callback(msg.element);
						}
					}
				}, node.waitfor);
			} catch (ex) {
				node.status({
					fill : "red",
					shape : "ring",
					text : "exception"
				});
				node.send(msg);
			}
		} else {
			if ( typeof (callback) !== "undefined") {
				node.status({
					fill : "blue",
					shape : "dot",
					text : "delay " + (node.waitfor / 1000).toFixed(1) + " s"
				});
				setTimeout(function() {
					node.status({});
					callback(msg.element);
				}, node.waitfor);
			}
		}
	}

	function sendErrorMsg(node, msg, text, type) {
		msg.error = {
			name : node.name,
			selector : node.selector,
			target : node.target,
			expected : (node.expected && node.expected != "") ? node.expected : msg.expected,
			value : text
		};
		node.status({
			fill : "red",
			shape : "ring",
			text : type || "unknown"
		});
		node.send(msg);
	};

	function getValueNode(node, msg) {
		try {
			msg.element.getAttribute("value").then(function(text) {
				msg.payload = text;
				var expected = (node.expected && node.expected != "") ? node.expected : msg.expected;
				if (expected && expected != "" && expected != text) {
					sendErrorMsg(node, msg, text, "unexpected");
				} else if (!msg.error) {
					node.status({
						fill : "green",
						shape : "ring",
						text : "passed"
					});
					delete msg.error;
					if (msg.filename && node.savetofile) {
						saveToFile(node, msg);
					} else {
						node.send(msg);
					}
				}
			}).catch(function(errorback) {
				sendErrorMsg(node, msg, errorback.message, "error");
			});
		} catch (ex) {
			node.send(msg);
		}
	};

	function getAttributeNode(node, msg) {
		try {
			msg.element.getAttribute(node.attribute).then(function(text) {
				msg.payload = text;
				var expected = (node.expected && node.expected != "") ? node.expected : msg.expected;
				if (expected && expected != "" && expected != text) {
					sendErrorMsg(node, msg, text, "unexpected");
				} else if (!msg.error) {
					node.status({
						fill : "green",
						shape : "ring",
						text : "passed"
					});
					delete msg.error;
					if (msg.filename && node.savetofile) {
						saveToFile(node, msg);
					} else {
						node.send(msg);
					}
				}
			}).catch(function(errorback) {
				sendErrorMsg(node, msg, errorback.message, "error");
			});
		} catch (ex) {
			node.send(msg);
		}
	};

	function getTextNode(node, msg) {
		try {
			msg.element.getText().then(function(text) {
				msg.payload = text;
				var expected = (node.expected && node.expected != "") ? node.expected : msg.expected;
				if (expected && expected != "" && expected != text) {
					sendErrorMsg(node, msg, text, "unexpected");
				} else if (!msg.error) {
					node.status({
						fill : "green",
						shape : "ring",
						text : "passed"
					});
					delete msg.error;
					if (msg.filename && node.savetofile) {
						saveToFile(node, msg);
					} else {
						node.send(msg);
					}
				}
			}).catch(function(errorback) {
				sendErrorMsg(node, msg, errorback.message, "error");
			});
		} catch (ex) {
			node.send(msg);
		}
	};

	function setValueNode(node, msg, callback) {
		try {
			var value = (node.value && node.value != "") ? node.value : msg.value;
			msg.driver.executeScript("arguments[0].setAttribute('value', '" + value + "')", msg.element).then(function() {
				if (!msg.error) {
					node.status({
						fill : "green",
						shape : "ring",
						text : "done"
					});
					delete msg.error;
					node.send(msg);
				}

			}).catch(function(errorback) {
				sendErrorMsg(node, msg, errorback.message, "error");
			});
		} catch (ex) {
			node.send(msg);
		}
	};

	function clickOnNode(node, msg) {
		try {
			msg.element.click().then(function() {
				if (!msg.error) {
					node.status({
						fill : "green",
						shape : "ring",
						text : "done"
					});
					delete msg.error;
					node.send(msg);
				}
			}).catch(function(errorback) {
				sendErrorMsg(node, msg, errorback.message, "error");
			});
		} catch (ex) {
			node.send(msg);
		}
	}

	function sendKeysNode(node, msg) {
		try {
			var value = (node.value && node.value != "") ? node.value : msg.value;
			if (node.clearval) {
				msg.element.clear().then(function() {
					msg.element.sendKeys(value).then(function() {
						if (!msg.error) {
							node.status({
								fill : "green",
								shape : "ring",
								text : "done"
							});
							delete msg.error;
							node.send(msg);
						}
					}).catch(function(errorback) {
						sendErrorMsg(node, msg, errorback.message, "error");
					});
				}).catch(function(errorback) {
					sendErrorMsg(node, msg, errorback.message, "error");
				});
			} else {
				msg.element.sendKeys(value).then(function() {
					if (!msg.error) {
						node.status({
							fill : "green",
							shape : "ring",
							text : "done"
						});
						delete msg.error;
						node.send(msg);
					}
				}).catch(function(errorback) {
					sendErrorMsg(node, msg, errorback.message, "error");
				});
			}
		} catch (ex) {
			node.send(msg);
		}
	};

	function runScriptNode(node, msg) {
		try {
			msg.driver.executeScript(node.func, msg.element).then(function(results) {
				if (!msg.error) {
					node.status({
						fill : "green",
						shape : "ring",
						text : "done"
					});
					delete msg.error;
					msg.payload = results;
					node.send(msg);
				}
			}).catch(function(errorback) {
				sendErrorMsg(node, msg, errorback.message, "error");
			});
		} catch (ex) {
			node.send(msg);
		}
	}

	function takeScreenShotNode(node, msg) {
		node.filename = msg.filename || node.filename;
		var cropInFile = function(size, location, srcFile) {
			if ( typeof (easyimg) !== "undefined") {
				easyimg.crop({
					src : srcFile,
					dst : srcFile,
					cropwidth : size.width,
					cropheight : size.height,
					x : location.x,
					y : location.y,
					gravity : 'North-West'
				}, function(err, stdout, stderr) {
					if (err) {
						throw err;
					}
				});
			}
		};
		try {
			msg.element.getSize().then(function(size) {
				msg.element.getLocation().then(function(location) {
					msg.driver.takeScreenshot().then(function(base64PNG) {
						if (node.filename.length == 0) {
							msg.payload = base64PNG;
							node.status({
								fill : "green",
								shape : "ring",
								text : "done"
							});
							delete msg.error;
							node.send(msg);
						} else {
							var base64Data = base64PNG.replace(/^data:image\/png;base64,/, "");
							fs.writeFile(node.filename, base64Data, 'base64', function(err) {
								if (err) {
									sendErrorMsg(node, msg, err.message, "error");
								} else {
									cropInFile(size, location, node.filename);
								}
								if (!msg.error) {
									node.status({
										fill : "green",
										shape : "ring",
										text : "done"
									});
									delete msg.error;
									node.send(msg);
								}
							});
						}
					}).catch(function(errorback) {
						sendErrorMsg(node, msg, errorback.message, "error");
					});
				}).catch(function(errorback) {
					sendErrorMsg(node, msg, errorback.message, "error");
				});
			}).catch(function(errorback) {
				sendErrorMsg(node, msg, errorback.message, "error");
			});
		} catch (ex) {
			node.send(msg);
		}
	};

	function getAbsoluteXPath(driver, element) {
		return driver.executeScript("function absoluteXPath(element) {" + "var comp, comps = [];" + "var parent = null;" + "var xpath = '';" + "var getPos = function(element) {" + "var position = 1, curNode;" + "if (element.nodeType == Node.ATTRIBUTE_NODE) {" + "return null;" + "}" + "for (curNode = element.previousSibling; curNode; curNode = curNode.previousSibling){" + "if (curNode.nodeName == element.nodeName) {" + "++position;" + "}" + "}" + "return position;" + "};" + "if (element instanceof Document) {" + "return '/';" + "}" + "for (; element && !(element instanceof Document); element = element.nodeType == Node.ATTRIBUTE_NODE ? element.ownerElement : element.parentNode) {" + "comp = comps[comps.length] = {};" + "switch (element.nodeType) {" + "case Node.TEXT_NODE:" + "comp.name = 'text()';" + "break;" + "case Node.ATTRIBUTE_NODE:" + "comp.name = '@' + element.nodeName;" + "break;" + "case Node.PROCESSING_INSTRUCTION_NODE:" + "comp.name = 'processing-instruction()';" + "break;" + "case Node.COMMENT_NODE:" + "comp.name = 'comment()';" + "break;" + "case Node.ELEMENT_NODE:" + "comp.name = element.nodeName;" + "break;" + "}" + "comp.position = getPos(element);" + "}" + "for (var i = comps.length - 1; i >= 0; i--) {" + "comp = comps[i];" + "xpath += '/' + comp.name.toLowerCase();" + "if (comp.position !== null) {" + "xpath += '[' + comp.position + ']';" + "}" + "}" + "return xpath;" + "} return absoluteXPath(arguments[0]);", element);
	}

	function SeleniumServerSetup(n) {
		RED.nodes.createNode(this, n);

		this.connected = false;
		this.connecting = false;
		this.usecount = 0;
		// Config node state
		this.remoteurl = n.remoteurl;
		

		var node = this;
		this.register = function() {
			node.usecount += 1;
		};

		this.deregister = function() {
			node.usecount -= 1;
			if (node.usecount == 0) {
			}
		};

		this.connect = function(browser) {
			var deferred = q.defer();
			if (!node.connected && !node.connecting) {
				node.connecting = true;
				var url = require('url').parse(node.remoteurl);
				isReachable(url.host, function(error, reachable) {
					if (!error && reachable) {
						node.driver = new webdriver.Builder().forBrowser(browser).usingServer(node.remoteurl);
						node.log(RED._("connected", {
							server : (browser ? browser + "@" : "") + node.remoteurl
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
		this.browser = n.browser;
		this.weburl = n.weburl;
		this.width = n.width;
		this.height = n.height;
		this.webtitle = n.webtitle;
		this.timeout = n.timeout;
		this.maximized = n.maximized;
		this.serverObj = RED.nodes.getNode(this.server);
		var node = this;
		if (node.serverObj) {
			node.serverObj.register();
			node.serverObj.connect(node.browser).then(function(webdriver) {
				node.status({
					fill : "green",
					shape : "ring",
					text : "connected"
				});
			}, function(error) {
				node.status({
					fill : "red",
					shape : "ring",
					text : "disconnected"
				});
			});
		} else {
			node.error("!configuration");
		}
		this.on("input", function(msg) {
			node.serverObj.connect(node.browser).then(function(webdriver) {
				function setWindowSize(driver, title) {
					if (node.maximized) {
						driver.manage().window().maximize().then(function() {
							msg.driver = driver;
							msg.payload = title;
							node.send(msg);
						});
					} else {
						driver.manage().window().setSize(parseInt(node.width), parseInt(node.height)).then(function() {
							msg.driver = driver;
							msg.payload = title;
							node.send(msg);
						});
					}
					node.status({
						fill : "green",
						shape : "ring",
						text : "connected"
					});
				}

				var driver = webdriver.build();
				driver.get(node.weburl);
				if (node.webtitle) {
					driver.wait(until.titleIs(node.webtitle), parseInt(node.timeout)).catch(function(errorback) {
						node.status({
							fill : "yellow",
							shape : "ring",
							text : "unexpected"
						});
					}).then(function() {
						driver.getTitle().then(function(title) {
							setWindowSize(driver, title);
						});
					});
				} else {
					setWindowSize(driver);
				}
			}, function(error) {
				node.status({
					fill : "red",
					shape : "ring",
					text : "disconnected"
				});
			});
		});
		this.on('close', function() {
			if (node.serverObj) {
				node.serverObj.deregister();
			}
		});
	}


	RED.nodes.registerType("open-web", SeleniumOpenURLNode);

	function SeleniumCloseBrowserNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.waitfor = n.waitfor || 0;
		var node = this;
		this.on("input", function(msg) {
			setTimeout(function() {
				msg.driver.quit();
				node.send(msg);
				node.status({
                    fill : "green",
                    shape : "ring",
                    text : "closed"
                });
			}, node.waitfor);
		});
	}


	RED.nodes.registerType("close-web", SeleniumCloseBrowserNode);

	function SeleniumFindElementNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.selector = n.selector;
		this.timeout = n.timeout;
		this.target = n.target;
		this.waitfor = n.waitfor;
		var node = this;
		this.on("input", function(msg) {
			waitUntilElementLocated(node, msg, function(element) {
				node.send(msg);
			});
		});
	}


	RED.nodes.registerType("find-object", SeleniumFindElementNode);

	function SeleniumSendKeysNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.value = n.text;
		this.selector = n.selector;
		this.timeout = n.timeout;
		this.target = n.target;
		this.waitfor = n.waitfor;
		this.clearval = n.clearval;
		var node = this;
		this.on("input", function(msg) {
			waitUntilElementLocated(node, msg, function(element) {
				sendKeysNode(node, msg);
			});
		});
	}


	RED.nodes.registerType("send-keys", SeleniumSendKeysNode);

	function SeleniumClickOnNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.selector = n.selector;
		this.timeout = n.timeout;
		this.target = n.target;
		this.waitfor = n.waitfor;
		this.clickon = n.clickon;
		var node = this;
		this.on("input", function(msg) {
			waitUntilElementLocated(node, msg, function(element) {
				if (node.clickon) {
					if ( typeof (msg.payload) !== "undefined") {
						node.___msgs = msg;
						node.status({
							fill : "blue",
							shape : "dot",
							text : "click on"
						});
					} else {
						msg = node.___msgs;
						if ( typeof (msg) !== "undefined") {
							clickOnNode(node, msg);
							delete node.___msgs;
						}
					}
				} else {
					clickOnNode(node, msg);
				}
			});
		});
	}


	RED.nodes.registerType("click-on", SeleniumClickOnNode);

	function SeleniumSetValueNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.value = n.text;
		this.selector = n.selector;
		this.timeout = n.timeout;
		this.target = n.target;
		this.waitfor = n.waitfor;
		var node = this;
		this.on("input", function(msg) {
			waitUntilElementLocated(node, msg, function(element) {
				setValueNode(node, msg);
			});
		});
	}


	RED.nodes.registerType("set-value", SeleniumSetValueNode);

	function SeleniumToFileNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.filename = n.filename;
		this.waitfor = n.waitfor;
		var node = this;
		this.on("input", function(msg) {
			saveToFile(node, msg);
		});
	}


	RED.nodes.registerType("to-file", SeleniumToFileNode);

	function SeleniumGetValueNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.expected = n.expected;
		this.selector = n.selector;
		this.timeout = n.timeout;
		this.target = n.target;
		this.waitfor = n.waitfor;
		this.savetofile = n.savetofile;
		var node = this;

		this.on("input", function(msg) {
			waitUntilElementLocated(node, msg, function(element) {
				getValueNode(node, msg);
			});
		});
	}


	RED.nodes.registerType("get-value", SeleniumGetValueNode);

	function SeleniumGetAttributeNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.attribute = n.attribute;
		this.expected = n.expected;
		this.selector = n.selector;
		this.timeout = n.timeout;
		this.target = n.target;
		this.waitfor = n.waitfor;
		this.savetofile = n.savetofile;
		var node = this;

		this.on("input", function(msg) {
			waitUntilElementLocated(node, msg, function(element) {
				getAttributeNode(node, msg);
			});
		});
	}


	RED.nodes.registerType("get-attribute", SeleniumGetAttributeNode);

	function SeleniumGetTextNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.expected = n.expected;
		this.selector = n.selector;
		this.timeout = n.timeout;
		this.target = n.target;
		this.waitfor = n.waitfor;
		this.savetofile = n.savetofile;
		var node = this;
		this.on("input", function(msg) {
			waitUntilElementLocated(node, msg, function(element) {
				getTextNode(node, msg);
			});
		});
	}


	RED.nodes.registerType("get-text", SeleniumGetTextNode);

	function SeleniumRunScriptNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.func = n.func;
		this.waitfor = n.waitfor;
		var node = this;
		this.on("input", function(msg) {
			waitUntilElementLocated(node, msg, function(element) {
				runScriptNode(node, msg);
			});
		});
	}


	RED.nodes.registerType("run-script", SeleniumRunScriptNode);

	function SeleniumTakeScreenshotNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.selector = n.selector;
		this.timeout = n.timeout;
		this.target = n.target;
		this.waitfor = n.waitfor;
		this.filename = n.filename;
		var node = this;
		this.on("input", function(msg) {
			waitUntilElementLocated(node, msg, function(element) {
				takeScreenShotNode(node, msg);
			});
		});
	}


	RED.nodes.registerType("screenshot", SeleniumTakeScreenshotNode);

	function SeleniumNavToNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.url = n.url;
		this.waitfor = n.waitfor;
		var node = this;
		this.on("input", function(msg) {
			if (msg.driver) {
				setTimeout(function() {
					msg.driver.navigate().to(node.url).then(function() {
						node.send(msg);
					});
				}, node.waitfor);
			}
		});
	}


	RED.nodes.registerType("nav-to", SeleniumNavToNode);

	function SeleniumNavBackNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.waitfor = n.waitfor;
		var node = this;
		this.on("input", function(msg) {
			if (msg.driver) {
				setTimeout(function() {
					msg.driver.navigate().back().then(function() {
						node.send(msg);
					});
				}, node.waitfor);
			}
		});
	}


	RED.nodes.registerType("nav-back", SeleniumNavBackNode);

	function SeleniumNavForwardNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.waitfor = n.waitfor;
		var node = this;
		this.on("input", function(msg) {
			if (msg.driver) {
				setTimeout(function() {
					msg.driver.navigate().forward().then(function() {
						node.send(msg);
					});
				}, node.waitfor);
			}
		});
	}


	RED.nodes.registerType("nav-forward", SeleniumNavForwardNode);

	function SeleniumNavRefreshNode(n) {
		RED.nodes.createNode(this, n);
		this.name = n.name;
		this.waitfor = n.waitfor;
		var node = this;
		this.on("input", function(msg) {
			if (msg.driver) {
				setTimeout(function() {
					msg.driver.navigate().refresh().then(function() {
						node.send(msg);
					});
				}, node.waitfor);
			}
		});
	}


	RED.nodes.registerType("nav-refresh", SeleniumNavRefreshNode);

	RED.httpAdmin.post("/onclick/:id", RED.auth.needsPermission("inject.write"), function(req, res) {
		var node = RED.nodes.getNode(req.params.id);
		if (node != null) {
			try {
				node.receive({
					waitfor : 1
				});
				res.sendStatus(200);
			} catch(err) {
				res.sendStatus(500);
				node.error(RED._("inject.failed", {
					error : err.toString()
				}));
			}
		} else {
			res.sendStatus(404);
		}
	});
};
