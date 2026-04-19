// ==================== 管理员首页模块 ====================

let adminHomeCharts = {};

function initAdminHome() {
    refreshAdminHome();
}

function refreshAdminHome() {
    const homePage = document.getElementById('home-page');
    if (!homePage) return;

    // 获取数据
    const students = window.appData.studentUsers || [];
    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];

    // 计算各学院、专业、班级的五育平均分
    const collegeData = calculateCollegeData(students, records);
    const majorData = calculateMajorData(students, records);
    const classData = calculateClassData(students, records);

    homePage.innerHTML = `
        <div class="section">
            <div class="section-title">数据概览</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                <div class="stat-card" style="background: linear-gradient(135deg, #b8860b 0%, #d4a017 100%); padding: 20px; border-radius: 12px; color: white; text-align: center;">
                    <i class="fas fa-users" style="font-size: 32px; margin-bottom: 10px;"></i>
                    <h3 style="font-size: 28px;">${students.length}</h3>
                    <p>学生总数</p>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #e8a735 0%, #c97e2a 100%); padding: 20px; border-radius: 12px; color: white; text-align: center;">
                    <i class="fas fa-chart-line" style="font-size: 32px; margin-bottom: 10px;"></i>
                    <h3 style="font-size: 28px;">${records.length}</h3>
                    <p>综测记录</p>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #daa520 0%, #b8860b 100%); padding: 20px; border-radius: 12px; color: white; text-align: center;">
                    <i class="fas fa-check-circle" style="font-size: 32px; margin-bottom: 10px;"></i>
                    <h3 style="font-size: 28px;">${records.filter(r => r.status === 'approved').length}</h3>
                    <p>已通过</p>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #d4922a 0%, #a8641a 100%); padding: 20px; border-radius: 12px; color: white; text-align: center;">
                    <i class="fas fa-clock" style="font-size: 32px; margin-bottom: 10px;"></i>
                    <h3 style="font-size: 28px;">${records.filter(r => r.status === 'pending').length}</h3>
                    <p>待审核</p>
                </div>
            </div>
        </div>

        <!-- 图1：各专业综测比较 -->
        <div class="section">
            <div class="section-title">
                各专业综测比较
                <select id="collegeSelect" style="padding: 5px 10px; border-radius: 20px; margin-left: 15px;">
                    <option value="">全部学院</option>
                    ${window.appData.colleges.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </div>
            <div class="chart-box">
                <canvas id="majorChart" width="600" height="300" style="width:100%; max-height:300px;"></canvas>
            </div>
        </div>
        
        <!-- 图2：各班级综测比较 -->
        <div class="section">
            <div class="section-title">
                各班级综测比较
                <select id="majorSelect" style="padding: 5px 10px; border-radius: 20px; margin-left: 15px;">
                    <option value="">请先选择学院</option>
                </select>
            </div>
            <div class="chart-box">
                <canvas id="classChart" width="600" height="300" style="width:100%; max-height:300px;"></canvas>
            </div>
        </div>
        
        <!-- 图3：各学院五育比较（雷达图） -->
        <div class="section">
            <div class="section-title">各学院五育比较</div>
            <div class="chart-box">
                <canvas id="collegeRadarChart" width="500" height="350" style="width:100%; max-height:350px;"></canvas>
            </div>
        </div>
        
        <!-- 成绩分析栏目 -->
        <div class="section">
            <div class="section-title">成绩分析报告</div>
            <div id="analysisContent" style="padding: 20px;"></div>
        </div>
        
        <!-- 数据导出功能 -->
        <div class="section">
            <div class="section-title">
                数据导出
                <button class="export-btn" id="exportDataBtn"><i class="fas fa-file-excel"></i> 导出Excel</button>
            </div>
            <div id="exportPreview" style="max-height: 300px; overflow: auto;"></div>
        </div>
    `;

    // 存储数据供图表使用
    window.adminChartData = { collegeData, majorData, classData };

    // 绘制图表
    drawMajorChart(collegeData);
    drawClassChart(majorData);
    drawCollegeRadarChart(collegeData);
    renderAnalysis(collegeData, majorData, classData);
    renderExportPreview(collegeData, majorData, classData);

    // 绑定事件
    document.getElementById('collegeSelect').addEventListener('change', function () {
        const selectedCollege = this.value;
        const filteredData = selectedCollege ? filterMajorDataByCollege(majorData, selectedCollege) : majorData;
        drawClassChart(filteredData);
    });

    document.getElementById('majorSelect').addEventListener('change', function () {
        const selectedMajor = this.value;
        if (selectedMajor && classData[selectedMajor]) {
            drawClassDetailChart(classData[selectedMajor], selectedMajor);
        }
    });

    document.getElementById('exportDataBtn').addEventListener('click', () => exportToExcel(collegeData, majorData, classData));

    // 初始化专业下拉框
    initMajorSelect();
}

