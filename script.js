// Initialize Lucide Icons and Carousel
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  setTimeout(initCarousel, 300);
});

// Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
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

// Intersection Observer for Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// Counter Animation
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current) + '+';
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + '+';
    }
  };

  updateCounter();
}

// Observe stat values for counter animation
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value[data-target]').forEach(el => {
  statObserver.observe(el);
});

// Gallery Lightbox
const galleryItems = document.querySelectorAll('.bento-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose.addEventListener('click', () => {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Navbar scroll effect
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    nav.style.background = 'rgba(10, 10, 10, 0.95)';
    nav.style.backdropFilter = 'blur(20px)';
  } else {
    nav.style.background = 'rgba(10, 10, 10, 0.8)';
  }
  
  lastScroll = currentScroll;
});

// Parallax effect for hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero-content');
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
  }
});

// Testimonials Carousel - Infinite loop auto-scrolling
function initCarousel() {
  const track = document.getElementById('carousel-track');
  const indicatorsContainer = document.getElementById('carousel-indicators');
  if (!track || !indicatorsContainer) return;

  const originalCards = track.querySelectorAll('.testimonial-card');
  if (originalCards.length === 0) return;

  const totalCards = originalCards.length;
  
  // Clone cards for infinite loop (clone 2 sets for seamless transition)
  const cardsArray = Array.from(originalCards);
  cardsArray.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });
  cardsArray.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  // Create indicators for original cards only
  for (let i = 0; i < totalCards; i++) {
    const indicator = document.createElement('div');
    indicator.className = 'carousel-indicator';
    if (i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(i));
    indicatorsContainer.appendChild(indicator);
  }

  const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
  const allCards = track.querySelectorAll('.testimonial-card');
  
  let currentIndex = 0;
  let scrollPosition = 0;
  let isScrolling = false;
  let autoScrollInterval;

  function getVisibleCards() {
    const container = track.parentElement;
    const containerWidth = container.offsetWidth;
    if (containerWidth >= 1200) return 3;
    if (containerWidth >= 768) return 2;
    return 1;
  }

  function getCardWidth() {
    const firstCard = allCards[0];
    if (!firstCard || firstCard.offsetWidth === 0) return 0;
    return firstCard.offsetWidth + 24; // card width + gap
  }

  function updateCarousel() {
    if (isScrolling) return;
    
    const cardWidth = getCardWidth();
    if (cardWidth === 0) return;
    
    isScrolling = true;
    track.style.transform = `translateX(-${scrollPosition}px)`;
    
    // Calculate which original card is in view (for indicators)
    const visibleIndex = Math.round(scrollPosition / cardWidth) % totalCards;
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === visibleIndex);
    });
    
    setTimeout(() => {
      isScrolling = false;
    }, 600);
  }

  function nextSlide() {
    const cardWidth = getCardWidth();
    if (cardWidth === 0) return;
    
    scrollPosition += cardWidth;
    currentIndex = (currentIndex + 1) % totalCards;
    
    // Reset position seamlessly when we've scrolled through all original cards
    const maxScroll = cardWidth * totalCards;
    if (scrollPosition >= maxScroll) {
      scrollPosition = 0;
      track.style.transition = 'none';
      track.style.transform = `translateX(-${scrollPosition}px)`;
      void track.offsetWidth; // Force reflow
      track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    updateCarousel();
    resetAutoScroll();
  }

  function goToSlide(index) {
    const cardWidth = getCardWidth();
    if (cardWidth === 0) return;
    
    currentIndex = index;
    scrollPosition = cardWidth * index;
    updateCarousel();
    resetAutoScroll();
  }

  function startAutoScroll() {
    const visibleCards = getVisibleCards();
    const scrollSpeed = visibleCards === 3 ? 3000 : visibleCards === 2 ? 2500 : 2000;
    
    autoScrollInterval = setInterval(() => {
      nextSlide();
    }, scrollSpeed);
  }

  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  function resetAutoScroll() {
    stopAutoScroll();
    startAutoScroll();
  }

  // Pause on hover
  const carousel = document.querySelector('.testimonials-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
  }

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      stopAutoScroll();
      scrollPosition = 0;
      currentIndex = 0;
      track.style.transition = 'none';
      track.style.transform = `translateX(0)`;
      void track.offsetWidth;
      track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      updateCarousel();
      startAutoScroll();
    }, 250);
  });

  // Initialize after ensuring cards are rendered
  setTimeout(() => {
    updateCarousel();
    startAutoScroll();
  }, 800);
}
