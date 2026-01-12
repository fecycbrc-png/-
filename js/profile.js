const Profile = {
    data: {
        name: '用户',
        avatar: '',
        balance: 1000,
        familyCards: []
    },
    
    init() {
        this.loadData();
    },
    
    createPage() {
        // 这个页面不再需要，因为在聊天里面
        return '';
    },
    
    createProfileContent() {
        return `
            <div class="profile-page">
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
        // 这个页面单独存在，用于从个人资料进入
        return `
            <div class="app-page" id="wallet-page">
                <div class="app-header">
                    <button class="back-button" data-back="chat">
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
    
    loadData() {
        const saved = Utils.loadFromLocalStorage('profileData');
        if (saved) this.data = saved;
    }
};
