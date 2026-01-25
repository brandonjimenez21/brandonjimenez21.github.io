// ===================================
// SERVICE WORKER REGISTRATION (PWA)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Solo registrar en producción (no en localhost/127.0.0.1/file://)
        const isProduction = 
            !window.location.hostname.match(/localhost|127\.0\.0\.1|^\d+\.\d+\.\d+\.\d+$/) &&
            window.location.protocol !== 'file:';
        
        if (isProduction) {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('✅ Service Worker registrado:', registration.scope);
                    
                    // Verificar actualizaciones
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('🔄 Nueva versión del Service Worker encontrada');
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('📥 Nueva versión disponible. Recarga para actualizar.');
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('❌ Error al registrar Service Worker:', error);
                });
        } else {
            console.log('🔧 Modo desarrollo - Service Worker deshabilitado');
            
            // Desregistrar cualquier Service Worker existente en desarrollo
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                    registration.unregister();
                    console.log('🗑️ Service Worker desregistrado en modo desarrollo');
                });
            });
        }
    });
    
    // Detectar si está offline
    window.addEventListener('offline', () => {
        console.log('📵 Modo offline activado');
    });
    
    window.addEventListener('online', () => {
        console.log('🌐 Conexión restaurada');
    });
}

// ===================================
// MATRIX PRELOADER
// ===================================
const matrixPreloader = document.getElementById('matrix-preloader');

// Preloader particles animation
const preloaderCanvas = document.getElementById('preloaderParticles');
let preloaderAnimationRunning = true;

if (preloaderCanvas) {
    const pCtx = preloaderCanvas.getContext('2d');
    
    function resizePreloaderCanvas() {
        preloaderCanvas.width = window.innerWidth;
        preloaderCanvas.height = window.innerHeight;
    }
    resizePreloaderCanvas();
    window.addEventListener('resize', resizePreloaderCanvas);
    
    const pSymbols = ['<', '>', '{', '}', '[', ']', '(', ')', ';', '=', '+', '-', '*', '/', '&', '|', '$', '#', '@'];
    
    class PreloaderParticle {
        constructor() {
            this.x = Math.random() * preloaderCanvas.width;
            this.y = Math.random() * preloaderCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.symbol = pSymbols[Math.floor(Math.random() * pSymbols.length)];
            this.size = Math.random() * 12 + 10;
            this.alpha = Math.random() * 0.4 + 0.6;
            const colors = ['#6366f1', '#ec4899', '#a855f7'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < -20) this.x = preloaderCanvas.width + 20;
            if (this.x > preloaderCanvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = preloaderCanvas.height + 20;
            if (this.y > preloaderCanvas.height + 20) this.y = -20;
        }
        
        draw() {
            pCtx.font = `${this.size}px 'Courier New', monospace`;
            pCtx.fillStyle = this.color;
            pCtx.globalAlpha = this.alpha;
            pCtx.fillText(this.symbol, this.x, this.y);
        }
    }
    
    const preloaderParticles = [];
    for (let i = 0; i < 40; i++) {
        preloaderParticles.push(new PreloaderParticle());
    }
    
    function animatePreloaderParticles() {
        if (!preloaderAnimationRunning) return;
        
        pCtx.clearRect(0, 0, preloaderCanvas.width, preloaderCanvas.height);
        preloaderParticles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        pCtx.globalAlpha = 1;
        requestAnimationFrame(animatePreloaderParticles);
    }
    
    animatePreloaderParticles();
}

// Ocultar preloader después de la animación
window.addEventListener('load', () => {
    setTimeout(() => {
        preloaderAnimationRunning = false;
        matrixPreloader.classList.add('hidden');
        setTimeout(() => {
            matrixPreloader.style.display = 'none';
        }, 500);
    }, 3000); // 3 segundos de animación
});

// ===================================
// CODE PARTICLES ANIMATION
// ===================================
const codeParticlesCanvas = document.getElementById('codeParticles');
if (codeParticlesCanvas) {
    const ctx = codeParticlesCanvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        codeParticlesCanvas.width = codeParticlesCanvas.offsetWidth;
        codeParticlesCanvas.height = codeParticlesCanvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Code symbols
    const symbols = ['<', '>', '{', '}', '[', ']', '(', ')', ';', '=', '+', '-', '*', '/', '&', '|', '$', '#', '@'];
    
    // Particle class
    class CodeParticle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * codeParticlesCanvas.width;
            this.y = Math.random() * codeParticlesCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
            this.size = Math.random() * 12 + 10;
            this.alpha = Math.random() * 0.4 + 0.6;
            
            // Get current colors from CSS
            const isDark = document.body.classList.contains('dark-mode');
            const colors = ['#6366f1', '#ec4899', '#a855f7']; // indigo, pink, purple
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around edges
            if (this.x < -20) this.x = codeParticlesCanvas.width + 20;
            if (this.x > codeParticlesCanvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = codeParticlesCanvas.height + 20;
            if (this.y > codeParticlesCanvas.height + 20) this.y = -20;
        }
        
        draw() {
            ctx.font = `${this.size}px 'Courier New', monospace`;
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fillText(this.symbol, this.x, this.y);
        }
    }
    
    // Create particles
    const particleCount = 30;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new CodeParticle());
    }
    
    // Animation loop
    function animateCodeParticles() {
        ctx.clearRect(0, 0, codeParticlesCanvas.width, codeParticlesCanvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animateCodeParticles);
    }
    
    animateCodeParticles();
    
    // Update particle colors on theme change
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(() => {
                particles.forEach(particle => {
                    const colors = ['#6366f1', '#ec4899', '#a855f7'];
                    particle.color = colors[Math.floor(Math.random() * colors.length)];
                });
            }, 100);
        });
    }
}

