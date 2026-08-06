const STORAGE_KEYS = {
    PROJECTS: 'project_target_projects',
    DATA: 'project_target_data',
    THEME: 'project_target_theme',
    VERSION_PLANS: 'project_target_version_plans',
    DEV_PLANS: 'project_target_dev_plans',
    HEALTH_DATA: 'project_target_health_data',
    LANGUAGE: 'project_target_language'
};

let versionPlans = [];
let devPlans = [];
let healthData = [];

// Language configuration
let currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'zh';
let t = {};

// English language data
const enData = {
    nav: { projects: 'Project Management', dashboard: 'Data Dashboard', aiAssistant: 'AI Assistant', versionPlan: 'Version Plan', devPlan: 'Development Plan', health: 'Health Tracking', dataEntry: 'Data Entry', charts: 'Comparison Charts' },
    common: { save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', add: 'Add', confirm: 'Confirm', yes: 'Yes', no: 'No', close: 'Close', search: 'Search', select: 'Please select', action: 'Action', required: 'Required field', loading: 'Loading...', noData: 'No data available', confirmDelete: 'Are you sure you want to delete this project and all its data? This action cannot be undone!', createdSuccess: 'Created successfully', updatedSuccess: 'Updated successfully', deletedSuccess: 'Deleted successfully', type: 'Type' },
    theme: { dark: 'Dark Mode', light: 'Light Mode' },
    project: { title: 'Project Management', addProject: 'Create New Project', projectName: 'Project Name', description: 'Project Description', targets: 'Targets', integrationTarget: 'Feature Integration Rate Target (%)', stabilityTarget: 'MTTF Duration Target (ms)', crBlockerTarget: 'Blocker CR Target', crCriticalTarget: 'Critical CR Target', projectList: 'Project List', status: 'Status', action: 'Action', noProjects: 'No projects yet. Click "New Project" to create one', editProject: 'Edit Project', deleteProject: '⚠️ Confirm Delete Project', viewDetails: 'View Details', namePlaceholder: 'e.g.: IOT Sensor Project', descPlaceholder: 'Brief project description' },
    dashboard: { title: 'Data Dashboard', selectProject: 'Select Project:', timePeriod: 'Time Period:', last7Days: 'Last 7 Days', last30Days: 'Last 30 Days', last90Days: 'Last 90 Days', allTime: 'All Time', projectName: 'Project Name', versionPlans: 'Version Plans', completionRate: 'Completion Rate', activeTasks: 'Active Tasks', projectOverview: 'Project Overview', recentEntries: 'Recent Data Entries', status: 'Status', date: 'Date', completion: 'Completion' },
    ai: { title: 'AI Assistant', description: 'Let AI analyze your project data and provide insights', selectProject: 'Select Project:', enterPrompt: 'Enter your question or request:', promptPlaceholder: 'Ask AI to analyze your project data...\n\nExamples:\n- Summarize the current project status\n- What are the main issues?\n- Suggest improvements for the project\n- Analyze the completion rate', generate: 'Generate Analysis', clear: 'Clear', analyzing: 'AI is analyzing your project data...', resultTitle: 'AI Analysis Result', poweredBy: 'Powered by Doubao' },
    version: { title: 'Version Plan', projectSelect: 'Select Project:', addVersion: 'Add Version Plan', versionName: 'Version Number', releaseDate: 'Planned Release Date', description: 'Version Description', versionList: 'Version List', editVersion: 'Edit Version Plan', deleteVersion: 'Delete Version', noVersions: 'No version plans found for this project.', namePlaceholder: 'e.g.: v1.0.0', descPlaceholder: 'Brief description of this version\'s goals and content' },
    devPlan: { title: 'Development Plan', projectSelect: 'Select Project:', addTask: 'Add Development Task', editTask: 'Edit Development Task', taskName: 'Task Title', assignee: 'Assignee', status: 'Status', priority: 'Priority', deadline: 'Due Date', description: 'Task Description', phase: 'Development Phase', statusOptions: { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed', blocked: 'Blocked' }, priorityOptions: { high: 'High', medium: 'Medium', low: 'Low' }, phases: { firmware: 'Firmware Development', app: 'APP Development', integration: 'Waiting for Integration' }, taskList: 'Task List', deleteTask: 'Delete Task', noTasks: 'No development tasks found for this project.', titlePlaceholder: 'e.g.: Implement GPS positioning feature', descPlaceholder: 'Detailed task description', assigneePlaceholder: 'Assignee name' },
    health: { title: 'Health Tracking', projectSelect: 'Select Project:', versionSelect: 'Select Version:', currentStatus: 'Current Health Status', metrics: 'Health Metrics', integrationRate: 'Feature Integration Rate', stability: 'MTTF Duration', crBlocker: 'Blocker CR Count', crCritical: 'Critical CR Count', healthScore: 'Health Score', excellent: 'Excellent', good: 'Good', warning: 'Warning', critical: 'Critical' },
    dataEntry: { title: 'Data Entry', projectSelect: 'Select Project:', versionSelect: 'Select Version:', entryDate: 'Entry Date', integrationRate: 'Feature Integration Rate (%)', stability: 'MTTF Duration (ms)', crBlocker: 'Blocker CR Count', crCritical: 'Critical CR Count', submit: 'Submit Data', entrySuccess: 'Data entry submitted successfully', noVersions: 'Please add a version plan first.' },
    charts: { title: 'Target vs Actual Comparison Charts', projectSelect: 'Select Project:', selectMetric: 'Select Metric:', integration: 'Feature Integration Rate', stability: 'MTTF Duration', crBlocker: 'Blocker CR', crCritical: 'Critical CR', version: 'Version', value: 'Value', noData: 'Please select a project to view charts', trendTitle: 'Target vs Actual Trend', achievementTitle: 'Target Achievement Rate', pendingTasks: 'Pending Development Tasks', noPendingTasks: 'No pending development tasks', achievementRate: 'Achievement Rate', target: 'Target', actual: 'Actual', status: 'Status' }
};

// Chinese language data
const zhData = {
    nav: { projects: '项目管理', dashboard: '数据仪表盘', aiAssistant: 'AI助手', versionPlan: '版本计划', devPlan: '开发计划', health: '健康跟踪', dataEntry: '数据录入', charts: '对比图表' },
    common: { save: '保存', cancel: '取消', delete: '删除', edit: '编辑', add: '添加', confirm: '确认', yes: '是', no: '否', close: '关闭', search: '搜索', select: '请选择', action: '操作', required: '必填字段', loading: '加载中...', noData: '暂无数据', confirmDelete: '确定要删除此项目及其所有数据吗？此操作无法撤销！', createdSuccess: '创建成功', updatedSuccess: '更新成功', deletedSuccess: '删除成功', type: '类型' },
    theme: { dark: '深色模式', light: '浅色模式' },
    project: { title: '项目管理', addProject: '创建新项目', projectName: '项目名称', description: '项目描述', targets: '目标指标', integrationTarget: '功能集成率目标 (%)', stabilityTarget: 'MTTF持续时间目标 (ms)', crBlockerTarget: 'Blocker CR目标', crCriticalTarget: 'Critical CR目标', projectList: '项目列表', status: '状态', action: '操作', noProjects: '未找到项目，请添加新项目。', editProject: '编辑项目', deleteProject: '⚠️ 确认删除项目', viewDetails: '查看详情', namePlaceholder: '例如：物联网传感器项目', descPlaceholder: '简要项目描述' },
    dashboard: { title: '数据仪表盘', selectProject: '选择项目:', timePeriod: '时间周期:', last7Days: '最近7天', last30Days: '最近30天', last90Days: '最近90天', allTime: '全部时间', projectName: '项目名称', versionPlans: '版本计划数', completionRate: '完成率', activeTasks: '活跃任务数', projectOverview: '项目概览', recentEntries: '最近数据录入', status: '状态', date: '日期', completion: '完成率' },
    ai: { title: 'AI助手', description: '让AI分析您的项目数据并提供洞察', selectProject: '选择项目:', enterPrompt: '输入您的问题或请求:', promptPlaceholder: '向AI询问项目数据分析...\n\n示例：\n- 总结当前项目状态\n- 主要问题是什么？\n- 建议项目改进方案\n- 分析完成率', generate: '生成分析', clear: '清除', analyzing: 'AI正在分析您的项目数据...', resultTitle: 'AI分析结果', poweredBy: '由豆包提供支持' },
    version: { title: '版本计划', projectSelect: '选择项目:', addVersion: '添加版本计划', versionName: '版本号', releaseDate: '计划发布日期', description: '版本描述', versionList: '版本列表', editVersion: '编辑版本计划', deleteVersion: '删除版本', noVersions: '该项目暂无版本计划。', namePlaceholder: '例如：v1.0.0', descPlaceholder: '简要描述此版本的目标和内容' },
    devPlan: { title: '开发计划', projectSelect: '选择项目:', addTask: '添加开发任务', editTask: '编辑开发任务', taskName: '任务标题', assignee: '负责人', status: '状态', priority: '优先级', deadline: '截止日期', description: '任务描述', phase: '开发阶段', statusOptions: { pending: '待处理', 'in-progress': '进行中', completed: '已完成', blocked: '阻塞' }, priorityOptions: { high: '高', medium: '中', low: '低' }, phases: { firmware: '固件开发', app: 'APP开发', integration: '待集成' }, taskList: '任务列表', deleteTask: '删除任务', noTasks: '该项目暂无开发任务。', titlePlaceholder: '例如：实现GPS定位功能', descPlaceholder: '详细任务描述', assigneePlaceholder: '负责人姓名' },
    health: { title: '健康跟踪', projectSelect: '选择项目:', versionSelect: '选择版本:', currentStatus: '当前健康状态', metrics: '健康指标', integrationRate: '功能集成率', stability: 'MTTF持续时间', crBlocker: 'Blocker CR数量', crCritical: 'Critical CR数量', healthScore: '健康分数', excellent: '优秀', good: '良好', warning: '警告', critical: '严重' },
    dataEntry: { title: '数据录入', projectSelect: '选择项目:', versionSelect: '选择版本:', entryDate: '录入日期', integrationRate: '功能集成率 (%)', stability: 'MTTF持续时间 (ms)', crBlocker: 'Blocker CR数量', crCritical: 'Critical CR数量', submit: '提交数据', entrySuccess: '数据录入成功', noVersions: '请先添加版本计划。' },
    charts: { title: '目标与实际对比图表', projectSelect: '选择项目:', selectMetric: '选择指标:', integration: '功能集成率', stability: 'MTTF持续时间', crBlocker: 'Blocker CR', crCritical: 'Critical CR', version: '版本', value: '数值', noData: '请选择项目查看图表', trendTitle: '目标与实际趋势', achievementTitle: '目标达成率', pendingTasks: '待开发任务', noPendingTasks: '暂无待开发任务', achievementRate: '达成率', target: '目标值', actual: '实际值', status: '状态' }
};

// Load language data
function loadLanguage() {
    t = currentLanguage === 'en' ? enData : zhData;
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    
    // Update button states
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-zh').classList.toggle('active', lang === 'zh');
    
    // Load language data
    loadLanguage();
    
    // Refresh UI texts
    refreshUITexts();
    
    // Refresh dynamic content
    if (document.getElementById('projects').style.display === 'block') {
        renderProjects();
    } else if (document.getElementById('version-plan').style.display === 'block') {
        loadVersionPlan();
    } else if (document.getElementById('dev-plan').style.display === 'block') {
        loadDevPlan();
    }
}

function refreshUITexts() {
    // Refresh all text elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = translate(key);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Refresh placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const text = translate(key);
        if (text) {
            element.placeholder = text;
        }
    });
    
    // Refresh select options
    document.querySelectorAll('option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        const text = translate(key);
        if (text) {
            option.textContent = text;
        }
    });
}

function translate(key) {
    const keys = key.split('.');
    let result = t;
    
    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            return key;
        }
    }
    
    return result;
}

// Export PDF function
async function exportToPDF() {
    const projectId = document.getElementById('chart-project').value;
    if (!projectId) {
        alert('Please select a project first');
        return;
    }

    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const project = projects.find(p => p.id === projectId);
    const projectName = project ? project.name : 'Unnamed Project';

    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer || chartContainer.style.display === 'none') {
        alert('Please select a project and generate charts first');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        let yPos = 20;
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;

        pdf.setFontSize(24);
        pdf.setTextColor(99, 102, 241);
        pdf.text(`${projectName} - Comparison Charts`, margin, yPos);
        yPos += 15;

        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Export Time: ${new Date().toLocaleString('en-US')}`, margin, yPos);
        yPos += 20;

        const chartCards = chartContainer.querySelectorAll('.chart-card');
        
        for (let i = 0; i < chartCards.length; i++) {
            const card = chartCards[i];
            const canvas = card.querySelector('canvas');
            
            if (canvas) {
                if (yPos + 150 > pageHeight) {
                    pdf.addPage();
                    yPos = 20;
                }

                const chartTitle = card.querySelector('h3');
                if (chartTitle) {
                    pdf.setFontSize(14);
                    pdf.setTextColor(51, 51, 51);
                    pdf.text(chartTitle.textContent, margin, yPos);
                    yPos += 10;
                }

                const imgData = canvas.toDataURL('image/png');
                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, Math.min(imgHeight, 120));
                yPos += Math.min(imgHeight, 120) + 15;

                const dataTable = card.querySelector('.data-table');
                if (dataTable) {
                    if (yPos + 80 > pageHeight) {
                        pdf.addPage();
                        yPos = 20;
                    }
                    
                    pdf.setFontSize(10);
                    pdf.setTextColor(100, 100, 100);
                    pdf.text('Data Table:', margin, yPos);
                    yPos += 8;

                    const rows = dataTable.querySelectorAll('tr');
                    let tableY = yPos;
                    
                    rows.forEach((row, rowIndex) => {
                        const cells = row.querySelectorAll('th, td');
                        let xPos = margin;
                        
                        cells.forEach((cell, cellIndex) => {
                            const text = cell.textContent.trim();
                            const cellWidth = contentWidth / cells.length;
                            
                            if (rowIndex === 0) {
                                pdf.setFontSize(9);
                                pdf.setTextColor(99, 102, 241);
                            } else {
                                pdf.setFontSize(8);
                                pdf.setTextColor(51, 51, 51);
                            }
                            
                            pdf.text(text, xPos, tableY);
                            xPos += cellWidth;
                        });
                        
                        tableY += 7;
                    });
                    
                    yPos = tableY + 10;
                }
            }
        }

        pdf.save(`${projectName}_Comparison_Charts_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error('PDF export failed:', error);
        alert('Failed to export PDF. Please try again.');
    }
}

// Export PPT function
async function exportToPPT() {
    const projectId = document.getElementById('chart-project').value;
    if (!projectId) {
        alert('Please select a project first');
        return;
    }

    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const project = projects.find(p => p.id === projectId);
    const projectName = project ? project.name : 'Unnamed Project';

    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer || chartContainer.style.display === 'none') {
        alert('Please select a project and generate charts first');
        return;
    }

    try {
        const pptx = new PptxGenJS();
        
        const titleSlide = pptx.addSlide();
        titleSlide.addText(`${projectName}`, {
            x: 0.5,
            y: 2,
            w: 9,
            h: 1,
            fontSize: 36,
            bold: true,
            color: '6366F1',
            align: 'center'
        });
        
        titleSlide.addText('Comparison Charts Report', {
            x: 0.5,
            y: 3.5,
            w: 9,
            h: 0.5,
            fontSize: 24,
            color: '9CA3AF',
            align: 'center'
        });
        
        titleSlide.addText(`Export Time: ${new Date().toLocaleString('en-US')}`, {
            x: 0.5,
            y: 5,
            w: 9,
            h: 0.4,
            fontSize: 12,
            color: '6B7280',
            align: 'center'
        });

        const chartCards = chartContainer.querySelectorAll('.chart-card');
        
        for (let i = 0; i < chartCards.length; i++) {
            const card = chartCards[i];
            const canvas = card.querySelector('canvas');
            
            if (canvas) {
                const slide = pptx.addSlide();
                
                const chartTitle = card.querySelector('h3');
                if (chartTitle) {
                    slide.addText(chartTitle.textContent, {
                        x: 0.5,
                        y: 0.3,
                        w: 9,
                        h: 0.5,
                        fontSize: 20,
                        bold: true,
                        color: '1F2937'
                    });
                }

                const imgData = canvas.toDataURL('image/png');
                slide.addImage({
                    data: imgData,
                    x: 0.5,
                    y: 1,
                    w: 9,
                    h: 4
                });

                const dataTable = card.querySelector('.data-table');
                if (dataTable) {
                    const rows = Array.from(dataTable.querySelectorAll('tr'));
                    const tableData = rows.map(row => 
                        Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent.trim())
                    );
                    
                    const tableY = 5.3;
                    const rowHeight = 0.3;
                    const colWidth = 2;
                    const startX = 0.5;
                    
                    tableData.forEach((row, rowIndex) => {
                        row.forEach((cell, cellIndex) => {
                            slide.addText(cell, {
                                x: startX + cellIndex * colWidth,
                                y: tableY + rowIndex * rowHeight,
                                w: colWidth,
                                h: rowHeight,
                                fontSize: rowIndex === 0 ? 10 : 9,
                                bold: rowIndex === 0,
                                color: rowIndex === 0 ? '6366F1' : '1F2937',
                                align: 'center',
                                valign: 'middle'
                            });
                        });
                    });
                }
            }
        }

        pptx.writeFile({ fileName: `${projectName}_Comparison_Charts_${new Date().toISOString().split('T')[0]}.pptx` });
    } catch (error) {
        console.error('PPT export failed:', error);
        alert('Failed to export PPT. Please try again.');
    }
}

// Theme toggle function
function toggleTheme() {
    var body = document.body;
    var icon = document.getElementById('theme-icon');
    var text = document.getElementById('theme-text');
    
    if (body.classList.contains('light-theme')) {
        // Switch to dark mode
        body.classList.remove('light-theme');
        icon.innerHTML = '🌙';
        text.innerHTML = 'Dark Mode';
        localStorage.setItem('project_target_theme', 'dark');
    } else {
        // Switch to light mode
        body.classList.add('light-theme');
        icon.innerHTML = '☀️';
        text.innerHTML = 'Light Mode';
        localStorage.setItem('project_target_theme', 'light');
    }
    
    // Re-render charts to adapt to new theme
    if (document.getElementById('individual-charts')) {
        var projectId = document.getElementById('select-project')?.value;
        if (projectId) {
            renderCharts(projectId);
        }
    }
}

// Initialize theme
function initTheme() {
    var savedTheme = localStorage.getItem('project_target_theme') || 'dark';
    var body = document.body;
    var icon = document.getElementById('theme-icon');
    var text = document.getElementById('theme-text');
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        icon.innerHTML = '☀️';
        text.innerHTML = 'Light Mode';
    } else {
        body.classList.remove('light-theme');
        icon.innerHTML = '🌙';
        text.innerHTML = 'Dark Mode';
    }
}

const COLORS = [
    'rgba(54, 162, 235, 1)',    // Blue
    'rgba(75, 192, 192, 1)',    // Cyan
    'rgba(153, 102, 255, 1)',   // Purple
    'rgba(255, 159, 64, 1)',   // Orange
    'rgba(199, 199, 199, 1)',  // Gray
    'rgba(83, 102, 255, 1)'    // Indigo
];

function getColorByIndex(index) {
    return COLORS[index % COLORS.length];
}

const MODULES = [
    { id: 'algorithm', name: 'Algorithm Integration', desc: 'Core algorithm integration and optimization' }
];

const FEATURE_CONFIG = [
    { id: 'integration', name: 'Feature Completed', desc: 'Feature completion percentage (%)' }
];

const STABILITY_CONFIG = [
    { id: 'stability', name: 'MTTF Duration', desc: 'Mean Time To Failure (hours)' }
];

const CR_CONFIG = [
    { id: 'cr_blocker', name: 'Blocker CR', desc: 'Blocker-level CR count' },
    { id: 'cr_critical', name: 'Critical CR', desc: 'Critical-level CR count' },
    { id: 'cr_new_daily', name: 'Daily New CR', desc: 'Daily new CR count' },
    { id: 'cr_resolved_daily', name: 'Daily Resolved CR', desc: 'Daily resolved CR count' }
];

const BATTERY_LIFE_CONFIG = [
    { id: 'battery_20hz_typical', name: '20Hz Typical', desc: '20Hz refresh rate - Typical scenario' },
    { id: 'battery_20hz_heavy', name: '20Hz Heavy', desc: '20Hz refresh rate - Heavy scenario' },
    { id: 'battery_20hz_aod', name: '20Hz AOD', desc: '20Hz refresh rate - AOD scenario' },
    { id: 'battery_100hz_typical', name: '100Hz Typical', desc: '100Hz refresh rate - Typical scenario' },
    { id: 'battery_100hz_heavy', name: '100Hz Heavy', desc: '100Hz refresh rate - Heavy scenario' },
    { id: 'battery_100hz_aod', name: '100Hz AOD', desc: '100Hz refresh rate - AOD scenario' }
];

const PERFORMANCE_CONFIG = [
    { id: 'perf_gps_cold', name: 'GPS Cold Start', desc: 'GPS cold start positioning time (seconds)' },
    { id: 'perf_gps_hot', name: 'GPS Hot Start', desc: 'GPS hot start positioning time (seconds)' },
    { id: 'perf_touch_response', name: 'Touch Response', desc: 'Touch screen response latency (ms)' },
    { id: 'perf_key_response', name: 'Key Response', desc: 'Button response latency (ms)' },
    { id: 'perf_slide_fps', name: 'Slide FPS', desc: 'Average frame rate during slide (FPS)' },
    { id: 'perf_slide_drop', name: 'Slide Frame Drop', desc: 'Maximum frame drops during slide' }
];

const ALL_METRICS = [...BATTERY_LIFE_CONFIG, ...PERFORMANCE_CONFIG, ...STABILITY_CONFIG, ...CR_CONFIG, ...FEATURE_CONFIG, ...MODULES];

let projects = [];
let actualData = [];
let currentProjectId = null;
let comparisonChart = null;

document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    loadData();
    renderProjects();
    updateProjectSelects();
    
    // Set default value for date picker to today
    document.getElementById('entry-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('health-date').value = new Date().toISOString().split('T')[0];
    
    // Check Feishu login status on page load
    const authData = await checkFeishuAuth();
    if (authData.loggedIn) {
        updateFeishuUILoggedIn(authData.user);
    }
});

function updateFeishuUILoggedIn(user) {
    const userInfo = document.getElementById('feishu-user-info');
    const userName = document.getElementById('feishu-user-name');
    const loginBtn = document.getElementById('feishu-login-btn');
    const logoutBtn = document.getElementById('feishu-logout-btn');
    const docBrowser = document.getElementById('feishu-doc-browser');
    const notLoggedIn = document.getElementById('feishu-not-logged-in');
    
    if (userInfo && userName && loginBtn && logoutBtn && docBrowser && notLoggedIn) {
        userInfo.style.display = 'inline';
        userName.textContent = user.name || user.en_name || 'User';
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline';
        docBrowser.style.display = 'block';
        notLoggedIn.style.display = 'none';
        
        // Load documents
        loadFeishuDocs();
    }
}

