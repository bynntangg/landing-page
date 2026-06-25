// ===== SECTION SCROLL ANIMATIONS =====
class SectionAnimator {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.progressDots = document.querySelectorAll('.progress-dot');
        this.progressLine = document.querySelector('.progress-line');
        this.currentSection = '';
        this.isScrolling = false;
        this.scrollDelay = 100;
        
        this.init();
    }

    init() {
        // Initial setup
        this.updateActiveSection();
        this.setupEventListeners();
        this.setupScrollAnimation();
        
        // Hero section should be active on load
        setTimeout(() => {
            const heroSection = document.querySelector('#hero');
            if (heroSection) {
                heroSection.classList.add('active');
            }
        }, 500);
    }

    setupEventListeners() {
        // Smooth scroll for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
            });
        });

        // Smooth scroll for progress dots
        this.progressDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = dot.getAttribute('href');
                this.scrollToSection(targetId);
            });
        });

        // Window scroll with debounce
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    this.updateActiveSection();
                    this.updateProgressLine();
                    this.animateCardsOnScroll();
                    scrollTimeout = null;
                }, 50);
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.updateActiveSection();
        });
    }

    setupScrollAnimation() {
        // Intersection Observer for section animations
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add active class with delay
                    setTimeout(() => {
                        entry.target.classList.add('active');
                        
                        // Animate cards inside section
                        this.animateCardsInSection(entry.target);
                    }, entry.target.dataset.delay || 0);
                }
            });
        }, observerOptions);

        // Observe all sections
        this.sections.forEach((section, index) => {
            section.dataset.delay = index * 100;
            sectionObserver.observe(section);
        });
    }

    scrollToSection(targetId) {
        if (this.isScrolling) return;
        
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        this.isScrolling = true;
        
        // Calculate target position
        const navbarHeight = document.querySelector('#navbar').offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        
        // Smooth scroll
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update active states
        this.updateActiveStates(targetId);
        
        // Reset scrolling flag
        setTimeout(() => {
            this.isScrolling = false;
        }, this.scrollDelay);
    }

    updateActiveSection() {
        const scrollPosition = window.pageYOffset + 100;
        let newActiveSection = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                newActiveSection = section.getAttribute('id');
            }
        });
        
        if (newActiveSection !== this.currentSection) {
            this.currentSection = newActiveSection;
            this.updateActiveStates(`#${newActiveSection}`);
        }
    }

    updateActiveStates(targetId) {
        // Update nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
        
        // Update progress dots
        this.progressDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === targetId) {
                dot.classList.add('active');
            }
        });
    }

    updateProgressLine() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        if (this.progressLine) {
            this.progressLine.style.width = `${scrollPercent}%`;
        }
    }

    animateCardsInSection(section) {
        const cards = section.querySelectorAll('.animated-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    animateCardsOnScroll() {
        const scrollPosition = window.pageYOffset + window.innerHeight * 0.8;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition > sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.animateCardsInSection(section);
            }
        });
    }
}

// ===== LOADING SCREEN =====
const loadingScreen = document.querySelector('.loading-screen');
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('loaded');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
});

// ===== MOBILE NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');
const mobileOverlay = document.querySelector('.mobile-overlay');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navList.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMobileMenu);

mobileOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navList.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth < 768) {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Close menu
            hamburger.classList.remove('active');
            navList.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Scroll to section
            if (targetSection) {
                setTimeout(() => {
                    const offset = 80;
                    const targetPosition = targetSection.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for shadow
    if (scrollTop > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll (mobile only)
    if (window.innerWidth < 768) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollTop = scrollTop;
});

// ===== BACK TO TOP BUTTON =====
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('active');
    } else {
        backToTopButton.classList.remove('active');
    }
});

// ===== TYPING ANIMATION =====
const typedTextSpan = document.querySelector('.typed-text');
const cursorSpan = document.querySelector('.cursor');

