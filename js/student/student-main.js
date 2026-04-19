// ==================== 学生系统主模块 ====================

let studentSystemUser = null;

function initStudentSystem(user) {
    studentSystemUser = user;
    loadStudentSystemHTML(user);

    setTimeout(() => {
        showNotification(`欢迎进入学生系统，${user.name}同学！`);
        initStudentNavigation();
        initStudentHome();
        initStudentNotification();
        initStudentStandard();
        initStudentApply();
        initStudentAccount();
    }, 100);
}

function loadStudentSystemHTML(user) {
    const container = document.getElementById('studentSystem');
    if (!container) return;

    container.innerHTML = `
        <div class="student-container">
            <!-- 左侧导航栏 -->
            <div class="sidebar">
                <div class="logo-area">
                    <div class="logo">
                        <i class="fas fa-chart-bar"></i>
                        综合评测系统
                    </div>
                </div>
                <div class="nav-menu">
                    <a href="#" class="nav-item active" data-page="home">
                        <i class="fas fa-home"></i>查询首页
                    </a>
                    <a href="#" class="nav-item" data-page="notification">
                        <i class="fas fa-bell"></i>信息通知
                    </a>
                    <a href="#" class="nav-item" data-page="standard">
                        <i class="fas fa-clipboard-check"></i>评测标准
                    </a>
                    <a href="#" class="nav-item" data-page="apply">
                        <i class="fas fa-edit"></i>综测填报
                    </a>
                    <a href="#" class="nav-item" data-page="account">
                        <i class="fas fa-user-cog"></i>账号管理
                    </a>
                </div>
                <div class="robot-area">
                    <div class="student-robot-icon" id="student-robot-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <p>智能助手</p>
                </div>
                <a href="#" class="logout-btn" id="studentLogoutBtn">
                    <i class="fas fa-sign-out-alt"></i>退出登录
                </a>
            </div>
            
            <!-- 右侧主内容区 -->
            <div class="main-content">
                <div class="top-bar">
                    <div class="tabs" id="studentTabs"></div>
                    <div class="user-profile">
                        <div class="user-avatar" id="student-user-avatar">${user.name.charAt(0)}</div>
                        <div class="user-name" id="student-user-name">${user.name}</div>
                        <div class="theme-toggle" id="theme-toggle">
                            <i class="fas fa-moon"></i>
                        </div>
                    </div>
                </div>
                <div class="content-area">
                    <div class="page-container active" id="home-page"></div>
                    <div class="page-container" id="notification-page"></div>
                    <div class="page-container" id="standard-page"></div>
                    <div class="page-container" id="apply-page"></div>
                    <div class="page-container" id="account-page"></div>
                    
                    <!-- 通知详情容器 -->
                    <div id="notification-detail-container"></div>
                    <!-- 记录详情容器 -->
                    <div id="record-detail-container"></div>
                </div>
            </div>
        </div>
        
        <!-- 新增记录模态框 -->
        <div class="modal-overlay" id="add-record-modal">
            <div class="modal">
                <div class="modal-header">
                    <div class="modal-title">新增综测记录</div>
                    <button class="modal-close" id="close-add-record-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="record-form">
                        <div class="form-group">
                            <label class="form-label">五育类别 <span style="color: #e74c3c;">*</span></label>
                            <select class="form-control" id="record-category" required>
                                <option value="">请选择五育类别</option>
                                <option value="德育">德育</option>
                                <option value="智育">智育</option>
                                <option value="体育">体育</option>
                                <option value="美育">美育</option>
                                <option value="劳育">劳育</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">活动时间 <span style="color: #e74c3c;">*</span></label>
                            <input type="date" class="form-control" id="record-date" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">项目名称 <span style="color: #e74c3c;">*</span></label>
                            <input type="text" class="form-control" id="record-name" placeholder="请输入项目名称" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">申请得分 <span style="color: #e74c3c;">*</span></label>
                            <input type="number" class="form-control" id="record-score" placeholder="请输入申请得分" min="0" max="100" step="0.1" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">证明材料 <span style="color: #e74c3c;">*</span></label>
                            <div class="file-upload">
                                <input type="file" id="record-proof" accept=".jpg,.jpeg,.png,.pdf">
                                <label class="file-upload-label" for="record-proof" id="record-proof-label">
                                    <i class="fas fa-upload"></i> 点击上传证明材料
                                </label>
                            </div>
                            <div id="file-preview" style="margin-top: 10px;"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">备注说明</label>
                            <textarea class="form-control" id="record-remark" rows="3" placeholder="请输入备注说明（选填）"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancel-record">取消</button>
                    <button class="btn btn-primary" id="submit-record">提交</button>
                </div>
            </div>
        </div>
    `;

    // 绑定退出登录事件
    const logoutBtn = document.getElementById('studentLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showToast('已退出登录');
            setTimeout(() => {
                document.getElementById('studentSystem').style.display = 'none';
                document.getElementById('authSystem').style.display = 'flex';
            }, 500);
        });
    }

    // 机器人图标点击事件
    const robotIcon = document.getElementById('student-robot-icon');
    if (robotIcon) {
        robotIcon.addEventListener('click', function () {
            const messages = [
                '我是您的智能助手，随时为您服务！',
                '点击任意分数项查看详细信息',
                '尝试切换深色/浅色主题以获得不同体验',
                '成长建议可以点击展开查看详细内容',
                '综测填报可以上传成绩单，AI会智能识别'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showNotification(randomMessage);
            this.style.transform = 'scale(1.2)';
            setTimeout(() => { this.style.transform = 'scale(1)'; }, 300);
        });
    }

    // 用户头像点击事件
    const userAvatar = document.getElementById('student-user-avatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', function () {
            const colors = ['#d4a017', '#b8860b', '#a0522d', '#8b4513', '#daa520'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.style.backgroundColor = randomColor;
            this.style.transform = 'scale(1.1)';
            setTimeout(() => { this.style.transform = 'scale(1)'; }, 300);
            showNotification('头像颜色已更新！');
        });
    }

    // 主题切换
    initThemeToggle();
}

