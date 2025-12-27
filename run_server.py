#!/usr/bin/env python
"""
Quick setup and run script for AlgoViz Lab
This script handles initial setup and runs the development server
"""

import os
import sys
import subprocess
import django
from django.core.management import execute_from_command_line

def setup_project():
    """Initial project setup"""
    print("🚀 Setting up AlgoViz Lab...")
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dsa_buddy.settings')
    
    try:
        # Run migrations
        print("📦 Running database migrations...")
        execute_from_command_line(['manage.py', 'makemigrations'])
        execute_from_command_line(['manage.py', 'migrate'])
        
        # Collect static files
        print("📁 Collecting static files...")
        execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
        
        print("✅ Setup completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        return False

def run_server():
    """Run the development server"""
    print("🌐 Starting AlgoViz Lab server...")
    print("📍 Access the application at: http://127.0.0.1:8000")
    print("🔧 Admin panel at: http://127.0.0.1:8000/admin")
    print("⏹️  Press Ctrl+C to stop the server")
    
    try:
        execute_from_command_line(['manage.py', 'runserver'])
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Thanks for using AlgoViz Lab!")

if __name__ == '__main__':
    print("=" * 50)
    print("🎯 AlgoViz Lab - Interactive Algorithm Visualizer")
    print("=" * 50)
    
    # Check if this is first run
    if not os.path.exists('db.sqlite3'):
        if setup_project():
            print("\n" + "=" * 50)
            run_server()
    else:
        run_server()