const textArray = [
    "Travelling Enthusiast",
    "Digital Business Enthusiast", 
    "UI/UX Designer",
    "Owner Bintang Homestay",
];
const typingDelay = 100;
const erasingDelay = 80;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 500);
    }
}

// ===== COUNTER ANIMATION =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Pesan berhasil dikirim! Terima kasih telah menghubungi saya.</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
        
        this.reset();
    });
}

// ===== SKILL BARS ANIMATION =====
function animateSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const levelFill = card.querySelector('.level-fill');
        if (levelFill) {
            const level = levelFill.getAttribute('data-level');
            setTimeout(() => {
                levelFill.style.width = `${level}%`;
            }, 300);
        }
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize section animator
    const sectionAnimator = new SectionAnimator();
    
    // Start typing animation
    if (textArray.length) setTimeout(type, newTextDelay + 250);
    
    // Initialize counters
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersInitialized = false;
    
    // Intersection Observer for counters and skill bars
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate counters
                if (entry.target.id === 'hero' && !countersInitialized) {
                    statNumbers.forEach(counter => {
                        animateCounter(counter);
                    });
                    countersInitialized = true;
                }
                
                // Animate skill bars
                if (entry.target.id === 'minat') {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe hero and skills sections
    const heroSection = document.querySelector('#hero');
    const skillsSection = document.querySelector('#minat');
    
    if (heroSection) observer.observe(heroSection);
    if (skillsSection) observer.observe(skillsSection);
    
    // Add loaded class to body for CSS transitions
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 1500);
    
    // Handle window resize for mobile menu
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth >= 768) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });
});

// ===== TOUCH DEVICE DETECTION =====
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
};

// Add touch-specific optimizations
if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}
// ===== LIHAT SERTIFIKAT MODAL =====
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('sertifikatModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const closeBtn = document.querySelector('.modal-close');
    const lihatSertifikatBtns = document.querySelectorAll('.lihat-sertifikat-btn');
    
// Data sertifikat
    const sertifikatData = {
        startup: {
            image: 'images/Bintang Permana_page-0001.jpg',
            title: 'Startup Founder Clash',
            subtitle: 'Futurepreneur National Competition'
        },
        management: {
            image: 'images/BINTANG PERMANA (1).png',
            title: 'Management Festival',
            subtitle: 'Business Plan Competition'
        }
    };
    
    // Buka modal
    lihatSertifikatBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sertifikatType = this.getAttribute('data-sertifikat');
            const data = sertifikatData[sertifikatType];
            
            if (data) {
                modalImage.src = data.image;
                modalImage.alt = `Sertifikat ${data.title}`;
                modalTitle.textContent = data.title;
                modalSubtitle.textContent = data.subtitle;
                
                // Tampilkan modal
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
                
                // Efek tombol
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    });
    
    // Tutup modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    // Tutup modal klik di luar konten
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Tutup modal dengan ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Preload gambar untuk loading lebih cepat
    function preloadImages() {
        Object.values(sertifikatData).forEach(data => {
            const img = new Image();
            img.src = data.image;
        });
    }
    
    // Preload setelah halaman selesai load
    setTimeout(preloadImages, 1000);
});
// ===== SKILL BARS ANIMATION =====
function animateSkillBars() {
    const skillCards = document.querySelectorAll('#minat.active .skill-card');
    
    skillCards.forEach((card, index) => {
        setTimeout(() => {
            const levelFill = card.querySelector('.level-fill');
            if (levelFill) {
                const level = levelFill.getAttribute('data-level');
                levelFill.style.width = `${level}%`;
            }
        }, index * 150);
    });
}