// ===================================
// CONFIGURACIÓN Y VARIABLES
// ===================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// ===================================
// NAVBAR: SCROLL Y TRANSPARENCIA
// ===================================
function scrollHeader() {
    if (window.scrollY >= 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', scrollHeader);

// ===================================
// MENÚ MÓVIL: TOGGLE
// ===================================
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===================================
// NAVEGACIÓN ACTIVA POR SECCIÓN
// ===================================
function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav-link[href*=' + sectionId + ']')?.classList.add('active');
        } else {
            document.querySelector('.nav-link[href*=' + sectionId + ']')?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', scrollActive);

// ===================================
// SMOOTH SCROLL PARA ENLACES
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// ANIMACIÓN DE ESCRITURA (TYPING)
// ===================================
const typingText = document.querySelector('.typing-text');
const roles = [
    'Desarrollador Full Stack',
    'Desarrollador Frontend',
    'Desarrollador Backend',
    'Diseñador UI/UX',
    'Freelancer'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        // Pausa al final de la palabra
        typingDelay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 500;
    }
    
    setTimeout(typeRole, typingDelay);
}

// Iniciar animación de escritura
if (typingText) {
    setTimeout(typeRole, 1000);
}

// ===================================
// ANIMACIONES AL HACER SCROLL
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observar elementos para animación
const animateElements = document.querySelectorAll(
    '.skill-category, .project-card, .contact-item, .about-text, .about-image'
);

animateElements.forEach(el => observer.observe(el));

// ===================================
// FORMULARIO DE CONTACTO - Ahora manejado en la sección de validación más abajo
// ===================================
// El formulario ahora tiene validación completa en la línea 678+

// ===================================
// CONTADOR DE SKILLS (ANIMACIÓN)
// ===================================
const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'running';
    });
});

// ===================================
// LAZY LOADING PARA IMÁGENES
// ===================================
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('fade-in');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===================================
// BOTÓN BACK TO TOP (OPCIONAL)
// ===================================
function createBackToTop() {
    const backToTop = document.createElement('button');
    const icon = document.createElement('i');
    icon.className = 'fas fa-arrow-up';
    backToTop.appendChild(icon);
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 40px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'scale(1.1)';
    });
    
    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'scale(1)';
    });
}

// Activar botón back to top
createBackToTop();

// ===================================
// CURSOR PERSONALIZADO (OPCIONAL)
// ===================================
function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    
    document.body.appendChild(cursor);
    
    // Solo en pantallas grandes
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
        
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursor.style.background = 'rgba(99, 102, 241, 0.2)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'transparent';
            });
        });
    }
}

// Activar cursor personalizado (opcional - puedes comentar si no lo quieres)
// createCustomCursor();

// ===================================
// PARALLAX EFFECT (OPCIONAL)
// ===================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shape');
    
    parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.1;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===================================
