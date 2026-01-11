const CouplesSpace = {
    data: {
        partnerName: 'TA',
        partnerAvatar: '',
        days: 1,
        memories: [],
        tasks: []
    },
    
    init() {
        this.loadData();
        this.setupEventListeners();
    },
    
    createPage() {
        return `
            <div class="app-page" id="couples-space-page">
                <div class="app-header">
                    <button class="back-button" data-back="home">
                        <i class="fas fa-chevron-left"></i>
                        <span>返回</span>
                    </button>
                    <div class="page-title">情侣空间</div>
                    <button class="action-button" id="couples-settings">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
                <div class="couples-space">
                    <div class="couples-header">
                        <div class="couples-avatar">
                            <div class="couple-avatar" style="background-color: #4a6cf7;">
                                <span style="color: white; display: flex; align-items: center; justify-content: center; height: 100%; font-size: 24px;">ME</span>
                            </div>
                            <div class="heart-connector">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="couple-avatar" style="background-color: #ff6b6b;">
                                <span style="color: white; display: flex; align-items: center; justify-content: center; height: 100%; font-size: 24px;">${this.data.partnerName.charAt(0)}</span>
                            </div>
                        </div>
                        <h2 style="color: #333; margin-bottom: 10px;">我们相爱 ${this.data.days} 天</h2>
                        <p style="color: #666; font-size: 14px;">每一天都更爱你一点 ❤️</p>
                    </div>
                    
                    <div class="couples-features">
                        <div class="couples-feature" data-action="memories">
                            <i class="fas fa-images"></i>
                            <span>恋爱记忆</span>
                        </div>
                        <div class="couples-feature" data-action="tasks">
                            <i class="fas fa-tasks"></i>
                            <span>情侣任务</span>
                        </div>
                        <div class="couples-feature" data-action="message">
                            <i class="fas fa-envelope"></i>
                            <span>悄悄话</span>
                        </div>
                        <div class="couples-feature" data-action="anniversary">
                            <i class="fas fa-calendar-heart"></i>
                            <span>纪念日</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const feature = e.target.closest('.couples-feature');
            if (feature) {
                const action = feature.dataset.action;
                this.handleFeatureAction(action);
            }
            
            if (e.target.closest('#couples-settings')) {
                this.showSettingsModal();
            }
        });
    },
    
    handleFeatureAction(action) {
        switch(action) {
            case 'memories':
                this.showMemoriesModal();
                break;
            case 'tasks':
                this.showTasksModal();
                break;
            case 'message':
                this.showMessageModal();
                break;
            case 'anniversary':
                this.showAnniversaryModal();
                break;
        }
    },
    
    showSettingsModal() {
        const modalId = 'couples-settings-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = modalId;
            modal.innerHTML = `
                <div class="modal-content">
                    <h3 class="modal-title">情侣空间设置</h3>
                    <form id="couples-settings-form">
                        <div class="form-group">
                            <label class="form-label">伴侣昵称</label>
                            <input type="text" class="form-input" id="partner-name" value="${this.data.partnerName}" placeholder="输入伴侣昵称">
                        </div>
                        <div class="form-group">
                            <label class="form-label">恋爱天数</label>
                            <input type="number" class="form-input" id="love-days" value="${this.data.days}" min="1">
                        </div>
                        <div class="button-group">
                            <button type="button" class="btn btn-secondary" id="cancel-couples-settings">取消</button>
                            <button type="submit" class="btn btn-primary">保存设置</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById('modals-container').appendChild(modal);
            
            modal.querySelector('#cancel-couples-settings').addEventListener('click', () => {
                modal.classList.remove('active');
            });
            
            modal.querySelector('#couples-settings-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateSettings();
                modal.classList.remove('active');
            });
        }
        
        modal.classList.add('active');
    },
    
    updateSettings() {
        const name = document.getElementById('partner-name').value;
        const days = parseInt(document.getElementById('love-days').value);
        
        this.data.partnerName = name || 'TA';
        this.data.days = days || 1;
        
        this.saveData();
        this.updateDisplay();
        Utils.showNotification('设置已更新');
    },
    
    updateDisplay() {
        const partnerAvatar = document.querySelector('.couple-avatar:last-child span');
        if (partnerAvatar) {
            partnerAvatar.textContent = this.data.partnerName.charAt(0);
        }
        
        const daysDisplay = document.querySelector('.couples-header h2');
        if (daysDisplay) {
            daysDisplay.textContent = `我们相爱 ${this.data.days} 天`;
        }
    },
    
    showMemoriesModal() {
        Utils.showNotification('恋爱记忆功能开发中');
    },
    
    showTasksModal() {
        Utils.showNotification('情侣任务功能开发中');
    },
    
    showMessageModal() {
        Utils.showNotification('悄悄话功能开发中');
    },
    
    showAnniversaryModal() {
        Utils.showNotification('纪念日功能开发中');
    },
    
    saveData() {
        Utils.saveToLocalStorage('couplesData', this.data);
    },
    
    loadData() {
        const saved = Utils.loadFromLocalStorage('couplesData');
        if (saved) this.data = saved;
    }
};
