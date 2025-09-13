// 视频详情页面的JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 加载视频信息
    loadVideoInfo();
    
    // 初始化返回首页功能
    initBackToHome();
    
    // 初始化视频播放器
    initVideoPlayer();
    
    // 初始化视频操作按钮
    initVideoActions();
    
    // 初始化评论功能
    initComments();
    
    // 初始化相关视频
    initRelatedVideos();
    
    // 初始化UP主关注功能
    initFollowButton();
    
    // 初始化视频描述展开/收起
    initDescriptionToggle();
});

// 加载视频信息
function loadVideoInfo() {
    const videoData = localStorage.getItem('currentVideo');
    if (videoData) {
        const data = JSON.parse(videoData);
        const titleElement = document.querySelector('.video-title');
        if (titleElement && data.title) {
            titleElement.textContent = data.title;
            document.title = `${data.title} - 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili`;
        }
    }
}

// 返回首页功能
function initBackToHome() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
        logo.style.cursor = 'pointer';
    }
}

// 视频播放器功能
function initVideoPlayer() {
    const videoScreen = document.querySelector('.video-screen');
    const playBtn = document.querySelector('.play-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressPlayed = document.querySelector('.progress-played');
    const timeDisplay = document.querySelector('.time-display');
    
    let isPlaying = false;
    let currentTime = 0;
    const duration = 754; // 12:34 in seconds
    
    // 播放/暂停切换
    function togglePlay() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            videoScreen.style.background = 'linear-gradient(45deg, #00AEEC, #FB7299)';
            playBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
            `;
            startProgress();
        } else {
            playBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <polygon points="8,5 8,19 19,12" fill="currentColor"/>
                </svg>
            `;
            stopProgress();
        }
    }
    
    // 开始进度更新
    function startProgress() {
        const interval = setInterval(() => {
            if (!isPlaying) {
                clearInterval(interval);
                return;
            }
            
            currentTime += 1;
            if (currentTime >= duration) {
                currentTime = duration;
                isPlaying = false;
                togglePlay();
                clearInterval(interval);
                return;
            }
            
            updateProgress();
        }, 1000);
    }
    
    // 停止进度更新
    function stopProgress() {
        // Progress will be stopped by the interval check
    }
    
    // 更新进度显示
    function updateProgress() {
        const percentage = (currentTime / duration) * 100;
        progressPlayed.style.width = percentage + '%';
        
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = currentTime % 60;
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = duration % 60;
        
        timeDisplay.textContent = `${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
    }
    
    // 进度条点击跳转
    function seekTo(event) {
        const rect = progressBar.getBoundingClientRect();
        const percentage = (event.clientX - rect.left) / rect.width;
        currentTime = Math.floor(duration * percentage);
        updateProgress();
    }
    
    // 事件监听
    if (videoScreen) {
        videoScreen.addEventListener('click', togglePlay);
    }
    
    if (playBtn) {
        playBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePlay();
        });
    }
    
    if (progressBar) {
        progressBar.addEventListener('click', seekTo);
    }
    
    // 初始化显示
    updateProgress();
    
    // 音量控制
    const volumeBtn = document.querySelector('.volume-btn');
    if (volumeBtn) {
        volumeBtn.addEventListener('click', function() {
            // 模拟音量切换
            const isMuted = this.classList.contains('muted');
            if (isMuted) {
                this.classList.remove('muted');
                this.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
                    </svg>
                `;
            } else {
                this.classList.add('muted');
                this.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/>
                    </svg>
                `;
            }
        });
    }
    
    // 全屏按钮
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            alert('全屏功能（在实际应用中这里会切换全屏模式）');
        });
    }
    
    // 设置按钮
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            alert('播放设置（清晰度、倍速等）');
        });
    }
}

// 视频操作按钮功能
function initVideoActions() {
    const likeBtn = document.querySelector('.like-btn');
    const dislikeBtn = document.querySelector('.dislike-btn');
    const coinBtn = document.querySelector('.coin-btn');
    const collectBtn = document.querySelector('.collect-btn');
    const shareBtn = document.querySelector('.share-btn');
    
    // 点赞功能
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            const isLiked = this.classList.contains('active');
            const countSpan = this.querySelector('span');
            let count = parseInt(countSpan.textContent.replace(/[^\d]/g, ''));
            
            if (isLiked) {
                this.classList.remove('active');
                count--;
                this.style.color = '#666';
                this.style.borderColor = '#e7e7e7';
                this.style.background = 'white';
            } else {
                this.classList.add('active');
                count++;
                this.style.color = 'white';
                this.style.borderColor = '#00AEEC';
                this.style.background = '#00AEEC';
            }
            
            countSpan.textContent = formatCount(count);
        });
    }
    
    // 踩按钮
    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', function() {
            alert('不喜欢这个视频');
        });
    }
    
    // 投币功能
    if (coinBtn) {
        coinBtn.addEventListener('click', function() {
            const coinDialog = createCoinDialog();
            document.body.appendChild(coinDialog);
        });
    }
    
    // 收藏功能
    if (collectBtn) {
        collectBtn.addEventListener('click', function() {
            const isCollected = this.classList.contains('active');
            
            if (isCollected) {
                this.classList.remove('active');
                this.style.color = '#666';
                this.style.borderColor = '#e7e7e7';
                this.style.background = 'white';
                alert('取消收藏');
            } else {
                this.classList.add('active');
                this.style.color = 'white';
                this.style.borderColor = '#FB7299';
                this.style.background = '#FB7299';
                alert('已添加到收藏夹');
            }
        });
    }
    
    // 分享功能
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const shareDialog = createShareDialog();
            document.body.appendChild(shareDialog);
        });
    }
}

// 创建投币对话框
function createCoinDialog() {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    dialog.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 24px; width: 90%; max-width: 400px;">
            <h3 style="margin: 0 0 20px 0; text-align: center; color: #212121;">投币支持</h3>
            <div style="display: flex; gap: 12px; justify-content: center; margin-bottom: 20px;">
                <button class="coin-option" data-count="1" style="padding: 12px 20px; border: 2px solid #e7e7e7; border-radius: 8px; background: white; cursor: pointer;">1币</button>
                <button class="coin-option" data-count="2" style="padding: 12px 20px; border: 2px solid #e7e7e7; border-radius: 8px; background: white; cursor: pointer;">2币</button>
            </div>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button onclick="this.closest('[style*=fixed]').remove()" style="padding: 8px 20px; border: 1px solid #e7e7e7; border-radius: 6px; background: white; color: #666; cursor: pointer;">取消</button>
                <button onclick="alert('投币成功！'); this.closest('[style*=fixed]').remove();" style="padding: 8px 20px; border: none; border-radius: 6px; background: #00AEEC; color: white; cursor: pointer;">确认投币</button>
            </div>
        </div>
    `;
    
    // 投币选项点击
    dialog.querySelectorAll('.coin-option').forEach(btn => {
        btn.addEventListener('click', function() {
            dialog.querySelectorAll('.coin-option').forEach(b => {
                b.style.borderColor = '#e7e7e7';
                b.style.color = '#666';
            });
            this.style.borderColor = '#00AEEC';
            this.style.color = '#00AEEC';
        });
    });
    
    dialog.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
    
    return dialog;
}

