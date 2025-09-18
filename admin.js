// 后台管理系统 JavaScript

// 简单的登录验证（实际项目中应该使用更安全的方式）
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '123456'
};

// 当前配置数据
let currentConfig = {
    logo: null,
    screenshots: [],
    appstore: null,
    background: null,
    mainTitle: '一骑当千，纵横沙场',
    subTitle: '上百武将齐聚，无双连击爽快割草！\n在掌中重温三国乱世的热血与谋略。'
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
    // 拖拽上传功能
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', handleDragOver);
        area.addEventListener('dragleave', handleDragLeave);
        area.addEventListener('drop', handleDrop);
    });
}

// 登录功能
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('loginMessage');
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('adminPage').classList.remove('hidden');
        showMessage('登录成功！', 'success');
    } else {
        messageEl.textContent = '用户名或密码错误！';
        messageEl.classList.remove('hidden', 'status-success');
        messageEl.classList.add('status-error');
    }
}

// 处理Logo上传
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        processImageFile(file, 'logo');
    }
}

// 处理游戏截图上传
function handleScreenshotsUpload(event) {
    const files = Array.from(event.target.files);
    files.forEach((file, index) => {
        processImageFile(file, 'screenshots', index);
    });
}

// 处理App Store按钮上传
function handleAppStoreUpload(event) {
    const file = event.target.files[0];
    if (file) {
        processImageFile(file, 'appstore');
    }
}

// 处理背景图片上传
function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (file) {
        processImageFile(file, 'background');
    }
}

// 处理图片文件
function processImageFile(file, type, index = 0) {
    if (!file.type.startsWith('image/')) {
        showMessage('请选择图片文件！', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = {
            name: file.name,
            size: formatFileSize(file.size),
            data: e.target.result,
            file: file
        };
        
        if (type === 'screenshots') {
            if (!currentConfig.screenshots) currentConfig.screenshots = [];
            currentConfig.screenshots[index] = imageData;
        } else {
            currentConfig[type] = imageData;
        }
        
        updatePreview(type, index);
        showMessage(`${type} 上传成功！`, 'success');
    };
    reader.readAsDataURL(file);
}

// 更新预览
function updatePreview(type, index = 0) {
    const previewContainer = document.getElementById(type + 'Preview');
    if (!previewContainer) return;
    
    if (type === 'screenshots') {
        updateScreenshotsPreview();
    } else {
        updateSinglePreview(previewContainer, currentConfig[type], type);
    }
}

// 更新单个预览
function updateSinglePreview(container, imageData, type) {
    if (!imageData) {
        container.innerHTML = '<div class="preview-item"><div class="preview-image" style="background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #6c757d;">暂无图片</div></div>';
        return;
    }
    
    container.innerHTML = `
        <div class="preview-item">
            <img src="${imageData.data}" alt="${type}" class="preview-image">
            <div class="preview-name">${imageData.name}</div>
            <div class="preview-size">${imageData.size}</div>
            <button class="btn btn-danger" onclick="removeImage('${type}')" style="margin-top: 10px; padding: 5px 10px; font-size: 12px;">删除</button>
        </div>
    `;
}

// 更新截图预览
function updateScreenshotsPreview() {
    const container = document.getElementById('screenshotsPreview');
    if (!currentConfig.screenshots || currentConfig.screenshots.length === 0) {
        container.innerHTML = '<div class="preview-item"><div class="preview-image" style="background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #6c757d;">暂无截图</div></div>';
        return;
    }
    
    container.innerHTML = currentConfig.screenshots.map((imageData, index) => `
        <div class="preview-item">
            <img src="${imageData.data}" alt="截图${index + 1}" class="preview-image">
            <div class="preview-name">${imageData.name}</div>
            <div class="preview-size">${imageData.size}</div>
            <button class="btn btn-danger" onclick="removeScreenshot(${index})" style="margin-top: 10px; padding: 5px 10px; font-size: 12px;">删除</button>
        </div>
    `).join('');
}

// 删除图片
function removeImage(type) {
    currentConfig[type] = null;
    updatePreview(type);
    showMessage(`${type} 已删除`, 'success');
}

// 删除截图
function removeScreenshot(index) {
    currentConfig.screenshots.splice(index, 1);
    updateScreenshotsPreview();
    showMessage('截图已删除', 'success');
}

// 拖拽处理
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    const uploadArea = e.currentTarget;
    
    // 根据上传区域确定类型
    let type = 'logo';
    if (uploadArea.closest('.section').querySelector('.section-title').textContent.includes('游戏截图')) {
        type = 'screenshots';
    } else if (uploadArea.closest('.section').querySelector('.section-title').textContent.includes('App Store')) {
        type = 'appstore';
    } else if (uploadArea.closest('.section').querySelector('.section-title').textContent.includes('背景图片')) {
        type = 'background';
    }
    
    files.forEach((file, index) => {
        processImageFile(file, type, index);
    });
}

