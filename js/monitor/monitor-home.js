// ==================== 班委查询首页模块 ====================

// 学期数据配置
const monitorSemesterDataMap = {
    '2023-2024-1': {
        name: '2023-2024学年 第一学期',
        myScores: [72, 70, 68, 75, 73],
        majorScores: [70, 72, 69, 74, 71],
        fiveScores: { '德育': 85, '智育': 85, '体育': 85, '美育': 85, '劳育': 85 },
        weighted: { '德育': 17.0, '智育': 34.0, '体育': 8.5, '美育': 8.5, '劳育': 17.0 },
        total: 85.0
    },
    '2023-2024-2': {
        name: '2023-2024学年 第二学期',
        myScores: [78, 82, 80, 85, 83],
        majorScores: [75, 78, 76, 80, 78],
        fiveScores: { '德育': 88, '智育': 90, '体育': 86, '美育': 87, '劳育': 85 },
        weighted: { '德育': 17.6, '智育': 36.0, '体育': 8.6, '美育': 8.7, '劳育': 17.0 },
        total: 87.9
    },
    '2022-2023-1': {
        name: '2022-2023学年 第一学期',
        myScores: [65, 68, 66, 70, 68],
        majorScores: [68, 70, 67, 72, 69],
        fiveScores: { '德育': 82, '智育': 80, '体育': 78, '美育': 80, '劳育': 79 },
        weighted: { '德育': 16.4, '智育': 32.0, '体育': 7.8, '美育': 8.0, '劳育': 15.8 },
        total: 80.0
    },
    '2022-2023-2': {
        name: '2022-2023学年 第二学期',
        myScores: [70, 72, 69, 74, 71],
        majorScores: [69, 71, 68, 73, 70],
        fiveScores: { '德育': 84, '智育': 83, '体育': 80, '美育': 82, '劳育': 81 },
        weighted: { '德育': 16.8, '智育': 33.2, '体育': 8.0, '美育': 8.2, '劳育': 16.2 },
        total: 82.4
    }
};

let monitorCurrentSemester = '2023-2024-1';

function initMonitorHome() {
    bindMonitorSemesterSwitch();
    refreshMonitorHome();
}

function bindMonitorSemesterSwitch() {
    const semesterSelect = document.getElementById('semesterSelect');
    if (semesterSelect) {
        semesterSelect.addEventListener('change', function () {
            monitorCurrentSemester = this.value;
            showNotification(`已切换到：${this.options[this.selectedIndex].text}`);
            switchMonitorSemester(monitorCurrentSemester);
        });
    }
}

function switchMonitorSemester(semester) {
    const data = monitorSemesterDataMap[semester];

    const scoreItems = document.querySelectorAll('#monitorSystem .score-item');
    scoreItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (category && data.fiveScores[category]) {
            const originalSpan = item.querySelector('.score-original');
            const weightedSpan = item.querySelector('.score-weighted');
            if (originalSpan) originalSpan.textContent = `原始分：${data.fiveScores[category]}`;
            if (weightedSpan) weightedSpan.textContent = data.weighted[category];
        }
    });

    const totalElement = document.querySelector('#monitorSystem .total-value');
    if (totalElement) totalElement.textContent = data.total;

    updateMonitorRadarChart(data.fiveScores);
}

