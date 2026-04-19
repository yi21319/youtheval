// ==================== 班委信息通知模块 ====================

let monitorNotifications = [];

function initMonitorNotification() {
    loadMonitorNotifications();
}

function loadMonitorNotifications() {
    const container = document.getElementById('notification-page');
    if (!container) return;

    const stored = localStorage.getItem('notifications');
    if (stored) {
        monitorNotifications = JSON.parse(stored);
    } else {
        monitorNotifications = [
            { id: 1, title: "综测填报开始", content: "本学期综测填报已开始，请及时填报", time: "2024-03-01 09:00", read: false, target: "all" },
            { id: 2, title: "审核提醒", content: "请班委及时审核本班同学提交的材料", time: "2024-03-05 10:30", read: false, target: "monitor" }
        ];
        localStorage.setItem('notifications', JSON.stringify(monitorNotifications));
    }

    renderMonitorNotifications();
}

function renderMonitorNotifications() {
    const container = document.getElementById('notification-page');
    if (!container) return;

    container.innerHTML = `
        <div class="section">
            <div class="section-title">信息通知</div>
            <div id="monitor-notification-list"></div>
        </div>
    `;

    const listContainer = document.getElementById('monitor-notification-list');
    listContainer.innerHTML = '';

    monitorNotifications.forEach(notification => {
        const targetText = notification.target === 'all' ? '全体' : notification.target === 'student' ? '学生' : notification.target === 'monitor' ? '班委' : notification.target;
        const div = document.createElement('div');
        div.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        div.innerHTML = `
            <div class="notification-title">${notification.title}</div>
            <div class="notification-content">${notification.content}</div>
            <div class="notification-time">${notification.time} | 发送至: ${targetText}</div>
            ${!notification.read ? '<div class="notification-badge"></div>' : ''}
        `;
        div.addEventListener('click', () => showMonitorNotificationDetail(notification));
        listContainer.appendChild(div);
    });
}

function showMonitorNotificationDetail(notification) {
    const notificationPage = document.getElementById('notification-page');
    const detailContainer = document.getElementById('notification-detail-container');

    if (!notificationPage || !detailContainer) return;

    // 隐藏通知列表页面
    notificationPage.classList.remove('active');
    notificationPage.style.display = 'none';

    // 显示详情容器
    detailContainer.style.display = 'block';
    detailContainer.classList.add('active');

    const targetText = notification.target === 'all' ? '全体' : notification.target === 'student' ? '学生' : notification.target === 'monitor' ? '班委' : notification.target;

    detailContainer.innerHTML = `
        <div class="notification-detail-container active" style="margin-top: 0;">
            <div class="notification-detail-title">${notification.title}</div>
            <div class="notification-detail-content">
                <p><strong>发送时间：</strong>${notification.time}</p>
                <p><strong>发送对象：</strong>${targetText}</p>
                <div style="background: #f9f5f0; padding: 15px; border-radius: 8px; margin-top: 10px;">${notification.content}</div>
            </div>
            <button class="back-btn" id="back-to-notifications">
                <i class="fas fa-arrow-left"></i> 返回通知列表
            </button>
        </div>
    `;

    // 标记为已读
    if (!notification.read) {
        notification.read = true;
        localStorage.setItem('notifications', JSON.stringify(monitorNotifications));
        renderMonitorNotifications();
    }

    // 返回按钮事件
    const backBtn = document.getElementById('back-to-notifications');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            detailContainer.innerHTML = '';
            detailContainer.classList.remove('active');
            detailContainer.style.display = 'none';
            notificationPage.style.display = 'block';
            notificationPage.classList.add('active');
        });
    }
}