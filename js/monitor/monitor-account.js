// ==================== 班委账号管理模块 ====================

function initMonitorAccount() {
    loadMonitorAccountPage();
}

function loadMonitorAccountPage() {
    const container = document.getElementById('account-page');
    const currentUser = window.currentUser;
    if (!container) return;

    const colleges = window.appData.colleges;
    const majors = window.appData.majors;
    const classes = window.appData.classes;

    let majorOptions = '<option value="">请选择专业</option>';
    if (currentUser?.college && majors[currentUser.college]) {
        majors[currentUser.college].forEach(m => {
            majorOptions += `<option value="${m}" ${currentUser.major === m ? 'selected' : ''}>${m}</option>`;
        });
    }

    let classOptions = '<option value="">请选择班级</option>';
    if (currentUser?.major && classes[currentUser.major]) {
        classes[currentUser.major].forEach(c => {
            classOptions += `<option value="${c}" ${currentUser.className === c ? 'selected' : ''}>${c}</option>`;
        });
    }

    const savedAvatarColor = localStorage.getItem(`avatar_color_${currentUser?.id}`) || '#d4a017';

    container.innerHTML = `
        <div class="section">
            <div class="section-title">账号管理</div>
            <div class="account-tabs">
                <button class="account-tab active" data-tab="basic-info">基本信息</button>
                <button class="account-tab" data-tab="password">密码修改</button>
            </div>
            <div class="account-tab-content active" id="basic-info-tab">
                <div class="account-info">
                    <div class="account-avatar" id="monitor-account-avatar" style="background-color: ${savedAvatarColor};">${currentUser?.name?.charAt(0) || '班'}</div>
                    <div class="account-info-text">
                        <h3>${currentUser?.name || '班委'}</h3>
                        <p>学号：${currentUser?.id || '-'}</p>
                        <p>学院：${currentUser?.college || '未设置'}</p>
                        <p>专业：${currentUser?.major || '未设置'}</p>
                        <p>班级：${currentUser?.className || '未设置'}</p>
                        <p>职务：${currentUser?.monitorType || '班委'}</p>
                    </div>
                </div>
                <div style="margin-bottom: 25px; padding: 15px; background: #f9f5f0; border-radius: 12px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div class="account-avatar" id="avatar-preview" style="width: 60px; height: 60px; background-color: ${savedAvatarColor};">${currentUser?.name?.charAt(0) || '班'}</div>
                        <div>
                            <div style="font-weight: 600; margin-bottom: 8px;">修改头像</div>
                            <input type="file" id="avatarUpload" accept="image/jpeg,image/png" style="display: none;">
                            <button class="btn btn-primary" id="chooseAvatarBtn" style="background: #b8860b; padding: 6px 16px;">选择图片</button>
                            <button class="btn btn-secondary" id="resetAvatarBtn" style="padding: 6px 16px; margin-left: 10px;">恢复默认</button>
                            <button class="btn btn-primary" id="saveAvatarBtn" style="background: #2ecc71; padding: 6px 16px; margin-left: 10px;">保存头像</button>
                        </div>
                    </div>
                </div>
                <form class="account-form">
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">姓名</label><input type="text" class="form-control" id="monitor-name" value="${currentUser?.name || ''}"></div>
                        <div class="form-group"><label class="form-label">学号</label><input type="text" class="form-control" value="${currentUser?.id || ''}" readonly></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">学院</label><select class="form-control" id="monitor-college"><option value="">请选择学院</option>${colleges.map(c => `<option value="${c}" ${currentUser?.college === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
                        <div class="form-group"><label class="form-label">专业</label><select class="form-control" id="monitor-major">${majorOptions}</select></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">班级</label><select class="form-control" id="monitor-class">${classOptions}</select></div>
                        <div class="form-group"><label class="form-label">职务</label><input type="text" class="form-control" value="${currentUser?.monitorType || '班委'}" readonly></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">联系方式</label><input type="text" class="form-control" id="monitor-phone" value="${currentUser?.phone || ''}"></div>
                        <div class="form-group"><label class="form-label">电子邮箱</label><input type="email" class="form-control" id="monitor-email" value="${currentUser?.email || ''}"></div>
                    </div>
                    <div class="form-actions"><button type="button" class="cancel-btn" id="monitor-cancel-btn">取消</button><button type="button" class="save-btn" id="monitor-save-btn">保存修改</button></div>
                </form>
            </div>
            <div class="account-tab-content" id="password-tab">
                <form class="account-form" id="password-form">
                    <div class="form-group"><label class="form-label">当前密码</label><input type="password" class="form-control" id="current-password"></div>
                    <div class="form-group"><label class="form-label">新密码</label><input type="password" class="form-control" id="new-password"><div class="password-strength"><div class="password-strength-bar" id="password-strength-bar"></div></div><div class="password-hint" id="password-hint">密码强度：弱</div></div>
                    <div class="form-group"><label class="form-label">确认新密码</label><input type="password" class="form-control" id="confirm-new-password"></div>
                    <div class="form-group"><label class="form-label">手机验证码</label><div class="verification-row"><input type="text" class="form-control" id="verification-code"><button type="button" class="verification-btn" id="send-verification-code">获取验证码</button></div></div>
                    <div class="form-actions"><button type="button" class="cancel-btn" id="cancel-password">取消</button><button type="button" class="save-btn" id="save-password">修改密码</button></div>
                </form>
            </div>
        </div>
    `;

    // 学院专业联动
    const collegeSelect = document.getElementById('monitor-college');
    const majorSelect = document.getElementById('monitor-major');
    const classSelect = document.getElementById('monitor-class');
    if (collegeSelect) {
        collegeSelect.addEventListener('change', function () {
            const college = this.value;
            if (college && window.appData.majors[college]) {
                majorSelect.innerHTML = `<option value="">请选择专业</option>${window.appData.majors[college].map(m => `<option value="${m}">${m}</option>`).join('')}`;
                classSelect.innerHTML = '<option value="">请先选择专业</option>';
            } else {
                majorSelect.innerHTML = '<option value="">请先选择学院</option>';
                classSelect.innerHTML = '<option value="">请先选择专业</option>';
            }
        });
    }
    if (majorSelect) {
        majorSelect.addEventListener('change', function () {
            const major = this.value;
            if (major && window.appData.classes[major]) {
                classSelect.innerHTML = `<option value="">请选择班级</option>${window.appData.classes[major].map(c => `<option value="${c}">${c}</option>`).join('')}`;
            } else {
                classSelect.innerHTML = '<option value="">请先选择专业</option>';
            }
        });
    }

    // 头像功能
    let tempAvatarData = null;
    const fileInput = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('avatar-preview');
    const chooseBtn = document.getElementById('chooseAvatarBtn');
    const resetBtn = document.getElementById('resetAvatarBtn');
    const saveAvatarBtn = document.getElementById('saveAvatarBtn');

    if (chooseBtn && fileInput) {
        chooseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    tempAvatarData = event.target.result;
                    avatarPreview.innerHTML = `<img src="${tempAvatarData}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                    showToast('图片已选择，请点击保存头像');
                };
                reader.readAsDataURL(file);
            } else {
                showToast('请选择 JPG 或 PNG 格式的图片', true);
            }
        });
    }

    if (saveAvatarBtn) {
        saveAvatarBtn.addEventListener('click', () => {
            if (tempAvatarData) {
                localStorage.setItem(`avatar_${currentUser?.id}`, tempAvatarData);
                document.querySelectorAll('.user-avatar, .account-avatar').forEach(avatar => {
                    avatar.innerHTML = `<img src="${tempAvatarData}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                });
                showToast('头像已更新');
                tempAvatarData = null;
            } else {
                showToast('请先选择图片', true);
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            localStorage.removeItem(`avatar_${currentUser?.id}`);
            const defaultText = currentUser?.name?.charAt(0) || '班';
            document.querySelectorAll('.user-avatar, .account-avatar').forEach(avatar => {
                avatar.innerHTML = defaultText;
                avatar.style.backgroundColor = '#d4a017';
            });
            avatarPreview.innerHTML = defaultText;
            avatarPreview.style.backgroundColor = '#d4a017';
            showToast('已恢复默认头像');
        });
    }

    // 保存基本信息
    document.getElementById('monitor-save-btn')?.addEventListener('click', () => {
        const name = document.getElementById('monitor-name').value;
        const college = document.getElementById('monitor-college').value;
        const major = document.getElementById('monitor-major').value;
        const className = document.getElementById('monitor-class').value;
        const phone = document.getElementById('monitor-phone').value;
        const email = document.getElementById('monitor-email').value;
        const currentUser = window.currentUser;
        if (currentUser) {
            currentUser.name = name;
            currentUser.college = college;
            currentUser.major = major;
            currentUser.className = className;
            currentUser.phone = phone;
            currentUser.email = email;
            document.getElementById('monitor-user-name').textContent = name;
            document.getElementById('monitor-user-avatar').textContent = name.charAt(0);
            if (!localStorage.getItem(`avatar_${currentUser.id}`)) {
                document.querySelectorAll('.user-avatar, .account-avatar').forEach(avatar => {
                    avatar.innerHTML = name.charAt(0);
                });
            }
            showToast('信息保存成功');
        }
    });

    document.getElementById('monitor-cancel-btn')?.addEventListener('click', () => {
        const currentUser = window.currentUser;
        if (currentUser) {
            document.getElementById('monitor-name').value = currentUser.name || '';
            document.getElementById('monitor-college').value = currentUser.college || '';
            document.getElementById('monitor-major').value = currentUser.major || '';
            document.getElementById('monitor-class').value = currentUser.className || '';
            document.getElementById('monitor-phone').value = currentUser.phone || '';
            document.getElementById('monitor-email').value = currentUser.email || '';
        }
        showToast('已取消修改');
    });

    // 密码相关
    document.getElementById('new-password')?.addEventListener('input', function () {
        const pwd = this.value;
        let strength = 0;
        if (pwd.length >= 6) strength++;
        if (pwd.length >= 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;
        let width = 0, hint = '密码强度：';
        if (strength <= 1) { width = 20; hint += '弱'; }
        else if (strength <= 3) { width = 50; hint += '中'; }
        else { width = 100; hint += '强'; }
        document.getElementById('password-strength-bar').style.width = width + '%';
        document.getElementById('password-hint').textContent = hint;
    });

    document.getElementById('send-verification-code')?.addEventListener('click', function () {
        const phone = document.getElementById('monitor-phone').value;
        if (!phone || phone.length !== 11) { showToast('请先填写正确的手机号', true); return; }
        this.disabled = true;
        let countdown = 60;
        const timer = setInterval(() => {
            this.textContent = `${countdown}秒后重发`;
            countdown--;
            if (countdown < 0) { clearInterval(timer); this.disabled = false; this.textContent = '获取验证码'; }
        }, 1000);
        const code = Math.floor(100000 + Math.random() * 900000);
        sessionStorage.setItem('monitorVerificationCode', code.toString());
        showToast(`验证码已发送，验证码：${code}（演示）`);
    });

    document.getElementById('save-password')?.addEventListener('click', () => {
        const currentPwd = document.getElementById('current-password').value;
        const newPwd = document.getElementById('new-password').value;
        const confirmPwd = document.getElementById('confirm-new-password').value;
        const code = document.getElementById('verification-code').value;
        const storedCode = sessionStorage.getItem('monitorVerificationCode');
        const currentUser = window.currentUser;
        if (!currentPwd || !newPwd || !confirmPwd || !code) { showToast('请填写所有必填项', true); return; }
        if (currentUser?.password !== currentPwd) { showToast('当前密码不正确', true); return; }
        if (newPwd.length < 6) { showToast('新密码长度至少6位', true); return; }
        if (newPwd !== confirmPwd) { showToast('两次输入的密码不一致', true); return; }
        if (code !== storedCode) { showToast('验证码错误', true); return; }
        currentUser.password = newPwd;
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-new-password').value = '';
        document.getElementById('verification-code').value = '';
        showToast('密码修改成功');
    });

    document.getElementById('cancel-password')?.addEventListener('click', () => {
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-new-password').value = '';
        document.getElementById('verification-code').value = '';
        showToast('已取消修改');
    });
}
