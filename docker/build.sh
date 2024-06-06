export BUILDER6_VERSION=0.0.7
###
 # @Author: baozhoutao@steedos.com
 # @Date: 2024-06-06 18:10:41
 # @LastEditors: baozhoutao@steedos.com
 # @LastEditTime: 2024-06-06 19:37:31
 # @Description: 
### 
echo "#########################################################################"
echo "builder6 version: ${BUILDER6_VERSION}"
echo "#########################################################################"

sudo docker-compose build --no-cache \
    --build-arg ARCH=amd64 \
    --build-arg NODE_VERSION=14 \
    --build-arg OS=alpine3.12 \
    --build-arg BUILD_DATE="$(date +"%Y-%m-%dT%H:%M:%SZ")"

docker tag steedos/builder6:latest steedos/builder6:${BUILDER6_VERSION}