function refreshMonitorHome() {
    const homePage = document.getElementById('home-page');
    if (!homePage) return;

    const data = monitorSemesterDataMap[monitorCurrentSemester];
    const currentUser = window.currentUser;
    const records = JSON.parse(localStorage.getItem('studentRecords')) || [];
    const classRecords = records.filter(r => r.className === currentUser?.className);
    const pendingCount = classRecords.filter(r => r.status === 'pending').length;

    homePage.innerHTML = `
        <div class="section">
            <div class="section-title">总分细则</div>
            <div class="score-details">
                <div class="score-item" data-category="德育" data-original="${data.fiveScores.德育}" data-weighted="${data.weighted.德育}">
                    <div class="score-category">德育</div>
                    <div class="score-percent">(20%)(加权分)</div>
                    <div class="score-weighted">${data.weighted.德育}</div>
                    <div class="score-original">原始分：${data.fiveScores.德育}</div>
                </div>
                <div class="score-item" data-category="智育" data-original="${data.fiveScores.智育}" data-weighted="${data.weighted.智育}">
                    <div class="score-category">智育</div>
                    <div class="score-percent">(40%)(加权分)</div>
                    <div class="score-weighted">${data.weighted.智育}</div>
                    <div class="score-original">原始分：${data.fiveScores.智育}</div>
                </div>
                <div class="score-item" data-category="体育" data-original="${data.fiveScores.体育}" data-weighted="${data.weighted.体育}">
                    <div class="score-category">体育</div>
                    <div class="score-percent">(10%)(加权分)</div>
                    <div class="score-weighted">${data.weighted.体育}</div>
                    <div class="score-original">原始分：${data.fiveScores.体育}</div>
                </div>
                <div class="score-item" data-category="美育" data-original="${data.fiveScores.美育}" data-weighted="${data.weighted.美育}">
                    <div class="score-category">美育</div>
                    <div class="score-percent">(10%)(加权分)</div>
                    <div class="score-weighted">${data.weighted.美育}</div>
                    <div class="score-original">原始分：${data.fiveScores.美育}</div>
                </div>
                <div class="score-item" data-category="劳育" data-original="${data.fiveScores.劳育}" data-weighted="${data.weighted.劳育}">
                    <div class="score-category">劳育</div>
                    <div class="score-percent">(20%)(加权分)</div>
                    <div class="score-weighted">${data.weighted.劳育}</div>
                    <div class="score-original">原始分：${data.fiveScores.劳育}</div>
                </div>
                <div class="total-score" id="total-score">
                    <div class="total-label">学期综测总分</div>
                    <div class="total-value">${data.total}</div>
                </div>
            </div>
        </div>

        <div class="charts-container">
            <div class="section">
                <h3 class="section-title">个人五育的分配占比比较</h3>
                <div class="chart-box" style="height: 380px;">
                    <div class="chart-title">五维分析图</div>
                    <div class="radar-chart" id="radar-chart" style="position: relative; height: 300px; display: flex; justify-content: center; align-items: center;">
                        <svg class="radar-svg" width="300" height="300" viewBox="0 0 300 300" style="display: block; margin: 0 auto;">
                            <polygon points="150,45 250,108 210,235 90,235 50,108" fill="none" stroke="#e0d0b0" stroke-width="1.5"/>
                            <polygon points="150,70 230,120 198,212 102,212 70,120" fill="none" stroke="#e0d0b0" stroke-width="1" stroke-dasharray="4"/>
                            <polygon points="150,95 210,132 186,189 114,189 90,132" fill="none" stroke="#e0d0b0" stroke-width="1" stroke-dasharray="4"/>
                            <polygon points="150,120 190,144 174,166 126,166 110,144" fill="none" stroke="#e0d0b0" stroke-width="1" stroke-dasharray="4"/>
                            <line x1="150" y1="45" x2="150" y2="255" stroke="#e0d0b0" stroke-width="1"/>
                            <line x1="50" y1="108" x2="250" y2="108" stroke="#e0d0b0" stroke-width="1"/>
                            <line x1="90" y1="235" x2="210" y2="235" stroke="#e0d0b0" stroke-width="1"/>
                            <text x="150" y="35" text-anchor="middle" font-size="13" fill="#555" font-weight="bold">德育</text>
                            <text x="260" y="112" text-anchor="start" font-size="13" fill="#555" font-weight="bold">智育</text>
                            <text x="218" y="252" text-anchor="start" font-size="13" fill="#555" font-weight="bold">体育</text>
                            <text x="82" y="252" text-anchor="end" font-size="13" fill="#555" font-weight="bold">美育</text>
                            <text x="35" y="112" text-anchor="end" font-size="13" fill="#555" font-weight="bold">劳育</text>
                            <polygon id="radar-data-polygon" fill="rgba(184,134,11,0.25)" stroke="#b8860b" stroke-width="2.5"/>
                            <circle id="dot-de" r="6" fill="#b8860b" stroke="white" stroke-width="2" cursor="pointer"/>
                            <circle id="dot-in" r="6" fill="#b8860b" stroke="white" stroke-width="2" cursor="pointer"/>
                            <circle id="dot-ph" r="6" fill="#b8860b" stroke="white" stroke-width="2" cursor="pointer"/>
                            <circle id="dot-ar" r="6" fill="#b8860b" stroke="white" stroke-width="2" cursor="pointer"/>
                            <circle id="dot-la" r="6" fill="#b8860b" stroke="white" stroke-width="2" cursor="pointer"/>
                        </svg>
                    </div>
                    <div class="chart-note" id="radar-chart-note">五育发展对比：德育 ${data.fiveScores.德育} | 智育 ${data.fiveScores.智育} | 体育 ${data.fiveScores.体育} | 美育 ${data.fiveScores.美育} | 劳育 ${data.fiveScores.劳育}</div>
                </div>
            </div>

            <div class="section">
                <h3 class="section-title">个人和专业五育平均分比较</h3>
                <div class="chart-box" style="height: 380px;">
                    <div class="chart-title">学期趋势曲线</div>
                    <div class="line-chart-container" style="position: relative; height: 300px; width: 100%;">
                        <canvas id="trendChart" width="500" height="280" style="width: 100%; height: auto;"></canvas>
                    </div>
                    <div class="chart-note">学业五育分析：个人发展稳步提升</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h3 class="section-title">成长建议</h3>
            <ul class="suggestions-list">
                <li class="suggestion-item"><i class="fas fa-lightbulb"></i>善用思维导图: 用思维导图梳理知识结构，将零散的知识点可视化，有助于理解和记忆。<div class="suggestion-detail">具体实施方法：每周对所学内容进行一次思维导图整理...</div></li>
                <li class="suggestion-item"><i class="fas fa-lightbulb"></i>加强劳育实践: 参与更多社会实践活动，提高动手能力和团队协作能力。<div class="suggestion-detail">具体实施方法：每学期至少参加两次社会实践活动...</div></li>
                <li class="suggestion-item"><i class="fas fa-lightbulb"></i>注重体育锻炼: 保持规律运动，增强身体素质，提高学习效率。<div class="suggestion-detail">具体实施方法：制定每周运动计划，如每周三次...</div></li>
            </ul>
        </div>
        
        <div class="section">
            <div class="section-title">待审核记录</div>
            <div id="monitor-pending-list"></div>
        </div>
    `;

    updateMonitorRadarChart(data.fiveScores);
    drawMonitorLineChart();

    // 待审核记录
    const pendingContainer = document.getElementById('monitor-pending-list');
    if (pendingContainer) {
        if (pendingCount === 0) {
            pendingContainer.innerHTML = '<div style="text-align:center;padding:20px;">暂无待审核记录</div>';
        } else {
            pendingContainer.innerHTML = `
                <table style="width:100%;border-collapse:collapse;">
                    <tr style="background:#f0e6d6;"><th>学生</th><th>项目</th><th>类别</th><th>得分</th><th>操作</th><tr>
                    ${classRecords.filter(r => r.status === 'pending').map(r => `
                        <tr><td>${r.studentName}</td><td>${r.name}</td><td>${r.category}</td><td>${r.score}分</td><td><button class="btn btn-primary" onclick="document.querySelector('#monitorSystem .nav-item[data-page=\'review\']').click()">去审核</button></td></tr>
                    `).join('')}
                </table>
            `;
        }
    }

    bindMonitorHomeEvents();
}