// 保存所有更改
function saveAllChanges() {
    // 更新文字内容
    currentConfig.mainTitle = document.getElementById('mainTitle').value;
    currentConfig.subTitle = document.getElementById('subTitle').value;
    
    // 保存到本地存储
    localStorage.setItem('sgjws_config', JSON.stringify(currentConfig));
    
    // 更新主网站
    updateMainWebsite();
    
    showMessage('所有更改已保存！', 'success');
}

// 更新主网站
function updateMainWebsite() {
    console.log('正在更新主网站...', currentConfig);
    
    // 直接更新HTML文件中的图片引用
    updateHTMLImages();
    
    // 更新CSS文件中的背景图片
    updateCSSBackground();
    
    // 更新文字内容
    updateTextContent();
    
    showMessage('主网站已更新！请刷新主页面查看效果。', 'success');
}

// 更新HTML中的图片
function updateHTMLImages() {
    // 这里我们通过修改DOM来更新图片
    // 实际项目中，这里会直接修改HTML文件
    
    // 更新Logo
    if (currentConfig.logo) {
        const logoImages = document.querySelectorAll('img[src*="logo"]');
        logoImages.forEach(img => {
            img.src = currentConfig.logo.data;
        });
    }
    
    // 更新游戏截图
    if (currentConfig.screenshots && currentConfig.screenshots.length > 0) {
        const screenshotImages = document.querySelectorAll('img[src*="shot"]');
        screenshotImages.forEach((img, index) => {
            if (currentConfig.screenshots[index]) {
                img.src = currentConfig.screenshots[index].data;
            }
        });
    }
    
    // 更新App Store按钮
    if (currentConfig.appstore) {
        const appstoreImages = document.querySelectorAll('img[src*="appstore"]');
        appstoreImages.forEach(img => {
            img.src = currentConfig.appstore.data;
        });
    }
}

// 更新CSS背景图片
function updateCSSBackground() {
    if (currentConfig.background) {
        // 更新CSS中的背景图片
        const style = document.createElement('style');
        style.textContent = `
            .hero-bg { 
                background: url('${currentConfig.background.data}') center/cover no-repeat !important; 
            }
        `;
        document.head.appendChild(style);
    }
}

// 更新文字内容
function updateTextContent() {
    // 更新主标题
    const mainTitle = document.querySelector('.hero-title');
    if (mainTitle && currentConfig.mainTitle) {
        mainTitle.textContent = currentConfig.mainTitle;
    }
    
    // 更新副标题
    const subTitle = document.querySelector('.hero-sub');
    if (subTitle && currentConfig.subTitle) {
        subTitle.innerHTML = currentConfig.subTitle.replace(/\n/g, '<br>');
    }
}

// 预览网站
function previewWebsite() {
    // 在新窗口中打开主网站
    window.open('index.html', '_blank');
}

