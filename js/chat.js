const Chat = {
    data: {
        currentTab: 'chats'
    },
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.createTabs();
    },
    
    createPage() {
        return `
            <div class="app-page" id="chat-page">
                <div class="app-header">
                    <button class="back-button" data-back="home">
                        <i class="fas fa-chevron-left"></i>
                        <span>返回</span>
                    </button>
                    <div class="page-title" id="chat-title">聊天</div>
                    <button class="action-button" id="chat-search">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                
                <div id="chat-content">
                    <!-- 聊天列表 -->
                    <div class="chat-tabs" id="chat-tabs" style="${this.data.currentTab === 'chats' ? '' : 'display: none;'}">
                        <div class="chat-list" id="chat-conversations">
                            <div style="text-align: center; padding: 40px; color: #999;">
                                <i class="fas fa-comments" style="font-size: 48px; margin-bottom: 20px;"></i>
                                <p>还没有聊天记录</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 朋友圈 -->
                    <div class="moments-tab" id="moments-tab" style="${this.data.currentTab === 'moments' ? '' : 'display: none;'}">
                        ${Moments ? Moments.createMomentsContent() : '朋友圈加载中...'}
                    </div>
                    
                    <!-- 我的页面 -->
                    <div class="profile-tab" id="profile-tab" style="${this.data.currentTab === 'profile' ? '' : 'display: none;'}">
                        ${Profile ? Profile.createProfileContent() : '个人资料加载中...'}
                    </div>
                </div>
                
                <div class="chat-tab-bar">
                    <div class="chat-tab-item ${this.data.currentTab === 'chats' ? 'active' : ''}" data-tab="chats">
                        <i class="fas fa-comments"></i>
                        <span>聊天</span>
                    </div>
                    <div class="chat-tab-item ${this.data.currentTab === 'moments' ? 'active' : ''}" data-tab="moments">
                        <i class="fas fa-camera"></i>
                        <span>朋友圈</span>
                    </div>
                    <div class="chat-tab-item ${this.data.currentTab === 'profile' ? 'active' : ''}" data-tab="profile">
                        <i class="fas fa-user"></i>
                        <span>我</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    createTabs() {
        // 确保朋友圈和我的内容能正常显示
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const tabItem = e.target.closest('.chat-tab-item');
            if (tabItem) {
                const tab = tabItem.dataset.tab;
                this.switchTab(tab);
            }
            
            if (e.target.closest('#chat-search')) {
                Utils.showNotification('搜索功能开发中');
            }
        });
    },
    
    switchTab(tab) {
        this.data.currentTab = tab;
        
        // 更新标题
        const titleMap = {
            'chats': '聊天',
            'moments': '朋友圈',
            'profile': '我'
        };
        
        const title = document.getElementById('chat-title');
        if (title) title.textContent = titleMap[tab];
        
        // 显示对应内容
        const tabs = ['chats', 'moments', 'profile'];
        tabs.forEach(t => {
            const element = document.getElementById(`${t}-tab`);
            if (element) {
                element.style.display = t === tab ? 'block' : 'none';
            }
        });
        
        // 更新底部导航激活状态
        document.querySelectorAll('.chat-tab-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tab);
        });
        
        this.saveData();
    },
    
    saveData() {
        Utils.saveToLocalStorage('chatData', this.data);
    },
    
    loadData() {
        const saved = Utils.loadFromLocalStorage('chatData');
        if (saved) this.data = saved;
    }
};
