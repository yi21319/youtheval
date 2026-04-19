// ==================== 学生管理模块 ====================

function initAdminStudent() {
    loadStudentList();
}

function loadStudentList() {
    const container = document.getElementById('student-page');
    if (!container) return;

    const students = window.appData.studentUsers || [];

    container.innerHTML = `
        <div class="section">
            <div class="section-title">
                学生管理
                <button class="add-record-btn" id="addStudentBtn" style="background:#b8860b;">
                    <i class="fas fa-plus"></i> 添加学生
                </button>
            </div>
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <input type="text" id="searchStudent" placeholder="搜索姓名/学号" style="padding: 8px; width: 200px; border-radius: 20px; border: 1px solid #ddd;">
                <select id="filterCollege" style="padding: 8px; border-radius: 20px;">
                    <option value="">全部学院</option>
                    ${window.appData.colleges.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
                <select id="filterMajor" style="padding: 8px; border-radius: 20px;">
                    <option value="">全部专业</option>
                </select>
                <select id="filterClass" style="padding: 8px; border-radius: 20px;">
                    <option value="">全部班级</option>
                </select>
            </div>
            <div id="studentTable"></div>
        </div>
        
        <!-- 添加学生模态框 -->
        <div id="addStudentModal" class="modal-overlay">
            <div class="modal" style="width: 500px;">
                <div class="modal-header">
                    <div class="modal-title">添加学生</div>
                    <button class="modal-close" onclick="closeAddStudentModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group"><label>学号</label><input type="text" id="newStudentId" class="form-control"></div>
                    <div class="form-group"><label>姓名</label><input type="text" id="newStudentName" class="form-control"></div>
                    <div class="form-group"><label>密码</label><input type="password" id="newStudentPwd" class="form-control" value="123456"></div>
                    <div class="form-group"><label>学院</label><select id="newStudentCollege" class="form-control">${window.appData.colleges.map(c => `<option value="${c}">${c}</option>`).join('')}</select></div>
                    <div class="form-group"><label>专业</label><select id="newStudentMajor" class="form-control"><option value="">请先选择学院</option></select></div>
                    <div class="form-group"><label>班级</label><select id="newStudentClass" class="form-control"><option value="">请先选择专业</option></select></div>
                    <div class="form-group"><label>手机号</label><input type="text" id="newStudentPhone" class="form-control"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeAddStudentModal()">取消</button>
                    <button class="btn btn-primary" onclick="confirmAddStudent()">确认添加</button>
                </div>
            </div>
        </div>
        
        <!-- 学生详情模态框 -->
        <div id="studentDetailModal" class="modal-overlay">
            <div class="modal" style="width: 600px;">
                <div class="modal-header">
                    <div class="modal-title">学生综测明细</div>
                    <button class="modal-close" onclick="closeStudentDetailModal()">&times;</button>
                </div>
                <div class="modal-body" id="studentDetailBody"></div>
            </div>
        </div>
    `;

    // 学院、专业、班级联动
    document.getElementById('filterCollege').addEventListener('change', function () {
        updateFilterMajorOptions(this.value);
    });
    document.getElementById('filterMajor').addEventListener('change', function () {
        updateFilterClassOptions(this.value);
    });
    document.getElementById('filterCollege').dispatchEvent(new Event('change'));

    document.getElementById('searchStudent').addEventListener('input', () => filterStudents());
    document.getElementById('filterCollege').addEventListener('change', () => filterStudents());
    document.getElementById('filterMajor').addEventListener('change', () => filterStudents());
    document.getElementById('filterClass').addEventListener('change', () => filterStudents());
    document.getElementById('addStudentBtn').addEventListener('click', () => {
        document.getElementById('addStudentModal').classList.add('active');
    });

    // 添加学生表单联动
    document.getElementById('newStudentCollege').addEventListener('change', function () {
        const majorSelect = document.getElementById('newStudentMajor');
        const majors = window.appData.majors;
        if (this.value && majors[this.value]) {
            majorSelect.innerHTML = `<option value="">请选择专业</option>${majors[this.value].map(m => `<option value="${m}">${m}</option>`).join('')}`;
        } else {
            majorSelect.innerHTML = '<option value="">请先选择学院</option>';
        }
        document.getElementById('newStudentClass').innerHTML = '<option value="">请先选择专业</option>';
    });
    document.getElementById('newStudentMajor').addEventListener('change', function () {
        const classSelect = document.getElementById('newStudentClass');
        const classes = window.appData.classes;
        if (this.value && classes[this.value]) {
            classSelect.innerHTML = `<option value="">请选择班级</option>${classes[this.value].map(c => `<option value="${c}">${c}</option>`).join('')}`;
        } else {
            classSelect.innerHTML = '<option value="">请先选择专业</option>';
        }
    });

    renderStudentTable(students);
}

function updateFilterMajorOptions(college) {
    const majorSelect = document.getElementById('filterMajor');
    const majors = window.appData.majors;
    if (college && majors[college]) {
        majorSelect.innerHTML = `<option value="">全部专业</option>${majors[college].map(m => `<option value="${m}">${m}</option>`).join('')}`;
    } else {
        majorSelect.innerHTML = '<option value="">全部专业</option>';
    }
    updateFilterClassOptions('');
}

function updateFilterClassOptions(major) {
    const classSelect = document.getElementById('filterClass');
    const classes = window.appData.classes;
    if (major && classes[major]) {
        classSelect.innerHTML = `<option value="">全部班级</option>${classes[major].map(c => `<option value="${c}">${c}</option>`).join('')}`;
    } else {
        classSelect.innerHTML = '<option value="">全部班级</option>';
    }
}

