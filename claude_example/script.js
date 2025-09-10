// 页面跳转功能
function goHome() {
    window.location.href = 'index.html';
}

function goToVideo(videoId) {
    window.location.href = `video.html?id=${videoId}`;
}

// 首页视频卡片点击事件
document.addEventListener('DOMContentLoaded', function() {
    // 如果是首页，添加视频卡片点击事件
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoId = this.getAttribute('data-id');
            goToVideo(videoId);
        });
    });

    // 如果是视频详情页，根据URL参数显示对应视频信息
    if (window.location.pathname.includes('video.html')) {
        loadVideoDetails();
    }

    // 添加交互功能
    addInteractivity();
});

// 加载视频详情
function loadVideoDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    
    // 模拟视频数据
    const videoData = {
        '1': {
            title: '【技术分享】前端开发实战教程 - React从入门到精通',
            author: '程序员小明',
            views: '12.5万',
            uploadTime: '2024-03-15'
        },
        '2': {
            title: '【音乐MV】超燃BGM混剪，听完热血沸腾！',
            author: '音乐达人',
            views: '86.2万',
            uploadTime: '2024-03-10'
        },
        '3': {
            title: '【游戏实况】原神新角色深度测评，值得抽取吗？',
            author: '游戏解说员',
            views: '45.8万',
            uploadTime: '2024-03-12'
        },
        '4': {
            title: '【美食制作】手把手教你做网红奶茶，在家也能开奶茶店',
            author: '美食家小厨',
            views: '32.1万',
            uploadTime: '2024-03-14'
        },
        '5': {
            title: '【科普知识】宇宙中最神秘的黑洞，带你了解时空的奥秘',
            author: '科学探索者',
            views: '78.3万',
            uploadTime: '2024-03-08'
        },
        '6': {
            title: '【舞蹈cover】最新热门舞蹈教学，简单易学超好看',
            author: '舞蹈小仙女',
            views: '156.7万',
            uploadTime: '2024-03-13'
        }
    };

    if (videoId && videoData[videoId]) {
        const video = videoData[videoId];
        
        // 更新页面标题
        document.title = video.title + ' - 哔哩哔哩';
        
        // 更新视频标题
        const titleElement = document.getElementById('videoTitle');
        if (titleElement) {
            titleElement.textContent = video.title;
        }
        
        // 更新UP主名称
        const uploaderNameElement = document.getElementById('uploaderName');
        if (uploaderNameElement) {
            uploaderNameElement.textContent = video.author;
        }
        
        // 更新播放数据
        const viewCount = document.querySelector('.view-count');
        const uploadTime = document.querySelector('.upload-time');
        if (viewCount) viewCount.textContent = video.views + '播放';
        if (uploadTime) uploadTime.textContent = video.uploadTime + ' 发布';
    }
}

// 添加交互功能
function addInteractivity() {
    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                alert(`搜索功能暂未实现，您搜索的内容是：${query}`);
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    alert(`搜索功能暂未实现，您搜索的内容是：${query}`);
                }
            }
        });
    }

    // 分类导航点击
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有活跃状态
            categoryItems.forEach(cat => cat.classList.remove('active'));
            // 添加当前活跃状态
            this.classList.add('active');
            
            const category = this.textContent;
            if (category !== '首页') {
                alert(`${category} 分类功能暂未实现`);
            }
        });
    });

    // 视频详情页交互
    if (window.location.pathname.includes('video.html')) {
        addVideoPageInteractivity();
        addDescriptionToggle();
    }

    // 登录注册按钮
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            alert('登录功能暂未实现');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            alert('注册功能暂未实现');
        });
    }
}