// 创建分享对话框
function createShareDialog() {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    dialog.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 24px; width: 90%; max-width: 400px;">
            <h3 style="margin: 0 0 20px 0; text-align: center; color: #212121;">分享到</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
                <button onclick="alert('分享到微信')" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: none; border-radius: 8px; background: #f8f9fa; cursor: pointer;">
                    <div style="width: 40px; height: 40px; background: #07C160; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">微</div>
                    <span style="font-size: 12px; color: #666;">微信</span>
                </button>
                <button onclick="alert('分享到QQ')" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: none; border-radius: 8px; background: #f8f9fa; cursor: pointer;">
                    <div style="width: 40px; height: 40px; background: #1AAD19; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">Q</div>
                    <span style="font-size: 12px; color: #666;">QQ</span>
                </button>
                <button onclick="alert('复制链接')" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: none; border-radius: 8px; background: #f8f9fa; cursor: pointer;">
                    <div style="width: 40px; height: 40px; background: #666; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">🔗</div>
                    <span style="font-size: 12px; color: #666;">复制链接</span>
                </button>
            </div>
            <button onclick="this.closest('[style*=fixed]').remove()" style="width: 100%; padding: 12px; border: 1px solid #e7e7e7; border-radius: 6px; background: white; color: #666; cursor: pointer;">取消</button>
        </div>
    `;
    
    dialog.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
    
    return dialog;
}

// 评论功能
function initComments() {
    const commentInput = document.querySelector('.comment-input');
    const submitBtn = document.querySelector('.submit-comment-btn');
    const sortBtns = document.querySelectorAll('.sort-btn');
    
    // 评论提交
    if (submitBtn && commentInput) {
        submitBtn.addEventListener('click', function() {
            const content = commentInput.value.trim();
            if (content) {
                addComment(content);
                commentInput.value = '';
            }
        });
        
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                const content = this.value.trim();
                if (content) {
                    addComment(content);
                    this.value = '';
                }
            }
        });
    }
    
    // 排序切换
    sortBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sortBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const sortType = this.textContent;
            console.log('切换排序:', sortType);
            // 这里可以添加实际的排序逻辑
        });
    });
    
    // 评论点赞
    initCommentLikes();
    
    // 加载更多评论
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.textContent = '加载中...';
            setTimeout(() => {
                this.textContent = '查看更多评论';
                // 这里可以添加加载更多评论的逻辑
                alert('加载更多评论功能');
            }, 1000);
        });
    }
}

// 添加新评论
function addComment(content) {
    const commentsList = document.querySelector('.comments-list');
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';
    
    const now = new Date();
    const timeStr = '刚刚';
    
    newComment.innerHTML = `
        <div class="comment-avatar">
            <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'><circle cx='18' cy='18' r='18' fill='%2300AEEC'/><text x='18' y='22' text-anchor='middle' fill='white' font-size='12'>我</text></svg>" alt="我的头像">
        </div>
        <div class="comment-content">
            <div class="comment-user">
                <span class="username">我</span>
                <span class="comment-time">${timeStr}</span>
            </div>
            <p class="comment-text">${content}</p>
            <div class="comment-actions-bar">
                <button class="comment-like">
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" fill="currentColor"/>
                    </svg>
                    <span>0</span>
                </button>
                <button class="comment-reply">回复</button>
            </div>
        </div>
    `;
    
    commentsList.insertBefore(newComment, commentsList.firstChild);
    
    // 初始化新评论的点赞功能
    initCommentLike(newComment.querySelector('.comment-like'));
    
    // 更新评论数
    const commentCount = document.querySelector('.comment-count');
    if (commentCount) {
        const currentCount = parseInt(commentCount.textContent.replace(/[^\d]/g, ''));
        commentCount.textContent = formatCount(currentCount + 1);
    }
}

// 初始化评论点赞
function initCommentLikes() {
    const commentLikes = document.querySelectorAll('.comment-like');
    commentLikes.forEach(btn => initCommentLike(btn));
}

function initCommentLike(btn) {
    btn.addEventListener('click', function() {
        const isLiked = this.classList.contains('liked');
        const countSpan = this.querySelector('span');
        let count = parseInt(countSpan.textContent);
        
        if (isLiked) {
            this.classList.remove('liked');
            count--;
            this.style.color = '#999';
        } else {
            this.classList.add('liked');
            count++;
            this.style.color = '#00AEEC';
        }
        
        countSpan.textContent = count;
    });
}

// 相关视频功能
function initRelatedVideos() {
    const relatedItems = document.querySelectorAll('.related-video-item');
    
    relatedItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.related-title').textContent;
            console.log('点击相关视频:', title);
            
            // 模拟跳转到新视频
            alert(`正在播放: ${title}`);
        });
    });
}

// 关注按钮功能
function initFollowButton() {
    const followBtn = document.querySelector('.follow-btn');
    
    if (followBtn) {
        followBtn.addEventListener('click', function() {
            const isFollowing = this.classList.contains('following');
            
            if (isFollowing) {
                this.classList.remove('following');
                this.textContent = '+ 关注';
                this.style.background = '#00AEEC';
                this.style.color = 'white';
                alert('已取消关注');
            } else {
                this.classList.add('following');
                this.textContent = '✓ 已关注';
                this.style.background = '#f0f0f0';
                this.style.color = '#666';
                alert('关注成功');
            }
        });
    }
}

// 视频描述展开/收起
function initDescriptionToggle() {
    const expandBtn = document.querySelector('.expand-btn');
    const descContent = document.querySelector('.desc-content');
    
    if (expandBtn && descContent) {
        let isExpanded = false;
        const originalHeight = descContent.scrollHeight;
        
        // 初始状态设置最大高度
        descContent.style.maxHeight = '120px';
        descContent.style.overflow = 'hidden';
        
        expandBtn.addEventListener('click', function() {
            if (isExpanded) {
                descContent.style.maxHeight = '120px';
                this.textContent = '展开';
                isExpanded = false;
            } else {
                descContent.style.maxHeight = originalHeight + 'px';
                this.textContent = '收起';
                isExpanded = true;
            }
        });
    }
}

// 工具函数：格式化数字显示
function formatCount(count) {
    if (count >= 10000) {
        return (count / 10000).toFixed(1) + '万';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + '千';
    }
    return count.toString();
}
