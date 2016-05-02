# Set node base image
FROM node:0.12

MAINTAINER cuong3ihut@gmail.com

# expose port
EXPOSE 1880

# Run app using nodemon
CMD ["node", "~/.node-red/red.js"]