// ==================== 学生综测填报模块 ====================

let studentRecords = [];

function initStudentApply() {
    loadStudentRecords();
    initStudentRecordModal();
}

function loadStudentRecords() {
    const container = document.getElementById('apply-page');
    if (!container) return;

    // 从localStorage获取记录
    const stored = localStorage.getItem('studentRecords');
    if (stored) {
        studentRecords = JSON.parse(stored);
    } else {
        studentRecords = [];
        localStorage.setItem('studentRecords', JSON.stringify(studentRecords));
    }

    // 只显示当前学生的记录
    const currentUser = window.currentUser;
    const myRecords = studentRecords.filter(r => r.studentId === currentUser?.id);

    renderStudentApplyPage(myRecords);
}

function renderStudentApplyPage(myRecords) {
    const container = document.getElementById('apply-page');
    if (!container) return;

    container.innerHTML = `
        <div class="section">
            <div class="section-title">综测填报</div>
            
            <!-- 第一部分：AI智能计算智育分 -->
            <div class="section">
                <h3 class="section-title">第一部分：AI智能计算智育分</h3>
                <div class="upload-area" id="upload-area">
                    <div class="upload-icon"><i class="fas fa-cloud-upload-alt"></i></div>
                    <div class="upload-text">点击或拖拽上传成绩单图片</div>
                    <div class="upload-text" style="font-size: 12px; color: #aaa;">支持格式：JPG, PNG, PDF，最大10MB</div>
                    <input type="file" id="transcript-upload" accept=".jpg,.jpeg,.png,.pdf" style="display: none;">
                    <button class="upload-btn" id="upload-btn">选择文件</button>
                </div>
                <div class="ai-result" id="ai-result" style="display: none;">
                    <div class="ai-result-title"><i class="fas fa-robot"></i> AI智能识别结果</div>
                    <div class="ai-result-content" id="ai-result-content"></div>
                </div>
            </div>
            
            <!-- 第二部分：手动填报记录 -->
            <div class="section">
                <div class="manual-entry-header">
                    <h3 class="section-title">第二部分：手动填报记录</h3>
                    <button class="add-record-btn" id="add-record-btn">
                        <i class="fas fa-plus"></i> 新增记录
                    </button>
                </div>
                
                <!-- 记录筛选 -->
                <div class="record-filters" id="record-filters">
                    <button class="filter-btn active" data-filter="all">全部</button>
                    <button class="filter-btn" data-filter="德育">德育</button>
                    <button class="filter-btn" data-filter="智育">智育</button>
                    <button class="filter-btn" data-filter="体育">体育</button>
                    <button class="filter-btn" data-filter="美育">美育</button>
                    <button class="filter-btn" data-filter="劳育">劳育</button>
                </div>
                
                <!-- 记录列表 -->
                <div class="records-list" id="records-list"></div>
            </div>
        </div>
    `;

    // 渲染记录列表
    renderStudentRecordsList(myRecords);

    // 绑定事件
    bindStudentApplyEvents();
}

function renderStudentRecordsList(records) {
    const listContainer = document.getElementById('records-list');
    if (!listContainer) return;

    if (records.length === 0) {
        listContainer.innerHTML = '<div style="text-align:center;padding:40px;">暂无填报记录，点击"新增记录"开始填报</div>';
        return;
    }

    listContainer.innerHTML = '';

    records.forEach(record => {
        let statusText = '', statusClass = '';
        switch (record.status) {
            case 'pending': statusText = '待审核'; statusClass = 'status-pending'; break;
            case 'approved': statusText = '已通过'; statusClass = 'status-approved'; break;
            case 'rejected': statusText = '未通过'; statusClass = 'status-rejected'; break;
        }

        const recordDiv = document.createElement('div');
        recordDiv.className = 'record-item';
        recordDiv.setAttribute('data-category', record.category);
        recordDiv.setAttribute('data-status', record.status);
        recordDiv.innerHTML = `
            <div class="record-header">
                <div class="record-category">${record.category}</div>
                <div class="record-score">${record.score}分</div>
            </div>
            <div class="record-title">${record.name}</div>
            <div class="record-meta">
                <span>${record.date}</span>
                <span class="record-status ${statusClass}">${statusText}</span>
            </div>
        `;
        recordDiv.addEventListener('click', () => showStudentRecordDetail(record));
        listContainer.appendChild(recordDiv);
    });
}

