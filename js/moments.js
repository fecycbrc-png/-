const Moments = {
    data: [],
    
    init() {
        this.loadData();
    },
    
    createPage() {
        // 这个页面不再需要，因为朋友圈在聊天里面
        return '';
    },
    
    createMomentsContent() {
        return `
            <div class="moments-list" id="moments-list">
                <div style="text-align: center; padding: 20px;">
                    <button class="btn btn-primary" id="add-moment-btn" style="width: 100%; margin-bottom: 20px;">
                        <i class="fas fa-plus"></i> 发布朋友圈
                    </button>
                </div>
                ${this.renderMoments()}
            </div>
        `;
    },
    
    renderMoments() {
        if (this.data.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-camera" style="font-size: 48px; margin-bottom: 20px;"></i>
                    <p>还没有动态，点击发布按钮创建第一条朋友圈</p>
                </div>
            `;
        }
        
        return this.data.map(moment => `
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
            </div>
        `).join('');
    },
    
    loadData() {
        this.data = Utils.loadFromLocalStorage('momentsData') || [];
    }
};
