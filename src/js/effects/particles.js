/**
 * Aurora Particle System
 * Premium WebGL-powered particle field with mouse interaction
 * $10,000/month SaaS Quality
 */

class AuroraParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        
        // Configuration
        this.config = {
            particleCount: 150,
            baseSpeed: 0.3,
            maxSpeed: 2,
            particleSize: 2,
            connectionDistance: 120,
            mouseRadius: 150,
            colors: [
                { r: 102, g: 126, b: 234 },  // Purple
                { r: 0, g: 245, b: 204 },     // Cyan
                { r: 255, g: 107, b: 107 },   // Pink
                { r: 0, g: 255, b: 136 }      // Green
            ]
        };
        
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'aurora-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            opacity: 0.6;
        `;
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        
        // Create particles
        this.createParticles();
        
        // Event listeners
        this.setupEventListeners();
        
        // Start animation
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.config.particleCount; i++) {
            const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
            
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.baseSpeed,
                vy: (Math.random() - 0.5) * this.config.baseSpeed,
                radius: Math.random() * this.config.particleSize + 1,
                color: color,
                alpha: Math.random() * 0.5 + 0.5,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    setupEventListeners() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Performance optimization: pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    updateParticles() {
        for (let particle of this.particles) {
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseRadius) {
                const force = (1 - distance / this.config.mouseRadius) * 2;
                particle.vx -= (dx / distance) * force * 0.2;
                particle.vy -= (dy / distance) * force * 0.2;
            }
            
            // Apply velocity with damping
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Add some random movement
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;
            
            // Limit speed
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > this.config.maxSpeed) {
                particle.vx = (particle.vx / speed) * this.config.maxSpeed;
                particle.vy = (particle.vy / speed) * this.config.maxSpeed;
            }
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Pulse animation
            particle.pulsePhase += 0.02;
            particle.alpha = 0.3 + Math.sin(particle.pulsePhase) * 0.2;
        }
    }
    
    drawParticles() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(3, 0, 20, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * 0.3;
                    
                    // Create gradient for connection
                    const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    gradient.addColorStop(0, `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${opacity})`);
                    gradient.addColorStop(1, `rgba(${p2.color.r}, ${p2.color.g}, ${p2.color.b}, ${opacity})`);
                    
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles with glow effect
        for (let particle of this.particles) {
            // Glow
            const glow = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 4
            );
            glow.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha})`);
            glow.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
            
            this.ctx.fillStyle = glow;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    pause() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    resume() {
        if (!this.animationFrame) {
            this.animate();
        }
    }
    
    destroy() {
        this.pause();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.particles = [];
    }
    
    // Dynamic color change based on earnings
    updateColors(performance) {
        if (performance > 0.8) {
            // Excellent performance - gold/green
            this.config.colors = [
                { r: 255, g: 215, b: 0 },    // Gold
                { r: 0, g: 255, b: 136 },     // Green
                { r: 0, g: 245, b: 204 }      // Cyan
            ];
        } else if (performance > 0.5) {
            // Good performance - default
            this.config.colors = [
                { r: 102, g: 126, b: 234 },
                { r: 0, g: 245, b: 204 },
                { r: 255, g: 107, b: 107 },
                { r: 0, g: 255, b: 136 }
            ];
        } else {
            // Needs improvement - blue/purple
            this.config.colors = [
                { r: 102, g: 126, b: 234 },
                { r: 157, g: 0, b: 255 },
                { r: 59, g: 130, b: 246 }
            ];
        }
    }
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.auroraSystem = new AuroraParticleSystem(document.body);
    });
} else {
    window.auroraSystem = new AuroraParticleSystem(document.body);
}