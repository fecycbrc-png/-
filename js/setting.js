const Settings = {
    init() {
        this.createSettingsList();
        this.setupEventListeners();
    },
    
    createPage() {
        return `
            <div class="app-page" id="settings-page">
                <div class="app-header">
                    <button class="back-button" data-back="home">
                        <i class="fas fa-chevron-left"></i>
                        <span>返回</span>
                    </button>
                    <div class="page-title">设置</div>
                    <div></div>
                </div>
                <div class="settings-list" id="settings-list"></div>
            </div>
        `;
    },
    
    createSettingsList() {
        const list = document.getElementById('settings-list');
        if (!list) return;
        
        list.innerHTML = `
            <div class="setting-item" data-setting="api">
                <div class="setting-info">
                    <div class="setting-title">API 设置</div>
                    <div class="setting-desc">配置反代地址和密钥，拉取可用模型</div>
                </div>
                <div class="setting-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
            
            <div class="setting-item" data-setting="widget-bg">
                <div class="setting-info">
                    <div class="setting-title">小组件背景</div>
                    <div class="setting-desc">自定义时间日期小组件的背景</div>
                </div>
                <div class="setting-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
            
            <div class="setting-item" data-setting="wallpaper">
                <div class="setting-info">
                    <div class="setting-title">主屏幕壁纸</div>
                    <div class="setting-desc">自定义手机主屏幕的背景壁纸</div>
                </div>
                <div class="setting-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
            
            <div class="setting-item" data-setting="export">
                <div class="setting-info">
                    <div class="setting-title">导出数据</div>
                    <div class="setting-desc">一键导出小手机的所有数据</div>
                </div>
                <div class="setting-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `;
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const settingItem = e.target.closest('.setting-item');
            if (settingItem) {
                const setting = settingItem.dataset.setting;
                this.openSetting(setting);
            }
        });
    },
    
    openSetting(setting) {
        switch(setting) {
            case 'api':
                this.showApiSettings();
                break;
            case 'widget-bg':
                this.showWidgetBgSettings();
                break;
            case 'wallpaper':
                this.showWallpaperSettings();
                break;
            case 'export':
                App.exportAllData();
                break;
        }
    },
    
    showApiSettings() {
        const modalId = 'api-settings-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = modalId;
            modal.innerHTML = `
                <div class="modal-content">
                    <h3 class="modal-title">API 设置</h3>
                    <form id="api-form">
                        <div class="form-group">
                            <label class="form-label" for="api-reverse-proxy">反代地址</label>
                            <input type="url" class="form-input" id="api-reverse-proxy" 
                                   placeholder="https://api.example.com/v1">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="api-key">API 密钥</label>
                            <input type="password" class="form-input" id="api-key" 
                                   placeholder="输入您的API密钥">
                        </div>
                        
                        <div class="button-group">
                            <button type="button" class="btn btn-success" id="fetch-models">
                                <span id="fetch-models-text">拉取可用模型</span>
                            </button>
                            <button type="button" class="btn btn-primary" id="test-connection">测试连接</button>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">可用模型列表</label>
                            <div class="model-list" id="model-list">
                                <div style="text-align:center; padding:20px; color:#666;">
                                    暂无可用模型，请先配置API并拉取模型列表
                                </div>
                            </div>
                        </div>
                        
                        <div class="button-group">
                            <button type="button" class="btn btn-secondary" id="cancel-api">取消</button>
                            <button type="submit" class="btn btn-primary">保存设置</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById('modals-container').appendChild(modal);
            
            modal.querySelector('#cancel-api').addEventListener('click', () => {
                modal.classList.remove('active');
            });
            
            modal.querySelector('#api-form').addEventListener('submit', (e) => {
                e.preventDefault();
                Utils.showNotification('API设置已保存');
                modal.classList.remove('active');
            });
            
            modal.querySelector('#fetch-models').addEventListener('click', () => {
                Utils.showNotification('正在拉取模型...');
            });
            
            modal.querySelector('#test-connection').addEventListener('click', () => {
                Utils.showNotification('正在测试连接...');
            });
        }
        
        modal.classList.add('active');
    },
    
    showWidgetBgSettings() {
        const modalId = 'widget-bg-settings-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = modalId;
            modal.innerHTML = `
                <div class="modal-content">
                    <h3 class="modal-title">小组件背景设置</h3>
                    <form id="widget-bg-form">
                        <div class="form-group">
                            <label class="form-label">选择背景类型</label>
                            <div class="custom-bg-options">
                                <div class="bg-option" data-bg-type="color" data-bg-value="#ffffff" style="background-color:#ffffff;">白色</div>
                                <div class="bg-option" data-bg-type="gradient" data-bg-value="gradient1" style="background:linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);">渐变1</div>
                                <div class="bg-option" data-bg-type="gradient" data-bg-value="gradient2" style="background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">渐变2</div>
                                <div class="bg-option" data-bg-type="gradient" data-bg-value="gradient3" style="background:linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">渐变3</div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">或选择颜色</label>
                            <div class="color-options">
                                <div class="color-picker" style="background-color:#ffffff;" data-color="#ffffff"></div>
                                <div class="color-picker" style="background-color:#f8f9fa;" data-color="#f8f9fa"></div>
                                <div class="color-picker" style="background-color:#e9ecef;" data-color="#e9ecef"></div>
                                <div class="color-picker" style="background-color:#dee2e6;" data-color="#dee2e6"></div>
                                <div class="color-picker" style="background-color:#4a6cf7;" data-color="#4a6cf7"></div>
                                <div class="color-picker" style="background-color:#5cd85a;" data-color="#5cd85a"></div>
                                <div class="color-picker" style="background-color:#ff6b6b;" data-color="#ff6b6b"></div>
                                <div class="color-picker" style="background-color:#ffa500;" data-color="#ffa500"></div>
                            </div>
                            <input type="color" class="form-input" id="widget-color-picker" value="#ffffff">
                        </div>
                        
                        <div class="button-group">
                            <button type="button" class="btn btn-secondary" id="cancel-widget-bg">取消</button>
                            <button type="submit" class="btn btn-primary">保存设置</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById('modals-container').appendChild(modal);
            
            modal.querySelector('#cancel-widget-bg').addEventListener('click', () => {
                modal.classList.remove('active');
            });
            
            modal.querySelector('#widget-bg-form').addEventListener('submit', (e) => {
                e.preventDefault();
                Utils.showNotification('小组件背景已保存');
                modal.classList.remove('active');
            });
            
            // 背景选项点击事件
            modal.querySelectorAll('.bg-option').forEach(option => {
                option.addEventListener('click', function() {
                    modal.querySelectorAll('.bg-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    this.classList.add('selected');
                });
            });
            
            // 颜色选择器点击事件
            modal.querySelectorAll('.color-picker').forEach(picker => {
                picker.addEventListener('click', function() {
                    const color = this.getAttribute('data-color');
                    modal.querySelector('#widget-color-picker').value = color;
                });
            });
            
            modal.querySelector('#widget-color-picker').addEventListener('input', function() {
                // 预览颜色效果
            });
        }
        
        modal.classList.add('active');
    },
    
    showWallpaperSettings() {
        const modalId = 'wallpaper-settings-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = modalId;
            modal.innerHTML = `
                <div class="modal-content">
                    <h3 class="modal-title">主屏幕壁纸设置</h3>
                    <form id="wallpaper-form">
                        <div class="form-group">
                            <label class="form-label">选择壁纸</label>
                            <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:25px;">
                                <div class="wallpaper-option" data-wallpaper-type="color" data-wallpaper-value="default" style="background-color:#f5f5f5;">默认</div>
                                <div class="wallpaper-option" data-wallpaper-type="gradient" data-wallpaper-value="blue" style="background:linear-gradient(to bottom, #4a6cf7, #8a63ff);">蓝色</div>
                                <div class="wallpaper-option" data-wallpaper-type="gradient" data-wallpaper-value="nature" style="background:linear-gradient(to bottom, #5cd85a, #4facfe);">自然</div>
                                <div class="wallpaper-option" data-wallpaper-type="gradient" data-wallpaper-value="sunset" style="background:linear-gradient(to bottom, #ff6b6b, #ffa500);">日落</div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">自定义壁纸颜色</label>
                            <input type="color" class="form-input" id="wallpaper-color" value="#f5f5f5">
                        </div>
                        
                        <div class="button-group">
                            <button type="button" class="btn btn-secondary" id="cancel-wallpaper">取消</button>
                            <button type="submit" class="btn btn-primary">保存设置</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById('modals-container').appendChild(modal);
            
            modal.querySelector('#cancel-wallpaper').addEventListener('click', () => {
                modal.classList.remove('active');
            });
            
            modal.querySelector('#wallpaper-form').addEventListener('submit', (e) => {
                e.preventDefault();
                Utils.showNotification('壁纸设置已保存');
                modal.classList.remove('active');
            });
            
            // 壁纸选项点击事件
            modal.querySelectorAll('.wallpaper-option').forEach(option => {
                option.addEventListener('click', function() {
                    modal.querySelectorAll('.wallpaper-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    this.classList.add('selected');
                });
            });
        }
        
        modal.classList.add('active');
    },
    
    loadData() {
        // 加载设置数据
    }
};
