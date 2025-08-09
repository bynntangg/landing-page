document.addEventListener('DOMContentLoaded', function() {
    // Typing Animation
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");
    
    const textArray = ["Pengembang Perangkat Lunak", "Digital Business", "UI/UX Designer"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 1500;
    let textArrayIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if(!cursorSpan.classList.contains("typing")) {
                cursorSpan.classList.add("typing");
            }
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } 
        else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }
    
    function erase() {
        if (charIndex > 0) {
            if(!cursorSpan.classList.contains("typing")) {
                cursorSpan.classList.add("typing");
            }
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } 
        else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if(textArrayIndex >= textArray.length) {
                textArrayIndex = 0;
            }
            setTimeout(type, typingDelay + 500);
        }
    }
    
    // Start animation
    if(textArray.length) {
        setTimeout(type, newTextDelay);
    }

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu ul');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Pesan Anda telah terkirim! Saya akan segera menghubungi Anda.');
            this.reset();
        });
    }

    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.timeline-item, .skill-card, .info-card, .detail-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if(elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initialize animation state
    window.addEventListener('load', function() {
        const elements = document.querySelectorAll('.timeline-item, .skill-card, .info-card, .detail-card');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
        });
        
        animateOnScroll();
    });

    window.addEventListener('scroll', animateOnScroll);
});