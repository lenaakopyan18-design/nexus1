/**
 * NEXUS MODERN LANDING PAGE - JAVASCRIPT
 * Features:
 * - Theme Switcher (Dark / Light with LocalStorage & OS preference)
 * - Mobile Navigation Menu with Accessible Controls
 * - Header Scroll Effects & Active Link ScrollSpy
 * - Form Validation with Real-time Feedback & Toast Notifications
 * - Subtle Interactive 3D Card Spotlight
 * - Floating Back to Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollEffects();
  initContactForm();
  initFeatureCardTilt();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved preference or check OS preference
  const savedTheme = localStorage.getItem('nexus-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('nexus-theme', newTheme);
      showToast('Theme updated', `Switched to ${newTheme} mode`, 'success');
    });
  }

  // Listen to OS theme changes if user has not set explicit preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('nexus-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#07090e' : '#f8fafc');
    }
  }
}

/* --------------------------------------------------------------------------
   2. Responsive Navigation & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavigation() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-cta');

  if (!hamburgerBtn || !navMenu) return;

  function toggleMenu(isOpen) {
    const shouldOpen = isOpen !== undefined ? isOpen : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', shouldOpen);
    hamburgerBtn.classList.toggle('active', shouldOpen);
    hamburgerBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    document.body.classList.toggle('menu-open', shouldOpen);
  }

  hamburgerBtn.addEventListener('click', () => toggleMenu());

  // Close menu when clicking outside or clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  // Close on window resize if larger than tablet breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. Scroll Header, ScrollSpy & Back to Top
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header styling on scroll
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // ScrollSpy active link detection
    let currentSectionId = '';
    const scrollPosition = scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial run

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* --------------------------------------------------------------------------
   4. Contact Form Validation & Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const submitBtn = document.getElementById('submit-btn');

  const groupName = document.getElementById('group-name');
  const groupEmail = document.getElementById('group-email');

  // Real-time input clearing of error states
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length >= 2) {
      clearError(groupName);
    }
  });

  emailInput.addEventListener('input', () => {
    if (isValidEmail(emailInput.value.trim())) {
      clearError(groupEmail);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();

    // Validate Name
    if (!nameVal || nameVal.length < 2) {
      showError(groupName);
      hasErrors = true;
    } else {
      clearError(groupName);
    }

    // Validate Email
    if (!emailVal || !isValidEmail(emailVal)) {
      showError(groupEmail);
      hasErrors = true;
    } else {
      clearError(groupEmail);
    }

    if (hasErrors) {
      showToast('Validation Error', 'Please check highlighted fields and try again.', 'error');
      return;
    }

    // Set Loading State
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Success feedback
      showToast(
        'Message Sent Successfully!',
        `Thank you ${nameVal}! Our team will get back to you at ${emailVal} shortly.`,
        'success'
      );

      form.reset();
    } catch (err) {
      showToast('Submission Failed', 'Something went wrong. Please try again.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  function showError(formGroup) {
    if (formGroup) {
      formGroup.classList.add('has-error');
    }
  }

  function clearError(formGroup) {
    if (formGroup) {
      formGroup.classList.remove('has-error');
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* --------------------------------------------------------------------------
   5. Custom Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = type === 'success' 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
         <polyline points="20 6 9 17 4 12"></polyline>
       </svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
         <circle cx="12" cy="12" r="10"></circle>
         <line x1="12" y1="8" x2="12" y2="12"></line>
         <line x1="12" y1="16" x2="12.01" y2="16"></line>
       </svg>`;

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-body">
      <div class="toast-title">${escapeHTML(title)}</div>
      <div class="toast-msg">${escapeHTML(message)}</div>
    </div>
    <button class="toast-close" aria-label="Close notification">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  let dismissTimeout;

  function dismiss() {
    clearTimeout(dismissTimeout);
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 250);
  }

  closeBtn.addEventListener('click', dismiss);
  dismissTimeout = setTimeout(dismiss, 4500);

  container.appendChild(toast);
}

function escapeHTML(str) {
  const p = document.createElement('p');
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
}

/* --------------------------------------------------------------------------
   6. Subtle Feature Card Interactive Hover Spotlight
   -------------------------------------------------------------------------- */
function initFeatureCardTilt() {
  // Only apply on non-touch devices
  if (window.matchMedia('(pointer: fine)').matches) {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }
}
