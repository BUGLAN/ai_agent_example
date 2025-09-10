// 视频页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 视频播放器功能
    const playButton = document.querySelector('.play-button');
    const videoWrapper = document.querySelector('.video-wrapper');
    const playPauseBtn = document.querySelector('.play-pause');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const timeDisplay = document.querySelector('.time');
    const volumeBtn = document.querySelector('.volume');
    const fullscreenBtn = document.querySelector('.fullscreen');
    
    // 模拟视频播放状态
    let isPlaying = false;
    let currentTime = 0;
    let duration = 754; // 12:34 in seconds
    let volume = 1;
    let isFullscreen = false;
    
    // 播放/暂停功能
    function togglePlay() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            playButton.style.display = 'none';
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            startVideoTimer();
        } else {
            playButton.style.display = 'flex';
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            stopVideoTimer();
        }
    }
    
    // 更新进度条
    function updateProgress() {
        const percentage = (currentTime / duration) * 100;
        progress.style.width = percentage + '%';
        
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.floor(duration % 60);
        
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} / ${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
    }
    
    // 视频计时器
    let videoTimer;
    
    function startVideoTimer() {
        videoTimer = setInterval(() => {
            if (currentTime < duration) {
                currentTime += 0.1;
                updateProgress();
            } else {
                togglePlay();
                currentTime = 0;
                updateProgress();
            }
        }, 100);
    }
    
    function stopVideoTimer() {
        clearInterval(videoTimer);
    }
    
    // 进度条点击
    progressBar.addEventListener('click', function(e) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        currentTime = duration * percentage;
        updateProgress();
    });
    
    // 音量控制
    volumeBtn.addEventListener('click', function() {
        if (volume > 0) {
            volume = 0;
            this.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            volume = 1;
            this.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });
    
    // 全屏控制
    fullscreenBtn.addEventListener('click', function() {
        if (!isFullscreen) {
            if (videoWrapper.requestFullscreen) {
                videoWrapper.requestFullscreen();
            } else if (videoWrapper.webkitRequestFullscreen) {
                videoWrapper.webkitRequestFullscreen();
            } else if (videoWrapper.msRequestFullscreen) {
                videoWrapper.msRequestFullscreen();
            }
            this.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.innerHTML = '<i class="fas fa-expand"></i>';
        }
        isFullscreen = !isFullscreen;
    });
    
    // 监听全屏变化
    document.addEventListener('fullscreenchange', function() {
        if (!document.fullscreenElement) {
            isFullscreen = false;
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });
    
    // 事件监听器
    playButton.addEventListener('click', togglePlay);
    playPauseBtn.addEventListener('click', togglePlay);
    
    // 初始化进度条
    updateProgress();
    
    // 视频操作按钮
    const likeBtn = document.querySelector('.like-btn');
    const coinBtn = document.querySelector('.coin-btn');
    const favBtn = document.querySelector('.fav-btn');
    const shareBtn = document.querySelector('.share-btn');
    const followBtn = document.querySelector('.follow-btn');
    
    // 点赞功能
    likeBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        const countElement = this.querySelector('.count');
        let count = parseInt(countElement.textContent);
        
        if (this.classList.contains('active')) {
            count++;
            this.style.backgroundColor = '#00a1d6';
            this.style.color = 'white';
        } else {
            count--;
            this.style.backgroundColor = '';
            this.style.color = '';
        }
        
        countElement.textContent = formatCount(count);
    });
    
    // 投币功能
    coinBtn.addEventListener('click', function() {
        const coins = prompt('请输入投币数量 (1-2):', '1');
        if (coins && (coins === '1' || coins === '2')) {
            this.classList.add('active');
            const countElement = this.querySelector('.count');
            let count = parseInt(countElement.textContent);
            count += parseInt(coins);
            countElement.textContent = formatCount(count);
            
            alert(`感谢投币 ${coins} 个！`);
        }
    });
    
    // 收藏功能
    favBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        const countElement = this.querySelector('.count');
        let count = parseInt(countElement.textContent);
        
        if (this.classList.contains('active')) {
            count++;
            this.style.backgroundColor = '#fb7299';
            this.style.color = 'white';
            alert('已添加到收藏夹');
        } else {
            count--;
            this.style.backgroundColor = '';
            this.style.color = '';
            alert('已取消收藏');
        }
        
        countElement.textContent = formatCount(count);
    });
    
    // 分享功能
    shareBtn.addEventListener('click', function() {
        // 创建分享弹窗
        const shareModal = document.createElement('div');
        shareModal.className = 'share-modal';
        shareModal.innerHTML = `
            <div class="share-content">
                <h3>分享视频</h3>
                <div class="share-options">
                    <button class="share-option"><i class="fab fa-weixin"></i> 微信</button>
                    <button class="share-option"><i class="fab fa-weibo"></i> 微博</button>
                    <button class="share-option"><i class="fab fa-qq"></i> QQ</button>
                    <button class="share-option"><i class="fas fa-link"></i> 复制链接</button>
                </div>
                <button class="close-share">关闭</button>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .share-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }
            
            .share-content {
                background-color: white;
                border-radius: 8px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
                text-align: center;
            }
            
            .share-content h3 {
                margin: 0 0 20px;
                color: var(--dark-color);
            }
            
            .share-options {
                display: flex;
                justify-content: center;
                gap: 16px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .share-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 12px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                background-color: white;
                cursor: pointer;
                transition: all 0.3s;
                min-width: 80px;
            }
            
            .share-option:hover {
                background-color: var(--light-color);
                transform: translateY(-2px);
            }
            
            .share-option i {
                font-size: 24px;
                margin-bottom: 8px;
                color: var(--primary-color);
            }
            
            .close-share {
                padding: 8px 20px;
                background-color: var(--primary-color);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            
            .close-share:hover {
                background-color: #0085b7;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(shareModal);
        
        // 关闭分享弹窗
        const closeBtn = shareModal.querySelector('.close-share');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(shareModal);
            document.head.removeChild(style);
        });
        
        // 点击背景关闭
        shareModal.addEventListener('click', function(e) {
            if (e.target === shareModal) {
                document.body.removeChild(shareModal);
                document.head.removeChild(style);
            }
        });
        
        // 分享选项点击
        const shareOptions = shareModal.querySelectorAll('.share-option');
        shareOptions.forEach(option => {
            option.addEventListener('click', function() {
                const platform = this.textContent.trim();
                alert(`分享到${platform}功能开发中`);
            });
        });
    });
    
    // 关注功能
    followBtn.addEventListener('click', function() {
        if (this.textContent.includes('关注')) {
            this.innerHTML = '<i class="fas fa-check"></i> 已关注';
            this.style.backgroundColor = '#e5e9ef';
            this.style.color = '#6d757a';
            alert('关注成功！');
        } else {
            this.innerHTML = '<i class="fas fa-plus"></i> 关注';
            this.style.backgroundColor = '';
            this.style.color = '';
            alert('已取消关注');
        }
    });
    
    // 格式化数字（万、亿）
    function formatCount(num) {
        if (num >= 100000000) {
            return (num / 100000000).toFixed(1) + '亿';
        } else if (num >= 10000) {
            return (num / 10000).toFixed(1) + '万';
        }
        return num.toString();
    }
    
    // 评论功能
    const commentForm = document.querySelector('.comment-form');
    const commentTextarea = commentForm.querySelector('textarea');
    const submitCommentBtn = commentForm.querySelector('.submit-comment');
    const commentsList = document.querySelector('.comments-list');
    
    // 提交评论
    submitCommentBtn.addEventListener('click', function() {
        const commentText = commentTextarea.value.trim();
        if (commentText) {
            addComment(commentText);
            commentTextarea.value = '';
        }
    });
    
    // 回车提交评论
    commentTextarea.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const commentText = commentTextarea.value.trim();
            if (commentText) {
                addComment(commentText);
                commentTextarea.value = '';
            }
        }
    });
    
    // 添加评论
    function addComment(text) {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.style.opacity = '0';
        commentItem.style.transform = 'translateY(20px)';
        
        const now = new Date();
        const timeString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        commentItem.innerHTML = `
            <div class="comment-avatar">
                <img src="https://picsum.photos/seed/newuser/40/40.jpg" alt="用户头像">
            </div>
            <div class="comment-content">
                <div class="comment-user">
                    <span class="username">当前用户</span>
                    <span class="user-level">Lv.1</span>
                </div>
                <div class="comment-text">${text}</div>
                <div class="comment-actions">
                    <span class="comment-time">${timeString}</span>
                    <button class="like-comment">
                        <i class="fas fa-thumbs-up"></i>
                        <span>0</span>
                    </button>
                    <button class="reply-comment">
                        <i class="fas fa-reply"></i>
                        回复
                    </button>
                </div>
            </div>
        `;
        
        commentsList.insertBefore(commentItem, commentsList.firstChild);
        
        // 添加动画效果
        setTimeout(() => {
            commentItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            commentItem.style.opacity = '1';
            commentItem.style.transform = 'translateY(0)';
        }, 10);
        
        // 为新评论添加事件监听器
        const likeBtn = commentItem.querySelector('.like-comment');
        const replyBtn = commentItem.querySelector('.reply-comment');
        
        likeBtn.addEventListener('click', function() {
            const countSpan = this.querySelector('span');
            let count = parseInt(countSpan.textContent);
            count++;
            countSpan.textContent = count;
            this.style.color = '#00a1d6';
        });
        
        replyBtn.addEventListener('click', function() {
            alert('回复功能开发中');
        });
    }
    
    // 评论点赞功能
    const likeCommentBtns = document.querySelectorAll('.like-comment');
    likeCommentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const countSpan = this.querySelector('span');
            let count = parseInt(countSpan.textContent);
            
            if (this.style.color === 'rgb(0, 161, 214)') {
                count--;
                this.style.color = '';
            } else {
                count++;
                this.style.color = '#00a1d6';
            }
            
            countSpan.textContent = count;
        });
    });
    
    // 评论回复功能
    const replyCommentBtns = document.querySelectorAll('.reply-comment');
    replyCommentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('回复功能开发中');
        });
    });
    
    // 评论排序
    const sortOptions = document.querySelectorAll('.sort-options a');
    sortOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            sortOptions.forEach(opt => opt.classList.remove('active'));
            
            // 添加活动状态到当前选项
            this.classList.add('active');
            
            // 这里可以添加排序逻辑
            const sortType = this.textContent;
            console.log(`按${sortType}排序`);
        });
    });
    
    // 表情选择器
    const emojiPicker = document.querySelector('.emoji-picker');
    emojiPicker.addEventListener('click', function() {
        alert('表情选择器功能开发中');
    });
    
    // 推荐视频点击
    const recommendItems = document.querySelectorAll('.recommend-item');
    recommendItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.recommend-title').textContent;
            alert(`即将播放: ${title}`);
        });
    });
    
    // 导航栏滚动效果
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动，隐藏导航栏
            header.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 搜索功能
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            alert(`搜索功能开发中，您搜索的是: ${searchTerm}`);
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                alert(`搜索功能开发中，您搜索的是: ${searchTerm}`);
            }
        }
    });
    
    // 用户登录/注册按钮
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('登录功能开发中');
    });
    
    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('注册功能开发中');
    });
    
    // 投稿按钮
    const uploadBtn = document.querySelector('.upload-btn');
    uploadBtn.addEventListener('click', function() {
        alert('投稿功能开发中');
    });
    
    // 页脚链接点击事件
    const footerLinks = document.querySelectorAll('.footer-links a, .footer-section a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            console.log(`点击了${linkText}链接`);
        });
    });
    
    // 社交媒体链接
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className;
            console.log(`点击了${platform}社交媒体链接`);
        });
    });
    
    // 响应式菜单切换（移动端）
    function createMobileMenu() {
        const headerContent = document.querySelector('.header-content');
        const nav = document.querySelector('.nav');
        
        // 创建菜单按钮
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.style.display = 'none';
        
        // 添加菜单按钮样式
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu-btn {
                display: none;
                background: none;
                border: none;
                font-size: 20px;
                color: var(--text-color);
                cursor: pointer;
                padding: 8px;
                margin-left: 16px;
            }
            
            @media (max-width: 768px) {
                .mobile-menu-btn {
                    display: block;
                }
                
                .nav {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background-color: white;
                    box-shadow: 0 4px 8px var(--shadow-color);
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                    z-index: 999;
                }
                
                .nav.active {
                    max-height: 300px;
                }
                
                .nav ul {
                    flex-direction: column;
                    padding: 16px;
                }
                
                .nav ul li {
                    margin: 0 0 12px 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // 插入菜单按钮
        headerContent.insertBefore(menuBtn, nav);
        
        // 菜单按钮点击事件
        menuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
        
        // 点击页面其他地方关闭菜单
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    }
    
    // 初始化移动端菜单
    createMobileMenu();
});