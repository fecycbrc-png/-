const WorldBook = {
    data: [],
    currentView: 'list', // list 或 detail
    
    init() {
        this.loadData();
        this.setupEventListeners();
    },
    
    createPage() {
        return `
            <div class="app-page" id="worldbook-page">
                <div class="app-header">
                    <button class="back-button" data-back="home">
                        <i class="fas fa-chevron-left"></i>
                        <span>返回</span>
                    </button>
                    <div class="page-title">世界书</div>
                    <button class="action-button" id="add-worldbook">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div id="worldbook-content">
                    <div class="worldbook-list" id="worldbook-list"></div>
                    <div class="worldbook-detail" id="worldbook-detail" style="display: none;"></div>
                </div>
            </div>
        `;
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#add-worldbook')) {
                this.showAddBookModal();
            }
            
            const bookItem = e.target.closest('.worldbook-item-simple');
            if (bookItem) {
                const bookId = parseInt(bookItem.dataset.bookId);
                this.showBookDetail(bookId);
            }
            
            if (e.target.closest('#back-to-list')) {
                this.backToList();
            }
        });
    },
    
    showAddBookModal() {
        const modalId = 'add-worldbook-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = modalId;
            modal.innerHTML = `
                <div class="modal-content">
                    <h3 class="modal-title">创建世界书</h3>
                    <form id="worldbook-form">
                        <div class="form-group">
                            <label class="form-label">书名</label>
                            <input type="text" class="form-input" id="worldbook-name" placeholder="输入世界书名称" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">内容</label>
                            <textarea class="form-textarea" id="worldbook-content" placeholder="输入世界书内容..." required></textarea>
                        </div>
                        <div class="button-group">
                            <button type="button" class="btn btn-secondary" id="cancel-worldbook">取消</button>
                            <button type="submit" class="btn btn-primary">创建</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById('modals-container').appendChild(modal);
            
            modal.querySelector('#cancel-worldbook').addEventListener('click', () => {
                modal.classList.remove('active');
            });
            
            modal.querySelector('#worldbook-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.addBook();
                modal.classList.remove('active');
            });
        }
        
        modal.classList.add('active');
    },
    
    addBook() {
        const name = document.getElementById('worldbook-name').value;
        const content = document.getElementById('worldbook-content').value;
        
        const book = {
            id: Date.now(),
            name,
            content,
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString()
        };
        
        this.data.push(book);
        this.saveData();
        this.renderList();
        Utils.showNotification(`世界书"${name}"创建成功！`);
    },
    
    showBookDetail(bookId) {
        const book = this.data.find(b => b.id === bookId);
        if (!book) return;
        
        const list = document.getElementById('worldbook-list');
        const detail = document.getElementById('worldbook-detail');
        
        if (list) list.style.display = 'none';
        if (detail) {
            detail.style.display = 'block';
            detail.innerHTML = `
                <div class="app-header">
                    <button class="back-button" id="back-to-list">
                        <i class="fas fa-chevron-left"></i>
                        <span>返回</span>
                    </button>
                    <div class="page-title">${book.name}</div>
                    <div></div>
                </div>
                <div style="padding: 20px;">
                    <div style="font-size: 12px; color: #999; margin-bottom: 20px;">
                        创建于：${book.createdAt}<br>
                        更新于：${book.updatedAt}
                    </div>
                    <div style="font-size: 16px; line-height: 1.6; color: #333;">
                        ${book.content}
                    </div>
                </div>
            `;
        }
        
        this.currentView = 'detail';
    },
    
    backToList() {
        const list = document.getElementById('worldbook-list');
        const detail = document.getElementById('worldbook-detail');
        
        if (list) list.style.display = 'block';
        if (detail) detail.style.display = 'none';
        
        this.currentView = 'list';
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
            <div class="worldbook-item-simple" data-book-id="${book.id}">
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
        this.data = Utils.loadFromLocalStorage('worldbookData') || [];
        this.renderList();
    }
};