// PRELOADER (OPCIONAL)
// ===================================
window.addEventListener('load', () => {
    // Ocultar preloader si existe
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
    
    // Agregar clase loaded al body
    document.body.classList.add('loaded');
});

// ===================================
// CONSOLE MESSAGE (EASTER EGG)
// ===================================
console.log('%c¡Hola Developer! 👋', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%c¿Curioseando el código? Me gusta tu estilo 😎', 'color: #64748b; font-size: 14px;');
console.log('%cSi quieres contactarme, usa el formulario de contacto 📧', 'color: #64748b; font-size: 14px;');
console.log('%cEaster Egg: Presiona CTRL + SHIFT + F para un mensaje secreto 🎉', 'color: #ec4899; font-size: 12px;');

// ===================================
// DARK MODE TOGGLE
// ===================================
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Cargar tema guardado o usar preferencia del sistema
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
} else if (prefersDark.matches) {
    document.body.classList.add('dark-mode');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// ===================================
// LANGUAGE TOGGLE
// ===================================
const langToggle = document.getElementById('lang-toggle');
const translations = {
    es: {
        'Home': 'Inicio',
        'About': 'Sobre Mí',
        'Projects': 'Proyectos',
        'Contact': 'Contacto',
        'Comments': 'Comentarios',
        "Hello, I'm": 'Hola, soy',
        'Contact Me': 'Contáctame',
        'View Projects': 'Ver Proyectos',
        'About Me': 'Sobre Mí',
        'Learn more about my journey': 'Conoce un poco más sobre mi trayectoria',
        'Professional Web Developer': 'Desarrollador Web Profesional',
        'Available for Projects': 'Disponible para Proyectos',
        'Download CV': 'Descargar CV',
        'Technical Skills': 'Habilidades Técnicas',
        'Technologies and tools I master': 'Tecnologías y herramientas que domino',
        'Featured Projects': 'Proyectos Destacados',
        'Some of my recent work': 'Algunos de mis trabajos recientes',
        'Contact Me': 'Contáctame',
        'Have a project in mind? Let\'s talk': '¿Tienes un proyecto en mente? Hablemos',
        'Contact Information': 'Información de Contacto',
        'Phone': 'Teléfono',
        'Location': 'Ubicación',
        'Send Message': 'Enviar Mensaje',
        'Projects Completed': 'Proyectos Completados',
        'Happy Clients': 'Clientes Satisfechos',
        'Cups of Coffee': 'Tazas de Café',
        'Years of Experience': 'Años de Experiencia',
        'Leave a Comment': 'Deja un Comentario',
        'Share your thoughts or feedback': 'Comparte tus pensamientos o feedback',
        'Be the first to leave a comment!': '¡Sé el primero en dejar un comentario!',
        'Leave Your Comment': 'Deja tu Comentario',
        'Post Comment': 'Publicar Comentario',
        'Hobbies & Interests': 'Hobbies e Intereses',
        'What I enjoy doing in my free time': 'Lo que disfruto hacer en mi tiempo libre',
        'Reading': 'Lectura',
        'Books on technology, philosophy and personal development': 'Libros de tecnología, filosofía y desarrollo personal',
        'Gaming': 'Videojuegos',
        'Strategy games and creative problem solving': 'Juegos de estrategia y resolución creativa de problemas',
        'Fitness': 'Ejercicio',
        'Gym and outdoor sports for a healthy balance': 'Gym y deportes al aire libre para un balance saludable',
        'Music': 'Música',
        'Electronic music and playing guitar in my spare time': 'Música electrónica y tocar guitarra en mi tiempo libre',
        'Travel': 'Viajar',
        'Exploring new cultures and meeting people': 'Explorar nuevas culturas y conocer personas',
        'Photography': 'Fotografía',
        'Capturing moments and urban landscapes': 'Capturar momentos y paisajes urbanos',
        'Quick Links': 'Enlaces Rápidos',
        'Home': 'Inicio',
        'About': 'Sobre Mí',
        'Projects': 'Proyectos',
        'Contact': 'Contacto',
        'Share': 'Compartir',
        'All rights reserved.': 'Todos los derechos reservados.',
        'Made with': 'Hecho con',
        'and code': 'y código',
        'visits': 'visitas',
        'Loading...': 'Cargando...'
    }
};

let currentLang = localStorage.getItem('language') || 'es';

function translatePage(lang) {
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(el => {
        if (lang === 'en') {
            el.textContent = el.getAttribute('data-en');
        } else {
            // Usar data-es si existe, sino buscar en diccionario
            const esText = el.getAttribute('data-es');
            if (esText) {
                el.textContent = esText;
            } else {
                const enText = el.getAttribute('data-en');
                el.textContent = translations.es[enText] || el.textContent;
            }
        }
    });
    
    // Traducir placeholders
    const placeholders = document.querySelectorAll('[data-en-placeholder]');
    placeholders.forEach(el => {
        if (lang === 'en') {
            el.placeholder = el.getAttribute('data-en-placeholder');
        } else {
            const enPlaceholder = el.getAttribute('data-en-placeholder');
            const esPlaceholder = {
                'Your Name': 'Tu Nombre',
                'Your Email (optional)': 'Tu Email (opcional)',
                'Your comment...': 'Tu comentario...',
                'Your Email': 'Tu Email',
                'Subject': 'Asunto',
                'Your Message': 'Tu Mensaje'
            }[enPlaceholder];
            el.placeholder = esPlaceholder || el.placeholder;
        }
    });
    
    if (langToggle) {
        langToggle.querySelector('.lang-text').textContent = lang === 'es' ? 'EN' : 'ES';
    }
}

if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        translatePage(currentLang);
        localStorage.setItem('language', currentLang);
    });
}

