#!/bin/bash

# Start the app.js in the background
node --env-file=.env.example app.js &

# Give the server a moment to start
sleep 5

# Run bench.setup.js
node bench.setup.js

# Stop any running node processes
pkill node
