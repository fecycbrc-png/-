// 应用事件管理器
const EventManager = {
    events: {},
    
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
};

// 主应用模块
const App = {
    config: {
        apps: [
            { 
                id: 'settings', 
                name: '设置', 
                icon: 'fas fa-cog',
                color: '#4a6cf7',
                order: 1
            },
            { 
                id: 'worldbook', 
                name: '世界书', 
                icon: 'fas fa-book-open',
                color: '#ff6b6b',
                order: 2
            },
            { 
                id: 'chat', 
                name: '聊天', 
                icon: 'fas fa-comments',
                color: '#5cd85a',
                order: 3
            },
            { 
                id: 'couples-space', 
                name: '情侣空间', 
                icon: 'fas fa-heart',
                color: '#ff6b6b',
                order: 4
            },
            { 
                id: 'moments', 
                name: '朋友圈', 
                icon: 'fas fa-camera',
                color: '#4a6cf7',
                order: 5
            },
            { 
                id: 'profile', 
                name: '我', 
                icon: 'fas fa-user',
                color: '#ffa500',
                order: 6
            },
            { 
                id: 'wallet', 
                name: '钱包', 
                icon: 'fas fa-wallet',
                color: '#5cd85a',
                order: 7
            },
            { 
                id: 'themes', 
                name: '主题美化', 
                icon: 'fas fa-palette',
                color: '#8a63ff',
                order: 8
            }
        ],
        widgetVisible: true
    },
    
    state: {
        currentPage: 'home',
        homeIndicator: null
    },
    
    init() {
        console.log('小手机应用初始化...');
        
        this.initModules();
        this.createAppIcons();
        this.createAppPages();
        this.setupEventListeners();
        this.startClock();
        this.loadSavedData();
        
        console.log('应用初始化完成');
        
        // 触发初始化完成事件
        EventManager.emit('app:initialized');
    },
    
    initModules() {
        // 初始化顺序很重要
        if (typeof Utils !== 'undefined') {
            console.log('✓ 工具模块已加载');
        }
        
        if (typeof WorldBook !== 'undefined') {
            WorldBook.init();
            console.log('✓ 世界书模块已初始化');
        }
        
        if (typeof Chat !== 'undefined') {
            Chat.init();
            console.log('✓ 聊天模块已初始化');
        }
        
        if (typeof Moments !== 'undefined') {
            Moments.init();
            console.log('✓ 朋友圈模块已初始化');
        }
        
        if (typeof Profile !== 'undefined') {
            Profile.init();
            console.log('✓ 个人资料模块已初始化');
        }
        
        if (typeof CouplesSpace !== 'undefined') {
            CouplesSpace.init();
            console.log('✓ 情侣空间模块已初始化');
        }
        
        if (typeof Themes !== 'undefined') {
            Themes.init();
            console.log('✓ 主题美化模块已初始化');
        }
        
        if (typeof Settings !== 'undefined') {
            Settings.init();
            console.log('✓ 设置模块已初始化');
        }
    },
    
    createAppIcons() {
        const appGrid = document.getElementById('app-grid');
        if (!appGrid) {
            console.error('找不到应用网格容器');
            return;
        }
        
        const sortedApps = [...this.config.apps].sort((a, b) => a.order - b.order);
        
        appGrid.innerHTML = sortedApps.map(app => `
            <div class="app-icon" data-app="${app.id}">
                <div class="icon-circle" style="background: ${app.color}">
                    <i class="${app.icon}" style="color: white"></i>
                </div>
                <div class="app-name">${app.name}</div>
            </div>
        `).join('');
        
        console.log('✓ 应用图标已创建');
    },
    
    createAppPages() {
        const container = document.getElementById('app-pages-container');
        if (!container) {
            console.error('找不到应用页面容器');
            return;
        }
        
        // 清理容器
        container.innerHTML = '';
        
        // 创建设置页面
        if (typeof Settings !== 'undefined') {
            container.innerHTML += Settings.createPage();
        }
        
        // 创建世界书页面
        if (typeof WorldBook !== 'undefined') {
            container.innerHTML += WorldBook.createPage();
        }
        
        // 创建聊天页面
        if (typeof Chat !== 'undefined') {
            container.innerHTML += Chat.createPage();
        }
        
        // 创建情侣空间页面
        if (typeof CouplesSpace !== 'undefined') {
            container.innerHTML += CouplesSpace.createPage();
        }
        
        // 创建朋友圈页面
        if (typeof Moments !== 'undefined') {
            container.innerHTML += Moments.createPage();
        }
        
        // 创建个人资料页面
        if (typeof Profile !== 'undefined') {
            container.innerHTML += Profile.createPage();
        }
        
        // 创建钱包页面
        if (typeof Profile !== 'undefined') {
            container.innerHTML += Profile.createWalletPage();
        }
        
        // 创建主题美化页面
        if (typeof Themes !== 'undefined') {
            container.innerHTML += Themes.createPage();
        }
        
        // 创建美化页面（占位）
        container.innerHTML += `
            <div class="app-page" id="beautify-page">
                <div class="app-header">
                    <button class="back-button" data-back="home">
                        <i class="fas fa-chevron-left"></i>
                        <span>返回</span>
                    </button>
                    <div class="page-title">美化</div>
                    <div></div>
                </div>
                <div class="coming-soon">
                    <i class="fas fa-tools"></i>
                    <h3>功能开发中</h3>
                    <p>美化功能正在努力开发中，敬请期待！</p>
                </div>
            </div>
        `;
        
        console.log('✓ 应用页面已创建');
    },
    
    setupEventListeners() {
        // 应用图标点击事件 - 使用事件委托
        document.addEventListener('click', (e) => {
            const appIcon = e.target.closest('.app-icon');
            if (appIcon) {
                const appId = appIcon.dataset.app;
                console.log(`点击应用: ${appId}`);
                this.openApp(appId);
                e.preventDefault();
                e.stopPropagation();
            }
            
            // 返回按钮点击
            const backButton = e.target.closest('.back-button');
            if (backButton) {
                const target = backButton.dataset.back;
                console.log(`点击返回按钮，目标: ${target}`);
                if (target === 'home') {
                    this.goHome();
                } else if (target === 'profile') {
                    this.openApp('profile');
                }
                e.preventDefault();
                e.stopPropagation();
            }
        });
        
        // 获取底部指示器
        this.state.homeIndicator = document.querySelector('.home-indicator');
        
        console.log('✓ 事件监听器已设置');
    },
    
    openApp(appId) {
        console.log(`打开应用: ${appId}`);
        
        // 隐藏所有页面
        const pages = document.querySelectorAll('.app-page');
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示目标页面
        const targetPage = document.getElementById(`${appId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.state.currentPage = appId;
            
            // 特殊处理：进入聊天页面时显示小组件
            if (appId === 'chat') {
                const widget = document.getElementById('widget-container');
                if (widget) {
                    widget.style.display = 'block';
                    console.log('✓ 聊天页面显示小组件');
                }
            }
            
            // 隐藏主屏幕指示器
            if (this.state.homeIndicator) {
                this.state.homeIndicator.style.opacity = '0';
            }
            
            // 触发应用打开事件
            EventManager.emit(`app:${appId}:opened`);
            
            console.log(`✓ 应用 ${appId} 页面已打开`);
        } else {
            console.error(`找不到应用页面: ${appId}-page`);
            // 如果找不到页面，创建它
            this.createMissingPage(appId);
        }
    },
    
    createMissingPage(appId) {
        const container = document.getElementById('app-pages-container');
        if (!container) return;
        
        // 创建基础页面结构
        const pageHtml = `
            <div class="app-page" id="${appId}-page">
                <div class="app-header">
                    <button class="back-button" data-back="home">
                        <i class="fas fa-chevron-left"></i>
                        <span>返回</span>
                    </button>
                    <div class="page-title">${this.config.apps.find(a => a.id === appId)?.name || appId}</div>
                    <div></div>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ffa500; margin-bottom: 20px;"></i>
                    <h3>页面加载中...</h3>
                    <p>如果页面没有正常显示，请刷新页面</p>
                </div>
            </div>
        `;
        
        container.innerHTML += pageHtml;
        
        // 重新尝试打开
        setTimeout(() => {
            this.openApp(appId);
        }, 100);
    },
    
    goHome() {
        console.log('返回主屏幕');
        
        // 隐藏所有页面
        document.querySelectorAll('.app-page').forEach(page => {
            page.classList.remove('active');
        });
        
        this.state.currentPage = 'home';
        
        // 显示主屏幕指示器
        if (this.state.homeIndicator) {
            this.state.homeIndicator.style.opacity = '1';
        }
        
        // 确保小组件可见
        const widget = document.getElementById('widget-container');
        if (widget) {
            widget.style.display = 'block';
        }
        
        // 触发返回主屏幕事件
        EventManager.emit('app:home');
        
        console.log('✓ 已返回主屏幕');
    },
    
    startClock() {
        const updateClock = () => {
            const { date, time, statusTime } = Utils.formatDateTime();
            
            const dateDisplay = document.getElementById('date-display');
            const timeDisplay = document.getElementById('time-display');
            const timeSmall = document.getElementById('time-small');
            
            if (dateDisplay) dateDisplay.textContent = date;
            if (timeDisplay) timeDisplay.textContent = time;
            if (timeSmall) timeSmall.textContent = statusTime;
        };
        
        updateClock();
        setInterval(updateClock, 1000);
        
        console.log('✓ 时钟已启动');
    },
    
    loadSavedData() {
        console.log('加载保存的数据...');
        
        // 这里调用各模块的加载方法
        if (typeof WorldBook !== 'undefined') WorldBook.loadData();
        if (typeof Chat !== 'undefined') Chat.loadData();
        if (typeof Profile !== 'undefined') Profile.loadData();
        if (typeof Themes !== 'undefined') Themes.loadData();
        if (typeof Moments !== 'undefined') Moments.loadData();
        if (typeof CouplesSpace !== 'undefined') CouplesSpace.loadData();
        
        console.log('✓ 数据加载完成');
    },
    
    // 修复点击bug的检查方法
    checkClickBug() {
        console.log('=== 点击功能检查 ===');
        
        // 检查应用图标
        const appIcons = document.querySelectorAll('.app-icon');
        console.log(`找到 ${appIcons.length} 个应用图标`);
        
        appIcons.forEach((icon, index) => {
            const appId = icon.dataset.app;
            console.log(`图标 ${index + 1}: ${appId}`);
            
            // 检查点击事件
            icon.addEventListener('click', (e) => {
                console.log(`图标 ${appId} 被点击`);
                console.log('事件目标:', e.target);
                console.log('当前类名:', icon.className);
            });
        });
        
        // 检查应用页面
        const appPages = document.querySelectorAll('.app-page');
        console.log(`找到 ${appPages.length} 个应用页面`);
        
        appPages.forEach((page, index) => {
            const pageId = page.id.replace('-page', '');
            console.log(`页面 ${index + 1}: ${pageId}, 可见性: ${page.style.display}`);
        });
    }
};

// 全局辅助函数
window.openApp = (appId) => {
    App.openApp(appId);
};

window.goHome = () => {
    App.goHome();
};

// 应用启动 - 使用DOMContentLoaded确保所有元素已加载
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 加载完成，开始初始化应用...');
    
    // 检查必要的元素是否存在
    const requiredElements = [
        'app-grid',
        'app-pages-container',
        'widget-container'
    ];
    
    let allElementsExist = true;
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`找不到必要元素: #${id}`);
            allElementsExist = false;
        }
    });
    
    if (allElementsExist) {
        App.init();
        
        // 延迟检查点击功能
        setTimeout(() => {
            App.checkClickBug();
        }, 1000);
    } else {
        console.error('缺少必要元素，应用无法启动');
        alert('应用初始化失败，请刷新页面重试');
    }
});

// 页面加载完成后额外检查
window.addEventListener('load', () => {
    console.log('页面完全加载完成');
    
    // 如果有错误，尝试修复
    if (!document.querySelector('.app-page.active') && App.state.currentPage !== 'home') {
        console.log('检测到页面状态异常，重置到主屏幕');
        App.goHome();
    }
});
