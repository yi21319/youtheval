// ==================== 综测审核模块 ====================

function initAdminReview() {
    loadAdminReviewList();
}

function loadAdminReviewList() {
    const container = document.getElementById('review-page');
    if (!container) return;

    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];

    container.innerHTML = `
        <div class="section">
            <div class="section-title">综测审核</div>
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <input type="text" id="reviewSearch" placeholder="搜索学生姓名" style="padding: 8px; width: 200px; border-radius: 20px;">
                <select id="reviewStatusFilter" style="padding: 8px; border-radius: 20px;">
                    <option value="all">全部状态</option>
                    <option value="pending">待审核</option>
                    <option value="approved">已通过</option>
                    <option value="rejected">已打回</option>
                </select>
                <select id="reviewCollegeFilter" style="padding: 8px; border-radius: 20px;">
                    <option value="">全部学院</option>
                    ${window.appData.colleges.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </div>
            <div id="reviewTable"></div>
        </div>
        
        <!-- 审核详情模态框 -->
        <div id="reviewDetailModal" class="modal-overlay">
            <div class="modal" style="width: 550px;">
                <div class="modal-header">
                    <div class="modal-title">审核详情</div>
                    <button class="modal-close" onclick="closeReviewModal()">&times;</button>
                </div>
                <div class="modal-body" id="reviewDetailBody"></div>
                <div class="modal-footer" id="reviewModalFooter"></div>
            </div>
        </div>
    `;

    // 绑定筛选事件
    document.getElementById('reviewSearch').addEventListener('input', () => filterReviews());
    document.getElementById('reviewStatusFilter').addEventListener('change', () => filterReviews());
    document.getElementById('reviewCollegeFilter').addEventListener('change', () => filterReviews());

    renderReviewTable(records);
}

function renderReviewTable(records) {
    const container = document.getElementById('reviewTable');
    if (!container) return;

    if (records.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;">暂无审核记录</div>';
        return;
    }

    let html = '<table style="width:100%;border-collapse:collapse;"><tr style="background:#f0e6d6;"><th>学生姓名</th><th>项目名称</th><th>类别</th><th>班级</th><th>得分</th><th>提交时间</th><th>状态</th><th>操作</th></tr>';

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
                <td>${record.name}</td>
                <td>${record.category}</td>
                <td>${record.className || '-'}</td>
                <td>${record.score}分</td>
                <td>${record.submitTime || '-'}</td>
                <td><span class="record-status ${statusClass}">${statusText}</span></td>
                <td><button class="btn btn-primary" style="background:#b8860b;padding:4px 12px;" onclick="showReviewDetail(${record.id})">${record.status === 'pending' ? '审核' : '查看'}</button></td>
            </tr>
        `;
    });
    html += '</table>';
    container.innerHTML = html;
}

function filterReviews() {
    let records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    const search = document.getElementById('reviewSearch').value.toLowerCase();
    const status = document.getElementById('reviewStatusFilter').value;
    const college = document.getElementById('reviewCollegeFilter').value;

    if (search) {
        records = records.filter(r => (r.studentName || '').toLowerCase().includes(search));
    }
    if (status !== 'all') {
        records = records.filter(r => r.status === status);
    }
    if (college) {
        records = records.filter(r => {
            const student = window.appData.studentUsers.find(s => s.id === r.studentId);
            return student && student.college === college;
        });
    }

    renderReviewTable(records);
}

function showReviewDetail(recordId) {
    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    const modal = document.getElementById('reviewDetailModal');
    const body = document.getElementById('reviewDetailBody');
    const footer = document.getElementById('reviewModalFooter');

    body.innerHTML = `
        <div class="form-group"><label>学生姓名</label><input type="text" class="form-control" value="${record.studentName || '-'}" readonly></div>
        <div class="form-group"><label>班级</label><input type="text" class="form-control" value="${record.className || '-'}" readonly></div>
        <div class="form-group"><label>项目名称</label><input type="text" class="form-control" value="${record.name}" readonly></div>
        <div class="form-group"><label>五育类别</label><input type="text" class="form-control" value="${record.category}" readonly></div>
        <div class="form-group"><label>申请得分</label><input type="text" class="form-control" value="${record.score}分" readonly></div>
        <div class="form-group"><label>活动时间</label><input type="text" class="form-control" value="${record.date}" readonly></div>
        <div class="form-group"><label>证明材料</label><input type="text" class="form-control" value="${record.proof}" readonly></div>
        <div class="form-group"><label>备注说明</label><textarea class="form-control" rows="3" readonly>${record.remark || '无'}</textarea></div>
        ${record.status === 'rejected' ? `<div class="form-group"><label>打回原因</label><textarea class="form-control" rows="2" readonly>${record.rejectReason || '无'}</textarea></div>` : ''}
        ${record.status === 'pending' ? `<div class="form-group"><label>打回原因(可选)</label><textarea id="rejectReasonInput" class="form-control" rows="2" placeholder="请输入打回原因..."></textarea></div>` : ''}
    `;

    if (record.status === 'pending') {
        footer.innerHTML = `
            <button class="btn btn-secondary" onclick="closeReviewModal()">取消</button>
            <button class="btn btn-primary" style="background:#2ecc71;" onclick="approveRecord(${record.id})">通过</button>
            <button class="btn btn-primary" style="background:#e74c3c;" onclick="rejectRecord(${record.id})">打回</button>
        `;
    } else {
        footer.innerHTML = `<button class="btn btn-secondary" onclick="closeReviewModal()">关闭</button>`;
    }

    modal.classList.add('active');
    window.currentReviewId = recordId;
}

function closeReviewModal() {
    document.getElementById('reviewDetailModal').classList.remove('active');
}

function approveRecord(recordId) {
    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    const record = records.find(r => r.id === recordId);
    if (record) {
        record.status = 'approved';
        record.reviewBy = 'admin';
        record.reviewTime = new Date().toLocaleString();
        localStorage.setItem('studentRecords', JSON.stringify(records));
        showToast('已通过审核');
        closeReviewModal();
        filterReviews();

        // 刷新其他页面
        if (typeof refreshAdminHome === 'function') refreshAdminHome();
    }
}

function rejectRecord(recordId) {
    const reason = document.getElementById('rejectReasonInput')?.value || '未通过审核';
    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    const record = records.find(r => r.id === recordId);
    if (record) {
        record.status = 'rejected';
        record.rejectReason = reason;
        record.reviewBy = 'admin';
        record.reviewTime = new Date().toLocaleString();
        localStorage.setItem('studentRecords', JSON.stringify(records));
        showToast(`已打回，原因：${reason}`);
        closeReviewModal();
        filterReviews();

        if (typeof refreshAdminHome === 'function') refreshAdminHome();
    }
}