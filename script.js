/* ==========================================================================
   APPLICATION LOGIC FOR BIRTHDAY SURPRISE WEBSITE
   Theme: Pink Romantic
   Author: Adarsh (for Pritii)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- Safe Fallbacks for CDN Libraries ---
    const gsap = window.gsap || {
        to: (element, options) => {
            const duration = (options.duration || 0.5) * 1000;
            element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            if (options.opacity !== undefined) {
                element.style.opacity = options.opacity;
            }
            if (options.scale !== undefined) {
                element.style.transform = `scale(${options.scale})`;
            }
            setTimeout(() => {
                if (options.onComplete) options.onComplete();
            }, duration);
        }
    };

    const safeConfetti = (options) => {
        if (typeof window.confetti === 'function') {
            window.confetti(options);
        } else {
            console.log("Confetti burst: ", options);
        }
    };

    // --- DOM Elements ---
    const loader = document.getElementById('loader');
    const loadProgress = document.getElementById('load-progress');
    const loadPercent = document.getElementById('load-percent');
    
    const passwordScreen = document.getElementById('password-screen');
    const passInput = document.getElementById('pass-input');
    const btnUnlock = document.getElementById('btn-unlock');
    const errorMsg = document.getElementById('error-msg');
    
    const countdownOverlay = document.getElementById('countdown-overlay');
    const countdownText = document.getElementById('countdown-text');
    
    const mainContent = document.getElementById('main-content');
    const btnStartSurprise = document.getElementById('btn-start-surprise');
    
    const bgMusic = document.getElementById('bg-music');
    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnVolume = document.getElementById('btn-volume');
    const musicWidget = document.getElementById('music-widget');
    
    const heartsGenerator = document.getElementById('hearts-generator');
    
    const btnReadGallery = document.getElementById('btn-read-gallery');
    const btnReadReasons = document.getElementById('btn-read-reasons');
    const btnGoToCake = document.getElementById('btn-go-to-cake');
    
    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
    const lightboxNextBtn = document.getElementById('lightbox-next-btn');
    
    // Cake & Candles
    const flame = document.getElementById('flame-1');
    const smoke = document.getElementById('smoke-1');
    const btnCutCake = document.getElementById('btn-cut-cake');
    const cakeWrapper = document.querySelector('.cake-wrapper');
    const wishInstruction = document.getElementById('wish-instruction');
    
    // Gift Box
    const giftBox = document.getElementById('box-wrap');
    const btnOpenGift = document.getElementById('btn-open-gift');
    const btnGoFinal = document.getElementById('btn-go-final');
    
    // Final Celebration
    const finalSection = document.getElementById('final-section');
    const btnReplay = document.getElementById('btn-replay');
    
    // Scroll to Top
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    // --- State variables ---
    let currentPhotoIndex = 0;
    const totalPhotos = 12;
    let isMusicPlaying = false;
    let isMuted = false;
    let candleBlownOut = false;
    let cakeCut = false;
    let giftOpened = false;

    // ==================== 1. LOADING SCREEN LOGIC ====================
    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            
            // Fade out loader with GSAP and show password screen
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    loader.style.display = 'none';
                    passwordScreen.classList.remove('hidden-screen');
                    
                    // Beautiful entry animation for password card
                    const passwordCard = document.querySelector('.password-card');
                    if (passwordCard) {
                        passwordCard.style.opacity = '0';
                        passwordCard.style.transform = 'scale(0.85)';
                        gsap.to(passwordCard, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.8,
                            ease: "back.out(1.7)"
                        });
                    }
                    
                    passInput.focus();
                }
            });
        }
        loadProgress.style.width = `${progress}%`;
        loadPercent.innerText = `${progress}%`;
    }, 45);

    // ==================== 2. PASSWORD VALIDATION ====================
    function checkPassword() {
        const correctPassword = "20";
        const enteredVal = passInput.value.trim();
        
        if (enteredVal === correctPassword) {
            errorMsg.innerText = "";
            
            // Password success transition
            gsap.to(passwordScreen, {
                opacity: 0,
                scale: 0.9,
                duration: 0.6,
                onComplete: () => {
                    passwordScreen.classList.add('hidden-screen');
                    
                    // Automatically try playing music
                    playMusic();
                    
                    // Show Music widget
                    musicWidget.classList.add('show');
                    
                    // Start countdown
                    triggerCountdown();
                }
            });
        } else {
            // Shake input card on error
            const card = document.querySelector('.password-card');
            card.classList.add('shake-anim');
            passInput.value = "";
            errorMsg.innerText = "❌ Incorrect key. Hints: Double decades or look closer! 😉";
            
            setTimeout(() => {
                card.classList.remove('shake-anim');
            }, 500);
        }
    }

    btnUnlock.addEventListener('click', checkPassword);
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    // ==================== 3. COUNTDOWN OVERLAY ====================
    function triggerCountdown() {
        countdownOverlay.classList.remove('hidden-screen');
        let count = 3;
        countdownText.innerText = count;
        countdownText.classList.add('countdown-scale-up');

        const interval = setInterval(() => {
            count--;
            countdownText.classList.remove('countdown-scale-up');
            
            setTimeout(() => {
                if (count > 0) {
                    countdownText.innerText = count;
                    countdownText.classList.add('countdown-scale-up');
                } else if (count === 0) {
                    countdownText.innerText = "Happy Birthday Pritii! ❤️";
                    countdownText.style.fontSize = "4.5rem";
                    countdownText.classList.add('countdown-scale-up');
                } else {
                    clearInterval(interval);
                    
                    // Fade out countdown screen
                    gsap.to(countdownOverlay, {
                        opacity: 0,
                        duration: 0.8,
                        onComplete: () => {
                            countdownOverlay.classList.add('hidden-screen');
                            
                            // Load Main App
                            mainContent.classList.remove('hidden-screen');
                            
                            // Initialize Animate On Scroll (if loaded)
                            if (window.AOS) {
                                window.AOS.init({
                                    duration: 800,
                                    easing: 'ease-out-back',
                                    once: true
                                });
                            }
                            
                            // Start Background heart particle generator
                            startFloatingHearts();
                        }
                    });
                }
            }, 100);
        }, 1200);
    }

    // ==================== 4. MUSIC CONTROLS ====================
    function playMusic() {
        bgMusic.play()
            .then(() => {
                isMusicPlaying = true;
                btnPlayPause.innerHTML = `<i class="fa-solid fa-compact-disc music-note-animated"></i>`;
            })
            .catch(err => {
                console.log("Audio playback require user interaction: ", err);
                isMusicPlaying = false;
                btnPlayPause.innerHTML = `<i class="fa-solid fa-music"></i>`;
            });
    }

    function togglePlayPause() {
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            btnPlayPause.innerHTML = `<i class="fa-solid fa-music"></i>`;
        } else {
            bgMusic.play();
            isMusicPlaying = true;
            btnPlayPause.innerHTML = `<i class="fa-solid fa-compact-disc music-note-animated"></i>`;
        }
    }

    function toggleVolume() {
        if (isMuted) {
            bgMusic.volume = 1.0;
            isMuted = false;
            btnVolume.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
        } else {
            bgMusic.volume = 0.0;
            isMuted = true;
            btnVolume.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
        }
    }

    btnPlayPause.addEventListener('click', togglePlayPause);
    btnVolume.addEventListener('click', toggleVolume);

    // ==================== 5. FLOATING HEARTS GENERATOR ====================
    function startFloatingHearts() {
        // Generate a heart every 450ms in the home section
        setInterval(() => {
            if (document.hidden) return; // Save memory if tab is inactive
            
            const heart = document.createElement('i');
            heart.classList.add('fa-solid', 'fa-heart', 'floating-heart');
            
            const size = Math.random() * 25 + 12; // size between 12px and 37px
            const left = Math.random() * 100; // random horizontal position
            const duration = Math.random() * 6 + 6; // random duration between 6s and 12s
            const opacity = Math.random() * 0.4 + 0.2; // opacity 0.2 to 0.6
            
            heart.style.fontSize = `${size}px`;
            heart.style.left = `${left}%`;
            heart.style.animationDuration = `${duration}s`;
            heart.style.opacity = opacity;
            
            // Random color shades of pink
            const colors = ['rgba(255, 77, 121, 0.4)', 'rgba(255, 141, 161, 0.4)', 'rgba(255, 182, 193, 0.4)'];
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            heartsGenerator.appendChild(heart);
            
            // Remove after animation finishes
            setTimeout(() => {
                heart.remove();
            }, duration * 1000);
        }, 450);
    }

    // Navigation buttons smooth scrolling
    btnStartSurprise.addEventListener('click', () => {
        document.getElementById('letter-section').scrollIntoView({ behavior: 'smooth' });
        // Start Typed.js love letter when scrolling starts
        initializeLoveLetter();
    });

    btnReadGallery.addEventListener('click', () => {
        document.getElementById('gallery-section').scrollIntoView({ behavior: 'smooth' });
    });

    btnReadReasons.addEventListener('click', () => {
        document.getElementById('reasons-section').scrollIntoView({ behavior: 'smooth' });
    });

    btnGoToCake.addEventListener('click', () => {
        document.getElementById('cake-section').scrollIntoView({ behavior: 'smooth' });
    });

    // ==================== 6. TYPED.JS LOVE LETTER ====================
    let typedInitialized = false;
    function initializeLoveLetter() {
        if (typedInitialized) return;
        typedInitialized = true;
        
        const letterText = "My Dearest Pritii,<br><br>" +
                           "Happy Birthday to the most beautiful, caring, and incredible girl in the universe!<br><br>" +
                           "Every single day spent with you feels like a beautiful dream. You fill my heart with so much laughter, warmth, and complete happiness.<br>" +
                           "I am so incredibly lucky to call you mine, and today is all about celebrating the wonderful person you are.<br><br>" +
                           "May your day be filled with all the sweet joy and surprises you deserve, and may all your dreams start to blossom this year.<br><br>" +
                           "Forever & always Yours,<br>" +
                           "<strong>Adarsh</strong> ❤️";

        if (window.Typed) {
            new window.Typed('#typed-letter-content', {
                strings: [letterText],
                typeSpeed: 38,
                backSpeed: 0,
                showCursor: true,
                cursorChar: '|',
                loop: false,
                contentType: 'html'
            });
        } else {
            // Static text fallback if Typed CDN is unavailable
            const typedContent = document.getElementById('typed-letter-content');
            if (typedContent) {
                typedContent.innerHTML = letterText;
            }
        }
    }

    // ==================== 7. PHOTO GALLERY LIGHTBOX ====================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentPhotoIndex = index;
            openLightbox(index + 1);
        });
    });

    function getPhotoPath(photoNumber) {
        const ext = photoNumber <= 3 ? 'jpg' : 'jpeg';
        return `assets/images/Photo${photoNumber}.${ext}`;
    }

    function openLightbox(photoNumber) {
        lightboxImg.src = getPhotoPath(photoNumber);
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = ''; // Enable page scrolling
    }

    function showNextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos;
        lightboxImg.src = getPhotoPath(currentPhotoIndex + 1);
    }

    function showPrevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
        lightboxImg.src = getPhotoPath(currentPhotoIndex + 1);
    }

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightboxNextBtn.addEventListener('click', showNextPhoto);
    lightboxPrevBtn.addEventListener('click', showPrevPhoto);
    
    // Close lightbox on click outside the image container
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard support for Gallery Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('show')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextPhoto();
            if (e.key === 'ArrowLeft') showPrevPhoto();
        }
    });

    // ==================== 8. CAKE & CANDLE BLOW INTERACTION ====================
    flame.addEventListener('click', () => {
        if (candleBlownOut) return;
        
        // Extinguish Flame
        flame.classList.add('out');
        candleBlownOut = true;
        
        // Trigger puff of smoke
        smoke.classList.add('smoke-puff');
        
        // Confetti spark when blown
        safeConfetti({
            particleCount: 40,
            angle: 90,
            spread: 45,
            origin: { x: 0.5, y: 0.6 }
        });
        
        // Change instruction banner
        wishInstruction.innerHTML = `<i class="fa-solid fa-gift"></i> Yay! Make a wish and click "Cut the Cake"!`;
        wishInstruction.style.color = '#2ecc71';
        wishInstruction.style.borderColor = '#2ecc71';
        
        // Enable Cut Cake button
        btnCutCake.removeAttribute('disabled');
        btnCutCake.classList.add('pulse-effect');
    });

    btnCutCake.addEventListener('click', () => {
        if (!candleBlownOut || cakeCut) return;
        cakeCut = true;
        
        btnCutCake.setAttribute('disabled', 'true');
        btnCutCake.classList.remove('pulse-effect');
        btnCutCake.innerText = "Cake Cut! 🍰";
        
        // Cut slicing effect
        cakeWrapper.classList.add('cut-active');
        
        // Large confetti burst
        safeConfetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
        
        // Celebration music/sound triggers or second confetti loop after 500ms
        setTimeout(() => {
            safeConfetti({
                particleCount: 100,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            safeConfetti({
                particleCount: 100,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 500);

        // Smooth scroll to gift section after delay
        setTimeout(() => {
            document.getElementById('gift-section').scrollIntoView({ behavior: 'smooth' });
        }, 2200);
    });

    // ==================== 9. GIFT BOX INTERACTION ====================
    function openGift() {
        if (giftOpened) return;
        giftOpened = true;
        
        // Add opened state styles
        giftBox.classList.add('opened');
        
        // Confetti burst of hearts
        const duration = 3 * 1000;
        const end = Date.now() + duration;
        
        (function frame() {
            safeConfetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0.3, y: 0.6 },
                colors: ['#ff4d79', '#ff8da1', '#ffd166']
            });
            safeConfetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 0.7, y: 0.6 },
                colors: ['#ff4d79', '#ff8da1', '#ffd166']
            });
            
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Hide open button, show see fireworks button
        btnOpenGift.classList.add('hidden-btn');
        btnGoFinal.classList.remove('hidden-btn');
        btnGoFinal.classList.add('pulse-effect');
    }

    btnOpenGift.addEventListener('click', openGift);
    giftBox.addEventListener('click', openGift);

    btnGoFinal.addEventListener('click', () => {
        document.getElementById('final-section').scrollIntoView({ behavior: 'smooth' });
        // Automatically launch full-screen canvas fireworks and floating balloons
        startFinalCelebration();
    });

    // ==================== 10. FIREWORKS CANVAS & CELEBRATION ====================
    let fireworksActive = false;
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let fireworkList = [];

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', () => {
        if (fireworksActive) resizeCanvas();
    });

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * (canvas.height * 0.5) + 50;
            this.speed = Math.random() * 4 + 7;
            this.hue = Math.random() * 360;
            this.exploded = false;
        }

        update() {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.exploded = true;
                this.explode();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
            ctx.fill();
        }

        explode() {
            const count = 80;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(this.x, this.y, this.hue));
            }
        }
    }

    class Particle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.hue = hue;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 5 + 2;
            this.gravity = 0.08;
            this.friction = 0.96;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue}, 100%, 65%)`;
            ctx.fill();
            ctx.restore();
        }
    }

    function fireworksLoop() {
        if (!fireworksActive) return;
        
        ctx.fillStyle = 'rgba(21, 2, 9, 0.2)'; // Dark romantic trail fade matching final-section gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Spawn fireworks randomly
        if (Math.random() < 0.04) {
            fireworkList.push(new Firework());
        }

        for (let i = fireworkList.length - 1; i >= 0; i--) {
            fireworkList[i].update();
            if (fireworkList[i].exploded) {
                fireworkList.splice(i, 1);
            } else {
                fireworkList[i].draw();
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            } else {
                particles[i].draw();
            }
        }

        requestAnimationFrame(fireworksLoop);
    }

    let balloonTimer;
    function startFinalCelebration() {
        if (fireworksActive) return;
        fireworksActive = true;
        resizeCanvas();
        fireworksLoop();

        // Launch side confetti bursts every few seconds
        const finalConfettiTimer = setInterval(() => {
            if (!fireworksActive) {
                clearInterval(finalConfettiTimer);
                return;
            }
            safeConfetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            safeConfetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 4000);

        // Generate floating balloons
        generateBalloons();
    }

    function generateBalloons() {
        const balloonContainer = document.createElement('div');
        balloonContainer.classList.add('balloon-generator');
        finalSection.appendChild(balloonContainer);

        const colors = [
            'linear-gradient(135deg, #ff4d79 0%, #ff8da1 100%)',
            'linear-gradient(135deg, #70e000 0%, #38b000 100%)',
            'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
            'linear-gradient(135deg, #ffd166 0%, #f7a072 100%)',
            'linear-gradient(135deg, #f72585 0%, #7209b7 100%)'
        ];

        balloonTimer = setInterval(() => {
            if (!fireworksActive) {
                clearInterval(balloonTimer);
                return;
            }
            const balloon = document.createElement('div');
            balloon.classList.add('balloon');
            
            const string = document.createElement('div');
            string.classList.add('balloon-string');
            balloon.appendChild(string);
            
            const left = Math.random() * 90;
            const size = Math.random() * 30 + 80; // Width 80px to 110px
            const duration = Math.random() * 8 + 10; // Float duration 10s to 18s
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            balloon.style.left = `${left}%`;
            balloon.style.width = `${size}px`;
            balloon.style.height = `${size * 1.25}px`;
            balloon.style.background = color;
            balloon.style.animationDuration = `${duration}s`;
            
            balloonContainer.appendChild(balloon);

            setTimeout(() => {
                balloon.remove();
            }, duration * 1000);
        }, 1500);
    }

    // ==================== 11. REPLAY / RESET APP ====================
    btnReplay.addEventListener('click', () => {
        // Stop animations
        fireworksActive = false;
        clearInterval(balloonTimer);
        const balloonContainers = document.querySelectorAll('.balloon-generator');
        balloonContainers.forEach(container => container.remove());
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset states
        candleBlownOut = false;
        cakeCut = false;
        giftOpened = false;

        // Reset visual components
        flame.classList.remove('out');
        smoke.classList.remove('smoke-puff');
        btnCutCake.setAttribute('disabled', 'true');
        btnCutCake.classList.remove('pulse-effect');
        btnCutCake.innerText = "Cut the Cake 🔪";
        cakeWrapper.classList.remove('cut-active');
        wishInstruction.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Click on the candle flame to blow it out!`;
        wishInstruction.style.color = 'var(--primary)';
        wishInstruction.style.borderColor = 'rgba(255, 77, 121, 0.15)';

        giftBox.classList.remove('opened');
        btnOpenGift.classList.remove('hidden-btn');
        btnGoFinal.classList.add('hidden-btn');
        btnGoFinal.classList.remove('pulse-effect');

        // Scroll back to Home Page
        document.getElementById('home-section').scrollIntoView({ behavior: 'smooth' });
    });

    // ==================== 12. SCROLL TO TOP & HINT ACTIONS ====================
    window.addEventListener('scroll', () => {
        // Toggle scroll to top button visibility
        if (window.scrollY > 500) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        document.getElementById('home-section').scrollIntoView({ behavior: 'smooth' });
    });
});
