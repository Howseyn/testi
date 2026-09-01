/**
 * رفتارهای تعاملی و جاوااسکریپت عمومی
 * Main Vanilla JavaScript Module
 */

// Toast notification helper
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '🔔';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3500);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  if (navLinks) {
    navLinks.classList.toggle('open');
  }
}

// Quick View Modal
function openQuickView(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickview-modal');
  const body = document.getElementById('quickview-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="quickview-grid">
      <div>
        <img src="${product.image}" alt="${product.title}" class="quickview-img" />
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <span class="glass-badge ${product.badgeType || 'primary'}">${product.categoryName}</span>
        <h3 style="font-size: 1.25rem;">${product.title}</h3>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.7;">${product.description}</p>
        
        <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-sm); margin: 6px 0;">
          <h5 style="font-size: 0.88rem; margin-bottom: 8px; color: var(--primary-light);">ویژگی‌های برتر:</h5>
          <ul style="list-style: disc inside; font-size: 0.85rem; color: var(--text-muted); line-height: 1.8;">
            ${product.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <div style="display: flex; align-items: baseline; gap: 12px; margin-top: auto; padding-top: 10px;">
          <div style="font-size: 1.4rem; font-weight: 800; color: #34d399;">
            ${formatPrice(product.price)} <span class="product-currency">تومان</span>
          </div>
          ${product.oldPrice ? `<span class="product-old-price">${formatPrice(product.oldPrice)} تومان</span>` : ''}
        </div>

        <div style="display: flex; gap: 10px; margin-top: 14px;">
          <button class="btn btn-primary" style="flex: 1;" onclick="addToCart('${product.id}', 1); closeQuickView();">
            افزودن به سبد خرید
          </button>
          <button class="btn btn-telegram" onclick="orderSingleProductTelegram('${product.id}'); closeQuickView();">
            سفارش تلگرام
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  const modal = document.getElementById('quickview-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// FAQ Accordion
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // close others
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// Special Offer Countdown Timer
function initCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  if (!daysEl) return;

  // Set target date 3 days from now
  let targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = toPersianDigits(d);
    hoursEl.textContent = toPersianDigits(h);
    minutesEl.textContent = toPersianDigits(m);
    secondsEl.textContent = toPersianDigits(s);
  }

  update();
  setInterval(update, 1000);
}

// Contact Form Submission Handler
function handleContactForm(e) {
  if (e) e.preventDefault();

  const name = document.getElementById('contact-name')?.value.trim();
  const phone = document.getElementById('contact-phone')?.value.trim();
  const subject = document.getElementById('contact-subject')?.value.trim();
  const message = document.getElementById('contact-message')?.value.trim();

  if (!name || !phone || !message) {
    showToast('لطفاً تمامی فیلدهای الزامی را تکمیل کنید.', 'error');
    return;
  }

  showToast('پیام شما با موفقیت ثبت شد! در اسرع وقت پاسخ داده خواهد شد.', 'success');
  
  // Clear form
  const form = document.getElementById('contact-form');
  if (form) form.reset();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initCountdown();

  // Close modals on overlay click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (e.target.classList.contains('cart-drawer-overlay')) {
      e.target.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active, .cart-drawer-overlay.active').forEach(el => {
        el.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });
});