// Aplicar idioma guardado
if (currentLang === 'en') {
    translatePage('en');
}

// ===================================
// STATISTICS COUNTER
// ===================================
const statNumbers = document.querySelectorAll('.stat-number');
let counterStarted = false;

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted) {
            counterStarted = true;
            statNumbers.forEach(stat => animateCounter(stat));
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.statistics');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===================================
// PARTICLES BACKGROUND
// ===================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 50;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.5})`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Conectar partículas cercanas
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
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

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===================================
// CUSTOM CURSOR (OPTIONAL)
// ===================================
function initCustomCursor() {
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        document.body.classList.add('custom-cursor');
        
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);
        
        const follower = document.createElement('div');
        follower.className = 'cursor-follower';
        document.body.appendChild(follower);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animate() {
            cursorX += (mouseX - cursorX) * 0.3;
            cursorY += (mouseY - cursorY) * 0.3;
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Efectos hover
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                follower.classList.remove('active');
            });
        });
    }
}

// Activar cursor personalizado
initCustomCursor();

// ===================================
// GLASSMORPHISM EFFECTS
// ===================================
document.body.classList.add('glassmorphism');

// ===================================
// SHARE BUTTONS
// ===================================
const shareButtons = document.querySelectorAll('.share-btn');

shareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.getAttribute('data-platform');
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('¡Mira este increíble portafolio!');
        
        let shareUrl = '';
        
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${text}%20${url}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    });
});

// ===================================
// VISIT COUNTER
// ===================================
function updateVisitCounter() {
    let visits = localStorage.getItem('visits') || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem('visits', visits);
    
    const counter = document.getElementById('visit-count');
    if (counter) {
        counter.textContent = visits;
    }
}

updateVisitCounter();

// ===================================
// FORM VALIDATION
// ===================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    contactForm.addEventListener('submit', function(e) {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Limpiar estados anteriores
    field.classList.remove('error', 'success');
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    if (value === '') {
        isValid = false;
        errorMessage = 'Este campo es requerido';
    } else if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email inválido';
        }
    } else if (fieldName === 'name' && value.length < 2) {
        isValid = false;
        errorMessage = 'Nombre muy corto';
    } else if (fieldName === 'message' && value.length < 10) {
        isValid = false;
        errorMessage = 'Mensaje muy corto (mínimo 10 caracteres)';
    }
    
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        field.parentElement.appendChild(errorDiv);
    } else {
        field.classList.add('success');
    }
    
    return isValid;
}

// ===================================
// EASTER EGG - KONAMI CODE STYLE
// ===================================
let easterEggShown = false;

document.addEventListener('keydown', (e) => {
    // Detectar Ctrl + Shift + F presionados simultáneamente
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f' && !easterEggShown) {
        e.preventDefault(); // Prevenir el comportamiento por defecto (búsqueda del navegador)
        easterEggShown = true;
        showSecretMessage();
    }
});

