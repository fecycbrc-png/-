const Utils = {
    showNotification(message, duration = 3000) {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.classList.add('active');
        
        setTimeout(() => {
            notification.classList.remove('active');
        }, duration);
    },
    
    formatDateTime(date = new Date()) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
        
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const period = hours < 12 ? '上午' : '下午';
        const displayHours = hours > 12 ? hours - 12 : hours;
        
        return {
            date: `${year}年${month}月${day}日 ${weekDay}`,
            time: `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`,
            statusTime: `${period} ${displayHours}:${minutes}`
        };
    },
    
    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) reject(new Error('没有选择文件'));
            if (file.size > 5 * 1024 * 1024) reject(new Error('文件大小不能超过5MB'));
            
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('读取文件失败'));
            reader.readAsDataURL(file);
        });
    },
    
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存失败:', error);
            this.showNotification('保存失败，存储空间可能已满');
            return false;
        }
    },
    
    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('读取失败:', error);
            return null;
        }
    }
};
