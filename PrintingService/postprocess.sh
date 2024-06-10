#!/bin/sh

# Source the environment variables
if [ -f /usr/local/bin/env_vars.sh ]; then
    . /usr/local/bin/env_vars.sh
fi

# Check if server adress is set
if [ -z "$SERVER_URL" ]; then
    echo "Error: SERVER_URL is not set."
    exit 1
fi

# Cut only relevant part of the path
MESSAGE=$(echo "$1" | sed 's|.*/out||')

# Send response
response=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"message\": \"$MESSAGE\"}" "$SERVER_URL")

echo "Response from server: $response"