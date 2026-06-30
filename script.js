// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── COUNTERS ──
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      if (counter.dataset.animated) return;
      counter.dataset.animated = true;
      const target = +counter.dataset.count;
      let value = 0;
      const step = Math.ceil(target / 60);
      const tick = () => {
        value = Math.min(value + step, target);
        counter.innerText = value;
        if (value < target) setTimeout(tick, 20);
      };
      tick();
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.num').forEach(el => counterObserver.observe(el));

// ── HEADER SCROLL ──
const header = document.getElementById('header');
const floatCall = document.getElementById('floatCall');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 30);
  floatCall.classList.toggle('visible', y > 300);
  backToTop.classList.toggle('visible', y > 400);
  updateActiveNav();
});

// ── ACTIVE NAV LINKS ──
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

// ── BURGER MENU ──
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-link, .mob-phone').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── FAQ ──
function toggleFAQ(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.answer');
  const isOpen = btn.classList.contains('open');

  // close all
  document.querySelectorAll('.faq-btn.open').forEach(b => {
    b.classList.remove('open');
    b.closest('.faq-item').querySelector('.answer').style.display = 'none';
  });

  if (!isOpen) {
    btn.classList.add('open');
    answer.style.display = 'block';
  }
}

// ── REVIEWS ──
let reviewIndex = 0;
const cards = document.querySelectorAll('.review-card');
const dots = document.querySelectorAll('.dot');

function goToReview(idx) {
  cards[reviewIndex].classList.remove('active');
  dots[reviewIndex].classList.remove('active');
  reviewIndex = (idx + cards.length) % cards.length;
  cards[reviewIndex].classList.add('active');
  dots[reviewIndex].classList.add('active');
}

function nextReview() { goToReview(reviewIndex + 1); }
function prevReview() { goToReview(reviewIndex - 1); }

// Auto-rotate reviews
setInterval(nextReview, 5000);

// ── FORM VALIDATION & SUBMISSION ──
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

function validatePhone(value) {
  return /^[\+\d\s\-\(\)]{7,}$/.test(value.trim());
}

function showFieldError(input, message) {
  input.classList.add('invalid');
  const err = input.closest('.form-group')?.querySelector('.field-error');
  if (err) err.textContent = message;
}

function clearFieldError(input) {
  input.classList.remove('invalid');
  const err = input.closest('.form-group')?.querySelector('.field-error');
  if (err) err.textContent = '';
}

// Live validation
contactForm.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => clearFieldError(field));
});

contactForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const nameInput = contactForm.querySelector('[name="name"]');
  const phoneInput = contactForm.querySelector('[name="phone"]');
  let valid = true;

  if (!nameInput.value.trim()) {
    showFieldError(nameInput, 'Введите имя');
    valid = false;
  }
  if (!phoneInput.value.trim()) {
    showFieldError(phoneInput, 'Введите телефон');
    valid = false;
  } else if (!validatePhone(phoneInput.value)) {
    showFieldError(phoneInput, 'Введите корректный номер телефона');
    valid = false;
  }
  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправляем...';
  formStatus.className = 'form-status';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      formStatus.className = 'form-status success';
      formStatus.textContent = '✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.';
      contactForm.reset();
    } else {
      throw new Error();
    }
  } catch {
    formStatus.className = 'form-status error';
    formStatus.textContent = '❌ Не удалось отправить. Позвоните нам: +7 985 854-37-24';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить заявку';
  }
});
