#!/bin/bash

# Download hey
wget https://hey-release.s3.us-east-2.amazonaws.com/hey_linux_amd64 -O hey > /dev/null 2>&1

# Make hey executable
chmod +x hey

# Move hey to /usr/local/bin
sudo mv hey /usr/local/bin

# Set authorization token
export AUTH_TOKEN=default:production.4fd4d75a81b9c7bacc18b92d18408ae2f26176cd5772b6b7510ed2d0

# Start the app.js in the background
node --env-file=.env.example app.js &

# Give the server a moment to start
sleep 5

# Run the benchmark for app.js
hey -z 10s -H "Authorization: $AUTH_TOKEN" 'http://localhost:4242/api/frontend?environment=default&appName=web&license=alfatih1455' > bench-result-app.txt

# Stop any running node processes
pkill node

# Start the server.js in the background
node --env-file=.env.example server.js &

# Give the server a moment to start
sleep 5

# Run the benchmark for server.js
hey -z 10s -H "Authorization: $AUTH_TOKEN" 'http://localhost:4242/api/frontend?environment=default&appName=web&license=alfatih1455' > bench-result-server.txt

# Stop any running node processes
pkill node
