/* ── Vaultora Capital — main.js ── */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Menu ── */
  const menuBtn = document.getElementById('menuBtn');
  const menuPanel = document.getElementById('menuPanel');
  let backdrop;

  function closeMenu() {
    if (menuPanel) menuPanel.hidden = true;
    if (backdrop) { backdrop.remove(); backdrop = null; }
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn && menuPanel) {
    menuBtn.addEventListener('click', function () {
      const open = !menuPanel.hidden;
      if (open) { closeMenu(); return; }
      backdrop = document.createElement('div');
      backdrop.className = 'menu-backdrop';
      backdrop.addEventListener('click', closeMenu);
      document.body.appendChild(backdrop);
      menuPanel.hidden = false;
      menuBtn.setAttribute('aria-expanded', 'true');
    });
  }

  /* ── Scroll Reveal ── */
  function reveal() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', reveal);
  reveal();

  /* ── Back to Top ── */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 140);
    });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Count-up ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    let fired = false;
    function tryCount() {
      if (fired) return;
      const band = document.querySelector('.band');
      if (!band) return;
      if (band.getBoundingClientRect().top < window.innerHeight - 40) {
        fired = true;
        counters.forEach(function (el) {
          const target = parseInt(el.getAttribute('data-count'), 10);
          let cur = 0;
          const step = Math.max(1, Math.round(target / 60));
          const id = setInterval(function () {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(id); }
            el.textContent = cur.toLocaleString();
          }, 16);
        });
      }
    }
    window.addEventListener('scroll', tryCount);
    tryCount();
  }

  /* ── Chat widget ── */
  const avatar = document.getElementById('chatAvatar');
  const teaser = document.getElementById('chatTeaser');

  function buildChatModal() {
    let modal = document.getElementById('chatModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'chatModal';
      modal.className = 'chat-modal';
      modal.innerHTML = `
        <div class="chat-backdrop" data-close></div>
        <div class="chat-card">
          <button class="chat-close" data-close aria-label="Close">✕</button>
          <h3>Let's Talk</h3>
          <p>Our advisors respond within 24 hrs.</p>
          <form action="https://formspree.io/f/xpwboyrv" method="POST">
            <input type="hidden" name="_source" value="chat-widget">
            <input name="name" placeholder="Your full name" required>
            <input name="contact" placeholder="Email or WhatsApp" required>
            <textarea name="msg" placeholder="How can we help?" rows="3" required></textarea>
            <button class="btn emerald" type="submit">Send Message</button>
          </form>
          <small>🔒 Your information is kept private.</small>
        </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-close')) modal.classList.remove('open');
      });
    }
    return modal;
  }

  if (avatar) {
    avatar.addEventListener('click', function () { buildChatModal().classList.add('open'); });
    if (teaser) {
      setTimeout(function () {
        teaser.style.opacity = '1';
        setTimeout(function () { teaser.style.opacity = '0'; }, 4000);
      }, 2000);
    }
  }

  /* ── Formspree async handler ── */
  document.querySelectorAll('form[action*="formspree.io"]').forEach(function (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });
        if (res.ok) {
          form.reset();
          toast('Message sent. We\'ll be in touch shortly.', false);
        } else {
          toast('Could not send. Please try again.', true);
        }
      } catch {
        toast('Network error. Please try again.', true);
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = orig; }
      }
    });
  });

  function toast(msg, isErr) {
    const t = document.createElement('div');
    t.className = 'fs-toast' + (isErr ? ' error' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('visible'); });
    setTimeout(function () {
      t.classList.remove('visible');
      setTimeout(function () { t.remove(); }, 300);
    }, 3500);
  }

  /* ── Year ── */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

});