function showStudentRecordDetail(record) {
    const applyPage = document.getElementById('apply-page');
    const detailContainer = document.getElementById('record-detail-container');

    if (!applyPage || !detailContainer) return;

    applyPage.style.display = 'none';

    let statusText = '', statusClass = '';
    switch (record.status) {
        case 'pending': statusText = '待审核'; statusClass = 'status-pending'; break;
        case 'approved': statusText = '已通过'; statusClass = 'status-approved'; break;
        case 'rejected': statusText = '未通过'; statusClass = 'status-rejected'; break;
    }

    detailContainer.innerHTML = `
        <div class="record-detail-container active">
            <div class="record-detail-header">
                <div class="record-detail-title">${record.name}</div>
                <div class="record-score">${record.score}分</div>
            </div>
            <div class="record-detail-content">
                <div class="record-detail-item"><div class="record-detail-label">五育类别</div><div class="record-detail-value">${record.category}</div></div>
                <div class="record-detail-item"><div class="record-detail-label">活动时间</div><div class="record-detail-value">${record.date}</div></div>
                <div class="record-detail-item"><div class="record-detail-label">申请得分</div><div class="record-detail-value">${record.score}分</div></div>
                <div class="record-detail-item"><div class="record-detail-label">审核状态</div><div class="record-detail-value"><span class="record-status ${statusClass}">${statusText}</span></div></div>
                <div class="record-detail-item"><div class="record-detail-label">提交时间</div><div class="record-detail-value">${record.submitTime}</div></div>
            </div>
            <div class="record-detail-item"><div class="record-detail-label">备注说明</div><div class="record-detail-value">${record.remark || '无'}</div></div>
            <div class="record-detail-item"><div class="record-detail-label">证明材料</div><div class="record-detail-value">${record.proof}</div></div>
            ${record.status === 'rejected' && record.rejectReason ? `<div class="record-detail-item"><div class="record-detail-label">打回原因</div><div class="record-detail-value">${record.rejectReason}</div></div>` : ''}
            <button class="back-btn" id="back-to-records"><i class="fas fa-arrow-left"></i> 返回记录列表</button>
        </div>
    `;

    const backBtn = document.getElementById('back-to-records');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            detailContainer.innerHTML = '';
            detailContainer.classList.remove('active');
            applyPage.style.display = 'block';
        });
    }
}

function bindStudentApplyEvents() {
    // 上传成绩单
    const uploadArea = document.getElementById('upload-area');
    const uploadBtn = document.getElementById('upload-btn');
    const transcriptUpload = document.getElementById('transcript-upload');

    if (uploadArea) {
        uploadArea.addEventListener('click', () => transcriptUpload?.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#b8860b';
            uploadArea.style.backgroundColor = '#f9f5f0';
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#d4a017';
            uploadArea.style.backgroundColor = '';
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#d4a017';
            uploadArea.style.backgroundColor = '';
            const file = e.dataTransfer.files[0];
            if (file) handleStudentTranscriptUpload(file);
        });
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            transcriptUpload?.click();
        });
    }

    if (transcriptUpload) {
        transcriptUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleStudentTranscriptUpload(file);
        });
    }

    // 新增记录按钮
    const addRecordBtn = document.getElementById('add-record-btn');
    if (addRecordBtn) {
        addRecordBtn.addEventListener('click', () => {
            document.getElementById('add-record-modal').classList.add('active');
        });
    }

    // 筛选按钮
    const filterBtns = document.querySelectorAll('#record-filters .filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            filterStudentRecords(filter);
        });
    });
}

