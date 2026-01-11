const Themes = {
    themes: [
        {
            id: 'default',
            name: '默认主题',
            primary: '#4a6cf7',
            secondary: '#8a63ff',
            background: '#f5f5f5',
            text: '#333333',
            active: false
        },
        {
            id: 'pink',
            name: '粉红恋人',
            primary: '#ff6b6b',
            secondary: '#ff8e8e',
            background: '#fff5f5',
            text: '#333333',
            active: false
        },
        {
            id: 'green',
            name: '清新绿意',
            primary: '#5cd85a',
            secondary: '#7de87d',
            background: '#f5fff5',
            text: '#333333',
            active: false
        },
        {
            id: 'dark',
            name: '深色模式',
            primary: '#7289da',
            secondary: '#99aab5',
            background: '#2c2f33',
            text: '#ffffff',
            active: false
        }
    ],
    
    currentTheme: 'default',
    customThemes: [],
    
    init() {
        this.loadData();
        this.setupEventListeners();
    },
    
    createPage() {
        return `
            <div class="app-page" id="themes-page">
                <div class="app-header">
                    <button class="back-button" data-back="home">
                        <i class="fas fa-chevron-left"></i>
                        <span>返回</span>
                    </button>
                    <div class="page-title">主题美化</div>
                    <button class="action-button" id="add-theme">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="themes-list" id="themes-list"></div>
            </div>
        `;
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#add-theme')) {
                this.showAddThemeModal();
            }
            
            const themeItem = e.target.closest('.theme-item');
            if (themeItem) {
                const themeId = themeItem.dataset.themeId;
                this.applyTheme(themeId);
            }
        });
    },
    
    showAddThemeModal() {
        const modalId = 'add-theme-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = modalId;
            modal.innerHTML = `
                <div class="modal-content">
                    <h3 class="modal-title">创建自定义主题</h3>
                    <form id="add-theme-form">
                        <div class="form-group">
                            <label class="form-label">主题名称</label>
                            <input type="text" class="form-input" id="theme-name" placeholder="输入主题名称" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">主色调</label>
                            <input type="color" class="form-input" id="theme-primary" value="#4a6cf7" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">副色调</label>
                            <input type="color" class="form-input" id="theme-secondary" value="#8a63ff" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">背景色</label>
                            <input type="color" class="form-input" id="theme-background" value="#f5f5f5" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">文字颜色</label>
                            <input type="color" class="form-input" id="theme-text" value="#333333" required>
                        </div>
                        <div class="button-group">
                            <button type="button" class="btn btn-secondary" id="cancel-add-theme">取消</button>
                            <button type="submit" class="btn btn-primary">创建主题</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById('modals-container').appendChild(modal);
            
            modal.querySelector('#cancel-add-theme').addEventListener('click', () => {
                modal.classList.remove('active');
            });
            
            modal.querySelector('#add-theme-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.addCustomTheme();
                modal.classList.remove('active');
            });
        }
        
        modal.classList.add('active');
    },
    
    addCustomTheme() {
        const theme = {
            id: 'custom_' + Date.now(),
            name: document.getElementById('theme-name').value,
            primary: document.getElementById('theme-primary').value,
            secondary: document.getElementById('theme-secondary').value,
            background: document.getElementById('theme-background').value,
            text: document.getElementById('theme-text').value,
            custom: true,
            active: false
        };
        
        this.customThemes.push(theme);
        this.saveData();
        this.render();
        Utils.showNotification(`主题"${theme.name}"创建成功！`);
    },
    
    applyTheme(themeId) {
        this.currentTheme = themeId;
        
        // 更新所有主题的激活状态
        [...this.themes, ...this.customThemes].forEach(theme => {
            theme.active = theme.id === themeId;
        });
        
        const theme = this.getThemeById(themeId);
        if (theme) {
            this.applyThemeStyles(theme);
            this.saveData();
            this.render();
            Utils.showNotification(`已应用"${theme.name}"主题`);
        }
    },
    
    getThemeById(id) {
        return [...this.themes, ...this.customThemes].find(t => t.id === id);
    },
    
    applyThemeStyles(theme) {
        // 应用CSS变量
        document.documentElement.style.setProperty('--theme-primary', theme.primary);
        document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
        document.documentElement.style.setProperty('--theme-background', theme.background);
        document.documentElement.style.setProperty('--theme-text', theme.text);
        
        // 更新应用图标颜色
        const apps = App.config.apps;
        apps[0].color = theme.primary; // 设置
        apps[1].color = theme.secondary; // 世界书
        apps[2].color = theme.primary; // 聊天
        apps[3].color = theme.secondary; // 情侣空间
        
        // 重新渲染应用图标
        App.createAppIcons();
    },
    
    render() {
        const list = document.getElementById('themes-list');
        if (!list) return;
        
        const allThemes = [...this.themes, ...this.customThemes];
        
        list.innerHTML = allThemes.map(theme => `
            <div class="theme-item ${theme.active ? 'active' : ''}" data-theme-id="${theme.id}">
                <div class="theme-header">
                    <div class="theme-name">${theme.name} ${theme.custom ? '(自定义)' : ''}</div>
                    ${theme.active ? '<i class="fas fa-check" style="color: #5cd85a;"></i>' : ''}
                </div>
                <div class="theme-preview" style="background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary})"></div>
                <div class="theme-colors">
                    <div class="theme-color" style="background-color: ${theme.primary}" title="主色调"></div>
                    <div class="theme-color" style="background-color: ${theme.secondary}" title="副色调"></div>
                    <div class="theme-color" style="background-color: ${theme.background}" title="背景色"></div>
                    <div class="theme-color" style="background-color: ${theme.text}" title="文字颜色"></div>
                </div>
            </div>
        `).join('');
    },
    
    saveData() {
        Utils.saveToLocalStorage('themesData', {
            currentTheme: this.currentTheme,
            customThemes: this.customThemes
        });
    },
    
    loadData() {
        const saved = Utils.loadFromLocalStorage('themesData');
        if (saved) {
            this.currentTheme = saved.currentTheme || 'default';
            this.customThemes = saved.customThemes || [];
            
            const theme = this.getThemeById(this.currentTheme);
            if (theme) {
                this.applyThemeStyles(theme);
            }
        }
        
        this.render();
    }
};
