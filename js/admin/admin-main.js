// ==================== 管理员系统主模块 ====================

let adminSystemUser = null;

function initAdminSystem(user) {
    adminSystemUser = user;
    loadAdminSystemHTML(user);

    setTimeout(() => {
        showNotification(`欢迎管理员 ${user.name}！`);
        initAdminNavigation();
        initAdminHome();
        initAdminNotification();
        initAdminStandard();
        initAdminAccount();
        initAdminStudent();
        initAdminMonitor();
        initAdminReview();
    }, 100);
}

function loadAdminSystemHTML(user) {
    const container = document.getElementById('adminSystem');
    if (!container) return;

    container.innerHTML = `
        <div class="student-container">
            <!-- 左侧导航栏 -->
            <div class="sidebar">
                <div class="logo-area">
                    <div class="logo">
                        <i class="fas fa-chart-bar"></i>
                        综合评测系统(管理员)
                    </div>
                </div>
                <div class="nav-menu">
                    <a href="#" class="nav-item active" data-page="home">
                        <i class="fas fa-home"></i>首页查询
                    </a>
                    <a href="#" class="nav-item" data-page="notification">
                        <i class="fas fa-bell"></i>信息通知
                    </a>
                    <a href="#" class="nav-item" data-page="standard">
                        <i class="fas fa-clipboard-check"></i>测评标准
                    </a>
                    <a href="#" class="nav-item" data-page="account">
                        <i class="fas fa-user-cog"></i>账号管理
                    </a>
                    <a href="#" class="nav-item" data-page="student">
                        <i class="fas fa-users"></i>学生管理
                    </a>
                    <a href="#" class="nav-item" data-page="monitor">
                        <i class="fas fa-user-tie"></i>班委管理
                    </a>
                    <a href="#" class="nav-item" data-page="review">
                        <i class="fas fa-check-double"></i>综测审核
                    </a>
                </div>
                <div class="robot-area">
                    <div class="student-robot-icon" id="admin-robot-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <p>智能助手</p>
                </div>
                <a href="#" class="logout-btn" id="adminLogoutBtn">
                    <i class="fas fa-sign-out-alt"></i>退出登录
                </a>
            </div>
            
            <!-- 右侧主内容区 -->
            <div class="main-content">
                <div class="top-bar">
                    <div class="tabs" id="adminTabs"></div>
                    <div class="user-profile">
                        <div class="user-avatar" id="admin-user-avatar">管</div>
                        <div class="user-name" id="admin-user-name">${user.name}</div>
                        <div class="theme-toggle" id="theme-toggle">
                            <i class="fas fa-moon"></i>
                        </div>
                    </div>
                </div>
                <div class="content-area">
                    <div class="page-container active" id="home-page"></div>
                    <div class="page-container" id="notification-page"></div>
                    <div class="page-container" id="standard-page"></div>
                    <div class="page-container" id="account-page"></div>
                    <div class="page-container" id="student-page"></div>
                    <div class="page-container" id="monitor-page"></div>
                    <div class="page-container" id="review-page"></div>
                    
                    <!-- 通知详情容器 -->
                    <div id="notification-detail-container"></div>
                    <!-- 记录详情容器 -->
                    <div id="record-detail-container"></div>
                </div>
            </div>
        </div>
    `;

    // 退出登录
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showToast('已退出登录');
            setTimeout(() => {
                document.getElementById('adminSystem').style.display = 'none';
                document.getElementById('authSystem').style.display = 'flex';
            }, 500);
        });
    }

    // 机器人图标
    const robotIcon = document.getElementById('admin-robot-icon');
    if (robotIcon) {
        robotIcon.addEventListener('click', () => {
            showNotification('管理员您好！您可以管理学生、班委和审核综测');
        });
    }

    // 头像点击
    const userAvatar = document.getElementById('admin-user-avatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', function () {
            const colors = ['#d4a017', '#b8860b', '#a0522d', '#8b4513'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.style.backgroundColor = randomColor;
            showNotification('头像颜色已更新');
        });
    }

    initThemeToggle();
}

function initAdminNavigation() {
    const navItems = document.querySelectorAll('#adminSystem .nav-item');
    const pageContainers = document.querySelectorAll('#adminSystem .page-container');
    const detailContainer = document.getElementById('notification-detail-container');
    const recordContainer = document.getElementById('record-detail-container');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');

            // 隐藏详情容器
            if (detailContainer) {
                detailContainer.innerHTML = '';
                detailContainer.classList.remove('active');
                detailContainer.style.display = 'none';
            }
            if (recordContainer) {
                recordContainer.innerHTML = '';
                recordContainer.classList.remove('active');
                recordContainer.style.display = 'none';
            }

            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            pageContainers.forEach(container => {
                container.classList.remove('active');
                container.style.display = 'none';
            });

            const targetPage = document.getElementById(`${page}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
                targetPage.style.display = 'block';
            }

            // 页面特定初始化
            if (page === 'home' && typeof refreshAdminHome === 'function') {
                refreshAdminHome();
            } else if (page === 'notification' && typeof loadAdminNotifications === 'function') {
                loadAdminNotifications();
            } else if (page === 'standard' && typeof loadAdminStandards === 'function') {
                loadAdminStandards();
            } else if (page === 'student' && typeof loadStudentList === 'function') {
                loadStudentList();
            } else if (page === 'monitor' && typeof loadMonitorList === 'function') {
                loadMonitorList();
            } else if (page === 'review' && typeof loadAdminReviewList === 'function') {
                loadAdminReviewList();
            }
        });
    });
}