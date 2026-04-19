// ==================== 学生查询首页模块 ====================

function initMonitorHome() {
    refreshMonitorHome();
}

function refreshMonitorHome() {
    const homePage = document.getElementById('home-page');
    if (!homePage) return;

    homePage.innerHTML = `
        <!-- 总分细则 -->
        <div class="section">
            <div class="section-title">
                总分细则
                <button class="export-btn" id="export-scores-btn">
                    <i class="fas fa-download"></i> 导出成绩单
                </button>
            </div>
            <div class="score-details">
                <div class="score-item" data-category="德育" data-original="85.0" data-weighted="17.0">
                    <div class="score-category">德育</div>
                    <div class="score-percent">(20%)(加权分)</div>
                    <div class="score-weighted">17.0</div>
                    <div class="score-original">原始分：85.0</div>
                </div>
                <div class="score-item" data-category="智育" data-original="85.0" data-weighted="34.0">
                    <div class="score-category">智育</div>
                    <div class="score-percent">(40%)(加权分)</div>
                    <div class="score-weighted">34.0</div>
                    <div class="score-original">原始分：85.0</div>
                </div>
                <div class="score-item" data-category="体育" data-original="85.0" data-weighted="8.5">
                    <div class="score-category">体育</div>
                    <div class="score-percent">(10%)(加权分)</div>
                    <div class="score-weighted">8.5</div>
                    <div class="score-original">原始分：85.0</div>
                </div>
                <div class="score-item" data-category="美育" data-original="85.0" data-weighted="8.5">
                    <div class="score-category">美育</div>
                    <div class="score-percent">(10%)(加权分)</div>
                    <div class="score-weighted">8.5</div>
                    <div class="score-original">原始分：85.0</div>
                </div>
                <div class="score-item" data-category="劳育" data-original="85.0" data-weighted="17.0">
                    <div class="score-category">劳育</div>
                    <div class="score-percent">(20%)(加权分)</div>
                    <div class="score-weighted">17.0</div>
                    <div class="score-original">原始分：85.0</div>
                </div>
                <div class="total-score" id="total-score">
                    <div class="total-label">学期综测总分</div>
                    <div class="total-value">85.0</div>
                </div>
            </div>
        </div>

        <!-- 图表区域 -->
        <div class="charts-container">
            <div class="section">
                <h3 class="section-title">个人五育的分配占比比较</h3>
                <div class="chart-box">
                    <div class="chart-title">五维分析图</div>
                    <div class="radar-chart" id="radar-chart">
                        <div class="radar-grid"></div>
                        <div class="radar-grid"></div>
                        <div class="radar-grid"></div>
                        <div class="radar-axis"></div>
                        <div class="radar-axis"></div>
                        <div class="radar-axis"></div>
                        <div class="radar-axis"></div>
                        <div class="radar-axis"></div>
                        <div class="radar-point" data-dimension="德育" data-value="30"></div>
                        <div class="radar-point" data-dimension="智育" data-value="40"></div>
                        <div class="radar-point" data-dimension="体育" data-value="35"></div>
                        <div class="radar-point" data-dimension="美育" data-value="35"></div>
                        <div class="radar-point" data-dimension="劳育" data-value="40"></div>
                        <div class="radar-line"></div>
                        <div class="radar-tooltip" id="radar-tooltip"></div>
                    </div>
                    <div class="chart-note">五育发展对比：德育 30 | 智育 40 | 体育 35 | 美育 35 | 劳育 40</div>
                </div>
            </div>

            <div class="section">
                <h3 class="section-title">个人和专业五育平均分比较</h3>
                <div class="chart-box">
                    <div class="chart-title">学期趋势曲线</div>
                    <div class="line-chart">
                        <div class="chart-grid">
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                        </div>
                        <div class="chart-data">
                            <div class="data-point" data-semester="第一学期" data-value="60">
                                <div class="data-value" style="height: 60%;"></div>
                                <div class="data-label">第一学期</div>
                            </div>
                            <div class="data-point" data-semester="第二学期" data-value="70">
                                <div class="data-value" style="height: 70%;"></div>
                                <div class="data-label">第二学期</div>
                            </div>
                            <div class="data-point" data-semester="第三学期" data-value="80">
                                <div class="data-value" style="height: 80%;"></div>
                                <div class="data-label">第三学期</div>
                            </div>
                            <div class="data-point" data-semester="第四学期" data-value="85">
                                <div class="data-value" style="height: 85%;"></div>
                                <div class="data-label">第四学期</div>
                            </div>
                            <div class="data-point" data-semester="第五学期" data-value="90">
                                <div class="data-value" style="height: 90%;"></div>
                                <div class="data-label">第五学期</div>
                            </div>
                        </div>
                        <div class="line-path">
                            <div class="line"></div>
                        </div>
                    </div>
                    <div class="chart-note">学业五育分析：个人发展稳步提升</div>
                </div>
            </div>
        </div>

        <!-- 成长建议 -->
        <div class="section">
            <h3 class="section-title">成长建议</h3>
            <ul class="suggestions-list">
                <li class="suggestion-item" id="suggestion1">
                    <i class="fas fa-lightbulb"></i>
                    善用思维导图: 用思维导图梳理知识结构，将零散的知识点可视化，有助于理解和记忆。
                    <div class="suggestion-detail">
                        具体实施方法：每周对所学内容进行一次思维导图整理，将主要概念、公式、案例用层级结构表示出来，使用颜色和图标增强记忆效果。推荐使用XMind、MindNode等工具，或手绘在笔记本上。
                    </div>
                </li>
                <li class="suggestion-item" id="suggestion2">
                    <i class="fas fa-lightbulb"></i>
                    加强劳育实践: 参与更多社会实践活动，提高动手能力和团队协作能力。
                    <div class="suggestion-detail">
                        具体实施方法：每学期至少参加两次社会实践活动，如社区服务、志愿者活动或校企合作项目。建议记录实践过程与心得，反思在团队中的角色与贡献，这不仅能提升实践能力，还能为综合素质评价积累材料。
                    </div>
                </li>
                <li class="suggestion-item" id="suggestion3">
                    <i class="fas fa-lightbulb"></i>
                    注重体育锻炼: 保持规律运动，增强身体素质，提高学习效率。
                    <div class="suggestion-detail">
                        具体实施方法：制定每周运动计划，如每周三次，每次30-60分钟的有氧运动（跑步、游泳、球类运动等）。可以加入学校的体育社团，或使用运动APP记录锻炼数据。研究显示，规律运动能提升大脑认知功能和学习效率20%以上。
                    </div>
                </li>
            </ul>
        </div>
    `;

    bindStudentHomeEvents();
}

