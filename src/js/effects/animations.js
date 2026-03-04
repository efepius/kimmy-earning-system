/**
 * Premium Animations & Micro-interactions
 * GSAP-powered effects for $10,000/month SaaS experience
 */

class PremiumAnimations {
    constructor() {
        this.init();
        this.magneticElements = [];
        this.counters = new Map();
    }
    
    init() {
        this.loadGSAP();
        this.setupScrollAnimations();
        this.initializeMagneticButtons();
        this.initializeCardEffects();
        this.initializeCounters();
    }
    
    loadGSAP() {
        // Load GSAP from CDN
        const scripts = [
            'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js',
            'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/ScrollTrigger.min.js',
            'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/TextPlugin.min.js'
        ];
        
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            document.head.appendChild(script);
        });
    }
    
    // ========== SCROLL ANIMATIONS ==========
    setupScrollAnimations() {
        // Wait for GSAP to load
        const checkGSAP = setInterval(() => {
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                clearInterval(checkGSAP);
                gsap.registerPlugin(ScrollTrigger);
                this.initScrollEffects();
            }
        }, 100);
    }
    
    initScrollEffects() {
        // Reveal cards on scroll
        gsap.utils.toArray('.card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                y: 100,
                opacity: 0,
                duration: 1,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });
        
        // Parallax background elements
        gsap.utils.toArray('[data-speed]').forEach(element => {
            const speed = element.dataset.speed;
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                },
                y: (100 * speed) + 'px',
                ease: 'none'
            });
        });
    }
    
    // ========== MAGNETIC BUTTONS ==========
    initializeMagneticButtons() {
        document.querySelectorAll('button, .magnetic').forEach(element => {
            const magnetic = new MagneticElement(element);
            this.magneticElements.push(magnetic);
        });
    }
    
    // ========== 3D CARD EFFECTS ==========
    initializeCardEffects() {
        document.querySelectorAll('.card').forEach(card => {
            new Card3D(card);
        });
    }
    
    // ========== ANIMATED COUNTERS ==========
    initializeCounters() {
        document.querySelectorAll('[data-counter]').forEach(element => {
            const counter = new AnimatedCounter(element);
            this.counters.set(element.id, counter);
        });
    }
    
    // Public method to update counter
    updateCounter(id, newValue) {
        const counter = this.counters.get(id);
        if (counter) {
            counter.animateTo(newValue);
        }
    }
}

// ========== MAGNETIC ELEMENT CLASS ==========
class MagneticElement {
    constructor(element) {
        this.element = element;
        this.boundingRect = element.getBoundingClientRect();
        this.magnetStrength = 0.3;
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        // Create wrapper for smooth transforms
        const wrapper = document.createElement('div');
        wrapper.style.display = 'inline-block';
        this.element.parentNode.insertBefore(wrapper, this.element);
        wrapper.appendChild(this.element);
        this.wrapper = wrapper;
        
        // Event listeners
        this.element.addEventListener('mouseenter', () => this.activate());
        this.element.addEventListener('mouseleave', () => this.deactivate());
        this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }
    
    activate() {
        this.isActive = true;
        this.boundingRect = this.element.getBoundingClientRect();
    }
    
