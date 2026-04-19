// ==================== 学生信息通知模块 ====================

let studentNotifications = [];

function initStudentNotification() {
    loadStudentNotifications();
}

function loadStudentNotifications() {
    const stored = localStorage.getItem('studentNotifications');
    if (stored) {
        studentNotifications = JSON.parse(stored);
    } else {
        studentNotifications = [
            {
                id: 1,
                title: '2023-2024学年第一学期综测填报开始',
                content: '本学期综合素质测评填报工作已正式开始，请各位同学及时登录系统进行填报。',
                time: '2023-09-01 10:30',
                read: false,
                detail: '各位同学：\n\n2023-2024学年第一学期综合素质测评填报工作现已正式开始。请各位同学于9月1日至9月30日期间登录系统完成填报。\n\n填报注意事项：\n1. 请确保填写信息真实准确\n2. 上传证明材料需清晰可辨\n3. 如有疑问请及时联系辅导员\n\n学生工作处\n2023年9月1日'
            },
            {
                id: 2,
                title: '综测填报材料审核提醒',
                content: '您提交的综测填报材料已进入审核阶段，请关注审核结果。',
                time: '2023-09-15 14:20',
                read: false,
                detail: '尊敬的同学：\n\n您提交的综合素质测评材料已进入审核阶段。审核工作预计需要3-5个工作日，请耐心等待。\n\n审核过程中如有问题，审核老师会通过系统消息通知您，请及时关注。\n\n审核通过后，您的综测成绩将正式生效。如有任何疑问，请联系本班辅导员。\n\n学生工作处\n2023年9月15日'
            },
            {
                id: 3,
                title: '综测成绩公示通知',
                content: '2023-2024学年第一学期综测成绩已公示，请各位同学核对。',
                time: '2023-10-10 09:15',
                read: true,
                detail: '各位同学：\n\n2023-2024学年第一学期综合素质测评成绩现已公示。公示期为2023年10月10日至10月17日，共7天。\n\n请各位同学登录系统查看自己的成绩，如有异议，请在公示期内向本班辅导员提出书面申诉。\n\n公示期结束后，成绩将正式生效，作为评奖评优、推优入党等重要依据。\n\n学生工作处\n2023年10月10日'
            },
            {
                id: 4,
                title: '综测填报系统维护通知',
                content: '系统将于本周六凌晨进行维护，期间无法访问，请合理安排填报时间。',
                time: '2023-09-20 16:45',
                read: false,
                detail: '系统维护通知：\n\n为提升系统性能，综测填报系统将于2023年9月23日（周六）凌晨0:00至6:00进行系统维护升级。\n\n维护期间系统将无法访问，请各位同学合理安排填报时间，避开维护时段。\n\n由此带来的不便，敬请谅解。\n\n信息化建设与管理处\n2023年9月20日'
            },
            {
                id: 5,
                title: '关于综测证明材料上传规范的说明',
                content: '请严格按照要求上传证明材料，不符合规范的材料将影响审核进度。',
                time: '2023-09-05 11:10',
                read: true,
                detail: '关于综合素质测评证明材料上传规范的说明：\n\n为确保审核工作顺利进行，请各位同学严格按照以下规范上传证明材料：\n\n1. 图片格式：JPG、PNG格式，大小不超过5MB\n2. 文档格式：PDF、Word、Excel格式，大小不超过10MB\n3. 证明材料必须清晰可辨，包含必要的信息\n4. 证书类材料需包含颁发单位、证书编号、获奖人姓名\n5. 活动证明需包含主办单位、活动时间、参与证明\n\n不符合规范的材料将被退回，请按要求重新上传。\n\n学生工作处\n2023年9月5日'
            }
        ];
        localStorage.setItem('studentNotifications', JSON.stringify(studentNotifications));
    }

    renderStudentNotifications();
}

function renderStudentNotifications() {
    const container = document.getElementById('notification-page');
    if (!container) return;

    container.innerHTML = `
        <div class="section">
            <div class="section-title">
                信息通知
                <button class="mark-all-read" id="mark-all-read-btn">
                    <i class="fas fa-check-double"></i> 一键已读
                </button>
            </div>
            <div class="notification-header">
                <h3>综测填报相关通知</h3>
            </div>
            <ul class="notification-list" id="student-notification-list"></ul>
        </div>
    `;

    const listContainer = document.getElementById('student-notification-list');
    listContainer.innerHTML = '';

    studentNotifications.forEach(notification => {
        const li = document.createElement('li');
        li.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        li.innerHTML = `
            <div class="notification-title">${notification.title}</div>
            <div class="notification-content">${notification.content}</div>
            <div class="notification-time">${notification.time}</div>
            ${!notification.read ? '<div class="notification-badge"></div>' : ''}
        `;
        li.addEventListener('click', () => showStudentNotificationDetail(notification));
        listContainer.appendChild(li);
    });

    // 一键已读按钮
    const markAllBtn = document.getElementById('mark-all-read-btn');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', () => {
            studentNotifications.forEach(n => n.read = true);
            localStorage.setItem('studentNotifications', JSON.stringify(studentNotifications));
            renderStudentNotifications();
            showNotification('所有通知已标记为已读');
        });
    }
}
function showStudentNotificationDetail(notification) {
    const notificationPage = document.getElementById('notification-page');
    const detailContainer = document.getElementById('notification-detail-container');

    if (!notificationPage || !detailContainer) return;

    // 隐藏通知列表页面
    notificationPage.classList.remove('active');
    notificationPage.style.display = 'none';

    // 显示详情容器
    detailContainer.style.display = 'block';
    detailContainer.classList.add('active');

    detailContainer.innerHTML = `
        <div class="notification-detail-container active" style="margin-top: 0;">
            <div class="notification-detail-title">${notification.title}</div>
            <div class="notification-detail-content">${notification.detail.replace(/\n/g, '<br>')}</div>
            <div class="notification-detail-meta">
                <span>发布时间：${notification.time}</span>
                <span>通知类型：综测填报</span>
            </div>
            <button class="back-btn" id="back-to-notifications">
                <i class="fas fa-arrow-left"></i> 返回通知列表
            </button>
        </div>
    `;

    // 标记为已读
    if (!notification.read) {
        notification.read = true;
        localStorage.setItem('studentNotifications', JSON.stringify(studentNotifications));
        renderStudentNotifications();
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