// Panggil saat section aktif
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            setTimeout(animateSkillBars, 300);
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('#minat');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ========== EXPERIENCE - POPUP TIMBUL ==========
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('experiencePopup');
    const popupImage = document.getElementById('popupImage');
    const popupTitle = document.getElementById('popupTitle');
    const popupDesc = document.getElementById('popupDesc');
    const popupClose = document.getElementById('popupClose');
    const popupOverlay = document.getElementById('popupOverlay');
    const experienceItems = document.querySelectorAll('.experience-item');

    // Klik item untuk membuka popup dengan efek timbul
    experienceItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const img = this.querySelector('img');
            const titleEl = this.querySelector('.overlay .title');
            const subtitleEl = this.querySelector('.overlay .subtitle');
            
            if (img) {
                popupImage.src = img.src;
                popupImage.alt = img.alt;
            }
            
            if (titleEl) {
                popupTitle.innerHTML = titleEl.innerHTML;
            }
            
            if (subtitleEl) {
                popupDesc.textContent = subtitleEl.textContent;
            }
            
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Tutup popup
    function closePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }
    
    if (popupOverlay) {
        popupOverlay.addEventListener('click', closePopup);
    }

    // Tutup dengan tombol ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup && popup.classList.contains('active')) {
            closePopup();
        }
    });
});

