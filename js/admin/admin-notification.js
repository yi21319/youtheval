// ==================== 管理员信息通知模块 ====================

let adminNotifications = [];

function initAdminNotification() {
    loadAdminNotifications();
}

function loadAdminNotifications() {
    const stored = localStorage.getItem('notifications');
    if (stored) {
        adminNotifications = JSON.parse(stored);
    } else {
        adminNotifications = [
            { id: 1, title: "综测填报开始", content: "本学期综测填报已开始，请及时填报", time: "2024-03-01 09:00", read: false, target: "all" },
            { id: 2, title: "审核提醒", content: "请班委及时审核本班同学提交的材料", time: "2024-03-05 10:30", read: false, target: "monitor" },
            { id: 3, title: "综测截止通知", content: "本学期综测填报将于3月31日截止", time: "2024-03-25 08:00", read: false, target: "all" }
        ];
        localStorage.setItem('notifications', JSON.stringify(adminNotifications));
    }

    renderAdminNotifications();
}

function renderAdminNotifications() {
    const container = document.getElementById('notification-page');
    if (!container) return;

    container.innerHTML = `
        <div class="section">
            <div class="section-title">
                信息通知
                <button class="add-record-btn" id="sendNotificationBtn" style="background:#b8860b;">
                    <i class="fas fa-paper-plane"></i> 发送通知
                </button>
            </div>
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <input type="text" id="searchNotification" placeholder="搜索通知标题" style="padding: 8px; width: 200px; border-radius: 20px; border: 1px solid #ddd;">
                <select id="filterTarget" style="padding: 8px; border-radius: 20px;">
                    <option value="all">全部对象</option>
                    <option value="all">全体学生</option>
                    <option value="student">仅学生</option>
                    <option value="monitor">仅班委</option>
                    ${window.appData.colleges.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
                <button class="btn btn-primary" id="refreshNotifications" style="background:#b8860b;padding:8px 16px;">刷新</button>
            </div>
            <div id="admin-notification-list"></div>
        </div>
        
        <!-- 发送通知模态框 -->
        <div id="sendNotificationModal" class="modal-overlay">
            <div class="modal" style="width: 550px;">
                <div class="modal-header">
                    <div class="modal-title">发送通知</div>
                    <button class="modal-close" onclick="closeSendModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">通知标题 <span style="color: #e74c3c;">*</span></label>
                        <input type="text" id="notifyTitle" class="form-control" placeholder="请输入标题">
                    </div>
                    <div class="form-group">
                        <label class="form-label">发送对象 <span style="color: #e74c3c;">*</span></label>
                        <select id="notifyTarget" class="form-control">
                            <option value="all">全体学生</option>
                            <option value="student">仅学生</option>
                            <option value="monitor">仅班委</option>
                            <optgroup label="按学院发送">
                                ${window.appData.colleges.map(c => `<option value="${c}">${c}</option>`).join('')}
                            </optgroup>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">通知内容 <span style="color: #e74c3c;">*</span></label>
                        <textarea id="notifyContent" class="form-control" rows="5" placeholder="请输入通知内容..."></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">备注（可选）</label>
                        <input type="text" id="notifyRemark" class="form-control" placeholder="可添加备注信息">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeSendModal()">取消</button>
                    <button class="btn btn-primary" onclick="sendNotification()">发送通知</button>
                </div>
            </div>
        </div>
        
        <!-- 通知详情模态框 -->
        <div id="notificationDetailModal" class="modal-overlay">
            <div class="modal" style="width: 550px;">
                <div class="modal-header">
                    <div class="modal-title" id="detailTitle"></div>
                    <button class="modal-close" onclick="closeNotificationDetailModal()">&times;</button>
                </div>
                <div class="modal-body" id="detailContent"></div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeNotificationDetailModal()">关闭</button>
                </div>
            </div>
        </div>
    `;

    // 渲染通知列表
    renderNotificationList(adminNotifications);

    // 绑定事件
    document.getElementById('searchNotification').addEventListener('input', () => filterNotifications());
    document.getElementById('filterTarget').addEventListener('change', () => filterNotifications());
    document.getElementById('refreshNotifications').addEventListener('click', () => {
        loadAdminNotifications();
    });
    document.getElementById('sendNotificationBtn').addEventListener('click', () => {
        document.getElementById('sendNotificationModal').classList.add('active');
    });
}

