// ===================================
// MATRIX PRELOADER
// ===================================
const matrixPreloader = document.getElementById('matrix-preloader');

// Ocultar preloader después de la animación
window.addEventListener('load', () => {
    setTimeout(() => {
        matrixPreloader.classList.add('hidden');
        setTimeout(() => {
            matrixPreloader.style.display = 'none';
        }, 500);
    }, 3000); // 3 segundos de animación
});

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
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
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
            const enText = el.getAttribute('data-en');
            el.textContent = translations.es[enText] || el.textContent;
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
// PRELOADER - DESACTIVADO
// ===================================
// Preloader removido porque la página carga muy rápido

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
// Activar efectos de glassmorphism
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
let secretKeys = [];
const secretCode = ['Control', 'Shift', 'F'];

document.addEventListener('keydown', (e) => {
    secretKeys.push(e.key);
    secretKeys = secretKeys.slice(-3);
    
    if (secretKeys.join('').toLowerCase() === secretCode.join('').toLowerCase()) {
        showSecretMessage();
    }
});

function showSecretMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #6366f1, #ec4899);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 10000;
            text-align: center;
            animation: bounceIn 0.6s ease;
        ">
            <h2 style="margin: 0 0 1rem 0; font-size: 2rem;">🎉 ¡Encontraste el secreto! 🎉</h2>
            <p style="margin: 0; font-size: 1.2rem;">Eres oficialmente un explorador ninja del código 🥷</p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                margin-top: 1rem;
                padding: 0.5rem 1.5rem;
                background: white;
                color: #6366f1;
                border: none;
                border-radius: 0.5rem;
                font-weight: bold;
                cursor: pointer;
            ">¡Genial!</button>
        </div>
        <div onclick="this.remove()" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9999;
        "></div>
    `;
    
    document.body.appendChild(message);
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
// DETECCIÓN DE MODO OSCURO DEL SISTEMA
// ===================================
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.log('Modo oscuro detectado');
}

// ===================================
// PERFORMANCE: REDUCIR ANIMACIONES
// ===================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

console.log('✅ Portfolio cargado correctamente');
