/* Wemmypro World — main.js */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    // Close on link click
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Header scroll shadow
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Background slideshows (home hero + about page)
  function startSlideshow(selector, intervalMs) {
    const slides = document.querySelectorAll(selector);
    if (slides.length < 2) return;
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, intervalMs);
  }
  startSlideshow('.hero-slide', 5000);
  startSlideshow('.page-slide', 4500);

  // Active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Portfolio filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        items.forEach(item => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Booking: show wedding packages when service = Wedding
  const serviceSelect = document.getElementById('service');
  const packagesSection = document.getElementById('wedding-packages');
  const packageInput = document.getElementById('package');
  const packageCards = document.querySelectorAll('.package-card');

  if (serviceSelect && packagesSection) {
    const togglePackages = () => {
      if (serviceSelect.value === 'Wedding') {
        packagesSection.classList.remove('hidden');
      } else {
        packagesSection.classList.add('hidden');
        if (packageInput) packageInput.value = '';
        packageCards.forEach(c => c.classList.remove('selected'));
      }
    };
    serviceSelect.addEventListener('change', togglePackages);
    togglePackages();
  }

  // Package card selection
  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      packageCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      if (packageInput) packageInput.value = card.dataset.package;
    });
  });

  // Web3Forms handling (Book, Contact, Academy)
  const forms = document.querySelectorAll('form[data-web3forms]');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const endpoint = form.dataset.web3forms || 'https://api.web3forms.com/submit';
      const accessKey = form.querySelector('input[name="access_key"]');
      if (!accessKey || !accessKey.value) {
        alert('Form is not configured. Please contact us on WhatsApp.');
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      const originalText = btn ? btn.textContent : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success !== false) {
          form.reset();
          if (typeof packageCards !== 'undefined' && packageCards) {
            packageCards.forEach(c => c.classList.remove('selected'));
          }
          if (typeof packagesSection !== 'undefined' && packagesSection) {
            packagesSection.classList.add('hidden');
          }
          const success = form.parentElement.querySelector('.form-success');
          if (success) {
            form.classList.add('hidden');
            success.classList.add('show');
          } else {
            alert('Thank you! Your message has been sent.');
          }
        } else {
          alert((data && data.message) || 'Something went wrong. Please try again or contact us on WhatsApp.');
        }
      } catch (err) {
        alert('Network error. Please try again or message us on WhatsApp.');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      }
    });
  });
});