// 计算各学院数据
function calculateCollegeData(students, records) {
    const colleges = window.appData.colleges;
    const categories = ['德育', '智育', '体育', '美育', '劳育'];
    const result = {};

    colleges.forEach(college => {
        const collegeStudents = students.filter(s => s.college === college);
        const collegeRecords = records.filter(r => collegeStudents.some(s => s.id === r.studentId));

        result[college] = {};
        categories.forEach(cat => {
            const catRecords = collegeRecords.filter(r => r.category === cat && r.status === 'approved');
            const avgScore = catRecords.length > 0
                ? (catRecords.reduce((sum, r) => sum + r.score, 0) / catRecords.length).toFixed(1)
                : 0;
            result[college][cat] = parseFloat(avgScore);
        });
    });

    return result;
}

// 计算各专业数据
function calculateMajorData(students, records) {
    const majors = {};
    window.appData.studentUsers.forEach(s => {
        if (s.major && !majors[s.major]) majors[s.major] = [];
        if (s.major) majors[s.major].push(s);
    });

    const categories = ['德育', '智育', '体育', '美育', '劳育'];
    const result = {};

    Object.keys(majors).forEach(major => {
        const majorStudents = majors[major];
        const majorRecords = records.filter(r => majorStudents.some(s => s.id === r.studentId));

        result[major] = {};
        categories.forEach(cat => {
            const catRecords = majorRecords.filter(r => r.category === cat && r.status === 'approved');
            const avgScore = catRecords.length > 0
                ? (catRecords.reduce((sum, r) => sum + r.score, 0) / catRecords.length).toFixed(1)
                : 0;
            result[major][cat] = parseFloat(avgScore);
        });
        result[major].college = majorStudents[0]?.college || '';
    });

    return result;
}

// 计算各班级数据
function calculateClassData(students, records) {
    const classes = {};
    window.appData.studentUsers.forEach(s => {
        if (s.className && !classes[s.className]) classes[s.className] = [];
        if (s.className) classes[s.className].push(s);
    });

    const categories = ['德育', '智育', '体育', '美育', '劳育'];
    const result = {};

    Object.keys(classes).forEach(className => {
        const classStudents = classes[className];
        const classRecords = records.filter(r => classStudents.some(s => s.id === r.studentId));

        result[className] = {};
        categories.forEach(cat => {
            const catRecords = classRecords.filter(r => r.category === cat && r.status === 'approved');
            const avgScore = catRecords.length > 0
                ? (catRecords.reduce((sum, r) => sum + r.score, 0) / catRecords.length).toFixed(1)
                : 0;
            result[className][cat] = parseFloat(avgScore);
        });
        result[className].major = classStudents[0]?.major || '';
    });

    return result;
}

