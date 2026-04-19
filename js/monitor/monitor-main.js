// ==================== 班委系统主模块 ====================

let monitorCurrentUser = null;

function initMonitorSystem(user) {
    monitorCurrentUser = user;
    loadMonitorSystemHTML(user);

    setTimeout(() => {
        showNotification(`欢迎班委 ${user.name}！您可审核本班同学的综测申请`);
        initMonitorNavigation();
        initMonitorHome();
        initMonitorNotification();
        initMonitorStandard();
        initMonitorApply();
        initMonitorAccount();
        initMonitorReview();
    }, 100);
}

function loadMonitorSystemHTML(user) {
    const container = document.getElementById('monitorSystem');
    if (!container) return;

    container.innerHTML = `
        <div class="student-container">
            <div class="sidebar">
                <div class="logo-area">
                    <div class="logo"><i class="fas fa-chart-bar"></i>综合评测系统(班委)</div>
                </div>
                <div class="nav-menu">
                    <a href="#" class="nav-item active" data-page="home"><i class="fas fa-home"></i>查询首页</a>
                    <a href="#" class="nav-item" data-page="notification"><i class="fas fa-bell"></i>信息通知</a>
                    <a href="#" class="nav-item" data-page="standard"><i class="fas fa-clipboard-check"></i>评测标准</a>
                    <a href="#" class="nav-item" data-page="apply"><i class="fas fa-edit"></i>综测填报</a>
                    <a href="#" class="nav-item" data-page="review"><i class="fas fa-check-double"></i>综测审核</a>
                    <a href="#" class="nav-item" data-page="account"><i class="fas fa-user-cog"></i>账号管理</a>
                </div>
                <div class="robot-area">
                    <div class="student-robot-icon" id="monitor-robot-icon"><i class="fas fa-robot"></i></div>
                    <p>智能助手</p>
                </div>
                <a href="#" class="logout-btn" id="monitorLogoutBtn"><i class="fas fa-sign-out-alt"></i>退出登录</a>
            </div>
            <div class="main-content">
                <div class="top-bar">
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div class="semester-switch">
                            <select id="semesterSelect" style="padding: 6px 12px; border-radius: 20px; border: 1px solid #eae2d6; background: #fff; cursor: pointer;">
                                <option value="2023-2024-1">2023-2024学年 第一学期</option>
                                <option value="2023-2024-2">2023-2024学年 第二学期</option>
                                <option value="2022-2023-1">2022-2023学年 第一学期</option>
                                <option value="2022-2023-2">2022-2023学年 第二学期</option>
                            </select>
                        </div>
                        <div class="tabs" id="monitorTabs"></div>
                    </div>
                    <div class="user-profile">
                        <div class="user-avatar" id="monitor-user-avatar">${user.name.charAt(0)}</div>
                        <div class="user-name" id="monitor-user-name">${user.name}</div>
                        <div class="theme-toggle"><i class="fas fa-moon"></i></div>
                    </div>
                </div>
                <div class="content-area">
                    <div class="page-container active" id="home-page"></div>
                    <div class="page-container" id="notification-page"></div>
                    <div class="page-container" id="standard-page"></div>
                    <div class="page-container" id="apply-page"></div>
                    <div class="page-container" id="review-page"></div>
                    <div class="page-container" id="account-page"></div>
                    
                    <div id="notification-detail-container"></div>
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
                        <div class="form-group"><label class="form-label">五育类别</label><select class="form-control" id="record-category"><option value="德育">德育</option><option value="智育">智育</option><option value="体育">体育</option><option value="美育">美育</option><option value="劳育">劳育</option></select></div>
                        <div class="form-group"><label class="form-label">活动时间</label><input type="date" class="form-control" id="record-date"></div>
                        <div class="form-group"><label class="form-label">项目名称</label><input type="text" class="form-control" id="record-name"></div>
                        <div class="form-group"><label class="form-label">申请得分</label><input type="number" class="form-control" id="record-score"></div>
                        <div class="form-group"><label class="form-label">证明材料</label><div class="file-upload"><input type="file" id="record-proof"><label class="file-upload-label" id="record-proof-label">点击上传</label></div></div>
                        <div class="form-group"><label class="form-label">备注说明</label><textarea class="form-control" id="record-remark" rows="3"></textarea></div>
                    </form>
                </div>
                <div class="modal-footer"><button class="btn btn-secondary" id="cancel-record">取消</button><button class="btn btn-primary" id="submit-record">提交</button></div>
            </div>
        </div>
    `;

    // 退出登录
    const logoutBtn = document.getElementById('monitorLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showToast('已退出登录');
            setTimeout(() => {
                document.getElementById('monitorSystem').style.display = 'none';
                document.getElementById('authSystem').style.display = 'flex';
            }, 500);
        });
    }

    // 机器人图标
    const robotIcon = document.getElementById('monitor-robot-icon');
    if (robotIcon) {
        robotIcon.addEventListener('click', () => {
            showNotification('您可以审核本班同学的综测申请');
        });
    }

    // 头像点击
    const userAvatar = document.getElementById('monitor-user-avatar');
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

function initMonitorNavigation() {
    const navItems = document.querySelectorAll('#monitorSystem .nav-item');
    const pages = ['home', 'notification', 'standard', 'apply', 'review', 'account'];

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');

            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            pages.forEach(p => {
                const container = document.getElementById(`${p}-page`);
                if (container) container.classList.remove('active');
            });
            const targetPage = document.getElementById(`${page}-page`);
            if (targetPage) targetPage.classList.add('active');

            if (page === 'home' && typeof refreshMonitorHome === 'function') {
                refreshMonitorHome();
            } else if (page === 'notification' && typeof loadMonitorNotifications === 'function') {
                loadMonitorNotifications();
            } else if (page === 'standard' && typeof loadMonitorStandards === 'function') {
                loadMonitorStandards();
            } else if (page === 'apply' && typeof loadMonitorRecords === 'function') {
                loadMonitorRecords();
            } else if (page === 'review' && typeof loadMonitorReviewList === 'function') {
                loadMonitorReviewList();
            }
        });
    });
}
