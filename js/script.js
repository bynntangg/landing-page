// Animasi Teks Ketik
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Pengembang Perangkat Lunak", "Digital Business"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 1500;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
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
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if(textArrayIndex>=textArray.length) textArrayIndex=0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if(textArray.length) setTimeout(type, newTextDelay + 250);
});

// Efek Scroll Halus
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animasi Scroll
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.timeline-item, .skill-item, .info-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if(elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set inisial state untuk animasi
window.addEventListener('load', function() {
    const elements = document.querySelectorAll('.timeline-item, .skill-item, .info-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    // Trigger animasi pertama kali
    animateOnScroll();
});

window.addEventListener('scroll', animateOnScroll);

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu ul');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when click on link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Animasi Teks Bergantian
const textElements = [
    "Pengembang Perangkat Lunak",
    "Digital Business"
];

const animatedText = document.querySelector('.typed-text');
let currentIndex = 0;

function animateText() {
    animatedText.innerHTML = '';
    const text = textElements[currentIndex];
    let charIndex = 0;
    
    const typeWriter = setInterval(() => {
        if (charIndex < text.length) {
            animatedText.innerHTML += text.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typeWriter);
            setTimeout(() => {
                deleteText();
            }, 2000);
        }
    }, 100);
}

function deleteText() {
    const text = animatedText.innerHTML;
    let charIndex = text.length;
    
    const deleteChar = setInterval(() => {
        if (charIndex > 0) {
            animatedText.innerHTML = text.substring(0, charIndex - 1);
            charIndex--;
        } else {
            clearInterval(deleteChar);
            currentIndex = (currentIndex + 1) % textElements.length;
            setTimeout(() => {
                animateText();
            }, 500);
        }
    }, 50);
}

// Start animation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateText, 1000);
    
    // Animate elements on load
    const elements = document.querySelectorAll('.timeline-item, .skill-item, .info-item');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
    });
    
    setTimeout(() => {
        elements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }, 500);
});

// Scroll Animation
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.timeline-item, .skill-item, .info-item');
    const screenHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementPosition < screenHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});