// 绘制专业图表（折线图）
function drawMajorChart(data) {
    const canvas = document.getElementById('majorChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const majors = Object.keys(data);
    const categories = ['德育', '智育', '体育', '美育', '劳育'];
    const colors = ['#b8860b', '#d4a017', '#a0522d', '#daa520', '#cd853f', '#8b6914', '#c4a27a', '#9b6a3c'];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = { top: 20, right: 80, bottom: 50, left: 60 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    // 绘制坐标轴
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + height);
    ctx.lineTo(margin.left + width, margin.top + height);
    ctx.stroke();

    // 绘制X轴标签
    categories.forEach((cat, i) => {
        const x = margin.left + (i / (categories.length - 1)) * width;
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(cat, x - 15, margin.top + height + 20);
    });

    // 绘制Y轴标签
    for (let i = 0; i <= 5; i++) {
        const y = margin.top + height - (i / 5) * height;
        ctx.fillStyle = '#999';
        ctx.font = '10px Arial';
        ctx.fillText(i * 20, margin.left - 30, y);
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + width, y);
        ctx.strokeStyle = '#eee';
        ctx.stroke();
    }

    // 绘制折线
    majors.forEach((major, idx) => {
        const majorData = data[major];
        const color = colors[idx % colors.length];

        ctx.beginPath();
        categories.forEach((cat, i) => {
            const x = margin.left + (i / (categories.length - 1)) * width;
            const y = margin.top + height - (majorData[cat] / 100) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制数据点
        categories.forEach((cat, i) => {
            const x = margin.left + (i / (categories.length - 1)) * width;
            const y = margin.top + height - (majorData[cat] / 100) * height;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.fillText(majorData[cat], x - 8, y - 8);
        });

        // 图例
        ctx.fillStyle = color;
        ctx.fillRect(margin.left + width + 10, margin.top + idx * 20, 12, 12);
        ctx.fillStyle = '#333';
        ctx.font = '11px Arial';
        ctx.fillText(major, margin.left + width + 28, margin.top + idx * 20 + 10);
    });
}

// 绘制班级图表
function drawClassChart(data) {
    const canvas = document.getElementById('classChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const majorSelect = document.getElementById('majorSelect');
    const selectedMajor = majorSelect.value;

    if (!selectedMajor) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999';
        ctx.font = '14px Arial';
        ctx.fillText('请先选择专业', canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    const classes = Object.keys(data).filter(c => data[c].major === selectedMajor);
    const categories = ['德育', '智育', '体育', '美育', '劳育'];
    const colors = ['#b8860b', '#d4a017', '#a0522d', '#daa520', '#cd853f'];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = { top: 20, right: 100, bottom: 50, left: 60 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    // 绘制坐标轴
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + height);
    ctx.lineTo(margin.left + width, margin.top + height);
    ctx.stroke();

    // 绘制X轴标签
    categories.forEach((cat, i) => {
        const x = margin.left + (i / (categories.length - 1)) * width;
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(cat, x - 15, margin.top + height + 20);
    });

    // 绘制Y轴标签
    for (let i = 0; i <= 5; i++) {
        const y = margin.top + height - (i / 5) * height;
        ctx.fillStyle = '#999';
        ctx.font = '10px Arial';
        ctx.fillText(i * 20, margin.left - 30, y);
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + width, y);
        ctx.strokeStyle = '#eee';
        ctx.stroke();
    }

    // 绘制折线
    classes.forEach((cls, idx) => {
        const classData = data[cls];
        const color = colors[idx % colors.length];

        ctx.beginPath();
        categories.forEach((cat, i) => {
            const x = margin.left + (i / (categories.length - 1)) * width;
            const y = margin.top + height - (classData[cat] / 100) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制数据点
        categories.forEach((cat, i) => {
            const x = margin.left + (i / (categories.length - 1)) * width;
            const y = margin.top + height - (classData[cat] / 100) * height;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        });

        // 图例
        ctx.fillStyle = color;
        ctx.fillRect(margin.left + width + 10, margin.top + idx * 20, 12, 12);
        ctx.fillStyle = '#333';
        ctx.font = '11px Arial';
        ctx.fillText(cls, margin.left + width + 28, margin.top + idx * 20 + 10);
    });
}

// 绘制班级详情图
function drawClassDetailChart(data, className) {
    const canvas = document.getElementById('classChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const categories = ['德育', '智育', '体育', '美育', '劳育'];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = { top: 20, right: 50, bottom: 50, left: 60 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    // 绘制坐标轴
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + height);
    ctx.lineTo(margin.left + width, margin.top + height);
    ctx.stroke();

    // 绘制X轴标签
    categories.forEach((cat, i) => {
        const x = margin.left + (i / (categories.length - 1)) * width;
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(cat, x - 15, margin.top + height + 20);
    });

    // 绘制Y轴标签
    for (let i = 0; i <= 5; i++) {
        const y = margin.top + height - (i / 5) * height;
        ctx.fillStyle = '#999';
        ctx.font = '10px Arial';
        ctx.fillText(i * 20, margin.left - 30, y);
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + width, y);
        ctx.strokeStyle = '#eee';
        ctx.stroke();
    }

    // 绘制折线
    ctx.beginPath();
    categories.forEach((cat, i) => {
        const x = margin.left + (i / (categories.length - 1)) * width;
        const y = margin.top + height - (data[cat] / 100) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 绘制数据点
    categories.forEach((cat, i) => {
        const x = margin.left + (i / (categories.length - 1)) * width;
        const y = margin.top + height - (data[cat] / 100) * height;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#b8860b';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(data[cat], x - 8, y - 10);
    });

    // 标题
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`${className} 五育得分详情`, margin.left + width / 2 - 100, margin.top - 5);
}

// 绘制学院雷达图
function drawCollegeRadarChart(data) {
    const canvas = document.getElementById('collegeRadarChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const colleges = Object.keys(data);
    const categories = ['德育', '智育', '体育', '美育', '劳育'];
    const colors = ['rgba(184,134,11,0.25)', 'rgba(232,167,53,0.25)', 'rgba(201,126,42,0.25)', 'rgba(212,146,42,0.25)'];
    const borderColors = ['#b8860b', '#e8a735', '#c97e2a', '#d4922a'];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2.5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        const r = radius * (i / 5);
        for (let j = 0; j < categories.length; j++) {
            const angle = (j * 72 - 90) * Math.PI / 180;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = '#ddd';
        ctx.stroke();
    }

    // 绘制轴线
    categories.forEach((cat, i) => {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#ddd';
        ctx.stroke();

        // 标签
        ctx.fillStyle = '#555';
        ctx.font = '12px Arial';
        ctx.fillText(cat, x + 5, y + 5);
    });

    // 绘制各学院数据
    colleges.forEach((college, idx) => {
        const collegeData = data[college];
        ctx.beginPath();
        for (let i = 0; i < categories.length; i++) {
            const value = collegeData[categories[i]] || 0;
            const r = radius * (value / 100);
            const angle = (i * 72 - 90) * Math.PI / 180;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = colors[idx % colors.length];
        ctx.fill();
        ctx.strokeStyle = borderColors[idx % borderColors.length];
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // 图例
    colleges.forEach((college, idx) => {
        ctx.fillStyle = borderColors[idx % borderColors.length];
        ctx.fillRect(canvas.width - 100, 20 + idx * 25, 15, 15);
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(college, canvas.width - 80, 32 + idx * 25);
    });
}

// 渲染分析报告
function renderAnalysis(collegeData, majorData, classData) {
    const container = document.getElementById('analysisContent');

    // 计算整体平均分
    let totalScores = { '德育': 0, '智育': 0, '体育': 0, '美育': 0, '劳育': 0 };
    let collegeCount = 0;

    for (let college in collegeData) {
        collegeCount++;
        for (let cat in totalScores) {
            totalScores[cat] += collegeData[college][cat] || 0;
        }
    }

    for (let cat in totalScores) {
        totalScores[cat] = (totalScores[cat] / collegeCount).toFixed(1);
    }

    // 找出最强和最弱的方面
    let maxCat = '', maxScore = 0, minCat = '', minScore = 100;
    for (let cat in totalScores) {
        if (totalScores[cat] > maxScore) {
            maxScore = totalScores[cat];
            maxCat = cat;
        }
        if (totalScores[cat] < minScore) {
            minScore = totalScores[cat];
            minCat = cat;
        }
    }

    // 找出最优学院
    let bestCollege = '', bestCollegeScore = 0;
    for (let college in collegeData) {
        let avg = (collegeData[college]['德育'] + collegeData[college]['智育'] + collegeData[college]['体育'] + collegeData[college]['美育'] + collegeData[college]['劳育']) / 5;
        if (avg > bestCollegeScore) {
            bestCollegeScore = avg;
            bestCollege = college;
        }
    }

    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div style="background: #f9f5f0; padding: 15px; border-radius: 8px;">
                <h4><i class="fas fa-chart-line"></i> 整体表现</h4>
                <table style="width:100%; margin-top: 10px;">
                    <tr><td>德育平均分：</td><td><strong style="color:#b8860b;">${totalScores.德育}分</strong></td></tr>
                    <tr><td>智育平均分：</td><td><strong style="color:#b8860b;">${totalScores.智育}分</strong></td></tr>
                    <tr><td>体育平均分：</td><td><strong style="color:#b8860b;">${totalScores.体育}分</strong></td></tr>
                    <tr><td>美育平均分：</td><td><strong style="color:#b8860b;">${totalScores.美育}分</strong></td></tr>
                    <tr><td>劳育平均分：</td><td><strong style="color:#b8860b;">${totalScores.劳育}分</strong></td></tr>
                </table>
            </div>
            <div style="background: #f9f5f0; padding: 15px; border-radius: 8px;">
                <h4><i class="fas fa-lightbulb"></i> 改进建议</h4>
                <ul style="margin-top: 10px; margin-left: 20px;">
                    <li>✅ 优势领域：<strong>${maxCat}</strong>（${maxScore}分），继续保持！</li>
                    <li>⚠️ 需要加强：<strong>${minCat}</strong>（${minScore}分），建议增加相关活动</li>
                    <li>🏆 优秀学院：<strong>${bestCollege}</strong>（${bestCollegeScore.toFixed(1)}分）</li>
                    <li>📈 提升建议：增加${minCat}相关课程和实践活动，提升综合素质</li>
                </ul>
            </div>
        </div>
    `;
}

// 渲染导出预览
function renderExportPreview(collegeData, majorData, classData) {
    const container = document.getElementById('exportPreview');

    let html = '<h4>数据预览（前10条）</h4>';
    html += '<table style="width:100%; border-collapse: collapse;">';
    html += '<tr style="background:#f0e6d6;"><th>类型</th><th>名称</th><th>德育</th><th>智育</th><th>体育</th><th>美育</th><th>劳育</th><th>平均分</th></tr>';

    // 学院数据
    for (let college in collegeData) {
        const avg = (collegeData[college]['德育'] + collegeData[college]['智育'] + collegeData[college]['体育'] + collegeData[college]['美育'] + collegeData[college]['劳育']) / 5;
        html += `<tr><td>学院</td><td>${college}</td><td>${collegeData[college]['德育']}</td><td>${collegeData[college]['智育']}</td><td>${collegeData[college]['体育']}</td><td>${collegeData[college]['美育']}</td><td>${collegeData[college]['劳育']}</td><td>${avg.toFixed(1)}</td></tr>`;
    }

    // 专业数据（取前5）
    let majorCount = 0;
    for (let major in majorData) {
        if (majorCount++ >= 5) break;
        const avg = (majorData[major]['德育'] + majorData[major]['智育'] + majorData[major]['体育'] + majorData[major]['美育'] + majorData[major]['劳育']) / 5;
        html += `<tr><td>专业</td><td>${major}</td><td>${majorData[major]['德育']}</td><td>${majorData[major]['智育']}</td><td>${majorData[major]['体育']}</td><td>${majorData[major]['美育']}</td><td>${majorData[major]['劳育']}</td><td>${avg.toFixed(1)}</td></tr>`;
    }

    html += '</table>';
    container.innerHTML = html;
}

// 导出Excel
function exportToExcel(collegeData, majorData, classData) {
    let csv = "类型,名称,德育,智育,体育,美育,劳育,平均分\n";

    // 学院数据
    for (let college in collegeData) {
        const avg = (collegeData[college]['德育'] + collegeData[college]['智育'] + collegeData[college]['体育'] + collegeData[college]['美育'] + collegeData[college]['劳育']) / 5;
        csv += `学院,${college},${collegeData[college]['德育']},${collegeData[college]['智育']},${collegeData[college]['体育']},${collegeData[college]['美育']},${collegeData[college]['劳育']},${avg.toFixed(1)}\n`;
    }

    // 专业数据
    for (let major in majorData) {
        const avg = (majorData[major]['德育'] + majorData[major]['智育'] + majorData[major]['体育'] + majorData[major]['美育'] + majorData[major]['劳育']) / 5;
        csv += `专业,${major},${majorData[major]['德育']},${majorData[major]['智育']},${majorData[major]['体育']},${majorData[major]['美育']},${majorData[major]['劳育']},${avg.toFixed(1)}\n`;
    }

    // 班级数据
    for (let cls in classData) {
        const avg = (classData[cls]['德育'] + classData[cls]['智育'] + classData[cls]['体育'] + classData[cls]['美育'] + classData[cls]['劳育']) / 5;
        csv += `班级,${cls},${classData[cls]['德育']},${classData[cls]['智育']},${classData[cls]['体育']},${classData[cls]['美育']},${classData[cls]['劳育']},${avg.toFixed(1)}\n`;
    }

    // 下载
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "综测数据统计.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("数据导出成功！");
}

// 过滤专业数据
function filterMajorDataByCollege(majorData, college) {
    const result = {};
    for (let major in majorData) {
        if (majorData[major].college === college) {
            result[major] = majorData[major];
        }
    }
    return result;
}

// 初始化专业下拉框
function initMajorSelect() {
    const majorSelect = document.getElementById('majorSelect');
    const allMajors = Object.keys(window.adminChartData?.majorData || {});

    if (majorSelect) {
        majorSelect.innerHTML = '<option value="">请选择专业</option>';
        allMajors.forEach(major => {
            majorSelect.innerHTML += `<option value="${major}">${major}</option>`;
        });
    }
}