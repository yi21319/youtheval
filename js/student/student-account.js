// ==================== 学生账号管理模块 ====================

function initStudentAccount() {
    loadStudentAccountPage();
}

function loadStudentAccountPage() {
    const container = document.getElementById('account-page');
    const currentUser = window.currentUser;

    if (!container) return;

    container.innerHTML = `
        <div class="section">
            <div class="section-title">账号管理</div>
            
            <div class="account-tabs">
                <button class="account-tab active" data-tab="basic-info">基本信息</button>
                <button class="account-tab" data-tab="password">密码修改</button>
            </div>
            
            <!-- 基本信息标签页 -->
            <div class="account-tab-content active" id="basic-info-tab">
                <div class="account-info">
                    <div class="account-avatar" id="student-account-avatar">${currentUser?.name?.charAt(0) || '学'}</div>
                    <div class="account-info-text">
                        <h3 id="account-name">${currentUser?.name || '学生'}</h3>
                        <p id="account-id">学号：${currentUser?.id || '-'}</p>
                        <p id="account-major">专业：${currentUser?.major || '-'}</p>
                    </div>
                </div>
                
                <form class="account-form" id="basic-info-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">姓名</label>
                            <input type="text" class="form-control" id="account-name-input" value="${currentUser?.name || ''}" placeholder="请输入姓名">
                        </div>
                        <div class="form-group">
                            <label class="form-label">学号</label>
                            <input type="text" class="form-control" id="account-id-input" value="${currentUser?.id || ''}" readonly>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">学院</label>
                            <input type="text" class="form-control" id="account-college" value="${currentUser?.college || ''}" placeholder="请输入学院">
                        </div>
                        <div class="form-group">
                            <label class="form-label">专业</label>
                            <input type="text" class="form-control" id="account-major-input" value="${currentUser?.major || ''}" placeholder="请输入专业">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">班级</label>
                            <input type="text" class="form-control" id="account-class" value="${currentUser?.className || ''}" placeholder="请输入班级">
                        </div>
                        <div class="form-group">
                            <label class="form-label">联系方式</label>
                            <input type="text" class="form-control" id="account-phone" value="${currentUser?.phone || ''}" placeholder="请输入手机号">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">电子邮箱</label>
                            <input type="email" class="form-control" id="account-email" value="${currentUser?.email || ''}" placeholder="请输入邮箱">
                        </div>
                        <div class="form-group">
                            <label class="form-label">入学年份</label>
                            <input type="text" class="form-control" id="account-enrollment-year" value="${currentUser?.enrollmentYear || ''}" placeholder="请输入入学年份">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="cancel-btn" id="cancel-basic-info">取消</button>
                        <button type="button" class="save-btn" id="save-basic-info">保存修改</button>
                    </div>
                </form>
            </div>
            
            <!-- 密码修改标签页 -->
            <div class="account-tab-content" id="password-tab">
                <form class="account-form" id="password-form">
                    <div class="form-group">
                        <label class="form-label">当前密码</label>
                        <input type="password" class="form-control" id="current-password" placeholder="请输入当前密码">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">新密码</label>
                        <input type="password" class="form-control" id="new-password" placeholder="请输入新密码（至少6位）">
                        <div class="password-strength">
                            <div class="password-strength-bar" id="password-strength-bar"></div>
                        </div>
                        <div class="password-hint" id="password-hint">密码强度：弱</div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">确认新密码</label>
                        <input type="password" class="form-control" id="confirm-new-password" placeholder="请再次输入新密码">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">手机验证码</label>
                        <div class="verification-row">
                            <input type="text" class="form-control" id="verification-code" placeholder="请输入验证码">
                            <button type="button" class="verification-btn" id="send-verification-code">获取验证码</button>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="cancel-btn" id="cancel-password">取消</button>
                        <button type="button" class="save-btn" id="save-password">修改密码</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    bindStudentAccountEvents();
}

function bindStudentAccountEvents() {
    // 标签页切换
    const tabs = document.querySelectorAll('#account-page .account-tab');
    const contents = document.querySelectorAll('#account-page .account-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // 头像点击
    const avatar = document.getElementById('student-account-avatar');
    if (avatar) {
        avatar.addEventListener('click', function () {
            const colors = ['#d4a017', '#b8860b', '#a0522d', '#8b4513', '#daa520'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.style.backgroundColor = randomColor;
            showNotification('头像颜色已更新');
        });
    }

    // 密码强度检测
    const newPassword = document.getElementById('new-password');
    if (newPassword) {
        newPassword.addEventListener('input', function () {
            checkStudentPasswordStrength(this.value);
        });
    }

    // 发送验证码
    const sendCodeBtn = document.getElementById('send-verification-code');
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', function () {
            const phone = document.getElementById('account-phone').value;
            if (!phone || phone.length !== 11) {
                showToast('请先填写正确的手机号', true);
                return;
            }

            this.disabled = true;
            let countdown = 60;
            const timer = setInterval(() => {
                this.textContent = `${countdown}秒后重发`;
                countdown--;
                if (countdown < 0) {
                    clearInterval(timer);
                    this.disabled = false;
                    this.textContent = '获取验证码';
                }
            }, 1000);

            const code = Math.floor(100000 + Math.random() * 900000);
            sessionStorage.setItem('studentVerificationCode', code.toString());
            showToast(`验证码已发送至${phone}，验证码：${code}（演示）`);
        });
    }

    // 保存基本信息
    const saveBasicBtn = document.getElementById('save-basic-info');
    if (saveBasicBtn) {
        saveBasicBtn.addEventListener('click', function () {
            const name = document.getElementById('account-name-input').value;
            const college = document.getElementById('account-college').value;
            const major = document.getElementById('account-major-input').value;
            const className = document.getElementById('account-class').value;
            const phone = document.getElementById('account-phone').value;
            const email = document.getElementById('account-email').value;
            const enrollmentYear = document.getElementById('account-enrollment-year').value;

            if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
                showToast('手机号格式不正确', true);
                return;
            }

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('邮箱格式不正确', true);
                return;
            }

            const currentUser = window.currentUser;
            if (currentUser) {
                currentUser.name = name;
                currentUser.college = college;
                currentUser.major = major;
                currentUser.className = className;
                currentUser.phone = phone;
                currentUser.email = email;
                currentUser.enrollmentYear = enrollmentYear;

                // 更新显示
                document.getElementById('account-name').textContent = name;
                document.getElementById('account-major').textContent = `专业：${major}`;
                document.getElementById('student-user-name').textContent = name;
                document.getElementById('student-user-avatar').textContent = name.charAt(0);
                document.getElementById('student-account-avatar').textContent = name.charAt(0);

                // 更新全局数据
                const userIndex = window.appData.studentUsers.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    window.appData.studentUsers[userIndex] = currentUser;
                }

                showToast('基本信息更新成功');
            }
        });
    }

    // 取消基本信息
    const cancelBasicBtn = document.getElementById('cancel-basic-info');
    if (cancelBasicBtn) {
        cancelBasicBtn.addEventListener('click', function () {
            const currentUser = window.currentUser;
            if (currentUser) {
                document.getElementById('account-name-input').value = currentUser.name || '';
                document.getElementById('account-college').value = currentUser.college || '';
                document.getElementById('account-major-input').value = currentUser.major || '';
                document.getElementById('account-class').value = currentUser.className || '';
                document.getElementById('account-phone').value = currentUser.phone || '';
                document.getElementById('account-email').value = currentUser.email || '';
                document.getElementById('account-enrollment-year').value = currentUser.enrollmentYear || '';
            }
            showToast('已取消修改');
        });
    }

    // 修改密码
    const savePasswordBtn = document.getElementById('save-password');
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', function () {
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-new-password').value;
            const verificationCode = document.getElementById('verification-code').value;
            const storedCode = sessionStorage.getItem('studentVerificationCode');

            if (!currentPassword || !newPassword || !confirmPassword || !verificationCode) {
                showToast('请填写所有必填项', true);
                return;
            }

            const currentUser = window.currentUser;
            if (!currentUser || currentUser.password !== currentPassword) {
                showToast('当前密码不正确', true);
                return;
            }

            if (newPassword.length < 6) {
                showToast('新密码长度至少6位', true);
                return;
            }

            if (newPassword !== confirmPassword) {
                showToast('两次输入的密码不一致', true);
                return;
            }

            if (verificationCode !== storedCode) {
                showToast('验证码错误', true);
                return;
            }

            currentUser.password = newPassword;

            const userIndex = window.appData.studentUsers.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                window.appData.studentUsers[userIndex] = currentUser;
            }

            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-new-password').value = '';
            document.getElementById('verification-code').value = '';

            showToast('密码修改成功');
        });
    }

    // 取消密码修改
    const cancelPasswordBtn = document.getElementById('cancel-password');
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', function () {
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-new-password').value = '';
            document.getElementById('verification-code').value = '';
            showToast('已取消修改');
        });
    }
}

function checkStudentPasswordStrength(password) {
    const strengthBar = document.getElementById('password-strength-bar');
    const passwordHint = document.getElementById('password-hint');

    if (!strengthBar || !passwordHint) return;

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    let width = 0, color = '', hint = '密码强度：';
    switch (strength) {
        case 0:
        case 1: width = 20; color = '#e74c3c'; hint += '弱'; break;
        case 2:
        case 3: width = 50; color = '#f39c12'; hint += '中'; break;
        case 4:
        case 5: width = 100; color = '#2ecc71'; hint += '强'; break;
    }

    strengthBar.style.width = `${width}%`;
    strengthBar.style.backgroundColor = color;
    passwordHint.textContent = hint;
}