#!/bin/bash

echo "Cleaning old modules..."
rm -rf node_modules package-lock.json

echo "Installing dependencies..."
npm install

echo "Starting build (if any)..."
# If you have a build step, add it here
# npm run build
