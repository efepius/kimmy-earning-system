/**
 * Gamification & Achievement System
 * Premium rewards and progression tracking
 */

class AchievementSystem {
    constructor() {
        this.achievements = {
            'first-dollar': {
                id: 'first-dollar',
                name: 'First Dollar',
                description: 'Earn your first dollar',
                icon: '💵',
                points: 10,
                unlocked: false,
                condition: (stats) => stats.totalEarnings >= 1
            },
            'hundred-club': {
                id: 'hundred-club',
                name: 'Hundred Club',
                description: 'Earn $100 in a single day',
                icon: '💯',
                points: 50,
                unlocked: false,
                condition: (stats) => stats.todayEarnings >= 100
            },
            'thousand-milestone': {
                id: 'thousand-milestone',
                name: 'Four Figures',
                description: 'Earn $1,000 total',
                icon: '🎯',
                points: 100,
                unlocked: false,
                condition: (stats) => stats.totalEarnings >= 1000
            },
            'content-creator': {
                id: 'content-creator',
                name: 'Content Machine',
                description: 'Generate 100 pieces of content',
                icon: '🎬',
                points: 75,
                unlocked: false,
                condition: (stats) => stats.contentGenerated >= 100
            },
            'task-master': {
                id: 'task-master',
                name: 'Task Master',
                description: 'Complete 500 platform tasks',
                icon: '✅',
                points: 80,
                unlocked: false,
                condition: (stats) => stats.tasksCompleted >= 500
            },
            'streak-warrior': {
                id: 'streak-warrior',
                name: 'Consistency King',
                description: 'Maintain a 7-day earning streak',
                icon: '🔥',
                points: 60,
                unlocked: false,
                condition: (stats) => stats.streak >= 7
            },
            'multi-platform': {
                id: 'multi-platform',
                name: 'Platform Juggler',
                description: 'Earn from 5+ platforms simultaneously',
                icon: '🎪',
                points: 90,
                unlocked: false,
                condition: (stats) => stats.activePlatforms >= 5
            },
            'efficiency-expert': {
                id: 'efficiency-expert',
                name: 'Efficiency Expert',
                description: 'Achieve $50+ per hour average',
                icon: '⚡',
                points: 120,
                unlocked: false,
                condition: (stats) => stats.hourlyRate >= 50
            },
            'moon-shot': {
                id: 'moon-shot',
                name: 'To The Moon',
                description: 'Earn $10,000 total',
                icon: '🚀',
                points: 500,
                unlocked: false,
                condition: (stats) => stats.totalEarnings >= 10000
            },
            'legendary-earner': {
                id: 'legendary-earner',
                name: 'Legendary Status',
                description: 'Earn $100,000 total',
                icon: '👑',
                points: 1000,
                unlocked: false,
                condition: (stats) => stats.totalEarnings >= 100000
            }
        };
        
        this.userStats = {
            totalEarnings: 0,
            todayEarnings: 0,
            contentGenerated: 0,
            tasksCompleted: 0,
            streak: 0,
            activePlatforms: 0,
            hourlyRate: 0,
            totalPoints: 0,
            level: 1
        };
        
        this.levels = this.generateLevels();
        this.init();
    }
    
    generateLevels() {
        const levels = [];
        for (let i = 1; i <= 100; i++) {
            levels.push({
                level: i,
                pointsRequired: Math.floor(Math.pow(i, 1.5) * 100),
                title: this.getLevelTitle(i),
                rewards: this.getLevelRewards(i)
            });
        }
        return levels;
    }
    
    getLevelTitle(level) {
        const titles = {
            1: 'Beginner',
            5: 'Novice Earner',
            10: 'Apprentice',
            20: 'Professional',
            30: 'Expert',
            40: 'Master',
            50: 'Grandmaster',
            60: 'Elite',
            70: 'Champion',
            80: 'Legend',
            90: 'Mythic',
            100: 'God Tier'
        };
        
        // Find the highest title that applies
        let title = 'Beginner';
        for (const [lvl, t] of Object.entries(titles)) {
            if (level >= parseInt(lvl)) {
                title = t;
            }
        }
        return title;
    }
    
    getLevelRewards(level) {
        const rewards = [];
        
        if (level % 5 === 0) {
            rewards.push({ type: 'badge', value: `Level ${level} Badge` });
        }
        
        if (level % 10 === 0) {
            rewards.push({ type: 'boost', value: `${level}% earnings boost for 24h` });
        }
        
        if (level % 25 === 0) {
            rewards.push({ type: 'unlock', value: 'Premium feature unlock' });
        }
        
        return rewards;
    }
    
    init() {
        this.loadProgress();
        this.createUI();
        this.startTracking();
    }
    
