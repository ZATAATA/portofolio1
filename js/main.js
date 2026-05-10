/**
 * Portfolio Multi-Page Navigation - Main JavaScript
 * Handles page navigation, animations, and interactions
 */

// Prevent browser from restoring scroll position on refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobileToggle');
    const navCenter = document.querySelector('.nav-center');
    const contactForm = document.getElementById('contactForm');
    const mainContent = document.querySelector('.main-content');

    // Brightness Control Elements
    const brightnessToggle = document.getElementById('brightnessToggle');
    const brightnessSliderContainer = document.getElementById('brightnessSliderContainer');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const brightnessValue = document.getElementById('brightnessValue');

    // Scroll to top immediately on load
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
    window.scrollTo(0, 0);

    // ========================================
    // Page Transition Animation
    // ========================================
    
    // Add page enter animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // ========================================
    // Navigation Logic
    // ========================================
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Mobile toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navCenter.classList.toggle('open');
        });
    }

    // Close mobile menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navCenter.classList.remove('open');
            }
        });
    });

    // Contact form submission (Netlify Forms)
    const contactToast = document.getElementById('contactToast');
    const toastClose = document.getElementById('toastClose');

    function showToast(message, subMessage, isError = false) {
        if (!contactToast) return;
        const icon = contactToast.querySelector('i');
        const title = contactToast.querySelector('h4');
        const desc = contactToast.querySelector('p');

        if (icon) {
            icon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
            icon.style.color = isError ? '#ef4444' : '#22c55e';
        }
        if (title) title.textContent = message;
        if (desc) desc.textContent = subMessage;

        contactToast.classList.add('active');

        // Auto hide after 5 seconds
        setTimeout(() => {
            contactToast.classList.remove('active');
        }, 5000);
    }

    if (toastClose && contactToast) {
        toastClose.addEventListener('click', () => {
            contactToast.classList.remove('active');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then((response) => {
                if (response.ok) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.background = '#22c55e';
                    contactForm.reset();
                    showToast('Message Sent!', 'Thank you for reaching out. We will get back to you soon.', false);
                } else {
                    throw new Error('Submission failed');
                }
                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            })
            .catch(() => {
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
                submitBtn.style.background = '#ef4444';
                showToast('Failed to Send', 'Please try again or contact directly at xeonfiki@gmail.com', true);
                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }

    // ========================================
    // Scroll Animations
    // ========================================

    const animationObserverOptions = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.15
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Add visible class for animations
                if (target.classList.contains('skill-item') ||
                    target.classList.contains('project-card') ||
                    target.classList.contains('timeline-item') ||
                    target.classList.contains('contact-info') ||
                    target.classList.contains('contact-form') ||
                    target.classList.contains('creative-item') ||
                    target.classList.contains('section-header')) {
                    target.classList.add('visible');
                }
                
                // Animate skill categories
                if (target.classList.contains('skill-category')) {
                    target.style.opacity = '1';
                    target.style.transform = 'translateX(0)';
                    
                    const skillItems = target.querySelectorAll('.skill-item');
                    skillItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 50);
                    });
                }
            }
        });
    }, animationObserverOptions);

    // Observe elements for animations
    document.querySelectorAll('.skill-category, .skill-item, .project-card, .timeline-item, .contact-info, .contact-form, .creative-item, .section-header').forEach(el => {
        animationObserver.observe(el);
    });

    // ========================================
    // Utility Functions
    // ========================================
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ========================================
    // Brightness Control
    // ========================================
    
    let brightnessSliderOpen = false;
    
    // Toggle brightness slider visibility
    if (brightnessToggle) {
        brightnessToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            brightnessSliderOpen = !brightnessSliderOpen;
            brightnessSliderContainer.classList.toggle('active', brightnessSliderOpen);
        });
    }
    
    // Close slider when clicking outside
    document.addEventListener('click', (e) => {
        if (brightnessSliderOpen && !brightnessSliderContainer.contains(e.target) && !brightnessToggle.contains(e.target)) {
            brightnessSliderOpen = false;
            brightnessSliderContainer.classList.remove('active');
        }
    });
    
    // Prevent slider clicks from closing
    if (brightnessSliderContainer) {
        brightnessSliderContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Update brightness value and filter
    if (brightnessSlider && brightnessValue) {
        brightnessSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            brightnessValue.textContent = value + '%';
            document.documentElement.style.setProperty('--brightness', value + '%');
            
            // Update theme based on brightness
            if (value > 100) {
                document.body.setAttribute('data-theme', 'light');
                brightnessToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else if (value < 80) {
                document.body.removeAttribute('data-theme');
                brightnessToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                // Mid brightness - keep current theme
            }
        });
        
        // Initialize brightness
        document.documentElement.style.setProperty('--brightness', brightnessSlider.value + '%');
    }

