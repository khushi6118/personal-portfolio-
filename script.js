/**
 * Portfolio Interactive Scripts - Khushi Jain
 * B.Tech CSE (AI & ML) - JECRC University
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DYNAMIC FOOTER YEAR
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. THEME SWITCHER (DARK / LIGHT)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

  document.body.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      showToast(`<i class="fa-solid fa-circle-check"></i> Switched to ${newTheme} mode`);
    });
  }

  // --------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHTING
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    const scrollY = window.pageYOffset;

    // Sticky Navbar style
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active Section Link Highlighting
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });

    // Back to top button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger initial check

  // Back to top action
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. TYPEWRITER EFFECT IN HERO SECTION
  // --------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriter');
  const wordsToType = [
    'Aspiring AI & ML Engineer',
    'B.Tech CSE Student @ JECRC',
    'Python & C Programmer',
    'Robotics & Smart Systems Enthusiast',
    'Problem Solver & Communicator'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const pauseDuration = 1800;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentWord = wordsToType[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % wordsToType.length;
      delay = 400;
    }

    setTimeout(typeEffect, delay);
  }

  typeEffect();

  // --------------------------------------------------------------------------
  // 6. COPY TO CLIPBOARD HELPER
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const textToCopy = button.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for non-https local contexts
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        showToast(`<i class="fa-solid fa-copy"></i> Copied "${textToCopy}" to clipboard!`);
      } catch (err) {
        showToast(`<i class="fa-solid fa-circle-exclamation"></i> Unable to copy automatically`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.innerHTML = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 8. PROJECT DETAILS MODAL DATA & HANDLERS
  // --------------------------------------------------------------------------
  const projectData = {
    'smart-house': {
      title: 'Smart House System',
      subtitle: 'Home Automation & Efficient Resource Management Prototype',
      iconClass: 'fa-solid fa-house-signal house-gradient',
      overview: 'The Smart House project is an intelligent home automation solution designed to modernize everyday domestic operations. By uniting conditional control logic with hardware automation, this system creates an energy-efficient, interconnected living environment.',
      features: [
        'Automated lighting and appliance switches regulated by input triggers and conditions.',
        'Prototyped layout simulating living room, entryway, and security sensors.',
        'Energy conservation model: appliances shut off automatically when inactive to prevent wastage.',
        'Scalable blueprint designed to integrate Wi-Fi modules and future AI voice assistants.'
      ],
      tech: ['Python', 'Control Logic', 'Sensors Simulation', 'IoT Architecture'],
      impact: 'Demonstrated practical system design in smart home technology, laying the foundation for future intelligent IoT algorithms.'
    },
    'smart-dustbin': {
      title: 'Smart Dustbin using Python',
      subtitle: 'Contactless Hygienic Waste Management & Proximity Actuation',
      iconClass: 'fa-solid fa-trash-can dustbin-gradient',
      overview: 'The Smart Dustbin is an automated sanitation prototype crafted using Python logic and ultrasonic distance detection. It aims to curb pathogen transmission by enabling completely hands-free waste disposal.',
      features: [
        'Proximity detection: detects hands or trash within a calibrated threshold distance.',
        'Servo motor actuation: smoothly lifts the lid upon proximity and holds open for timed disposal.',
        'Automatic closure mechanism: safely seals back to contain odors and maintain strict hygiene.',
        'Python code controller coordinating signal inputs and motor drive outputs.'
      ],
      tech: ['Python', 'Ultrasonic Sensing', 'Servo Actuation', 'Automation Circuits'],
      impact: 'Recognized for practical laboratory excellence and relevance to public sanitation, clean campus drives, and healthcare settings.'
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  const detailTriggers = document.querySelectorAll('.details-trigger');

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data || !projectModal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-header-icon ${data.iconClass.split(' ')[2] || 'house-gradient'}">
        <i class="${data.iconClass.split(' ').slice(0, 2).join(' ')}"></i>
      </div>
      <h3 class="modal-title" id="modal-title">${data.title}</h3>
      <div class="modal-subtitle">${data.subtitle}</div>

      <h4 class="modal-section-title"><i class="fa-solid fa-circle-info"></i> Project Overview</h4>
      <p class="modal-text">${data.overview}</p>

      <h4 class="modal-section-title"><i class="fa-solid fa-list-check"></i> System Specifications &amp; Features</h4>
      <ul class="project-features" style="margin-bottom: 1.2rem;">
        ${data.features.map(f => `<li><i class="fa-solid fa-check-circle"></i> <span>${f}</span></li>`).join('')}
      </ul>

      <h4 class="modal-section-title"><i class="fa-solid fa-microchip"></i> Technologies &amp; Tools</h4>
      <div class="tech-stack" style="margin-bottom: 1.4rem;">
        ${data.tech.map(t => `<span class="tech-pill">${t}</span>`).join('')}
      </div>

      <h4 class="modal-section-title"><i class="fa-solid fa-chart-line"></i> Outcomes &amp; Impact</h4>
      <p class="modal-text" style="margin-bottom: 1.5rem;">${data.impact}</p>

      <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
        <a href="https://github.com/khushi6118" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <i class="fa-brands fa-github"></i> Visit GitHub Profile
        </a>
        <button type="button" class="btn btn-secondary btn-sm" id="close-modal-inline-btn">
          Close Window
        </button>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const inlineClose = document.getElementById('close-modal-inline-btn');
    if (inlineClose) {
      inlineClose.addEventListener('click', closeProjectModal);
    }
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  detailTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project');
      openProjectModal(id);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // --------------------------------------------------------------------------
  // 9. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  function clearErrors() {
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input && input.closest('.form-group')) {
        input.closest('.form-group').classList.remove('error');
      }
    });
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (subjectError) subjectError.textContent = '';
    if (messageError) messageError.textContent = '';
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Clear error on input
  [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
    if (field) {
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group && group.classList.contains('error')) {
          group.classList.remove('error');
          const errorSpan = group.querySelector('.error-msg');
          if (errorSpan) errorSpan.textContent = '';
        }
      });
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      if (!nameVal) {
        nameInput.closest('.form-group').classList.add('error');
        if (nameError) nameError.textContent = 'Please provide your full name.';
        isValid = false;
      }

      if (!emailVal) {
        emailInput.closest('.form-group').classList.add('error');
        if (emailError) emailError.textContent = 'Please provide your email address.';
        isValid = false;
      } else if (!validateEmail(emailVal)) {
        emailInput.closest('.form-group').classList.add('error');
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!subjectVal) {
        subjectInput.closest('.form-group').classList.add('error');
        if (subjectError) subjectError.textContent = 'Please enter a subject.';
        isValid = false;
      }

      if (!messageVal) {
        messageInput.closest('.form-group').classList.add('error');
        if (messageError) messageError.textContent = 'Please write your message.';
        isValid = false;
      } else if (messageVal.length < 10) {
        messageInput.closest('.form-group').classList.add('error');
        if (messageError) messageError.textContent = 'Message should be at least 10 characters.';
        isValid = false;
      }

      if (!isValid) return;

      // Construct mailto URL to launch default mail client with prefilled details
      const recipient = 'khushijn06118@gmail.com';
      const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectVal}`);
      const bodyText = `Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`;
      const encodedBody = encodeURIComponent(bodyText);
      const mailtoUrl = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;

      showToast('<i class="fa-solid fa-paper-plane"></i> Launching your email client to send message...');

      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
      }, 700);
    });
  }
});