    loadProgress() {
        const saved = localStorage.getItem('kimmy_achievements');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(this.userStats, data.stats);
            
            // Restore unlocked achievements
            for (const id in data.achievements) {
                if (this.achievements[id]) {
                    this.achievements[id].unlocked = data.achievements[id];
                }
            }
        }
    }
    
    saveProgress() {
        const data = {
            stats: this.userStats,
            achievements: {}
        };
        
        for (const id in this.achievements) {
            data.achievements[id] = this.achievements[id].unlocked;
        }
        
        localStorage.setItem('kimmy_achievements', JSON.stringify(data));
    }
    
    createUI() {
        // Create achievement panel
        const panel = document.createElement('div');
        panel.id = 'achievement-panel';
        panel.className = 'achievement-panel';
        panel.innerHTML = `
            <div class="achievement-header">
                <h3>🏆 Achievements</h3>
                <div class="level-display">
                    <span class="level-badge">Level ${this.userStats.level}</span>
                    <span class="level-title">${this.getLevelTitle(this.userStats.level)}</span>
                </div>
                <div class="points-display">
                    <span class="points-icon">⭐</span>
                    <span class="points-value">${this.userStats.totalPoints}</span>
                </div>
            </div>
            <div class="achievement-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="level-progress"></div>
                </div>
                <span class="progress-text">Next level in ${this.getPointsToNextLevel()} points</span>
            </div>
            <div class="achievement-grid" id="achievement-grid">
                <!-- Achievements will be added here -->
            </div>
        `;
        
        // Add styles
        this.injectStyles();
        
        // Find or create container
        let container = document.querySelector('.achievement-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'achievement-container';
            document.body.appendChild(container);
        }
        container.appendChild(panel);
        
        // Populate achievements
        this.updateAchievementGrid();
    }
    
    updateAchievementGrid() {
        const grid = document.getElementById('achievement-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        for (const achievement of Object.values(this.achievements)) {
            const card = document.createElement('div');
            card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
                <div class="achievement-points">+${achievement.points} ⭐</div>
                ${achievement.unlocked ? '<div class="achievement-badge">✓ Unlocked</div>' : ''}
            `;
            
            grid.appendChild(card);
        }
    }
    
    getPointsToNextLevel() {
        const currentLevel = this.userStats.level;
        const nextLevel = this.levels[currentLevel];
        if (!nextLevel) return 0;
        
        return nextLevel.pointsRequired - this.userStats.totalPoints;
    }
    
    updateLevelProgress() {
        const currentLevel = this.userStats.level;
        const nextLevel = this.levels[currentLevel];
        if (!nextLevel) return;
        
        const prevLevel = currentLevel > 1 ? this.levels[currentLevel - 1] : { pointsRequired: 0 };
        const currentLevelPoints = this.userStats.totalPoints - prevLevel.pointsRequired;
        const levelRange = nextLevel.pointsRequired - prevLevel.pointsRequired;
        const progress = (currentLevelPoints / levelRange) * 100;
        
        const progressBar = document.getElementById('level-progress');
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
    }
    
    startTracking() {
        // Listen for stats updates
        window.addEventListener('statsUpdate', (event) => {
            this.updateStats(event.detail);
        });
    }
    
    updateStats(newStats) {
        // Update user stats
        Object.assign(this.userStats, newStats);
        
        // Check for new achievements
        this.checkAchievements();
        
        // Check for level up
        this.checkLevelUp();
        
        // Save progress
        this.saveProgress();
        
        // Update UI
        this.updateAchievementGrid();
        this.updateLevelProgress();
    }
    
    checkAchievements() {
        for (const achievement of Object.values(this.achievements)) {
            if (!achievement.unlocked && achievement.condition(this.userStats)) {
                this.unlockAchievement(achievement);
            }
        }
    }
    
    unlockAchievement(achievement) {
        achievement.unlocked = true;
        this.userStats.totalPoints += achievement.points;
        
        // Show notification
        this.showAchievementNotification(achievement);
        
        // Trigger celebration
        if (window.SuccessCelebration) {
            window.SuccessCelebration.confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
            });
        }
        
        // Play sound
        this.playAchievementSound();
    }
    
    checkLevelUp() {
        const currentLevel = this.userStats.level;
        const nextLevel = this.levels[currentLevel];
        
        if (nextLevel && this.userStats.totalPoints >= nextLevel.pointsRequired) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.userStats.level++;
        const newLevel = this.userStats.level;
        const levelData = this.levels[newLevel - 1];
        
        // Show level up notification
        this.showLevelUpNotification(newLevel, levelData);
        
        // Grant rewards
        if (levelData.rewards.length > 0) {
            this.grantRewards(levelData.rewards);
        }
        
        // Update UI
        const levelBadge = document.querySelector('.level-badge');
        const levelTitle = document.querySelector('.level-title');
        if (levelBadge) levelBadge.textContent = `Level ${newLevel}`;
        if (levelTitle) levelTitle.textContent = this.getLevelTitle(newLevel);
        
        // Epic celebration for milestone levels
        if (newLevel % 10 === 0) {
            this.epicCelebration();
        }
    }
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-icon">${achievement.icon}</div>
            <div class="notification-content">
                <div class="notification-title">Achievement Unlocked!</div>
                <div class="notification-name">${achievement.name}</div>
                <div class="notification-points">+${achievement.points} ⭐</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    showLevelUpNotification(level, levelData) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-badge">LEVEL UP!</div>
            <div class="level-up-number">${level}</div>
            <div class="level-up-title">${levelData.title}</div>
            ${levelData.rewards.length > 0 ? `
                <div class="level-up-rewards">
                    <div class="rewards-title">Rewards:</div>
                    ${levelData.rewards.map(r => `<div class="reward-item">${r.value}</div>`).join('')}
                </div>
            ` : ''}
        `;
        
        document.body.appendChild(notification);
        
        // Animate
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    grantRewards(rewards) {
        for (const reward of rewards) {
            // Implement reward logic based on type
            console.log('Granting reward:', reward);
            // This would connect to your main system to apply boosts, unlock features, etc.
        }
    }
    
    epicCelebration() {
        // Multiple confetti bursts
        const colors = ['#667EEA', '#00FF88', '#FFD700', '#FF6B6B'];
        let delay = 0;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                if (window.SuccessCelebration) {
                    window.SuccessCelebration.confetti({
                        particleCount: 100,
                        spread: 100,
                        colors: colors,
                        origin: { x: Math.random(), y: Math.random() * 0.6 }
                    });
                }
            }, delay);
            delay += 200;
        }
        
        // Show coins animation
        if (window.SuccessCelebration) {
            window.SuccessCelebration.coins();
        }
    }
    
    playAchievementSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRnwGAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YVgGAAA...');
        audio.volume = 0.3;
        audio.play().catch(() => {});
    }
    
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .achievement-container {
                position: fixed;
                right: 20px;
                top: 100px;
                width: 400px;
                max-height: 600px;
                z-index: 100;
            }
            
            .achievement-panel {
                background: linear-gradient(135deg, 
                    rgba(102, 126, 234, 0.1),
                    rgba(118, 75, 162, 0.1));
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 20px;
                color: white;
            }
            
            .achievement-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .level-display {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .level-badge {
                background: linear-gradient(135deg, #667EEA, #764BA2);
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
            }
            
            .points-display {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 1.2em;
            }
            
            .achievement-progress {
                margin-bottom: 20px;
            }
            
            .progress-bar {
                height: 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00FF88, #00D97E);
                transition: width 0.5s ease;
            }
            
            .achievement-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .achievement-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 15px;
                text-align: center;
                transition: all 0.3s;
                position: relative;
            }
            
            .achievement-card.unlocked {
                background: linear-gradient(135deg,
                    rgba(0, 255, 136, 0.1),
                    rgba(0, 217, 126, 0.1));
                border-color: rgba(0, 255, 136, 0.3);
            }
            
            .achievement-card.locked {
                opacity: 0.5;
                filter: grayscale(0.5);
            }
            
            .achievement-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .achievement-icon {
                font-size: 2em;
                margin-bottom: 10px;
            }
            
            .achievement-name {
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .achievement-desc {
                font-size: 0.8em;
                opacity: 0.8;
                margin-bottom: 10px;
            }
            
            .achievement-points {
                font-weight: bold;
                color: #FFD700;
            }
            
            .achievement-badge {
                position: absolute;
                top: 5px;
                right: 5px;
                background: #00FF88;
                color: #000;
                padding: 2px 5px;
                border-radius: 5px;
                font-size: 0.7em;
            }
            
            .achievement-notification,
            .level-up-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: linear-gradient(135deg, #667EEA, #764BA2);
                padding: 30px;
                border-radius: 20px;
                color: white;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .achievement-notification.show,
            .level-up-notification.show {
                transform: translate(-50%, -50%) scale(1);
            }
            
            .notification-icon {
                font-size: 3em;
                margin-bottom: 10px;
            }
            
            .notification-title {
                font-size: 1.5em;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .level-up-badge {
                font-size: 2em;
                font-weight: bold;
                background: linear-gradient(45deg, #FFD700, #FFA500);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 10px;
            }
            
            .level-up-number {
                font-size: 4em;
                font-weight: bold;
                margin-bottom: 10px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.achievementSystem = new AchievementSystem();
    });
} else {
    window.achievementSystem = new AchievementSystem();
}