// 直接更新官网文件
function updateWebsiteFiles() {
    // 检查是否有任何配置
    const hasAnyConfig = currentConfig.logo || 
                        (currentConfig.screenshots && currentConfig.screenshots.length > 0) || 
                        currentConfig.appstore || 
                        currentConfig.background ||
                        currentConfig.mainTitle !== '一骑当千，纵横沙场' ||
                        currentConfig.subTitle !== '上百武将齐聚，无双连击爽快割草！\n在掌中重温三国乱世的热血与谋略。';
    
    if (!hasAnyConfig) {
        showMessage('请先上传一些图片或修改文字内容再进行更新！', 'error');
        return;
    }
    
    try {
        // 创建更新后的HTML内容
        let updatedHTML = generateUpdatedHTML();
        
        // 创建更新后的CSS内容
        let updatedCSS = generateUpdatedCSS();
        
        // 下载更新后的文件
        downloadFile('index_updated.html', updatedHTML, 'text/html');
        downloadFile('styles_updated.css', updatedCSS, 'text/css');
        
        showMessage('已生成更新后的文件！请下载并替换原文件。', 'success');
        
        // 同时更新当前页面的显示
        updateCurrentPageDisplay();
        
    } catch (error) {
        console.error('生成文件时出错:', error);
        showMessage('生成文件时出错，请重试！', 'error');
    }
}

