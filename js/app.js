/**
 * K3AB DAYR — UMRAH SPECIAL (SEASON 3)
 * Interactive Presentation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const sections = Array.from(document.querySelectorAll('.slide-section'));
  const navTrack = document.querySelector('.nav-timeline-fill');
  const navSteps = Array.from(document.querySelectorAll('.nav-timeline-step'));
  const navCounterCurrent = document.querySelector('.nav-counter-current');
  const navCounterTotal = document.querySelector('.nav-counter-total');
  const navbar = document.querySelector('.top-navbar');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const galleryModal = document.getElementById('galleryModal');
  const videoModal = document.getElementById('videoModal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  let currentSectionIndex = 0;
  const totalSections = sections.length;

  if (navCounterTotal) {
    navCounterTotal.textContent = String(totalSections).padStart(2, '0');
  }

  // Update Navigation UI
  function updateNav(index) {
    currentSectionIndex = index;
    
    // Update Counter
    if (navCounterCurrent) {
      navCounterCurrent.textContent = String(index + 1).padStart(2, '0');
    }

    // Update Progress Fill
    if (navTrack) {
      const progressPercent = ((index) / (totalSections - 1)) * 100;
      navTrack.style.width = `${Math.max(4, progressPercent)}%`;
    }

    // Update Dots
    navSteps.forEach((step, i) => {
      if (i === index) {
        step.classList.add('active');
        step.classList.remove('passed');
      } else if (i < index) {
        step.classList.remove('active');
        step.classList.add('passed');
      } else {
        step.classList.remove('active', 'passed');
      }
    });

    // Update Navbar Theme based on active slide theme
    const activeSection = sections[index];
    if (activeSection) {
      const isDark = activeSection.classList.contains('theme-cinematic') || 
                     activeSection.classList.contains('theme-blue') || 
                     activeSection.classList.contains('cover-section') || 
                     activeSection.classList.contains('closing-section');
      
      if (isDark) {
        navbar.classList.add('is-dark-section');
      } else {
        navbar.classList.remove('is-dark-section');
      }
    }
  }

  // Intersection Observer for Smooth Scrolling
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -20% 0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = sections.indexOf(entry.target);
        if (index !== -1) {
          updateNav(index);
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Jump to slide function
  function goToSlide(index) {
    if (index < 0 || index >= totalSections) return;
    const targetSection = sections[index];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Timeline dot clicks
  navSteps.forEach((step, i) => {
    step.addEventListener('click', () => {
      goToSlide(i);
    });
  });

  // Next / Prev button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(Math.max(0, currentSectionIndex - 1));
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(Math.min(totalSections - 1, currentSectionIndex + 1));
    });
  }

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    // If modal is open, let Escape close it
    if (e.key === 'Escape') {
      closeAllModals();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      goToSlide(Math.min(totalSections - 1, currentSectionIndex + 1));
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'PageUp') {
      e.preventDefault();
      goToSlide(Math.max(0, currentSectionIndex - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(totalSections - 1);
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
  });

  // Fullscreen Handler
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // Modal Handlers
  function closeAllModals() {
    if (galleryModal) galleryModal.classList.remove('active');
    if (videoModal) videoModal.classList.remove('active');
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Close modal when clicking outside dialog
  [galleryModal, videoModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
      });
    }
  });

  // Gallery Trigger Hooks
  document.querySelectorAll('[data-gallery-src]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = el.getAttribute('data-gallery-src');
      const imgTitle = el.getAttribute('data-gallery-title') || '';
      
      const modalImg = document.getElementById('galleryModalImg');
      const modalTitle = document.getElementById('galleryModalTitle');
      
      if (modalImg) modalImg.src = imgSrc;
      if (modalTitle) modalTitle.textContent = imgTitle;
      if (galleryModal) galleryModal.classList.add('active');
    });
  });

  // Video Reference Trigger Hooks
  document.querySelectorAll('[data-video-url]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const videoUrl = el.getAttribute('data-video-url');
      const videoTitle = el.getAttribute('data-video-title') || 'Instagram Reel Reference';
      const videoDesc = el.getAttribute('data-video-desc') || '';

      const modalTitle = document.getElementById('videoModalTitle');
      const modalDesc = document.getElementById('videoModalDesc');
      const modalLink = document.getElementById('videoModalLink');

      if (modalTitle) modalTitle.textContent = videoTitle;
      if (modalDesc) modalDesc.textContent = videoDesc;
      if (modalLink) modalLink.href = videoUrl;

      if (videoModal) videoModal.classList.add('active');
    });
  });

  // Initialize
  updateNav(0);
});
