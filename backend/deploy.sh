#!/bin/bash

docker build -t registry.digitalocean.com/merg-registry/tarant-paulig:$1 .
docker push registry.digitalocean.com/merg-registry/tarant-paulig:$1
kubectl apply -f k8s/manifest.yml
