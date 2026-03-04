#!/bin/bash
# Start script for Render deployment

# Start the dashboard in background
python src/dashboard.py &

# Start the main system
python src/main.py