// 视频详情页交互功能
function addVideoPageInteractivity() {
    // 视频播放按钮
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', function() {
            alert('视频播放功能暂未实现');
        });
    }

    // 操作按钮（点赞、投币、收藏、分享）
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionText = this.querySelector('.text').textContent;
            
            if (btn.classList.contains('like-btn')) {
                btn.classList.toggle('liked');
                const icon = btn.querySelector('.icon');
                const text = btn.querySelector('.text');
                if (btn.classList.contains('liked')) {
                    icon.textContent = '👍';
                    text.textContent = '已点赞 2.1万';
                } else {
                    icon.textContent = '👍';
                    text.textContent = '点赞 2.1万';
                }
            } else {
                alert(`${actionText} 功能暂未实现`);
            }
        });
    });

    // 关注按钮
    const followBtn = document.querySelector('.follow-btn');
    if (followBtn) {
        followBtn.addEventListener('click', function() {
            if (this.textContent === '+ 关注') {
                this.textContent = '已关注';
                this.style.background = '#999';
            } else {
                this.textContent = '+ 关注';
                this.style.background = '#00aeec';
            }
        });
    }

    // 评论提交
    const commentSubmit = document.querySelector('.comment-submit');
    const commentInput = document.querySelector('.comment-input .comment-text');
    
    if (commentSubmit) {
        commentSubmit.addEventListener('click', function() {
            const commentText = commentInput.value.trim();
            if (commentText) {
                alert(`评论功能暂未实现，您的评论内容：${commentText}`);
                commentInput.value = '';
            } else {
                alert('请输入评论内容');
            }
        });
    }

    if (commentInput) {
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const commentText = this.value.trim();
                if (commentText) {
                    alert(`评论功能暂未实现，您的评论内容：${commentText}`);
                    this.value = '';
                } else {
                    alert('请输入评论内容');
                }
            }
        });
    }

    // 评论点赞和回复
    const commentLikes = document.querySelectorAll('.comment-like');
    const commentReplies = document.querySelectorAll('.comment-reply');
    
    commentLikes.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentCount = parseInt(this.textContent.match(/\d+/)[0]);
            const newCount = this.classList.contains('liked') ? currentCount - 1 : currentCount + 1;
            this.textContent = `👍 ${newCount}`;
            this.classList.toggle('liked');
            
            if (this.classList.contains('liked')) {
                this.style.color = '#00aeec';
            } else {
                this.style.color = '#666';
            }
        });
    });
    
    commentReplies.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('回复功能暂未实现');
        });
    });

    // 推荐视频点击
    const recommendItems = document.querySelectorAll('.recommend-item');
    recommendItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.recommend-title-text').textContent;
            alert(`推荐视频点击功能暂未实现，视频：${title}`);
        });
    });
}

// 工具函数：格式化数字
function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
}

// 视频描述展开/收起功能
function addDescriptionToggle() {
    const descriptionContent = document.getElementById('descriptionContent');
    const descriptionToggle = document.getElementById('descriptionToggle');
    const toggleText = descriptionToggle.querySelector('.toggle-text');
    
    if (descriptionToggle && descriptionContent) {
        descriptionToggle.addEventListener('click', function() {
            const isCollapsed = descriptionContent.classList.contains('collapsed');
            
            if (isCollapsed) {
                // 展开
                descriptionContent.classList.remove('collapsed');
                descriptionContent.classList.add('expanded');
                toggleText.textContent = '收起';
                descriptionToggle.classList.add('expanded');
            } else {
                // 收起
                descriptionContent.classList.remove('expanded');
                descriptionContent.classList.add('collapsed');
                toggleText.textContent = '展开';
                descriptionToggle.classList.remove('expanded');
            }
        });
    }
}

// 工具函数：格式化数字
function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
}

// 工具函数：格式化时间
function formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);
    
    if (diff < 60) {
        return '刚刚';
    } else if (diff < 3600) {
        return Math.floor(diff / 60) + '分钟前';
    } else if (diff < 86400) {
        return Math.floor(diff / 3600) + '小时前';
    } else if (diff < 2592000) {
        return Math.floor(diff / 86400) + '天前';
    } else {
        return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
    }
}