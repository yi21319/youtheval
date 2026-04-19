// ==================== 班委评测标准模块 ====================

let monitorStandards = null;

function initMonitorStandard() {
    loadMonitorStandards();
}

function loadMonitorStandards() {
    const container = document.getElementById('standard-page');
    if (!container) return;

    const stored = localStorage.getItem('standards');
    if (stored && JSON.parse(stored)) {
        monitorStandards = JSON.parse(stored);
    } else {
        monitorStandards = {
            '德育': [
                { name: '思想品德', score: 20, desc: '拥护党的路线方针政策，自觉践行社会主义核心价值观' },
                { name: '遵纪守法', score: 15, desc: '遵守国家法律法规和校纪校规' },
                { name: '集体荣誉', score: 15, desc: '关心集体，积极参加集体活动' },
                { name: '志愿服务', score: 20, desc: '参加志愿服务活动，时长达标' },
                { name: '社会实践', score: 20, desc: '参加社会实践活动，提交实践报告' },
                { name: '文明礼仪', score: 10, desc: '举止文明，尊敬师长，团结同学' }
            ],
            '智育': [
                { name: '学业成绩', score: 40, desc: '学期平均学分绩点，按专业排名折算' },
                { name: '学术竞赛', score: 20, desc: '参加学科竞赛，获得校级及以上奖项' },
                { name: '科研创新', score: 15, desc: '参与科研项目，发表学术论文' },
                { name: '技能证书', score: 10, desc: '获得与专业相关的技能证书' },
                { name: '学习进步', score: 10, desc: '与上一学期相比有明显进步' },
                { name: '学术活动', score: 5, desc: '参加学术讲座、学术论坛' }
            ],
            '体育': [
                { name: '体育成绩', score: 30, desc: '体育课成绩，按实际得分计算' },
                { name: '体质测试', score: 20, desc: '国家学生体质健康标准测试成绩' },
                { name: '体育竞赛', score: 20, desc: '参加体育比赛，获得校级及以上奖项' },
                { name: '日常锻炼', score: 15, desc: '坚持体育锻炼，有锻炼记录' },
                { name: '体育社团', score: 10, desc: '参加体育类社团，积极参与活动' },
                { name: '体育知识', score: 5, desc: '掌握体育健康知识' }
            ],
            '美育': [
                { name: '艺术课程', score: 25, desc: '艺术类课程成绩，按实际得分计算' },
                { name: '艺术实践', score: 20, desc: '参加艺术实践活动，有作品或表演' },
                { name: '艺术竞赛', score: 20, desc: '参加艺术类比赛，获得校级及以上奖项' },
                { name: '艺术欣赏', score: 15, desc: '参加艺术展览、音乐会等' },
                { name: '艺术社团', score: 10, desc: '参加艺术类社团，积极参与活动' },
                { name: '艺术创作', score: 10, desc: '进行艺术创作，作品得到展示' }
            ],
            '劳育': [
                { name: '劳动实践', score: 30, desc: '参加劳动实践活动，有劳动记录' },
                { name: '志愿服务', score: 20, desc: '参加志愿服务活动，时长达标' },
                { name: '社会实践', score: 20, desc: '参加社会实践活动，提交实践报告' },
                { name: '勤工助学', score: 15, desc: '参加勤工助学活动，表现良好' },
                { name: '创新劳动', score: 10, desc: '参与创新性劳动，有创新成果' },
                { name: '劳动知识', score: 5, desc: '掌握劳动安全知识' }
            ]
        };
        localStorage.setItem('standards', JSON.stringify(monitorStandards));
    }

    renderMonitorStandards();
}

function renderMonitorStandards() {
    const container = document.getElementById('standard-page');
    if (!container) return;

    container.innerHTML = `
        <div class="section">
            <div class="section-title">评测标准</div>
            <div id="monitor-standard-content"></div>
        </div>
    `;

    const contentDiv = document.getElementById('monitor-standard-content');
    contentDiv.innerHTML = '';

    for (const [category, items] of Object.entries(monitorStandards)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'standard-category';

        let itemsHTML = `<div class="standard-category-title">${category}（总分：${items.reduce((sum, item) => sum + item.score, 0)}分）</div>`;

        items.forEach(item => {
            itemsHTML += `
                <div class="standard-item">
                    <div class="standard-item-header">
                        <div class="standard-item-name">${item.name}</div>
                        <div class="standard-item-score">${item.score}分</div>
                    </div>
                    <div class="standard-item-desc">${item.desc}</div>
                    <div class="standard-visual">
                        <div class="standard-bar">
                            <div class="standard-fill" style="width: ${(item.score / 40) * 100}%"></div>
                        </div>
                        <div class="standard-percent">${item.score}分</div>
                    </div>
                </div>
            `;
        });

        categoryDiv.innerHTML = itemsHTML;
        contentDiv.appendChild(categoryDiv);
    }
}