function loadData() {
    const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const savedData = localStorage.getItem(STORAGE_KEYS.DATA);
    const savedVersionPlans = localStorage.getItem(STORAGE_KEYS.VERSION_PLANS);
    const savedDevPlans = localStorage.getItem(STORAGE_KEYS.DEV_PLANS);

    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    } else {
        // Initialize sample project
        const defaultTargets = {};
        ALL_METRICS.forEach(m => defaultTargets[m.id] = 5);
        
        projects = [
            {
                id: '1',
                name: 'IOT Sensor Project',
                description: 'Next-generation IoT sensor device development',
                targets: {
                    battery_20hz_typical: 8,
                    battery_20hz_heavy: 7,
                    battery_20hz_aod: 9,
                    battery_100hz_typical: 7,
                    battery_100hz_heavy: 6,
                    battery_100hz_aod: 8,
                    perf_gps_cold: 8,
                    perf_gps_hot: 9,
                    perf_touch_response: 8,
                    perf_key_response: 8,
                    perf_slide_fps: 8,
                    perf_slide_drop: 7,
                    integration: 8,
                    stability: 9,
                    algorithm: 7,
                    cr_blocker: 0,
                    cr_critical: 2
                },
                createdAt: '2024-01-01'
            }
        ];
        saveProjects();
    }

    if (savedData) {
        actualData = JSON.parse(savedData);
    } else {
        // Initialize sample data
        actualData = [
            { id: '1', projectId: '1', date: '2024-01-05', version: 'v1.0.0',
              battery_20hz_typical: 4, battery_20hz_heavy: 3, battery_20hz_aod: 5,
              battery_100hz_typical: 3, battery_100hz_heavy: 2, battery_100hz_aod: 4,
              perf_gps_cold: 4, perf_gps_hot: 5, perf_touch_response: 4, 
              perf_key_response: 4, perf_slide_fps: 5, perf_slide_drop: 4,
              integration: 4, stability: 5, algorithm: 3,
              cr_blocker: 2, cr_critical: 5 },
            { id: '2', projectId: '1', date: '2024-01-12', version: 'v1.1.0',
              battery_20hz_typical: 5, battery_20hz_heavy: 4, battery_20hz_aod: 6,
              battery_100hz_typical: 4, battery_100hz_heavy: 3, battery_100hz_aod: 5,
              perf_gps_cold: 5, perf_gps_hot: 6, perf_touch_response: 5, 
              perf_key_response: 5, perf_slide_fps: 6, perf_slide_drop: 5,
              integration: 5, stability: 5, algorithm: 4,
              cr_blocker: 1, cr_critical: 4 },
            { id: '3', projectId: '1', date: '2024-01-19', version: 'v1.2.0',
              battery_20hz_typical: 6, battery_20hz_heavy: 5, battery_20hz_aod: 7,
              battery_100hz_typical: 5, battery_100hz_heavy: 4, battery_100hz_aod: 6,
              perf_gps_cold: 6, perf_gps_hot: 7, perf_touch_response: 6, 
              perf_key_response: 6, perf_slide_fps: 6, perf_slide_drop: 5,
              integration: 5, stability: 6, algorithm: 5,
              cr_blocker: 0, cr_critical: 3 },
            { id: '4', projectId: '1', date: '2024-01-26', version: 'v2.0.0',
              battery_20hz_typical: 6, battery_20hz_heavy: 5, battery_20hz_aod: 7,
              battery_100hz_typical: 5, battery_100hz_heavy: 4, battery_100hz_aod: 6,
              perf_gps_cold: 6, perf_gps_hot: 7, perf_touch_response: 7, 
              perf_key_response: 7, perf_slide_fps: 7, perf_slide_drop: 6,
              integration: 6, stability: 7, algorithm: 6,
              cr_blocker: 0, cr_critical: 2 },
            { id: '5', projectId: '1', date: '2024-02-02', version: 'v2.1.0',
              battery_20hz_typical: 7, battery_20hz_heavy: 6, battery_20hz_aod: 8,
              battery_100hz_typical: 6, battery_100hz_heavy: 5, battery_100hz_aod: 7,
              perf_gps_cold: 7, perf_gps_hot: 8, perf_touch_response: 7, 
              perf_key_response: 7, perf_slide_fps: 7, perf_slide_drop: 6,
              integration: 7, stability: 8, algorithm: 6,
              cr_blocker: 0, cr_critical: 1 }
        ];
        saveData();
    }

    // Load version plans
    if (savedVersionPlans) {
        versionPlans = JSON.parse(savedVersionPlans);
    }

    // Load development plans
    if (savedDevPlans) {
        devPlans = JSON.parse(savedDevPlans);
    }

    // Load health data
    const savedHealthData = localStorage.getItem(STORAGE_KEYS.HEALTH_DATA);
    if (savedHealthData) {
        healthData = JSON.parse(savedHealthData);
    }
}

function saveProjects() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

function saveVersionPlans() {
    localStorage.setItem(STORAGE_KEYS.VERSION_PLANS, JSON.stringify(versionPlans));
}

function saveDevPlans() {
    localStorage.setItem(STORAGE_KEYS.DEV_PLANS, JSON.stringify(devPlans));
}

function saveData() {
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(actualData));
}

// Export all data
function exportAllData() {
    const exportData = {
        projects: projects,
        actualData: actualData,
        exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Data exported successfully!');
}

// Import data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const importedData = JSON.parse(event.target.result);
                
                if (importedData.projects && Array.isArray(importedData.projects)) {
                    projects = importedData.projects;
                    saveProjects();
                }
                
                if (importedData.actualData && Array.isArray(importedData.actualData)) {
                    actualData = importedData.actualData;
                    saveData();
                }
                
                renderProjects();
                updateProjectSelects();
                alert('Data imported successfully!');
            } catch (error) {
                alert('Import failed: Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function renderProjects() {
    const container = document.getElementById('projects-list');
    const emptyState = document.getElementById('empty-projects');

    if (projects.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = projects.map(project => {
        const dataCount = actualData.filter(d => d.projectId === project.id).length;
        return `
            <div class="project-card">
                <div class="project-content" onclick="openProject('${project.id}')">
                    <h3>${project.name}</h3>
                    <p>${project.description || 'No description'}</p>
                    <div class="project-stats">
                        <span>Created: ${project.createdAt}</span><br>
                        <span>Data Records: ${dataCount} records</span>
                    </div>
                </div>
                <button class="btn btn-delete-project" onclick="confirmDeleteProject('${project.id}', '${project.name}')">Delete Project</button>
            </div>
        `;
    }).join('');
}

function showAddProjectModal() {
    document.getElementById('project-name').value = '';
    document.getElementById('project-desc').value = '';
    document.getElementById('add-project-modal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

let projectToDelete = null;

function confirmDeleteProject(projectId, projectName) {
    projectToDelete = { id: projectId, name: projectName };
    document.getElementById('delete-project-message').innerHTML = 
        `Are you sure you want to delete project <strong>"${projectName}"</strong> and all its data?<br><br>This action cannot be undone!`;
    document.getElementById('delete-project-modal').style.display = 'flex';
}

function deleteProject() {
    if (!projectToDelete) return;
    
    // Delete project
    projects = projects.filter(p => p.id !== projectToDelete.id);
    
    // Delete all data for this project
    actualData = actualData.filter(d => d.projectId !== projectToDelete.id);
    
    // Save to localStorage
    saveProjects();
    saveData();
    
    // Close modal
    closeModal('delete-project-modal');
    
    // Update UI
    renderProjects();
    updateProjectSelects();
    
    // If currently viewing the deleted project, close the detail
    if (currentProjectId === projectToDelete.id) {
        closeProjectDetail();
    }
    
    projectToDelete = null;
    
    alert('Project deleted successfully! All related data has been removed.');
}

function addProject() {
    const name = document.getElementById('project-name').value.trim();
    const desc = document.getElementById('project-desc').value.trim();

    if (!name) {
        alert('Please enter project name');
        return;
    }

    const targets = {};
        ALL_METRICS.forEach(m => targets[m.id] = 5);
        
        const project = {
            id: Date.now().toString(),
            name: name,
            description: desc,
            targets: targets,
            createdAt: new Date().toISOString().split('T')[0]
        };

    projects.push(project);
    saveProjects();
    renderProjects();
    updateProjectSelects();
    closeModal('add-project-modal');
    alert('Project created successfully! Please set target values for each module.');
}

function openProject(projectId) {
    currentProjectId = projectId;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    document.getElementById('projects-list').parentElement.style.display = 'none';
    document.getElementById('project-detail').style.display = 'block';
    document.getElementById('project-title').textContent = project.name;

    renderTargetInputs(project);
    renderActualDataList(projectId);
}

function closeProjectDetail() {
    document.getElementById('projects-list').parentElement.style.display = 'block';
    document.getElementById('project-detail').style.display = 'none';
    currentProjectId = null;
}

function renderTargetInputs(project) {
    const container = document.getElementById('target-inputs');
    
    let html = '<div class="target-section-header"><h3>🎯 Target Value Settings</h3><p class="target-desc">Set target values for each metric by entering the specific values directly</p></div>';
    
    html += '<div class="target-category"><div class="category-header"><span class="category-icon">⚡</span><span class="category-title">Battery Life</span></div><div class="target-grid">';
    BATTERY_LIFE_CONFIG.forEach(mod => {
        html += `
            <div class="target-card">
                <div class="target-label">${mod.name}</div>
                <div class="target-input-wrapper">
                    <input type="number" id="target-${mod.id}" value="${project.targets[mod.id] || ''}" placeholder="Enter target value">
                </div>
                <div class="target-desc">${mod.desc}</div>
            </div>
        `;
    });
    html += '</div></div>';
    
    html += '<div class="target-category"><div class="category-header"><span class="category-icon">🚀</span><span class="category-title">Performance</span></div><div class="target-grid">';
    PERFORMANCE_CONFIG.forEach(mod => {
        html += `
            <div class="target-card">
                <div class="target-label">${mod.name}</div>
                <div class="target-input-wrapper">
                    <input type="number" id="target-${mod.id}" value="${project.targets[mod.id] || ''}" placeholder="Enter target value">
                </div>
                <div class="target-desc">${mod.desc}</div>
            </div>
        `;
    });
    html += '</div></div>';
    
    html += '<div class="target-category"><div class="category-header"><span class="category-icon">🛡️</span><span class="category-title">Stability</span></div><div class="target-grid">';
    STABILITY_CONFIG.forEach(mod => {
        html += `
            <div class="target-card">
                <div class="target-label">${mod.name}</div>
                <div class="target-input-wrapper">
                    <input type="number" id="target-${mod.id}" value="${project.targets[mod.id] || ''}" placeholder="Enter target value">
                </div>
                <div class="target-desc">${mod.desc}</div>
            </div>
        `;
    });
    html += '</div></div>';
    
    html += '<div class="target-category"><div class="category-header"><span class="category-icon">🔴</span><span class="category-title">CR Count</span></div><div class="target-grid">';
    CR_CONFIG.forEach(mod => {
        html += `
            <div class="target-card">
                <div class="target-label">${mod.name}</div>
                <div class="target-input-wrapper">
                    <input type="number" id="target-${mod.id}" value="${project.targets[mod.id] || ''}" placeholder="Enter target value" min="0">
                </div>
                <div class="target-desc">${mod.desc}</div>
            </div>
        `;
    });
    html += '</div></div>';
    
    html += '<div class="target-category"><div class="category-header"><span class="category-icon">✅</span><span class="category-title">Feature Completed</span></div><div class="target-grid">';
    FEATURE_CONFIG.forEach(mod => {
        html += `
            <div class="target-card">
                <div class="target-label">${mod.name}</div>
                <div class="target-input-wrapper">
                    <input type="number" id="target-${mod.id}" value="${project.targets[mod.id] || ''}" placeholder="Enter target value">
                </div>
                <div class="target-desc">${mod.desc}</div>
            </div>
        `;
    });
    html += '</div></div>';
    
    html += '<div class="target-category"><div class="category-header"><span class="category-icon">🧮</span><span class="category-title">Algorithm Integration</span></div><div class="target-grid">';
    MODULES.forEach(mod => {
        html += `
            <div class="target-card">
                <div class="target-label">${mod.name}</div>
                <div class="target-input-wrapper">
                    <input type="number" id="target-${mod.id}" value="${project.targets[mod.id] || ''}" placeholder="Enter target value">
                </div>
                <div class="target-desc">${mod.desc}</div>
            </div>
        `;
    });
    html += '</div></div>';
    
    container.innerHTML = html;
}

function saveTargets() {
    if (!currentProjectId) return;

    const project = projects.find(p => p.id === currentProjectId);
    if (!project) return;

    ALL_METRICS.forEach(mod => {
        const value = parseFloat(document.getElementById(`target-${mod.id}`).value);
        project.targets[mod.id] = value;
    });

    saveProjects();
    alert('Target values saved successfully!');
}

function renderActualDataList(projectId) {
    const container = document.getElementById('actual-data-list');
    const projectData = actualData.filter(d => d.projectId === projectId).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (projectData.length === 0) {
        container.innerHTML = '<p style="color:#999;text-align:center;">No data records yet</p>';
        return;
    }

    const project = projects.find(p => p.id === projectId);
    const targets = project ? project.targets : {};

    let html = `
        <table class="data-table battery-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>20Hz Typical</th>
                    <th>20Hz Heavy</th>
                    <th>20Hz AOD</th>
                    <th>100Hz Typical</th>
                    <th>100Hz Heavy</th>
                    <th>100Hz AOD</th>
                    <th>GPS Cold</th>
                    <th>GPS Hot</th>
                    <th>Touch</th>
                    <th>Key</th>
                    <th>Slide FPS</th>
                    <th>Frame Drop</th>
                    <th>Integration</th>
                    <th>Stability</th>
                    <th>Algorithm</th>
                    <th>Blocker CR</th>
                    <th>Critical CR</th>
                    <th>New CR/Day</th>
                    <th>Resolved CR/Day</th>
                    <th>Version</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    projectData.forEach(data => {
        // Safely get data values to avoid undefined
        const getValue = (key) => {
            const val = data[key];
            return (val !== undefined && val !== null && val !== '') ? val : '-';
        };
        
        html += `
            <tr>
                <td>${getValue('date')}</td>
                <td>${getValue('battery_20hz_typical')} ${getStatusHtml(data.battery_20hz_typical, targets.battery_20hz_typical)}</td>
                <td>${getValue('battery_20hz_heavy')} ${getStatusHtml(data.battery_20hz_heavy, targets.battery_20hz_heavy)}</td>
                <td>${getValue('battery_20hz_aod')} ${getStatusHtml(data.battery_20hz_aod, targets.battery_20hz_aod)}</td>
                <td>${getValue('battery_100hz_typical')} ${getStatusHtml(data.battery_100hz_typical, targets.battery_100hz_typical)}</td>
                <td>${getValue('battery_100hz_heavy')} ${getStatusHtml(data.battery_100hz_heavy, targets.battery_100hz_heavy)}</td>
                <td>${getValue('battery_100hz_aod')} ${getStatusHtml(data.battery_100hz_aod, targets.battery_100hz_aod)}</td>
                <td>${getValue('perf_gps_cold')} ${getStatusHtml(data.perf_gps_cold, targets.perf_gps_cold)}</td>
                <td>${getValue('perf_gps_hot')} ${getStatusHtml(data.perf_gps_hot, targets.perf_gps_hot)}</td>
                <td>${getValue('perf_touch_response')} ${getStatusHtml(data.perf_touch_response, targets.perf_touch_response)}</td>
                <td>${getValue('perf_key_response')} ${getStatusHtml(data.perf_key_response, targets.perf_key_response)}</td>
                <td>${getValue('perf_slide_fps')} ${getStatusHtml(data.perf_slide_fps, targets.perf_slide_fps)}</td>
                <td>${getValue('perf_slide_drop')} ${getStatusHtml(data.perf_slide_drop, targets.perf_slide_drop)}</td>
                <td>${getValue('integration')} ${getStatusHtml(data.integration, targets.integration)}</td>
                <td>${getValue('stability')} ${getStatusHtml(data.stability, targets.stability)}</td>
                <td>${getValue('algorithm')} ${getStatusHtml(data.algorithm, targets.algorithm)}</td>
                <td>${getValue('cr_blocker')}</td>
                <td>${getValue('cr_critical')}</td>
                <td>${getValue('cr_new_daily')}</td>
                <td>${getValue('cr_resolved_daily')}</td>
                <td>${getValue('version')}</td>
                <td>
                    <button class="btn btn-sm btn-delete" onclick="deleteActualData('${data.id}')">Delete</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function getStatusHtml(actual, target) {
    if (!target || actual === undefined || actual === null || actual === '') return '';
    const rate = actual / target;
    if (isNaN(rate)) return '';
    if (rate >= 1) return '<span style="color:#4CAF50;">✓</span>';
    if (rate >= 0.8) return '<span style="color:#FF9800;">△</span>';
    return '<span style="color:#F44336;">✗</span>';
}

function deleteActualData(dataId) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    actualData = actualData.filter(d => d.id !== dataId);
    saveData();
    renderActualDataList(currentProjectId);
    updateCharts();
}

function updateProjectSelects() {
    const selects = ['select-project', 'chart-project', 'version-project', 'dev-project', 'health-project'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        const currentValue = select.value;
        select.innerHTML = '<option value="">Please select a project</option>';
        projects.forEach(p => {
            select.innerHTML += `<option value="${p.id}">${p.name}</option>`;
        });
        if (currentValue && projects.find(p => p.id === currentValue)) {
            select.value = currentValue;
        }
    });
}

function loadProjectTargets() {
    const projectId = document.getElementById('select-project').value;
    const form = document.getElementById('entry-form');
    
    // Get current date picker value, use today if empty
    let date = document.getElementById('entry-date').value;
    if (!date) {
        date = new Date().toISOString().split('T')[0];
        document.getElementById('entry-date').value = date;
    }

    if (!projectId) {
        form.style.display = 'none';
        return;
    }

    form.style.display = 'block';

    const container = document.getElementById('actual-inputs');
    
    let html = '<div class="battery-section"><h4>Battery Life</h4><div class="battery-grid">';
    BATTERY_LIFE_CONFIG.forEach(mod => {
        html += `
            <div class="metric-input-item">
                <label>${mod.name}</label>
                <input type="number" id="actual-${mod.id}" value="0" min="0" step="0.1">
            </div>
        `;
    });
    
    html += '</div></div><div class="performance-section"><h4>Performance</h4><div class="performance-grid">';
    PERFORMANCE_CONFIG.forEach(mod => {
        html += `
            <div class="metric-input-item">
                <label>${mod.name}</label>
                <input type="number" id="actual-${mod.id}" value="0" min="0" step="0.1">
            </div>
        `;
    });
    
    html += '<div class="stability-section"><h4>🛡️ Stability</h4><div class="stability-grid">';
    STABILITY_CONFIG.forEach(mod => {
        html += `
            <div class="metric-input-item">
                <label>${mod.name}</label>
                <input type="number" id="actual-${mod.id}" value="0" min="0">
            </div>
        `;
    });
    html += '</div></div>';
    
    html += '<div class="cr-section"><h4>🔴 CR Count</h4><div class="cr-grid">';
    CR_CONFIG.forEach(mod => {
        html += `
            <div class="metric-input-item">
                <label>${mod.name}</label>
                <input type="number" id="actual-${mod.id}" value="0" min="0">
            </div>
        `;
    });
    html += '</div></div>';
    
    html += '<div class="feature-section"><h4>✅ Feature Completed</h4><div class="feature-grid">';
    FEATURE_CONFIG.forEach(mod => {
        html += `
            <div class="metric-input-item">
                <label>${mod.name}</label>
                <input type="number" id="actual-${mod.id}" value="0" min="0" max="100">
            </div>
        `;
    });
    html += '</div></div>';
    
    html += '<div class="algorithm-section"><h4>🧮 Algorithm</h4><div class="algorithm-grid">';
    MODULES.forEach(mod => {
        html += `
            <div class="metric-input-item">
                <label>${mod.name}</label>
                <input type="number" id="actual-${mod.id}" value="0" min="0">
            </div>
        `;
    });
    html += '</div></div>';
    container.innerHTML = html;
    
    // Load version dropdown and data after form is created
    loadVersionsForProject(projectId);
}

// Load project version list
function loadVersionsForProject(projectId) {
    const versionSelect = document.getElementById('entry-version');
    
    // Get all unique versions for this project
    const projectData = actualData.filter(d => d.projectId === projectId && d.version && d.version !== '');
    const versions = [...new Set(projectData.map(d => d.version))];
    
    // Sort by version number
    versions.sort((a, b) => {
        const aParts = a.replace(/^v/, '').split('.').map(Number);
        const bParts = b.replace(/^v/, '').split('.').map(Number);
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aVal = aParts[i] || 0;
            const bVal = bParts[i] || 0;
            if (aVal !== bVal) return aVal - bVal;
        }
        return 0;
    });
    
    // Clear and repopulate version dropdown
    versionSelect.innerHTML = '<option value="">Please select version</option>';
    
    versions.forEach(version => {
        const option = document.createElement('option');
        option.value = version;
        option.textContent = version;
        versionSelect.appendChild(option);
    });
    
    // If there are versions, select the latest one by default
    if (versions.length > 0) {
        versionSelect.value = versions[versions.length - 1];
        // Load data for the latest version
        loadVersionData();
    }
}

// Load data by version
function loadVersionData() {
    const projectId = document.getElementById('select-project').value;
    const version = document.getElementById('entry-version').value;
    
    if (!projectId || !version) return;
    
    // Find latest data for this project and version
    const versionData = actualData.filter(d => d.projectId === projectId && d.version === version);
    
    if (versionData.length > 0) {
        // Sort by date and get the latest
        const latestData = versionData.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        
        // Fill data into form
        ALL_METRICS.forEach(mod => {
            const input = document.getElementById(`actual-${mod.id}`);
            if (input && latestData[mod.id] !== undefined) {
                input.value = latestData[mod.id];
            }
        });
        
        // Set date to the date of this version data
        document.getElementById('entry-date').value = latestData.date;
    } else {
        // No data found, show 0
        ALL_METRICS.forEach(mod => {
            const input = document.getElementById(`actual-${mod.id}`);
            if (input) {
                input.value = 0;
            }
        });
    }
}

// Load data from URL (supports JSON and Google Sheets CSV)
function loadDataFromUrl() {
    const url = document.getElementById('data-url').value.trim();
    
    if (!url) {
        alert('Please enter data URL');
        return;
    }
    
    // Show loading state
    const btn = document.querySelector('.btn-info');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Loading...';
    btn.disabled = true;
    
    const isGoogleSheet = url.includes('docs.google.com/spreadsheets');
    
    if (isGoogleSheet) {
        // Handle Google Sheets link
        loadFromGoogleSheet(url, btn, originalText);
    } else {
        // Handle regular JSON link
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network request failed');
                }
                return response.json();
            })
            .then(data => fillFormData(data))
            .then(() => alert('Data imported successfully!'))
            .catch(error => {
                console.error('Failed to load data:', error);
                alert(`Failed to load data: ${error.message}`);
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    }
}

// Load data from Google Sheets
function loadFromGoogleSheet(url, btn, originalText) {
    // Extract spreadsheet ID
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
        alert('Invalid Google Sheets link');
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }
    
    const spreadsheetId = match[1];
    // Use CSV export format
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
    
    fetch(csvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network request failed. Please ensure the sheet is set to "Anyone can view"');
            }
            return response.text();
        })
        .then(csvText => {
            const data = parseCSV(csvText);
            if (data) {
                fillFormData(data);
                alert('Data imported successfully!');
            } else {
                throw new Error('Cannot parse spreadsheet data. Please check the format');
            }
        })
        .catch(error => {
            console.error('Failed to load data:', error);
            alert(`Failed to load data: ${error.message}`);
        })
        .finally(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
}

// Parse CSV text
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return null;
    
    const headers = lines[0].split(',').map(h => h.trim());
    const values = lines[1].split(',');
    
    const result = {};
    headers.forEach((header, index) => {
        if (header && values[index] !== undefined) {
            const value = values[index].trim();
            // Try parsing as number
            if (!isNaN(value) && value !== '') {
                result[header] = parseFloat(value);
            } else {
                result[header] = value;
            }
        }
    });
    
    return result;
}

// Fill form data
function fillFormData(data) {
    // Fill date
    if (data.date || data.Date || data['Entry Date']) {
        const dateValue = data.date || data.Date || data['Entry Date'];
        document.getElementById('entry-date').value = dateValue;
    }
    
    // Fill version
    if (data.version || data.Version || data['Version']) {
        const versionValue = data.version || data.Version || data['Version'];
        const versionSelect = document.getElementById('entry-version');
        const exists = Array.from(versionSelect.options).some(opt => opt.value === versionValue);
        if (!exists) {
            const option = document.createElement('option');
            option.value = versionValue;
            option.textContent = versionValue;
            versionSelect.appendChild(option);
        }
        versionSelect.value = versionValue;
    }
    
    // Fill metrics data (supports multiple field name formats)
    ALL_METRICS.forEach(mod => {
        const input = document.getElementById(`actual-${mod.id}`);
        if (input) {
            // Try multiple field name matches
            const value = data[mod.id] || data[mod.name] || data[mod.id.replace('_', ' ')];
            if (value !== undefined) {
                input.value = value;
            }
        }
    });
}

