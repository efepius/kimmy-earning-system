#!/usr/bin/env python3
"""
Kimmy Dashboard - Real-time monitoring and control interface
"""

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
import json
import os
from datetime import datetime
from pathlib import Path
import threading
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'kimmy-secret-key-2024'
socketio = SocketIO(app, cors_allowed_origins="*")

class DashboardServer:
    def __init__(self):
        self.earnings_data = []
        self.agent_status = {}
        self.platform_stats = {}
        self.content_stats = {}
        self.load_existing_data()
        
    def load_existing_data(self):
        """Load existing metrics from files"""
        metrics_path = Path(__file__).parent.parent / "data" / "metrics.json"
        if metrics_path.exists():
            with open(metrics_path, 'r') as f:
                self.earnings_data = json.load(f)
        
        # Initialize agent status
        self.agent_status = {
            "higgsfield_content": {"name": "Higgsfield Content Generator", "status": "active", "tasks": 0},
            "platform_worker": {"name": "Platform Task Worker", "status": "active", "tasks": 0},
            "revenue_optimizer": {"name": "Revenue Optimizer", "status": "active", "tasks": 0},
            "market_scanner": {"name": "Market Scanner", "status": "active", "tasks": 0},
            "risk_manager": {"name": "Risk Manager", "status": "active", "tasks": 0}
        }
        
    def get_dashboard_data(self):
        """Get current dashboard data"""
        # Calculate totals
        total_earnings = sum(item.get('earnings', 0) for item in self.earnings_data)
        total_content = sum(item.get('content', 0) for item in self.earnings_data)
        total_tasks = sum(item.get('tasks', 0) for item in self.earnings_data)
        
        # Get latest entry
        latest = self.earnings_data[-1] if self.earnings_data else {}
        
        return {
            "summary": {
                "total_earnings": total_earnings,
                "today_earnings": latest.get('earnings', 0),
                "content_generated": total_content,
                "tasks_completed": total_tasks,
                "active_agents": len([a for a in self.agent_status.values() if a['status'] == 'active']),
                "daily_target": 2500,
                "progress": (latest.get('earnings', 0) / 2500 * 100) if latest else 0
            },
            "agents": self.agent_status,
            "platforms": {
                "higgsfield": {"status": "active", "daily_content": 80, "revenue": "$1,165"},
                "mturk": {"status": "active", "tasks": 50, "revenue": "$150"},
                "clickworker": {"status": "active", "tasks": 30, "revenue": "$90"},
                "medium": {"status": "active", "articles": 3, "revenue": "$180"},
                "crypto": {"status": "active", "trades": 12, "revenue": "$320"}
            },
            "recent_earnings": self.earnings_data[-10:] if self.earnings_data else [],
            "content_breakdown": {
                "youtube_shorts": 20,
                "tiktok_videos": 30,
                "instagram_reels": 15,
                "podcasts": 3,
                "nft_art": 10,
                "blog_posts": 5
            }
        }

dashboard = DashboardServer()

@app.route('/')
def index():
    """Serve the main dashboard page"""
    return render_template('dashboard.html')

@app.route('/api/status')
def get_status():
    """Get current system status"""
    return jsonify(dashboard.get_dashboard_data())

@app.route('/api/agents', methods=['GET', 'POST'])
def manage_agents():
    """Manage agent status"""
    if request.method == 'POST':
        agent_id = request.json.get('agent_id')
        action = request.json.get('action')
        
        if agent_id in dashboard.agent_status:
            if action == 'start':
                dashboard.agent_status[agent_id]['status'] = 'active'
            elif action == 'stop':
                dashboard.agent_status[agent_id]['status'] = 'stopped'
            
            # Broadcast update
            socketio.emit('agent_update', dashboard.agent_status[agent_id])
            return jsonify({"success": True})
    
    return jsonify(dashboard.agent_status)

@app.route('/api/earnings')
def get_earnings():
    """Get earnings history"""
    return jsonify(dashboard.earnings_data)

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('Client connected')
    emit('initial_data', dashboard.get_dashboard_data())

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('Client disconnected')

def background_updates():
    """Send real-time updates to connected clients"""
    while True:
        time.sleep(5)  # Update every 5 seconds
        
        # Simulate new data (in production, this would read from actual sources)
        dashboard.earnings_data.append({
            "timestamp": datetime.now().isoformat(),
            "earnings": 25 + (time.time() % 100),
            "content": 2,
            "tasks": 3
        })
        
        # Keep only last 100 entries
        if len(dashboard.earnings_data) > 100:
            dashboard.earnings_data = dashboard.earnings_data[-100:]
        
        # Broadcast update
        socketio.emit('update', dashboard.get_dashboard_data())

if __name__ == '__main__':
    # Start background thread
    update_thread = threading.Thread(target=background_updates)
    update_thread.daemon = True
    update_thread.start()
    
    # Run server
    print("Dashboard running at http://localhost:8080")
    socketio.run(app, host='0.0.0.0', port=8080, debug=False)