eval "$(docker-machine env default)"
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker ps -a -q)
docker build -t local-build-test .
docker run -dp 1880:1880 --restart=always local-build-test

