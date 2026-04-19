// ==================== 管理员评测标准模块 ====================

let adminStandards = null;

function initAdminStandard() {
    loadAdminStandards();
}

function loadAdminStandards() {
    const container = document.getElementById('standard-page');
    if (!container) return;

    const stored = localStorage.getItem('standards');
    if (stored && JSON.parse(stored)) {
        adminStandards = JSON.parse(stored);
    } else {
        adminStandards = {
            '德育': [
                { name: '思想品德', score: 20, desc: '拥护党的路线方针政策，自觉践行社会主义核心价值观' },
                { name: '遵纪守法', score: 15, desc: '遵守国家法律法规和校纪校规，无违纪违法行为' },
                { name: '集体荣誉', score: 15, desc: '关心集体，积极参加集体活动，维护集体荣誉' },
                { name: '文明礼仪', score: 10, desc: '举止文明，尊敬师长，团结同学，礼貌待人' },
                { name: '志愿服务', score: 20, desc: '参加志愿服务活动，时长达标，表现突出' },
                { name: '社会实践', score: 20, desc: '参加社会实践活动，提交实践报告，获得认可' }
            ],
            '智育': [
                { name: '学业成绩', score: 40, desc: '学期平均学分绩点，按专业排名折算' },
                { name: '学术竞赛', score: 20, desc: '参加学科竞赛，获得校级及以上奖项' },
                { name: '科研创新', score: 15, desc: '参与科研项目，发表学术论文，获得专利' },
                { name: '技能证书', score: 10, desc: '获得与专业相关的技能证书、资格证书' },
                { name: '学习进步', score: 10, desc: '与上一学期相比，学业成绩有明显进步' },
                { name: '学术活动', score: 5, desc: '参加学术讲座、学术论坛等学术活动' }
            ],
            '体育': [
                { name: '体育成绩', score: 30, desc: '体育课成绩，按实际得分计算' },
                { name: '体质测试', score: 20, desc: '国家学生体质健康标准测试成绩' },
                { name: '体育竞赛', score: 20, desc: '参加体育比赛，获得校级及以上奖项' },
                { name: '日常锻炼', score: 15, desc: '坚持体育锻炼，有锻炼记录，体质增强' },
                { name: '体育社团', score: 10, desc: '参加体育类社团，积极参与社团活动' },
                { name: '体育知识', score: 5, desc: '掌握体育健康知识，参加相关讲座、培训' }
            ],
            '美育': [
                { name: '艺术课程', score: 25, desc: '艺术类课程成绩，按实际得分计算' },
                { name: '艺术实践', score: 20, desc: '参加艺术实践活动，有作品或表演' },
                { name: '艺术竞赛', score: 20, desc: '参加艺术类比赛，获得校级及以上奖项' },
                { name: '艺术欣赏', score: 15, desc: '参加艺术展览、音乐会等艺术欣赏活动' },
                { name: '艺术社团', score: 10, desc: '参加艺术类社团，积极参与社团活动' },
                { name: '艺术创作', score: 10, desc: '进行艺术创作，作品得到展示或发表' }
            ],
            '劳育': [
                { name: '劳动实践', score: 30, desc: '参加劳动实践活动，有劳动记录' },
                { name: '志愿服务', score: 20, desc: '参加志愿服务活动，时长达标' },
                { name: '社会实践', score: 20, desc: '参加社会实践活动，提交实践报告' },
                { name: '勤工助学', score: 15, desc: '参加勤工助学活动，表现良好' },
                { name: '创新劳动', score: 10, desc: '参与创新性劳动，有创新成果' },
                { name: '劳动知识', score: 5, desc: '掌握劳动安全知识，参加相关培训' }
            ]
        };
        localStorage.setItem('standards', JSON.stringify(adminStandards));
    }

    renderAdminStandards();
}