function showSecretMessage() {
    // Crear overlay (fondo oscuro)
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 9999;
        pointer-events: auto;
        cursor: pointer;
    `;
    
    // Crear contenedor del mensaje
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #6366f1, #ec4899);
        color: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10001;
        text-align: center;
        animation: bounceIn 0.6s ease;
        pointer-events: auto;
    `;
    
    // Crear título
    const title = document.createElement('h2');
    title.style.cssText = 'margin: 0 0 1rem 0; font-size: 2rem;';
    title.textContent = '🎉 ¡Encontraste el secreto! 🎉';
    
    // Crear párrafo
    const text = document.createElement('p');
    text.style.cssText = 'margin: 0; font-size: 1.2rem;';
    text.textContent = 'Eres oficialmente un explorador ninja del código 🥷';
    
    // Crear botón
    const button = document.createElement('button');
    button.style.cssText = `
        margin-top: 1rem;
        padding: 0.5rem 1.5rem;
        background: white;
        color: #6366f1;
        border: none;
        border-radius: 0.5rem;
        font-weight: bold;
        cursor: pointer;
        pointer-events: auto;
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
    `;
    button.textContent = '¡Genial!';
    
    // Añadir efecto hover
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 5px 15px rgba(99, 102, 241, 0.4)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'none';
    });
    
    // Función para cerrar el modal
    const closeModal = () => {
        easterEggShown = false; // Permitir mostrar el easter egg de nuevo
        overlay.remove();
        messageBox.remove();
    };
    
    // Event listener del botón (con stopPropagation para evitar conflictos)
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });
    
    // Event listener del overlay (click en fondo oscuro)
    overlay.addEventListener('click', closeModal);
    
    // Prevenir que clicks en el messageBox cierren el modal
    messageBox.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Ensamblar el modal
    messageBox.appendChild(title);
    messageBox.appendChild(text);
    messageBox.appendChild(button);
    
    // Agregar al DOM
    document.body.appendChild(overlay);
    document.body.appendChild(messageBox);
    
    confetti();
}

function confetti() {
    const confettiCount = 50;
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${['#6366f1', '#ec4899', '#14b8a6'][Math.floor(Math.random() * 3)]};
                animation: confettiFall ${2 + Math.random() * 2}s linear;
                z-index: 10001;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
    
    // Agregar animación de confetti si no existe
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                }
            }
            @keyframes bounceIn {
                0% {
                    transform: translate(-50%, -50%) scale(0.3);
                    opacity: 0;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.05);
                }
                70% {
                    transform: translate(-50%, -50%) scale(0.9);
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===================================
// TERMINAL INTERACTIVA
// ===================================
const terminalToggle = document.getElementById('terminal-toggle');
const terminalContainer = document.getElementById('terminal-container');
const terminalClose = document.getElementById('terminal-close');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

const commands = {
    help: 'Comandos disponibles:\n  about - Información sobre mí\n  skills - Mis habilidades\n  projects - Mis proyectos\n  contact - Información de contacto\n  clear - Limpiar terminal\n  social - Redes sociales',
    about: 'Soy Brandon Jiménez, Full Stack Developer apasionado por crear experiencias web innovadoras.',
    skills: 'HTML, CSS, JavaScript, React, Node.js, Python, Django, Git, MySQL, MongoDB',
    projects: 'Proyectos destacados:\n  1. E-commerce Platform\n  2. Task Manager App\n  3. Portfolio Website',
    contact: 'Email: brandonjimenez.dev@gmail.com\nGitHub: https://github.com/brandonjimenez21\nLinkedIn: https://www.linkedin.com/in/brandon-jimenez-1a124b215/',
    social: 'GitHub: https://github.com/brandonjimenez21\nLinkedIn: https://www.linkedin.com/in/brandon-jimenez-1a124b215/\nTwitter: @brandonjimenez',
    clear: 'CLEAR'
};

terminalToggle.addEventListener('click', () => {
    terminalContainer.classList.toggle('active');
    if (terminalContainer.classList.contains('active')) {
        terminalInput.focus();
    }
});

terminalClose.addEventListener('click', () => {
    terminalContainer.classList.remove('active');
});

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        // Sanitizar input: solo permitir caracteres alfanuméricos, espacios y guiones
        const rawCommand = terminalInput.value.trim();
        const command = rawCommand.replace(/[^a-z0-9\s-]/gi, '').toLowerCase();
        
        if (command) {
            addTerminalLine(command, 'command');
            
            if (commands[command]) {
                if (command === 'clear') {
                    terminalOutput.innerHTML = '';
                } else {
                    addTerminalLine(commands[command], 'success');
                }
            } else {
                addTerminalLine(`Comando no encontrado: ${command}. Escribe 'help' para ver comandos disponibles.`, 'error');
            }
        }
        
        terminalInput.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});

