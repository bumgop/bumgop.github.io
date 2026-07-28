const initTheme = () => {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
 
  toggle.addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
};
 

const initNav = () => {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
 
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('show'));
  }
 
  document.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => menu && menu.classList.remove('show'));
  });
};
 

const initScrollSpy = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
 
  const onScroll = () => {
    const scrollY = window.scrollY;
 
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${sectionId}"]`);
 
      if (!link) return;
 
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((l) => l.classList.remove('active-link'));
        link.classList.add('active-link');
      }
    });
  };
 
  window.addEventListener('scroll', onScroll);
  onScroll();
};
 

const initScrollReveal = () => {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
 
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
 
  items.forEach((el) => observer.observe(el));
};
 

const initProjectCarousels = () => {
  document.querySelectorAll('.project-card__media').forEach((media) => {
    const images = media.querySelectorAll('img');
    if (images.length < 2) return;
 
    let index = 0;
    let intervalId = null;
 
    const advance = () => {
      images[index].classList.remove('is-active');
      index = (index + 1) % images.length;
      images[index].classList.add('is-active');
    };
 
    const start = () => {
      if (intervalId) return;
      intervalId = setInterval(advance, 3000);
    };
 
    const stop = () => {
      clearInterval(intervalId);
      intervalId = null;
    };
 
    const card = media.closest('.project-card');
    card.addEventListener('mouseenter', stop);
    card.addEventListener('mouseleave', start);
 
    start();
  });
};

 

const initContactForm = () => {
  if (window.emailjs) {
    console.info("connected to emailjs");
    emailjs.init('jeu_jyxSwXLRfibfF');
  }
  else
  {
    console.warn("emailjs not loaded");
  }
 
  const contactForm = document.getElementById('contact__form');
  const submitButton = document.getElementById('contact__submit');
 
  const validateInput = (value, minLength = 1, maxLength = 1000) =>
    typeof value === 'string' && value.trim().length >= minLength && value.trim().length <= maxLength;
 
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 
  if (!submitButton) return;
 
  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
 
    const name = document.getElementById('contact__name').value.trim();
    const email = document.getElementById('contact__email').value.trim();
    const subject = document.getElementById('contact__subject').value.trim();
    const message = document.getElementById('contact__message').value.trim();
 
    if (!validateInput(name, 1, 100)) return showNotification('Please enter a valid name', 'error');
    if (!validateEmail(email)) return showNotification('Please enter a valid email address', 'error');
    if (!validateInput(subject, 1, 200)) return showNotification('Please enter a valid subject', 'error');
    if (!validateInput(message, 10, 5000)) return showNotification('Message must be between 10 and 5000 characters', 'error');
 
    const templateParams = { name, email, title: subject, message };
 
    try {
      await emailjs.send('service_o4o68ha', 'contact_form', templateParams);
      showNotification(`Thank you, ${name}! Your message has been sent.`, 'success');
      contactForm.reset();
    } catch (error) {
      showNotification('Failed to send message. Please try again.', 'error');
      console.error('Failed to send email:', error);
    }
  });
};
 
const showNotification = (message, type) => {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
};
 


const init = () => {
  
  console.log('Initializing theme...');
  initTheme();
  console.log('Initializing nav...');
  initNav();
  console.log('Initializing scroll spy...');
  initScrollSpy();
  console.log('Initializing scroll reveal...');
  initScrollReveal();
  console.log('Initializing project carousels...');
  initProjectCarousels();
  console.log('Initializing contact form...');
  initContactForm();
};
 
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
 

