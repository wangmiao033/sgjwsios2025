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

// 视频播放优化
(function () {
  const video = document.getElementById('main-video');
  if (!video) return;
  
  // 视频加载完成后自动显示控制条
  video.addEventListener('loadedmetadata', () => {
    video.controls = true;
  });
  
  // 视频播放时添加播放状态类
  video.addEventListener('play', () => {
    video.classList.add('playing');
  });
  
  // 视频暂停时移除播放状态类
  video.addEventListener('pause', () => {
    video.classList.remove('playing');
  });
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

// 截图切换功能
(function () {
  const thumbnails = document.querySelectorAll('.thumbnail');
  const heroImage = document.querySelector('.hero-image');
  const screenshotCaption = document.querySelector('.screenshot-caption');
  
  const screenshotData = {
    shot1: {
      src: 'assets/1(1).jpg',
      title: '七日登陆送好礼',
      description: '累计登陆七日领小乔，多重福利载誉而归'
    },
    shot2: {
      src: 'assets/2(1).jpg',
      title: '战斗画面',
      description: '指尖释放华丽技能，打出爽快连击，轻松清屏'
    },
    shot3: {
      src: 'assets/3(1).jpg',
      title: '武将界面',
      description: '赵云、关羽、诸葛亮等名将悉数登场，缘分合击'
    },
    shot4: {
      src: 'assets/4(1).jpg',
      title: '策略布阵',
      description: '排兵布阵、兵种克制，谋略与操作并重'
    },
    shot5: {
      src: 'assets/5(1).jpg',
      title: '攻城略地',
      description: '千人同屏，恢弘战场重现三国名场面'
    }
  };
  
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      const screenshotType = this.dataset.screenshot;
      const data = screenshotData[screenshotType];
      
      if (data) {
        // 更新主图
        heroImage.src = data.src;
        heroImage.alt = data.title;
        
        // 更新标题和描述
        screenshotCaption.querySelector('h3').textContent = data.title;
        screenshotCaption.querySelector('p').textContent = data.description;
        
        // 更新激活状态
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // 添加切换动画
        heroImage.style.opacity = '0';
        setTimeout(() => {
          heroImage.style.opacity = '1';
        }, 150);
      }
    });
  });
})();

// 人物卡片交互功能
(function () {
  const characterCards = document.querySelectorAll('.character-card');
  
  characterCards.forEach(card => {
    card.addEventListener('click', function() {
      // 添加点击动画
      this.style.transform = 'translateY(-8px) scale(1.02)';
      setTimeout(() => {
        this.style.transform = 'translateY(-8px) scale(1)';
      }, 150);
      
      // 可以在这里添加更多交互，比如显示详细信息
      console.log('点击了人物卡片:', this.dataset.character);
    });
    
    // 鼠标悬停效果
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
})();