function addTerminalLine(text, type = 'text') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (type === 'command') {
        // Prevenir XSS usando textContent
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = 'brandon@portfolio:~$ ';
        
        const command = document.createElement('span');
        command.className = 'terminal-command';
        command.textContent = text;
        
        line.appendChild(prompt);
        line.appendChild(command);
    } else {
        const className = type === 'error' ? 'terminal-error' : type === 'success' ? 'terminal-success' : 'terminal-text';
        const span = document.createElement('span');
        span.className = className;
        
        // Convertir saltos de línea de forma segura
        const lines = text.split('\n');
        lines.forEach((lineText, index) => {
            const textNode = document.createTextNode(lineText);
            span.appendChild(textNode);
            if (index < lines.length - 1) {
                span.appendChild(document.createElement('br'));
            }
        });
        
        line.appendChild(span);
    }
    
    terminalOutput.appendChild(line);
}

// ===================================
// TILT EFFECT EN CARDS
// ===================================
const tiltCards = document.querySelectorAll('.skill-card, .project-card, .hobby-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
    });
});

// ===================================
// FUTURISTIC EFFECTS IMPLEMENTATION
// ===================================

// 1. STARFIELD ANIMATION
// ===================================
const starfieldCanvas = document.getElementById('starfield');
if (starfieldCanvas) {
    const starCtx = starfieldCanvas.getContext('2d');
    let stars = [];
    const numStars = 200;
    
    function resizeStarfield() {
        starfieldCanvas.width = window.innerWidth;
        starfieldCanvas.height = window.innerHeight;
        initStars();
    }
    
    function initStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * starfieldCanvas.width,
                y: Math.random() * starfieldCanvas.height,
                z: Math.random() * starfieldCanvas.width,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    function animateStars() {
        starCtx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        starCtx.fillRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
        
        const centerX = starfieldCanvas.width / 2;
        const centerY = starfieldCanvas.height / 2;
        
        stars.forEach(star => {
            star.z -= star.speed;
            
            if (star.z <= 0) {
                star.z = starfieldCanvas.width;
                star.x = Math.random() * starfieldCanvas.width;
                star.y = Math.random() * starfieldCanvas.height;
            }
            
            const k = 128 / star.z;
            const px = (star.x - centerX) * k + centerX;
            const py = (star.y - centerY) * k + centerY;
            
            const size = (1 - star.z / starfieldCanvas.width) * star.size;
            const opacity = (1 - star.z / starfieldCanvas.width) * 0.8;
            
            starCtx.fillStyle = `rgba(99, 102, 241, ${opacity})`;
            starCtx.beginPath();
            starCtx.arc(px, py, size, 0, Math.PI * 2);
            starCtx.fill();
            
            // Twinkle effect
            if (Math.random() > 0.99) {
                starCtx.fillStyle = `rgba(236, 72, 153, ${opacity})`;
                starCtx.beginPath();
                starCtx.arc(px, py, size * 1.5, 0, Math.PI * 2);
                starCtx.fill();
            }
        });
        
        requestAnimationFrame(animateStars);
    }
    
    resizeStarfield();
    window.addEventListener('resize', resizeStarfield);
    animateStars();
}