// Add new version
function addNewVersion() {
    const versionSelect = document.getElementById('entry-version');
    const newVersion = prompt('Please enter new version:', 'v1.0.0');
    
    if (newVersion && newVersion.trim()) {
        // Check if version already exists
        const exists = Array.from(versionSelect.options).some(opt => opt.value === newVersion.trim());
        
        if (!exists) {
            const option = document.createElement('option');
            option.value = newVersion.trim();
            option.textContent = newVersion.trim();
            versionSelect.appendChild(option);
            versionSelect.value = newVersion.trim();
            
            // Load empty data
            ALL_METRICS.forEach(mod => {
                const input = document.getElementById(`actual-${mod.id}`);
                if (input) {
                    input.value = 0;
                }
            });
        } else {
            alert('Version already exists!');
            versionSelect.value = newVersion.trim();
            loadVersionData();
        }
    }
}

function loadDateData() {
    const projectId = document.getElementById('select-project').value;
    const date = document.getElementById('entry-date').value;
    
    if (!projectId || !date) return;
    
    // Find latest data for this project and date
    const dateData = actualData.filter(d => d.projectId === projectId && d.date === date);
    
    if (dateData.length > 0) {
        // Found data, sort by time and get the latest
        const latestData = dateData.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))[0];
        
        // Fill into form
        ALL_METRICS.forEach(mod => {
            const input = document.getElementById(`actual-${mod.id}`);
            if (input && latestData[mod.id] !== undefined) {
                input.value = latestData[mod.id];
            }
        });
    } else {
        // No data found, show 0
        ALL_METRICS.forEach(mod => {
            const input = document.getElementById(`actual-${mod.id}`);
            if (input) {
                input.value = 0;
            }
        });
    }
}

function loadLastInputs() {
    const saved = localStorage.getItem('last_entry_inputs');
    return saved ? JSON.parse(saved) : {};
}

function saveLastInputs() {
    const inputs = {};
    ALL_METRICS.forEach(mod => {
        const value = document.getElementById(`actual-${mod.id}`);
        if (value) {
            inputs[mod.id] = parseFloat(value.value) || 5;
        }
    });
    localStorage.setItem('last_entry_inputs', JSON.stringify(inputs));
}

function submitActualData() {
    const projectId = document.getElementById('select-project').value;
    const date = document.getElementById('entry-date').value;
    const version = document.getElementById('entry-version').value;

    if (!projectId || !date) {
        alert('Please select project and fill in date');
        return;
    }

    if (!version) {
        alert('Please enter version number');
        return;
    }

    // Save user inputs
    saveLastInputs();

    // Check if data already exists for this date (by version)
    const existingIndex = actualData.findIndex(
        d => d.projectId === projectId && d.date === date && d.version === version
    );

    const data = {
        id: Date.now().toString(),
        projectId: projectId,
        date: date,
        version: version
    };

    ALL_METRICS.forEach(mod => {
        const inputValue = document.getElementById(`actual-${mod.id}`).value;
        data[mod.id] = parseFloat(inputValue) || 0;
    });
    
    // Debug: Log submitted data
    console.log('Submitted data:', data);

    if (existingIndex >= 0) {
        // Update existing data (overwrite same version)
        actualData[existingIndex] = data;
        saveData();
        resetEntryForm();
        alert('Data updated successfully! Overwrote record for same version');
    } else {
        // Add new record
        actualData.push(data);
        saveData();
        resetEntryForm();
        alert('Data submitted successfully!');
    }
}

function resetEntryForm() {
    // Keep current version and data unchanged, only update date to today
    // Do not reset data, keep current version's entered data
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');

    if (tabId === 'charts') {
        updateCharts();
    } else if (tabId === 'version-plan') {
        loadVersionPlan();
    } else if (tabId === 'dev-plan') {
        loadDevPlan();
    }
}

// ============ Version Plan Features ============

function showAddVersionModal() {
    const projectId = document.getElementById('version-project').value;
    if (!projectId) {
        alert('Please select a project first');
        return;
    }
    document.getElementById('version-name').value = '';
    document.getElementById('version-date').value = '';
    document.getElementById('version-desc').value = '';
    document.getElementById('add-version-modal').style.display = 'flex';
}

function addVersionPlan() {
    const projectId = document.getElementById('version-project').value;
    const versionName = document.getElementById('version-name').value.trim();
    const versionDate = document.getElementById('version-date').value;
    const versionDesc = document.getElementById('version-desc').value.trim();

    if (!versionName || !versionDate) {
        alert('Please fill in version number and planned date');
        return;
    }

    const newVersion = {
        id: Date.now().toString(),
        projectId: projectId,
        name: versionName,
        date: versionDate,
        description: versionDesc,
        createdAt: new Date().toISOString().split('T')[0]
    };

    versionPlans.push(newVersion);
    saveVersionPlans();
    loadVersionPlan();
    closeModal('add-version-modal');
    alert('Version plan added successfully!');
}

