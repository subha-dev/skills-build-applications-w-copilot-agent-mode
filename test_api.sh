#!/bin/bash

# OctoFit API Test Script
# Test the Django REST API endpoints

echo "======================================================================"
echo "OctoFit Tracker API Test Script"
echo "======================================================================"
echo ""

# Function to make request and pretty print
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    echo "Testing: $description"
    echo "Endpoint: $endpoint"
    
    if [ "$method" = "GET" ]; then
        curl -s -X GET "$endpoint" \
            -H "Content-Type: application/json" | jq '.' 2>/dev/null || echo "Failed to connect or invalid JSON"
    elif [ "$method" = "POST" ]; then
        curl -s -X POST "$endpoint" \
            -H "Content-Type: application/json" \
            -d "$4" | jq '.' 2>/dev/null || echo "Failed to connect or invalid JSON"
    fi
    
    echo ""
    echo "----------------------------------------------------------------------"
    echo ""
}

# Determine base URL
if [ -z "$CODESPACE_NAME" ]; then
    BASE_URL="http://localhost:8000"
    echo "Using localhost: $BASE_URL"
else
    BASE_URL="https://$CODESPACE_NAME-8000.app.github.dev"
    echo "Using Codespace: $BASE_URL"
fi

echo ""

# Test API Root
test_endpoint "GET" "$BASE_URL/" "API Root - View all available endpoints"

# Test Users
test_endpoint "GET" "$BASE_URL/api/users/" "Users - List all users"

# Test Teams
test_endpoint "GET" "$BASE_URL/api/teams/" "Teams - List all teams"

# Test Activities
test_endpoint "GET" "$BASE_URL/api/activities/" "Activities - List all activities"

# Test Leaderboard
test_endpoint "GET" "$BASE_URL/api/leaderboard/" "Leaderboard - View team scores"

# Test Workouts
test_endpoint "GET" "$BASE_URL/api/workouts/" "Workouts - List all workouts"

echo "======================================================================"
echo "API Testing Complete"
echo "======================================================================"
echo ""
echo "Summary of tested endpoints:"
echo "  • GET $BASE_URL/"
echo "  • GET $BASE_URL/api/users/"
echo "  • GET $BASE_URL/api/teams/"
echo "  • GET $BASE_URL/api/activities/"
echo "  • GET $BASE_URL/api/leaderboard/"
echo "  • GET $BASE_URL/api/workouts/"
echo ""
