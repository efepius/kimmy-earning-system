#!/usr/bin/env python3
"""
Platform Connectors - Integrations with earning platforms
Handles MTurk, Clickworker, Survey sites, and more
"""

import asyncio
import aiohttp
import json
import logging
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

class PlatformConnector:
    """Base class for all platform connectors"""
    
    def __init__(self, platform_name: str):
        self.platform_name = platform_name
        self.api_key = None
        self.session = None
        self.rate_limit = {"requests_per_hour": 100, "last_request": None}
        self.earnings = 0
        self.tasks_completed = 0
        
    async def authenticate(self) -> bool:
        """Authenticate with the platform"""
        raise NotImplementedError
        
    async def fetch_tasks(self) -> List[Dict]:
        """Fetch available tasks from the platform"""
        raise NotImplementedError
        
    async def complete_task(self, task_id: str) -> Dict:
        """Complete a specific task"""
        raise NotImplementedError
        
    async def withdraw_earnings(self, amount: float) -> bool:
        """Withdraw earnings from the platform"""
        raise NotImplementedError


class MTurkConnector(PlatformConnector):
    """Amazon Mechanical Turk connector"""
    
    def __init__(self):
        super().__init__("MTurk")
        self.min_reward = 0.10  # Minimum $0.10 per HIT
        self.qualification_types = ["Masters", "Adult Content", "Location US"]
        
    async def authenticate(self) -> bool:
        """Authenticate with MTurk API"""
        # In production, use boto3 for AWS MTurk
        # For simulation, return success
        logger.info("MTurk authentication successful")
        return True
    
    async def fetch_tasks(self) -> List[Dict]:
        """Fetch HITs from MTurk"""
        # Simulate fetching HITs
        hits = []
        task_types = [
            ("Data Categorization", 0.25, 5),
            ("Image Tagging", 0.15, 3),
            ("Survey", 0.50, 10),
            ("Transcription", 1.00, 15),
            ("Content Moderation", 0.30, 4)
        ]
        
        for i in range(random.randint(5, 15)):
            task_type, reward, time_minutes = random.choice(task_types)
            hits.append({
                "id": f"mturk_{datetime.now().timestamp()}_{i}",
                "title": f"{task_type} Task",
                "reward": reward,
                "time_estimate": time_minutes,
                "requester": f"Requester_{random.randint(100, 999)}",
                "qualifications": random.sample(self.qualification_types, k=random.randint(0, 2))
            })
        
        logger.info(f"Fetched {len(hits)} HITs from MTurk")
        return hits
    
    async def complete_task(self, task_id: str) -> Dict:
        """Complete an MTurk HIT"""
        # Simulate HIT completion
        await asyncio.sleep(random.uniform(1, 3))  # Simulate work time
        
        reward = random.uniform(0.10, 2.00)
        self.earnings += reward
        self.tasks_completed += 1
        
        result = {
            "task_id": task_id,
            "status": "completed",
            "reward": reward,
            "completion_time": datetime.now().isoformat()
        }
        
        logger.info(f"Completed MTurk HIT {task_id}: ${reward:.2f}")
        return result
    
    async def withdraw_earnings(self, amount: float) -> bool:
        """Withdraw from MTurk to bank account"""
        if amount <= self.earnings:
            self.earnings -= amount
            logger.info(f"Withdrew ${amount:.2f} from MTurk")
            return True
        return False


class ClickworkerConnector(PlatformConnector):
    """Clickworker platform connector"""
    
    def __init__(self):
        super().__init__("Clickworker")
        self.min_pay = 0.05
        self.task_categories = ["Writing", "Research", "Data Entry", "Translation"]
        
    async def authenticate(self) -> bool:
        """Authenticate with Clickworker API"""
        logger.info("Clickworker authentication successful")
        return True
    
    async def fetch_tasks(self) -> List[Dict]:
        """Fetch tasks from Clickworker"""
        tasks = []
        task_templates = [
            ("Write Product Description", 2.50, 20),
            ("Web Research", 1.50, 15),
            ("Data Entry", 0.75, 10),
            ("Translation (500 words)", 5.00, 30),
            ("App Testing", 3.00, 25)
        ]
        
        for i in range(random.randint(3, 10)):
            template = random.choice(task_templates)
            tasks.append({
                "id": f"cw_{datetime.now().timestamp()}_{i}",
                "title": template[0],
                "payment": template[1],
                "time_estimate": template[2],
                "category": random.choice(self.task_categories),
                "difficulty": random.choice(["Easy", "Medium", "Hard"])
            })
        
        logger.info(f"Fetched {len(tasks)} tasks from Clickworker")
        return tasks
    
    async def complete_task(self, task_id: str) -> Dict:
        """Complete a Clickworker task"""
        await asyncio.sleep(random.uniform(2, 5))
        
        payment = random.uniform(0.50, 5.00)
        self.earnings += payment
        self.tasks_completed += 1
        
        result = {
            "task_id": task_id,
            "status": "completed",
            "payment": payment,
            "quality_score": random.uniform(85, 100)
        }
        
        logger.info(f"Completed Clickworker task {task_id}: €{payment:.2f}")
        return result
    
    async def withdraw_earnings(self, amount: float) -> bool:
        """Withdraw via PayPal or SEPA"""
        if amount >= 5.00 and amount <= self.earnings:  # Minimum withdrawal €5
            self.earnings -= amount
            logger.info(f"Withdrew €{amount:.2f} from Clickworker")
            return True
        return False