function renderNotificationList(notifications) {
    const listContainer = document.getElementById('admin-notification-list');
    if (!listContainer) return;

    if (notifications.length === 0) {
        listContainer.innerHTML = '<div style="text-align:center;padding:40px;">暂无通知</div>';
        return;
    }

    listContainer.innerHTML = '';

    notifications.forEach(notification => {
        const targetText = getTargetText(notification.target);
        const div = document.createElement('div');
        div.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        div.innerHTML = `
            <div class="notification-title">
                ${notification.title}
                <span style="font-size: 11px; color: #888; margin-left: 10px;">发送至: ${targetText}</span>
            </div>
            <div class="notification-content">${notification.content.substring(0, 100)}${notification.content.length > 100 ? '...' : ''}</div>
            <div class="notification-time">${notification.time}</div>
            <div style="margin-top: 10px;">
                <button class="btn btn-primary" style="background:#b8860b;padding:4px 12px;font-size:12px;" onclick="viewNotificationDetail(${notification.id})">查看详情</button>
                <button class="btn btn-danger" style="background:#e74c3c;padding:4px 12px;font-size:12px;margin-left:10px;" onclick="deleteNotification(${notification.id})">删除</button>
            </div>
            ${!notification.read ? '<div class="notification-badge"></div>' : ''}
        `;
        listContainer.appendChild(div);
    });
}

function getTargetText(target) {
    if (target === 'all') return '全体学生';
    if (target === 'student') return '仅学生';
    if (target === 'monitor') return '仅班委';
    return target;
}

function filterNotifications() {
    const search = document.getElementById('searchNotification').value.toLowerCase();
    const target = document.getElementById('filterTarget').value;

    let filtered = [...adminNotifications];

    if (search) {
        filtered = filtered.filter(n => n.title.toLowerCase().includes(search));
    }
    if (target !== 'all') {
        filtered = filtered.filter(n => n.target === target);
    }

    renderNotificationList(filtered);
}

function viewNotificationDetail(notificationId) {
    const notification = adminNotifications.find(n => n.id === notificationId);
    if (!notification) return;

    const notificationPage = document.getElementById('notification-page');
    const detailContainer = document.getElementById('notification-detail-container');

    if (!notificationPage || !detailContainer) return;

    // 隐藏通知列表页面
    notificationPage.classList.remove('active');
    notificationPage.style.display = 'none';

    // 显示详情容器
    detailContainer.style.display = 'block';
    detailContainer.classList.add('active');

    const targetText = getTargetText(notification.target);

    detailContainer.innerHTML = `
        <div class="notification-detail-container active" style="margin-top: 0;">
            <div class="notification-detail-title">${notification.title}</div>
            <div class="notification-detail-content">
                <p><strong>发送时间：</strong>${notification.time}</p>
                <p><strong>发送对象：</strong>${targetText}</p>
                <div style="background: #f9f5f0; padding: 15px; border-radius: 8px; margin-top: 10px;">${notification.content}</div>
                ${notification.remark ? `<p style="margin-top: 15px;"><strong>备注：</strong>${notification.remark}</p>` : ''}
            </div>
            <button class="back-btn" id="back-to-notifications">
                <i class="fas fa-arrow-left"></i> 返回通知列表
            </button>
        </div>
    `;

    // 标记为已读
    if (!notification.read) {
        notification.read = true;
        localStorage.setItem('notifications', JSON.stringify(adminNotifications));
        renderNotificationList(adminNotifications);
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

function closeNotificationDetailModal() {
    const modal = document.getElementById('notificationDetailModal');
    modal.classList.remove('active');
    modal.style.display = 'none';
}

function deleteNotification(notificationId) {
    if (confirm('确定要删除这条通知吗？')) {
        adminNotifications = adminNotifications.filter(n => n.id !== notificationId);
        localStorage.setItem('notifications', JSON.stringify(adminNotifications));
        renderNotificationList(adminNotifications);
        showToast('通知已删除');
    }
}

function closeSendModal() {
    const modal = document.getElementById('sendNotificationModal');
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.getElementById('notifyTitle').value = '';
    document.getElementById('notifyContent').value = '';
    document.getElementById('notifyRemark').value = '';
}

function sendNotification() {
    const title = document.getElementById('notifyTitle').value;
    const target = document.getElementById('notifyTarget').value;
    const content = document.getElementById('notifyContent').value;
    const remark = document.getElementById('notifyRemark').value;

    if (!title || !content) {
        showToast('请填写标题和内容', true);
        return;
    }

    const newNotification = {
        id: Date.now(),
        title: title,
        content: content,
        remark: remark,
        time: new Date().toLocaleString(),
        read: false,
        target: target
    };

    adminNotifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(adminNotifications));

    closeSendModal();
    renderNotificationList(adminNotifications);

    const targetText = getTargetText(target);
    showToast(`通知已发送至${targetText}`);
}