// 2. LAVA LAMP BACKGROUND
// ===================================
const blobCanvas = document.getElementById('blobMorph');
if (blobCanvas) {
    const blobCtx = blobCanvas.getContext('2d');
    let lavaBlobs = [];
    const numLavaBlobs = 5;
    
    function resizeBlobCanvas() {
        blobCanvas.width = window.innerWidth;
        blobCanvas.height = window.innerHeight;
        initLavaBlobs();
    }
    
    function initLavaBlobs() {
        lavaBlobs = [];
        const colors = [
            'rgba(99, 102, 241, 0.6)',
            'rgba(236, 72, 153, 0.6)',
            'rgba(20, 184, 166, 0.6)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(249, 115, 22, 0.6)'
        ];
        
        for (let i = 0; i < numLavaBlobs; i++) {
            lavaBlobs.push({
                x: Math.random() * blobCanvas.width,
                y: blobCanvas.height + Math.random() * 200,
                radius: Math.random() * 80 + 60,
                vy: -(Math.random() * 0.5 + 0.4), // Movimiento hacia arriba más rápido
                vx: (Math.random() - 0.5) * 0.5, // Movimiento horizontal más rápido
                color: colors[i],
                phase: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.03 + 0.02
            });
        }
    }
    
    function drawLavaBlob(blob) {
        const gradient = blobCtx.createRadialGradient(
            blob.x, blob.y, 0,
            blob.x, blob.y, blob.radius
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(0.7, blob.color.replace(/[\d.]+\)$/, '0.3)'));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        blobCtx.fillStyle = gradient;
        blobCtx.beginPath();
        blobCtx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        blobCtx.fill();
    }
    
    function animateBlobs() {
        blobCtx.clearRect(0, 0, blobCanvas.width, blobCanvas.height);
        
        lavaBlobs.forEach(blob => {
            // Movimiento vertical (subir)
            blob.y += blob.vy;
            
            // Movimiento horizontal con wobble
            blob.phase += blob.wobbleSpeed;
            blob.x += Math.sin(blob.phase) * 0.5 + blob.vx;
            
            // Cuando llega arriba, reinicia abajo
            if (blob.y < -blob.radius - 100) {
                blob.y = blobCanvas.height + blob.radius;
                blob.x = Math.random() * blobCanvas.width;
            }
            
            // Mantener dentro de los límites horizontales
            if (blob.x < -blob.radius) blob.x = blobCanvas.width + blob.radius;
            if (blob.x > blobCanvas.width + blob.radius) blob.x = -blob.radius;
            
            drawLavaBlob(blob);
        });
        
        requestAnimationFrame(animateBlobs);
    }
    
    resizeBlobCanvas();
    window.addEventListener('resize', resizeBlobCanvas);
    animateBlobs();
}

// 3. CURSOR PARTICLES
// ===================================
const particleCanvas = document.getElementById('cursorParticles');
if (particleCanvas) {
    const pCtx = particleCanvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0 };
    
    function resizeParticleCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.life = 1;
            this.decay = Math.random() * 0.01 + 0.005;
            this.color = `rgba(${99 + Math.random() * 137}, ${102 + Math.random() * 150}, 241, ${this.life})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            this.size *= 0.98;
        }
        
        draw() {
            pCtx.fillStyle = this.color.replace(/[\d.]+\)$/, `${this.life})`);
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fill();
            
            // Glow effect
            const gradient = pCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
            gradient.addColorStop(0, this.color.replace(/[\d.]+\)$/, `${this.life * 0.5})`));
            gradient.addColorStop(1, this.color.replace(/[\d.]+\)$/, '0)'));
            pCtx.fillStyle = gradient;
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            pCtx.fill();
        }
    }
    
    function animateParticles() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        
        // Create new particles at mouse position
        if (particles.length < 100) {
            particles.push(new Particle(mouse.x, mouse.y));
        }
        
        // Draw connections between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (1 - distance / 100) * Math.min(particles[i].life, particles[j].life);
                    pCtx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.2})`;
                    pCtx.lineWidth = 0.5;
                    pCtx.beginPath();
                    pCtx.moveTo(particles[i].x, particles[i].y);
                    pCtx.lineTo(particles[j].x, particles[j].y);
                    pCtx.stroke();
                }
            }
        }
        
        particles = particles.filter(particle => {
            particle.update();
            particle.draw();
            return particle.life > 0;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);
    animateParticles();
}

