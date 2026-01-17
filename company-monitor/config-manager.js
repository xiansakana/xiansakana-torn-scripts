/**
 * 配置管理器 - 每个用户独立配置
 * 
 * 新用户首次登录时配置为空，需要自己设置
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 默认配置（新用户的初始配置）
const DEFAULT_USER_CONFIG = {
    checkInterval: 60,
    email: {
        enabled: false,
        to: ''
    },
    filters: {
        minDifficulty: 'simple',
        minScope: 1
    },
    companies: [] // 用户自己的公司列表 [{ key: 'xxx', name: 'xxx' }]
};

class ConfigManager {
    constructor() {
        // 优先使用持久化存储卷，如果不存在则使用本地目录
        const dataDir = process.env.DATA_DIR || '/data';
        
        // 检查持久化存储卷是否存在
        if (fs.existsSync(dataDir)) {
            this.userConfigDir = path.join(dataDir, 'user-configs');
            console.log('✓ 使用持久化存储:', this.userConfigDir);
        } else {
            this.userConfigDir = path.join(__dirname, 'user-configs');
            console.log('ℹ️  使用本地存储:', this.userConfigDir);
        }
        
        // 确保用户配置目录存在
        if (!fs.existsSync(this.userConfigDir)) {
            fs.mkdirSync(this.userConfigDir, { recursive: true });
            console.log('✓ 创建用户配置目录');
        }
    }
    
    /**
     * 生成 API Key 的哈希值（用作文件名）
     */
    hashApiKey(apiKey) {
        return crypto.createHash('sha256').update(apiKey).digest('hex').substring(0, 16);
    }
    
    /**
     * 获取用户配置文件路径
     */
    getUserConfigPath(apiKey) {
        const hash = this.hashApiKey(apiKey);
        return path.join(this.userConfigDir, `config-${hash}.json`);
    }
    
    /**
     * 加载用户配置（如果不存在则返回默认配置）
     */
    loadUserConfig(apiKey) {
        const configPath = this.getUserConfigPath(apiKey);
        
        if (fs.existsSync(configPath)) {
            try {
                const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                console.log(`✓ 加载用户配置: ${this.hashApiKey(apiKey)}`);
                return userConfig;
            } catch (err) {
                console.error('加载用户配置失败:', err.message);
                return JSON.parse(JSON.stringify(DEFAULT_USER_CONFIG)); // 深拷贝
            }
        }
        
        // 新用户，返回默认配置
        console.log(`ℹ️  新用户: ${this.hashApiKey(apiKey)}`);
        return JSON.parse(JSON.stringify(DEFAULT_USER_CONFIG)); // 深拷贝
    }
    
    /**
     * 保存用户配置
     */
    saveUserConfig(apiKey, config) {
        const configPath = this.getUserConfigPath(apiKey);
        
        try {
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            console.log(`✓ 保存用户配置: ${this.hashApiKey(apiKey)}`);
            return true;
        } catch (err) {
            console.error('保存用户配置失败:', err.message);
            return false;
        }
    }
    
    /**
     * 获取用户配置（直接返回，不合并）
     */
    getUserConfig(apiKey) {
        return this.loadUserConfig(apiKey);
    }
    
    /**
     * 更新用户配置
     */
    updateUserConfig(apiKey, updates) {
        const currentConfig = this.loadUserConfig(apiKey);
        
        // 更新配置
        if (updates.checkInterval !== undefined) {
            currentConfig.checkInterval = updates.checkInterval;
        }
        
        if (updates.emailEnabled !== undefined || updates.emailTo !== undefined) {
            if (!currentConfig.email) currentConfig.email = {};
            if (updates.emailEnabled !== undefined) {
                currentConfig.email.enabled = updates.emailEnabled;
            }
            if (updates.emailTo !== undefined) {
                currentConfig.email.to = updates.emailTo;
            }
        }
        
        if (updates.minDifficulty !== undefined || updates.minScope !== undefined) {
            if (!currentConfig.filters) currentConfig.filters = {};
            if (updates.minDifficulty !== undefined) {
                currentConfig.filters.minDifficulty = updates.minDifficulty;
            }
            if (updates.minScope !== undefined) {
                currentConfig.filters.minScope = updates.minScope;
            }
        }
        
        // 更新用户的公司列表
        if (updates.companies !== undefined) {
            currentConfig.companies = updates.companies;
        }
        
        return this.saveUserConfig(apiKey, currentConfig);
    }
    
    /**
     * 检查用户是否已有配置
     */
    hasUserConfig(apiKey) {
        const configPath = this.getUserConfigPath(apiKey);
        return fs.existsSync(configPath);
    }
    
    /**
     * 删除用户配置
     */
    deleteUserConfig(apiKey) {
        const configPath = this.getUserConfigPath(apiKey);
        
        if (fs.existsSync(configPath)) {
            try {
                fs.unlinkSync(configPath);
                console.log(`✓ 删除用户配置: ${this.hashApiKey(apiKey)}`);
                return true;
            } catch (err) {
                console.error('删除用户配置失败:', err.message);
                return false;
            }
        }
        
        return false;
    }
    
    /**
     * 获取所有用户配置列表
     */
    listUserConfigs() {
        try {
            const files = fs.readdirSync(this.userConfigDir);
            return files.filter(f => f.startsWith('config-') && f.endsWith('.json'));
        } catch (err) {
            return [];
        }
    }
}

module.exports = ConfigManager;
