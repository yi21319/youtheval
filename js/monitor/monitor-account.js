// ==================== 班委账号管理模块 ====================

function initMonitorAccount() {
    loadMonitorAccountPage();
}

function loadMonitorAccountPage() {
    const container = document.getElementById('account-page');
    const currentUser = window.currentUser;

    if (!container) return;

    container.innerHTML = `
        <div class="section">
            <div class="section-title">账号管理</div>
            
            <div class="account-info">
                <div class="account-avatar" id="monitor-account-avatar">${currentUser?.name?.charAt(0) || '班'}</div>
                <div class="account-info-text">
                    <h3>${currentUser?.name || '班委'}</h3>
                    <p>学号：${currentUser?.id || '-'}</p>
                    <p>班级：${currentUser?.className || '-'}</p>
                    <p>职务：${currentUser?.monitorType || '班委'}</p>
                </div>
            </div>
            
            <form class="account-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">姓名</label>
                        <input type="text" class="form-control" id="monitor-name" value="${currentUser?.name || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">学号</label>
                        <input type="text" class="form-control" value="${currentUser?.id || ''}" readonly>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">班级</label>
                        <input type="text" class="form-control" value="${currentUser?.className || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label class="form-label">职务</label>
                        <input type="text" class="form-control" value="${currentUser?.monitorType || '班委'}" readonly>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">联系方式</label>
                        <input type="text" class="form-control" id="monitor-phone" value="${currentUser?.phone || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">电子邮箱</label>
                        <input type="email" class="form-control" id="monitor-email" value="${currentUser?.email || ''}">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-btn" id="monitor-cancel-btn">取消</button>
                    <button type="button" class="save-btn" id="monitor-save-btn">保存修改</button>
                </div>
            </form>
        </div>
    `;

    // 头像点击
    const avatar = document.getElementById('monitor-account-avatar');
    if (avatar) {
        avatar.addEventListener('click', function () {
            const colors = ['#d4a017', '#b8860b', '#a0522d', '#8b4513'];
            this.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            showNotification('头像颜色已更新');
        });
    }

    // 保存
    const saveBtn = document.getElementById('monitor-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = document.getElementById('monitor-name').value;
            const phone = document.getElementById('monitor-phone').value;
            const email = document.getElementById('monitor-email').value;

            const currentUser = window.currentUser;
            if (currentUser) {
                currentUser.name = name;
                currentUser.phone = phone;
                currentUser.email = email;

                document.getElementById('monitor-user-name').textContent = name;
                document.getElementById('monitor-user-avatar').textContent = name.charAt(0);
                document.getElementById('monitor-account-avatar').textContent = name.charAt(0);

                const userIndex = window.appData.studentUsers.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    window.appData.studentUsers[userIndex] = currentUser;
                }

                showToast('信息保存成功');
            }
        });
    }

    // 取消
    const cancelBtn = document.getElementById('monitor-cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            const currentUser = window.currentUser;
            if (currentUser) {
                document.getElementById('monitor-name').value = currentUser.name || '';
                document.getElementById('monitor-phone').value = currentUser.phone || '';
                document.getElementById('monitor-email').value = currentUser.email || '';
            }
            showToast('已取消修改');
        });
    }
}