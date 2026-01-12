const Settings = {
    // 存储设置数据
    data: {
        apiConfig: {
            reverseProxyUrl: '',
            apiKey: '',
            availableModels: [],
            selectedModel: ''
        },
        widgetBackground: {
            type: 'color',
            color: '#ffffff',
            image: null,
            opacity: 0.7
        },
        wallpaper: {
            type: 'color',
            color: '#f5f5f5',
            image: null
        }
    },
    
    init() {
        this.loadData();
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
                    <div class="setting-desc">自定义时间日期小组件的背景和透明度</div>
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
    
    // API设置功能
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
                                   placeholder="https://api.example.com/v1" 
                                   value="${this.data.apiConfig.reverseProxyUrl}">
                            <div class="form-hint">请输入完整的API反代地址</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="api-key">API 密钥</label>
                            <input type="password" class="form-input" id="api-key" 
                                   placeholder="输入您的API密钥" 
                                   value="${this.data.apiConfig.apiKey}">
                            <div class="form-hint">API密钥将保存在本地</div>
                        </div>
                        
                        <div class="button-group">
                            <button type="button" class="btn btn-success" id="fetch-models">
                                <span id="fetch-models-text">拉取可用模型</span>
                                <span id="fetch-models-spinner" style="display:none; margin-left:8px;">
                                    <div class="loading-spinner"></div>
                                </span>
                            </button>
                            <button type="button" class="btn btn-primary" id="test-connection">测试连接</button>
                        </div>
                        
                        <div class="form-group" style="${this.data.apiConfig.availableModels.length > 0 ? '' : 'display:none;'}" id="models-section">
                            <label class="form-label">可用模型 (${this.data.apiConfig.availableModels.length} 个)</label>
                            <div class="model-list" id="model-list">
                                ${this.renderModelList()}
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
            
            // 设置事件监听
            this.setupApiModalEvents(modal);
        }
        
        modal.classList.add('active');
    },
    
    setupApiModalEvents(modal) {
        modal.querySelector('#cancel-api').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.querySelector('#api-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveApiSettings();
            modal.classList.remove('active');
        });
        
        modal.querySelector('#fetch-models').addEventListener('click', () => {
            this.fetchAvailableModels(modal);
        });
        
        modal.querySelector('#test-connection').addEventListener('click', () => {
            this.testApiConnection();
        });
        
        // 模型选择事件
        modal.addEventListener('click', (e) => {
            const modelItem = e.target.closest('.model-item');
            if (modelItem) {
                const modelId = modelItem.dataset.modelId;
                this.selectModel(modelId, modal);
            }
        });
    },
    
    async fetchAvailableModels(modal) {
        const proxyUrl = document.getElementById('api-reverse-proxy').value;
        const apiKey = document.getElementById('api-key').value;
        
        if (!proxyUrl) {
            Utils.showNotification('请输入反代地址');
            return;
        }
        
        if (!apiKey) {
            Utils.showNotification('请输入API密钥');
            return;
        }
        
        // 显示加载状态
        const fetchBtnText = modal.querySelector('#fetch-models-text');
        const fetchBtnSpinner = modal.querySelector('#fetch-models-spinner');
        fetchBtnText.textContent = '拉取中...';
        fetchBtnSpinner.style.display = 'inline-block';
        
        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 模拟返回的模型数据
            const mockModels = [
                { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
                { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
                { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
                { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
                { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
                { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
                { id: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta' }
            ];
            
            this.data.apiConfig.availableModels = mockModels;
            this.updateModelList(modal);
            Utils.showNotification(`成功拉取 ${mockModels.length} 个模型`);
            
        } catch (error) {
            console.error('拉取模型失败:', error);
            Utils.showNotification('拉取失败: ' + error.message);
        } finally {
            fetchBtnText.textContent = '拉取可用模型';
            fetchBtnSpinner.style.display = 'none';
        }
    },
    
    testApiConnection() {
        const proxyUrl = document.getElementById('api-reverse-proxy').value;
        const apiKey = document.getElementById('api-key').value;
        
        if (!proxyUrl) {
            Utils.showNotification('请输入反代地址');
            return;
        }
        
        if (!apiKey) {
            Utils.showNotification('请输入API密钥');
            return;
        }
        
        Utils.showNotification('正在测试连接...');
        
        // 模拟连接测试
        setTimeout(() => {
            const success = Math.random() > 0.3;
            if (success) {
                Utils.showNotification('连接测试成功！');
            } else {
                Utils.showNotification('连接测试失败，请检查配置');
            }
        }, 1500);
    },
    
    updateModelList(modal) {
        const modelsSection = modal.querySelector('#models-section');
        const modelList = modal.querySelector('#model-list');
        
        if (this.data.apiConfig.availableModels.length > 0) {
            modelsSection.style.display = 'block';
            modelList.innerHTML = this.renderModelList();
        } else {
            modelsSection.style.display = 'none';
        }
    },
    
    renderModelList() {
        if (this.data.apiConfig.availableModels.length === 0) {
            return '<div style="text-align:center; padding:20px; color:#666;">暂无可用模型，请先拉取模型列表</div>';
        }
        
        return this.data.apiConfig.availableModels.map(model => `
            <div class="model-item ${this.data.apiConfig.selectedModel === model.id ? 'selected' : ''}" data-model-id="${model.id}">
                <div class="model-name">${model.name}</div>
                <div class="model-id">ID: ${model.id} | 提供商: ${model.provider}</div>
            </div>
        `).join('');
    },
    
    selectModel(modelId, modal) {
        this.data.apiConfig.selectedModel = modelId;
        this.updateModelList(modal);
        Utils.showNotification(`已选择模型: ${modelId}`);
    },
    
    saveApiSettings() {
        const proxyUrl = document.getElementById('api-reverse-proxy').value;
        const apiKey = document.getElementById('api-key').value;
        
        this.data.apiConfig.reverseProxyUrl = proxyUrl;
        this.data.apiConfig.apiKey = apiKey;
        
        this.saveData();
        Utils.showNotification('API设置已保存');
    },
    
    // 小组件背景设置
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
                            <label class="form-label">背景类型</label>
                            <div class="bg-type-selector">
                                <button type="button" class="bg-type-btn ${this.data.widgetBackground.type === 'color' ? 'active' : ''}" data-type="color">
                                    <i class="fas fa-fill-drip"></i> 颜色
                                </button>
                                <button type="button" class="bg-type-btn ${this.data.widgetBackground.type === 'gradient' ? 'active' : ''}" data-type="gradient">
                                    <i class="fas fa-sliders-h"></i> 渐变
                                </button>
                                <button type="button" class="bg-type-btn ${this.data.widgetBackground.type === 'image' ? 'active' : ''}" data-type="image">
                                    <i class="fas fa-image"></i> 图片
                                </button>
                            </div>
                        </div>
                        
                        <!-- 颜色设置 -->
                        <div class="form-group bg-option ${this.data.widgetBackground.type === 'color' ? '' : 'hidden'}" id="color-option">
                            <label class="form-label">选择颜色</label>
                            <div class="color-options">
                                ${this.renderColorOptions()}
                            </div>
                            <input type="color" class="form-input" id="widget-color" value="${this.data.widgetBackground.color}" style="margin-top:10px;">
                        </div>
                        
                        <!-- 渐变设置 -->
                        <div class="form-group bg-option ${this.data.widgetBackground.type === 'gradient' ? '' : 'hidden'}" id="gradient-option">
                            <label class="form-label">选择渐变</label>
                            <div class="gradient-options">
                                <div class="gradient-option ${this.data.widgetBackground.color === 'gradient1' ? 'selected' : ''}" data-gradient="gradient1" style="background:linear-gradient(135deg, #6a11cb, #2575fc);"></div>
                                <div class="gradient-option ${this.data.widgetBackground.color === 'gradient2' ? 'selected' : ''}" data-gradient="gradient2" style="background:linear-gradient(135deg, #f093fb, #f5576c);"></div>
                                <div class="gradient-option ${this.data.widgetBackground.color === 'gradient3' ? 'selected' : ''}" data-gradient="gradient3" style="background:linear-gradient(135deg, #4facfe, #00f2fe);"></div>
                                <div class="gradient-option ${this.data.widgetBackground.color === 'gradient4' ? 'selected' : ''}" data-gradient="gradient4" style="background:linear-gradient(135deg, #43e97b, #38f9d7);"></div>
                            </div>
                        </div>
                        
                        <!-- 图片上传 -->
                        <div class="form-group bg-option ${this.data.widgetBackground.type === 'image' ? '' : 'hidden'}" id="image-option">
                            <label class="form-label">上传图片</label>
                            <div class="file-upload-container" id="widget-image-upload">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <div class="file-upload-text">点击上传背景图片</div>
                                <input type="file" accept="image/*" style="display: none;">
                            </div>
                            ${this.data.widgetBackground.image ? `
                                <div class="image-preview">
                                    <img src="${this.data.widgetBackground.image}" alt="背景预览" style="max-width:100%; max-height:150px; border-radius:10px; margin-top:10px;">
                                </div>
                            ` : ''}
                        </div>
                        
                        <!-- 透明度设置 -->
                        <div class="form-group">
                            <label class="form-label">透明度: <span id="opacity-value">${Math.round(this.data.widgetBackground.opacity * 100)}%</span></label>
                            <input type="range" class="form-range" id="widget-opacity" min="10" max="100" value="${Math.round(this.data.widgetBackground.opacity * 100)}">
                            <div class="range-labels">
                                <span>透明</span>
                                <span>半透明</span>
                                <span>不透明</span>
                            </div>
                        </div>
                        
                        <div class="preview-section">
                            <label class="form-label">实时预览</label>
                            <div class="widget-preview" id="widget-preview" style="
                                background: ${this.getWidgetBackgroundStyle()};
                                opacity: ${this.data.widgetBackground.opacity};
                            ">
                                <div class="preview-overlay" style="opacity: ${1 - this.data.widgetBackground.opacity};"></div>
                                <div class="preview-time">15:45:32</div>
                            </div>
                        </div>
                        
                        <div class="button-group">
                            <button type="button" class="btn btn-secondary" id="cancel-widget-bg">取消</button>
                            <button type="submit" class="btn btn-primary">保存设置</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById('modals-container').appendChild(modal);
            
            this.setupWidgetBgModalEvents(modal);
        }
        
        modal.classList.add('active');
    },
    
    setupWidgetBgModalEvents(modal) {
        modal.querySelector('#cancel-widget-bg').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.querySelector('#widget-bg-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveWidgetBgSettings();
            modal.classList.remove('active');
        });
        
        // 背景类型切换
        modal.querySelectorAll('.bg-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                this.switchWidgetBgType(type, modal);
            });
        });
        
        // 颜色选择
        modal.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                const color = option.dataset.color;
                this.selectWidgetColor(color, modal);
            });
        });
        
        // 渐变选择
        modal.querySelectorAll('.gradient-option').forEach(option => {
            option.addEventListener('click', () => {
                const gradient = option.dataset.gradient;
                this.selectWidgetGradient(gradient, modal);
            });
        });
        
        // 图片上传
        const uploadContainer = modal.querySelector('#widget-image-upload');
        const fileInput = uploadContainer.querySelector('input[type="file"]');
        
        uploadContainer.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const imageData = await Utils.readFileAsBase64(file);
                    this.data.widgetBackground.image = imageData;
                    this.updateWidgetPreview(modal);
                    
                    // 更新预览图片
                    let previewContainer = modal.querySelector('.image-preview');
                    if (!previewContainer) {
                        previewContainer = document.createElement('div');
                        previewContainer.className = 'image-preview';
                        modal.querySelector('#image-option').appendChild(previewContainer);
                    }
                    previewContainer.innerHTML = `
                        <img src="${imageData}" alt="背景预览" style="max-width:100%; max-height:150px; border-radius:10px; margin-top:10px;">
                    `;
                    
                } catch (error) {
                    Utils.showNotification(error.message);
                }
            }
        });
        
        // 透明度滑块
        const opacitySlider = modal.querySelector('#widget-opacity');
        const opacityValue = modal.querySelector('#opacity-value');
        
        opacitySlider.addEventListener('input', () => {
            const opacity = opacitySlider.value / 100;
            opacityValue.textContent = `${opacitySlider.value}%`;
            this.data.widgetBackground.opacity = opacity;
            this.updateWidgetPreview(modal);
        });
        
        // 颜色选择器
        const colorPicker = modal.querySelector('#widget-color');
        colorPicker.addEventListener('input', () => {
            this.data.widgetBackground.color = colorPicker.value;
            this.updateWidgetPreview(modal);
        });
    },
    
    switchWidgetBgType(type, modal) {
        this.data.widgetBackground.type = type;
        
        // 更新按钮状态
        modal.querySelectorAll('.bg-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        
        // 显示对应的选项
        modal.querySelectorAll('.bg-option').forEach(option => {
            option.classList.toggle('hidden', option.id !== `${type}-option`);
        });
        
        this.updateWidgetPreview(modal);
    },
    
    selectWidgetColor(color, modal) {
        this.data.widgetBackground.color = color;
        modal.querySelector('#widget-color').value = color;
        this.updateWidgetPreview(modal);
    },
    
    selectWidgetGradient(gradient, modal) {
        this.data.widgetBackground.color = gradient;
        modal.querySelectorAll('.gradient-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.gradient === gradient);
        });
        this.updateWidgetPreview(modal);
    },
    
    updateWidgetPreview(modal) {
        const preview = modal.querySelector('#widget-preview');
        if (preview) {
            preview.style.background = this.getWidgetBackgroundStyle();
            preview.style.opacity = this.data.widgetBackground.opacity;
            
            const overlay = preview.querySelector('.preview-overlay');
            if (overlay) {
                overlay.style.opacity = 1 - this.data.widgetBackground.opacity;
            }
        }
    },
    
    getWidgetBackgroundStyle() {
        const bg = this.data.widgetBackground;
        
        switch(bg.type) {
            case 'color':
                return bg.color;
            case 'gradient':
                return this.getGradientStyle(bg.color);
            case 'image':
                return bg.image ? `url(${bg.image})` : '#ffffff';
            default:
                return '#ffffff';
        }
    },
    
    getGradientStyle(gradient) {
        const gradients = {
            'gradient1': 'linear-gradient(135deg, #6a11cb, #2575fc)',
            'gradient2': 'linear-gradient(135deg, #f093fb, #f5576c)',
            'gradient3': 'linear-gradient(135deg, #4facfe, #00f2fe)',
            'gradient4': 'linear-gradient(135deg, #43e97b, #38f9d7)'
        };
        return gradients[gradient] || gradients.gradient1;
    },
    
    renderColorOptions() {
        const colors = [
            '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6',
            '#4a6cf7', '#5cd85a', '#ff6b6b', '#ffa500',
            '#6a11cb', '#2575fc', '#f093fb', '#f5576c',
            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
        ];
        
        return colors.map(color => `
            <div class="color-option ${this.data.widgetBackground.color === color ? 'selected' : ''}" 
                 data-color="${color}" 
                 style="background-color: ${color}; border: ${color === '#ffffff' ? '1px solid #ddd' : 'none'}">
            </div>
        `).join('');
    },
    
    saveWidgetBgSettings() {
        this.saveData();
        this.applyWidgetBackground();
        Utils.showNotification('小组件背景已保存');
    },
    
    applyWidgetBackground() {
        const widget = document.getElementById('widget-container');
        if (!widget) return;
        
        const bg = this.data.widgetBackground;
        const overlay = widget.querySelector('.widget-overlay');
        
        // 设置背景
        widget.style.background = this.getWidgetBackgroundStyle();
        widget.style.backgroundSize = 'cover';
        widget.style.backgroundPosition = 'center';
        
        // 设置覆盖层透明度
        if (overlay) {
            overlay.style.backgroundColor = `rgba(255, 255, 255, ${1 - bg.opacity})`;
        }
    },
    
    // 主屏幕壁纸设置
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
                            <label class="form-label">壁纸类型</label>
                            <div class="wallpaper-type-selector">
                                <button type="button" class="wallpaper-type-btn ${this.data.wallpaper.type === 'color' ? 'active' : ''}" data-type="color">
                                    <i class="fas fa-fill-drip"></i> 颜色
                                </button>
                                <button type="button" class="wallpaper-type-btn ${this.data.wallpaper.type === 'gradient' ? 'active' : ''}" data-type="gradient">
                                    <i class="fas fa-sliders-h"></i> 渐变
                                </button>
                                <button type="button" class="wallpaper-type-btn ${this.data.wallpaper.type === 'image' ? 'active' : ''}" data-type="image">
                                    <i class="fas fa-image"></i> 图片
                                </button>
                            </div>
                        </div>
                        
                        <!-- 颜色设置 -->
                        <div class="form-group wallpaper-option ${this.data.wallpaper.type === 'color' ? '' : 'hidden'}" id="wallpaper-color-option">
                            <label class="form-label">选择颜色</label>
                            <div class="color-options">
                                ${this.renderWallpaperColorOptions()}
                            </div>
                            <input type="color" class="form-input" id="wallpaper-color" value="${this.data.wallpaper.color}" style="margin-top:10px;">
                        </div>
                        
                        <!-- 渐变设置 -->
                        <div class="form-group wallpaper-option ${this.data.wallpaper.type === 'gradient' ? '' : 'hidden'}" id="wallpaper-gradient-option">
                            <label class="form-label">选择渐变</label>
                            <div class="wallpaper-gradient-options">
                                <div class="wallpaper-gradient-option ${this.data.wallpaper.color === 'blue' ? 'selected' : ''}" data-gradient="blue" style="background:linear-gradient(to bottom, #4a6cf7, #8a63ff);">
                                    <span>蓝色渐变</span>
                                </div>
                                <div class="wallpaper-gradient-option ${this.data.wallpaper.color === 'nature' ? 'selected' : ''}" data-gradient="nature" style="background:linear-gradient(to bottom, #5cd85a, #4facfe);">
                                    <span>自然渐变</span>
                                </div>
                                <div class="wallpaper-gradient-option ${this.data.wallpaper.color === 'sunset' ? 'selected' : ''}" data-gradient="sunset" style="background:linear-gradient(to bottom, #ff6b6b, #ffa500);">
                                    <span>日落渐变</span>
                                </div>
                                <div class="wallpaper-gradient-option ${this.data.wallpaper.color === 'purple' ? 'selected' : ''}" data-gradient="purple" style="background:linear-gradient(to bottom, #9d50bb, #6e48aa);">
                                    <span>紫色渐变</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 图片上传 -->
                        <div class="form-group wallpaper-option ${this.data.wallpaper.type === 'image' ? '' : 'hidden'}" id="wallpaper-image-option">
                            <label class="form-label">上传壁纸</label>
                            <div class="file-upload-container" id="wallpaper-image-upload">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <div class="file-upload-text">点击上传壁纸图片</div>
                                <div class="file-upload-hint">建议尺寸：360x700</div>
                                <input type="file" accept="image/*" style="display: none;">
                            </div>
                            ${this.data.wallpaper.image ? `
                                <div class="image-preview">
                                    <img src="${this.data.wallpaper.image}" alt="壁纸预览" style="max-width:100%; max-height:200px; border-radius:10px; margin-top:10px;">
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="preview-section">
                            <label class="form-label">实时预览</label>
                            <div class="wallpaper-preview" id="wallpaper-preview" style="${this.getWallpaperPreviewStyle()}">
                                <div class="preview-widget"></div>
                                <div class="preview-icons">
                                    <div class="preview-icon"></div>
                                    <div class="preview-icon"></div>
                                    <div class="preview-icon"></div>
                                    <div class="preview-icon"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="button-group">
                            <button type="button" class="btn btn-secondary" id="cancel-wallpaper">取消</button>
                            <button type="submit" class="btn btn-primary">保存设置</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById('modals-container').appendChild(modal);
            
            this.setupWallpaperModalEvents(modal);
        }
        
        modal.classList.add('active');
    },
    
    setupWallpaperModalEvents(modal) {
        modal.querySelector('#cancel-wallpaper').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.querySelector('#wallpaper-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveWallpaperSettings();
            modal.classList.remove('active');
        });
        
        // 壁纸类型切换
        modal.querySelectorAll('.wallpaper-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                this.switchWallpaperType(type, modal);
            });
        });
        
        // 颜色选择
        modal.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                const color = option.dataset.color;
                this.selectWallpaperColor(color, modal);
            });
        });
        
        // 渐变选择
        modal.querySelectorAll('.wallpaper-gradient-option').forEach(option => {
            option.addEventListener('click', () => {
                const gradient = option.dataset.gradient;
                this.selectWallpaperGradient(gradient, modal);
            });
        });
        
        // 图片上传
        const uploadContainer = modal.querySelector('#wallpaper-image-upload');
        const fileInput = uploadContainer.querySelector('input[type="file"]');
        
        uploadContainer.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const imageData = await Utils.readFileAsBase64(file);
                    this.data.wallpaper.image = imageData;
                    this.updateWallpaperPreview(modal);
                    
                    // 更新预览图片
                    let previewContainer = modal.querySelector('.image-preview');
                    if (!previewContainer) {
                        previewContainer = document.createElement('div');
                        previewContainer.className = 'image-preview';
                        modal.querySelector('#wallpaper-image-option').appendChild(previewContainer);
                    }
                    previewContainer.innerHTML = `
                        <img src="${imageData}" alt="壁纸预览" style="max-width:100%; max-height:200px; border-radius:10px; margin-top:10px;">
                    `;
                    
                } catch (error) {
                    Utils.showNotification(error.message);
                }
            }
        });
        
        // 颜色选择器
        const colorPicker = modal.querySelector('#wallpaper-color');
        colorPicker.addEventListener('input', () => {
            this.data.wallpaper.color = colorPicker.value;
            this.updateWallpaperPreview(modal);
        });
    },
    
    switchWallpaperType(type, modal) {
        this.data.wallpaper.type = type;
        
        // 更新按钮状态
        modal.querySelectorAll('.wallpaper-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        
        // 显示对应的选项
        modal.querySelectorAll('.wallpaper-option').forEach(option => {
            option.classList.toggle('hidden', option.id !== `wallpaper-${type}-option`);
        });
        
        this.updateWallpaperPreview(modal);
    },
    
    selectWallpaperColor(color, modal) {
        this.data.wallpaper.color = color;
        modal.querySelector('#wallpaper-color').value = color;
        this.updateWallpaperPreview(modal);
    },
    
    selectWallpaperGradient(gradient, modal) {
        this.data.wallpaper.color = gradient;
        modal.querySelectorAll('.wallpaper-gradient-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.gradient === gradient);
        });
        this.updateWallpaperPreview(modal);
    },
    
    updateWallpaperPreview(modal) {
        const preview = modal.querySelector('#wallpaper-preview');
        if (preview) {
            preview.style.cssText = this.getWallpaperPreviewStyle();
        }
    },
    
    getWallpaperPreviewStyle() {
        const wp = this.data.wallpaper;
        let background = '';
        
        switch(wp.type) {
            case 'color':
                background = wp.color;
                break;
            case 'gradient':
                background = this.getWallpaperGradientStyle(wp.color);
                break;
            case 'image':
                background = wp.image ? `url(${wp.image})` : '#f5f5f5';
                break;
            default:
                background = '#f5f5f5';
        }
        
        return `
            background: ${background};
            background-size: cover;
            background-position: center;
            width: 150px;
            height: 300px;
            border-radius: 20px;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
        `;
    },
    
    getWallpaperGradientStyle(gradient) {
        const gradients = {
            'blue': 'linear-gradient(to bottom, #4a6cf7, #8a63ff)',
            'nature': 'linear-gradient(to bottom, #5cd85a, #4facfe)',
            'sunset': 'linear-gradient(to bottom, #ff6b6b, #ffa500)',
            'purple': 'linear-gradient(to bottom, #9d50bb, #6e48aa)'
        };
        return gradients[gradient] || gradients.blue;
    },
    
    renderWallpaperColorOptions() {
        const colors = [
            '#f5f5f5', '#ffffff', '#e8f4fd', '#f9f7ff',
            '#4a6cf7', '#5cd85a', '#ff6b6b', '#ffa500',
            '#333333', '#222222', '#1a1a1a', '#000000'
        ];
        
        return colors.map(color => `
            <div class="color-option ${this.data.wallpaper.color === color ? 'selected' : ''}" 
                 data-color="${color}" 
                 style="background-color: ${color}; border: ${color === '#ffffff' ? '1px solid #ddd' : 'none'}">
            </div>
        `).join('');
    },
    
    saveWallpaperSettings() {
        this.saveData();
        this.applyWallpaper();
        Utils.showNotification('壁纸设置已保存');
    },
    
    applyWallpaper() {
        const screen = document.querySelector('.phone-screen');
        if (!screen) return;
        
        const wp = this.data.wallpaper;
        
        switch(wp.type) {
            case 'color':
                screen.style.background = wp.color;
                screen.style.backgroundImage = 'none';
                break;
            case 'gradient':
                screen.style.background = this.getWallpaperGradientStyle(wp.color);
                screen.style.backgroundImage = 'none';
                break;
            case 'image':
                if (wp.image) {
                    screen.style.backgroundImage = `url(${wp.image})`;
                    screen.style.backgroundSize = 'cover';
                    screen.style.backgroundPosition = 'center';
                    screen.style.backgroundColor = 'transparent';
                }
                break;
        }
    },
    
    saveData() {
        Utils.saveToLocalStorage('settingsData', this.data);
    },
    
    loadData() {
        const saved = Utils.loadFromLocalStorage('settingsData');
        if (saved) {
            this.data = saved;
            // 应用保存的设置
            this.applyWidgetBackground();
            this.applyWallpaper();
        }
    }
};