function bindStudentHomeEvents() {
    // 导出成绩单功能
    const exportBtn = document.getElementById('export-scores-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            const exportData = {
                '德育': { 原始分: 85.0, 加权分: 17.0 },
                '智育': { 原始分: 85.0, 加权分: 34.0 },
                '体育': { 原始分: 85.0, 加权分: 8.5 },
                '美育': { 原始分: 85.0, 加权分: 8.5 },
                '劳育': { 原始分: 85.0, 加权分: 17.0 },
                '学期综测总分': 85.0
            };
            const exportStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([exportStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '综测成绩_' + new Date().toISOString().split('T')[0] + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification('成绩数据已导出为JSON文件！');
        });
    }

    // 分数项点击事件
    const scoreItems = document.querySelectorAll('#studentSystem .score-item');
    scoreItems.forEach(item => {
        item.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            const original = this.getAttribute('data-original');
            const weighted = this.getAttribute('data-weighted');

            this.style.transform = 'translateY(-5px) scale(1.05)';
            this.style.boxShadow = '0 10px 20px rgba(184, 134, 11, 0.3)';
            setTimeout(() => {
                this.style.transform = '';
                this.style.boxShadow = '';
            }, 200);

            showNotification(`${category}：原始分${original}，加权分${weighted}`);
        });
    });

    // 总分点击事件
    const totalScore = document.getElementById('total-score');
    if (totalScore) {
        totalScore.addEventListener('click', function () {
            const valueElement = this.querySelector('.total-value');
            valueElement.style.fontSize = '50px';
            valueElement.style.color = '#b8860b';
            setTimeout(() => {
                valueElement.style.fontSize = '45px';
                valueElement.style.color = '#a0522d';
            }, 300);
            showNotification('学期综测总分：85.0分，表现优秀！');
        });
    }

    // 雷达图交互
    const radarPoints = document.querySelectorAll('#studentSystem .radar-point');
    const radarTooltip = document.getElementById('radar-tooltip');

    radarPoints.forEach(point => {
        point.addEventListener('mouseenter', function (e) {
            const dimension = this.getAttribute('data-dimension');
            const value = this.getAttribute('data-value');
            radarTooltip.textContent = `${dimension}: ${value}分`;
            radarTooltip.style.opacity = '1';
            const rect = this.getBoundingClientRect();
            const containerRect = document.querySelector('#studentSystem .radar-chart').getBoundingClientRect();
            radarTooltip.style.top = (rect.top - containerRect.top - 30) + 'px';
            radarTooltip.style.left = (rect.left - containerRect.left) + 'px';
        });
        point.addEventListener('mouseleave', function () {
            radarTooltip.style.opacity = '0';
        });
        point.addEventListener('click', function () {
            const dimension = this.getAttribute('data-dimension');
            const value = this.getAttribute('data-value');
            let message = `${dimension}维度得分为${value}分，`;
            if (value >= 40) message += '表现优秀！';
            else if (value >= 30) message += '表现良好，继续保持！';
            else message += '有提升空间，继续努力！';
            showNotification(message);
        });
    });

    // 折线图数据点点击事件
    const dataPoints = document.querySelectorAll('#studentSystem .data-point');
    dataPoints.forEach(point => {
        point.addEventListener('click', function () {
            const semester = this.getAttribute('data-semester');
            const value = this.getAttribute('data-value');
            showNotification(`在${semester}，您的五育平均分为：${value}分`);
        });
    });

    // 成长建议折叠/展开功能
    const suggestionItems = document.querySelectorAll('#studentSystem .suggestion-item');
    suggestionItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('expanded');
            const icon = this.querySelector('i');
            if (this.classList.contains('expanded')) {
                icon.style.transform = 'rotate(90deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    // 图表悬停效果
    const chartBoxes = document.querySelectorAll('#studentSystem .chart-box');
    chartBoxes.forEach(box => {
        box.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });
        box.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
}