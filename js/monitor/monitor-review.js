// ==================== 班委综测审核模块 ====================

// 初始化审核模块
function initMonitorReview() {
    loadMonitorReviewList();
}

// 加载审核列表页面
function loadMonitorReviewList() {
    const container = document.getElementById('review-page');
    if (!container) return;

    const currentUser = window.currentUser;
    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    // 只显示本班的记录
    const classRecords = records.filter(r => r.className === currentUser?.className);

    container.innerHTML = `
        <div class="section">
            <div class="section-title">综测审核（仅限本班）</div>
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <input type="text" id="monitor-review-search" placeholder="搜索学生姓名" style="padding: 8px; width: 200px; border-radius: 20px; border: 1px solid #ddd;">
                <select id="monitor-review-status" style="padding: 8px; border-radius: 20px; border: 1px solid #ddd;">
                    <option value="all">全部状态</option>
                    <option value="pending">待审核</option>
                    <option value="approved">已通过</option>
                    <option value="rejected">已打回</option>
                </select>
                <button class="btn btn-primary" onclick="refreshReviewList()" style="background:#b8860b;padding:8px 16px;">刷新</button>
            </div>
            <div id="monitor-review-table"></div>
        </div>
        
        <!-- 审核详情模态框 -->
        <div id="monitor-review-modal" class="modal-overlay">
            <div class="modal" style="width: 550px;">
                <div class="modal-header">
                    <div class="modal-title">审核详情</div>
                    <button class="modal-close" onclick="closeMonitorReviewModal()">&times;</button>
                </div>
                <div class="modal-body" id="monitor-review-body" style="max-height: 400px; overflow-y: auto;"></div>
                <div class="modal-footer" id="monitor-review-footer"></div>
            </div>
        </div>
    `;

    renderMonitorReviewTable(classRecords);

    // 绑定事件
    const searchInput = document.getElementById('monitor-review-search');
    const statusSelect = document.getElementById('monitor-review-status');
    if (searchInput) searchInput.addEventListener('input', () => filterMonitorReviews());
    if (statusSelect) statusSelect.addEventListener('change', () => filterMonitorReviews());
}

// 刷新审核列表
function refreshReviewList() {
    const currentUser = window.currentUser;
    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    const classRecords = records.filter(r => r.className === currentUser?.className);
    renderMonitorReviewTable(classRecords);
    // 重置搜索和筛选
    const searchInput = document.getElementById('monitor-review-search');
    const statusSelect = document.getElementById('monitor-review-status');
    if (searchInput) searchInput.value = '';
    if (statusSelect) statusSelect.value = 'all';
}