// 生成更新后的HTML
function generateUpdatedHTML() {
    // 读取原始HTML文件内容
    const originalHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>三国将无双 - 官方网站（iOS）</title>
    <meta name="description" content="《三国将无双》iOS 官方网站，了解游戏特色、欣赏截图与宣传视频，立即下载体验无双割草快感。">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="assets/logo.png" type="image/png">
</head>
<body>
    <header class="site-header">
        <div class="container header-inner">
            <a class="brand" href="#home" aria-label="三国将无双官网">
                <img src="assets/logo.png" alt="三国将无双 Logo" class="brand-logo">
                <span class="brand-name">三国将无双</span>
            </a>
            <nav class="nav" aria-label="主导航">
                <button class="nav-toggle" aria-expanded="false" aria-controls="nav-menu">菜单</button>
                <ul id="nav-menu" class="nav-menu">
                    <li><a href="#features">特色玩法</a></li>
                    <li><a href="#gallery">游戏截图</a></li>
                    <li><a href="#video">宣传视频</a></li>
                    <li><a href="#download" class="btn btn-primary">立即下载</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main id="home" class="main">
        <section class="hero">
            <div class="container hero-inner">
                <h1 class="hero-title">${currentConfig.mainTitle || '一骑当千，纵横沙场'}</h1>
                <p class="hero-sub">${(currentConfig.subTitle || '上百武将齐聚，无双连击爽快割草！在掌中重温三国乱世的热血与谋略。').replace(/\n/g, '<br>')}</p>
                <div class="cta-group">
                    <a href="#download" class="btn btn-primary">App Store 立即下载</a>
                    <button class="btn btn-ghost" data-open-video>观看宣传片</button>
                </div>
            </div>
            <div class="hero-bg" aria-hidden="true"></div>
        </section>

        <section id="features" class="section features">
            <div class="container">
                <h2 class="section-title">特色玩法</h2>
                <ul class="feature-grid">
                    <li>
                        <h3>无双连招</h3>
                        <p>指尖释放华丽技能，打出爽快连击，轻松清屏。</p>
                    </li>
                    <li>
                        <h3>名将收集</h3>
                        <p>赵云、关羽、诸葛亮等名将悉数登场，缘分合击。</p>
                    </li>
                    <li>
                        <h3>智取天下</h3>
                        <p>排兵布阵、兵种克制，谋略与操作并重。</p>
                    </li>
                    <li>
                        <h3>热血战场</h3>
                        <p>千人同屏，恢弘战场重现三国名场面。</p>
                    </li>
                </ul>
            </div>
        </section>

        <section id="gallery" class="section gallery">
            <div class="container">
                <h2 class="section-title">游戏截图</h2>
                <div class="gallery-grid">
                    <figure class="shot">
                        <img src="assets/shot1.png" alt="战斗画面截图">
                        <figcaption>爽快连击</figcaption>
                    </figure>
                    <figure class="shot">
                        <img src="assets/shot2.png" alt="武将界面截图">
                        <figcaption>名将集结</figcaption>
                    </figure>
                    <figure class="shot">
                        <img src="assets/shot3.png" alt="阵容布置截图">
                        <figcaption>策略布阵</figcaption>
                    </figure>
                    <figure class="shot">
                        <img src="assets/shot4.png" alt="世界地图截图">
                        <figcaption>攻城略地</figcaption>
                    </figure>
                </div>
            </div>
        </section>

        <section id="video" class="section video">
            <div class="container">
                <h2 class="section-title">宣传视频</h2>
                <div class="video-frame">
                    <button class="play-btn" data-open-video aria-label="播放视频">▶</button>
                </div>
            </div>
        </section>

        <section id="download" class="section download">
            <div class="container download-inner">
                <div class="download-text">
                    <h2 class="section-title">立即在 iOS 畅玩</h2>
                    <p>支持 iPhone 与 iPad，适配 60/120Hz 高帧率。</p>
                </div>
                <div class="store-badges">
                    <a class="store-badge" href="#" aria-label="在 App Store 下载">
                        <img src="assets/appstore.png" alt="Download on the App Store">
                    </a>
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <small>© 2025 三国将无双. 保留所有权利。</small>
            <ul class="footer-links">
                <li><a href="#">用户协议</a></li>
                <li><a href="#">隐私政策</a></li>
                <li><a href="#">联系我们</a></li>
            </ul>
        </div>
    </footer>

    <div class="modal" id="video-modal" aria-hidden="true" aria-label="宣传视频弹窗">
        <div class="modal-backdrop" data-close-modal></div>
        <div class="modal-dialog" role="dialog" aria-modal="true">
            <button class="modal-close" data-close-modal aria-label="关闭">✕</button>
            <div class="modal-body">
                <div class="responsive-iframe">
                    <iframe id="promo-video"
                            title="三国将无双 宣传片"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen></iframe>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
    
</body>
</html>`;
    
    return originalHTML;
}

// 生成更新后的CSS
function generateUpdatedCSS() {
    // 读取原始CSS文件内容
    const originalCSS = `/* 基础样式与暗色模式 */
:root {
  --bg: #0b0d12;
  --card: #121623;
  --text: #e7ebff;
  --muted: #a9b1c7;
  --primary: #6aa2ff;
  --primary-strong: #3d7dff;
  --accent: #ffd36a;
  --border: #1e2435;
  --shadow: 0 10px 30px rgba(0,0,0,.35);
}

* { box-sizing: border-box; }
html, body { height: 100%; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: 'Noto Sans SC', system-ui, -apple-system, Segoe UI, Roboto, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  background: radial-gradient(1200px 600px at 70% -10%, rgba(61,125,255,.25), transparent 60%),
              radial-gradient(900px 500px at 20% -5%, rgba(255,211,106,.15), transparent 60%),
              var(--bg);
  color: var(--text);
  line-height: 1.6;
}

.container {
  width: min(1120px, 92%);
  margin: 0 auto;
}

/* Header */
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: saturate(1.2) blur(8px);
  background: rgba(11,13,18,.6);
  border-bottom: 1px solid var(--border);
}
.header-inner { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; }
.brand { display: inline-flex; align-items: center; gap: 10px; color: var(--text); text-decoration: none; }
.brand-logo { width: 36px; height: 36px; }
.brand-name { font-weight: 900; letter-spacing: .5px; }

.nav-toggle { display: none; }
.nav-menu { display: flex; gap: 18px; list-style: none; padding: 0; margin: 0; }
.nav-menu a { color: var(--text); text-decoration: none; opacity: .9; }
.nav-menu a:hover { color: var(--accent); }

