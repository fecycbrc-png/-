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
    },
    
    initModules() {
        if (typeof API !== 'undefined') API.init();
        if (typeof WorldBook !== 'undefined') WorldBook.init();
        if (typeof Chat !== 'undefined') Chat.init();
        if (typeof Moments !== 'undefined') Moments.init();
        if (typeof Profile !== 'undefined') Profile.init();
        if (typeof CouplesSpace !== 'undefined') CouplesSpace.init();
        if (typeof Themes !== 'undefined') Themes.init();
        if (typeof Settings !== 'undefined') Settings.init();
    },
    
    createAppIcons() {
        const appGrid = document.getElementById('app-grid');
        if (!appGrid) return;
        
        const sortedApps = [...this.config.apps].sort((a, b) => a.order - b.order);
        
        appGrid.innerHTML = sortedApps.map(app => `
            <div class="app-icon" data-app="${app.id}">
                <div class="icon-circle" style="background: ${app.color}">
                    <i class="${app.icon}" style="color: white"></i>
                </div>
                <div class="app-name">${app.name}</div>
            </div>
        `).join('');
    },
    
    createAppPages() {
        const container = document.getElementById('app-pages-container');
        if (!container) return;
        
        // 基础页面结构
        const pages = {
            'chat': Chat ? Chat.createPage() : '',
            'moments': Moments ? Moments.createPage() : '',
            'profile': Profile ? Profile.createPage() : '',
            'couples-space': CouplesSpace ? CouplesSpace.createPage() : '',
            'themes': Themes ? Themes.createPage() : '',
            'worldbook': WorldBook ? WorldBook.createPage() : '',
            'settings': Settings ? Settings.createPage() : '',
            'wallet': Profile ? Profile.createWalletPage() : ''
        };
        
        container.innerHTML = Object.values(pages).join('');
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const appIcon = e.target.closest('.app-icon');
            if (appIcon) {
                const appId = appIcon.dataset.app;
                this.openApp(appId);
            }
            
            const backButton = e.target.closest('.back-button');
            if (backButton && backButton.dataset.back === 'home') {
                this.goHome();
            }
        });
        
        this.state.homeIndicator = document.querySelector('.home-indicator');
    },
    
    openApp(appId) {
        document.querySelectorAll('.app-page').forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(`${appId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.state.currentPage = appId;
            
            // 特殊处理：进入聊天页面时显示小组件
            if (appId === 'chat') {
                document.getElementById('widget-container').style.display = 'block';
            }
            
            if (this.state.homeIndicator) {
                this.state.homeIndicator.style.opacity = '0';
            }
        }
    },
    
    goHome() {
        document.querySelectorAll('.app-page').forEach(page => {
            page.classList.remove('active');
        });
        
        this.state.currentPage = 'home';
        
        if (this.state.homeIndicator) {
            this.state.homeIndicator.style.opacity = '1';
        }
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
    },
    
    loadSavedData() {
        if (typeof WorldBook !== 'undefined') WorldBook.loadData();
        if (typeof Chat !== 'undefined') Chat.loadData();
        if (typeof Profile !== 'undefined') Profile.loadData();
        if (typeof Themes !== 'undefined') Themes.loadData();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