// ========================================
// Project Slider
// ========================================
    
const projectsSlider = document.getElementById('projectsSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');
const projectCards = document.querySelectorAll('.project-card');
    
let currentSlide = 0;
const totalSlides = projectCards.length;
    
function updateSlider() {
    if (!projectCards.length || !projectCards[0]) return;
    
    const cardWidth = projectCards[0].offsetWidth + 30; // card width + gap
    if (cardWidth === 30) return; // Card not rendered yet
    
    const offset = -currentSlide * cardWidth;
    projectsSlider.style.transform = `translateX(${offset}px)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Show/hide buttons based on total items
    const shouldShowButtons = totalSlides > 3;
    if (prevBtn) {
        prevBtn.style.display = shouldShowButtons ? 'flex' : 'none';
        prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentSlide === 0 ? 'not-allowed' : 'pointer';
    }
    if (nextBtn) {
        nextBtn.style.display = shouldShowButtons ? 'flex' : 'none';
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
        nextBtn.style.cursor = currentSlide === totalSlides - 1 ? 'not-allowed' : 'pointer';
    }
}

function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
        currentSlide = slideIndex;
        updateSlider();
    }
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlider();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
    }
}

// Event listeners
if (prevBtn) prevBtn.addEventListener('click', prevSlide);
if (nextBtn) nextBtn.addEventListener('click', nextSlide);

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
});

// Keyboard navigation for slider
document.addEventListener('keydown', (e) => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        const isInProjectsSection = projectsSection.getBoundingClientRect().top < window.innerHeight && 
                                  projectsSection.getBoundingClientRect().bottom > 0;

        if (isInProjectsSection) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    }
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

if (projectsSlider) {
    projectsSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    projectsSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide(); // Swipe left
        } else {
            prevSlide(); // Swipe right
        }
    }
}

// Initialize slider
setTimeout(() => {
    updateSlider();
    // Make first card visible
    if (projectCards[0]) {
        projectCards[0].classList.add('visible');
    }
}, 100);

// ========================================
// Skills Slider
// ========================================

const skillsSlider = document.getElementById('skillsSlider');
const skillsPrevBtn = document.getElementById('skillsPrevBtn');
const skillsNextBtn = document.getElementById('skillsNextBtn');
const skillsIndicators = document.querySelectorAll('[data-skills-slide]');
const skillCategories = document.querySelectorAll('.skill-category');

let currentSkillsSlide = 0;
const totalSkillsSlides = skillCategories.length;

function updateSkillsSlider() {
    if (!skillCategories.length || !skillCategories[0]) return;
    
    const cardWidth = skillCategories[0].offsetWidth + 30; // card width + gap
    if (cardWidth === 30) return; // Card not rendered yet
    
    const offset = -currentSkillsSlide * cardWidth;
    skillsSlider.style.transform = `translateX(${offset}px)`;

    // Update indicators
    skillsIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSkillsSlide);
    });

    // Update button states
    if (skillsPrevBtn) {
        skillsPrevBtn.style.opacity = currentSkillsSlide === 0 ? '0.5' : '1';
        skillsPrevBtn.style.cursor = currentSkillsSlide === 0 ? 'not-allowed' : 'pointer';
    }
    if (skillsNextBtn) {
        skillsNextBtn.style.opacity = currentSkillsSlide === totalSkillsSlides - 1 ? '0.5' : '1';
        skillsNextBtn.style.cursor = currentSkillsSlide === totalSkillsSlides - 1 ? 'not-allowed' : 'pointer';
    }
}

function goToSkillsSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalSkillsSlides) {
        currentSkillsSlide = slideIndex;
        updateSkillsSlider();
    }
}

function nextSkillsSlide() {
    if (currentSkillsSlide < totalSkillsSlides - 1) {
        currentSkillsSlide++;
        updateSkillsSlider();
    }
}

function prevSkillsSlide() {
    if (currentSkillsSlide > 0) {
        currentSkillsSlide--;
        updateSkillsSlider();
    }
}

// Event listeners for skills slider
if (skillsPrevBtn) skillsPrevBtn.addEventListener('click', prevSkillsSlide);
if (skillsNextBtn) skillsNextBtn.addEventListener('click', nextSkillsSlide);

skillsIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSkillsSlide(index));
});

// Keyboard navigation for skills slider
document.addEventListener('keydown', (e) => {
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const isInSkillsSection = skillsSection.getBoundingClientRect().top < window.innerHeight && 
                                  skillsSection.getBoundingClientRect().bottom > 0;

        if (isInSkillsSection) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSkillsSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSkillsSlide();
            }
        }
    }
});

// Touch/swipe support for skills slider
let touchStartXSkills = 0;
let touchEndXSkills = 0;

if (skillsSlider) {
    skillsSlider.addEventListener('touchstart', (e) => {
        touchStartXSkills = e.changedTouches[0].screenX;
    });

    skillsSlider.addEventListener('touchend', (e) => {
        touchEndXSkills = e.changedTouches[0].screenX;
        handleSkillsSwipe();
    });
}

function handleSkillsSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartXSkills - touchEndXSkills;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSkillsSlide(); // Swipe left
        } else {
            prevSkillsSlide(); // Swipe right
        }
    }
}

// Initialize skills slider
setTimeout(() => {
    updateSkillsSlider();
    // Make first category visible
    if (skillCategories[0]) {
        skillCategories[0].classList.add('visible');
    }
}, 100);

// ========================================
// Photo Slider
// ========================================

const photoSlider = document.getElementById('photoSlider');
const photoPrevBtn = document.getElementById('photoPrevBtn');
const photoNextBtn = document.getElementById('photoNextBtn');
const photoIndicators = document.querySelectorAll('[data-photo-slide]');
const photoCards = document.querySelectorAll('.photo-card');

let currentPhotoSlide = 0;
const totalPhotoSlides = photoCards.length;
let photoAutoSlideInterval;
let isPhotoPaused = false;

function updatePhotoSlider() {
    if (!photoCards.length || !photoCards[0]) return;
    
    const cardWidth = photoCards[0].offsetWidth + 30; // card width + gap
    if (cardWidth === 30) return; // Card not rendered yet
    
    const offset = -currentPhotoSlide * cardWidth;
    photoSlider.style.transform = `translateX(${offset}px)`;

    // Update indicators
    photoIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentPhotoSlide);
    });

    // Make current card visible
    photoCards.forEach((card, index) => {
        card.classList.toggle('visible', index === currentPhotoSlide);
    });

    // Show/hide buttons based on total items
    const shouldShowButtons = totalPhotoSlides > 3;
    if (photoPrevBtn) {
        photoPrevBtn.style.display = shouldShowButtons ? 'flex' : 'none';
    }
    if (photoNextBtn) {
        photoNextBtn.style.display = shouldShowButtons ? 'flex' : 'none';
    }
}

function goToPhotoSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalPhotoSlides) {
        currentPhotoSlide = slideIndex;
        updatePhotoSlider();
    }
}

function nextPhotoSlide() {
    currentPhotoSlide = (currentPhotoSlide + 1) % totalPhotoSlides; // Looping
    updatePhotoSlider();
}

function prevPhotoSlide() {
    currentPhotoSlide = (currentPhotoSlide - 1 + totalPhotoSlides) % totalPhotoSlides; // Looping
    updatePhotoSlider();
}

function startPhotoAutoSlide() {
    if (!isPhotoPaused) {
        photoAutoSlideInterval = setInterval(() => {
            nextPhotoSlide();
        }, 3000); // Change slide every 3 seconds
    }
}

function stopPhotoAutoSlide() {
    clearInterval(photoAutoSlideInterval);
}

function pausePhotoAutoSlide() {
    isPhotoPaused = true;
    stopPhotoAutoSlide();
}

function resumePhotoAutoSlide() {
    isPhotoPaused = false;
    startPhotoAutoSlide();
}

// Event listeners for photo slider
if (photoPrevBtn) {
    photoPrevBtn.addEventListener('click', () => {
        pausePhotoAutoSlide();
        prevPhotoSlide();
        setTimeout(resumePhotoAutoSlide, 5000); // Resume after 5 seconds
    });
}

if (photoNextBtn) {
    photoNextBtn.addEventListener('click', () => {
        pausePhotoAutoSlide();
        nextPhotoSlide();
        setTimeout(resumePhotoAutoSlide, 5000); // Resume after 5 seconds
    });
}

photoIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        pausePhotoAutoSlide();
        goToPhotoSlide(index);
        setTimeout(resumePhotoAutoSlide, 5000); // Resume after 5 seconds
    });
});

// Touch/swipe support for photo slider
let touchStartXPhoto = 0;
let touchEndXPhoto = 0;

if (photoSlider) {
    photoSlider.addEventListener('touchstart', (e) => {
        touchStartXPhoto = e.changedTouches[0].screenX;
        pausePhotoAutoSlide();
    });

    photoSlider.addEventListener('touchend', (e) => {
        touchEndXPhoto = e.changedTouches[0].screenX;
        handlePhotoSwipe();
        setTimeout(resumePhotoAutoSlide, 5000); // Resume after 5 seconds
    });
}

function handlePhotoSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartXPhoto - touchEndXPhoto;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextPhotoSlide(); // Swipe left
        } else {
            prevPhotoSlide(); // Swipe right
        }
    }
}

// Pause on hover
if (photoSlider) {
    photoSlider.addEventListener('mouseenter', pausePhotoAutoSlide);
    photoSlider.addEventListener('mouseleave', resumePhotoAutoSlide);
}

// Initialize photo slider
setTimeout(() => {
    updatePhotoSlider();
    startPhotoAutoSlide();
}, 100);

// ========================================
// Video Slider
// ========================================

const videoSlider = document.getElementById('videoSlider');
const videoPrevBtn = document.getElementById('videoPrevBtn');
const videoNextBtn = document.getElementById('videoNextBtn');
const videoIndicators = document.querySelectorAll('[data-video-slide]');
const videoCards = document.querySelectorAll('.video-card');

let currentVideoSlide = 0;
const totalVideoSlides = videoCards.length;
let videoAutoSlideInterval;
let isVideoPaused = false;

function updateVideoSlider() {
    if (!videoCards.length || !videoCards[0]) return;
    
    const cardWidth = videoCards[0].offsetWidth + 30; // card width + gap
    if (cardWidth === 30) return; // Card not rendered yet
    
    const offset = -currentVideoSlide * cardWidth;
    videoSlider.style.transform = `translateX(${offset}px)`;

    // Update indicators
    videoIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentVideoSlide);
    });

    // Make current card visible
    videoCards.forEach((card, index) => {
        card.classList.toggle('visible', index === currentVideoSlide);
    });

    // Show/hide buttons based on total items
    const shouldShowButtons = totalVideoSlides > 3;
    if (videoPrevBtn) {
        videoPrevBtn.style.display = shouldShowButtons ? 'flex' : 'none';
    }
    if (videoNextBtn) {
        videoNextBtn.style.display = shouldShowButtons ? 'flex' : 'none';
    }
}

function goToVideoSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalVideoSlides) {
        currentVideoSlide = slideIndex;
        updateVideoSlider();
    }
}

function nextVideoSlide() {
    currentVideoSlide = (currentVideoSlide + 1) % totalVideoSlides; // Looping
    updateVideoSlider();
}

function prevVideoSlide() {
    currentVideoSlide = (currentVideoSlide - 1 + totalVideoSlides) % totalVideoSlides; // Looping
    updateVideoSlider();
}

function startVideoAutoSlide() {
    if (!isVideoPaused) {
        videoAutoSlideInterval = setInterval(() => {
            nextVideoSlide();
        }, 4000); // Change slide every 4 seconds
    }
}

function stopVideoAutoSlide() {
    clearInterval(videoAutoSlideInterval);
}

function pauseVideoAutoSlide() {
    isVideoPaused = true;
    stopVideoAutoSlide();
}

function resumeVideoAutoSlide() {
    isVideoPaused = false;
    startVideoAutoSlide();
}

// Event listeners for video slider
if (videoPrevBtn) {
    videoPrevBtn.addEventListener('click', () => {
        pauseVideoAutoSlide();
        prevVideoSlide();
        setTimeout(resumeVideoAutoSlide, 5000); // Resume after 5 seconds
    });
}

if (videoNextBtn) {
    videoNextBtn.addEventListener('click', () => {
        pauseVideoAutoSlide();
        nextVideoSlide();
        setTimeout(resumeVideoAutoSlide, 5000); // Resume after 5 seconds
    });
}

videoIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        pauseVideoAutoSlide();
        goToVideoSlide(index);
        setTimeout(resumeVideoAutoSlide, 5000); // Resume after 5 seconds
    });
});

// Touch/swipe support for video slider
let touchStartXVideo = 0;
let touchEndXVideo = 0;

if (videoSlider) {
    videoSlider.addEventListener('touchstart', (e) => {
        touchStartXVideo = e.changedTouches[0].screenX;
        pauseVideoAutoSlide();
    });

    videoSlider.addEventListener('touchend', (e) => {
        touchEndXVideo = e.changedTouches[0].screenX;
        handleVideoSwipe();
        setTimeout(resumeVideoAutoSlide, 5000); // Resume after 5 seconds
    });
}

function handleVideoSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartXVideo - touchEndXVideo;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextVideoSlide(); // Swipe left
        } else {
            prevVideoSlide(); // Swipe right
        }
    }
}

// Pause on hover
if (videoSlider) {
    videoSlider.addEventListener('mouseenter', pauseVideoAutoSlide);
    videoSlider.addEventListener('mouseleave', resumeVideoAutoSlide);
}

// Initialize video slider
setTimeout(() => {
    updateVideoSlider();
    startVideoAutoSlide();
}, 100);

// ========================================
// Logo Design Slider
// ========================================

const logoSlider = document.getElementById('logoSlider');
const logoPrevBtn = document.getElementById('logoPrevBtn');
const logoNextBtn = document.getElementById('logoNextBtn');
const logoIndicators = document.querySelectorAll('[data-logo-slide]');
const logoCards = document.querySelectorAll('.logo-card');

let currentLogoSlide = 0;
const totalLogoSlides = logoCards.length;
let logoAutoSlideInterval;
let isLogoPaused = false;

function updateLogoSlider() {
    if (!logoCards.length || !logoCards[0]) return;
    
    const cardWidth = logoCards[0].offsetWidth + 30; // card width + gap
    if (cardWidth === 30) return; // Card not rendered yet
    
    const offset = -currentLogoSlide * cardWidth;
    logoSlider.style.transform = `translateX(${offset}px)`;

    // Update indicators
    logoIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentLogoSlide);
    });

    // Make current card visible
    logoCards.forEach((card, index) => {
        card.classList.toggle('visible', index === currentLogoSlide);
    });

    // Show/hide buttons based on total items
    const shouldShowButtons = totalLogoSlides > 3;
    if (logoPrevBtn) {
        logoPrevBtn.style.display = shouldShowButtons ? 'flex' : 'none';
    }
    if (logoNextBtn) {
        logoNextBtn.style.display = shouldShowButtons ? 'flex' : 'none';
    }
}

function goToLogoSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalLogoSlides) {
        currentLogoSlide = slideIndex;
        updateLogoSlider();
    }
}

function nextLogoSlide() {
    currentLogoSlide = (currentLogoSlide + 1) % totalLogoSlides; // Looping
    updateLogoSlider();
}

function prevLogoSlide() {
    currentLogoSlide = (currentLogoSlide - 1 + totalLogoSlides) % totalLogoSlides; // Looping
    updateLogoSlider();
}

function startLogoAutoSlide() {
    if (!isLogoPaused) {
        logoAutoSlideInterval = setInterval(() => {
            nextLogoSlide();
        }, 3500); // Change slide every 3.5 seconds
    }
}

function stopLogoAutoSlide() {
    clearInterval(logoAutoSlideInterval);
}

function pauseLogoAutoSlide() {
    isLogoPaused = true;
    stopLogoAutoSlide();
}

function resumeLogoAutoSlide() {
    isLogoPaused = false;
    startLogoAutoSlide();
}

// Event listeners for logo slider
if (logoPrevBtn) {
    logoPrevBtn.addEventListener('click', () => {
        pauseLogoAutoSlide();
        prevLogoSlide();
        setTimeout(resumeLogoAutoSlide, 5000); // Resume after 5 seconds
    });
}

if (logoNextBtn) {
    logoNextBtn.addEventListener('click', () => {
        pauseLogoAutoSlide();
        nextLogoSlide();
        setTimeout(resumeLogoAutoSlide, 5000); // Resume after 5 seconds
    });
}

logoIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        pauseLogoAutoSlide();
        goToLogoSlide(index);
        setTimeout(resumeLogoAutoSlide, 5000); // Resume after 5 seconds
    });
});

// Touch/swipe support for logo slider
let touchStartXLogo = 0;
let touchEndXLogo = 0;

if (logoSlider) {
    logoSlider.addEventListener('touchstart', (e) => {
        touchStartXLogo = e.changedTouches[0].screenX;
        pauseLogoAutoSlide();
    });

    logoSlider.addEventListener('touchend', (e) => {
        touchEndXLogo = e.changedTouches[0].screenX;
        handleLogoSwipe();
        setTimeout(resumeLogoAutoSlide, 5000); // Resume after 5 seconds
    });
}

function handleLogoSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartXLogo - touchEndXLogo;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextLogoSlide(); // Swipe left
        } else {
            prevLogoSlide(); // Swipe right
        }
    }
}

// Pause on hover
if (logoSlider) {
    logoSlider.addEventListener('mouseenter', pauseLogoAutoSlide);
    logoSlider.addEventListener('mouseleave', resumeLogoAutoSlide);
}

// Add click listener to logo title to open logo gallery modal
const logoTitle = document.getElementById('logoTitle');
if (logoTitle) {
    logoTitle.style.cursor = 'pointer';
    logoTitle.addEventListener('click', (e) => {
        e.preventDefault();
        openLogoModal();
    });
}

// Add click listeners to logo cards to show individual fullscreen logos
document.querySelectorAll('.logo-card').forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        e.preventDefault();
        // Stop auto-slide when user clicks on logo
        pauseLogoAutoSlide();
        // Get logo source from card
        const img = card.querySelector('img');
        if (img) {
            const logoSrc = img.src;
            const logoAlt = img.alt;
            viewLogoInFullscreen(logoSrc, logoAlt);
        }
    });
});

// Initialize logo slider
setTimeout(() => {
    updateLogoSlider();
    startLogoAutoSlide();
}, 100);

// ========================================
// Initialize
// ========================================

// Ensure we start at top
if (mainContent) {
    mainContent.scrollTop = 0;
}
window.scrollTo(0, 0);

// Trigger initial animations
setTimeout(() => {
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('visible');
    });
}, 200);

// ========================================
// Modal Gallery Functionality
// ========================================

const photoModal = document.getElementById('photoModal');
const videoModal = document.getElementById('videoModal');
const logoModal = document.getElementById('logoModal');
const photoModalClose = document.getElementById('photoModalClose');
const videoModalClose = document.getElementById('videoModalClose');
const logoModalClose = document.getElementById('logoModalClose');
const photoGalleryGrid = document.getElementById('photoGalleryGrid');
const videoGalleryGrid = document.getElementById('videoGalleryGrid');
const logoGalleryGrid = document.getElementById('logoGalleryGrid');

// Photo, video, and logo data from galery folders
const photoFiles = [
    '1foto.jpg', '2foto.jpg', '3foto.jpg', '4foto.jpg', '5foto.jpg',
    '6foto.jpg', '7foto.jpg', '8foto.jpg', '9foto.jpg', '10foto.jpg',
    '11foto.jpeg', '12foto.jpg', '13foto.jpg'
];

const videoFiles = [
    'video1.mp4', 'video2.mp4', 'video3.mp4'
];

const logoFiles = [
    'hirevista.png', 'e-gedung.png', 'speranzs.jpg'
];

// Open photo modal
function openPhotoModal() {
    photoModal.classList.add('active');
    loadPhotoGallery();
    document.body.style.overflow = 'hidden';
}

// Open video modal
function openVideoModal() {
    videoModal.classList.add('active');
    loadVideoGallery();
    document.body.style.overflow = 'hidden';
}

// Open logo modal
function openLogoModal() {
    logoModal.classList.add('active');
    loadLogoGallery();
    document.body.style.overflow = 'hidden';
}

// Close modals
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Load photo gallery
function loadPhotoGallery() {
    photoGalleryGrid.innerHTML = '';
    
    photoFiles.forEach((filename, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="galery/photo/${filename}" alt="Photo ${index + 1}" loading="lazy">
        `;
        
        galleryItem.addEventListener('click', () => {
            viewPhotoInFullscreen(`galery/photo/${filename}`, `Photo ${index + 1}`);
        });
        
        photoGalleryGrid.appendChild(galleryItem);
    });
}

