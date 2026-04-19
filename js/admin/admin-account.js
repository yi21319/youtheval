// ==================== 管理员账号管理模块 ====================

function initAdminAccount() {
    loadAdminAccountPage();
}

function loadAdminAccountPage() {
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
            
            <div class="account-tab-content active" id="basic-info-tab">
                <div class="account-info">
                    <div class="account-avatar" id="admin-account-avatar">管</div>
                    <div class="account-info-text">
                        <h3 id="admin-account-name">${currentUser?.name || '管理员'}</h3>
                        <p id="admin-account-id">工号：${currentUser?.id || '2401'}</p>
                        <p>角色：系统管理员</p>
                    </div>
                </div>
                <form class="account-form" id="admin-basic-info-form">
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">姓名</label><input type="text" class="form-control" id="admin-name-input" value="${currentUser?.name || '管理员'}"></div>
                        <div class="form-group"><label class="form-label">工号</label><input type="text" class="form-control" id="admin-id-input" value="${currentUser?.id || '2401'}" readonly></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">联系电话</label><input type="text" class="form-control" id="admin-phone" value="${currentUser?.phone || ''}"></div>
                        <div class="form-group"><label class="form-label">电子邮箱</label><input type="email" class="form-control" id="admin-email" value="${currentUser?.email || ''}"></div>
                    </div>
                    <div class="form-actions"><button type="button" class="cancel-btn" id="admin-cancel-basic-info">取消</button><button type="button" class="save-btn" id="admin-save-basic-info">保存修改</button></div>
                </form>
            </div>
            
            <div class="account-tab-content" id="password-tab">
                <form class="account-form" id="admin-password-form">
                    <div class="form-group"><label class="form-label">当前密码</label><input type="password" class="form-control" id="admin-current-password"></div>
                    <div class="form-group"><label class="form-label">新密码</label><input type="password" class="form-control" id="admin-new-password"><div class="password-strength"><div class="password-strength-bar" id="admin-password-strength-bar"></div></div><div class="password-hint" id="admin-password-hint">密码强度：弱</div></div>
                    <div class="form-group"><label class="form-label">确认新密码</label><input type="password" class="form-control" id="admin-confirm-new-password"></div>
                    <div class="form-actions"><button type="button" class="cancel-btn" id="admin-cancel-password">取消</button><button type="button" class="save-btn" id="admin-save-password">修改密码</button></div>
                </form>
            </div>
        </div>
    `;

    // 标签页切换
    document.querySelectorAll('#account-page .account-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('#account-page .account-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('#account-page .account-tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // 头像点击
    document.getElementById('admin-account-avatar').addEventListener('click', function () {
        const colors = ['#d4a017', '#b8860b', '#a0522d', '#8b4513'];
        this.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        showNotification('头像颜色已更新');
    });

    // 密码强度检测
    document.getElementById('admin-new-password').addEventListener('input', function () {
        checkAdminPasswordStrength(this.value);
    });

    // 保存基本信息
    document.getElementById('admin-save-basic-info').addEventListener('click', () => {
        const name = document.getElementById('admin-name-input').value;
        const phone = document.getElementById('admin-phone').value;
        const email = document.getElementById('admin-email').value;

        const currentUser = window.currentUser;
        if (currentUser) {
            currentUser.name = name;
            currentUser.phone = phone;
            currentUser.email = email;

            document.getElementById('admin-account-name').textContent = name;
            document.getElementById('admin-account-avatar').textContent = name.charAt(0);
            document.getElementById('admin-user-name').textContent = name;
            document.getElementById('admin-user-avatar').textContent = name.charAt(0);

            const adminIndex = window.appData.adminUsers.findIndex(u => u.id === currentUser.id);
            if (adminIndex !== -1) {
                window.appData.adminUsers[adminIndex] = currentUser;
            }
            showToast('基本信息更新成功');
        }
    });

    // 取消基本信息
    document.getElementById('admin-cancel-basic-info').addEventListener('click', () => {
        const currentUser = window.currentUser;
        if (currentUser) {
            document.getElementById('admin-name-input').value = currentUser.name || '管理员';
            document.getElementById('admin-phone').value = currentUser.phone || '';
            document.getElementById('admin-email').value = currentUser.email || '';
        }
        showToast('已取消修改');
    });

    // 修改密码
    document.getElementById('admin-save-password').addEventListener('click', () => {
        const currentPwd = document.getElementById('admin-current-password').value;
        const newPwd = document.getElementById('admin-new-password').value;
        const confirmPwd = document.getElementById('admin-confirm-new-password').value;

        const currentUser = window.currentUser;

        if (!currentPwd || !newPwd || !confirmPwd) {
            showToast('请填写所有必填项', true);
            return;
        }
        if (currentUser && currentUser.password !== currentPwd) {
            showToast('当前密码不正确', true);
            return;
        }
        if (newPwd.length < 6) {
            showToast('新密码长度至少6位', true);
            return;
        }
        if (newPwd !== confirmPwd) {
            showToast('两次输入的密码不一致', true);
            return;
        }

        if (currentUser) {
            currentUser.password = newPwd;
            const adminIndex = window.appData.adminUsers.findIndex(u => u.id === currentUser.id);
            if (adminIndex !== -1) {
                window.appData.adminUsers[adminIndex] = currentUser;
            }
            document.getElementById('admin-current-password').value = '';
            document.getElementById('admin-new-password').value = '';
            document.getElementById('admin-confirm-new-password').value = '';
            showToast('密码修改成功');
        }
    });

    // 取消密码修改
    document.getElementById('admin-cancel-password').addEventListener('click', () => {
        document.getElementById('admin-current-password').value = '';
        document.getElementById('admin-new-password').value = '';
        document.getElementById('admin-confirm-new-password').value = '';
        showToast('已取消修改');
    });
}

function checkAdminPasswordStrength(password) {
    const strengthBar = document.getElementById('admin-password-strength-bar');
    const passwordHint = document.getElementById('admin-password-hint');
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