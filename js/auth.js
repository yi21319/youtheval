// ==================== 登录认证模块 ====================

// 短信验证码相关
function sendSmsCode() {
    let phone = document.getElementById('regPhone').value;
    if (!phone || phone.length < 11) {
        showToast("请输入11位手机号", true);
        return;
    }
    let code = Math.floor(100000 + Math.random() * 900000);
    sessionStorage.setItem("smsCode", code.toString());
    showToast(`验证码: ${code} (演示)`);
}

function sendForgotSmsCode() {
    let phone = document.getElementById('forgotPhone').value;
    if (!phone || phone.length < 11) {
        showToast("请输入11位手机号", true);
        return;
    }
    let user = window.appData.studentUsers.find(u => u.phone === phone);
    if (!user) {
        showToast("该手机号未注册", true);
        return;
    }
    let code = Math.floor(100000 + Math.random() * 900000);
    sessionStorage.setItem("forgotSmsCode", code.toString());
    sessionStorage.setItem("resetPhone", phone);
    showToast(`验证码: ${code} (演示)`);
}

function resetPassword() {
    let code = document.getElementById('forgotCode').value;
    let newPwd = document.getElementById('forgotNewPwd').value;
    let confirmPwd = document.getElementById('forgotConfirmPwd').value;
    let storedCode = sessionStorage.getItem("forgotSmsCode");
    let resetPhone = sessionStorage.getItem("resetPhone");

    if (!code || !newPwd) {
        showToast("请填写完整信息", true);
        return;
    }
    if (newPwd !== confirmPwd) {
        showToast("两次新密码不一致", true);
        return;
    }
    if (newPwd.length < 6) {
        showToast("密码长度至少6位", true);
        return;
    }
    if (storedCode !== code) {
        showToast("验证码错误", true);
        return;
    }

    let user = window.appData.studentUsers.find(u => u.phone === resetPhone);
    if (user) {
        user.password = newPwd;
        showToast("密码重置成功！请登录");
        document.getElementById('forgotPanel').classList.remove('active');
        document.getElementById('forgotPhone').value = '';
        document.getElementById('forgotCode').value = '';
        document.getElementById('forgotNewPwd').value = '';
        document.getElementById('forgotConfirmPwd').value = '';
        sessionStorage.removeItem("forgotSmsCode");
        sessionStorage.removeItem("resetPhone");
    }
}

function handleRegister() {
    let name = document.getElementById('regName').value;
    let id = document.getElementById('regId').value;
    let pwd = document.getElementById('regPassword').value;
    let confirm = document.getElementById('regConfirm').value;
    let phone = document.getElementById('regPhone').value;
    let code = document.getElementById('regCode').value;
    let storedCode = sessionStorage.getItem("smsCode");

    if (!name || !id || !pwd || !phone) {
        showToast("请填写完整信息", true);
        return;
    }
    if (pwd !== confirm) {
        showToast("两次密码不一致", true);
        return;
    }
    if (pwd.length < 6) {
        showToast("密码长度至少6位", true);
        return;
    }
    if (window.appData.studentUsers.find(u => u.id === id)) {
        showToast("学号已存在", true);
        return;
    }
    if (storedCode !== code) {
        showToast("验证码错误", true);
        return;
    }

    window.appData.studentUsers.push({
        id, name, phone, password: pwd,
        college: "", major: "", className: "",
        isMonitor: false
    });
    showToast("注册成功！请登录");
    document.getElementById('authContainer').classList.remove('right-panel-active');
    document.getElementById('regName').value = '';
    document.getElementById('regId').value = '';
    document.getElementById('regClass').value = '';
    document.getElementById('regPhone').value = '';
    document.getElementById('regCode').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regConfirm').value = '';
}

// 根据账号自动判断身份
function getUserRole(username, password) {
    // 先检查是否是管理员
    let admin = window.appData.adminUsers.find(u => u.id === username && u.password === password);
    if (admin) {
        return { role: 'admin', user: admin };
    }

    // 检查是否是学生（包含班委）
    let student = window.appData.studentUsers.find(u => u.id === username && u.password === password);
    if (student) {
        if (student.isMonitor === true) {
            return { role: 'monitor', user: student };
        }
        return { role: 'student', user: student };
    }

    return null;
}

// 加载对应系统
function loadSystem(role, user) {
    const authSystem = document.getElementById('authSystem');
    const studentSystem = document.getElementById('studentSystem');
    const monitorSystem = document.getElementById('monitorSystem');
    const adminSystem = document.getElementById('adminSystem');

    authSystem.style.display = 'none';

    if (role === 'student') {
        studentSystem.style.display = 'block';
        monitorSystem.style.display = 'none';
        adminSystem.style.display = 'none';
        if (typeof initStudentSystem === 'function') initStudentSystem(user);
    } else if (role === 'monitor') {
        monitorSystem.style.display = 'block';
        studentSystem.style.display = 'none';
        adminSystem.style.display = 'none';
        if (typeof initMonitorSystem === 'function') initMonitorSystem(user);
    } else if (role === 'admin') {
        adminSystem.style.display = 'block';
        studentSystem.style.display = 'none';
        monitorSystem.style.display = 'none';
        if (typeof initAdminSystem === 'function') initAdminSystem(user);
    }
}

function handleLogin() {
    let username = document.getElementById('loginUsername').value;
    let pwd = document.getElementById('loginPassword').value;

    if (!username || !pwd) {
        showToast("请填写完整信息", true);
        return;
    }

    let result = getUserRole(username, pwd);

    if (result) {
        window.currentUser = result.user;
        window.currentRole = result.role;

        let roleName = result.role === 'student' ? '学生' : (result.role === 'monitor' ? '班委' : '管理员');
        showToast(`欢迎${result.user.name}！您已作为${roleName}登录`);
        setTimeout(() => loadSystem(result.role, result.user), 500);
    } else {
        showToast("账号或密码错误", true);
    }
}