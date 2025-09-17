// 导航开合
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !nav || !menu) return;
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.dataset.open = String(!expanded);
    nav.setAttribute('aria-expanded', String(!expanded));
  });
})();

// 视频弹窗控制
(function () {
  const openers = document.querySelectorAll('[data-open-video]');
  const modal = document.getElementById('video-modal');
  const closeEls = document.querySelectorAll('[data-close-modal]');
  const iframe = document.getElementById('promo-video');
  if (!modal || !iframe) return;
  const open = () => {
    modal.setAttribute('aria-hidden', 'false');
    // 自动播放（YouTube 需加上 autoplay=1）
    const url = new URL(iframe.src);
    url.searchParams.set('autoplay', '1');
    iframe.src = url.toString();
  };
  const close = () => {
    modal.setAttribute('aria-hidden', 'true');
    const url = new URL(iframe.src);
    url.searchParams.delete('autoplay');
    iframe.src = url.toString();
  };
  openers.forEach((btn) => btn.addEventListener('click', open));
  closeEls.forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// 简单进入视口动画
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.section, .shot, .feature-grid li').forEach((el) => {
    el.style.transform = 'translateY(10px)';
    el.style.opacity = '0';
    el.style.transition = 'transform .6s ease, opacity .6s ease';
    observer.observe(el);
  });
  const style = document.createElement('style');
  style.textContent = '.reveal{transform:none!important;opacity:1!important}';
  document.head.appendChild(style);
})();