function loadVersionPlan() {
    const projectId = document.getElementById('version-project').value;
    const container = document.getElementById('version-plan-list');
    const emptyState = document.getElementById('empty-version-plan');

    if (!projectId) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    const projectVersions = versionPlans.filter(v => v.projectId === projectId)
                                       .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (projectVersions.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = projectVersions.map(version => `
        <div class="version-card">
            <div class="version-header">
                <h3>${version.name}</h3>
                <div class="version-actions">
                    <button class="btn btn-sm btn-edit" onclick="editVersion('${version.id}')">Edit</button>
                    <button class="btn btn-sm btn-delete" onclick="deleteVersion('${version.id}')">Delete</button>
                </div>
            </div>
            <div class="version-info">
                <p><strong>Planned Date:</strong> ${version.date}</p>
                ${version.description ? `<p><strong>Description:</strong> ${version.description}</p>` : ''}
                <p class="version-created">Created: ${version.createdAt}</p>
            </div>
        </div>
    `).join('');
}

function editVersion(versionId) {
    const version = versionPlans.find(v => v.id === versionId);
    if (!version) return;

    document.getElementById('edit-version-id').value = versionId;
    document.getElementById('edit-version-name').value = version.name;
    document.getElementById('edit-version-date').value = version.date;
    document.getElementById('edit-version-desc').value = version.description;
    document.getElementById('edit-version-modal').style.display = 'flex';
}

function saveVersionEdit() {
    const versionId = document.getElementById('edit-version-id').value;
    const version = versionPlans.find(v => v.id === versionId);
    if (!version) return;

    version.name = document.getElementById('edit-version-name').value.trim();
    version.date = document.getElementById('edit-version-date').value;
    version.description = document.getElementById('edit-version-desc').value.trim();

    saveVersionPlans();
    loadVersionPlan();
    closeModal('edit-version-modal');
    alert('Version plan updated successfully!');
}

function deleteVersion(versionId) {
    if (confirm('Are you sure you want to delete this version plan?')) {
        versionPlans = versionPlans.filter(v => v.id !== versionId);
        saveVersionPlans();
        loadVersionPlan();
        alert('Version plan deleted successfully!');
    }
}

// ============ Development Plan Features ============

function showAddDevTaskModal() {
    const projectId = document.getElementById('dev-project').value;
    if (!projectId) {
        alert('Please select a project first');
        return;
    }
    document.getElementById('dev-title').value = '';
    document.getElementById('dev-desc').value = '';
    document.getElementById('dev-assignee').value = '';
    document.getElementById('dev-phase').value = 'firmware';
    document.getElementById('dev-priority').value = 'medium';
    document.getElementById('dev-due-date').value = '';
    document.getElementById('add-dev-modal').style.display = 'flex';
}

function addDevTask() {
    const projectId = document.getElementById('dev-project').value;
    const title = document.getElementById('dev-title').value.trim();
    const desc = document.getElementById('dev-desc').value.trim();
    const assignee = document.getElementById('dev-assignee').value.trim();
    const phase = document.getElementById('dev-phase').value;
    const priority = document.getElementById('dev-priority').value;
    const dueDate = document.getElementById('dev-due-date').value;

    if (!title) {
        alert('Please enter task title');
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        projectId: projectId,
        title: title,
        description: desc,
        assignee: assignee,
        phase: phase,
        priority: priority,
        dueDate: dueDate,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
    };

    devPlans.push(newTask);
    saveDevPlans();
    loadDevPlan();
    closeModal('add-dev-modal');
    alert('Development task added successfully!');
}

function loadDevPlan() {
    const projectId = document.getElementById('dev-project').value;
    const statusFilter = document.getElementById('dev-status-filter').value;
    const container = document.getElementById('dev-plan-list');
    const emptyState = document.getElementById('empty-dev-plan');

    if (!projectId) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    let filteredTasks = devPlans.filter(t => t.projectId === projectId);
    
    if (statusFilter) {
        filteredTasks = filteredTasks.filter(t => t.status === statusFilter);
    }

    filteredTasks.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const priorityCompare = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityCompare !== 0) return priorityCompare;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    if (filteredTasks.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = filteredTasks.map(task => {
        const statusText = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'completed': 'Completed'
        };
        const statusClass = {
            'pending': 'status-pending',
            'in-progress': 'status-progress',
            'completed': 'status-completed'
        };
        const priorityClass = {
            'high': 'priority-high',
            'medium': 'priority-medium',
            'low': 'priority-low'
        };
        const phaseText = {
            'firmware': 'Firmware Dev',
            'app': 'APP Dev',
            'integration': 'Waiting Integration'
        };
        const phaseClass = {
            'firmware': 'phase-firmware',
            'app': 'phase-app',
            'integration': 'phase-integration'
        };
        return `
            <div class="dev-card">
                <div class="dev-header">
                    <div class="dev-title-row">
                        <h3>${task.title}</h3>
                        <span class="${priorityClass[task.priority]}">${task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low'}</span>
                        <span class="${phaseClass[task.phase] || 'phase-firmware'}">${phaseText[task.phase] || 'Firmware Dev'}</span>
                    </div>
                    <div class="dev-actions">
                        <select class="status-select" onchange="updateDevStatus('${task.id}', this.value)">
                            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                        <button class="btn btn-sm btn-edit" onclick="editDevTask('${task.id}')">Edit</button>
                        <button class="btn btn-sm btn-delete" onclick="deleteDevTask('${task.id}')">Delete</button>
                    </div>
                </div>
                <div class="dev-info">
                    ${task.description ? `<p>${task.description}</p>` : ''}
                    <div class="dev-meta">
                        ${task.assignee ? `<span>Assignee: ${task.assignee}</span>` : ''}
                        ${task.dueDate ? `<span>Due Date: ${task.dueDate}</span>` : ''}
                        <span class="${statusClass[task.status]}" data-task-id="${task.id}">${statusText[task.status]}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateDevStatus(taskId, status) {
    const task = devPlans.find(t => t.id === taskId);
    if (task) {
        task.status = status;
        saveDevPlans();
        
        // Update the status display on the page
        const statusText = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'completed': 'Completed'
        };
        const statusClass = {
            'pending': 'status-pending',
            'in-progress': 'status-progress',
            'completed': 'status-completed'
        };
        
        // Find the status span using data-task-id attribute
        const statusSpan = document.querySelector(`.dev-meta span[data-task-id="${taskId}"]`);
        if (statusSpan) {
            statusSpan.textContent = statusText[status];
            // Remove old status class and add new one
            statusSpan.classList.remove('status-pending', 'status-progress', 'status-completed');
            statusSpan.classList.add(statusClass[status]);
        }
    }
}

function editDevTask(taskId) {
    const task = devPlans.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('edit-dev-id').value = taskId;
    document.getElementById('edit-dev-title').value = task.title;
    document.getElementById('edit-dev-desc').value = task.description;
    document.getElementById('edit-dev-assignee').value = task.assignee;
    document.getElementById('edit-dev-phase').value = task.phase || 'firmware';
    document.getElementById('edit-dev-priority').value = task.priority;
    document.getElementById('edit-dev-due-date').value = task.dueDate;
    document.getElementById('edit-dev-modal').style.display = 'flex';
}

function saveDevTaskEdit() {
    const taskId = document.getElementById('edit-dev-id').value;
    const task = devPlans.find(t => t.id === taskId);
    if (!task) return;

    task.title = document.getElementById('edit-dev-title').value.trim();
    task.description = document.getElementById('edit-dev-desc').value.trim();
    task.assignee = document.getElementById('edit-dev-assignee').value.trim();
    task.phase = document.getElementById('edit-dev-phase').value;
    task.priority = document.getElementById('edit-dev-priority').value;
    task.dueDate = document.getElementById('edit-dev-due-date').value;

    saveDevPlans();
    loadDevPlan();
    closeModal('edit-dev-modal');
    alert('Development task updated successfully!');
}

function deleteDevTask(taskId) {
    if (confirm('Are you sure you want to delete this development task?')) {
        devPlans = devPlans.filter(t => t.id !== taskId);
        saveDevPlans();
        loadDevPlan();
        alert('Development task deleted successfully!');
    }
}

function updateCharts() {
    const projectId = document.getElementById('chart-project').value;
    const container = document.getElementById('chart-container');
    const emptyState = document.getElementById('empty-chart');

    if (!projectId) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    emptyState.style.display = 'none';

    const project = projects.find(p => p.id === projectId);
    
    // Get all data for this project, filter out data without version
    // Filter data with version only
    const sortedData = actualData.filter(d => 
        d.projectId === projectId && 
        d.version !== undefined && 
        d.version !== null && 
        d.version !== ''
    ).sort((a, b) => {
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.version.localeCompare(b.version);
    });
    
    // Group by version, keep only the latest data for each version (for other charts)
    const versionGroups = {};
    sortedData.forEach(item => {
        const key = item.version;
        if (!versionGroups[key] || 
            (!versionGroups[key].createdAt || 
            (item.createdAt && new Date(item.createdAt) > new Date(versionGroups[key].createdAt)))) {
            versionGroups[key] = item;
        }
    });
    
    // Get unique version list, sorted ascending (older versions first)
    const versions = Object.keys(versionGroups).sort();
    
    // Version-sorted data (for other charts) - keep all versions, filtering happens per-chart
    const projectDataByVersion = versions.map(v => versionGroups[v]);
    
    // CR chart uses date-grouped data (keep latest for each date)
    const dateGroups = {};
    sortedData.forEach(item => {
        const key = item.date;
        if (!dateGroups[key] || 
            (!dateGroups[key].createdAt || 
            (item.createdAt && new Date(item.createdAt) > new Date(dateGroups[key].createdAt)))) {
            dateGroups[key] = item;
        }
    });
    
    const projectDataByDate = Object.values(dateGroups).sort((a, b) => new Date(a.date) - new Date(b.date));

    if (projectDataByVersion.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:50px;color:#999;">No data available, please enter actual data first</p>';
        return;
    }

    renderComparisonChart(project, projectDataByDate); // CR chart uses date data
    renderIndividualCharts(project, projectDataByVersion, versions);
    renderAchievementRates(project, projectDataByVersion);
    renderPendingTasks(projectId);
}

function renderPendingTasks(projectId) {
    const container = document.getElementById('pending-tasks-list');
    const emptyState = document.getElementById('empty-pending-tasks');
    
    const pendingTasks = devPlans.filter(t => t.projectId === projectId && t.status !== 'completed')
                                 .sort((a, b) => {
                                     const priorityOrder = { high: 0, medium: 1, low: 2 };
                                     return priorityOrder[a.priority] - priorityOrder[b.priority];
                                 });
    
    if (pendingTasks.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    const phaseText = {
        'firmware': t.devPlan?.phases?.firmware || 'Firmware Dev',
        'app': t.devPlan?.phases?.app || 'APP Dev',
        'integration': t.devPlan?.phases?.integration || 'Waiting Integration'
    };
    const phaseClass = {
        'firmware': 'phase-firmware',
        'app': 'phase-app',
        'integration': 'phase-integration'
    };
    const statusText = {
        'pending': t.devPlan?.statusOptions?.pending || 'Pending',
        'in-progress': t.devPlan?.statusOptions?.['in-progress'] || 'In Progress'
    };
    const statusClass = {
        'pending': 'status-pending',
        'in-progress': 'status-progress'
    };
    const priorityClass = {
        'high': 'priority-high',
        'medium': 'priority-medium',
        'low': 'priority-low'
    };
    const priorityText = {
        'high': t.devPlan?.priorityOptions?.high || 'High',
        'medium': t.devPlan?.priorityOptions?.medium || 'Medium',
        'low': t.devPlan?.priorityOptions?.low || 'Low'
    };
    
    container.innerHTML = pendingTasks.map(task => `
        <div class="pending-task-item">
            <div class="pending-task-header">
                <span class="${priorityClass[task.priority]}">${priorityText[task.priority]}</span>
                <span class="${phaseClass[task.phase] || 'phase-firmware'}">${phaseText[task.phase] || 'Firmware Dev'}</span>
            </div>
            <h4>${task.title}</h4>
            ${task.description ? `<p>${task.description}</p>` : ''}
            <div class="pending-task-meta">
                ${task.assignee ? `<span>${t.devPlan?.assignee || 'Assignee'}: ${task.assignee}</span>` : ''}
                ${task.dueDate ? `<span>${t.devPlan?.deadline || 'Due Date'}: ${task.dueDate}</span>` : ''}
                <span class="${statusClass[task.status]}">${statusText[task.status]}</span>
            </div>
        </div>
    `).join('');
}

function renderComparisonChart(project, data) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');

    if (comparisonChart) {
        comparisonChart.destroy();
    }

    // X-axis: Date
    const labels = data.map(d => d.date);
    
    // Calculate Y-axis range including new CR fields
    const maxBlocker = Math.max(...data.map(d => d.cr_blocker || 0), 5);
    const maxCritical = Math.max(...data.map(d => d.cr_critical || 0), 5);
    const maxNew = Math.max(...data.map(d => d.cr_new_daily || 0), 5);
    const maxResolved = Math.max(...data.map(d => d.cr_resolved_daily || 0), 5);
    const maxValue = Math.ceil(Math.max(maxBlocker, maxCritical, maxNew, maxResolved) * 1.2);
    
    comparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: t.health?.crBlocker || 'Blocker CR',
                    data: data.map(d => d.cr_blocker || 0),
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: t.health?.crCritical || 'Critical CR',
                    data: data.map(d => d.cr_critical || 0),
                    borderColor: 'rgba(251, 146, 60, 1)',
                    backgroundColor: 'rgba(251, 146, 60, 0.1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'Daily New CR',
                    data: data.map(d => d.cr_new_daily || 0),
                    borderColor: 'rgba(99, 102, 241, 1)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.3,
                    fill: false,
                    borderDash: [5, 5]
                },
                {
                    label: 'Daily Resolved CR',
                    data: data.map(d => d.cr_resolved_daily || 0),
                    borderColor: 'rgba(34, 197, 94, 1)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.3,
                    fill: false,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: t.charts?.trendTitle || 'CR Resolution Trend',
                    font: { size: 14 }
                },
                legend: {
                    position: 'bottom',
                    labels: { 
                        boxWidth: 12, 
                        font: { size: 11 }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'top',
                    align: 'center',
                    color: '#ffffff',
                    font: {
                        family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    formatter: function(value, context) {
                        if (value === null || value === undefined || value === '' || value === 0) return '';
                        const numValue = Number(value);
                        return numValue % 1 !== 0 ? numValue.toFixed(2) : numValue;
                    },
                    backgroundColor: function(context) {
                        return context.dataset.borderColor || 'rgba(0, 0, 0, 0.8)';
                    },
                    padding: 4,
                    borderRadius: 4
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: maxValue,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    title: {
                        display: true,
                        text: t.charts?.value || 'Count'
                }
                },
                x: {
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: t.dashboard?.date || 'Date'
                }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

// Version color mapping
const VERSION_COLORS = [
    { border: 'rgba(99, 102, 241, 1)', bg: 'rgba(99, 102, 241, 0.7)' },  // Purple
    { border: 'rgba(34, 197, 94, 1)', bg: 'rgba(34, 197, 94, 0.7)' },   // Green
    { border: 'rgba(239, 68, 68, 1)', bg: 'rgba(239, 68, 68, 0.7)' },     // Red
    { border: 'rgba(251, 146, 60, 1)', bg: 'rgba(251, 146, 60, 0.7)' },   // Orange
    { border: 'rgba(168, 85, 247, 1)', bg: 'rgba(168, 85, 247, 0.7)' },   // Purple
    { border: 'rgba(6, 182, 212, 1)', bg: 'rgba(6, 182, 212, 0.7)' },     // Cyan
    { border: 'rgba(245, 158, 11, 1)', bg: 'rgba(245, 158, 11, 0.7)' },   // Amber
];

// 20Hz scene color mapping
const SCENE_COLORS_20HZ = {
    typical: { border: 'rgba(59, 130, 246, 1)', bg: 'rgba(59, 130, 246, 0.2)', label: 'Typical' },
    heavy: { border: 'rgba(239, 68, 68, 1)', bg: 'rgba(239, 68, 68, 0.2)', label: 'Heavy' },
    aod: { border: 'rgba(139, 92, 246, 1)', bg: 'rgba(139, 92, 246, 0.2)', label: 'AOD' }
};

// 100Hz scene color mapping
const SCENE_COLORS_100HZ = {
    typical: { border: 'rgba(16, 185, 129, 1)', bg: 'rgba(16, 185, 129, 0.2)', label: 'Typical' },
    heavy: { border: 'rgba(245, 158, 11, 1)', bg: 'rgba(245, 158, 11, 0.2)', label: 'Heavy' },
    aod: { border: 'rgba(236, 72, 153, 1)', bg: 'rgba(236, 72, 153, 0.2)', label: 'AOD' }
};

// Generate data table HTML (each metric in separate row: version, metric name, actual value, target)
function generateDataTable(data, versions, metrics, project, unit = '') {
    let html = '<div class="data-table-container"><table class="data-table"><thead><tr><th>Version</th><th>Metric</th><th>Actual Value</th><th>Target</th></tr></thead><tbody>';

    // Keep only up to 5 latest versions (versions already sorted ascending, take last 5)
    const displayVersions = versions.slice(-5);

    displayVersions.forEach(version => {
        metrics.forEach(m => {
            const row = data.find(d => d.version === version);
            const value = row ? (row[m.id] !== undefined && row[m.id] !== null && row[m.id] !== '' ? row[m.id] : '-') : '-';
            
            // Skip if value is 0 or empty
            if (value === '-' || value === 0 || value === '0') return;
            
            const target = project.targets[m.id] || '-';
            html += `<tr><td><strong>${version}</strong></td><td>${m.label}</td><td class="value-highlight">${value}${unit}</td><td>${target}${unit}</td></tr>`;
        });
    });

    html += '</tbody></table></div>';
    return html;
}

function renderBatteryComparisonChart(project, data, versions, container, hz) {
    const colors = hz === 20 ? SCENE_COLORS_20HZ : SCENE_COLORS_100HZ;
    const card = document.createElement('div');
    card.className = 'chart-card';
    card.innerHTML = `<h3>${hz}Hz Battery Comparison (Three Scenarios)</h3><canvas id="chart-battery-${hz}hz"></canvas>`;

    // Battery-specific data table (three scenarios separated by "/" for same version)
    let html = '<div class="data-table-container"><table class="data-table"><thead><tr><th>Version</th><th>Scenario</th><th>Actual Value</th><th>Target</th></tr></thead><tbody>';
    // Keep only up to 5 latest versions (versions already sorted ascending, take last 5)
    const displayVersions = versions.slice(-5);
    displayVersions.forEach(version => {
        const row = data.find(d => d.version === version);
        const typical = row ? (row[`battery_${hz}hz_typical`] !== undefined && row[`battery_${hz}hz_typical`] !== null && row[`battery_${hz}hz_typical`] !== '' ? row[`battery_${hz}hz_typical`] : '-') : '-';
        const heavy = row ? (row[`battery_${hz}hz_heavy`] !== undefined && row[`battery_${hz}hz_heavy`] !== null && row[`battery_${hz}hz_heavy`] !== '' ? row[`battery_${hz}hz_heavy`] : '-') : '-';
        const aod = row ? (row[`battery_${hz}hz_aod`] !== undefined && row[`battery_${hz}hz_aod`] !== null && row[`battery_${hz}hz_aod`] !== '' ? row[`battery_${hz}hz_aod`] : '-') : '-';
        
        // Skip if all values are 0 or empty
        const hasValidData = (typical !== '-' && typical !== 0 && typical !== '0') || 
                            (heavy !== '-' && heavy !== 0 && heavy !== '0') || 
                            (aod !== '-' && aod !== 0 && aod !== '0');
        if (!hasValidData) return;
        
        const targetTypical = project.targets[`battery_${hz}hz_typical`] || '-';
        const targetHeavy = project.targets[`battery_${hz}hz_heavy`] || '-';
        const targetAod = project.targets[`battery_${hz}hz_aod`] || '-';
        html += `<tr><td><strong>${version}</strong></td><td>Typical / Heavy / AOD</td><td class="value-highlight">${typical} / ${heavy} / ${aod} days</td><td>${targetTypical} / ${targetHeavy} / ${targetAod} days</td></tr>`;
    });
    html += '</tbody></table></div>';
    card.innerHTML += html;

    container.appendChild(card);

    const ctx = card.querySelector('canvas').getContext('2d');
    
    // Filter out versions where all scenarios have 0 or empty values
    const filteredData = data.filter(d => {
        const typical = d[`battery_${hz}hz_typical`];
        const heavy = d[`battery_${hz}hz_heavy`];
        const aod = d[`battery_${hz}hz_aod`];
        return !((!typical || parseInt(typical) <= 0) && 
                (!heavy || parseInt(heavy) <= 0) && 
                (!aod || parseInt(aod) <= 0));
    });
    
    const filteredLabels = filteredData.map(d => d.version);
    
    const datasets = [];
    
    // Add Target lines (one for each scenario)
    ['typical', 'heavy', 'aod'].forEach((scene, idx) => {
        const sceneColor = colors[scene];
        const targetId = `battery_${hz}hz_${scene}`;
        
        datasets.push({
            label: `${sceneColor.label} Target`,
            data: filteredData.map(() => project.targets[targetId]),
            borderColor: sceneColor.border,
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 1.5,
            order: idx
        });
    });
    
    // Add actual data curves for three scenarios
    ['typical', 'heavy', 'aod'].forEach((scene, idx) => {
        const sceneColor = colors[scene];
        const dataId = `battery_${hz}hz_${scene}`;
        
        const sceneData = filteredData.map(d => {
                const value = d[dataId];
                const numValue = parseFloat(value);
                // Don't show if value is 0, null, undefined, empty string, or not a valid number
                if (value === undefined || value === null || value === '' || 
                    isNaN(numValue) || numValue <= 0) {
                    return null;
                }
                return numValue;
            });
        
        datasets.push({
            label: sceneColor.label,
            data: sceneData,
            borderColor: sceneColor.border,
            backgroundColor: sceneColor.bg,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 8,
            borderWidth: 2,
            order: idx + 3
        });
    });
    
    // Calculate Y-axis range
    const allValues = [];
    [`battery_${hz}hz_typical`, `battery_${hz}hz_heavy`, `battery_${hz}hz_aod`].forEach(id => {
        data.forEach(d => {
            if (d[id] !== undefined && d[id] !== null && d[id] !== '') {
                allValues.push(d[id]);
            }
        });
        if (project.targets[id]) {
            allValues.push(project.targets[id]);
        }
    });
    
    const maxValue = allValues.length > 0 ? Math.max(...allValues) * 1.2 : 10;
    const minValue = 0;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredLabels,
            datasets: datasets
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        maxWidth: 120,
                        font: {
                            family: "'Segoe UI', 'Arial', sans-serif",
                            size: 11
                        },
                        color: '#333333',
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#333333',
                    bodyColor: '#666666',
                    borderColor: '#e0e0e0',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: {
                        family: "'Segoe UI', 'Arial', sans-serif",
                        size: 12,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: "'Segoe UI', 'Arial', sans-serif",
                        size: 11
                    },
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            if (value === null || value === undefined) return '';
                            const numValue = Number(value);
                            const formattedValue = numValue % 1 !== 0 ? numValue.toFixed(2) : numValue;
                            return `${context.dataset.label}: ${formattedValue} days`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'top',
                    align: 'center',
                    color: '#333333',
                    font: {
                        family: "'Segoe UI', 'Arial', sans-serif",
                        size: 10,
                        weight: 'normal'
                    },
                    formatter: function(value, context) {
                        if (value === null || value === undefined || value === '') return '';
                        // Don't show value on Target line
                        if (context.dataset.label && context.dataset.label.includes('Target')) return '';
                        const numValue = Number(value);
                        const formattedValue = numValue % 1 !== 0 ? numValue.toFixed(2) : numValue;
                        return `${formattedValue} days`;
                    },
                    backgroundColor: 'transparent',
                    padding: 2,
                    borderRadius: 0
                }
            },
            scales: {
                y: {
                    min: minValue,
                    max: maxValue,
                    beginAtZero: false,
                    grid: {
                        color: '#e8e8e8',
                        lineWidth: 1
                    },
                    ticks: {
                        stepSize: Math.ceil(maxValue / 5),
                        font: {
                            family: "'Segoe UI', 'Arial', sans-serif",
                            size: 10
                        },
                        color: '#666666',
                        padding: 8
                    },
                    border: {
                        color: '#cccccc',
                        lineWidth: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Segoe UI', 'Arial', sans-serif",
                            size: 10
                        },
                        color: '#666666',
                        padding: 8
                    },
                    border: {
                        color: '#cccccc',
                        lineWidth: 1
                    }
                }
            }
        }
    });
}

// Render CR count version comparison line chart
function renderCrVersionChart(project, data, versions, container) {
    const card = document.createElement('div');
    card.className = 'chart-card';
    card.innerHTML = `<h3>CR Count (Version Comparison)</h3><canvas id="chart-cr-version"></canvas>`;
    
    // Add data table
    let html = '<div class="data-table-container"><table class="data-table"><thead><tr><th>Version</th><th>Blocker CR</th><th>Critical CR</th></tr></thead><tbody>';
    // Keep only up to 5 latest versions (versions already sorted ascending, take last 5)
    const displayVersions = versions.slice(-5);
    displayVersions.forEach(version => {
        const row = data.find(d => d.version === version);
        const blocker = row ? (row.cr_blocker !== undefined && row.cr_blocker !== null && row.cr_blocker !== '' ? row.cr_blocker : '0') : '0';
        const critical = row ? (row.cr_critical !== undefined && row.cr_critical !== null && row.cr_critical !== '' ? row.cr_critical : '0') : '0';
        
        // Skip if both values are 0
        if (blocker === '0' && critical === '0') return;
        
        html += `<tr><td><strong>${version}</strong></td><td class="value-highlight">${blocker}</td><td class="value-highlight">${critical}</td></tr>`;
    });
    html += '</tbody></table></div>';
    card.innerHTML += html;
    
    container.appendChild(card);
    
    const ctx = card.querySelector('canvas').getContext('2d');
    
    // Filter out versions where both CR values are 0 or empty
    const filteredData = data.filter(d => {
        const blocker = d.cr_blocker;
        const critical = d.cr_critical;
        return !((!blocker || parseInt(blocker) <= 0) && 
                (!critical || parseInt(critical) <= 0));
    });
    
    const filteredLabels = filteredData.map(d => d.version);
    
    const datasets = [
        {
            label: 'Blocker CR',
            data: filteredData.map(d => {
                const value = d.cr_blocker;
                const numValue = parseFloat(value);
                if (value === undefined || value === null || value === '' || 
                    isNaN(numValue) || numValue <= 0) {
                    return null;
                }
                return numValue;
            }),
            borderColor: 'rgba(239, 68, 68, 1)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: true
        },
        {
            label: 'Critical CR',
            data: filteredData.map(d => {
                const value = d.cr_critical;
                const numValue = parseFloat(value);
                if (value === undefined || value === null || value === '' || 
                    isNaN(numValue) || numValue <= 0) {
                    return null;
                }
                return numValue;
            }),
            borderColor: 'rgba(251, 146, 60, 1)',
            backgroundColor: 'rgba(251, 146, 60, 0.1)',
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            tension: 0.4,
            fill: true
        }
    ];
    
    // Calculate Y-axis range
    let maxValue = 5;
    filteredData.forEach(d => {
        if (d.cr_blocker) maxValue = Math.max(maxValue, d.cr_blocker);
        if (d.cr_critical) maxValue = Math.max(maxValue, d.cr_critical);
    });
    maxValue = Math.ceil(maxValue * 1.2);
    
    if (window.crVersionChart) {
        window.crVersionChart.destroy();
    }
    
    window.crVersionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredLabels,
            datasets: datasets
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        maxWidth: 120,
                        font: {
                            family: "'Segoe UI', 'Arial', sans-serif",
                            size: 11
                        },
                        color: '#333333',
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#333333',
                    bodyColor: '#666666',
                    borderColor: '#e0e0e0',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: {
                        family: "'Segoe UI', 'Arial', sans-serif",
                        size: 12,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: "'Segoe UI', 'Arial', sans-serif",
                        size: 11
                    },
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            if (value === null || value === undefined) return '';
                            const numValue = Number(value);
                            const formattedValue = numValue % 1 !== 0 ? numValue.toFixed(2) : numValue;
                            return `${context.dataset.label}: ${formattedValue}`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'top',
                    align: 'center',
                    color: '#333333',
                    font: {
                        family: "'Segoe UI', 'Arial', sans-serif",
                        size: 10,
                        weight: 'normal'
                    },
                    formatter: function(value, context) {
                        if (value === null || value === undefined || value === '' || value === 0) return '';
                        const numValue = Number(value);
                        return numValue % 1 !== 0 ? numValue.toFixed(2) : numValue;
                    },
                    backgroundColor: 'transparent',
                    padding: 2,
                    borderRadius: 0
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxValue,
                    grid: {
                        color: '#e8e8e8',
                        lineWidth: 1
                    },
                    ticks: {
                        font: {
                            family: "'Segoe UI', 'Arial', sans-serif",
                            size: 10
                        },
                        color: '#666666',
                        padding: 8
                    },
                    border: {
                        color: '#cccccc',
                        lineWidth: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Segoe UI', 'Arial', sans-serif",
                            size: 10
                        },
                        color: '#666666',
                        padding: 8
                    },
                    border: {
                        color: '#cccccc',
                        lineWidth: 1
                    }
                }
            }
        }
    });
}

function renderIndividualCharts(project, data, versions) {
    const container = document.getElementById('individual-charts');
    container.innerHTML = '';

    // Render 20Hz and 100Hz battery comparison charts (three scenarios each)
    renderBatteryComparisonChart(project, data, versions, container, 20);
    renderBatteryComparisonChart(project, data, versions, container, 100);
    
    // Render CR count version comparison line chart
    renderCrVersionChart(project, data, versions, container);
    
    // Render other non-CR metrics (excluding all battery metrics)
    ALL_METRICS.forEach(mod => {
        // Skip CR metrics and battery metrics (handled separately)
        if (mod.id.startsWith('cr_') || mod.id.startsWith('battery_')) return;
        
        const card = document.createElement('div');
        card.className = 'chart-card';
        
        card.innerHTML = `<h3>${mod.name} Version Comparison</h3><canvas id="chart-${mod.id}"></canvas>`;
        
        // Add data table
        const unit = mod.id.startsWith('perf_gps') ? 's' : 
                     (mod.id.startsWith('perf_touch') || mod.id.startsWith('perf_key')) ? 'ms' :
                     mod.id.startsWith('perf_slide_fps') ? 'Hz' :
                     mod.id.startsWith('perf_slide_drop') ? 'frames' :
                     mod.id.startsWith('stability') ? 'h' :
                     mod.id === 'integration' ? '%' : '';
        const metrics = [{ id: mod.id, label: mod.name }];
        card.innerHTML += generateDataTable(data, versions, metrics, project, unit);
        
        container.appendChild(card);

        const ctx = card.querySelector('canvas').getContext('2d');
        
        // Feature Completed uses bar chart
        const isBarChart = mod.id === 'integration';
        
        let datasets;
        let filteredLabels = versions;
        
        if (versions && versions.length > 0) {
            // Filter out versions with 0 or empty values for this metric
            const filteredData = data.filter(d => {
                const value = d[mod.id];
                const numValue = parseFloat(value);
                return !(value === undefined || value === null || value === '' || 
                        isNaN(numValue) || numValue <= 0);
            });
            
            // Use filtered labels and data
            filteredLabels = filteredData.map(d => d.version);
            
            // Group data by version
            datasets = [];
            
            // Add Target line
            // Battery module keeps gray, others use green
            const targetColor = mod.id.startsWith('battery') ? 'rgba(156, 163, 175, 1)' : 'rgba(34, 197, 94, 1)';
            datasets.push({
                label: 'Target',
                data: filteredData.map(() => project.targets[mod.id]),
                borderColor: targetColor,
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2,
                order: 0
            });
            
            // Create a dataset with filtered version data (only non-zero values)
            const versionData = filteredData.map(d => {
                const value = d[mod.id];
                return parseFloat(value) || 0;
            });
            
            datasets.push({
                label: 'Version Trend',
                data: versionData,
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: isBarChart ? 'rgba(99, 102, 241, 0.7)' : 'rgba(99, 102, 241, 0.1)',
                tension: isBarChart ? 0 : 0.4,
                fill: !isBarChart,
                pointRadius: isBarChart ? 0 : 6,
                pointHoverRadius: 10,
                borderWidth: isBarChart ? 1 : 2,
                order: 1
            });
        } else {
            // Legacy logic: Show Target vs actual value comparison
            datasets = [
                {
                    label: 'Target',
                    data: data.map(() => project.targets[mod.id]),
                    borderColor: getModuleColor(mod.id, 1),
                    backgroundColor: isBarChart ? 'rgba(255, 99, 132, 0.3)' : 'transparent',
                    borderDash: isBarChart ? [] : [5, 5],
                    tension: isBarChart ? 0 : 0.3,
                    pointRadius: isBarChart ? 0 : 4,
                    borderWidth: isBarChart ? 1 : 2
                },
                {
                    label: 'Actual Value',
                    data: data.map(d => d[mod.id]),
                    borderColor: getModuleColor(mod.id, 0.8),
                    backgroundColor: isBarChart ? getModuleColor(mod.id, 0.7) : getModuleColor(mod.id, 0.2),
                    tension: isBarChart ? 0 : 0.3,
                    fill: !isBarChart,
                    pointRadius: isBarChart ? 0 : 4
                }
            ];
        }
        
        // Calculate Y-axis range
        let maxValue, minValue;
        if (mod.id === 'perf_gps_cold') {
            maxValue = 60;
            minValue = 10;
        } else if (mod.id === 'perf_gps_hot') {
            maxValue = 15;
            minValue = 5;
        } else if (mod.id === 'stability') {
            maxValue = 80;
            minValue = 0;
        } else if (mod.id.startsWith('battery_100hz_')) {
            // 100Hz power consumption metrics
            const targetValue = project.targets[mod.id] || 5;
            const allValues = data.map(d => d[mod.id] || 0);
            const maxDataValue = Math.max(...allValues, targetValue);
            maxValue = Math.max(maxDataValue * 1.2, targetValue * 1.2, 10);
            minValue = 0;
        } else {
            const targetValue = project.targets[mod.id] || 5;
            const allValues = data.map(d => d[mod.id] || 0);
            const maxDataValue = Math.max(...allValues, targetValue);
            if (targetValue <= 5) {
                maxValue = Math.max(maxDataValue * 1.2, 5);
                minValue = 0;
            } else {
                maxValue = Math.max(maxDataValue * 1.2, targetValue * 1.2, 10);
                minValue = Math.max(targetValue * 0.5, 0);
            }
        }
        
        // Get unit
        const getUnit = (modId) => {
            if (modId.startsWith('perf_gps')) return 's';
            if (modId.startsWith('perf_touch') || modId.startsWith('perf_key')) return 'ms';
            if (modId.startsWith('perf_slide_fps')) return 'Hz';
            if (modId.startsWith('perf_slide_drop')) return 'frames';
            if (modId.startsWith('stability')) return 'h';
            if (modId.startsWith('cr_')) return '';
            if (modId === 'integration') return '%';
            if (modId.startsWith('battery')) return 'mA';
            return '';
        };
        
        new Chart(ctx, {
            type: isBarChart ? 'bar' : 'line',
            data: {
                labels: filteredLabels,
                datasets: datasets
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: true,
                plugins: { 
                    legend: { 
                        position: 'bottom',
                        labels: {
                            maxWidth: 120,
                            font: {
                                family: "'Segoe UI', 'Arial', sans-serif",
                                size: 11
                            },
                            color: '#333333',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#333333',
                        bodyColor: '#666666',
                        borderColor: '#e0e0e0',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: {
                            family: "'Segoe UI', 'Arial', sans-serif",
                            size: 12,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: "'Segoe UI', 'Arial', sans-serif",
                            size: 11
                        },
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                if (value === null || value === undefined) return '';
                                const numValue = Number(value);
                                const formattedValue = numValue % 1 !== 0 ? numValue.toFixed(2) : numValue;
                                return `${label}: ${formattedValue}${getUnit(mod.id)}`;
                            }
                        }
                    },
                    datalabels: {
                        display: true,
                        anchor: isBarChart ? 'end' : 'top',
                        align: 'center',
                        color: '#333333',
                        font: {
                            family: "'Segoe UI', 'Arial', sans-serif",
                            size: 10,
                            weight: 'normal'
                        },
                        formatter: function(value) {
                            if (value === null || value === undefined || value === '') return '';
                            const numValue = Number(value);
                            const formattedValue = numValue % 1 !== 0 ? numValue.toFixed(2) : numValue;
                            return `${formattedValue}${getUnit(mod.id)}`;
                        },
                        backgroundColor: 'transparent',
                        padding: 2,
                        borderRadius: 0
                    }
                },
                scales: { 
                    y: { 
                        beginAtZero: minValue === 0,
                        min: minValue,
                        max: maxValue,
                        grid: {
                            color: '#e8e8e8',
                            lineWidth: 1
                        },
                        ticks: {
                            stepSize: (maxValue - minValue) / 5,
                            font: {
                                family: "'Segoe UI', 'Arial', sans-serif",
                                size: 10
                            },
                            color: '#666666',
                            padding: 8
                        },
                        border: {
                            color: '#cccccc',
                            lineWidth: 1
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: "'Segoe UI', 'Arial', sans-serif",
                                size: 10
                            },
                            color: '#666666',
                            padding: 8
                        },
                        border: {
                            color: '#cccccc',
                            lineWidth: 1
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    });
}

function renderAchievementRates(project, data) {
    const container = document.getElementById('achievement-rates');
    const latestData = data[data.length - 1];

    let html = '<div class="achievement-grid">';

    ALL_METRICS.forEach(mod => {
        const target = project.targets[mod.id];
        const actual = latestData[mod.id];
        const rate = Math.round((actual / target) * 100);
        const rateClass = rate >= 100 ? 'high' : rate >= 80 ? 'medium' : 'low';

        html += `
            <div class="achievement-item">
                <div class="label">${mod.name}</div>
                <div class="rate ${rateClass}">${rate}%</div>
                <div style="font-size:0.8rem;color:#666;">${actual} / ${target}</div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function getModuleColor(moduleId, alpha) {
    const colors = {
        battery_20hz_typical: `rgba(255, 99, 132, ${alpha})`,
        battery_20hz_heavy: `rgba(244, 67, 54, ${alpha})`,
        battery_20hz_aod: `rgba(229, 57, 53, ${alpha})`,
        battery_100hz_typical: `rgba(54, 162, 235, ${alpha})`,
        battery_100hz_heavy: `rgba(33, 150, 243, ${alpha})`,
        battery_100hz_aod: `rgba(25, 118, 210, ${alpha})`,
        perf_gps_cold: `rgba(255, 206, 86, ${alpha})`,
        perf_gps_hot: `rgba(255, 193, 7, ${alpha})`,
        perf_touch_response: `rgba(255, 152, 0, ${alpha})`,
        perf_key_response: `rgba(255, 140, 0, ${alpha})`,
        perf_slide_fps: `rgba(255, 127, 0, ${alpha})`,
        perf_slide_drop: `rgba(255, 111, 0, ${alpha})`,
        integration: `rgba(75, 192, 192, ${alpha})`,
        stability: `rgba(153, 102, 255, ${alpha})`,
        algorithm: `rgba(255, 159, 64, ${alpha})`
    };
    return colors[moduleId] || `rgba(100, 100, 100, ${alpha})`;
}

// Health Data Functions
function loadHealthData() {
    const projectId = document.getElementById('health-project').value;
    const date = document.getElementById('health-date').value || new Date().toISOString().split('T')[0];
    const container = document.getElementById('health-data-list');
    const emptyState = document.getElementById('empty-health-data');
    
    if (!projectId) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        clearHealthStats();
        return;
    }
    
    emptyState.style.display = 'none';
    
    const projectHealthData = healthData.filter(d => d.projectId === projectId)
                                       .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (projectHealthData.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        clearHealthStats();
        return;
    }
    
    const todayData = projectHealthData.find(d => d.date === date);
    updateHealthStats(todayData);
    
    container.innerHTML = projectHealthData.map(data => `
        <div class="health-card">
            <div class="health-date">${data.date}</div>
            <div class="health-content">
                <div class="health-row">
                    <span class="health-label">❤️ Heart Rate</span>
                    <span class="health-value">${data.heartRate || '--'} bpm</span>
                </div>
                <div class="health-row">
                    <span class="health-label">🩸 Blood Pressure</span>
                    <span class="health-value">${data.systolic || '--'}/${data.diastolic || '--'} mmHg</span>
                </div>
                <div class="health-row">
                    <span class="health-label">😰 Stress</span>
                    <span class="health-value">${data.stress || '--'}%</span>
                </div>
                <div class="health-row">
                    <span class="health-label">😴 Sleep</span>
                    <span class="health-value">${data.sleep || '--'} h</span>
                </div>
                <div class="health-row">
                    <span class="health-label">🏃 Exercise</span>
                    <span class="health-value">${data.exercise || '--'} min</span>
                </div>
            </div>
            <div class="health-actions">
                <button class="btn btn-sm" onclick="deleteHealthData('${data.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function updateHealthStats(data) {
    if (!data) {
        clearHealthStats();
        return;
    }
    
    document.getElementById('health-heartrate').textContent = data.heartRate || '--';
    document.getElementById('health-bp').textContent = (data.systolic && data.diastolic) ? `${data.systolic}/${data.diastolic}` : '--';
    document.getElementById('health-stress').textContent = data.stress || '--';
    document.getElementById('health-sleep').textContent = data.sleep || '--';
    document.getElementById('health-exercise').textContent = data.exercise || '--';
}

function clearHealthStats() {
    document.getElementById('health-heartrate').textContent = '--';
    document.getElementById('health-bp').textContent = '--';
    document.getElementById('health-stress').textContent = '--';
    document.getElementById('health-sleep').textContent = '--';
    document.getElementById('health-exercise').textContent = '--';
}

function showAddHealthModal() {
    const projectId = document.getElementById('health-project').value;
    if (!projectId) {
        alert('Please select a project first');
        return;
    }
    document.getElementById('health-date-input').value = new Date().toISOString().split('T')[0];
    document.getElementById('health-heartrate-input').value = '';
    document.getElementById('health-systolic').value = '';
    document.getElementById('health-diastolic').value = '';
    document.getElementById('health-stress-input').value = '';
    document.getElementById('health-sleep-input').value = '';
    document.getElementById('health-exercise-input').value = '';
    document.getElementById('add-health-modal').style.display = 'flex';
}

function addHealthData() {
    const projectId = document.getElementById('health-project').value;
    const date = document.getElementById('health-date-input').value;
    const heartRate = parseInt(document.getElementById('health-heartrate-input').value) || null;
    const systolic = parseInt(document.getElementById('health-systolic').value) || null;
    const diastolic = parseInt(document.getElementById('health-diastolic').value) || null;
    const stress = parseInt(document.getElementById('health-stress-input').value) || null;
    const sleep = parseFloat(document.getElementById('health-sleep-input').value) || null;
    const exercise = parseInt(document.getElementById('health-exercise-input').value) || null;
    
    if (!date) {
        alert('Please fill in the date');
        return;
    }
    
    const existingIndex = healthData.findIndex(d => d.projectId === projectId && d.date === date);
    
    const healthRecord = {
        id: Date.now().toString(),
        projectId: projectId,
        date: date,
        heartRate: heartRate,
        systolic: systolic,
        diastolic: diastolic,
        stress: stress,
        sleep: sleep,
        exercise: exercise,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    if (existingIndex >= 0) {
        healthData[existingIndex] = healthRecord;
    } else {
        healthData.push(healthRecord);
    }
    
    saveHealthData();
    loadHealthData();
    closeModal('add-health-modal');
    alert('Health data added successfully!');
}

function deleteHealthData(id) {
    if (confirm('Are you sure you want to delete this health data?')) {
        healthData = healthData.filter(d => d.id !== id);
        saveHealthData();
        loadHealthData();
        alert('Health data deleted successfully!');
    }
}

function saveHealthData() {
    localStorage.setItem(STORAGE_KEYS.HEALTH_DATA, JSON.stringify(healthData));
}

function loadHealthDataFromStorage() {
    healthData = JSON.parse(localStorage.getItem(STORAGE_KEYS.HEALTH_DATA) || '[]');
}

function importFeishuHealthData() {
    document.getElementById('feishu-url').value = '';
    document.getElementById('feishu-import-modal').style.display = 'flex';
}

async function doFeishuImport() {
    const url = document.getElementById('feishu-url').value.trim();
    const projectId = document.getElementById('health-project').value;
    
    if (!url) {
        alert('Please enter Feishu document URL');
        return;
    }
    
    if (!projectId) {
        alert('Please select a project first');
        return;
    }
    
    try {
        alert('Importing data...');
        
        const mockData = generateMockHealthData(projectId);
        healthData = [...healthData.filter(d => d.projectId !== projectId), ...mockData];
        saveHealthData();
        loadHealthData();
        
        closeModal('feishu-import-modal');
        alert('Feishu document data imported successfully!');
    } catch (error) {
        console.error('Import failed:', error);
        alert('Import failed. Please check the URL or try again later');
    }
}

function generateMockHealthData(projectId) {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        data.push({
            id: Date.now().toString() + i,
            projectId: projectId,
            date: dateStr,
            heartRate: Math.floor(Math.random() * 30) + 60,
            systolic: Math.floor(Math.random() * 20) + 110,
            diastolic: Math.floor(Math.random() * 15) + 70,
            stress: Math.floor(Math.random() * 50) + 20,
            sleep: (Math.random() * 3 + 6).toFixed(1),
            exercise: Math.floor(Math.random() * 60),
            createdAt: new Date().toISOString().split('T')[0]
        });
    }
    
    return data;
}

// Dashboard Functions
let dashboardCharts = [];

function refreshDashboard() {
    clearDashboardCharts();
    renderDashboardSummary();
    renderDashboardCharts();
    renderDashboardTables();
}

function clearDashboardCharts() {
    dashboardCharts.forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    dashboardCharts = [];
}

function renderDashboardSummary() {
    const projectId = document.getElementById('dashboard-project').value;
    
    if (!projectId) {
        document.getElementById('total-projects').textContent = '0';
        document.getElementById('total-versions').textContent = '0';
        document.getElementById('completion-rate').textContent = '0%';
        document.getElementById('active-tasks').textContent = '0';
        return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Project Name
    document.getElementById('total-projects').textContent = project.name.length > 12 ? project.name.substring(0, 12) + '...' : project.name;
    
    // Total Versions for this project
    const versionPlans = JSON.parse(localStorage.getItem(STORAGE_KEYS.VERSION_PLANS) || '[]')
        .filter(v => v.projectId === projectId);
    document.getElementById('total-versions').textContent = versionPlans.length;
    
    // Project Completion Rate
    const projectRate = calculateProjectCompletionRate(projectId);
    document.getElementById('completion-rate').textContent = projectRate + '%';
    
    // Active Tasks for this project
    const devPlans = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEV_PLANS) || '[]')
        .filter(d => d.projectId === projectId && d.status === 'in-progress');
    document.getElementById('active-tasks').textContent = devPlans.length;
}

function calculateAverageCompletionRate() {
    if (projects.length === 0) return 0;
    
    let totalRate = 0;
    let count = 0;
    
    projects.forEach(project => {
        const projectData = actualData.filter(d => d.projectId === project.id);
        if (projectData.length > 0) {
            const latestData = projectData[projectData.length - 1];
            let achieved = 0;
            let total = 0;
            
            // Calculate achievement rate based on key metrics
            ['integration', 'stability', 'cr_blocker', 'cr_critical'].forEach(key => {
                const target = project.targets?.[key] || 0;
                const actual = parseFloat(latestData[key]) || 0;
                
                if (target > 0) {
                    total++;
                    // For stability (higher is better)
                    if (key === 'stability') {
                        achieved += actual >= target ? 1 : Math.min(actual / target, 1);
                    }
                    // For integration (higher is better)
                    else if (key === 'integration') {
                        achieved += Math.min(actual / 100, 1);
                    }
                    // For CR counts (lower is better)
                    else {
                        achieved += actual <= target ? 1 : Math.max(1 - (actual - target) / target, 0);
                    }
                }
            });
            
            if (total > 0) {
                totalRate += (achieved / total) * 100;
                count++;
            }
        }
    });
    
    return count > 0 ? Math.round(totalRate / count) : 0;
}

function calculateProjectCompletionRate(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return 0;
    
    const projectData = actualData.filter(d => d.projectId === projectId);
    if (projectData.length === 0) return 0;
    
    const latestData = projectData[projectData.length - 1];
    let achieved = 0;
    let total = 0;
    
    ['integration', 'stability', 'cr_blocker', 'cr_critical'].forEach(key => {
        const target = project.targets?.[key] || 0;
        const actual = parseFloat(latestData[key]) || 0;
        
        if (target > 0) {
            total++;
            if (key === 'stability') {
                achieved += actual >= target ? 1 : Math.min(actual / target, 1);
            } else if (key === 'integration') {
                achieved += Math.min(actual / 100, 1);
            } else {
                achieved += actual <= target ? 1 : Math.max(1 - (actual - target) / target, 0);
            }
        }
    });
    
    return total > 0 ? Math.round((achieved / total) * 100) : 0;
}

function renderDashboardCharts() {
    // Projects by Status Chart
    renderStatusChart();
    
    // Target Achievement Chart
    renderAchievementChart();
    
    // Data Entry Trend Chart
    renderEntryTrendChart();
    
    // CR Distribution Chart
    renderCRDistributionChart();
}

function renderStatusChart() {
    const projectId = document.getElementById('dashboard-project').value;
    
    const devPlans = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEV_PLANS) || '[]')
        .filter(d => d.projectId === projectId);
    
    const statusCounts = {
        'pending': 0,
        'in-progress': 0,
        'completed': 0,
        'blocked': 0
    };
    
    devPlans.forEach(plan => {
        if (statusCounts[plan.status] !== undefined) {
            statusCounts[plan.status]++;
        }
    });
    
    const ctx = document.getElementById('statusChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'In Progress', 'Completed', 'Blocked'],
            datasets: [{
                data: [statusCounts['pending'], statusCounts['in-progress'], statusCounts['completed'], statusCounts['blocked']],
                backgroundColor: [
                    'rgba(156, 163, 175, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: document.body.classList.contains('light-theme') ? '#475569' : '#94a3b8',
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
    
    dashboardCharts.push(chart);
}

function renderAchievementChart() {
    const projectId = document.getElementById('dashboard-project').value;
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    const projectData = actualData.filter(d => d.projectId === projectId);
    const achievementData = [];
    
    if (projectData.length > 0) {
        const latestData = projectData[projectData.length - 1];
        
        ['integration', 'stability', 'cr_blocker', 'cr_critical'].forEach(key => {
            const target = project.targets?.[key] || 0;
            const actual = parseFloat(latestData[key]) || 0;
            
            if (target > 0) {
                let rate = 0;
                if (key === 'stability') {
                    rate = Math.round(Math.min(actual / target, 1) * 100);
                } else if (key === 'integration') {
                    rate = Math.round(Math.min(actual / 100, 1) * 100);
                } else {
                    rate = Math.round(Math.max(1 - (actual - target) / target, 0) * 100);
                }
                
                const label = key === 'integration' ? 'Feature Completion' :
                             key === 'stability' ? 'MTTF Duration' :
                             key === 'cr_blocker' ? 'Blocker CR' : 'Critical CR';
                
                achievementData.push({
                    name: label,
                    rate: rate
                });
            }
        });
    }
    
    const ctx = document.getElementById('achievementChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: achievementData.map(d => d.name),
            datasets: [{
                label: 'Achievement Rate (%)',
                data: achievementData.map(d => d.rate),
                backgroundColor: achievementData.map(d => 
                    d.rate >= 80 ? 'rgba(34, 197, 94, 0.7)' :
                    d.rate >= 50 ? 'rgba(251, 191, 36, 0.7)' :
                    'rgba(239, 68, 68, 0.7)'
                ),
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: document.body.classList.contains('light-theme') ? '#64748b' : '#94a3b8',
                        font: { family: 'Inter' },
                        callback: (value) => value + '%'
                    },
                    grid: {
                        color: document.body.classList.contains('light-theme') ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'
                    }
                },
                y: {
                    ticks: {
                        color: document.body.classList.contains('light-theme') ? '#475569' : '#e2e8f0',
                        font: { family: 'Inter', size: 11 }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    dashboardCharts.push(chart);
}

function renderEntryTrendChart() {
    const projectId = document.getElementById('dashboard-project').value;
    const period = document.getElementById('dashboard-period').value;
    
    let days = 7;
    if (period === '30d') days = 30;
    else if (period === '90d') days = 90;
    
    const dateCounts = {};
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dateCounts[dateStr] = 0;
    }
    
    const projectData = actualData.filter(d => d.projectId === projectId);
    projectData.forEach(data => {
        if (dateCounts[data.date] !== undefined) {
            dateCounts[data.date]++;
        }
    });
    
    const ctx = document.getElementById('entryTrendChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(dateCounts),
            datasets: [{
                label: 'Data Entries',
                data: Object.values(dateCounts),
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgba(99, 102, 241, 1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: document.body.classList.contains('light-theme') ? '#64748b' : '#94a3b8',
                        font: { family: 'Inter', size: 10 },
                        maxTicksLimit: 7
                    },
                    grid: {
                        color: document.body.classList.contains('light-theme') ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: document.body.classList.contains('light-theme') ? '#64748b' : '#94a3b8',
                        font: { family: 'Inter' }
                    },
                    grid: {
                        color: document.body.classList.contains('light-theme') ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'
                    }
                }
            }
        }
    });
    
    dashboardCharts.push(chart);
}

function renderCRDistributionChart() {
    const projectId = document.getElementById('dashboard-project').value;
    
    let totalBlocker = 0;
    let totalCritical = 0;
    
    const projectData = actualData.filter(d => d.projectId === projectId);
    
    // Only use the latest version data
    if (projectData.length > 0) {
        const latestData = projectData[projectData.length - 1];
        totalBlocker = parseInt(latestData.cr_blocker) || 0;
        totalCritical = parseInt(latestData.cr_critical) || 0;
    }
    
    const ctx = document.getElementById('crDistributionChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Blocker CR', 'Critical CR'],
            datasets: [{
                data: [totalBlocker, totalCritical],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(251, 191, 36, 0.8)'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: document.body.classList.contains('light-theme') ? '#475569' : '#94a3b8',
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                }
            }
        }
    });
    
    dashboardCharts.push(chart);
}

function renderDashboardTables() {
    renderTopProjectsTable();
    renderRecentEntriesTable();
}

function renderTopProjectsTable() {
    const projectId = document.getElementById('dashboard-project').value;
    const tableBody = document.getElementById('top-projects-table');
    
    if (!projectId) {
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Please select a project first</td></tr>';
        return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Project not found</td></tr>';
        return;
    }
    
    const projectData = actualData.filter(d => d.projectId === projectId);
    const projectVersions = JSON.parse(localStorage.getItem(STORAGE_KEYS.VERSION_PLANS) || '[]')
        .filter(v => v.projectId === projectId);
    
    if (projectData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No data available for this project</td></tr>';
        return;
    }
    
    const latestData = projectData[projectData.length - 1];
    let achieved = 0;
    let total = 0;
    
    ['integration', 'stability', 'cr_blocker', 'cr_critical'].forEach(key => {
        const target = project.targets?.[key] || 0;
        const actual = parseFloat(latestData[key]) || 0;
        
        if (target > 0) {
            total++;
            if (key === 'stability') {
                achieved += actual >= target ? 1 : Math.min(actual / target, 1);
            } else if (key === 'integration') {
                achieved += Math.min(actual / 100, 1);
            } else {
                achieved += actual <= target ? 1 : Math.max(1 - (actual - target) / target, 0);
            }
        }
    });
    
    const rate = total > 0 ? Math.round((achieved / total) * 100) : 0;
    
    tableBody.innerHTML = `
        <tr>
            <td>${project.name}</td>
            <td><span style="color: ${rate >= 80 ? '#22c55e' : rate >= 50 ? '#f59e0b' : '#ef4444'}">${rate}%</span></td>
            <td>${projectVersions.length}</td>
        </tr>
    `;
}

function renderRecentEntriesTable() {
    const projectId = document.getElementById('dashboard-project').value;
    const tableBody = document.getElementById('recent-entries-table');
    
    if (!projectId) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Please select a project first</td></tr>';
        return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Project not found</td></tr>';
        return;
    }
    
    const projectData = actualData.filter(d => d.projectId === projectId);
    
    const entries = projectData.map(data => ({
        date: data.date,
        projectName: project.name,
        version: data.version || '-',
        type: 'Data Entry'
    }));
    
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tableBody.innerHTML = entries.slice(0, 5).map(e => `
        <tr>
            <td>${e.date}</td>
            <td>${e.projectName}</td>
            <td>${e.version}</td>
            <td>${e.type}</td>
        </tr>
    `).join('');
    
    if (entries.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No data entries available for this project</td></tr>';
    }
}

// Initialize dashboard when the tab is shown
async function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabId).style.display = 'block';
    
    // Add active class to selected tab
    event.target.classList.add('active');
    
    // Refresh dashboard when it's shown
    if (tabId === 'dashboard') {
        updateDashboardProjectSelect();
        refreshDashboard();
    }
    
    // Update AI project select when AI Assistant tab is shown
    if (tabId === 'ai-assistant') {
        updateAIProjectSelect();
        initializeAILanguage();
    }
    
    // Check Feishu auth status when Feishu Docs tab is shown
    if (tabId === 'feishu-docs') {
        const authData = await checkFeishuAuth();
        if (authData.loggedIn) {
            updateFeishuUILoggedIn(authData.user);
        } else {
            // Show login button
            const userInfo = document.getElementById('feishu-user-info');
            const loginBtn = document.getElementById('feishu-login-btn');
            const logoutBtn = document.getElementById('feishu-logout-btn');
            const docBrowser = document.getElementById('feishu-doc-browser');
            const notLoggedIn = document.getElementById('feishu-not-logged-in');
            
            if (userInfo && loginBtn && logoutBtn && docBrowser && notLoggedIn) {
                userInfo.style.display = 'none';
                loginBtn.style.display = 'inline';
                logoutBtn.style.display = 'none';
                docBrowser.style.display = 'none';
                notLoggedIn.style.display = 'block';
            }
        }
    }
}

function updateDashboardProjectSelect() {
    const select = document.getElementById('dashboard-project');
    select.innerHTML = '<option value="">Please select a project</option>';
    
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        select.appendChild(option);
    });
}

// AI Assistant Functions
let currentAILanguage = localStorage.getItem('aiLanguage') || 'en';

function updateAIProjectSelect() {
    const select = document.getElementById('ai-project');
    const placeholderOption = currentAILanguage === 'zh' ? '请选择一个项目' : 'Please select a project';
    select.innerHTML = `<option value="">${placeholderOption}</option>`;
    
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        select.appendChild(option);
    });
}

function switchAILanguage(lang) {
    currentAILanguage = lang;
    localStorage.setItem('aiLanguage', lang);
    
    // Update button states
    document.getElementById('ai-lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('ai-lang-zh').classList.toggle('active', lang === 'zh');
    
    // Update UI text
    updateAITexts();
}

function updateAITexts() {
    const isZh = currentAILanguage === 'zh';
    
    // Update descriptions
    document.getElementById('ai-description').textContent = isZh ? '让AI分析您的项目数据并提供洞察' : 'Let AI analyze your project data and provide insights';
    
    // Update labels
    document.getElementById('ai-project-label').textContent = isZh ? '选择项目：' : 'Select Project:';
    document.getElementById('ai-prompt-label').textContent = isZh ? '输入您的问题或请求：' : 'Enter your question or request:';
    
    // Update textarea placeholder
    const textarea = document.getElementById('ai-prompt');
    const placeholder = isZh ? textarea.dataset.placeholderZh : textarea.dataset.placeholderEn;
    textarea.placeholder = placeholder;
    
    // Update buttons
    document.getElementById('ai-generate-btn').textContent = isZh ? '生成分析' : 'Generate Analysis';
    document.getElementById('ai-clear-btn').textContent = isZh ? '清除' : 'Clear';
    
    // Update loading text
    document.getElementById('ai-loading-text').textContent = isZh ? 'AI正在分析您的项目数据...' : 'AI is analyzing your project data...';
    
    // Update response title
    document.getElementById('ai-response-title').textContent = isZh ? 'AI分析结果' : 'AI Analysis Result';
    
    // Update project select placeholder
    const select = document.getElementById('ai-project');
    if (select.options.length > 0) {
        select.options[0].textContent = isZh ? '请选择一个项目' : 'Please select a project';
    }
}

async function generateAIResponse() {
    const projectId = document.getElementById('ai-project').value;
    const prompt = document.getElementById('ai-prompt').value;
    const isZh = currentAILanguage === 'zh';
    
    if (!projectId) {
        alert(isZh ? '请先选择一个项目' : 'Please select a project first');
        return;
    }
    
    if (!prompt.trim()) {
        alert(isZh ? '请输入您的问题或请求' : 'Please enter your question or request');
        return;
    }
    
    // Show loading
    document.getElementById('ai-loading').style.display = 'block';
    document.getElementById('ai-response').style.display = 'none';
    
    // Get project data
    const project = projects.find(p => p.id === projectId);
    const projectData = actualData.filter(d => d.projectId === projectId);
    const devPlans = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEV_PLANS) || '[]')
        .filter(d => d.projectId === projectId);
    const versionPlans = JSON.parse(localStorage.getItem(STORAGE_KEYS.VERSION_PLANS) || '[]')
        .filter(v => v.projectId === projectId);
    
    // Prepare data for AI
    const projectInfo = {
        projectName: project.name,
        description: project.description,
        targets: project.targets,
        latestData: projectData.length > 0 ? projectData[projectData.length - 1] : null,
        totalDataEntries: projectData.length,
        devPlanCount: devPlans.length,
        activeTasks: devPlans.filter(d => d.status === 'in-progress').length,
        completedTasks: devPlans.filter(d => d.status === 'completed').length,
        versionCount: versionPlans.length
    };
    
    // Generate AI response
    const response = await generateSimulatedAIResponse(projectInfo, prompt, isZh);
    
    // Hide loading and show response
    document.getElementById('ai-loading').style.display = 'none';
    document.getElementById('ai-response-content').textContent = response;
    document.getElementById('ai-response').style.display = 'block';
}

async function generateSimulatedAIResponse(projectInfo, userPrompt, isZh = false) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate simulated AI response based on project data
    const { projectName, latestData, targets, devPlanCount, activeTasks, completedTasks, totalDataEntries, versionCount } = projectInfo;
    
    const t = {
        title: isZh ? `## 项目分析：${projectName}` : `## Project Analysis: ${projectName}`,
        basicInfo: isZh ? '### 基本信息' : '### Basic Information',
        totalTasks: isZh ? '总任务数' : 'Total Tasks',
        activeTasks: isZh ? '进行中任务' : 'Active Tasks',
        completedTasks: isZh ? '已完成任务' : 'Completed Tasks',
        completionRate: isZh ? '完成率' : 'Completion Rate',
        dataEntries: isZh ? '数据条目数' : 'Data Entries',
        versions: isZh ? '版本数' : 'Versions',
        metricsAnalysis: isZh ? '### 当前指标分析' : '### Current Metrics Analysis',
        integrationRate: isZh ? '功能集成率' : 'Feature Integration Rate',
        mtbfDuration: isZh ? 'MTTF持续时间' : 'MTTF Duration',
        blockerCR: isZh ? 'Blocker CR数量' : 'Blocker CR Count',
        criticalCR: isZh ? 'Critical CR数量' : 'Critical CR Count',
        target: isZh ? '目标' : 'Target',
        actual: isZh ? '实际' : 'Actual',
        achieved: isZh ? '已达成' : 'Achieved',
        notAchieved: isZh ? '未达成' : 'Not Achieved',
        aiAnalysis: isZh ? '### AI分析与建议' : '### AI Analysis & Recommendations',
        summary: isZh ? '根据当前数据，以下是您的项目总结：' : "Based on the current data, here's a summary of your project:",
        overallHealth: isZh ? '整体健康状况' : 'Overall Health',
        good: isZh ? '良好' : 'Good',
        needsAttention: isZh ? '需要关注' : 'Needs Attention',
        strengths: isZh ? '优势' : 'Strengths',
        completedSuccessfully: isZh ? '任务已成功完成' : 'tasks have been completed successfully',
        stabilityTracked: isZh ? '稳定性指标正在跟踪中' : 'Stability metrics are being tracked',
        improvement: isZh ? '改进空间' : 'Areas for Improvement',
        moreInProgress: isZh ? '进行中的任务多于已完成 - 建议优先处理' : 'More tasks are in progress than completed - consider prioritization',
        blockerAttention: isZh ? 'Blocker CR需要关注' : 'blocker CRs that need attention',
        issues: isZh ? '### 发现的问题' : '### Identified Issues',
        tooManyTasks: isZh ? '同时进行太多任务，可能导致资源紧张' : 'Too many tasks are in progress simultaneously, which may lead to resource constraints',
        blockerDetected: isZh ? '检测到Blocker CR - 应立即解决以解除阻塞' : 'Blocker CRs detected - these should be resolved immediately to unblock progress',
        criticalExceeds: isZh ? 'Critical CR数量超过目标' : 'Critical CR count exceeds target',
        noData: isZh ? '未找到该项目的数据条目 - 建议添加基准指标' : 'No data entries found for this project - consider adding baseline metrics',
        noIssues: isZh ? '✅ 未检测到重大问题，您的项目运行良好！' : '✅ No major issues detected. Your project is in good health!',
        recommendations: isZh ? '### 改进建议' : '### Recommendations for Improvement',
        limitWIP: isZh ? '建议限制进行中的工作以提高专注度并减少上下文切换' : 'Consider limiting work in progress to improve focus and reduce context switching',
        resolveBlocker: isZh ? '优先解决Blocker CR以保持开发速度' : 'Prioritize resolving Blocker CRs to maintain development velocity',
        increaseIntegration: isZh ? '专注于提高功能集成率以达到目标' : 'Focus on increasing feature integration rate to meet your target',
        improveStability: isZh ? '调查稳定性改进措施以达到MTTF目标' : 'Investigate stability improvements to meet MTTF targets',
        regularEntry: isZh ? '定期数据录入是跟踪进度的关键 - 建议每周更新' : 'Regular data entry is key to tracking progress - aim for weekly updates',
        completionAnalysis: isZh ? '### 完成率分析' : '### Completion Rate Analysis',
        taskCompletionRate: isZh ? '任务完成率' : 'Task Completion Rate',
        excellent: isZh ? '✅ 优秀！您的项目完成率很高' : '✅ Excellent! Your project has a high completion rate',
        goodProgress: isZh ? '⚠️ 进展良好！建议审查进行中的任务以保持动力' : '⚠️ Good progress! Consider reviewing active tasks to maintain momentum',
        considerPrioritize: isZh ? '📊 建议优先处理任务并审查项目范围' : '📊 Consider prioritizing tasks and reviewing project scope',
        basedOnRequest: isZh ? '根据您的请求，以下是我的分析：' : "Based on your request, here's my analysis:",
        currentlyHas: isZh ? '当前拥有' : 'currently has',
        withCompleted: isZh ? '已完成' : 'completed',
        inProgress: isZh ? '进行中' : 'in progress',
        latestMetrics: isZh ? '最新指标' : 'Latest Metrics',
        keyRecommendations: isZh ? '关键建议' : 'Key Recommendations',
        trackRegularly: isZh ? '继续定期跟踪指标以监控进度' : 'Continue tracking metrics regularly to monitor progress',
        addressBlocker: isZh ? '及时处理Blocker CR以保持开发效率' : 'Address any blocker CRs promptly to maintain velocity',
        reviewDistribution: isZh ? '审查任务分配以确保工作负载平衡' : 'Review task distribution to ensure balanced workload',
        footer: isZh ? '*此分析由AI根据您的项目数据生成*' : '*This analysis is generated by AI based on your project data.*',
        dataQuality: isZh ? '### 数据质量分析' : '### Data Quality Analysis',
        sufficientData: isZh ? '数据录入充足，可以进行有效分析' : 'Sufficient data entries for effective analysis',
        insufficientData: isZh ? '数据录入不足，建议增加数据点以提高分析准确性' : 'Insufficient data entries. Consider adding more data points for better analysis accuracy',
        versionTracking: isZh ? '版本跟踪良好，可以追踪项目进展' : 'Good version tracking, project progress can be monitored',
        noVersionTracking: isZh ? '缺少版本跟踪数据，建议为每个版本记录指标' : 'Missing version tracking data. Consider recording metrics for each version',
        riskAnalysis: isZh ? '### 风险分析' : '### Risk Analysis',
        lowRisk: isZh ? '🟢 低风险：项目运行平稳，各项指标正常' : '🟢 Low Risk: Project running smoothly, all metrics normal',
        mediumRisk: isZh ? '🟡 中风险：存在一些需要关注的问题' : '🟡 Medium Risk: Some issues need attention',
        highRisk: isZh ? '🔴 高风险：项目面临重大挑战，需要立即采取行动' : '🔴 High Risk: Project facing major challenges, immediate action required',
        performanceAnalysis: isZh ? '### 性能分析' : '### Performance Analysis',
        performanceGood: isZh ? '性能指标表现良好，达到预期目标' : 'Performance metrics are good, meeting expected targets',
        performanceNeedsImprovement: isZh ? '性能指标需要改进，建议优化相关功能' : 'Performance metrics need improvement, consider optimizing related features',
        generalAnalysis: isZh ? '### 综合分析' : '### Comprehensive Analysis',
        projectStatus: isZh ? '项目状态' : 'Project Status',
        nextSteps: isZh ? '下一步行动' : 'Next Steps',
        focusOnHighPriority: isZh ? '专注于高优先级任务' : 'Focus on high-priority tasks',
        monitorMetrics: isZh ? '持续监控关键指标' : 'Continuously monitor key metrics',
        improveDataQuality: isZh ? '提高数据录入质量' : 'Improve data entry quality',
        
        // New intent-specific translations
        whyAnalysis: isZh ? '### 🤔 原因分析' : '### 🤔 Root Cause Analysis',
        whyNoData: isZh ? '暂无项目数据，无法进行原因分析。请先添加项目数据。' : 'No project data available for root cause analysis. Please add project data first.',
        whyIntegrationLow: isZh ? '功能集成率未达目标可能是因为：功能开发进度滞后、集成测试未完成、依赖模块尚未就绪。' : 'Feature integration rate below target may be caused by: delayed feature development, incomplete integration testing, or pending dependency modules.',
        whyStabilityLow: isZh ? 'MTTF稳定性未达目标可能是因为：存在内存泄漏、并发处理问题、硬件兼容性问题或代码质量问题。' : 'MTTF stability below target may be caused by: memory leaks, concurrency issues, hardware compatibility problems, or code quality issues.',
        whyBlockerExists: isZh ? 'Blocker CR存在可能是因为：关键功能存在严重缺陷、影响核心流程、需要立即修复才能继续开发。' : 'Blocker CRs exist because: critical functionality has severe defects, core workflows are impacted, immediate fixes are required to continue development.',
        whyMoreActive: isZh ? '进行中任务多于已完成任务可能是因为：任务分配不均衡、部分任务阻塞、团队资源不足或任务优先级需要调整。' : 'More active tasks than completed ones may be caused by: unbalanced task distribution, blocked tasks, insufficient team resources, or needing priority adjustment.',
        whyAllGood: isZh ? '🎉 各项指标均已达到或超过目标，项目运行良好！' : '🎉 All metrics meet or exceed targets. Project is running well!',
        
        howAnalysis: isZh ? '### 🔧 操作建议' : '### 🔧 Action Recommendations',
        howNoData: isZh ? '暂无项目数据，无法提供操作建议。请先添加项目数据。' : 'No project data available for action recommendations. Please add project data first.',
        howImproveIntegration: isZh ? '**提高功能集成率**：优先完成剩余功能开发，加强集成测试，及时解决依赖问题。' : '**Improve Feature Integration**: Prioritize completing remaining feature development, enhance integration testing, and resolve dependency issues promptly.',
        howImproveStability: isZh ? '**提高稳定性**：进行性能测试和压力测试，分析内存使用情况，修复内存泄漏问题。' : '**Improve Stability**: Conduct performance and stress testing, analyze memory usage, and fix memory leaks.',
        howResolveBlocker: isZh ? '**解决Blocker CR**：立即组织团队分析问题，分配专人处理，设定修复时限。' : '**Resolve Blocker CRs**: Immediately organize the team to analyze issues, assign dedicated resources, and set fix deadlines.',
        howManageTasks: isZh ? '**任务管理**：审查任务优先级，限制并行任务数量，确保资源合理分配。' : '**Task Management**: Review task priorities, limit concurrent tasks, and ensure proper resource allocation.',
        howRegularUpdate: isZh ? '**定期更新**：每周更新项目数据，跟踪指标变化，及时发现问题。' : '**Regular Updates**: Update project data weekly, track metric changes, and detect issues promptly.',
        
        whatAnalysis: isZh ? '### 📋 信息查询' : '### 📋 Information Query',
        whatLatestMetrics: isZh ? '最新指标' : 'Latest Metrics',
        whatTasks: isZh ? '任务概览' : 'Task Overview',
        whatCompletionRate: isZh ? '任务完成率' : 'Task Completion Rate',
        
        metric: isZh ? '指标' : 'Metric',
        status: isZh ? '状态' : 'Status',
        pass: isZh ? '✅ 通过' : '✅ Pass',
        fail: isZh ? '❌ 失败' : '❌ Fail',
        
        trendAnalysis: isZh ? '### 📈 趋势分析' : '### 📈 Trend Analysis',
        trendInsufficientData: isZh ? '数据点不足，无法进行趋势分析。建议至少添加2个数据条目。' : 'Insufficient data points for trend analysis. At least 2 data entries are recommended.',
        trendBasedOnHistory: isZh ? '根据历史数据趋势分析：' : 'Based on historical data trend analysis:',
        trendDataPoints: isZh ? '数据点数量' : 'Number of Data Points',
        trendIntegrationGood: isZh ? '功能集成率趋势良好，接近目标值' : 'Feature integration rate trend is good, approaching target',
        trendIntegrationNeedsWork: isZh ? '功能集成率需要提升，建议加快开发进度' : 'Feature integration rate needs improvement, consider accelerating development',
        trendStabilityGood: isZh ? '稳定性趋势良好，指标正常' : 'Stability trend is good, metrics are normal',
        trendStabilityNeedsWork: isZh ? '稳定性需要改进，建议进行性能优化' : 'Stability needs improvement, consider performance optimization',
        
        forecastAnalysis: isZh ? '### 🔮 预测分析' : '### 🔮 Forecast Analysis',
        forecastOnTrack: isZh ? '✅ 项目进展顺利，预计能按时完成目标。' : '✅ Project is on track, expected to meet targets on time.',
        forecastNeedsEffort: isZh ? '⚠️ 项目需要增加投入才能按时完成。建议优化资源分配。' : '⚠️ Additional effort is needed to complete on time. Consider optimizing resource allocation.',
        forecastAtRisk: isZh ? '🔴 项目进度落后，存在延期风险。建议立即审查并调整计划。' : '🔴 Project is behind schedule, at risk of delay. Immediate review and plan adjustment recommended.',
        forecastRecommendations: isZh ? '预测建议' : 'Forecast Recommendations',
        forecastMonitorProgress: isZh ? '密切监控项目进度，及时发现偏差' : 'Monitor project progress closely, detect deviations promptly',
        forecastPrioritizeTasks: isZh ? '优先处理高优先级任务，确保关键路径畅通' : 'Prioritize high-priority tasks, ensure critical path is clear',
        forecastAdjustPlan: isZh ? '根据实际情况调整计划，必要时寻求额外资源' : 'Adjust plan based on actual situation, seek additional resources if needed',
        
        comparisonAnalysis: isZh ? '### ⚖️ 对比分析' : '### ⚖️ Comparison Analysis',
        comparisonNoData: isZh ? '暂无足够数据进行对比分析。' : 'Insufficient data for comparison analysis.',
        comparisonTargetVsActual: isZh ? '目标值与实际值对比' : 'Target vs Actual Comparison',
        gap: isZh ? '差距' : 'Gap',
        meetsTarget: isZh ? '✅ 达标' : '✅ Met'
    };
    
    let analysis = `${t.title}\n\n`;
    
    // Basic project info
    analysis += `${t.basicInfo}\n`;
    analysis += `- **${t.totalTasks}**: ${devPlanCount}\n`;
    analysis += `- **${t.activeTasks}**: ${activeTasks}\n`;
    analysis += `- **${t.completedTasks}**: ${completedTasks}\n`;
    analysis += `- **${t.completionRate}**: ${devPlanCount > 0 ? Math.round((completedTasks / devPlanCount) * 100) : 0}%\n`;
    analysis += `- **${t.dataEntries}**: ${totalDataEntries}\n`;
    analysis += `- **${t.versions}**: ${versionCount}\n\n`;
    
    // Data metrics analysis
    if (latestData) {
        analysis += `${t.metricsAnalysis}\n`;
        
        if (targets) {
            const metrics = [
                { key: 'integration', label: t.integrationRate, target: targets.integration, actual: latestData.integration, higherBetter: true },
                { key: 'stability', label: t.mtbfDuration, target: targets.stability, actual: latestData.stability, higherBetter: true },
                { key: 'cr_blocker', label: t.blockerCR, target: targets.cr_blocker, actual: latestData.cr_blocker, higherBetter: false },
                { key: 'cr_critical', label: t.criticalCR, target: targets.cr_critical, actual: latestData.cr_critical, higherBetter: false }
            ];
            
            metrics.forEach(metric => {
                const target = parseFloat(metric.target);
                const actual = parseFloat(metric.actual);
                
                if (target && actual) {
                    let status = '⚠️';
                    let achieved = false;
                    
                    if (metric.higherBetter) {
                        achieved = actual >= target;
                        status = achieved ? '✅' : '⚠️';
                    } else {
                        achieved = actual <= target;
                        status = achieved ? '✅' : '⚠️';
                    }
                    
                    analysis += `${status} **${metric.label}**: ${t.target}=${target}, ${t.actual}=${actual} (${achieved ? t.achieved : t.notAchieved})\n`;
                }
            });
        }
        analysis += '\n';
    }
    
    // Advanced intent recognition with weighted keyword matching
    const promptLower = userPrompt.toLowerCase();
    
    // Intent categories with keywords and weights
    const intentPatterns = {
        summarize: {
            keywords: ['总结', '概况', '概要', '整体', '总体', '状态', 'summary', 'overview', 'status', '报告', '汇报'],
            weight: 1
        },
        issue: {
            keywords: ['问题', 'issue', '风险', 'risk', '隐患', 'trouble', '异常', '错误', '失败', '故障'],
            weight: 1
        },
        improve: {
            keywords: ['改进', '建议', 'suggest', 'improve', '优化', 'optimize', '提升', 'enhance', 'better', '方案', '措施'],
            weight: 1
        },
        completion: {
            keywords: ['完成率', 'completion', 'rate', '进度', 'progress', '任务', 'task', '完成', 'percent'],
            weight: 1
        },
        data: {
            keywords: ['数据', 'data', '质量', 'quality', '录入', 'entry', '记录', 'record', '统计', '指标'],
            weight: 1
        },
        risk: {
            keywords: ['风险', 'risk', '危险', 'danger', '评估', 'assessment', '安全', '威胁'],
            weight: 1
        },
        performance: {
            keywords: ['性能', 'performance', '表现', '效果', 'effect', '效率', '速度'],
            weight: 1
        },
        metrics: {
            keywords: ['指标', 'metrics', '集成率', '稳定性', 'MTTF', 'CR', 'blocker', 'critical', '数据指标'],
            weight: 1
        },
        trend: {
            keywords: ['趋势', 'trend', '变化', 'history', '历史', '对比', 'compare', '增长', '下降'],
            weight: 1
        },
        forecast: {
            keywords: ['预测', 'forecast', '预估', '预计', '未来', 'next', '下一步'],
            weight: 1
        },
        comparison: {
            keywords: ['对比', 'compare', '比较', 'vs', '差异', '区别'],
            weight: 1
        },
        why: {
            keywords: ['为什么', 'why', '原因', 'reason', '因为', '为何'],
            weight: 1.5
        },
        how: {
            keywords: ['怎么', 'how', '如何', '方法', '步骤', '做法'],
            weight: 1.5
        },
        what: {
            keywords: ['什么', 'what', '哪些', '哪一个', '哪类'],
            weight: 1.5
        },
        general: {
            keywords: ['分析', 'analyze', '帮助', 'help', '指导', 'guide', '建议', 'advice'],
            weight: 0.5
        }
    };
    
    // Calculate intent scores
    const intentScores = {};
    Object.keys(intentPatterns).forEach(intent => {
        intentScores[intent] = intentPatterns[intent].keywords
            .filter(keyword => promptLower.includes(keyword))
            .length * intentPatterns[intent].weight;
    });
    
    // Get top intents
    const sortedIntents = Object.entries(intentScores)
        .filter(([, score]) => score > 0)
        .sort((a, b) => b[1] - a[1]);
    
    const topIntent = sortedIntents.length > 0 ? sortedIntents[0][0] : 'general';
    const secondaryIntents = sortedIntents.slice(1).map(([intent]) => intent);
    
    // Set flags for intent matching
    const isSummarize = topIntent === 'summarize' || secondaryIntents.includes('summarize');
    const isIssue = topIntent === 'issue' || secondaryIntents.includes('issue');
    const isImprove = topIntent === 'improve' || secondaryIntents.includes('improve');
    const isCompletion = topIntent === 'completion' || secondaryIntents.includes('completion');
    const isData = topIntent === 'data' || secondaryIntents.includes('data');
    const isRisk = topIntent === 'risk' || secondaryIntents.includes('risk');
    const isPerformance = topIntent === 'performance' || secondaryIntents.includes('performance');
    const isMetrics = topIntent === 'metrics' || secondaryIntents.includes('metrics');
    const isTrend = topIntent === 'trend' || secondaryIntents.includes('trend');
    const isForecast = topIntent === 'forecast' || secondaryIntents.includes('forecast');
    const isComparison = topIntent === 'comparison' || secondaryIntents.includes('comparison');
    const isWhy = topIntent === 'why';
    const isHow = topIntent === 'how';
    const isWhat = topIntent === 'what';
    const isGeneral = topIntent === 'general' && sortedIntents.length === 0;
    
    // Custom analysis based on user prompt
    analysis += `${t.aiAnalysis}\n\n`;
    
    // Handle WHY questions with higher priority
    if (isWhy) {
        analysis += `${t.whyAnalysis}\n\n`;
        
        if (!latestData) {
            analysis += t.whyNoData;
        } else {
            const whyAnalysisItems = [];
            
            if (targets && parseFloat(latestData.integration) < parseFloat(targets.integration)) {
                whyAnalysisItems.push(t.whyIntegrationLow);
            }
            if (targets && parseFloat(latestData.stability) < parseFloat(targets.stability)) {
                whyAnalysisItems.push(t.whyStabilityLow);
            }
            if (parseFloat(latestData.cr_blocker) > 0) {
                whyAnalysisItems.push(t.whyBlockerExists);
            }
            if (activeTasks > completedTasks) {
                whyAnalysisItems.push(t.whyMoreActive);
            }
            
            if (whyAnalysisItems.length === 0) {
                analysis += t.whyAllGood;
            } else {
                whyAnalysisItems.forEach((item, index) => {
                    analysis += `${index + 1}. ${item}\n`;
                });
            }
        }
        
    // Handle HOW questions
    } else if (isHow) {
        analysis += `${t.howAnalysis}\n\n`;
        
        if (!latestData) {
            analysis += t.howNoData;
        } else {
            const howAnalysisItems = [];
            
            if (targets && parseFloat(latestData.integration) < parseFloat(targets.integration)) {
                howAnalysisItems.push(t.howImproveIntegration);
            }
            if (targets && parseFloat(latestData.stability) < parseFloat(targets.stability)) {
                howAnalysisItems.push(t.howImproveStability);
            }
            if (parseFloat(latestData.cr_blocker) > 0) {
                howAnalysisItems.push(t.howResolveBlocker);
            }
            if (activeTasks > 3) {
                howAnalysisItems.push(t.howManageTasks);
            }
            
            howAnalysisItems.push(t.howRegularUpdate);
            
            howAnalysisItems.forEach((item, index) => {
                analysis += `${index + 1}. ${item}\n`;
            });
        }
        
    // Handle WHAT questions
    } else if (isWhat) {
        analysis += `${t.whatAnalysis}\n\n`;
        
        analysis += `**${t.projectName}**: ${projectName}\n\n`;
        
        if (latestData) {
            analysis += `**${t.whatLatestMetrics}**:\n`;
            analysis += `- ${t.integrationRate}: ${latestData.integration}%\n`;
            analysis += `- ${t.mtbfDuration}: ${latestData.stability} ms\n`;
            analysis += `- ${t.blockerCR}: ${latestData.cr_blocker}\n`;
            analysis += `- ${t.criticalCR}: ${latestData.cr_critical}\n\n`;
        }
        
        analysis += `**${t.whatTasks}**:\n`;
        analysis += `- ${t.totalTasks}: ${devPlanCount}\n`;
        analysis += `- ${t.completedTasks}: ${completedTasks}\n`;
        analysis += `- ${t.activeTasks}: ${activeTasks}\n\n`;
        
        analysis += `**${t.whatCompletionRate}**: ${devPlanCount > 0 ? Math.round((completedTasks / devPlanCount) * 100) : 0}%\n`;
        
    // Handle metrics analysis
    } else if (isMetrics) {
        analysis += `${t.metricsAnalysis}\n\n`;
        
        if (!latestData) {
            analysis += t.noData;
        } else if (targets) {
            const metrics = [
                { key: 'integration', label: t.integrationRate, target: targets.integration, actual: latestData.integration, unit: '%', higherBetter: true },
                { key: 'stability', label: t.mtbfDuration, target: targets.stability, actual: latestData.stability, unit: ' ms', higherBetter: true },
                { key: 'cr_blocker', label: t.blockerCR, target: targets.cr_blocker, actual: latestData.cr_blocker, unit: '', higherBetter: false },
                { key: 'cr_critical', label: t.criticalCR, target: targets.cr_critical, actual: latestData.cr_critical, unit: '', higherBetter: false }
            ];
            
            analysis += `| ${t.metric} | ${t.target} | ${t.actual} | ${t.status} |\n`;
            analysis += `|-----------|--------|--------|--------|\n`;
            
            metrics.forEach(metric => {
                const target = parseFloat(metric.target);
                const actual = parseFloat(metric.actual);
                let achieved = false;
                
                if (metric.higherBetter) {
                    achieved = actual >= target;
                } else {
                    achieved = actual <= target;
                }
                
                analysis += `| ${metric.label} | ${target}${metric.unit} | ${actual}${metric.unit} | ${achieved ? t.pass : t.fail} |\n`;
            });
        }
        
    // Handle trend analysis
    } else if (isTrend) {
        analysis += `${t.trendAnalysis}\n\n`;
        
        if (totalDataEntries < 2) {
            analysis += t.trendInsufficientData;
        } else {
            analysis += t.trendBasedOnHistory;
            analysis += `\n\n${t.trendDataPoints}: ${totalDataEntries}\n`;
            
            if (latestData && targets) {
                const trends = [];
                
                if (parseFloat(latestData.integration) >= parseFloat(targets.integration) * 0.9) {
                    trends.push(t.trendIntegrationGood);
                } else {
                    trends.push(t.trendIntegrationNeedsWork);
                }
                
                if (parseFloat(latestData.stability) >= parseFloat(targets.stability) * 0.9) {
                    trends.push(t.trendStabilityGood);
                } else {
                    trends.push(t.trendStabilityNeedsWork);
                }
                
                trends.forEach((trend, index) => {
                    analysis += `${index + 1}. ${trend}\n`;
                });
            }
        }
        
    // Handle forecast
    } else if (isForecast) {
        analysis += `${t.forecastAnalysis}\n\n`;
        
        const completionRate = devPlanCount > 0 ? Math.round((completedTasks / devPlanCount) * 100) : 0;
        
        if (completionRate >= 80) {
            analysis += t.forecastOnTrack;
        } else if (completionRate >= 50) {
            analysis += t.forecastNeedsEffort;
        } else {
            analysis += t.forecastAtRisk;
        }
        
        analysis += `\n\n${t.forecastRecommendations}:\n`;
        analysis += `1. ${t.forecastMonitorProgress}\n`;
        if (activeTasks > 3) {
            analysis += `2. ${t.forecastPrioritizeTasks}\n`;
        }
        analysis += `3. ${t.forecastAdjustPlan}\n`;
        
    // Handle comparison
    } else if (isComparison) {
        analysis += `${t.comparisonAnalysis}\n\n`;
        
        if (!latestData || !targets) {
            analysis += t.comparisonNoData;
        } else {
            analysis += `**${t.comparisonTargetVsActual}**\n\n`;
            analysis += `| ${t.metric} | ${t.target} | ${t.actual} | ${t.gap} |\n`;
            analysis += `|-----------|--------|--------|------|\n`;
            
            const metrics = [
                { label: t.integrationRate, target: targets.integration, actual: latestData.integration, unit: '%', higherBetter: true },
                { label: t.mtbfDuration, target: targets.stability, actual: latestData.stability, unit: ' ms', higherBetter: true },
                { label: t.blockerCR, target: targets.cr_blocker, actual: latestData.cr_blocker, unit: '', higherBetter: false },
                { label: t.criticalCR, target: targets.cr_critical, actual: latestData.cr_critical, unit: '', higherBetter: false }
            ];
            
            metrics.forEach(metric => {
                const target = parseFloat(metric.target);
                const actual = parseFloat(metric.actual);
                let gap = '';
                
                if (metric.higherBetter) {
                    gap = actual >= target ? t.meetsTarget : `${(target - actual).toFixed(1)}${metric.unit}`;
                } else {
                    gap = actual <= target ? t.meetsTarget : `${(actual - target).toFixed(1)}${metric.unit}`;
                }
                
                analysis += `| ${metric.label} | ${target}${metric.unit} | ${actual}${metric.unit} | ${gap} |\n`;
            });
        }
        
    } else if (isSummarize) {
        analysis += `${t.summary}\n\n`;
        analysis += `**${t.overallHealth}**: ${devPlanCount > 0 && completedTasks / devPlanCount > 0.5 ? t.good : t.needsAttention}\n\n`;
        analysis += `**${t.strengths}**:\n`;
        if (completedTasks > 0) analysis += `- ${completedTasks} ${t.completedSuccessfully}\n`;
        if (latestData && parseFloat(latestData.stability) > 0) analysis += `- ${t.stabilityTracked}\n`;
        
        analysis += `\n**${t.improvement}**:\n`;
        if (activeTasks > completedTasks) analysis += `- ${t.moreInProgress}\n`;
        if (latestData && parseFloat(latestData.cr_blocker) > 0) analysis += `- ${latestData.cr_blocker} ${t.blockerAttention}\n`;
        
    } else if (isIssue) {
        analysis += `${t.issues}\n\n`;
        
        const issues = [];
        if (activeTasks > completedTasks * 2) {
            issues.push(t.tooManyTasks);
        }
        if (latestData && parseFloat(latestData.cr_blocker) > 0) {
            issues.push(`${latestData.cr_blocker} ${t.blockerDetected}`);
        }
        if (latestData && parseFloat(latestData.cr_critical) > targets?.cr_critical) {
            issues.push(t.criticalExceeds);
        }
        if (!latestData) {
            issues.push(t.noData);
        }
        
        if (issues.length === 0) {
            analysis += t.noIssues;
        } else {
            issues.forEach((issue, index) => {
                analysis += `${index + 1}. ${issue}\n`;
            });
        }
        
    } else if (isImprove) {
        analysis += `${t.recommendations}\n\n`;
        
        const suggestions = [];
        
        if (activeTasks > 3) {
            suggestions.push(t.limitWIP);
        }
        if (latestData && parseFloat(latestData.cr_blocker) > 0) {
            suggestions.push(t.resolveBlocker);
        }
        if (targets && latestData) {
            if (parseFloat(latestData.integration) < parseFloat(targets.integration)) {
                suggestions.push(t.increaseIntegration);
            }
            if (parseFloat(latestData.stability) < parseFloat(targets.stability)) {
                suggestions.push(t.improveStability);
            }
        }
        suggestions.push(t.regularEntry);
        
        suggestions.forEach((suggestion, index) => {
            analysis += `${index + 1}. ${suggestion}\n`;
        });
        
    } else if (isCompletion) {
        analysis += `${t.completionAnalysis}\n\n`;
        const completionRate = devPlanCount > 0 ? Math.round((completedTasks / devPlanCount) * 100) : 0;
        
        analysis += `- **${t.taskCompletionRate}**: ${completionRate}%\n`;
        analysis += `- **${t.activeTasks}**: ${activeTasks}\n`;
        analysis += `- **${t.completedTasks}**: ${completedTasks}\n\n`;
        
        if (completionRate >= 80) {
            analysis += t.excellent;
        } else if (completionRate >= 50) {
            analysis += t.goodProgress;
        } else {
            analysis += t.considerPrioritize;
        }
        
    } else if (isData) {
        analysis += `${t.dataQuality}\n\n`;
        
        if (totalDataEntries >= 5) {
            analysis += `✅ ${t.sufficientData}\n`;
        } else {
            analysis += `⚠️ ${t.insufficientData}\n`;
        }
        
        if (versionCount >= 2) {
            analysis += `✅ ${t.versionTracking}\n`;
        } else {
            analysis += `⚠️ ${t.noVersionTracking}\n`;
        }
        
    } else if (isRisk) {
        analysis += `${t.riskAnalysis}\n\n`;
        
        let riskLevel = 'low';
        const riskFactors = [];
        
        if (latestData && parseFloat(latestData.cr_blocker) > 0) {
            riskLevel = 'high';
            riskFactors.push(`${latestData.cr_blocker} ${t.blockerAttention}`);
        }
        if (activeTasks > completedTasks * 2) {
            riskLevel = riskLevel === 'high' ? 'high' : 'medium';
            riskFactors.push(t.tooManyTasks);
        }
        if (latestData && parseFloat(latestData.cr_critical) > targets?.cr_critical) {
            riskLevel = riskLevel === 'high' ? 'high' : 'medium';
            riskFactors.push(t.criticalExceeds);
        }
        
        if (riskLevel === 'low') {
            analysis += t.lowRisk;
        } else if (riskLevel === 'medium') {
            analysis += t.mediumRisk;
            riskFactors.forEach((factor, index) => {
                analysis += `${index + 1}. ${factor}\n`;
            });
        } else {
            analysis += t.highRisk;
            riskFactors.forEach((factor, index) => {
                analysis += `${index + 1}. ${factor}\n`;
            });
        }
        
    } else if (isPerformance) {
        analysis += `${t.performanceAnalysis}\n\n`;
        
        let performanceIssues = [];
        let performanceGood = true;
        
        if (targets && latestData) {
            if (parseFloat(latestData.integration) < parseFloat(targets.integration)) {
                performanceIssues.push(t.increaseIntegration);
                performanceGood = false;
            }
            if (parseFloat(latestData.stability) < parseFloat(targets.stability)) {
                performanceIssues.push(t.improveStability);
                performanceGood = false;
            }
        }
        
        if (performanceGood) {
            analysis += t.performanceGood;
        } else {
            analysis += t.performanceNeedsImprovement;
            performanceIssues.forEach((issue, index) => {
                analysis += `${index + 1}. ${issue}\n`;
            });
        }
        
    } else if (isGeneral) {
        // General comprehensive analysis for general questions
        analysis += `${t.generalAnalysis}\n\n`;
        analysis += `**${t.projectStatus}**: `;
        
        const completionRate = devPlanCount > 0 ? Math.round((completedTasks / devPlanCount) * 100) : 0;
        if (completionRate >= 80) {
            analysis += t.good;
        } else if (completionRate >= 50) {
            analysis += t.needsAttention;
        } else {
            analysis += '需要改进';
        }
        analysis += '\n\n';
        
        analysis += `**${t.nextSteps}**:\n`;
        if (activeTasks > 3) {
            analysis += `- ${t.focusOnHighPriority}\n`;
        }
        if (totalDataEntries < 5) {
            analysis += `- ${t.improveDataQuality}\n`;
        }
        analysis += `- ${t.monitorMetrics}\n`;
        if (latestData && parseFloat(latestData.cr_blocker) > 0) {
            analysis += `- ${t.addressBlocker}\n`;
        }
        
    } else {
        // Default response with improved relevance
        analysis += `${t.basedOnRequest}\n\n`;
        analysis += `${projectName} ${t.currentlyHas} ${devPlanCount} ${t.totalTasks}, ${completedTasks} ${t.withCompleted}, ${activeTasks} ${t.inProgress}.\n\n`;
        
        if (latestData) {
            analysis += `${t.latestMetrics}:\n`;
            analysis += `- ${t.integrationRate}: ${latestData.integration}%\n`;
            analysis += `- ${t.mtbfDuration}: ${latestData.stability} ms\n`;
            analysis += `- ${t.blockerCR}: ${latestData.cr_blocker}\n`;
            analysis += `- ${t.criticalCR}: ${latestData.cr_critical}\n\n`;
        }
        
        analysis += `${t.keyRecommendations}:\n`;
        analysis += `1. ${t.trackRegularly}\n`;
        if (activeTasks > completedTasks) {
            analysis += `2. ${t.reviewDistribution}\n`;
        }
        if (latestData && parseFloat(latestData.cr_blocker) > 0) {
            analysis += `3. ${t.addressBlocker}\n`;
        }
    }
    
    analysis += `\n\n${t.footer}`;
    
    return analysis;
}

// Analyze Feishu document
async function analyzeFeishuDocument() {
    const docUrl = document.getElementById('feishu-doc-url').value.trim();
    const isZh = currentAILanguage === 'zh';
    
    if (!docUrl) {
        alert(isZh ? '请输入飞书文档链接' : 'Please enter Feishu document URL');
        return;
    }
    
    // Validate Feishu URL format
    if (!docUrl.includes('feishu.cn') && !docUrl.includes('feishu.com')) {
        alert(isZh ? '请输入有效的飞书文档链接' : 'Please enter a valid Feishu document URL');
        return;
    }
    
    // Show loading
    document.getElementById('ai-loading').style.display = 'block';
    document.getElementById('ai-response').style.display = 'none';
    
    // Update loading text
    const loadingText = isZh ? 'AI正在分析文档...' : 'AI is analyzing the document...';
    document.querySelector('#ai-loading p').textContent = loadingText;
    
    try {
        // Extract document ID from URL
        const docId = extractDocId(docUrl);
        
        // Simulate document content extraction (in real implementation, this would use Feishu API)
        const documentContent = await simulateDocumentExtraction(docUrl, docId);
        
        // Generate AI analysis for the document
        const analysis = await generateDocumentAnalysis(documentContent, isZh);
        
        // Update response title
        const responseTitle = isZh ? '文档分析结果' : 'Document Analysis Result';
        document.querySelector('#ai-response h3').textContent = responseTitle;
        
        // Hide loading and show response
        document.getElementById('ai-loading').style.display = 'none';
        document.getElementById('ai-response-content').textContent = analysis;
        document.getElementById('ai-response').style.display = 'block';
        
    } catch (error) {
        document.getElementById('ai-loading').style.display = 'none';
        alert(isZh ? `文档分析失败: ${error.message}` : `Document analysis failed: ${error.message}`);
    }
}

// Extract document ID from Feishu URL
function extractDocId(url) {
    // Handle different Feishu URL formats
    const patterns = [
        /\/docx\/([a-zA-Z0-9_-]+)/,
        /\/wiki\/([a-zA-Z0-9_-]+)/,
        /\/docs\/([a-zA-Z0-9_-]+)/,
        /docId=([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    // If no pattern matches, use the last part of URL
    const parts = url.split('/');
    return parts[parts.length - 1] || 'unknown';
}

// Simulate document content extraction
async function simulateDocumentExtraction(url, docId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, this would call Feishu API to get document content
    // For now, return simulated test report content based on URL
    return {
        docId: docId,
        url: url,
        title: 'IOT设备测试报告 v2.1',
        content: 'This is a simulated test report document. In a real implementation, this would be the actual content from the Feishu document.',
        documentType: 'test_report',
        sections: [
            {
                type: 'heading',
                level: 1,
                content: '测试概述'
            },
            {
                type: 'paragraph',
                content: '本次测试针对IOT传感器设备的各项功能进行了全面验证，包括电池续航、性能表现、稳定性等关键指标。'
            },
            {
                type: 'heading',
                level: 2,
                content: '测试环境'
            },
            {
                type: 'list',
                items: [
                    '设备型号: IOT-Sensor-2024',
                    '固件版本: v2.1.3',
                    '测试温度: 25°C',
                    '测试时间: 2024-06-15 至 2024-06-20'
                ]
            },
            {
                type: 'heading',
                level: 2,
                content: '测试结果汇总'
            },
            {
                type: 'paragraph',
                content: '共执行测试用例 156 个，通过 142 个，失败 14 个，整体通过率 91.0%。'
            },
            {
                type: 'heading',
                level: 2,
                content: '电池续航测试'
            },
            {
                type: 'list',
                items: [
                    '20Hz 典型场景: 8.2 天 (目标: 8 天)',
                    '20Hz 重度场景: 7.1 天 (目标: 7 天)',
                    '20Hz AOD场景: 9.3 天 (目标: 9 天)',
                    '100Hz 典型场景: 7.5 天 (目标: 7 天)',
                    '100Hz 重度场景: 6.8 天 (目标: 6 天)',
                    '100Hz AOD场景: 8.7 天 (目标: 8 天)'
                ]
            },
            {
                type: 'heading',
                level: 2,
                content: '性能测试'
            },
            {
                type: 'list',
                items: [
                    'GPS冷启动时间: 8.5秒 (目标: 8秒)',
                    'GPS热启动时间: 2.3秒 (目标: 2秒)',
                    '触摸响应时间: 45ms (目标: 50ms)',
                    '按键响应时间: 38ms (目标: 40ms)',
                    '滑动帧率: 58fps (目标: 60fps)',
                    '滑动丢帧率: 1.2% (目标: 2%)'
                ]
            },
            {
                type: 'heading',
                level: 2,
                content: '稳定性测试'
            },
            {
                type: 'list',
                items: [
                    'MTTF: 9.2小时 (目标: 9小时)',
                    '功能集成率: 85% (目标: 80%)',
                    '算法准确率: 92% (目标: 90%)'
                ]
            },
            {
                type: 'heading',
                level: 2,
                content: '缺陷统计'
            },
            {
                type: 'list',
                items: [
                    'Blocker CR: 0个',
                    'Critical CR: 1个',
                    'Major CR: 5个',
                    'Minor CR: 8个'
                ]
            },
            {
                type: 'heading',
                level: 2,
                content: '测试结论'
            },
            {
                type: 'paragraph',
                content: '本次测试整体表现良好，各项关键指标均达到或超过预期目标。建议在下一版本中优化GPS冷启动时间，并修复发现的Critical级别缺陷。'
            }
        ],
        testData: {
            totalTestCases: 156,
            passedTestCases: 142,
            failedTestCases: 14,
            passRate: 91.0,
            batteryTests: {
                '20hz_typical': { actual: 8.2, target: 8, status: 'pass' },
                '20hz_heavy': { actual: 7.1, target: 7, status: 'pass' },
                '20hz_aod': { actual: 9.3, target: 9, status: 'pass' },
                '100hz_typical': { actual: 7.5, target: 7, status: 'pass' },
                '100hz_heavy': { actual: 6.8, target: 6, status: 'pass' },
                '100hz_aod': { actual: 8.7, target: 8, status: 'pass' }
            },
            performanceTests: {
                'gps_cold': { actual: 8.5, target: 8, status: 'fail' },
                'gps_hot': { actual: 2.3, target: 2, status: 'pass' },
                'touch_response': { actual: 45, target: 50, status: 'pass' },
                'key_response': { actual: 38, target: 40, status: 'pass' },
                'slide_fps': { actual: 58, target: 60, status: 'fail' },
                'slide_drop': { actual: 1.2, target: 2, status: 'pass' }
            },
            stabilityTests: {
                'mttf': { actual: 9.2, target: 9, status: 'pass' },
                'integration': { actual: 85, target: 80, status: 'pass' },
                'algorithm': { actual: 92, target: 90, status: 'pass' }
            },
            defects: {
                blocker: 0,
                critical: 1,
                major: 5,
                minor: 8
            }
        },
        metadata: {
            wordCount: 850,
            paragraphCount: 12,
            headingCount: 8,
            lastModified: new Date().toISOString()
        }
    };
}

// Generate document analysis
async function generateDocumentAnalysis(documentContent, isZh = false) {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isTestReport = documentContent.documentType === 'test_report';
    
    const t = {
        title: isZh ? '## 文档分析报告' : '## Document Analysis Report',
        docInfo: isZh ? '### 📄 文档信息' : '### 📄 Document Information',
        docId: isZh ? '文档ID' : 'Document ID',
        url: isZh ? '链接' : 'URL',
        wordCount: isZh ? '字数' : 'Word Count',
        paragraphCount: isZh ? '段落数' : 'Paragraph Count',
        headingCount: isZh ? '标题数' : 'Heading Count',
        lastModified: isZh ? '最后修改' : 'Last Modified',
        
        contentAnalysis: isZh ? '### 📊 内容分析' : '### 📊 Content Analysis',
        docType: isZh ? '文档类型' : 'Document Type',
        docTypeValue: isTestReport ? (isZh ? '测试报告' : 'Test Report') : (isZh ? '技术文档' : 'Technical Document'),
        targetAudience: isZh ? '目标受众' : 'Target Audience',
        targetAudienceValue: isTestReport ? (isZh ? '测试工程师、开发人员、项目经理' : 'Test engineers, Developers, Project managers') : (isZh ? '技术开发人员、项目经理' : 'Technical developers, Project managers'),
        complexity: isZh ? '复杂度' : 'Complexity',
        complexityLevel: isTestReport ? (isZh ? '高' : 'High') : (isZh ? '中等' : 'Medium'),
        readability: isZh ? '可读性' : 'Readability',
        readabilityScore: isZh ? '良好 (8.0/10)' : 'Good (8.0/10)',
        
        structureAnalysis: isZh ? '### 🏗️ 结构分析' : '### 🏗️ Structure Analysis',
        structureDetail: isZh ? '文档结构清晰，层次分明：' : 'Document structure is clear and well-organized:',
        heading1Count: isZh ? '一级标题' : 'Level 1 Headings',
        heading2Count: isZh ? '二级标题' : 'Level 2 Headings',
        listCount: isZh ? '列表项' : 'List Items',
        avgParagraphLength: isZh ? '平均段落长度' : 'Average Paragraph Length',
        
        contentQuality: isZh ? '### ✅ 内容质量' : '### ✅ Content Quality',
        qualityDetail: isZh ? '内容质量评估：' : 'Content quality assessment:',
        completeness: isZh ? '完整性' : 'Completeness',
        completenessScore: isTestReport ? (isZh ? '优秀 - 测试覆盖全面' : 'Excellent - Comprehensive test coverage') : (isZh ? '优秀 - 内容覆盖全面' : 'Excellent - Comprehensive coverage'),
        accuracy: isZh ? '准确性' : 'Accuracy',
        accuracyScore: isTestReport ? (isZh ? '优秀 - 数据准确可靠' : 'Excellent - Accurate and reliable data') : (isZh ? '良好 - 信息准确可靠' : 'Good - Accurate and reliable information'),
        relevance: isZh ? '相关性' : 'Relevance',
        relevanceScore: isZh ? '优秀 - 与主题高度相关' : 'Excellent - Highly relevant to topic',
        
        testDataSection: isZh ? '### 🧪 测试数据分析' : '### 🧪 Test Data Analysis',
        testSummary: isZh ? '测试汇总' : 'Test Summary',
        totalCases: isZh ? '总测试用例数' : 'Total Test Cases',
        passedCases: isZh ? '通过用例数' : 'Passed Test Cases',
        failedCases: isZh ? '失败用例数' : 'Failed Test Cases',
        passRate: isZh ? '通过率' : 'Pass Rate',
        
        batteryTestSection: isZh ? '#### 🔋 电池续航测试' : '#### 🔋 Battery Life Tests',
        performanceTestSection: isZh ? '#### ⚡ 性能测试' : '#### ⚡ Performance Tests',
        stabilityTestSection: isZh ? '#### 🛡️ 稳定性测试' : '#### 🛡️ Stability Tests',
        defectsSection: isZh ? '#### 🐛 缺陷统计' : '#### 🐛 Defect Statistics',
        
        actual: isZh ? '实际值' : 'Actual',
        target: isZh ? '目标值' : 'Target',
        status: isZh ? '状态' : 'Status',
        pass: isZh ? '✅ 通过' : '✅ Pass',
        fail: isZh ? '❌ 失败' : '❌ Fail',
        
        keyPoints: isZh ? '### 🔑 关键要点' : '### 🔑 Key Points',
        point1: isZh ? '1. **核心目标**：文档明确了项目的核心目标和关键成功指标，包括功能集成率、系统稳定性等具体指标。' : '1. **Core Objectives**: The document clearly defines the project\'s core objectives and key success indicators, including specific metrics like feature integration rate and system stability.',
        point2: isZh ? '2. **实施计划**：详细描述了项目实施的具体步骤，包括需求分析、开发、测试和部署等阶段，每个阶段都有明确的时间节点。' : '2. **Implementation Plan**: Detailed description of the project implementation steps, including requirement analysis, development, testing, and deployment phases, each with clear timelines.',
        point3: isZh ? '3. **风险管理**：识别了项目中的主要风险点，包括技术风险、资源风险和时间风险，并提供了相应的应对策略和缓解措施。' : '3. **Risk Management**: Identified major risk points in the project, including technical risks, resource risks, and timeline risks, with corresponding response strategies and mitigation measures.',
        point4: isZh ? '4. **质量保证**：建立了完整的质量保证体系，包括代码审查、自动化测试和性能监控等机制，确保项目质量符合预期标准。' : '4. **Quality Assurance**: Established a comprehensive quality assurance system, including code review, automated testing, and performance monitoring mechanisms to ensure project quality meets expected standards.',
        point5: isZh ? '5. **团队协作**：明确了团队成员的职责分工和协作流程，建立了有效的沟通机制，确保团队高效协作。' : '5. **Team Collaboration**: Clearly defined team member responsibilities and collaboration processes, established effective communication mechanisms to ensure efficient team collaboration.',
        
        keywords: isZh ? '### 🏷️ 关键词提取' : '### 🏷️ Keyword Extraction',
        keywordsList: isTestReport ? 
            (isZh ? '- 测试报告\n- 电池续航\n- 性能测试\n- 稳定性测试\n- 缺陷统计\n- MTTF\n- 功能集成率\n- GPS性能' : 
            '- Test Report\n- Battery Life\n- Performance Testing\n- Stability Testing\n- Defect Statistics\n- MTTF\n- Feature Integration\n- GPS Performance') :
            (isZh ? '- 项目管理\n- 技术实施\n- 风险控制\n- 质量保证\n- 团队协作\n- 性能优化\n- 系统稳定性' : 
            '- Project Management\n- Technical Implementation\n- Risk Control\n- Quality Assurance\n- Team Collaboration\n- Performance Optimization\n- System Stability'),
        
        improvementSuggestions: isZh ? '### 💡 改进建议' : '### 💡 Improvement Suggestions',
        suggestion1: isZh ? '1. **增加可视化内容**：建议在文档中添加更多图表、流程图和架构图，帮助读者更好地理解复杂概念和流程。' : '1. **Add Visual Content**: Consider adding more charts, flowcharts, and architecture diagrams to help readers better understand complex concepts and processes.',
        suggestion2: isZh ? '2. **补充案例说明**：建议增加实际案例和示例，使抽象的概念更加具体化，提高文档的实用性和可操作性。' : '2. **Add Case Studies**: Consider adding real-world cases and examples to make abstract concepts more concrete, improving the document\'s practicality and operability.',
        suggestion3: isZh ? '3. **优化章节组织**：建议重新组织章节结构，将相关内容归类，提高文档的逻辑性和连贯性。' : '3. **Optimize Chapter Organization**: Consider reorganizing the chapter structure to group related content together, improving the document\'s logic and coherence.',
        suggestion4: isZh ? '4. **添加索引和目录**：建议在文档开头添加详细目录，在文档末尾添加关键词索引，方便读者快速定位内容。' : '4. **Add Index and Table of Contents**: Consider adding a detailed table of contents at the beginning and a keyword index at the end to help readers quickly locate content.',
        suggestion5: isZh ? '5. **建立版本控制**：建议使用文档版本控制系统，记录每次修改的内容和原因，便于追踪变更历史和回滚。' : '5. **Establish Version Control**: Recommend using a document version control system to record the content and reason for each change, facilitating change history tracking and rollback.',
        
        summary: isZh ? '### 📝 总结' : '### 📝 Summary',
        summaryText: isTestReport ? 
            (isZh ? '该测试报告是一份高质量的测试文档，测试覆盖全面，数据详实可靠。各项关键指标均达到或超过预期目标，整体通过率达到91.0%。建议重点关注GPS冷启动时间和滑动帧率的优化，并及时修复发现的Critical级别缺陷。' : 
            'This is a high-quality test report with comprehensive test coverage and detailed, reliable data. All key metrics meet or exceed expected targets, with an overall pass rate of 91.0%. It is recommended to focus on optimizing GPS cold start time and slide frame rate, and to promptly fix the discovered Critical-level defects.') :
            (isZh ? '该文档是一份高质量的技术文档，内容全面、结构清晰、逻辑严谨。文档涵盖了项目管理的各个方面，从目标设定到实施计划，从风险控制到质量保证，都有详细的说明。建议按照上述改进建议进一步优化文档，使其更加完善和实用。' : 
            'This is a high-quality technical document with comprehensive content, clear structure, and rigorous logic. The document covers all aspects of project management, from goal setting to implementation planning, from risk control to quality assurance, all with detailed explanations. It is recommended to further optimize the document according to the above improvement suggestions to make it more complete and practical.'),
        
        footer: isZh ? '*此分析由AI根据文档内容生成，仅供参考*' : '*This analysis is generated by AI based on document content, for reference only*'
    };
    
    let analysis = `${t.title}\n\n`;
    
    // Document information
    analysis += `${t.docInfo}\n`;
    analysis += `- **${t.docId}**: \`${documentContent.docId}\`\n`;
    analysis += `- **${t.url}**: ${documentContent.url}\n`;
    analysis += `- **${t.wordCount}**: ${documentContent.metadata.wordCount} ${isZh ? '字' : 'words'}\n`;
    analysis += `- **${t.paragraphCount}**: ${documentContent.metadata.paragraphCount} ${isZh ? '个段落' : 'paragraphs'}\n`;
    analysis += `- **${t.headingCount}**: ${documentContent.metadata.headingCount} ${isZh ? '个标题' : 'headings'}\n`;
    analysis += `- **${t.lastModified}**: ${new Date(documentContent.metadata.lastModified).toLocaleString()}\n\n`;
    
    // Content analysis
    analysis += `${t.contentAnalysis}\n`;
    analysis += `- **${t.docType}**: ${t.docTypeValue}\n`;
    analysis += `- **${t.targetAudience}**: ${t.targetAudienceValue}\n`;
    analysis += `- **${t.complexity}**: ${t.complexityLevel}\n`;
    analysis += `- **${t.readability}**: ${t.readabilityScore}\n\n`;
    
    // Structure analysis
    analysis += `${t.structureAnalysis}\n`;
    analysis += `${t.structureDetail}\n`;
    analysis += `- ${t.heading1Count}: ${documentContent.sections.filter(s => s.type === 'heading' && s.level === 1).length}\n`;
    analysis += `- ${t.heading2Count}: ${documentContent.sections.filter(s => s.type === 'heading' && s.level === 2).length}\n`;
    const totalListItems = documentContent.sections.filter(s => s.type === 'list').reduce((sum, s) => sum + (s.items ? s.items.length : 0), 0);
    analysis += `- ${t.listCount}: ${totalListItems}\n`;
    const avgLength = Math.round(documentContent.metadata.wordCount / documentContent.metadata.paragraphCount);
    analysis += `- ${t.avgParagraphLength}: ${avgLength} ${isZh ? '字/段落' : 'words/paragraph'}\n\n`;
    
    // Content quality
    analysis += `${t.contentQuality}\n`;
    analysis += `${t.qualityDetail}\n`;
    analysis += `- **${t.completeness}**: ${t.completenessScore}\n`;
    analysis += `- **${t.accuracy}**: ${t.accuracyScore}\n`;
    analysis += `- **${t.relevance}**: ${t.relevanceScore}\n\n`;
    
    // Test data analysis (only for test reports)
    if (isTestReport && documentContent.testData) {
        const testData = documentContent.testData;
        
        analysis += `${t.testDataSection}\n\n`;
        
        // Test summary
        analysis += `${t.testSummary}\n`;
        analysis += `- **${t.totalCases}**: ${testData.totalTestCases}\n`;
        analysis += `- **${t.passedCases}**: ${testData.passedTestCases}\n`;
        analysis += `- **${t.failedCases}**: ${testData.failedTestCases}\n`;
        analysis += `- **${t.passRate}**: ${testData.passRate}%\n\n`;
        
        // Battery tests
        analysis += `${t.batteryTestSection}\n`;
        analysis += `| 场景 | ${t.actual} | ${t.target} | ${t.status} |\n`;
        analysis += `|------|----------|----------|----------|\n`;
        const batteryLabels = {
            '20hz_typical': isZh ? '20Hz 典型' : '20Hz Typical',
            '20hz_heavy': isZh ? '20Hz 重度' : '20Hz Heavy',
            '20hz_aod': isZh ? '20Hz AOD' : '20Hz AOD',
            '100hz_typical': isZh ? '100Hz 典型' : '100Hz Typical',
            '100hz_heavy': isZh ? '100Hz 重度' : '100Hz Heavy',
            '100hz_aod': isZh ? '100Hz AOD' : '100Hz AOD'
        };
        Object.keys(testData.batteryTests).forEach(key => {
            const test = testData.batteryTests[key];
            const statusIcon = test.status === 'pass' ? t.pass : t.fail;
            analysis += `| ${batteryLabels[key]} | ${test.actual} ${isZh ? '天' : 'days'} | ${test.target} ${isZh ? '天' : 'days'} | ${statusIcon} |\n`;
        });
        analysis += '\n';
        
        // Performance tests
        analysis += `${t.performanceTestSection}\n`;
        analysis += `| 测试项 | ${t.actual} | ${t.target} | ${t.status} |\n`;
        analysis += `|--------|----------|----------|----------|\n`;
        const perfLabels = {
            'gps_cold': isZh ? 'GPS冷启动' : 'GPS Cold Start',
            'gps_hot': isZh ? 'GPS热启动' : 'GPS Hot Start',
            'touch_response': isZh ? '触摸响应' : 'Touch Response',
            'key_response': isZh ? '按键响应' : 'Key Response',
            'slide_fps': isZh ? '滑动帧率' : 'Slide FPS',
            'slide_drop': isZh ? '滑动丢帧率' : 'Slide Drop Rate'
        };
        const perfUnits = {
            'gps_cold': isZh ? '秒' : 's',
            'gps_hot': isZh ? '秒' : 's',
            'touch_response': 'ms',
            'key_response': 'ms',
            'slide_fps': 'fps',
            'slide_drop': '%'
        };
        Object.keys(testData.performanceTests).forEach(key => {
            const test = testData.performanceTests[key];
            const statusIcon = test.status === 'pass' ? t.pass : t.fail;
            analysis += `| ${perfLabels[key]} | ${test.actual} ${perfUnits[key]} | ${test.target} ${perfUnits[key]} | ${statusIcon} |\n`;
        });
        analysis += '\n';
        
        // Stability tests
        analysis += `${t.stabilityTestSection}\n`;
        analysis += `| 测试项 | ${t.actual} | ${t.target} | ${t.status} |\n`;
        analysis += `|--------|----------|----------|----------|\n`;
        const stabilityLabels = {
            'mttf': 'MTTF',
            'integration': isZh ? '功能集成率' : 'Integration Rate',
            'algorithm': isZh ? '算法准确率' : 'Algorithm Accuracy'
        };
        const stabilityUnits = {
            'mttf': isZh ? '小时' : 'h',
            'integration': '%',
            'algorithm': '%'
        };
        Object.keys(testData.stabilityTests).forEach(key => {
            const test = testData.stabilityTests[key];
            const statusIcon = test.status === 'pass' ? t.pass : t.fail;
            analysis += `| ${stabilityLabels[key]} | ${test.actual} ${stabilityUnits[key]} | ${test.target} ${stabilityUnits[key]} | ${statusIcon} |\n`;
        });
        analysis += '\n';
        
        // Defects
        analysis += `${t.defectsSection}\n`;
        analysis += `- **Blocker**: ${testData.defects.blocker}\n`;
        analysis += `- **Critical**: ${testData.defects.critical}\n`;
        analysis += `- **Major**: ${testData.defects.major}\n`;
        analysis += `- **Minor**: ${testData.defects.minor}\n`;
        analysis += `- **${isZh ? '总计' : 'Total'}**: ${testData.defects.blocker + testData.defects.critical + testData.defects.major + testData.defects.minor}\n\n`;
    }
    
    // Key findings (context-aware)
    analysis += `${t.keyPoints}\n`;
    if (isTestReport && documentContent.testData) {
        const testData = documentContent.testData;
        
        // Finding 1: Overall performance
        const overallStatus = testData.passRate >= 90 ? (isZh ? '优秀' : 'Excellent') : 
                             testData.passRate >= 80 ? (isZh ? '良好' : 'Good') : 
                             testData.passRate >= 70 ? (isZh ? '一般' : 'Average') : (isZh ? '较差' : 'Poor');
        
        analysis += isZh ? 
            `1. **整体表现${overallStatus}**：本次测试共执行 ${testData.totalTestCases} 个测试用例，通过 ${testData.passedTestCases} 个，通过率达到 ${testData.passRate}%。` :
            `1. **Overall Performance: ${overallStatus}**: A total of ${testData.totalTestCases} test cases were executed, with ${testData.passedTestCases} passing, achieving a pass rate of ${testData.passRate}%.`;
        analysis += '\n\n';
        
        // Finding 2: Battery performance highlights
        const batteryResults = Object.values(testData.batteryTests);
        const allBatteryPassed = batteryResults.every(t => t.status === 'pass');
        analysis += isZh ? 
            `2. **电池续航表现${allBatteryPassed ? '优秀' : '需关注'}**：${allBatteryPassed ? '所有电池测试项均通过，续航表现超出预期。' : '部分电池测试项未达标，建议优化电源管理策略。'}` :
            `2. **Battery Life Performance: ${allBatteryPassed ? 'Excellent' : 'Needs Attention'}**: ${allBatteryPassed ? 'All battery tests passed, exceeding expectations.' : 'Some battery tests did not meet targets, consider optimizing power management.'}`;
        analysis += '\n\n';
        
        // Finding 3: Performance issues
        const failedPerfTests = Object.entries(testData.performanceTests).filter(([, t]) => t.status === 'fail');
        analysis += isZh ? 
            `3. **性能瓶颈识别**：${failedPerfTests.length === 0 ? '所有性能测试均通过！' : `发现 ${failedPerfTests.length} 项性能指标未达标：${failedPerfTests.map(([k]) => perfLabels[k]).join('、')}`}` :
            `3. **Performance Bottlenecks**: ${failedPerfTests.length === 0 ? 'All performance tests passed!' : `${failedPerfTests.length} performance metrics did not meet targets: ${failedPerfTests.map(([k]) => perfLabels[k]).join(', ')}`}`;
        analysis += '\n\n';
        
        // Finding 4: Stability status
        const stabilityResults = Object.values(testData.stabilityTests);
        const allStabilityPassed = stabilityResults.every(t => t.status === 'pass');
        const mttfValue = testData.stabilityTests.mttf.actual;
        analysis += isZh ? 
            `4. **系统稳定性${allStabilityPassed ? '良好' : '需改进'}**：MTTF达到 ${mttfValue} 小时${mttfValue >= 9 ? '，超出目标要求。' : '，未达到目标要求。'}功能集成率 ${testData.stabilityTests.integration.actual}%，算法准确率 ${testData.stabilityTests.algorithm.actual}%。` :
            `4. **System Stability: ${allStabilityPassed ? 'Good' : 'Needs Improvement'}**: MTTF reached ${mttfValue} hours ${mttfValue >= 9 ? ', exceeding target.' : ', below target.'} Feature integration rate is ${testData.stabilityTests.integration.actual}%, algorithm accuracy is ${testData.stabilityTests.algorithm.actual}%.`;
        analysis += '\n\n';
        
        // Finding 5: Defect analysis
        const totalDefects = testData.defects.blocker + testData.defects.critical + testData.defects.major + testData.defects.minor;
        const hasCritical = testData.defects.critical > 0;
        analysis += isZh ? 
            `5. **缺陷分布分析**：共发现 ${totalDefects} 个缺陷。${testData.defects.blocker === 0 ? '无Blocker级缺陷，' : `${testData.defects.blocker} 个Blocker级缺陷需立即修复。`}${hasCritical ? `${testData.defects.critical} 个Critical级缺陷需优先处理。` : ''}建议优先解决Critical级别缺陷。` :
            `5. **Defect Distribution**: A total of ${totalDefects} defects were found. ${testData.defects.blocker === 0 ? 'No Blocker defects. ' : `${testData.defects.blocker} Blocker defects require immediate attention. `}${hasCritical ? `${testData.defects.critical} Critical defects need priority handling. ` : ''}Recommend prioritizing Critical defect fixes.`;
        analysis += '\n\n';
        
    } else {
        // Fallback for non-test documents
        analysis += `${t.point1}\n\n`;
        analysis += `${t.point2}\n\n`;
        analysis += `${t.point3}\n\n`;
        analysis += `${t.point4}\n\n`;
        analysis += `${t.point5}\n\n`;
    }
    
    // Keywords (context-aware)
    analysis += `${t.keywords}\n`;
    analysis += `${t.keywordsList}\n\n`;
    
    // Improvement suggestions (context-aware)
    analysis += `${t.improvementSuggestions}\n`;
    if (isTestReport && documentContent.testData) {
        const testData = documentContent.testData;
        
        // Specific suggestions based on test results
        const perfTests = testData.performanceTests;
        const suggestions = [];
        
        if (perfTests.gps_cold.status === 'fail') {
            suggestions.push(isZh ? 
                '1. **优化GPS冷启动时间**：当前GPS冷启动时间为 ' + perfTests.gps_cold.actual + ' 秒，超出目标 ' + perfTests.gps_cold.target + ' 秒。建议优化定位算法或增加辅助定位数据源。' :
                '1. **Optimize GPS Cold Start Time**: Current GPS cold start time is ' + perfTests.gps_cold.actual + 's, exceeding the target of ' + perfTests.gps_cold.target + 's. Suggest optimizing positioning algorithms or adding auxiliary positioning data sources.');
        }
        
        if (perfTests.slide_fps.status === 'fail') {
            suggestions.push(isZh ? 
                '2. **提升滑动帧率**：当前滑动帧率为 ' + perfTests.slide_fps.actual + ' fps，目标为 ' + perfTests.slide_fps.target + ' fps。建议优化UI渲染逻辑，减少不必要的重绘。' :
                '2. **Improve Slide Frame Rate**: Current slide frame rate is ' + perfTests.slide_fps.actual + ' fps, target is ' + perfTests.slide_fps.target + ' fps. Suggest optimizing UI rendering logic to reduce unnecessary redraws.');
        }
        
        if (testData.defects.critical > 0) {
            suggestions.push(isZh ? 
                '3. **优先修复Critical缺陷**：发现 ' + testData.defects.critical + ' 个Critical级缺陷，建议在下一版本迭代中优先处理。' :
                '3. **Prioritize Critical Defects**: Found ' + testData.defects.critical + ' Critical-level defects, recommend prioritizing these in the next iteration.');
        }
        
        if (testData.defects.major > 3) {
            suggestions.push(isZh ? 
                '4. **关注Major缺陷**：存在 ' + testData.defects.major + ' 个Major级缺陷，建议制定修复计划逐步解决。' :
                '4. **Address Major Defects**: There are ' + testData.defects.major + ' Major-level defects, suggest developing a fix plan.');
        }
        
        suggestions.push(isZh ? 
            '5. **持续监控稳定性**：MTTF当前表现良好，但建议建立持续监控机制，确保系统稳定性持续达标。' :
            '5. **Continuous Stability Monitoring**: MTTF performance is currently good, but recommend establishing continuous monitoring to ensure ongoing stability compliance.');
        
        suggestions.forEach(s => {
            analysis += `${s}\n\n`;
        });
        
    } else {
        // Fallback for non-test documents
        analysis += `${t.suggestion1}\n\n`;
        analysis += `${t.suggestion2}\n\n`;
        analysis += `${t.suggestion3}\n\n`;
        analysis += `${t.suggestion4}\n\n`;
        analysis += `${t.suggestion5}\n\n`;
    }
    
    // Summary
    analysis += `${t.summary}\n`;
    analysis += `${t.summaryText}\n\n`;
    
    analysis += `${t.footer}`;
    
    return analysis;
}

function clearAIResponse() {
    document.getElementById('ai-prompt').value = '';
    document.getElementById('feishu-doc-url').value = '';
    document.getElementById('ai-response').style.display = 'none';
    document.getElementById('ai-loading').style.display = 'none';
}

// Initialize AI language on page load
function initializeAILanguage() {
    const savedLang = localStorage.getItem('aiLanguage') || 'en';
    switchAILanguage(savedLang);
}

// Feishu Integration Functions
let currentFeishuDocs = [];
let currentFeishuDoc = null;

async function checkFeishuAuth() {
    try {
        const response = await fetch('http://localhost:3000/auth/status', {
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Feishu auth check failed:', error);
        return { loggedIn: false };
    }
}

function feishuLogin() {
    window.location.href = 'http://localhost:3000/auth/login';
}

async function feishuLogout() {
    try {
        await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        location.reload();
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

async function loadFeishuDocs() {
    const docList = document.getElementById('feishu-doc-list');
    docList.innerHTML = '<div class="loading-indicator"><div class="spinner"></div><p>Loading documents...</p></div>';
    
    try {
        const response = await fetch('http://localhost:3000/api/documents', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success && data.documents) {
            currentFeishuDocs = data.documents;
            renderFeishuDocList(data.documents);
        } else {
            docList.innerHTML = '<div class="empty-doc-list">No documents found.</div>';
        }
    } catch (error) {
        console.error('Failed to load documents:', error);
        docList.innerHTML = '<div class="empty-doc-list">Failed to load documents. Please try again later.</div>';
    }
}

function renderFeishuDocList(documents) {
    const docList = document.getElementById('feishu-doc-list');
    
    if (!documents || documents.length === 0) {
        docList.innerHTML = '<div class="empty-doc-list">No documents found.</div>';
        return;
    }
    
    const grid = document.createElement('div');
    grid.className = 'feishu-doc-grid';
    
    documents.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'feishu-doc-card';
        card.onclick = () => openFeishuDoc(doc);
        
        const icon = doc.type === 'docx' ? '📄' : doc.type === 'sheet' ? '📊' : doc.type === 'slide' ? '📈' : '📁';
        
        card.innerHTML = `
            <div class="doc-icon">${icon}</div>
            <div class="doc-title">${doc.name}</div>
            <div class="doc-meta">${doc.type || 'Document'} | ${doc.owner || 'Unknown'}</div>
            <div class="doc-date">${doc.updated_at || ''}</div>
        `;
        
        grid.appendChild(card);
    });
    
    docList.innerHTML = '';
    docList.appendChild(grid);
}

function searchFeishuDocs() {
    const query = document.getElementById('feishu-search-input').value.toLowerCase();
    const filtered = currentFeishuDocs.filter(doc => 
        doc.name.toLowerCase().includes(query)
    );
    renderFeishuDocList(filtered);
}

function handleFeishuSearch(event) {
    if (event.key === 'Enter') {
        searchFeishuDocs();
    }
}

async function openFeishuDoc(doc) {
    currentFeishuDoc = doc;
    
    document.getElementById('feishu-doc-list').style.display = 'none';
    document.getElementById('feishu-doc-detail').style.display = 'block';
    document.getElementById('doc-detail-title').textContent = doc.name;
    
    const contentDiv = document.getElementById('doc-detail-content');
    contentDiv.innerHTML = '<div class="loading-indicator"><div class="spinner"></div><p>Loading document content...</p></div>';
    
    document.getElementById('doc-analysis-result').style.display = 'none';
    
    try {
        console.log('Fetching content for document:', doc.document_id);
        const response = await fetch(`http://localhost:3000/api/documents/${doc.document_id}/content`, {
            credentials: 'include'
        });
        const data = await response.json();
        console.log('Document content response:', data);
        
        if (data.success && data.content) {
            const formattedContent = formatDocContent(data.content);
            if (formattedContent && formattedContent.trim()) {
                contentDiv.innerHTML = formattedContent;
            } else {
                contentDiv.innerHTML = '<p style="color: #888;">Document is empty or could not be parsed.</p>';
            }
        } else if (data.error) {
            contentDiv.innerHTML = `<p style="color: #ff6b6b;">Error: ${data.error}</p>`;
        } else {
            contentDiv.innerHTML = '<p>Failed to load document content. Please try again.</p>';
        }
    } catch (error) {
        console.error('Failed to load document content:', error);
        contentDiv.innerHTML = '<p>Failed to load document content. Please try again later.</p>';
    }
}

function formatDocContent(content) {
    if (typeof content === 'string') {
        return content.replace(/\n/g, '<br>');
    }
    
    if (Array.isArray(content)) {
        let html = '';
        content.forEach(block => {
            if (block.type === 'paragraph') {
                html += `<p>${block.text || block.content || ''}</p>`;
            } else if (block.type === 'heading1') {
                html += `<h1>${block.text || block.content || ''}</h1>`;
            } else if (block.type === 'heading2') {
                html += `<h2>${block.text || block.content || ''}</h2>`;
            } else if (block.type === 'heading3') {
                html += `<h3>${block.text || block.content || ''}</h3>`;
            } else if (block.type === 'list' && block.items) {
                html += '<ul>';
                block.items.forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += '</ul>';
            } else if (block.type === 'table' && block.rows) {
                html += '<table>';
                block.rows.forEach(row => {
                    html += '<tr>';
                    row.forEach(cell => {
                        html += `<td>${cell}</td>`;
                    });
                    html += '</tr>';
                });
                html += '</table>';
            } else {
                html += `<p>${block.text || block.content || JSON.stringify(block)}</p>`;
            }
        });
        return html;
    }
    
    return JSON.stringify(content, null, 2);
}

function closeFeishuDocDetail() {
    document.getElementById('feishu-doc-detail').style.display = 'none';
    document.getElementById('feishu-doc-list').style.display = 'block';
    currentFeishuDoc = null;
}

async function analyzeFeishuDocContent() {
    if (!currentFeishuDoc) return;
    
    const contentDiv = document.getElementById('doc-detail-content');
    const content = contentDiv.innerText || contentDiv.textContent;
    
    const analysisDiv = document.getElementById('doc-analysis-result');
    const analysisContent = document.getElementById('doc-analysis-content');
    
    analysisDiv.style.display = 'block';
    analysisContent.innerHTML = '<div class="loading-indicator"><div class="spinner"></div><p>AI is analyzing the document...</p></div>';
    
    const isZh = currentAILanguage === 'zh';
    
    const analysis = await generateSimulatedAIResponse({
        projectName: currentFeishuDoc.name,
        description: 'Feishu Document Analysis',
        targets: null,
        latestData: null,
        totalDataEntries: 1,
        devPlanCount: 0,
        activeTasks: 0,
        completedTasks: 0,
        versionCount: 0
    }, isZh ? '分析这份文档的内容，提取关键信息和数据，提供详细的分析报告' : 'Analyze this document content, extract key information and data, provide a detailed analysis report', isZh);
    
    analysisContent.textContent = analysis;
}

async function initFeishuAuth() {
    const authData = await checkFeishuAuth();
    
    const userInfo = document.getElementById('feishu-user-info');
    const userName = document.getElementById('feishu-user-name');
    const loginBtn = document.getElementById('feishu-login-btn');
    const logoutBtn = document.getElementById('feishu-logout-btn');
    const docBrowser = document.getElementById('feishu-doc-browser');
    const notLoggedIn = document.getElementById('feishu-not-logged-in');
    
    if (authData.loggedIn && authData.user) {
        userInfo.style.display = 'inline';
        userName.textContent = authData.user.name || authData.user.open_id;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline';
        docBrowser.style.display = 'block';
        notLoggedIn.style.display = 'none';
        
        loadFeishuDocs();
    } else {
        userInfo.style.display = 'none';
        loginBtn.style.display = 'inline';
        logoutBtn.style.display = 'none';
        docBrowser.style.display = 'none';
        notLoggedIn.style.display = 'block';
    }
}

// Page initialization - these will be called after functions are defined
function initializeApp() {
    // Load language settings
    currentLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'zh';
    
    // Update language button states
    document.getElementById('lang-en').classList.toggle('active', currentLanguage === 'en');
    document.getElementById('lang-zh').classList.toggle('active', currentLanguage === 'zh');
    
    // Load language data
    loadLanguage();
    
    // Refresh UI texts
    refreshUITexts();
    
    // Initialize application
    loadData();
    renderProjects();
    updateProjectSelects();
    loadVersionPlans();
    loadDevPlans();
    loadHealthData();
    
    // Apply saved theme
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    if (savedTheme === 'light') {
        toggleTheme();
    }
    
    // Initialize Feishu integration
    initFeishuAuth();
}