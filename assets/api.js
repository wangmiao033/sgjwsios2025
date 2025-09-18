// 简单的后端API模拟（实际项目中应该使用Node.js、PHP等后端技术）

// 模拟API端点
const API_ENDPOINTS = {
    UPDATE_WEBSITE: '/api/update-website',
    UPLOAD_IMAGE: '/api/upload-image',
    GET_CONFIG: '/api/get-config'
};

// 模拟配置存储
let websiteConfig = {
    logo: null,
    screenshots: [],
    appstore: null,
    background: null,
    mainTitle: '一骑当千，纵横沙场',
    subTitle: '上百武将齐聚，无双连击爽快割草！\n在掌中重温三国乱世的热血与谋略。'
};

// 模拟文件存储
const fileStorage = new Map();

// 处理API请求
function handleAPIRequest(url, method, data) {
    switch (url) {
        case API_ENDPOINTS.UPDATE_WEBSITE:
            return updateWebsite(data);
        case API_ENDPOINTS.UPLOAD_IMAGE:
            return uploadImage(data);
        case API_ENDPOINTS.GET_CONFIG:
            return getConfig();
        default:
            return { success: false, message: 'API端点不存在' };
    }
}

// 更新网站配置
function updateWebsite(configData) {
    try {
        // 验证数据
        if (!configData) {
            return { success: false, message: '配置数据不能为空' };
        }
        
        // 更新配置
        websiteConfig = { ...websiteConfig, ...configData };
        
        // 模拟更新HTML文件
        updateHTMLFiles(configData);
        
        return { 
            success: true, 
            message: '网站配置更新成功',
            config: websiteConfig
        };
    } catch (error) {
        return { 
            success: false, 
            message: '更新失败: ' + error.message 
        };
    }
}

// 上传图片
function uploadImage(imageData) {
    try {
        const { type, file, index } = imageData;
        const fileId = generateFileId(type, index);
        
        // 存储文件
        fileStorage.set(fileId, {
            type,
            data: file,
            timestamp: Date.now()
        });
        
        return {
            success: true,
            message: '图片上传成功',
            fileId,
            url: `/uploads/${fileId}`
        };
    } catch (error) {
        return {
            success: false,
            message: '上传失败: ' + error.message
        };
    }
}

// 获取配置
function getConfig() {
    return {
        success: true,
        config: websiteConfig
    };
}

// 更新HTML文件
function updateHTMLFiles(config) {
    // 这里应该实际更新HTML和CSS文件
    // 由于是前端模拟，我们只记录日志
    console.log('更新HTML文件:', config);
    
    // 实际项目中，这里会：
    // 1. 更新index.html中的图片路径
    // 2. 更新styles.css中的背景图片
    // 3. 更新文字内容
    // 4. 保存文件到服务器
}

// 生成文件ID
function generateFileId(type, index) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${type}_${index || 0}_${timestamp}_${random}`;
}

// 导出API函数（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleAPIRequest,
        updateWebsite,
        uploadImage,
        getConfig
    };
}
