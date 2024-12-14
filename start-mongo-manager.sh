#!/bin/bash

# Start excel-json-converter
docker-compose up -d excel-json-converter

# Wait for excel-json-converter to be ready
echo "Waiting for excel-json-converter to be ready..."
while ! docker inspect -f '{{.State.Health.Status}}' excel-json-converter | grep -q "healthy"; do
  sleep 1
done
echo "excel-json-converter is ready!"

# Run mongo-manager-cli
docker-compose run --rm mongo-manager-cli