// Load video gallery
function loadVideoGallery() {
    videoGalleryGrid.innerHTML = '';
    
    videoFiles.forEach((filename, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'video-gallery-item';
        galleryItem.innerHTML = `
            <video controls preload="metadata">
                <source src="galery/video/${filename}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="video-overlay-icon">
                <i class="fas fa-play"></i>
            </div>
        `;
        
        videoGalleryGrid.appendChild(galleryItem);
    });
}

// Load logo gallery
function loadLogoGallery() {
    logoGalleryGrid.innerHTML = '';
    
    logoFiles.forEach((filename, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="galery/logo/${filename}" alt="Logo ${index + 1}" loading="lazy">
        `;
        
        galleryItem.addEventListener('click', () => {
            viewLogoInFullscreen(`galery/logo/${filename}`, `Logo ${index + 1}`);
        });
        
        logoGalleryGrid.appendChild(galleryItem);
    });
}

// View photo in fullscreen
function viewPhotoInFullscreen(src, title) {
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = title;
    img.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    fullscreenOverlay.appendChild(img);
    document.body.appendChild(fullscreenOverlay);
    
    fullscreenOverlay.addEventListener('click', () => {
        document.body.removeChild(fullscreenOverlay);
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(fullscreenOverlay);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// View video in fullscreen
function viewVideoInFullscreen(src, title) {
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200000;
        cursor: pointer;
    `;
    
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    fullscreenOverlay.appendChild(video);
    document.body.appendChild(fullscreenOverlay);
    
    // Stop video when clicking outside
    fullscreenOverlay.addEventListener('click', (e) => {
        if (e.target === fullscreenOverlay) {
            video.pause();
            document.body.removeChild(fullscreenOverlay);
        }
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            video.pause();
            document.body.removeChild(fullscreenOverlay);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// View logo in fullscreen
function viewLogoInFullscreen(src, title) {
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = title;
    img.style.cssText = `
        max-width: 80vw;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    fullscreenOverlay.appendChild(img);
    document.body.appendChild(fullscreenOverlay);
    
    fullscreenOverlay.addEventListener('click', () => {
        document.body.removeChild(fullscreenOverlay);
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(fullscreenOverlay);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Event listeners for modal controls
if (photoModalClose && photoModal) {
    photoModalClose.addEventListener('click', () => closeModal(photoModal));
}
if (videoModalClose && videoModal) {
    videoModalClose.addEventListener('click', () => closeModal(videoModal));
}
if (logoModalClose && logoModal) {
    logoModalClose.addEventListener('click', () => closeModal(logoModal));
}

// Close modal when clicking outside
if (photoModal) {
    photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) {
            closeModal(photoModal);
        }
    });
}

if (videoModal) {
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeModal(videoModal);
        }
    });
}

if (logoModal) {
    logoModal.addEventListener('click', (e) => {
        if (e.target === logoModal) {
            closeModal(logoModal);
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (photoModal && photoModal.classList.contains('active')) {
            closeModal(photoModal);
        }
        if (videoModal && videoModal.classList.contains('active')) {
            closeModal(videoModal);
        }
        if (logoModal && logoModal.classList.contains('active')) {
            closeModal(logoModal);
        }
    }
});

// Add click listeners to section titles to open gallery modals
const photographyTitle = document.getElementById('photographyTitle');
const videoTitle = document.getElementById('videoTitle');

if (photographyTitle) {
    photographyTitle.style.cursor = 'pointer';
    photographyTitle.addEventListener('click', (e) => {
        e.preventDefault();
        openPhotoModal();
    });
}

if (videoTitle) {
    videoTitle.style.cursor = 'pointer';
    videoTitle.addEventListener('click', (e) => {
        e.preventDefault();
        openVideoModal();
    });
}

// Add click listeners to photo cards to show individual fullscreen photos
document.querySelectorAll('.photo-card').forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        e.preventDefault();
        // Stop auto-slide when user clicks on photo
        pausePhotoAutoSlide();
        // Get photo source from card
        const img = card.querySelector('img');
        if (img) {
            const photoSrc = img.src;
            const photoAlt = img.alt;
            viewPhotoInFullscreen(photoSrc, photoAlt);
        }
    });
});

// Add click listeners to video cards to show individual fullscreen videos
document.querySelectorAll('.video-card').forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        e.preventDefault();
        // Stop auto-slide when user clicks on video
        pauseVideoAutoSlide();
        // Get video source from card
        const video = card.querySelector('video');
        if (video) {
            const videoSrc = video.querySelector('source').src;
            viewVideoInFullscreen(videoSrc, `Video ${index + 1}`);
        }
    });
});

// Update section IDs array for keyboard navigation
const sectionIds = ['home', 'about', 'experience', 'skills', 'projects', 'creative-project', 'contact'];

// ========================================
// Creative Project Sliders
// ========================================

function setupCreativeSlider(config) {
    const { sliderId, prevBtnId, nextBtnId, indicatorsId, itemSelector, type } = config;

    const slider = document.getElementById(sliderId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const indicatorsContainer = document.getElementById(indicatorsId);
    const items = document.querySelectorAll(itemSelector);

    const totalItems = items.length;

    // Click individual item → fullscreen popup
    items.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            if (item.dataset.swiped === 'true') {
                item.dataset.swiped = '';
                return;
            }
            if (type === 'photo') {
                const img = item.querySelector('img');
                if (img) viewPhotoInFullscreen(img.src, img.alt);
            } else if (type === 'video') {
                const source = item.querySelector('video source');
                const title = item.querySelector('h4')?.textContent || `Video ${index + 1}`;
                if (source) viewVideoInFullscreen(source.src, title);
            } else if (type === 'logo') {
                const img = item.querySelector('img');
                if (img) viewLogoInFullscreen(img.src, img.alt);
            }
        });
    });

    // If 4 or fewer items, disable sliding
    if (totalItems <= 4) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (indicatorsContainer) indicatorsContainer.style.display = 'none';
        return;
    }

    // Generate indicators
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalItems; i++) {
            const span = document.createElement('span');
            span.className = 'indicator' + (i === 0 ? ' active' : '');
            span.addEventListener('click', () => {
                enterManualMode();
                goToSlide(i);
            });
            indicatorsContainer.appendChild(span);
        }
    }

    let currentSlide = 0;
    let autoSlideTimer;
    let manualResumeTimer;
    let isManualMode = false;

    function updateSlider() {
        if (!items.length || !items[0]) return;
        const itemWidth = items[0].offsetWidth + 30; // + gap
        if (itemWidth === 30) return;
        const offset = -currentSlide * itemWidth;
        slider.style.transform = `translateX(${offset}px)`;

        if (indicatorsContainer) {
            indicatorsContainer.querySelectorAll('.indicator').forEach((ind, i) => {
                ind.classList.toggle('active', i === currentSlide);
            });
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalItems;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalItems) % totalItems;
        updateSlider();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    function startAuto() {
        stopAuto();
        if (!isManualMode) {
            autoSlideTimer = setInterval(nextSlide, 6000);
        }
    }

    function stopAuto() {
        clearInterval(autoSlideTimer);
    }

    function enterManualMode() {
        isManualMode = true;
        stopAuto();
        clearTimeout(manualResumeTimer);
        manualResumeTimer = setTimeout(() => {
            isManualMode = false;
            startAuto();
        }, 4000);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            enterManualMode();
            prevSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            enterManualMode();
            nextSlide();
        });
    }

    // Touch/swipe
    let touchStartX = 0;
    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            enterManualMode();
            items.forEach(item => item.dataset.swiped = '');
        });

        slider.addEventListener('touchmove', () => {
            items.forEach(item => item.dataset.swiped = 'true');
        });

        slider.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide(); else prevSlide();
            }
        });
    }

    // Hover also triggers manual mode
    if (slider) {
        slider.addEventListener('mouseenter', enterManualMode);
    }

    setTimeout(() => {
        updateSlider();
        startAuto();
    }, 100);
}

// Initialize Logo Slider (3 items — no slide, no auto)
setupCreativeSlider({
    sliderId: 'creativeLogoSlider',
    prevBtnId: 'creativeLogoPrevBtn',
    nextBtnId: 'creativeLogoNextBtn',
    indicatorsId: 'creativeLogoIndicators',
    itemSelector: '.creative-item.creative-logo',
    type: 'logo'
});

// Initialize Photo Slider (13 items — slide + auto)
setupCreativeSlider({
    sliderId: 'creativePhotoSlider',
    prevBtnId: 'creativePhotoPrevBtn',
    nextBtnId: 'creativePhotoNextBtn',
    indicatorsId: 'creativePhotoIndicators',
    itemSelector: '.creative-item.creative-photo',
    type: 'photo'
});

// Initialize Video Slider (3 items — no slide, no auto)
setupCreativeSlider({
    sliderId: 'creativeVideoSlider',
    prevBtnId: 'creativeVideoPrevBtn',
    nextBtnId: 'creativeVideoNextBtn',
    indicatorsId: 'creativeVideoIndicators',
    itemSelector: '.creative-item.creative-video',
    type: 'video'
});

    // ========================================
    // Single Page Scroll Navigation
    // ========================================

    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Show/hide scroll to top button
    function handleScrollToTop() {
        if (scrollToTopBtn) {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', throttle(handleScrollToTop, 100));
    handleScrollToTop();

    // Active nav link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavOnScroll() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkSection = link.getAttribute('data-section');
            if (linkSection === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 100));

    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    const navHeight = document.querySelector('.top-nav').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight + 1;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Smooth scroll for hero buttons and other anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    const navHeight = document.querySelector('.top-nav').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight + 1;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    console.log('Portfolio scroll navigation initialized successfully!');
});