function renderAdminStandards() {
    const container = document.getElementById('standard-page');
    if (!container) return;

    container.innerHTML = `
        <div class="section">
            <div class="section-title">
                评测标准
                <button class="add-record-btn" id="editStandardBtn" style="background:#b8860b;">
                    <i class="fas fa-upload"></i> 上传评分细则
                </button>
            </div>
            <div id="admin-standard-content"></div>
        </div>
        
        <!-- 上传评分细则模态框 -->
        <div id="uploadStandardModal" class="modal-overlay">
            <div class="modal" style="width: 500px;">
                <div class="modal-header">
                    <div class="modal-title">上传评分细则文件</div>
                    <button class="modal-close" onclick="closeUploadStandardModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="upload-area" id="standardUploadArea" style="padding: 30px; text-align: center; cursor: pointer;">
                        <div class="upload-icon"><i class="fas fa-cloud-upload-alt"></i></div>
                        <div class="upload-text">点击或拖拽上传文件</div>
                        <div class="upload-text" style="font-size: 12px;">支持格式：.txt, .doc, .pdf</div>
                        <input type="file" id="standardFileUpload" accept=".txt,.doc,.docx,.pdf" style="display: none;">
                    </div>
                    <div id="aiParseResult" class="ai-result" style="display: none; margin-top: 15px;">
                        <div class="ai-result-title"><i class="fas fa-robot"></i> AI智能识别结果</div>
                        <div id="aiParseContent"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeUploadStandardModal()">取消</button>
                    <button class="btn btn-primary" onclick="confirmParseStandard()">应用识别结果</button>
                </div>
            </div>
        </div>
        
        <!-- 编辑标准模态框 -->
        <div id="editStandardItemModal" class="modal-overlay">
            <div class="modal" style="width: 500px;">
                <div class="modal-header">
                    <div class="modal-title">编辑评分标准</div>
                    <button class="modal-close" onclick="closeEditStandardItemModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group"><label class="form-label">项目名称</label><input type="text" id="editStandardName" class="form-control"></div>
                    <div class="form-group"><label class="form-label">分数</label><input type="number" id="editStandardScore" class="form-control"></div>
                    <div class="form-group"><label class="form-label">描述</label><textarea id="editStandardDesc" class="form-control" rows="3"></textarea></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeEditStandardItemModal()">取消</button>
                    <button class="btn btn-primary" onclick="saveStandardEdit()">保存</button>
                </div>
            </div>
        </div>
    `;

    const contentDiv = document.getElementById('admin-standard-content');
    contentDiv.innerHTML = '';

    for (const [category, items] of Object.entries(adminStandards)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'standard-category';

        let itemsHTML = `<div class="standard-category-title">${category}（总分：${items.reduce((sum, item) => sum + item.score, 0)}分）</div>`;

        items.forEach((item, idx) => {
            itemsHTML += `
                <div class="standard-item">
                    <div class="standard-item-header">
                        <div class="standard-item-name">${item.name}</div>
                        <div class="standard-item-score">${item.score}分</div>
                        <div><button class="edit-standard-btn" onclick="editStandardItem('${category}', ${idx})" style="background:#b8860b;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;"><i class="fas fa-edit"></i> 编辑</button></div>
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

    // 上传按钮事件
    document.getElementById('editStandardBtn').addEventListener('click', () => {
        document.getElementById('uploadStandardModal').classList.add('active');
    });

    // 上传区域事件
    const uploadArea = document.getElementById('standardUploadArea');
    const fileInput = document.getElementById('standardFileUpload');

    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#b8860b';
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#d4a017';
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#d4a017';
            const file = e.dataTransfer.files[0];
            if (file) {
                document.getElementById('aiParseResult').style.display = 'block';
                document.getElementById('aiParseContent').innerHTML = '<p>正在分析文件中...</p>';
                setTimeout(() => {
                    document.getElementById('aiParseContent').innerHTML = '<p>✓ 识别完成！发现3条新规则待应用</p><ul><li>德育：党团活动参与(15分)</li><li>智育：创新创业(20分)</li><li>体育：体育精神(10分)</li></ul>';
                }, 1500);
            }
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                document.getElementById('aiParseResult').style.display = 'block';
                document.getElementById('aiParseContent').innerHTML = '<p>正在分析文件中...</p>';
                setTimeout(() => {
                    document.getElementById('aiParseContent').innerHTML = '<p>✓ 识别完成！发现3条新规则待应用</p><ul><li>德育：党团活动参与(15分)</li><li>智育：创新创业(20分)</li><li>体育：体育精神(10分)</li></ul>';
                }, 1500);
            }
        });
    }
}

let currentEditCategory = null;
let currentEditIndex = null;

function editStandardItem(category, index) {
    currentEditCategory = category;
    currentEditIndex = index;
    const item = adminStandards[category][index];

    document.getElementById('editStandardName').value = item.name;
    document.getElementById('editStandardScore').value = item.score;
    document.getElementById('editStandardDesc').value = item.desc;
    document.getElementById('editStandardItemModal').classList.add('active');
}

function closeEditStandardItemModal() {
    document.getElementById('editStandardItemModal').classList.remove('active');
    currentEditCategory = null;
    currentEditIndex = null;
}

function saveStandardEdit() {
    const name = document.getElementById('editStandardName').value;
    const score = parseInt(document.getElementById('editStandardScore').value);
    const desc = document.getElementById('editStandardDesc').value;

    if (currentEditCategory && currentEditIndex !== null) {
        adminStandards[currentEditCategory][currentEditIndex] = { name, score, desc };
        localStorage.setItem('standards', JSON.stringify(adminStandards));
        renderAdminStandards();
        closeEditStandardItemModal();
        showToast('标准已更新');
    }
}

function closeUploadStandardModal() {
    document.getElementById('uploadStandardModal').classList.remove('active');
    document.getElementById('aiParseResult').style.display = 'none';
}

function confirmParseStandard() {
    // 模拟AI识别添加新规则
    const newRules = [
        { category: '德育', name: '党团活动参与', score: 15, desc: '积极参加党团组织的各项活动' },
        { category: '智育', name: '创新创业', score: 20, desc: '参与创新创业项目，获得校级及以上立项' },
        { category: '体育', name: '体育精神', score: 10, desc: '展现良好的体育精神和团队协作能力' }
    ];

    newRules.forEach(rule => {
        if (adminStandards[rule.category]) {
            adminStandards[rule.category].push(rule);
        }
    });

    localStorage.setItem('standards', JSON.stringify(adminStandards));
    renderAdminStandards();
    closeUploadStandardModal();
    showToast('AI识别完成，评分细则已更新');
}