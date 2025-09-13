// 视频播放器功能
const videoPlaceholder = document.querySelector('.video-placeholder');
const playBtn = document.querySelector('.play-btn');
const playPauseBtn = document.querySelector('.play-pause');
const progressBar = document.querySelector('.progress');
const volumeSlider = document.querySelector('.volume-slider');
const fullscreenBtn = document.querySelector('.fullscreen-btn');

// 模拟播放功能
let isPlaying = false;

videoPlaceholder.addEventListener('click', () => {
    togglePlay();
});

playPauseBtn.addEventListener('click', () => {
    togglePlay();
});

function togglePlay() {
    isPlaying = !isPlaying;
    updatePlayState();
}

function updatePlayState() {
    if (isPlaying) {
        playPauseBtn.textContent = '⏸';
        playBtn.style.display = 'none';
        // 模拟进度条前进
        simulateProgress();
    } else {
        playPauseBtn.textContent = '▶';
        playBtn.style.display = 'block';
    }
}

function simulateProgress() {
    if (isPlaying) {
        let progress = 0;
        const interval = setInterval(() => {
            if (!isPlaying) {
                clearInterval(interval);
                return;
            }
            progress += 0.1;
            if (progress > 100) {
                progress = 0;
                isPlaying = false;
                updatePlayState();
                clearInterval(interval);
                return;
            }
            progressBar.style.width = progress + '%';
            updateTimeDisplay(progress);
        }, 100);
    }
}

function updateTimeDisplay(progress) {
    const totalSeconds = 624; // 10:24 in seconds
    const currentSeconds = Math.floor((progress / 100) * totalSeconds);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalSecondsRemainder = totalSeconds % 60;
    
    document.querySelector('.time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSecondsRemainder.toString().padStart(2, '0')}`;
}

// 音量控制
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value;
    const volumeBtn = document.querySelector('.volume-btn');
    
    if (volume == 0) {
        volumeBtn.textContent = '🔇';
    } else if (volume < 50) {
        volumeBtn.textContent = '🔈';
    } else {
        volumeBtn.textContent = '🔊';
    }
});

// 全屏功能
fullscreenBtn.addEventListener('click', () => {
    const playerContainer = document.querySelector('.player-container');
    
    if (!document.fullscreenElement) {
        if (playerContainer.requestFullscreen) {
            playerContainer.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// 进度条点击
document.querySelector('.progress-bar').addEventListener('click', (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progress = (clickPosition / rect.width) * 100;
    
    progressBar.querySelector('.progress').style.width = progress + '%';
    updateTimeDisplay(progress);
});

// 视频互动功能
const actionButtons = document.querySelectorAll('.action-btn');

actionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.classList[1];
        const countElement = this.querySelector('span:last-child');
        
        if (type === 'like-btn') {
            let count = parseInt(countElement.textContent.replace(',', '')) || 0;
            count++;
            countElement.textContent = count.toLocaleString();
            this.style.background = '#fff0f5';
            this.style.borderColor = '#ffb6c1';
        } else if (type === 'coin-btn') {
            alert('投币成功！感谢支持！');
        } else if (type === 'collect-btn') {
            alert('已收藏！');
        } else if (type === 'share-btn') {
            alert('分享功能即将到来！');
        }
    });
});

// 评论功能
const commentSubmit = document.querySelector('.comment-submit');
const commentTextarea = document.querySelector('.comment-input textarea');

commentSubmit.addEventListener('click', () => {
    const commentText = commentTextarea.value.trim();
    if (commentText) {
        addNewComment(commentText);
        commentTextarea.value = '';
    }
});

commentTextarea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        commentSubmit.click();
    }
});

function addNewComment(text) {
    const commentsList = document.querySelector('.comments-list');
    const newComment = document.createElement('div');
    newComment.className = 'comment';
    newComment.innerHTML = `
        <div class="comment-avatar">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMyM2FkZTUiLz48dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5bCPPC90ZXh0Pjwvc3ZnPg==" alt="用户头像">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-user">新用户</span>
                <span class="comment-time">刚刚</span>
            </div>
            <p class="comment-text">${text}</p>
            <div class="comment-actions">
                <button class="comment-like">👍 0</button>
                <button class="comment-reply">回复</button>
            </div>
        </div>
    `;
    
    commentsList.insertBefore(newComment, commentsList.firstChild);
    
    // 添加点赞功能
    const likeBtn = newComment.querySelector('.comment-like');
    likeBtn.addEventListener('click', function() {
        let count = parseInt(this.textContent.match(/\d+/)[0]) || 0;
        count++;
        this.textContent = `👍 ${count}`;
    });
}

// 关注功能
const followBtn = document.querySelector('.follow-btn');
followBtn.addEventListener('click', function() {
    if (this.textContent === '+ 关注') {
        this.textContent = '已关注';
        this.style.background = '#ccc';
    } else {
        this.textContent = '+ 关注';
        this.style.background = '#fb7299';
    }
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取视频ID
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    
    if (videoId) {
        console.log('加载视频ID:', videoId);
        // 这里可以根据不同的视频ID加载不同的内容
    }
});