function updateMonitorRadarChart(scores) {
    const centerX = 150, centerY = 150;
    const maxRadius = 105;
    const angles = [-90, -18, 54, 126, 198];
    const dimensions = ['德育', '智育', '体育', '美育', '劳育'];
    const dotIds = ['dot-de', 'dot-in', 'dot-ph', 'dot-ar', 'dot-la'];

    let points = [];
    for (let i = 0; i < dimensions.length; i++) {
        const score = scores[dimensions[i]] || 0;
        const radius = (score / 100) * maxRadius;
        const angleRad = angles[i] * Math.PI / 180;
        const x = centerX + radius * Math.cos(angleRad);
        const y = centerY + radius * Math.sin(angleRad);
        points.push(`${x},${y}`);

        const dot = document.getElementById(dotIds[i]);
        if (dot) {
            dot.setAttribute('cx', x);
            dot.setAttribute('cy', y);
            dot.setAttribute('data-value', score);
            dot.setAttribute('data-dimension', dimensions[i]);
            dot.onmouseenter = function () {
                const dim = this.getAttribute('data-dimension');
                const val = this.getAttribute('data-value');
                showNotification(`${dim}: ${val}分`);
            };
        }
    }
    const polygon = document.getElementById('radar-data-polygon');
    if (polygon) polygon.setAttribute('points', points.join(' '));

    const chartNote = document.getElementById('radar-chart-note');
    if (chartNote) chartNote.innerHTML = `五育发展对比：德育 ${scores.德育} | 智育 ${scores.智育} | 体育 ${scores.体育} | 美育 ${scores.美育} | 劳育 ${scores.劳育}`;
}

function drawMonitorLineChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    const width = container ? container.clientWidth - 40 : 460;
    canvas.width = width;
    canvas.height = 260;

    const semesters = ['第一学期', '第二学期', '第三学期', '第四学期', '第五学期'];
    const myScores = [65, 72, 78, 82, 85];
    const majorScores = [68, 70, 75, 80, 83];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = { top: 20, right: 40, bottom: 45, left: 50 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;

    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    for (let i = 0; i < semesters.length; i++) {
        const x = margin.left + (i / (semesters.length - 1)) * chartWidth;
        ctx.fillStyle = '#666';
        ctx.font = '11px Arial';
        ctx.fillText(semesters[i], x - 20, margin.top + chartHeight + 22);
    }

    for (let i = 0; i <= 5; i++) {
        const y = margin.top + chartHeight - (i / 5) * chartHeight;
        const value = 40 + i * 12;
        ctx.fillStyle = '#999';
        ctx.font = '10px Arial';
        ctx.fillText(value, margin.left - 32, y + 3);
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + chartWidth, y);
        ctx.strokeStyle = '#eee';
        ctx.stroke();
    }

    ctx.beginPath();
    for (let i = 0; i < myScores.length; i++) {
        const x = margin.left + (i / (myScores.length - 1)) * chartWidth;
        const y = margin.top + chartHeight - ((myScores[i] - 40) / 60) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    for (let i = 0; i < myScores.length; i++) {
        const x = margin.left + (i / (myScores.length - 1)) * chartWidth;
        const y = margin.top + chartHeight - ((myScores[i] - 40) / 60) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#b8860b';
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(myScores[i], x - 7, y - 8);
    }

    ctx.beginPath();
    for (let i = 0; i < majorScores.length; i++) {
        const x = margin.left + (i / (majorScores.length - 1)) * chartWidth;
        const y = margin.top + chartHeight - ((majorScores[i] - 40) / 60) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i < majorScores.length; i++) {
        const x = margin.left + (i / (majorScores.length - 1)) * chartWidth;
        const y = margin.top + chartHeight - ((majorScores[i] - 40) / 60) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#999';
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(majorScores[i], x - 7, y - 7);
    }

    ctx.fillStyle = '#b8860b';
    ctx.fillRect(margin.left + chartWidth - 120, margin.top - 5, 15, 12);
    ctx.fillStyle = '#333';
    ctx.font = '11px Arial';
    ctx.fillText('我的成绩', margin.left + chartWidth - 100, margin.top + 5);

    ctx.fillStyle = '#999';
    ctx.fillRect(margin.left + chartWidth - 55, margin.top - 5, 15, 12);
    ctx.fillStyle = '#333';
    ctx.fillText('专业平均', margin.left + chartWidth - 35, margin.top + 5);
}

function bindMonitorHomeEvents() {
    const scoreItems = document.querySelectorAll('#monitorSystem .score-item');
    scoreItems.forEach(item => {
        item.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            const original = this.getAttribute('data-original');
            const weighted = this.getAttribute('data-weighted');
            showNotification(`${category}：原始分${original}，加权分${weighted}`);
        });
    });

    const totalScore = document.getElementById('total-score');
    if (totalScore) {
        totalScore.addEventListener('click', function () {
            const data = monitorSemesterDataMap[monitorCurrentSemester];
            showNotification(`学期综测总分：${data.total}分`);
        });
    }

    const suggestionItems = document.querySelectorAll('#monitorSystem .suggestion-item');
    suggestionItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('expanded');
        });
    });
}
