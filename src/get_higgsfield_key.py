#!/usr/bin/env python3
"""
Helper script to set up Higgsfield API key
"""

import json
import os
from pathlib import Path

def setup_higgsfield_api():
    print("="*50)
    print("   HIGGSFIELD API KEY SETUP")
    print("="*50)
    print()
    print("To get your Higgsfield API key:")
    print("1. Go to https://higgsfield.ai")
    print("2. Log in to your account")
    print("3. Navigate to Settings > API Keys")
    print("4. Create or copy your API key")
    print()
    
    api_key = input("Please paste your Higgsfield API key here: ").strip()
    
    if not api_key:
        print("No API key provided. Exiting...")
        return False
    
    # Update the config file
    config_path = Path("../config/system_config.json")
    
    # Load existing config
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Update Higgsfield API key
    config['higgsfield']['api_key'] = api_key
    
    # Save updated config
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print()
    print("✅ API key saved successfully!")
    print("The system will now use your Higgsfield account for content generation.")
    print()
    print("You can now:")
    print("1. Restart the Higgsfield agent to use real API")
    print("2. Monitor content generation on the dashboard")
    print("3. Check your Higgsfield account for generated content")
    
    return True

if __name__ == "__main__":
    setup_higgsfield_api()
    input("\nPress Enter to continue...")