function initStudentNavigation() {
    const navItems = document.querySelectorAll('#studentSystem .nav-item');
    const pageContainers = document.querySelectorAll('#studentSystem .page-container');
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

            updateStudentTabs(page);

            // 页面特定初始化
            if (page === 'home') {
                if (typeof refreshStudentHome === 'function') refreshStudentHome();
            } else if (page === 'notification') {
                if (typeof loadStudentNotifications === 'function') loadStudentNotifications();
            } else if (page === 'standard') {
                if (typeof loadStudentStandards === 'function') loadStudentStandards();
            } else if (page === 'apply') {
                if (typeof loadStudentRecords === 'function') loadStudentRecords();
            }
        });
    });
}

function updateStudentTabs(page) {
    const tabsContainer = document.getElementById('studentTabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';

    if (page === 'home') {
        tabsContainer.innerHTML = `
            <a href="#" class="tab active">查询首页</a>
            <div class="time-filter">
                <select id="semester-select">
                    <option>2023-2024学年 第一学期</option>
                    <option>2023-2024学年 第二学期</option>
                    <option>2022-2023学年 第一学期</option>
                    <option>2022-2023学年 第二学期</option>
                </select>
            </div>
        `;
        const semesterSelect = document.getElementById('semester-select');
        if (semesterSelect) {
            semesterSelect.addEventListener('change', function () {
                showNotification(`已切换到：${this.value}`);
                const newScores = generateRandomScores();
                updateStudentScoreDisplay(newScores);
            });
        }
    }
}

function generateRandomScores() {
    return {
        '德育': { original: (80 + Math.random() * 20).toFixed(1), weighted: (16 + Math.random() * 4).toFixed(1) },
        '智育': { original: (80 + Math.random() * 20).toFixed(1), weighted: (32 + Math.random() * 8).toFixed(1) },
        '体育': { original: (80 + Math.random() * 20).toFixed(1), weighted: (8 + Math.random() * 2).toFixed(1) },
        '美育': { original: (80 + Math.random() * 20).toFixed(1), weighted: (8 + Math.random() * 2).toFixed(1) },
        '劳育': { original: (80 + Math.random() * 20).toFixed(1), weighted: (16 + Math.random() * 4).toFixed(1) },
        'total': (80 + Math.random() * 20).toFixed(1)
    };
}

function updateStudentScoreDisplay(scores) {
    const scoreItems = document.querySelectorAll('#studentSystem .score-item');
    scoreItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (category && scores[category]) {
            const originalSpan = item.querySelector('.score-original');
            const weightedSpan = item.querySelector('.score-weighted');
            if (originalSpan) originalSpan.textContent = `原始分：${scores[category].original}`;
            if (weightedSpan) weightedSpan.textContent = scores[category].weighted;
            item.setAttribute('data-original', scores[category].original);
            item.setAttribute('data-weighted', scores[category].weighted);
        }
    });
    const totalElement = document.querySelector('#studentSystem .total-value');
    if (totalElement && scores.total) {
        totalElement.textContent = scores.total;
    }
}