/* Buttons */
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 18px; border-radius: 10px; border: 1px solid var(--border); background: #151a28; color: var(--text); text-decoration: none; transition: .2s ease; }
.btn:hover { transform: translateY(-1px); box-shadow: var(--shadow); }
.btn-primary { background: linear-gradient(135deg, var(--primary), var(--primary-strong)); border-color: transparent; color: white; }
.btn-ghost { background: transparent; }

/* Hero */
.hero { position: relative; padding: 88px 0 64px; overflow: hidden; }
.hero-inner { text-align: center; }
.hero-title { font-size: clamp(28px, 4.2vw, 56px); margin: 0 0 12px; letter-spacing: .5px; }
.hero-sub { color: var(--muted); margin: 0 auto 22px; max-width: 720px; }
.cta-group { display: inline-flex; flex-wrap: wrap; gap: 12px; }
.hero-bg { position: absolute; inset: 0; background: url('assets/hero-blur.png') center/cover no-repeat; opacity: .25; pointer-events: none; }

/* Sections */
.section { padding: 64px 0; }
.section-title { font-size: clamp(22px, 2.8vw, 34px); margin: 0 0 24px; }

/* Features */
.feature-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.feature-grid li { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 18px; box-shadow: var(--shadow); }
.feature-grid h3 { margin: 0 0 10px; }
.feature-grid p { margin: 0; color: var(--muted); }