    deactivate() {
        this.isActive = false;
        if (typeof gsap !== 'undefined') {
            gsap.to(this.element, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }
    
    onMouseMove(e) {
        if (!this.isActive || typeof gsap === 'undefined') return;
        
        const centerX = this.boundingRect.left + this.boundingRect.width / 2;
        const centerY = this.boundingRect.top + this.boundingRect.height / 2;
        
        const deltaX = (e.clientX - centerX) * this.magnetStrength;
        const deltaY = (e.clientY - centerY) * this.magnetStrength;
        
        gsap.to(this.element, {
            x: deltaX,
            y: deltaY,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
}

// ========== 3D CARD CLASS ==========
class Card3D {
    constructor(card) {
        this.card = card;
        this.inner = card.querySelector('.card-inner') || card;
        this.shine = null;
        
        this.init();
    }
    
    init() {
        // Add perspective to parent
        this.card.style.perspective = '1000px';
        this.card.style.transformStyle = 'preserve-3d';
        
        // Create shine effect
        this.createShineEffect();
        
        // Event listeners
        this.card.addEventListener('mouseenter', () => this.onMouseEnter());
        this.card.addEventListener('mouseleave', () => this.onMouseLeave());
        this.card.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }
    
    createShineEffect() {
        this.shine = document.createElement('div');
        this.shine.className = 'card-shine';
        this.shine.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                105deg,
                transparent 40%,
                rgba(255, 255, 255, 0.3) 50%,
                transparent 60%
            );
            pointer-events: none;
            transform: translateX(-100%);
            transition: transform 0.6s;
            z-index: 1;
        `;
        this.card.appendChild(this.shine);
    }
    
    onMouseEnter() {
        if (typeof gsap !== 'undefined') {
            gsap.to(this.card, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        // Shine effect
        this.shine.style.transform = 'translateX(100%)';
    }
    
    onMouseLeave() {
        if (typeof gsap !== 'undefined') {
            gsap.to(this.inner, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
            gsap.to(this.card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        // Reset shine
        setTimeout(() => {
            this.shine.style.transform = 'translateX(-100%)';
        }, 100);
    }
    
    onMouseMove(e) {
        if (typeof gsap === 'undefined') return;
        
        const rect = this.card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        gsap.to(this.inner, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
}

// ========== ANIMATED COUNTER CLASS ==========
class AnimatedCounter {
    constructor(element) {
        this.element = element;
        this.currentValue = 0;
        this.targetValue = 0;
        this.prefix = element.dataset.prefix || '';
        this.suffix = element.dataset.suffix || '';
        this.decimals = parseInt(element.dataset.decimals) || 0;
        this.duration = parseInt(element.dataset.duration) || 2000;
        
        this.init();
    }
    
    init() {
        // Get initial value from element
        const text = this.element.textContent;
        const numberMatch = text.match(/[\d,\.]+/);
        if (numberMatch) {
            this.currentValue = parseFloat(numberMatch[0].replace(/,/g, ''));
        }
    }
    
    animateTo(newValue) {
        this.targetValue = newValue;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(this, {
                currentValue: newValue,
                duration: this.duration / 1000,
                ease: 'power2.out',
                onUpdate: () => this.updateDisplay()
            });
        } else {
            // Fallback animation
            const startTime = Date.now();
            const startValue = this.currentValue;
            const diff = newValue - startValue;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / this.duration, 1);
                
                // Easing function
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                this.currentValue = startValue + (diff * easeProgress);
                this.updateDisplay();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            animate();
        }
    }
    
    updateDisplay() {
        const formattedValue = this.formatNumber(this.currentValue);
        this.element.textContent = `${this.prefix}${formattedValue}${this.suffix}`;
        
        // Add pulse effect on milestone
        if (this.currentValue % 100 === 0 && this.currentValue > 0) {
            this.element.classList.add('pulse');
            setTimeout(() => this.element.classList.remove('pulse'), 500);
        }
    }
    
    formatNumber(value) {
        const fixed = value.toFixed(this.decimals);
        return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

// ========== SUCCESS CELEBRATIONS ==========
class SuccessCelebration {
    static confetti(options = {}) {
        const defaults = {
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        };
        
        // Load confetti library if not loaded
        if (typeof confetti === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
            script.onload = () => {
                confetti({ ...defaults, ...options });
            };
            document.head.appendChild(script);
        } else {
            confetti({ ...defaults, ...options });
        }
    }
    
    static coins() {
        // Create falling coins animation
        const container = document.createElement('div');
        container.className = 'coins-celebration';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        for (let i = 0; i < 20; i++) {
            const coin = document.createElement('div');
            coin.style.cssText = `
                position: absolute;
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #FFD700, #FFA500);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: -50px;
                animation: fall ${2 + Math.random() * 2}s ease-in forwards;
                animation-delay: ${Math.random() * 0.5}s;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            `;
            coin.innerHTML = '$';
            coin.style.display = 'flex';
            coin.style.alignItems = 'center';
            coin.style.justifyContent = 'center';
            coin.style.color = '#fff';
            coin.style.fontWeight = 'bold';
            container.appendChild(coin);
        }
        
        document.body.appendChild(container);
        
        // Remove after animation
        setTimeout(() => {
            container.remove();
        }, 4000);
    }
    
    static achievement(text) {
        const achievement = document.createElement('div');
        achievement.className = 'achievement-popup';
        achievement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: linear-gradient(135deg, #667EEA, #764BA2);
            padding: 30px 50px;
            border-radius: 20px;
            color: white;
            font-size: 1.5em;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: achievementPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        `;
        achievement.textContent = text;
        
        document.body.appendChild(achievement);
        
        // Add sound effect
        this.playSound('achievement');
        
        // Remove after animation
        setTimeout(() => {
            achievement.style.animation = 'achievementFade 0.3s ease-out forwards';
            setTimeout(() => achievement.remove(), 300);
        }, 3000);
    }
    
    static playSound(type) {
        const sounds = {
            achievement: 'https://www.soundjay.com/misc/bell-ringing-05.wav',
            coin: 'https://www.soundjay.com/misc/coin-drop-1.wav',
            success: 'https://www.soundjay.com/misc/bell-ringing-01.wav'
        };
        
        const audio = new Audio(sounds[type] || sounds.success);
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore autoplay errors
    }
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            top: 100%;
            transform: rotate(360deg);
        }
    }
    
    @keyframes achievementPop {
        to {
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes achievementFade {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
    
    .pulse {
        animation: pulse 0.5s ease-out;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.premiumAnimations = new PremiumAnimations();
    });
} else {
    window.premiumAnimations = new PremiumAnimations();
}

// Export for use in other modules
window.SuccessCelebration = SuccessCelebration;