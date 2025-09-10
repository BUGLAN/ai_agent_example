// 轮播图功能
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;
    let slideInterval;

    // 初始化轮播图
    function initCarousel() {
        showSlide(0);
        startSlideInterval();
    }

    // 显示指定幻灯片
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    // 下一张幻灯片
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    // 上一张幻灯片
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    // 开始自动轮播
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // 停止自动轮播
    function stopSlideInterval() {
        clearInterval(slideInterval);
    }

    // 事件监听器
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlideInterval();
        startSlideInterval();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlideInterval();
        startSlideInterval();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopSlideInterval();
            startSlideInterval();
        });
    });

    // 鼠标悬停时暂停轮播
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', stopSlideInterval);
    carousel.addEventListener('mouseleave', startSlideInterval);

    // 初始化轮播图
    initCarousel();

    // 视频卡片悬停效果
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
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

    // 页面滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有视频卡片
    videoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // 标签页切换功能
    const tabLinks = document.querySelectorAll('.section-tabs a');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            tabLinks.forEach(l => l.classList.remove('active'));
            
            // 添加活动状态到当前链接
            this.classList.add('active');
            
            // 这里可以添加切换内容的逻辑
            const tabText = this.textContent;
            console.log(`切换到${tabText}标签`);
        });
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