const Moments = {
    data: [],
    
    init() {
        this.loadData();
        this.setupEventListeners();
    },
    
    createPage() {
        return `
            <div class="app-page" id="moments-page">
                <div class="app-header">
                    <button class="back-button" data-back="home">
                        <i class="fas fa-chevron-left"></i>
                        <span>返回</span>
                    </button>
                    <div class="page-title">朋友圈</div>
                    <button class="action-button" id="add-moment">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="moments-list" id="moments-list"></div>
            </div>
        `;
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#add-moment')) {
                this.showAddMomentModal();
            }
        });
    },
    
    showAddMomentModal() {
        const modalId = 'add-moment-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = modalId;
            modal.innerHTML = `
                <div class="modal-content">
                    <h3 class="modal-title">发布朋友圈</h3>
                    <form id="moment-form">
                        <div class="form-group">
                            <label class="form-label">内容</label>
                            <textarea class="form-textarea" id="moment-content" placeholder="分享你的动态..." required></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">添加图片（最多9张）</label>
                            <div class="file-upload-container" id="moment-images-upload">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <div class="file-upload-text">点击上传图片</div>
                                <input type="file" accept="image/*" multiple style="display: none;">
                            </div>
                        </div>
                        <div class="button-group">
                            <button type="button" class="btn btn-secondary" id="cancel-moment">取消</button>
                            <button type="submit" class="btn btn-primary">发布</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById('modals-container').appendChild(modal);
            
            modal.querySelector('#cancel-moment').addEventListener('click', () => {
                modal.classList.remove('active');
            });
            
            modal.querySelector('#moment-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.addMoment();
                modal.classList.remove('active');
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }
        
        modal.classList.add('active');
    },
    
    addMoment() {
        const content = document.getElementById('moment-content').value;
        const moment = {
            id: Date.now(),
            content,
            time: new Date().toLocaleString(),
            likes: 0,
            comments: []
        };
        
        this.data.unshift(moment);
        this.saveData();
        this.render();
        Utils.showNotification('发布成功！');
    },
    
    render() {
        const list = document.getElementById('moments-list');
        if (!list) return;
        
        if (this.data.length === 0) {
            list.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-camera" style="font-size: 48px; margin-bottom: 20px;"></i>
                    <p>还没有动态，点击右上角+号发布第一条朋友圈</p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = this.data.map(moment => `
            <div class="moment-item">
                <div class="moment-header">
                    <div class="moment-avatar" style="background-color: #4a6cf7;">
                        <span style="color: white; display: flex; align-items: center; justify-content: center; height: 100%;">ME</span>
                    </div>
                    <div class="moment-info">
                        <div class="moment-name">我</div>
                        <div class="moment-time">${moment.time}</div>
                    </div>
                </div>
                <div class="moment-content">${moment.content}</div>
                <div class="moment-actions">
                    <button class="like-btn" data-id="${moment.id}">
                        <i class="far fa-heart"></i> ${moment.likes}
                    </button>
                    <button class="comment-btn" data-id="${moment.id}">
                        <i class="far fa-comment"></i> ${moment.comments.length}
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    saveData() {
        Utils.saveToLocalStorage('momentsData', this.data);
    },
    
    loadData() {
        this.data = Utils.loadFromLocalStorage('momentsData') || [];
        this.render();
    }
};