function renderStudentTable(students) {
    const container = document.getElementById('studentTable');
    if (!container) return;

    if (students.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;">暂无学生数据</div>';
        return;
    }

    let html = '<table style="width:100%;border-collapse:collapse;"><tr style="background:#f0e6d6;"><th>学号</th><th>姓名</th><th>学院</th><th>专业</th><th>班级</th><th>班委</th><th>操作</th></tr>';

    students.forEach(s => {
        html += `
            <tr>
                <td>${s.id}</td><td>${s.name}</td><td>${s.college || '-'}</td><td>${s.major || '-'}</td><td>${s.className || '-'}</td>
                <td>${s.isMonitor ? (s.monitorType || '班委') : '否'}</td>
                <td>
                    <button class="btn btn-primary" style="background:#b8860b;padding:4px 12px;" onclick="showStudentDetail('${s.id}')">查看明细</button>
                    <button class="btn btn-danger" style="background:#e74c3c;padding:4px 12px;margin-left:5px;" onclick="deleteStudent('${s.id}')">删除</button>
                    ${!s.isMonitor ? `<button class="btn btn-primary" style="background:#2ecc71;padding:4px 12px;margin-left:5px;" onclick="setAsMonitor('${s.id}')">设为班委</button>` : ''}
                 </td>
             </tr>
        `;
    });
    html += '</table>';
    container.innerHTML = html;
}

function filterStudents() {
    let students = [...window.appData.studentUsers];
    const search = document.getElementById('searchStudent').value.toLowerCase();
    const college = document.getElementById('filterCollege').value;
    const major = document.getElementById('filterMajor').value;
    const className = document.getElementById('filterClass').value;

    if (search) students = students.filter(s => s.name.toLowerCase().includes(search) || s.id.includes(search));
    if (college) students = students.filter(s => s.college === college);
    if (major) students = students.filter(s => s.major === major);
    if (className) students = students.filter(s => s.className === className);

    renderStudentTable(students);
}

function showStudentDetail(studentId) {
    const student = window.appData.studentUsers.find(s => s.id === studentId);
    if (!student) return;

    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    const studentRecords = records.filter(r => r.studentId === studentId);

    const modal = document.getElementById('studentDetailModal');
    const body = document.getElementById('studentDetailBody');

    let recordsHtml = '<h4>综测记录</h4><table style="width:100%;border-collapse:collapse;"><tr style="background:#f0e6d6;"><th>项目</th><th>类别</th><th>得分</th><th>状态</th><th>时间</th></tr>';
    studentRecords.forEach(r => {
        let statusText = r.status === 'pending' ? '待审核' : r.status === 'approved' ? '已通过' : '未通过';
        recordsHtml += `<tr><td>${r.name}</td><td>${r.category}</td><td>${r.score}分</td><td>${statusText}</td><td>${r.submitTime || '-'}</td></tr>`;
    });
    if (studentRecords.length === 0) recordsHtml += '<tr><td colspan="5" style="text-align:center;">暂无综测记录</td></tr>';
    recordsHtml += '</table>';

    body.innerHTML = `
        <h3>${student.name} - ${student.id}</h3>
        <p>学院：${student.college || '-'} | 专业：${student.major || '-'} | 班级：${student.className || '-'}</p>
        ${recordsHtml}
    `;

    modal.classList.add('active');
}

function closeStudentDetailModal() {
    document.getElementById('studentDetailModal').classList.remove('active');
}

function deleteStudent(studentId) {
    if (confirm('确定要删除该学生吗？')) {
        const index = window.appData.studentUsers.findIndex(s => s.id === studentId);
        if (index !== -1) {
            window.appData.studentUsers.splice(index, 1);
            filterStudents();
            if (typeof loadMonitorList === 'function') loadMonitorList();
            showToast('学生已删除');
        }
    }
}

function setAsMonitor(studentId) {
    const student = window.appData.studentUsers.find(s => s.id === studentId);
    if (student) {
        const types = ['班长', '学委', '团支书', '生活委员', '文体委员'];
        const type = prompt('请输入班委职务（班长/学委/团支书/生活委员/文体委员）:', '班长');
        if (type && types.includes(type)) {
            student.isMonitor = true;
            student.monitorType = type;
            filterStudents();
            if (typeof loadMonitorList === 'function') loadMonitorList();
            showToast(`${student.name} 已被设为${type}`);
        } else if (type) {
            showToast('请输入正确的职务名称', true);
        }
    }
}

function closeAddStudentModal() {
    document.getElementById('addStudentModal').classList.remove('active');
    document.getElementById('newStudentId').value = '';
    document.getElementById('newStudentName').value = '';
    document.getElementById('newStudentPwd').value = '123456';
    document.getElementById('newStudentCollege').value = '';
    document.getElementById('newStudentMajor').innerHTML = '<option value="">请先选择学院</option>';
    document.getElementById('newStudentClass').innerHTML = '<option value="">请先选择专业</option>';
    document.getElementById('newStudentPhone').value = '';
}

function confirmAddStudent() {
    const id = document.getElementById('newStudentId').value;
    const name = document.getElementById('newStudentName').value;
    const pwd = document.getElementById('newStudentPwd').value;
    const college = document.getElementById('newStudentCollege').value;
    const major = document.getElementById('newStudentMajor').value;
    const className = document.getElementById('newStudentClass').value;
    const phone = document.getElementById('newStudentPhone').value;

    if (!id || !name) {
        showToast('请填写学号和姓名', true);
        return;
    }

    if (window.appData.studentUsers.find(s => s.id === id)) {
        showToast('学号已存在', true);
        return;
    }

    window.appData.studentUsers.push({
        id, name, password: pwd || '123456', college, major, className, phone,
        isMonitor: false
    });

    closeAddStudentModal();
    filterStudents();
    showToast('添加成功');
}