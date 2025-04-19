#!/bin/bash

# Install dependencies in the client directory
cd client
npm install

# Build the client
npm run build

# Return to the root directory
cd ..

# Log the build completion
echo "Build completed successfully"