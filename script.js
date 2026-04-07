document.addEventListener("DOMContentLoaded", function() {
    
    // --- Balloon Logic (from previous version) ---
    const balloonContainer = document.getElementById('balloon-container');
    if (balloonContainer) {
        const balloonBaseColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8E9E'];
        
        function createBalloon() {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            const color = balloonBaseColors[Math.floor(Math.random() * balloonBaseColors.length)];
            balloon.style.background = `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.7) 0%, ${color} 70%)`;
            
            // Apply knot color (requires JS-injected style for pseudo-element)
            const knotId = 'knot-' + Math.random().toString(36).substring(2, 9);
            balloon.id = knotId;
            const style = document.createElement('style');
            style.innerHTML = `#${knotId}::before { background-color: ${color}; }`;
            document.head.appendChild(style);

            const leftPos = Math.random() * 100;
            const duration = 8 + Math.random() * 8; // 8 to 16 seconds
            const delay = Math.random() * 10;
            
            balloon.style.left = leftPos + '%';
            balloon.style.animationDuration = duration + 's';
            balloon.style.animationDelay = delay + 's';
            
            balloonContainer.appendChild(balloon);
        }

        // Create 15 initial balloons
        for (let i = 0; i < 15; i++) {
            createBalloon();
        }
    }

    // --- NEW: Firework Logic ---
    const fwContainer = document.getElementById('firework-container');
    if (fwContainer) {
        const fwColors = ['#FFD700', '#FF1493', '#00BFFF', '#FF4500', '#ADFF2F', '#FFFFFF'];
        
        function launchFirework() {
            // 1. Setup Launch Trail
            const trail = document.createElement('div');
            trail.className = 'firework-launch';
            
            const startX = 10 + Math.random() * 80; // 10% to 90% width
            const startY = 80 + Math.random() * 15; // Bottom area 80% to 95%
            const peakY = 20 + Math.random() * 30;   // Explosion peak 20% to 50%
            
            trail.style.left = startX + '%';
            trail.style.top = startY + '%';
            
            // Calculate how far the trail needs to travel
            const travelDistance = (startY - peakY); 
            trail.style.height = travelDistance + 'px'; // Trail height is distance to peak

            // The animation timing needs to match when we trigger the explosion
            const launchDuration = 1200; // ms (slightly less than CSS 1.5s)
            
            fwContainer.appendChild(trail);

            // 2. Trigger Explosion after Launch
            setTimeout(() => {
                const color = fwColors[Math.floor(Math.random() * fwColors.length)];
                createExplosion(startX, peakY, color);
                // Remove the trail after the launch completes
                setTimeout(() => trail.remove(), 200);
            }, launchDuration);
        }

        function createExplosion(xPercent, yPercent, color) {
            const particleCount = 40 + Math.random() * 30; // 40-70 particles

            // Coordinate conversion (needed for JS-driven physics)
            const cw = fwContainer.offsetWidth;
            const ch = fwContainer.offsetHeight;
            const originX = (xPercent / 100) * cw;
            const originY = (yPercent / 100) * ch;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                particle.style.color = color; // Used by CSS boxShadow
                particle.style.backgroundColor = color;
                
                // Set Origin position
                particle.style.left = originX + 'px';
                particle.style.top = originY + 'px';

                // Particle Physics Calculations
                const angle = Math.random() * Math.PI * 2; // Random 360 degrees
                const speed = 2 + Math.random() * 6;     // Initial burst speed
                const friction = 0.96;                  // Air resistance
                const gravity = 0.15;                    // Gravity effect
                
                let vx = Math.cos(angle) * speed;
                let vy = Math.sin(angle) * speed;
                let posX = originX;
                let posY = originY;
                let opacity = 1;

                // Animate Particle manually for realistic physics control
                const animationDuration = 1000 + Math.random() * 1000; // 1-2 seconds
                const startTime = Date.now();

                function updateParticle() {
                    const elapsed = Date.now() - startTime;
                    const progress = elapsed / animationDuration;

                    if (progress < 1) {
                        // Apply friction and gravity
                        vx *= friction;
                        vy *= friction;
                        vy += gravity;

                        // Update position
                        posX += vx;
                        posY += vy;
                        opacity = 1 - progress; // Fade out

                        // Apply updates
                        particle.style.transform = `translate(${posX - originX}px, ${posY - originY}px)`;
                        particle.style.opacity = opacity;

                        requestAnimationFrame(updateParticle);
                    } else {
                        particle.remove(); // Cleanup
                    }
                }

                fwContainer.appendChild(particle);
                requestAnimationFrame(updateParticle);
            }
        }

        // --- Start the Fireworks Loop ---
        // Launch a firework immediately
        launchFirework();
        // Launch new fireworks randomly every 2-4 seconds
        setInterval(launchFirework, 2000 + Math.random() * 2000);
    }
});