// 渲染审核表格
function renderMonitorReviewTable(records) {
    const container = document.getElementById('monitor-review-table');
    if (!container) return;

    if (records.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px;background:#f9f5f0;border-radius:8px;">
                <i class="fas fa-inbox" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                <p style="color: #999;">暂无本班审核记录</p>
            </div>
        `;
        return;
    }

    let html = '<table style="width:100%;border-collapse:collapse;"><tr style="background:#f0e6d6;"><th>学生姓名</th><th>项目名称</th><th>类别</th><th>得分</th><th>提交时间</th><th>状态</th><th>操作</th>\\n';

    records.forEach(record => {
        let statusText = '', statusClass = '';
        switch (record.status) {
            case 'pending': statusText = '待审核'; statusClass = 'status-pending'; break;
            case 'approved': statusText = '已通过'; statusClass = 'status-approved'; break;
            case 'rejected': statusText = '已打回'; statusClass = 'status-rejected'; break;
        }

        html += `
            <tr>
                <td>${record.studentName || '-'}</td>
                <td>${record.name || '-'}</td>
                <td>${record.category || '-'}</td>
                <td style="font-weight:bold;color:#b8860b;">${record.score}分</td>
                <td>${record.submitTime || record.date || '-'}</td>
                <td><span class="record-status ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-primary" style="background:#b8860b;padding:6px 14px;border-radius:4px;cursor:pointer;" onclick="showMonitorReviewDetail(${record.id})">
                        ${record.status === 'pending' ? '去审核' : '查看详情'}
                    </button>
                </td>
            </tr>
        `;
    });
    html += '</table>';
    container.innerHTML = html;
}

// 筛选审核记录
function filterMonitorReviews() {
    const currentUser = window.currentUser;
    let records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    records = records.filter(r => r.className === currentUser?.className);

    const search = document.getElementById('monitor-review-search')?.value.toLowerCase() || '';
    const status = document.getElementById('monitor-review-status')?.value || 'all';

    if (search) {
        records = records.filter(r => (r.studentName || '').toLowerCase().includes(search));
    }
    if (status !== 'all') {
        records = records.filter(r => r.status === status);
    }

    renderMonitorReviewTable(records);
}

// 显示审核详情
function showMonitorReviewDetail(recordId) {
    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    const record = records.find(r => r.id === recordId);
    if (!record) {
        showToast('记录不存在', true);
        return;
    }

    const modal = document.getElementById('monitor-review-modal');
    const body = document.getElementById('monitor-review-body');
    const footer = document.getElementById('monitor-review-footer');

    // 状态显示
    let statusText = '', statusClass = '';
    switch (record.status) {
        case 'pending': statusText = '待审核'; statusClass = 'status-pending'; break;
        case 'approved': statusText = '已通过'; statusClass = 'status-approved'; break;
        case 'rejected': statusText = '已打回'; statusClass = 'status-rejected'; break;
    }

    body.innerHTML = `
        <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            <h3 style="color: #b8860b;">${record.name}</h3>
            <p><strong>学生：</strong>${record.studentName} | <strong>班级：</strong>${record.className || '-'}</p>
            <p><strong>状态：</strong><span class="record-status ${statusClass}">${statusText}</span></p>
        </div>
        <div class="form-group"><label class="form-label">五育类别</label><input type="text" class="form-control" value="${record.category}" readonly></div>
        <div class="form-group"><label class="form-label">申请得分</label><input type="text" class="form-control" value="${record.score}分" readonly></div>
        <div class="form-group"><label class="form-label">活动时间</label><input type="text" class="form-control" value="${record.date}" readonly></div>
        <div class="form-group"><label class="form-label">证明材料</label><input type="text" class="form-control" value="${record.proof || '无'}" readonly></div>
        <div class="form-group"><label class="form-label">备注说明</label><textarea class="form-control" rows="3" readonly>${record.remark || '无'}</textarea></div>
        ${record.status === 'rejected' && record.rejectReason ? `
            <div class="form-group"><label class="form-label" style="color:#e74c3c;">打回原因</label><textarea class="form-control" rows="2" readonly>${record.rejectReason}</textarea></div>
        ` : ''}
        ${record.status === 'pending' ? `
            <div class="form-group"><label class="form-label" style="color:#e74c3c;">打回原因（可选）</label><textarea id="monitor-reject-reason" class="form-control" rows="2" placeholder="请输入打回原因..."></textarea></div>
        ` : ''}
    `;

    if (record.status === 'pending') {
        footer.innerHTML = `
            <button class="btn btn-secondary" onclick="closeMonitorReviewModal()">取消</button>
            <button class="btn btn-primary" style="background:#2ecc71;" onclick="monitorApprove(${record.id})">✓ 通过</button>
            <button class="btn btn-primary" style="background:#e74c3c;" onclick="monitorReject(${record.id})">✗ 打回</button>
        `;
    } else {
        footer.innerHTML = `<button class="btn btn-secondary" onclick="closeMonitorReviewModal()">关闭</button>`;
    }

    modal.classList.add('active');
    modal.style.display = 'flex';
}

// 关闭审核模态框
function closeMonitorReviewModal() {
    const modal = document.getElementById('monitor-review-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// 通过审核
function monitorApprove(recordId) {
    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    const record = records.find(r => r.id === recordId);
    if (record) {
        record.status = 'approved';
        record.reviewBy = 'monitor';
        record.reviewTime = new Date().toLocaleString();
        localStorage.setItem('studentRecords', JSON.stringify(records));
        showToast(`已通过 ${record.studentName} 的“${record.name}”申请`);
        closeMonitorReviewModal();
        filterMonitorReviews();

        // 刷新首页的统计数据
        if (typeof refreshMonitorHome === 'function') refreshMonitorHome();
    }
}

// 打回审核
function monitorReject(recordId) {
    const reason = document.getElementById('monitor-reject-reason')?.value || '未通过审核';
    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    const record = records.find(r => r.id === recordId);
    if (record) {
        record.status = 'rejected';
        record.rejectReason = reason;
        record.reviewBy = 'monitor';
        record.reviewTime = new Date().toLocaleString();
        localStorage.setItem('studentRecords', JSON.stringify(records));
        showToast(`已打回 ${record.studentName} 的申请，原因：${reason}`);
        closeMonitorReviewModal();
        filterMonitorReviews();

        // 刷新首页的统计数据
        if (typeof refreshMonitorHome === 'function') refreshMonitorHome();
    }
}