// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 搜索功能
    initSearch();
    
    // 标签页切换
    initTabs();
    
    // 视频卡片交互
    initVideoCards();
    
    // 导航菜单交互
    initNavigation();
    
    // 页面滚动优化
    initScrollOptimization();
});

// 搜索功能初始化
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    // 搜索框聚焦效果
    searchInput.addEventListener('focus', function() {
        this.placeholder = '搜索你感兴趣的内容...';
    });
    
    searchInput.addEventListener('blur', function() {
        if (!this.value) {
            this.placeholder = '大家都在搜：优质内容推荐';
        }
    });
    
    // 搜索按钮点击事件
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            performSearch(searchTerm);
        }
    });
    
    // 回车搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                performSearch(searchTerm);
            }
        }
    });
}

// 执行搜索
function performSearch(searchTerm) {
    console.log('搜索:', searchTerm);
    // 这里可以添加实际的搜索逻辑
    alert(`搜索内容: ${searchTerm}`);
}

// 标签页切换功能
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有活动状态
            tabs.forEach(t => t.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            
            // 这里可以添加切换内容的逻辑
            const tabText = this.textContent;
            console.log('切换到标签页:', tabText);
            
            // 模拟加载不同内容
            loadTabContent(tabText);
        });
    });
}

// 加载标签页内容
function loadTabContent(tabName) {
    const videoGrid = document.querySelector('.video-grid');
    
    // 添加加载动画
    videoGrid.style.opacity = '0.5';
    
    setTimeout(() => {
        // 这里可以根据不同标签页加载不同内容
        videoGrid.style.opacity = '1';
        console.log(`已加载${tabName}内容`);
    }, 500);
}

// 视频卡片交互
function initVideoCards() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        // 鼠标悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = '#00AEEC';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = '#e7e7e7';
        });
        
        // 点击播放
        card.addEventListener('click', function() {
            const videoTitle = this.querySelector('.video-title').textContent;
            console.log('点击播放视频:', videoTitle);
            
            // 模拟视频播放
            playVideo(videoTitle);
        });
        
        // UP主头像点击
        const uploaderAvatar = card.querySelector('.uploader-avatar');
        if (uploaderAvatar) {
            uploaderAvatar.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止冒泡
                const uploaderName = card.querySelector('.uploader-name').textContent;
                console.log('访问UP主主页:', uploaderName);
                alert(`访问UP主: ${uploaderName}`);
            });
        }
    });
}

// 跳转到视频详情页
function playVideo(title) {
    // 保存视频标题到URL参数或localStorage
    const videoData = {
        title: title,
        timestamp: Date.now()
    };
    
    // 将视频信息保存到localStorage
    localStorage.setItem('currentVideo', JSON.stringify(videoData));
    
    // 跳转到视频详情页
    window.location.href = 'video.html';
}

// 导航菜单交互
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            
            const navText = this.querySelector('.nav-text').textContent;
            console.log('导航到:', navText);
            
            // 模拟页面切换
            switchPage(navText);
        });
    });
    
    // 用户头像点击
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', function() {
            showUserMenu();
        });
    }
    
    // 顶部导航项点击
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemText = this.textContent;
            console.log('点击导航项:', itemText);
            
            switch(itemText) {
                case '投稿':
                    alert('跳转到投稿页面');
                    break;
                case '消息':
                    alert('查看消息中心');
                    break;
                case '动态':
                    alert('查看动态');
                    break;
                case '收藏':
                    alert('查看收藏夹');
                    break;
                case '历史':
                    alert('查看观看历史');
                    break;
            }
        });
    });
}

// 页面切换
function switchPage(pageName) {
    const content = document.querySelector('.content');
    
    // 添加切换动画
    content.style.opacity = '0.5';
    
    setTimeout(() => {
        content.style.opacity = '1';
        console.log(`已切换到${pageName}页面`);
        
        // 这里可以加载不同页面的内容
        if (pageName !== '首页') {
            alert(`切换到${pageName}页面`);
        }
    }, 300);
}

// 显示用户菜单
function showUserMenu() {
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed;
        top: 64px;
        right: 20px;
        background: white;
        border: 1px solid #e7e7e7;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        padding: 12px 0;
        min-width: 150px;
        z-index: 1001;
    `;
    
    const menuItems = ['个人中心', '我的关注', '我的粉丝', '创作中心', '设置', '退出登录'];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.style.cssText = `
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            color: #666;
            transition: background-color 0.3s;
        `;
        menuItem.textContent = item;
        
        menuItem.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f0f9ff';
            this.style.color = '#00AEEC';
        });
        
        menuItem.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.color = '#666';
        });
        
        menuItem.addEventListener('click', function() {
            console.log('点击菜单项:', item);
            alert(`点击了: ${item}`);
            document.body.removeChild(menu);
        });
        
        menu.appendChild(menuItem);
    });
    
    document.body.appendChild(menu);
    
    // 点击其他地方关闭菜单
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                if (document.body.contains(menu)) {
                    document.body.removeChild(menu);
                }
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// 页面滚动优化
function initScrollOptimization() {
    let ticking = false;
    
    function updateOnScroll() {
        // 这里可以添加滚动时的优化逻辑
        // 比如懒加载、无限滚动等
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
