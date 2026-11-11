/**
 * CAPDARE — TRAVEL CONTENT PRODUCTION & COLLABORATION PROPOSAL
 * Interactive Presentation Engine with Bilingual Support (EN / AR)
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
  const langBtns = document.querySelectorAll('.lang-btn');

  let currentSectionIndex = 0;
  const totalSections = sections.length;

  if (navCounterTotal) {
    navCounterTotal.textContent = String(totalSections).padStart(2, '0');
  }

  // Bilingual Tooltip Titles & Metadata
  const timelineTitles = {
    en: [
      '01 Cover', '02 Who We Are', '03 Our Experience', '04 The Team',
      '05 Digital Reach', '06 Why CapDare', '07 The Idea', '08 Collaboration',
      '09 Content Strategy', '10 The 5 Episodes', '11 Stories Coverage', '12 Multi-Platform',
      '13 Production Team', '14 How We Work', '15 Travel & Logistics', '16 Financial Terms',
      '17 Partner Value', '18 Complete Package', '19 The Big Picture', '20 Let\'s Collaborate'
    ],
    ar: [
      '01 الغلاف', '02 من نحن', '03 سابقة الأعمال', '04 فريق العمل',
      '05 الانتشار الرقمي', '06 لماذا كعب داير', '07 الفكرة', '08 فرصة التعاون',
      '09 استراتيجية المحتوى', '10 الحلقات الخمس', '11 الستوريز والتغطية', '12 المنصات الرقمية',
      '13 فريق الرحلة', '14 نموذج العمل', '15 الترتيبات واللوجستيات', '16 الاتفاق المالي',
      '17 القيمة المكتسبة', '18 الحزمة المتكاملة', '19 الصورة الكاملة', '20 لنبدأ التعاون'
    ]
  };

  const pageTitles = {
    en: 'CapDare | Travel Content Production & Collaboration Proposal',
    ar: 'كعب داير | ملف إنتاج محتوى السفر والشراكة الاستراتيجية'
  };

  // Language State Management
  function setLanguage(lang) {
    const validLang = lang === 'ar' ? 'ar' : 'en';
    
    // Set HTML attributes
    document.documentElement.lang = validLang;
    document.documentElement.dir = (validLang === 'ar' ? 'rtl' : 'ltr');
    
    // Update Page Title
    document.title = pageTitles[validLang];

    // Update active state in switcher buttons
    langBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === validLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update timeline tooltips
    navSteps.forEach((step, idx) => {
      const tooltip = step.querySelector('.nav-timeline-tooltip');
      const dot = step.querySelector('.nav-timeline-dot');
      const label = timelineTitles[validLang][idx] || `Slide ${idx + 1}`;
      if (tooltip) tooltip.textContent = label;
      if (dot) dot.setAttribute('aria-label', label);
    });

    // Save preference
    try {
      localStorage.setItem('capdare_lang', validLang);
    } catch (e) {
      // localStorage might be unavailable in sandboxed iframes
    }

    // Refresh Navigation state without resetting slide position
    updateNav(currentSectionIndex);
  }

  // Setup Language Switcher Listeners
  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      setLanguage(targetLang);
    });
  });

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
      navTrack.style.width = `${Math.max(5, progressPercent)}%`;
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

  // Intersection Observer for Smooth Scrolling Detection
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

  // ProMedia Intro Screen Handlers
  const promediaIntro = document.getElementById('promedia-intro');
  const enterBtn = document.getElementById('enterPresentationBtn');
  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(0);
    });
  }

  if (promediaIntro) {
    const introObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (navbar) navbar.classList.add('is-dark-section');
          if (navCounterCurrent) navCounterCurrent.textContent = '00';
          if (navTrack) navTrack.style.width = '0%';
          navSteps.forEach(s => s.classList.remove('active', 'passed'));
        }
      });
    }, { threshold: 0.4 });
    introObserver.observe(promediaIntro);
  }

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
      const isRtl = document.documentElement.dir === 'rtl';
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

    const isRtl = document.documentElement.dir === 'rtl';

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      goToSlide(Math.min(totalSections - 1, currentSectionIndex + 1));
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goToSlide(Math.max(0, currentSectionIndex - 1));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      // In LTR, Right is forward; In RTL, Right is backward
      if (isRtl) {
        goToSlide(Math.max(0, currentSectionIndex - 1));
      } else {
        goToSlide(Math.min(totalSections - 1, currentSectionIndex + 1));
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      // In LTR, Left is backward; In RTL, Left is forward
      if (isRtl) {
        goToSlide(Math.min(totalSections - 1, currentSectionIndex + 1));
      } else {
        goToSlide(Math.max(0, currentSectionIndex - 1));
      }
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

  // Fullscreen Handler with cross-browser Android & iOS guard
  function toggleFullscreen() {
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn(`Fullscreen error: ${err.message}`);
        });
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // Modal Handlers with scroll lock & restore
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function closeAllModals() {
    if (galleryModal) galleryModal.classList.remove('active');
    if (videoModal) videoModal.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowX = 'hidden';
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

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
      openModal(galleryModal);
    });
  });

  // Video Reference Trigger Hooks
  document.querySelectorAll('[data-video-url]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const videoUrl = el.getAttribute('data-video-url');
      const videoTitle = el.getAttribute('data-video-title') || 'Official Video Reference';
      const videoDesc = el.getAttribute('data-video-desc') || '';

      const modalTitle = document.getElementById('videoModalTitle');
      const modalDesc = document.getElementById('videoModalDesc');
      const modalLink = document.getElementById('videoModalLink');

      if (modalTitle) modalTitle.textContent = videoTitle;
      if (modalDesc) modalDesc.textContent = videoDesc;
      if (modalLink) modalLink.href = videoUrl;

      openModal(videoModal);
    });
  });

  // Video Player Fullscreen & Viewport Restorer (Android & iOS)
  const outroVideo = document.querySelector('.outro-main-video-el');
  if (outroVideo) {
    outroVideo.setAttribute('playsinline', '');
    outroVideo.setAttribute('webkit-playsinline', 'true');
    outroVideo.setAttribute('x5-playsinline', 'true');

    const restorePlayerLayout = () => {
      document.body.style.overflow = '';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflow = '';
      document.documentElement.style.overflowX = 'hidden';
      outroVideo.style.width = '100%';
      outroVideo.style.height = '100%';
      outroVideo.style.objectFit = 'contain';
    };

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        restorePlayerLayout();
      }
    });
    document.addEventListener('webkitfullscreenchange', () => {
      if (!document.webkitFullscreenElement) {
        restorePlayerLayout();
      }
    });
    outroVideo.addEventListener('webkitendfullscreen', restorePlayerLayout);
  }

  // Default to English on load
  let initialLang = 'en';
  try {
    const saved = localStorage.getItem('capdare_lang');
    if (saved === 'ar' || saved === 'en') {
      initialLang = saved;
    }
  } catch (e) {}

  setLanguage(initialLang);
  updateNav(0);
});
