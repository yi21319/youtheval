// ==================== 公共数据 ====================
window.appData = {
    studentUsers: [
        { id: "2024001", name: "张三", password: "123456", phone: "13800138001", college: "计算机学院", major: "计算机科学与技术", className: "计科2401班", email: "zhangsan@example.com", enrollmentYear: "2024", isMonitor: false },
        { id: "2024002", name: "李四", password: "123456", phone: "13800138002", college: "计算机学院", major: "计算机科学与技术", className: "计科2401班", email: "lisi@example.com", enrollmentYear: "2024", isMonitor: true, monitorType: "班长" },
        { id: "2024003", name: "王五", password: "123456", phone: "13800138003", college: "计算机学院", major: "软件工程", className: "软工2401班", email: "wangwu@example.com", enrollmentYear: "2024", isMonitor: false },
        { id: "2024004", name: "赵六", password: "123456", phone: "13800138004", college: "经管学院", major: "工商管理", className: "工商2401班", email: "zhaoliu@example.com", enrollmentYear: "2024", isMonitor: false },
        { id: "2024005", name: "钱七", password: "123456", phone: "13800138005", college: "交通学院", major: "交通工程", className: "交通2401班", email: "qianqi@example.com", enrollmentYear: "2024", isMonitor: false },
        { id: "2024006", name: "孙八", password: "123456", phone: "13800138006", college: "英语学院", major: "英语", className: "英语2401班", email: "sunba@example.com", enrollmentYear: "2024", isMonitor: false }
    ],
    adminUsers: [
        { id: "2401", name: "管理员", password: "123456", phone: "13900000000", email: "admin@example.com" }
    ],
    colleges: ["计算机学院", "经管学院", "交通学院", "英语学院"],
    majors: {
        "计算机学院": ["计算机科学与技术", "软件工程", "网络安全"],
        "经管学院": ["工商管理", "市场营销", "会计学"],
        "交通学院": ["交通工程", "交通运输", "车辆工程"],
        "英语学院": ["英语", "翻译", "商务英语"]
    },
    classes: {
        "计算机科学与技术": ["计科2401班", "计科2402班"],
        "软件工程": ["软工2401班", "软工2402班"],
        "网络安全": ["网安2401班"],
        "工商管理": ["工商2401班"],
        "市场营销": ["营销2401班"],
        "会计学": ["会计2401班"],
        "交通工程": ["交通2401班"],
        "交通运输": ["运输2401班"],
        "车辆工程": ["车辆2401班"],
        "英语": ["英语2401班"],
        "翻译": ["翻译2401班"],
        "商务英语": ["商英2401班"]
    }
};

window.currentUser = null;
window.currentRole = null;

// ==================== 公共函数 ====================
function showToast(msg, isError) {
    let toast = document.createElement('div');
    toast.style.cssText = `position:fixed;top:20px;right:20px;background:${isError ? '#e74c3c' : '#2c3e50'};color:white;padding:10px 20px;border-radius:30px;z-index:9999;animation:slideIn 0.3s ease;font-size:13px;`;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showNotification(msg) {
    showToast(msg, false);
}

function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark-theme');
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });
    }
}

function initLocalStorage() {
    if (!localStorage.getItem('studentRecords')) {
        localStorage.setItem('studentRecords', JSON.stringify([
            { id: 1, studentId: "2024001", studentName: "张三", className: "计科2401班", category: "德育", name: "社区志愿服务", date: "2024-03-10", score: 85, proof: "证明.jpg", remark: "表现优秀", status: "approved", submitTime: "2024-03-10 14:30" },
            { id: 2, studentId: "2024001", studentName: "张三", className: "计科2401班", category: "智育", name: "数学竞赛", date: "2024-03-15", score: 90, proof: "证书.pdf", remark: "一等奖", status: "approved", submitTime: "2024-03-15 10:20" },
            { id: 3, studentId: "2024002", studentName: "李四", className: "计科2401班", category: "体育", name: "校运会", date: "2024-03-20", score: 88, proof: "成绩单.jpg", remark: "第二名", status: "pending", submitTime: "2024-03-20 16:45" }
        ]));
    }
    if (!localStorage.getItem('notifications')) {
        localStorage.setItem('notifications', JSON.stringify([
            { id: 1, title: "综测填报开始", content: "本学期综测填报已开始，请及时填报", time: "2024-03-01 09:00", read: false, target: "all" },
            { id: 2, title: "审核提醒", content: "请班委及时审核本班同学提交的材料", time: "2024-03-05 10:30", read: false, target: "monitor" }
        ]));
    }
    if (!localStorage.getItem('standards')) {
        localStorage.setItem('standards', JSON.stringify(null));
    }
}

// 导出公共函数
window.showToast = showToast;
window.showNotification = showNotification;
window.initThemeToggle = initThemeToggle;
window.initLocalStorage = initLocalStorage;