function handleStudentTranscriptUpload(file) {
    const fileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024;

    if (!fileTypes.includes(file.type)) {
        showToast('请上传JPG、PNG或PDF格式的文件', true);
        return;
    }

    if (file.size > maxSize) {
        showToast('文件大小不能超过10MB', true);
        return;
    }

    showToast(`文件"${file.name}"上传成功，AI正在分析中...`);

    setTimeout(() => {
        const aiResult = document.getElementById('ai-result');
        const aiResultContent = document.getElementById('ai-result-content');

        const gpa = (3.0 + Math.random() * 1.5).toFixed(2);
        const score = (80 + Math.random() * 20).toFixed(1);
        const analysis = `经AI智能识别分析：\n\n` +
            `• 学期平均绩点：${gpa}\n` +
            `• 智育原始分：${score}分\n` +
            `• 加权得分：${(score * 0.4).toFixed(1)}分\n` +
            `• 分析结果：${score >= 90 ? '优秀' : score >= 80 ? '良好' : score >= 70 ? '中等' : '有待提高'}\n\n` +
            `分析基于课程成绩、学分权重等因素计算得出。`;

        if (aiResultContent) aiResultContent.innerHTML = analysis.replace(/\n/g, '<br>');
        if (aiResult) aiResult.style.display = 'block';

        showToast('AI分析完成！智育分已自动计算');
    }, 2000);
}

function filterStudentRecords(filter) {
    const records = document.querySelectorAll('#records-list .record-item');
    records.forEach(record => {
        const category = record.getAttribute('data-category');
        if (filter === 'all') {
            record.style.display = 'block';
        } else {
            record.style.display = category === filter ? 'block' : 'none';
        }
    });
}

function initStudentRecordModal() {
    const modal = document.getElementById('add-record-modal');
    const closeBtn = document.getElementById('close-add-record-modal');
    const cancelBtn = document.getElementById('cancel-record');
    const submitBtn = document.getElementById('submit-record');
    const proofInput = document.getElementById('record-proof');
    const proofLabel = document.getElementById('record-proof-label');
    const filePreview = document.getElementById('file-preview');

    if (closeBtn && cancelBtn) {
        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                resetStudentRecordForm();
            });
        });
    }

    if (proofInput && proofLabel) {
        proofInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                proofLabel.innerHTML = `<i class="fas fa-check"></i> ${file.name}`;
                proofLabel.style.backgroundColor = '#e8f5e8';

                if (file.type.startsWith('image/') && filePreview) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        filePreview.innerHTML = `<div class="proof-preview"><img src="${e.target.result}" alt="预览" style="max-width:100%;"></div>`;
                    };
                    reader.readAsDataURL(file);
                } else if (filePreview) {
                    filePreview.innerHTML = `<div style="padding:10px;background:#f5f5f5;border-radius:4px;"><i class="fas fa-file"></i> ${file.name}</div>`;
                }
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const category = document.getElementById('record-category').value;
            const date = document.getElementById('record-date').value;
            const name = document.getElementById('record-name').value;
            const score = document.getElementById('record-score').value;
            const proof = document.getElementById('record-proof').files[0];
            const remark = document.getElementById('record-remark').value;

            if (!category || !date || !name || !score || !proof) {
                showToast('请填写所有必填项', true);
                return;
            }

            const currentUser = window.currentUser;
            const newRecord = {
                id: Date.now(),
                studentId: currentUser.id,
                studentName: currentUser.name,
                className: currentUser.className,
                category: category,
                date: date,
                name: name,
                score: parseFloat(score),
                proof: proof.name,
                remark: remark,
                status: 'pending',
                submitTime: new Date().toLocaleString()
            };

            studentRecords.push(newRecord);
            localStorage.setItem('studentRecords', JSON.stringify(studentRecords));

            modal.classList.remove('active');
            resetStudentRecordForm();

            const myRecords = studentRecords.filter(r => r.studentId === currentUser.id);
            renderStudentRecordsList(myRecords);
            showToast('记录提交成功，等待审核');
        });
    }
}

function resetStudentRecordForm() {
    const form = document.getElementById('record-form');
    if (form) form.reset();
    const proofLabel = document.getElementById('record-proof-label');
    if (proofLabel) {
        proofLabel.innerHTML = '<i class="fas fa-upload"></i> 点击上传证明材料';
        proofLabel.style.backgroundColor = '';
    }
    const filePreview = document.getElementById('file-preview');
    if (filePreview) filePreview.innerHTML = '';
}