class SurveyPlatformConnector(PlatformConnector):
    """Generic survey platform connector (Swagbucks, Survey Junkie, etc.)"""
    
    def __init__(self, platform_name: str = "SurveyPlatform"):
        super().__init__(platform_name)
        self.points_per_dollar = 100
        self.points_balance = 0
        
    async def authenticate(self) -> bool:
        """Authenticate with survey platform"""
        logger.info(f"{self.platform_name} authentication successful")
        return True
    
    async def fetch_tasks(self) -> List[Dict]:
        """Fetch available surveys"""
        surveys = []
        survey_types = [
            ("Consumer Preferences", 150, 15),
            ("Technology Usage", 200, 20),
            ("Shopping Habits", 100, 10),
            ("Media Consumption", 175, 18),
            ("Health and Wellness", 250, 25)
        ]
        
        for i in range(random.randint(5, 12)):
            survey_type = random.choice(survey_types)
            surveys.append({
                "id": f"survey_{datetime.now().timestamp()}_{i}",
                "title": f"{survey_type[0]} Survey",
                "points": survey_type[1],
                "time_estimate": survey_type[2],
                "screening_required": random.choice([True, False]),
                "demographic": random.choice(["18-24", "25-34", "35-44", "45+"])
            })
        
        logger.info(f"Fetched {len(surveys)} surveys from {self.platform_name}")
        return surveys
    
    async def complete_task(self, task_id: str) -> Dict:
        """Complete a survey"""
        await asyncio.sleep(random.uniform(3, 8))
        
        # Simulate screening (80% pass rate)
        if random.random() < 0.8:
            points = random.randint(50, 500)
            self.points_balance += points
            self.tasks_completed += 1
            status = "completed"
        else:
            points = 5  # Consolation points for screening out
            self.points_balance += points
            status = "screened_out"
        
        result = {
            "task_id": task_id,
            "status": status,
            "points": points,
            "dollar_value": points / self.points_per_dollar
        }
        
        logger.info(f"Survey {task_id}: {status}, {points} points")
        return result
    
    async def withdraw_earnings(self, amount: float) -> bool:
        """Redeem points for cash or gift cards"""
        points_needed = amount * self.points_per_dollar
        if points_needed <= self.points_balance:
            self.points_balance -= points_needed
            self.earnings += amount
            logger.info(f"Redeemed {points_needed} points for ${amount:.2f}")
            return True
        return False


class FreelancePlatformConnector(PlatformConnector):
    """Connector for freelance platforms (Fiverr, Upwork, etc.)"""
    
    def __init__(self, platform_name: str = "FreelancePlatform"):
        super().__init__(platform_name)
        self.gig_types = ["Writing", "Design", "Programming", "Video Editing", "Data Analysis"]
        self.active_gigs = []
        
    async def authenticate(self) -> bool:
        """Authenticate with freelance platform"""
        logger.info(f"{self.platform_name} authentication successful")
        return True
    
    async def fetch_tasks(self) -> List[Dict]:
        """Fetch freelance opportunities"""
        gigs = []
        gig_templates = [
            ("Blog Article (1000 words)", 50, 120),
            ("Logo Design", 75, 180),
            ("Python Script", 100, 150),
            ("Video Editing (5 min)", 80, 90),
            ("Data Analysis Report", 120, 240)
        ]
        
        for i in range(random.randint(2, 6)):
            template = random.choice(gig_templates)
            gigs.append({
                "id": f"gig_{datetime.now().timestamp()}_{i}",
                "title": template[0],
                "budget": template[1],
                "deadline_minutes": template[2],
                "type": random.choice(self.gig_types),
                "client_rating": random.uniform(4.0, 5.0)
            })
        
        logger.info(f"Fetched {len(gigs)} gigs from {self.platform_name}")
        return gigs
    
    async def complete_task(self, task_id: str) -> Dict:
        """Complete a freelance gig"""
        await asyncio.sleep(random.uniform(5, 15))
        
        budget = random.uniform(25, 200)
        platform_fee = budget * 0.20  # 20% platform fee
        net_earnings = budget - platform_fee
        
        self.earnings += net_earnings
        self.tasks_completed += 1
        
        result = {
            "task_id": task_id,
            "status": "completed",
            "gross_payment": budget,
            "platform_fee": platform_fee,
            "net_earnings": net_earnings,
            "client_review": random.uniform(4.5, 5.0)
        }
        
        logger.info(f"Completed gig {task_id}: ${net_earnings:.2f} net")
        return result
    
    async def withdraw_earnings(self, amount: float) -> bool:
        """Withdraw freelance earnings"""
        if amount >= 20 and amount <= self.earnings:  # Minimum $20
            self.earnings -= amount
            logger.info(f"Withdrew ${amount:.2f} from {self.platform_name}")
            return True
        return False


