// ==================== 班委综测填报模块 ====================

let monitorRecords = [];

function initMonitorApply() {
    loadMonitorRecords();
}

function loadMonitorRecords() {
    const container = document.getElementById('apply-page');
    if (!container) return;

    const stored = localStorage.getItem('studentRecords');
    if (stored) {
        monitorRecords = JSON.parse(stored);
    } else {
        monitorRecords = [];
        localStorage.setItem('studentRecords', JSON.stringify(monitorRecords));
    }

    const currentUser = window.currentUser;
    const myRecords = monitorRecords.filter(r => r.studentId === currentUser?.id);

    renderMonitorApplyPage(myRecords);
}

function renderMonitorApplyPage(myRecords) {
    const container = document.getElementById('apply-page');
    if (!container) return;

    container.innerHTML = `
        <div class="section">
            <div class="section-title">综测填报</div>
            
            <div class="section">
                <h3 class="section-title">AI智能计算智育分</h3>
                <div class="upload-area" id="monitor-upload-area">
                    <div class="upload-icon"><i class="fas fa-cloud-upload-alt"></i></div>
                    <div class="upload-text">点击或拖拽上传成绩单图片</div>
                    <input type="file" id="monitor-transcript-upload" accept=".jpg,.png,.pdf" style="display:none;">
                    <button class="upload-btn" id="monitor-upload-btn">选择文件</button>
                </div>
                <div class="ai-result" id="monitor-ai-result" style="display:none;">
                    <div class="ai-result-title"><i class="fas fa-robot"></i> AI识别结果</div>
                    <div id="monitor-ai-content"></div>
                </div>
            </div>
            
            <div class="section">
                <div class="manual-entry-header">
                    <h3 class="section-title">我的填报记录</h3>
                    <button class="add-record-btn" id="monitor-add-record-btn"><i class="fas fa-plus"></i>新增记录</button>
                </div>
                <div class="records-list" id="monitor-records-list"></div>
            </div>
        </div>
    `;

    renderMonitorRecordsList(myRecords);
    bindMonitorApplyEvents();
}

function renderMonitorRecordsList(records) {
    const listContainer = document.getElementById('monitor-records-list');
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

        const div = document.createElement('div');
        div.className = 'record-item';
        div.innerHTML = `
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
        listContainer.appendChild(div);
    });
}

function bindMonitorApplyEvents() {
    const uploadArea = document.getElementById('monitor-upload-area');
    const uploadBtn = document.getElementById('monitor-upload-btn');
    const fileInput = document.getElementById('monitor-transcript-upload');

    if (uploadArea) {
        uploadArea.addEventListener('click', () => fileInput?.click());
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
            const file = e.dataTransfer.files[0];
            if (file) handleMonitorTranscriptUpload(file);
        });
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput?.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleMonitorTranscriptUpload(file);
        });
    }

    const addRecordBtn = document.getElementById('monitor-add-record-btn');
    if (addRecordBtn) {
        addRecordBtn.addEventListener('click', () => {
            showToast('填报功能请使用学生账号');
        });
    }
}

function handleMonitorTranscriptUpload(file) {
    const fileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!fileTypes.includes(file.type)) {
        showToast('请上传JPG、PNG或PDF格式的文件', true);
        return;
    }

    showToast(`文件上传成功，AI正在分析中...`);

    setTimeout(() => {
        const aiResult = document.getElementById('monitor-ai-result');
        const aiContent = document.getElementById('monitor-ai-content');
        const score = (80 + Math.random() * 20).toFixed(1);

        if (aiContent) {
            aiContent.innerHTML = `识别完成！智育分：${score}分<br>加权得分：${(score * 0.4).toFixed(1)}分`;
        }
        if (aiResult) aiResult.style.display = 'block';

        showToast('AI分析完成！');
    }, 2000);
}