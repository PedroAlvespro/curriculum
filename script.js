document.addEventListener('DOMContentLoaded', () => {

    // 0. INTRO SCREEN & REVEAL
    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        if(intro) intro.classList.add('fade-out');
        document.querySelectorAll('.content-hidden').forEach(el => el.classList.add('visible'));
    }, 2000);

    // 0.1 THEME TOGGLE
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const body = document.body;
            if (body.classList.contains('theme-aurora')) {
                body.classList.replace('theme-aurora', 'theme-dark');
                themeToggle.innerHTML = '<i class="ph ph-moon"></i>';
            } else {
                body.classList.replace('theme-dark', 'theme-aurora');
                themeToggle.innerHTML = '<i class="ph ph-magic-wand"></i>';
            }
        });
    }

    // 0.2 MOBILE MENU TOGGLE
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.getElementById('nav-links');
    if (mobileBtn && navLinksContainer) {
        mobileBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });

        // Fechar menu ao clicar em um link
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon && icon.classList.contains('ph-x')) {
                    icon.classList.replace('ph-x', 'ph-list');
                }
            });
        });
    }

    // 1. GERADOR DE ESTRELAS NO BACKGROUND
    const starsContainer = document.querySelector('.stars');
    const numStars = 100;

    for (let i = 0; i < numStars; i++) {
        createStar();
    }

    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Posição aleatória
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Tamanho aleatório (0.5px a 2.5px)
        const size = Math.random() * 2 + 0.5;
        
        // Animação aleatória
        const duration = Math.random() * 3 + 1;
        const delay = Math.random() * 3;

        star.style.left = `${x}vw`;
        star.style.top = `${y}vh`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;

        starsContainer.appendChild(star);
    }

    // 2. GERADOR DE ESTRELAS CADENTES
    const shootingStarsContainer = document.querySelector('.shooting-stars');
    
    function spawnShootingStar() {
        // Só renderizar se a página não estiver inativa ou se o usuário não pediu (Opcional)
        const star = document.createElement('div');
        star.classList.add('shooting-star');
        
        // Começa em algum lugar no topo fora da tela
        const startX = Math.random() * 150; // Para garantir que cruza a tela toda
        star.style.left = `${startX}vw`;
        star.style.top = `-20vh`;
        
        shootingStarsContainer.appendChild(star);
        
        // Remove a estrela após 1.5s (duração da animação CSS)
        setTimeout(() => {
            star.remove();
        }, 1500);
    }

    // Spawna estrela cadente com bastante frequência (entre 1s e 5s)
    function randomShootingStarInterval() {
        spawnShootingStar();
        const nextTime = Math.random() * 4000 + 1000;
        setTimeout(randomShootingStarInterval, nextTime);
    }
    
    setTimeout(randomShootingStarInterval, 1000);

    // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: deixar de observar após aparecer para performance
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.15, // Pelo menos 15% visível para ativar
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. ATUALIZAR NAVBAR ATIVA NO SCROLL
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.navbar a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = 'var(--text-primary)';
            if (link.getAttribute('href').substring(1) === current) {
                link.style.color = 'var(--accent-primary)';
            }
        });
    });

    // 5. EFEITO HOVER MOUSE NAS CARDS (Glow Effect)
    // Opcional: Um pequeno efeito de brilho que segue o mouse nas glass cards
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Adiciona um highlight suave na posição do mouse
            card.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(255, 255, 255, 0.08) 0%,
                    var(--glass-bg) 60%
                )
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            // Retorna ao background original
            card.style.background = 'var(--glass-bg)';
        });
    });

    // 6. CANVAS PARTICLES (Interactive)
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;

                // Simple Repulsion on Mouse hover
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        this.x -= dx * 0.05;
                        this.y -= dy * 0.05;
                    }
                }
            }
            draw() {
                ctx.fillStyle = 'rgba(0, 255, 204, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < 80; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Conectar partículas (Constellation effect)
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 204, ${0.2 - distance/500})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }
});