// ===== MUSIC PLAYER - FULL FUNCTIONAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const likeBtn = document.getElementById('likeBtn');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    const progressBarBg = document.getElementById('progressBarBg');
    const timeCurrent = document.getElementById('timeCurrent');
    const timeTotal = document.getElementById('timeTotal');
    const volumeFill = document.getElementById('volumeFill');
    const volumeBar = document.getElementById('volumeBar');
    const volumeIcon = document.getElementById('volumeIcon');
    const visualizer = document.getElementById('visualizer');
    const albumCover = document.getElementById('albumCover');

    // Playlist
    const playlist = [
        {
            title: 'Masa Ini Nanti dan Masa Indah Lainnya',
            artist: 'Bintang Permana',
            file: 'music/lagu.mp3',
            cover: 'images/lagu.jpg'
        }
    ];

    let currentTrack = 0;
    let isPlaying = false;
    let isShuffled = false;
    let isRepeated = false;
    let isLiked = false;
    let isDragging = false;

    // ===== LOAD TRACK =====
    function loadTrack(index) {
        const track = playlist[index];
        if (!track) return;
        
        audio.src = track.file;
        audio.load();
        
        document.getElementById('songTitle').textContent = track.title;
        document.querySelector('.music-artist').innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${track.artist}
        `;
        
        if (track.cover) {
            albumCover.src = track.cover;
        }
        
        // Reset progress
        progressFill.style.width = '0%';
        progressHandle.style.left = '0%';
        timeCurrent.textContent = '0:00';
        
        // Update total time when metadata loaded
        audio.addEventListener('loadedmetadata', function() {
            timeTotal.textContent = formatTime(audio.duration);
        });
    }

    // ===== FORMAT TIME =====
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // ===== PLAY/PAUSE =====
    function togglePlay() {
        if (audio.paused) {
            audio.play();
            isPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playBtn.classList.add('playing');
            visualizer.classList.add('active');
            
            // Rotate cover
            albumCover.style.animation = 'spin 4s linear infinite';
        } else {
            audio.pause();
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playBtn.classList.remove('playing');
            visualizer.classList.remove('active');
            albumCover.style.animation = 'none';
        }
    }

    // ===== UPDATE PROGRESS =====
    function updateProgress() {
        if (!isDragging) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${progress}%`;
            progressHandle.style.left = `${progress}%`;
            timeCurrent.textContent = formatTime(audio.currentTime);
        }
    }

    // ===== SET PROGRESS =====
    function setProgress(e) {
        const rect = progressBarBg.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const progress = Math.max(0, Math.min(1, x));
        audio.currentTime = progress * audio.duration;
        progressFill.style.width = `${progress * 100}%`;
        progressHandle.style.left = `${progress * 100}%`;
        timeCurrent.textContent = formatTime(audio.currentTime);
    }

    // ===== NEXT TRACK =====
    function nextTrack() {
        if (isShuffled) {
            currentTrack = Math.floor(Math.random() * playlist.length);
        } else {
            currentTrack = (currentTrack + 1) % playlist.length;
        }
        loadTrack(currentTrack);
        if (isPlaying) {
            audio.play();
        }
    }

    // ===== PREV TRACK =====
    function prevTrack() {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        if (isShuffled) {
            currentTrack = Math.floor(Math.random() * playlist.length);
        } else {
            currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
        }
        loadTrack(currentTrack);
        if (isPlaying) {
            audio.play();
        }
    }

    // ===== VOLUME =====
    function setVolume(e) {
        const rect = volumeBar.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const volume = Math.max(0, Math.min(1, x));
        audio.volume = volume;
        volumeFill.style.width = `${volume * 100}%`;
        
        // Update icon
        if (volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }

    // ===== TOGGLE MUTE =====
    function toggleMute() {
        if (audio.volume > 0) {
            audio.dataset.prevVolume = audio.volume;
            audio.volume = 0;
            volumeFill.style.width = '0%';
            volumeIcon.className = 'fas fa-volume-mute';
        } else {
            const prev = parseFloat(audio.dataset.prevVolume) || 0.8;
            audio.volume = prev;
            volumeFill.style.width = `${prev * 100}%`;
            if (prev < 0.5) {
                volumeIcon.className = 'fas fa-volume-down';
            } else {
                volumeIcon.className = 'fas fa-volume-up';
            }
        }
    }

    // ===== EVENT LISTENERS =====
    
    // Play button
    playBtn.addEventListener('click', togglePlay);

    // Next/Prev
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);

    // Shuffle
    shuffleBtn.addEventListener('click', function() {
        isShuffled = !isShuffled;
        this.classList.toggle('active');
    });

    // Repeat
    repeatBtn.addEventListener('click', function() {
        isRepeated = !isRepeated;
        this.classList.toggle('active');
    });

    // Like
    likeBtn.addEventListener('click', function() {
        isLiked = !isLiked;
        if (isLiked) {
            this.innerHTML = '<i class="fas fa-heart"></i>';
            this.classList.add('liked');
        } else {
            this.innerHTML = '<i class="far fa-heart"></i>';
            this.classList.remove('liked');
        }
    });

    // Progress bar click
    progressBarBg.addEventListener('click', setProgress);

    // Progress bar drag
    progressBarBg.addEventListener('mousedown', function(e) {
        isDragging = true;
        setProgress(e);
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            setProgress(e);
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Volume
    volumeBar.addEventListener('click', setVolume);

    // Volume drag
    volumeBar.addEventListener('mousedown', function(e) {
        const handleVolume = (e) => {
            setVolume(e);
        };
        handleVolume(e);
        
        document.addEventListener('mousemove', handleVolume);
        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', handleVolume);
        }, { once: true });
    });

    // Volume icon click (mute)
    volumeIcon.addEventListener('click', toggleMute);

    // Audio events
    audio.addEventListener('timeupdate', updateProgress);

    audio.addEventListener('ended', function() {
        if (isRepeated) {
            audio.currentTime = 0;
            audio.play();
        } else {
            nextTrack();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        }
        if (e.code === 'ArrowRight') {
            e.preventDefault();
            nextTrack();
        }
        if (e.code === 'ArrowLeft') {
            e.preventDefault();
            prevTrack();
        }
        if (e.code === 'ArrowUp') {
            e.preventDefault();
            audio.volume = Math.min(1, audio.volume + 0.1);
            volumeFill.style.width = `${audio.volume * 100}%`;
        }
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            audio.volume = Math.max(0, audio.volume - 0.1);
            volumeFill.style.width = `${audio.volume * 100}%`;
        }
        if (e.code === 'KeyM') {
            toggleMute();
        }
    });

    // ===== ADD SPIN ANIMATION =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // ===== LOAD INITIAL TRACK =====
    loadTrack(0);
    
    // Set initial volume
    audio.volume = 0.8;
    volumeFill.style.width = '80%';

    console.log('🎵 Music Player loaded!');
    console.log('🎶 Now playing: Masa Ini Nanti dan Masa Indah Lainnya');
    console.log('⌨️  Keyboard shortcuts: Space (play/pause), ←/→ (prev/next), ↑/↓ (volume), M (mute)');
});