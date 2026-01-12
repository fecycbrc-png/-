// 调试工具
const Debug = {
    init() {
        console.log('=== 小手机应用调试模式 ===');
        
        // 添加调试按钮到页面
        this.addDebugPanel();
        
        // 监听所有点击事件
        this.logAllClicks();
        
        // 检查元素
        this.checkElements();
    },
    
    addDebugPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 9999;
            max-width: 300px;
        `;
        panel.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>调试面板</strong></div>
            <button onclick="Debug.testClick()" style="background: #4a6cf7; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin: 2px; cursor: pointer;">测试点击</button>
            <button onclick="Debug.showAllPages()" style="background: #5cd85a; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin: 2px; cursor: pointer;">显示所有页面</button>
            <button onclick="Debug.goHome()" style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin: 2px; cursor: pointer;">返回首页</button>
            <div id="debug-info" style="margin-top: 10px;"></div>
        `;
        document.body.appendChild(panel);
    },
    
    testClick() {
        console.log('=== 测试点击功能 ===');
        
        // 测试打开设置应用
        App.openApp('settings');
        
        // 检查是否成功
        setTimeout(() => {
            const settingsPage = document.getElementById('settings-page');
            if (settingsPage && settingsPage.classList.contains('active')) {
                console.log('✓ 测试成功：设置页面已打开');
                Utils.showNotification('测试成功：设置页面已打开');
            } else {
                console.error('✗ 测试失败：设置页面未打开');
                Utils.showNotification('测试失败：请检查控制台');
            }
        }, 500);
    },
    
    showAllPages() {
        const pages = document.querySelectorAll('.app-page');
        console.log(`找到 ${pages.length} 个应用页面:`);
        
        pages.forEach((page, index) => {
            const pageId = page.id.replace('-page', '');
            const isActive = page.classList.contains('active');
            console.log(`${index + 1}. ${pageId} - 激活: ${isActive} - 显示: ${page.style.display}`);
        });
    },
    
    logAllClicks() {
        document.addEventListener('click', (e) => {
            console.log('点击事件:', {
                target: e.target.tagName,
                className: e.target.className,
                id: e.target.id,
                dataset: e.target.dataset
            });
        }, true);
    },
    
    checkElements() {
        console.log('=== 元素检查 ===');
        
        const checks = [
            { id: 'app-grid', name: '应用网格' },
            { id: 'app-pages-container', name: '页面容器' },
            { id: 'settings-page', name: '设置页面' },
            { id: 'chat-page', name: '聊天页面' },
            { id: 'worldbook-page', name: '世界书页面' }
        ];
        
        checks.forEach(check => {
            const element = document.getElementById(check.id);
            console.log(`${check.name}: ${element ? '找到 ✓' : '未找到 ✗'}`);
        });
    }
};

// 添加到全局
window.Debug = Debug;

// 启动调试模式（开发时使用）
// document.addEventListener('DOMContentLoaded', () => {
//     Debug.init();
// });