/* Gallery */
.gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.shot { margin: 0; background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; text-align: center; box-shadow: var(--shadow); }
.shot img { width: 100%; height: 180px; object-fit: cover; background: #0f1320; }
.shot figcaption { padding: 10px 12px; color: var(--muted); }

/* Video */
.video .video-frame { position: relative; aspect-ratio: 16/9; border-radius: 16px; overflow: hidden; background: radial-gradient(circle at 50% 40%, rgba(106,162,255,.25), transparent 60%), #0f1320; border: 1px solid var(--border); box-shadow: var(--shadow); }
.play-btn { position: absolute; inset: 0; margin: auto; width: 76px; height: 76px; border-radius: 50%; border: none; background: linear-gradient(135deg, var(--accent), #ff8b6a); color: #111; font-size: 26px; cursor: pointer; box-shadow: var(--shadow); }

/* Download */
.download-inner { display: grid; grid-template-columns: 1.2fr .8fr; gap: 20px; align-items: center; }
.store-badges { display: flex; gap: 12px; }
.store-badge img { height: 56px; }

/* Footer */
.site-footer { border-top: 1px solid var(--border); background: #0b0f1a; }
.footer-inner { display: flex; justify-content: space-between; align-items: center; padding: 18px 0; color: var(--muted); }
.footer-links { display: flex; gap: 14px; list-style: none; padding: 0; margin: 0; }
.footer-links a { color: var(--muted); text-decoration: none; }
.footer-links a:hover { color: var(--accent); }

/* Modal */
.modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; }
.modal[aria-hidden="false"] { display: flex; }
.modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.6); }
.modal-dialog { position: relative; width: min(960px, 92%); background: #0d1220; border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow); }
.modal-close { position: absolute; top: 8px; right: 8px; background: transparent; color: var(--text); border: 1px solid var(--border); border-radius: 10px; padding: 6px 10px; cursor: pointer; }
.modal-body { padding: 18px; }
.responsive-iframe { position: relative; width: 100%; padding-bottom: 56.25%; }
.responsive-iframe iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; border-radius: 10px; }

/* 响应式 */
@media (max-width: 960px) {
  .feature-grid { grid-template-columns: repeat(2, 1fr); }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .download-inner { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .nav-toggle { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border); background: #141a28; color: var(--text); }
  .nav-menu { position: absolute; right: 4%; top: 58px; flex-direction: column; background: #0f1422; border: 1px solid var(--border); border-radius: 12px; padding: 10px; display: none; }
  .nav[aria-expanded="true"] .nav-menu, .nav-menu[data-open="true"] { display: flex; }
}`;
    
    return originalCSS;
}

// 下载文件
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 立即应用更改
function applyChangesNow() {
    // 更新文字内容
    currentConfig.mainTitle = document.getElementById('mainTitle').value;
    currentConfig.subTitle = document.getElementById('subTitle').value;
    
    // 保存到本地存储
    localStorage.setItem('sgjws_config', JSON.stringify(currentConfig));
    
    // 更新当前页面显示
    updateCurrentPageDisplay();
    
    showMessage('更改已立即应用！请查看主网站效果。', 'success');
}

// 更新当前页面显示
function updateCurrentPageDisplay() {
    // 更新背景图片
    if (currentConfig.background) {
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.background = `url('${currentConfig.background.data}') center/cover no-repeat`;
        }
    }
    
    // 更新主标题
    if (currentConfig.mainTitle) {
        const mainTitle = document.querySelector('.hero-title');
        if (mainTitle) {
            mainTitle.textContent = currentConfig.mainTitle;
        }
    }
    
    // 更新副标题
    if (currentConfig.subTitle) {
        const subTitle = document.querySelector('.hero-sub');
        if (subTitle) {
            subTitle.innerHTML = currentConfig.subTitle.replace(/\n/g, '<br>');
        }
    }
    
    // 更新Logo
    if (currentConfig.logo) {
        const logoImages = document.querySelectorAll('img[src*="logo"]');
        logoImages.forEach(img => {
            img.src = currentConfig.logo.data;
        });
    }
    
    // 更新游戏截图
    if (currentConfig.screenshots && currentConfig.screenshots.length > 0) {
        const screenshotImages = document.querySelectorAll('img[src*="shot"]');
        screenshotImages.forEach((img, index) => {
            if (currentConfig.screenshots[index]) {
                img.src = currentConfig.screenshots[index].data;
            }
        });
    }
    
    // 更新App Store按钮
    if (currentConfig.appstore) {
        const appstoreImages = document.querySelectorAll('img[src*="appstore"]');
        appstoreImages.forEach(img => {
            img.src = currentConfig.appstore.data;
        });
    }
}

// 恢复默认设置
function resetToDefault() {
    if (confirm('确定要恢复默认设置吗？这将清除所有自定义内容！')) {
        currentConfig = {
            logo: null,
            screenshots: [],
            appstore: null,
            background: null,
            mainTitle: '一骑当千，纵横沙场',
            subTitle: '上百武将齐聚，无双连击爽快割草！\n在掌中重温三国乱世的热血与谋略。'
        };
        
        // 清空预览
        document.getElementById('logoPreview').innerHTML = '';
        document.getElementById('screenshotsPreview').innerHTML = '';
        document.getElementById('appstorePreview').innerHTML = '';
        document.getElementById('backgroundPreview').innerHTML = '';
        
        // 重置表单
        document.getElementById('mainTitle').value = currentConfig.mainTitle;
        document.getElementById('subTitle').value = currentConfig.subTitle;
        
        // 清空文件输入
        document.querySelectorAll('.file-input').forEach(input => input.value = '');
        
        showMessage('已恢复默认设置', 'success');
    }
}

// 加载配置
function loadConfig() {
    const saved = localStorage.getItem('sgjws_config');
    if (saved) {
        currentConfig = JSON.parse(saved);
        
        // 更新表单
        document.getElementById('mainTitle').value = currentConfig.mainTitle;
        document.getElementById('subTitle').value = currentConfig.subTitle;
        
        // 更新预览
        updatePreview('logo');
        updateScreenshotsPreview();
        updatePreview('appstore');
        updatePreview('background');
    }
}

// 显示消息
function showMessage(message, type = 'success') {
    const messageEl = document.getElementById('statusMessage');
    messageEl.textContent = message;
    messageEl.classList.remove('hidden', 'status-success', 'status-error');
    messageEl.classList.add(type === 'success' ? 'status-success' : 'status-error');
    
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 3000);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
