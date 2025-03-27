#!/bin/bash

echo "🚀 Starting Derrick's DevOps Lab..."

docker run -it --rm \
  -p 8000:8000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  derrickweilslabs/lab1-app