// 4. EYE FOLLOWING CURSOR
// ===================================
const eyeContainer = document.getElementById('eyeFollower');
if (eyeContainer) {
    const pupil = eyeContainer.querySelector('.pupil');
    const eye = eyeContainer.querySelector('.eye');
    
    window.addEventListener('mousemove', (e) => {
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        // Calcular ángulo desde el centro del ojo al cursor
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        
        // Limitar el movimiento para que no se salga del ojo
        // El ojo es más ancho que alto, así que limitamos diferente en X y Y
        const maxDistanceX = eyeRect.width / 8;  // Movimiento horizontal más limitado
        const maxDistanceY = eyeRect.height / 10; // Movimiento vertical aún más limitado
        
        // Calcular desplazamiento con límites diferentes para X e Y
        let irisX = Math.cos(angle) * maxDistanceX;
        let irisY = Math.sin(angle) * maxDistanceY;
        
        // Asegurar que no se salga (doble verificación)
        irisX = Math.max(-maxDistanceX, Math.min(maxDistanceX, irisX));
        irisY = Math.max(-maxDistanceY, Math.min(maxDistanceY, irisY));
        
        // Mover todo el conjunto (iris + pupila) juntos
        pupil.style.transform = `translate(calc(-50% + ${irisX}px), calc(-50% + ${irisY}px))`;
    });
    
    // Función de parpadeo
    function blink() {
        eye.classList.add('blinking');
        setTimeout(() => {
            eye.classList.remove('blinking');
        }, 180); // Duración del parpadeo
    }
    
    // Parpadeo aleatorio cada 3-7 segundos
    function randomBlink() {
        blink();
        const nextBlink = Math.random() * 4000 + 3000; // Entre 3 y 7 segundos
        setTimeout(randomBlink, nextBlink);
    }
    
    // Iniciar parpadeos aleatorios después de 2 segundos
    setTimeout(randomBlink, 2000);
}

// 5. SHAKE TO RANDOMIZE THEME
// ===================================
let shakeDetectionEnabled = true;
let lastShakeTime = 0;
const shakeThreshold = 15;
let lastX = 0, lastY = 0, lastZ = 0;

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', (e) => {
        if (!shakeDetectionEnabled) return;
        
        const current = e.accelerationIncludingGravity;
        if (!current || !current.x) return;
        
        const deltaX = Math.abs(current.x - lastX);
        const deltaY = Math.abs(current.y - lastY);
        const deltaZ = Math.abs(current.z - lastZ);
        
        if ((deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold)) {
            const now = Date.now();
            if (now - lastShakeTime > 1000) {
                lastShakeTime = now;
                randomizeTheme();
            }
        }
        
        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
    });
}

// Fallback: Triple click to randomize (for desktop)
let clickCount = 0;
let clickTimer = null;

document.addEventListener('click', (e) => {
    clickCount++;
    console.log(`Click ${clickCount}/3`);
    
    if (clickCount === 1) {
        clickTimer = setTimeout(() => {
            console.log('Reset click counter');
            clickCount = 0;
        }, 500); // Aumentado a 500ms para dar más tiempo
    } else if (clickCount === 3) {
        clearTimeout(clickTimer);
        clickCount = 0;
        console.log('🎨 Triple click detectado!');
        randomizeTheme();
    }
}, true); // Usar capture phase para asegurar que se ejecute

function randomizeTheme() {
    const colors = [
        { primary: '#6366f1', secondary: '#ec4899', accent: '#14b8a6', name: 'Original' },
        { primary: '#f59e0b', secondary: '#ef4444', accent: '#10b981', name: 'Sunset' },
        { primary: '#8b5cf6', secondary: '#ec4899', accent: '#06b6d4', name: 'Purple Dream' },
        { primary: '#14b8a6', secondary: '#06b6d4', accent: '#6366f1', name: 'Ocean' },
        { primary: '#ef4444', secondary: '#f59e0b', accent: '#ec4899', name: 'Fire' },
        { primary: '#10b981', secondary: '#14b8a6', accent: '#6366f1', name: 'Forest' }
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    document.documentElement.style.setProperty('--primary-color', randomColor.primary);
    document.documentElement.style.setProperty('--secondary-color', randomColor.secondary);
    document.documentElement.style.setProperty('--accent-color', randomColor.accent);
    
    showNotification(`🎨 Tema cambiado: ${randomColor.name}`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'shake-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.5s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

console.log('✨ Futuristic effects loaded! Shake device or triple-click to randomize theme!');

// ===================================
// PERFORMANCE: REDUCIR ANIMACIONES
// ===================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

console.log('✅ Portafolio cargado correctamente');
