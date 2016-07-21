# Set node base image
FROM node:4

MAINTAINER cuong3ihut@gmail.com

RUN apt-get update

RUN npm install -g --unsafe-perm node-red
RUN cd /usr/local/lib/node_modules/node-red/ && npm install node-red-contrib-selenium-webdriver

# Install Java
RUN apt-get -yqq install openjdk-7-jre-headless

# Install Selenium Webdriver
RUN npm install -g webdriver-manager
RUN webdriver-manager update

# Install Chrome WebDriver
RUN wget --no-verbose -O /tmp/chromedriver_linux64.zip http://chromedriver.storage.googleapis.com/2.10/chromedriver_linux64.zip
RUN mkdir -p /opt/chromedriver-2.10
RUN unzip /tmp/chromedriver_linux64.zip -d /opt/chromedriver-2.10
RUN chmod +x /opt/chromedriver-2.10/chromedriver
RUN rm /tmp/chromedriver_linux64.zip
RUN ln -fs /opt/chromedriver-2.10/chromedriver /usr/local/bin/chromedriver

# Install Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
RUN apt-get -yqq update
RUN apt-get -yqq install google-chrome-stable

# Disable the SUID sandbox so that Chrome can launch without being in a privileged container.
# One unfortunate side effect is that `google-chrome --help` will no longer work.
RUN dpkg-divert --add --rename --divert /opt/google/chrome/google-chrome.real /opt/google/chrome/google-chrome
RUN echo "#!/bin/bash\nexec /opt/google/chrome/google-chrome.real --disable-setuid-sandbox \"\$@\"" > /opt/google/chrome/google-chrome
RUN chmod 755 /opt/google/chrome/google-chrome

# Install Firefox
RUN apt-get -yqq install firefox

RUN mkdir -p /var/log/supervisor

# Add main configuration file
ADD supervisord.conf /etc/supervisor/supervisor.conf

# Add service defintions for Xvfb, Selenium and Protractor runner
ADD supervisord/*.conf /etc/supervisor/conf.d/

# Default configuration
ENV SCREEN_GEOMETRY "1440x900x24"
ENV SELENIUM_PORT 4444
ENV DISPLAY :20.0

# expose port
EXPOSE 4444 1880

# Container's entry point, executing supervisord in the foreground
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisor.conf"]
