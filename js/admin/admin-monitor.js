// ==================== 班委管理模块 ====================

function initAdminMonitor() {
    loadMonitorList();
}

function loadMonitorList() {
    const container = document.getElementById('monitor-page');
    if (!container) return;

    const students = window.appData.studentUsers || [];
    const monitors = students.filter(s => s.isMonitor === true);

    container.innerHTML = `
        <div class="section">
            <div class="section-title">班委管理</div>
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <select id="monitorFilterCollege" style="padding: 8px; border-radius: 20px;">
                    <option value="">全部学院</option>
                    ${window.appData.colleges.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
                <select id="monitorFilterMajor" style="padding: 8px; border-radius: 20px;">
                    <option value="">全部专业</option>
                </select>
                <select id="monitorFilterClass" style="padding: 8px; border-radius: 20px;">
                    <option value="">全部班级</option>
                </select>
            </div>
            <div id="monitorTable"></div>
        </div>
        
        <!-- 修改班委模态框 -->
        <div id="editMonitorModal" class="modal-overlay">
            <div class="modal" style="width: 400px;">
                <div class="modal-header">
                    <div class="modal-title">修改班委职务</div>
                    <button class="modal-close" onclick="closeEditMonitorModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">班委职务</label>
                        <select id="editMonitorType" class="form-control">
                            <option value="班长">班长</option>
                            <option value="学委">学委</option>
                            <option value="团支书">团支书</option>
                            <option value="生活委员">生活委员</option>
                            <option value="文体委员">文体委员</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeEditMonitorModal()">取消</button>
                    <button class="btn btn-primary" onclick="confirmEditMonitor()">确认修改</button>
                </div>
            </div>
        </div>
    `;

    // 学院、专业、班级联动
    document.getElementById('monitorFilterCollege').addEventListener('change', function () {
        updateMonitorMajorOptions(this.value);
    });
    document.getElementById('monitorFilterMajor').addEventListener('change', function () {
        updateMonitorClassOptions(this.value);
    });
    document.getElementById('monitorFilterCollege').addEventListener('change', () => filterMonitors());
    document.getElementById('monitorFilterMajor').addEventListener('change', () => filterMonitors());
    document.getElementById('monitorFilterClass').addEventListener('change', () => filterMonitors());

    // 初始化专业选项
    updateMonitorMajorOptions('');

    renderMonitorTable(monitors);
}

function updateMonitorMajorOptions(college) {
    const majorSelect = document.getElementById('monitorFilterMajor');
    const majors = window.appData.majors;
    if (college && majors[college]) {
        majorSelect.innerHTML = `<option value="">全部专业</option>${majors[college].map(m => `<option value="${m}">${m}</option>`).join('')}`;
    } else {
        majorSelect.innerHTML = '<option value="">全部专业</option>';
    }
    updateMonitorClassOptions('');
}

function updateMonitorClassOptions(major) {
    const classSelect = document.getElementById('monitorFilterClass');
    const classes = window.appData.classes;
    if (major && classes[major]) {
        classSelect.innerHTML = `<option value="">全部班级</option>${classes[major].map(c => `<option value="${c}">${c}</option>`).join('')}`;
    } else {
        classSelect.innerHTML = '<option value="">全部班级</option>';
    }
}

function filterMonitors() {
    let monitors = window.appData.studentUsers.filter(s => s.isMonitor === true);
    const college = document.getElementById('monitorFilterCollege').value;
    const major = document.getElementById('monitorFilterMajor').value;
    const className = document.getElementById('monitorFilterClass').value;

    if (college) monitors = monitors.filter(s => s.college === college);
    if (major) monitors = monitors.filter(s => s.major === major);
    if (className) monitors = monitors.filter(s => s.className === className);

    renderMonitorTable(monitors);
}

function renderMonitorTable(monitors) {
    const container = document.getElementById('monitorTable');
    if (!container) return;

    if (monitors.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;">暂无班委数据</div>';
        return;
    }

    let html = '<table style="width:100%;border-collapse:collapse;"><tr style="background:#f0e6d6;"><th>学号</th><th>姓名</th><th>学院</th><th>专业</th><th>班级</th><th>职务</th><th>操作</th></tr>';

    monitors.forEach(m => {
        html += `
            <tr>
                <td>${m.id}</td>
                <td>${m.name}</td>
                <td>${m.college || '-'}</td>
                <td>${m.major || '-'}</td>
                <td>${m.className || '-'}</td>
                <td>${m.monitorType || '班委'}</td>
                <td>
                    <button class="btn btn-primary" style="background:#b8860b;padding:4px 12px;" onclick="editMonitor('${m.id}')">修改职务</button>
                    <button class="btn btn-danger" style="background:#e74c3c;padding:4px 12px;margin-left:5px;" onclick="removeMonitor('${m.id}')">移除班委</button>
                </td>
            </tr>
        `;
    });
    html += '</table>';
    container.innerHTML = html;
}

let currentEditMonitorId = null;

function editMonitor(studentId) {
    currentEditMonitorId = studentId;
    const student = window.appData.studentUsers.find(s => s.id === studentId);
    if (student && student.monitorType) {
        document.getElementById('editMonitorType').value = student.monitorType;
    }
    document.getElementById('editMonitorModal').classList.add('active');
}

function closeEditMonitorModal() {
    document.getElementById('editMonitorModal').classList.remove('active');
    currentEditMonitorId = null;
}

function confirmEditMonitor() {
    const newType = document.getElementById('editMonitorType').value;
    const student = window.appData.studentUsers.find(s => s.id === currentEditMonitorId);
    if (student) {
        student.monitorType = newType;
        showToast(`已将${student.name}的职务修改为${newType}`);
        closeEditMonitorModal();
        filterMonitors();
        if (typeof loadStudentList === 'function') loadStudentList();
    }
}

function removeMonitor(studentId) {
    if (confirm('确定要移除该班委吗？该同学将变为普通学生。')) {
        const student = window.appData.studentUsers.find(s => s.id === studentId);
        if (student) {
            student.isMonitor = false;
            delete student.monitorType;
            showToast(`${student.name}已被移除班委`);
            filterMonitors();
            if (typeof loadStudentList === 'function') loadStudentList();
        }
    }
}