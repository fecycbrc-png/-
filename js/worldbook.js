const WorldBook = {
    data: [],
    currentView: 'list',
    
    init() {
        console.log('世界书模块初始化');
        this.loadData();
        this.setupEventListeners();
    },
    
    createPage() {
        console.log('创建世界书页面');
        return `
            <div class="app-page" id="worldbook-page">
                <div class="app-header">
                    <button class="back-button" data-back="home">
                        <i class="fas fa-chevron-left"></i>
                        <span>返回</span>
                    </button>
                    <div class="page-title">世界书</div>
                    <button class="action-button" id="add-worldbook-btn">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div id="worldbook-content">
                    <div class="worldbook-list" id="worldbook-list"></div>
                </div>
            </div>
        `;
    },
    
    setupEventListeners() {
        // 使用事件委托，因为按钮是动态创建的
        document.addEventListener('click', (e) => {
            if (e.target.closest('#add-worldbook-btn')) {
                console.log('点击添加世界书按钮');
                this.showAddBookModal();
                e.stopPropagation();
            }
            
            const bookItem = e.target.closest('.worldbook-item-simple');
            if (bookItem) {
                const bookId = parseInt(bookItem.dataset.bookId);
                console.log(`点击世界书: ${bookId}`);
                this.showBookDetail(bookId);
                e.stopPropagation();
            }
            
            if (e.target.closest('#back-to-list-btn')) {
                console.log('点击返回列表按钮');
                this.backToList();
                e.stopPropagation();
            }
        });
    },
    
    showAddBookModal() {
        console.log('显示添加世界书模态框');
        Utils.showNotification('创建世界书功能');
    },
    
    showBookDetail(bookId) {
        const book = this.data.find(b => b.id === bookId);
        if (!book) return;
        
        const list = document.getElementById('worldbook-list');
        list.innerHTML = `
            <div style="padding: 20px;">
                <button id="back-to-list-btn" style="margin-bottom: 20px; background: #4a6cf7; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer;">
                    <i class="fas fa-arrow-left"></i> 返回列表
                </button>
                <h2 style="color: #333; margin-bottom: 15px;">${book.name}</h2>
                <div style="font-size: 12px; color: #999; margin-bottom: 20px;">
                    创建于：${book.createdAt}
                </div>
                <div style="font-size: 16px; line-height: 1.6; color: #333; background: white; padding: 20px; border-radius: 10px;">
                    ${book.content}
                </div>
            </div>
        `;
    },
    
    backToList() {
        this.renderList();
    },
    
    renderList() {
        const list = document.getElementById('worldbook-list');
        if (!list) return;
        
        if (this.data.length === 0) {
            list.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-book-open" style="font-size: 48px; margin-bottom: 20px;"></i>
                    <p>还没有世界书，点击右上角+号创建</p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = this.data.map(book => `
            <div class="worldbook-item-simple" data-book-id="${book.id}" style="cursor: pointer;">
                <div class="worldbook-title-simple">${book.name}</div>
                <div class="worldbook-meta">
                    <span>${book.createdAt}</span>
                    <span>${book.content.length}字</span>
                </div>
            </div>
        `).join('');
    },
    
    saveData() {
        Utils.saveToLocalStorage('worldbookData', this.data);
    },
    
    loadData() {
        this.data = Utils.loadFromLocalStorage('worldbookData') || [
            {
                id: 1,
                name: '示例世界书',
                content: '这是一个示例世界书的内容，点击标题可以查看详情。',
                createdAt: '2024-01-01 12:00'
            }
        ];
        this.renderList();
    }
};
