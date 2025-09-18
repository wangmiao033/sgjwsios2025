// 后台管理系统 JavaScript

// 简单的登录验证（实际项目中应该使用更安全的方式）
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'sgjws2025'
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
    // 这里可以添加AJAX请求来更新服务器上的文件
    // 或者直接更新本地文件
    
    // 模拟更新过程
    console.log('正在更新主网站...', currentConfig);
    
    // 实际项目中，这里应该发送数据到服务器
    // fetch('/api/update-website', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(currentConfig)
    // });
}

// 预览网站
function previewWebsite() {
    // 在新窗口中打开主网站
    window.open('index.html', '_blank');
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
