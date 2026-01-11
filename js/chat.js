const Chat = {
    data: {
        currentTab: 'chats',
        conversations: [],
        contacts: []
    },
    
    init() {
        this.loadData();
        this.setupEventListeners();
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
                    <div class="chat-tabs" id="chat-tabs" style="${this.data.currentTab === 'chats' ? '' : 'display: none;'}">
                        <div class="chat-list" id="chat-conversations"></div>
                    </div>
                    
                    <div class="moments-tab" id="moments-tab" style="${this.data.currentTab === 'moments' ? '' : 'display: none;'}">
                        <!-- 朋友圈内容 -->
                    </div>
                    
                    <div class="profile-tab" id="profile-tab" style="${this.data.currentTab === 'profile' ? '' : 'display: none;'}">
                        <!-- 个人资料内容 -->
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
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const tabItem = e.target.closest('.chat-tab-item');
            if (tabItem) {
                const tab = tabItem.dataset.tab;
                this.switchTab(tab);
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
        
        // 保存当前标签状态
        this.saveData();
        
        // 特殊处理：显示小组件
        if (tab === 'chats') {
            document.getElementById('widget-container').style.display = 'block';
        }
    },
    
    saveData() {
        Utils.saveToLocalStorage('chatData', this.data);
    },
    
    loadData() {
        const saved = Utils.loadFromLocalStorage('chatData');
        if (saved) this.data = saved;
    }
};
