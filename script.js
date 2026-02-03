/* ============================================
   SHAMBHAVI ANTIWAN - PORTFOLIO JAVASCRIPT
   Interactions, Animations & Dynamic Features
   ============================================ */

// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });
    
    // Load Medium articles
    loadMediumArticles();
});

// ============================================
// MEDIUM ARTICLES - AUTO-UPDATE FROM RSS
// ============================================
async function loadMediumArticles() {
    const articlesContainer = document.getElementById('medium-articles');
    if (!articlesContainer) return;
    
    const mediumUsername = 'shambhavi.antiwan';
    // Using rss2json API to convert Medium RSS to JSON (handles CORS)
    const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUsername}`;
    
    try {
        const response = await fetch(rssUrl);
        const data = await response.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
            displayArticles(data.items, articlesContainer);
        } else {
            displayFallbackArticles(articlesContainer);
        }
    } catch (error) {
        console.log('Could not fetch Medium articles:', error);
        displayFallbackArticles(articlesContainer);
    }
}

function displayArticles(articles, container) {
    // Clear loading state
    container.innerHTML = '';
    
    // Display up to 4 articles
    const articlesToShow = articles.slice(0, 4);
    
    articlesToShow.forEach((article, index) => {
        const articleCard = createArticleCard(article, index);
        container.appendChild(articleCard);
    });
    
    // Reinitialize AOS for new elements
    AOS.refresh();
}

function createArticleCard(article, index) {
    const card = document.createElement('article');
    card.className = 'article-card glass-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index + 1) * 100);
    
    // Extract excerpt from content (strip HTML tags)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = article.description || article.content || '';
    let excerpt = tempDiv.textContent || tempDiv.innerText || '';
    excerpt = excerpt.substring(0, 150).trim() + '...';
    
    // Format date
    const pubDate = new Date(article.pubDate);
    const formattedDate = pubDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    // Estimate read time (average 200 words per minute)
    const wordCount = (tempDiv.textContent || '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    
    // Get thumbnail if available
    const thumbnail = article.thumbnail || '';
    
    card.innerHTML = `
        <div class="article-image" ${thumbnail ? `style="background-image: url('${thumbnail}'); background-size: cover; background-position: center;"` : ''}>
            <div class="article-category">Medium</div>
            <div class="article-overlay">
                <a href="${article.link}" target="_blank" class="read-more-btn">
                    Read Article <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
        <div class="article-content">
            <div class="article-meta">
                <span class="article-date">
                    <i class="fas fa-calendar"></i> ${formattedDate}
                </span>
                <span class="article-read-time">
                    <i class="fas fa-clock"></i> ${readTime} min read
                </span>
            </div>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${excerpt}</p>
            <a href="${article.link}" target="_blank" class="article-link">
                Continue Reading <i class="fas fa-long-arrow-alt-right"></i>
            </a>
        </div>
    `;
    
    return card;
}

function displayFallbackArticles(container) {
    // Fallback to hardcoded article if RSS fails
    container.innerHTML = `
        <article class="article-card glass-card" data-aos="fade-up" data-aos-delay="100">
            <div class="article-image">
                <div class="article-category">Human Resources</div>
                <div class="article-overlay">
                    <a href="https://medium.com/@shambhavi.antiwan" target="_blank" class="read-more-btn">
                        Read Article <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-date">
                        <i class="fas fa-calendar"></i> Aug 27, 2025
                    </span>
                    <span class="article-read-time">
                        <i class="fas fa-clock"></i> 5 min read
                    </span>
                </div>
                <h3 class="article-title">Dive into Human Resources: Chapter 1 — The Silent Voice</h3>
                <p class="article-excerpt">
                    She sat at a table in the middle of the coffee shop, her notebook open, 
                    a pen resting between her fingers. The to-do list for tomorrow...
                </p>
                <a href="https://medium.com/@shambhavi.antiwan" target="_blank" class="article-link">
                    Continue Reading <i class="fas fa-long-arrow-alt-right"></i>
                </a>
            </div>
        </article>
        <div class="article-card coming-soon glass-card" data-aos="fade-up" data-aos-delay="200">
            <div class="coming-soon-content">
                <div class="coming-soon-icon">
                    <i class="fab fa-medium"></i>
                </div>
                <h3>More Articles Coming Soon</h3>
                <p>Follow my journey for more HR insights and stories!</p>
                <a href="https://medium.com/@shambhavi.antiwan" target="_blank" class="follow-btn">
                    <i class="fab fa-medium"></i> Follow on Medium
                </a>
            </div>
        </div>
    `;
    AOS.refresh();
}

// ============================================
// CURSOR GLOW EFFECT
// ============================================
const cursorGlow = document.querySelector('.cursor-glow');

if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// MOBILE NAVIGATION
// ============================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ============================================
// ACTIVE NAVIGATION LINK ON SCROLL
// ============================================
const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavOnScroll);

// ============================================
// TYPEWRITER EFFECT
// ============================================
class Typewriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait, 10);
        this.txt = '';
        this.wordIndex = 0;
        this.isDeleting = false;
        this.type();
    }
    
    type() {
        const currentIndex = this.wordIndex % this.words.length;
        const currentWord = this.words[currentIndex];
        
        if (this.isDeleting) {
            this.txt = currentWord.substring(0, this.txt.length - 1);
        } else {
            this.txt = currentWord.substring(0, this.txt.length + 1);
        }
        
        this.element.textContent = this.txt;
        
        let typeSpeed = 100;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.txt === currentWord) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize Typewriter
document.addEventListener('DOMContentLoaded', () => {
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const words = [
            'HR Operations Specialist',
            'Talent Acquisition Pro',
            'Employee Engagement Advocate',
            'SAP HR Analyst',
            'MS HRM Candidate'
        ];
        new Typewriter(typewriterElement, words, 2500);
    }
});

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when about section is in view
const aboutSection = document.querySelector('.about');
let countersAnimated = false;

const observerOptions = {
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            animateCounters();
            countersAnimated = true;
        }
    });
}, observerOptions);

if (aboutSection) {
    counterObserver.observe(aboutSection);
}

// ============================================
// SKILL BARS ANIMATION
// ============================================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
    });
}

// Trigger skill bars animation when skills section is in view
const skillsSection = document.querySelector('.skills');
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            animateSkillBars();
            skillsAnimated = true;
        }
    });
}, { threshold: 0.3 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// FORM SUBMISSION HANDLING
// ============================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Success state
            submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)';
            
            // Reset form
            this.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// ============================================
// PARALLAX EFFECT FOR FLOATING SHAPES
// ============================================
const floatingShapes = document.querySelectorAll('.floating-shape');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    floatingShapes.forEach((shape, index) => {
        const speed = 0.05 * (index + 1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ============================================
// LAZY LOADING IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// TOOLTIP FUNCTIONALITY
// ============================================
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
        tooltip.style.opacity = '1';
    });
    
    element.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) tooltip.remove();
    });
});

// ============================================
// RANDOM SUBTLE ANIMATIONS FOR DECORATIONS
// ============================================
function addRandomAnimation() {
    const decorations = document.querySelectorAll('.image-decoration');
    
    decorations.forEach(dec => {
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            dec.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 2000);
    });
}

addRandomAnimation();

// ============================================
// PREVENT FLASH OF UNSTYLED CONTENT
// ============================================
document.documentElement.classList.add('js-loaded');

// ============================================
// EASTER EGG - KONAMI CODE
// ============================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Activate fun mode
            document.body.style.transition = 'filter 0.5s ease';
            document.body.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 3000);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// ============================================
// PRINT STYLES HANDLER
// ============================================
window.addEventListener('beforeprint', () => {
    // Expand all sections for print
    document.querySelectorAll('.skill-progress').forEach(bar => {
        bar.style.transition = 'none';
        bar.style.width = bar.getAttribute('data-width');
    });
});

// ============================================
// ACCESSIBILITY - REDUCE MOTION
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
    
    AOS.init({
        disable: true
    });
}

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c✨ Hello there! ✨', 'font-size: 24px; color: #e91e63; font-weight: bold;');
console.log('%cWelcome to Shambhavi Antiwan\'s Portfolio', 'font-size: 14px; color: #9c27b0;');
console.log('%cInterested in connecting? Visit the contact section!', 'font-size: 12px; color: #666;');