class PlatformManager:
    """Manages all platform connectors"""
    
    def __init__(self):
        self.platforms = {
            "mturk": MTurkConnector(),
            "clickworker": ClickworkerConnector(),
            "swagbucks": SurveyPlatformConnector("Swagbucks"),
            "survey_junkie": SurveyPlatformConnector("Survey Junkie"),
            "fiverr": FreelancePlatformConnector("Fiverr"),
            "upwork": FreelancePlatformConnector("Upwork")
        }
        self.total_earnings = 0
        self.total_tasks = 0
        self.active_platforms = []
        
    async def initialize_all(self):
        """Initialize all platform connectors"""
        for name, platform in self.platforms.items():
            if await platform.authenticate():
                self.active_platforms.append(name)
                logger.info(f"✓ {name} initialized")
            else:
                logger.error(f"✗ {name} failed to initialize")
        
        logger.info(f"Active platforms: {', '.join(self.active_platforms)}")
    
    async def fetch_all_tasks(self) -> Dict[str, List[Dict]]:
        """Fetch tasks from all active platforms"""
        all_tasks = {}
        
        for platform_name in self.active_platforms:
            platform = self.platforms[platform_name]
            tasks = await platform.fetch_tasks()
            all_tasks[platform_name] = tasks
        
        total = sum(len(tasks) for tasks in all_tasks.values())
        logger.info(f"Fetched {total} total tasks from {len(self.active_platforms)} platforms")
        return all_tasks
    
    async def execute_best_tasks(self, limit: int = 10):
        """Execute the most profitable tasks"""
        all_tasks = await self.fetch_all_tasks()
        
        # Flatten and sort by profitability (reward/time)
        task_list = []
        for platform_name, tasks in all_tasks.items():
            for task in tasks:
                # Calculate hourly rate
                if 'reward' in task:
                    hourly_rate = (task.get('reward', 0) / max(task.get('time_estimate', 1), 1)) * 60
                elif 'payment' in task:
                    hourly_rate = (task.get('payment', 0) / max(task.get('time_estimate', 1), 1)) * 60
                elif 'budget' in task:
                    hourly_rate = (task.get('budget', 0) / max(task.get('deadline_minutes', 60), 1)) * 60
                else:
                    hourly_rate = 0
                
                task_list.append({
                    "platform": platform_name,
                    "task": task,
                    "hourly_rate": hourly_rate
                })
        
        # Sort by hourly rate (highest first)
        task_list.sort(key=lambda x: x['hourly_rate'], reverse=True)
        
        # Execute top tasks
        completed = []
        for item in task_list[:limit]:
            platform = self.platforms[item['platform']]
            result = await platform.complete_task(item['task']['id'])
            
            completed.append({
                "platform": item['platform'],
                "result": result,
                "hourly_rate": item['hourly_rate']
            })
            
            # Update totals
            if 'reward' in result:
                self.total_earnings += result['reward']
            elif 'payment' in result:
                self.total_earnings += result['payment']
            elif 'net_earnings' in result:
                self.total_earnings += result['net_earnings']
            
            self.total_tasks += 1
        
        logger.info(f"Completed {len(completed)} tasks, Total earnings: ${self.total_earnings:.2f}")
        return completed
    
    async def withdraw_all(self, target_amount: float = 100):
        """Withdraw earnings from all platforms"""
        withdrawals = []
        
        for platform_name in self.active_platforms:
            platform = self.platforms[platform_name]
            if platform.earnings >= 10:  # Minimum withdrawal threshold
                amount = min(platform.earnings, target_amount)
                if await platform.withdraw_earnings(amount):
                    withdrawals.append({
                        "platform": platform_name,
                        "amount": amount,
                        "timestamp": datetime.now().isoformat()
                    })
        
        total_withdrawn = sum(w['amount'] for w in withdrawals)
        logger.info(f"Withdrew ${total_withdrawn:.2f} from {len(withdrawals)} platforms")
        return withdrawals
    
    def get_statistics(self) -> Dict:
        """Get platform statistics"""
        stats = {
            "total_earnings": self.total_earnings,
            "total_tasks": self.total_tasks,
            "active_platforms": len(self.active_platforms),
            "platform_breakdown": {}
        }
        
        for name, platform in self.platforms.items():
            stats["platform_breakdown"][name] = {
                "earnings": platform.earnings,
                "tasks": platform.tasks_completed,
                "status": "active" if name in self.active_platforms else "inactive"
            }
        
        return stats


async def main():
    """Test the platform connectors"""
    logging.basicConfig(level=logging.INFO)
    
    manager = PlatformManager()
    await manager.initialize_all()
    
    # Run for a few iterations
    for i in range(3):
        logger.info(f"\n--- Iteration {i+1} ---")
        await manager.execute_best_tasks(limit=5)
        await asyncio.sleep(2)
    
    # Withdraw earnings
    await manager.withdraw_all()
    
    # Display statistics
    stats = manager.get_statistics()
    logger.info(f"\nFinal Statistics: {json.dumps(stats, indent=2)}")

if __name__ == "__main__":
    asyncio.run(main())