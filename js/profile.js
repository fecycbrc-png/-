const Profile = {
    data: {
        name: '用户',
        avatar: '',
        balance: 1000,
        familyCards: []
    },
    
    init() {
        this.loadData();
        this.setupEventListeners();
    },
    
    createPage() {
        return `
            <div class="app-page" id="profile-page">
                <div class="profile-header">
                    <div class="profile-avatar" id="profile-avatar" style="background-color: #4a6cf7;">
                        <span style="color: white; display: flex; align-items: center; justify-content: center; height: 100%; font-size: 36px;">${this.data.name.charAt(0)}</span>
                    </div>
                    <div class="profile-name" id="profile-name">${this.data.name}</div>
                    <div class="profile-id">ID: user_${Date.now().toString(36)}</div>
                </div>
                <div class="profile-menu">
                    <div class="profile-item" data-action="wallet">
                        <i class="fas fa-wallet"></i>
                        <div class="profile-item-content">
                            <div class="profile-item-title">钱包</div>
                            <div class="profile-item-desc">余额：¥${this.data.balance.toFixed(2)}</div>
                        </div>
                        <div class="profile-item-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="profile-item" data-action="family-cards">
                        <i class="fas fa-credit-card"></i>
                        <div class="profile-item-content">
                            <div class="profile-item-title">亲属卡</div>
                            <div class="profile-item-desc">已绑定 ${this.data.familyCards.length} 张</div>
                        </div>
                        <div class="profile-item-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="profile-item" data-action="settings">
                        <i class="fas fa-cog"></i>
                        <div class="profile-item-content">
                            <div class="profile-item-title">设置</div>
                            <div class="profile-item-desc">账号与安全</div>
                        </div>
                        <div class="profile-item-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    createWalletPage() {
        return `
            <div class="app-page" id="wallet-page">
                <div class="app-header">
                    <button class="back-button" data-back="profile">
                        <i class="fas fa-chevron-left"></i>
                        <span>返回</span>
                    </button>
                    <div class="page-title">钱包</div>
                    <button class="action-button" id="wallet-more">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                <div class="wallet-balance">
                    <div class="balance-title">当前余额</div>
                    <div class="balance-amount">¥${this.data.balance.toFixed(2)}</div>
                    <button class="btn btn-primary" id="recharge-btn">充值</button>
                </div>
                <div class="wallet-actions">
                    <div class="wallet-action" data-action="transfer">
                        <i class="fas fa-exchange-alt"></i>
                        <span>转账</span>
                    </div>
                    <div class="wallet-action" data-action="withdraw">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>提现</span>
                    </div>
                    <div class="wallet-action" data-action="family-card">
                        <i class="fas fa-credit-card"></i>
                        <span>亲属卡</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const profileItem = e.target.closest('.profile-item');
            if (profileItem) {
                const action = profileItem.dataset.action;
                this.handleProfileAction(action);
            }
            
            const walletAction = e.target.closest('.wallet-action');
            if (walletAction) {
                const action = walletAction.dataset.action;
                this.handleWalletAction(action);
            }
            
            if (e.target.id === 'recharge-btn') {
                this.showRechargeModal();
            }
        });
    },
    
    handleProfileAction(action) {
        switch(action) {
            case 'wallet':
                document.getElementById('profile-page').classList.remove('active');
                document.getElementById('wallet-page').classList.add('active');
                break;
            case 'family-cards':
                this.showFamilyCardsModal();
                break;
            case 'settings':
                App.openApp('settings');
                break;
        }
    },
    
    handleWalletAction(action) {
        switch(action) {
            case 'transfer':
                Utils.showNotification('转账功能开发中');
                break;
            case 'withdraw':
                Utils.showNotification('提现功能开发中');
                break;
            case 'family-card':
                this.showAddFamilyCardModal();
                break;
        }
    },
    
    showRechargeModal() {
        const modalId = 'recharge-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = modalId;
            modal.innerHTML = `
                <div class="modal-content">
                    <h3 class="modal-title">充值</h3>
                    <form id="recharge-form">
                        <div class="form-group">
                            <label class="form-label">充值金额</label>
                            <input type="number" class="form-input" id="recharge-amount" placeholder="输入充值金额" min="1" max="10000" required>
                        </div>
                        <div class="button-group">
                            <button type="button" class="btn btn-secondary" id="cancel-recharge">取消</button>
                            <button type="submit" class="btn btn-primary">确认充值</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById('modals-container').appendChild(modal);
            
            modal.querySelector('#cancel-recharge').addEventListener('click', () => {
                modal.classList.remove('active');
            });
            
            modal.querySelector('#recharge-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const amount = parseFloat(document.getElementById('recharge-amount').value);
                this.recharge(amount);
                modal.classList.remove('active');
            });
        }
        
        modal.classList.add('active');
    },
    
    recharge(amount) {
        this.data.balance += amount;
        this.saveData();
        this.updateBalanceDisplay();
        Utils.showNotification(`充值成功！¥${amount.toFixed(2)}`);
    },
    
    showAddFamilyCardModal() {
        Utils.showNotification('亲属卡功能开发中');
    },
    
    updateBalanceDisplay() {
        const balanceAmount = document.querySelector('.balance-amount');
        if (balanceAmount) {
            balanceAmount.textContent = `¥${this.data.balance.toFixed(2)}`;
        }
    },
    
    saveData() {
        Utils.saveToLocalStorage('profileData', this.data);
    },
    
    loadData() {
        const saved = Utils.loadFromLocalStorage('profileData');
        if (saved) this.data = saved;
    }
};
