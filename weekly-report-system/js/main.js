const STORAGE_KEY = 'weekly_reports';
let reports = [];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadReports();
    initEventListeners();
    renderTable();
    updateCharts();
});

// 加载数据
function loadReports() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        reports = JSON.parse(saved);
    } else {
        // 初始化示例数据
        reports = [
            {
                id: 1,
                week: '2024-W01',
                date: '2024-01-05',
                author: '张三',
                power: 6,
                performance: 5,
                integration: 4,
                stability: 7,
                algorithm: 5,
                progress: '完成了设备功耗优化的初步调研，制定了优化方案。',
                issues: '硬件驱动存在兼容性问题，正在协调硬件团队解决。',
                nextWeek: '开始实施功耗优化方案，完成性能测试框架搭建。'
            },
            {
                id: 2,
                week: '2024-W02',
                date: '2024-01-12',
                author: '李四',
                power: 7,
                performance: 6,
                integration: 5,
                stability: 8,
                algorithm: 6,
                progress: '完成了性能测试框架，开始进行基准测试。',
                issues: '算法复杂度较高，需要优化。',
                nextWeek: '优化核心算法，提升系统稳定性。'
            },
            {
                id: 3,
                week: '2024-W03',
                date: '2024-01-19',
                author: '张三',
                power: 7,
                performance: 7,
                integration: 6,
                stability: 8,
                algorithm: 7,
                progress: '完成算法优化，性能提升30%。',
                issues: '暂无重大问题。',
                nextWeek: '进行功能集成测试，准备版本发布。'
            },
            {
                id: 4,
                week: '2024-W04',
                date: '2024-01-26',
                author: '李四',
                power: 8,
                performance: 8,
                integration: 8,
                stability: 9,
                algorithm: 8,
                progress: '完成功能集成测试，准备发布beta版本。',
                issues: '部分边缘场景需要进一步测试。',
                nextWeek: '完成边缘场景测试，发布正式版本。'
            }
        ];
        saveReports();
    }
}

// 保存数据
function saveReports() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

// 初始化事件监听
function initEventListeners() {
    // 表单提交
    document.getElementById('report-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitReport();
    });

    // 滑块值显示
    const sliders = ['power', 'performance', 'integration', 'stability', 'algorithm'];
    sliders.forEach(id => {
        const slider = document.getElementById(id);
        const valueDisplay = document.getElementById(`${id}-value`);
        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });
    });
}

// 提交周报
function submitReport() {
    const report = {
        id: Date.now(),
        week: document.getElementById('week').value,
        date: document.getElementById('date').value,
        author: document.getElementById('author').value,
        power: parseInt(document.getElementById('power').value),
        performance: parseInt(document.getElementById('performance').value),
        integration: parseInt(document.getElementById('integration').value),
        stability: parseInt(document.getElementById('stability').value),
        algorithm: parseInt(document.getElementById('algorithm').value),
        progress: document.getElementById('progress').value,
        issues: document.getElementById('issues').value,
        nextWeek: document.getElementById('nextWeek').value
    };

    reports.push(report);
    saveReports();
    renderTable();
    updateCharts();
    resetForm();
    alert('周报提交成功！');
}

// 重置表单
function resetForm() {
    document.getElementById('report-form').reset();
    // 重置滑块显示值
    ['power', 'performance', 'integration', 'stability', 'algorithm'].forEach(id => {
        document.getElementById(`${id}-value`).textContent = '5';
    });
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('report-table-body');
    const emptyState = document.getElementById('empty-table');

    if (reports.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    
    // 按日期降序排序
    const sortedReports = [...reports].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tbody.innerHTML = sortedReports.map(report => `
        <tr>
            <td>${report.week}</td>
            <td>${report.date}</td>
            <td>${report.author}</td>
            <td><span class="score">${report.power}</span></td>
            <td><span class="score">${report.performance}</span></td>
            <td><span class="score">${report.integration}</span></td>
            <td><span class="score">${report.stability}</span></td>
            <td><span class="score">${report.algorithm}</span></td>
            <td>${report.progress.substring(0, 30)}${report.progress.length > 30 ? '...' : ''}</td>
            <td>
                <button onclick="showPreview(${report.id})" class="btn btn-sm">预览</button>
                <button onclick="deleteReport(${report.id})" class="btn btn-sm btn-delete">删除</button>
            </td>
        </tr>
    `).join('');
}

// 预览周报
function showPreview(id) {
    const report = reports.find(r => r.id === id);
    if (!report) return;

    const content = `
        <h4>${report.week} - ${report.date}</h4>
        <p><strong>作者：</strong>${report.author}</p>
        
        <h5>核心指标评分：</h5>
        <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <tr><th style="border:1px solid #ddd; padding:8px;">指标</th><th style="border:1px solid #ddd; padding:8px;">评分</th></tr>
            <tr><td style="border:1px solid #ddd; padding:8px;">功耗优化</td><td style="border:1px solid #ddd; padding:8px;">${report.power}/10</td></tr>
            <tr><td style="border:1px solid #ddd; padding:8px;">性能指标</td><td style="border:1px solid #ddd; padding:8px;">${report.performance}/10</td></tr>
            <tr><td style="border:1px solid #ddd; padding:8px;">功能集成</td><td style="border:1px solid #ddd; padding:8px;">${report.integration}/10</td></tr>
            <tr><td style="border:1px solid #ddd; padding:8px;">稳定性</td><td style="border:1px solid #ddd; padding:8px;">${report.stability}/10</td></tr>
            <tr><td style="border:1px solid #ddd; padding:8px;">算法优化</td><td style="border:1px solid #ddd; padding:8px;">${report.algorithm}/10</td></tr>
        </table>

        <h5>本周进展：</h5>
        <p>${report.progress || '无'}</p>

        <h5>问题与风险：</h5>
        <p>${report.issues || '无'}</p>

        <h5>下周计划：</h5>
        <p>${report.nextWeek || '无'}</p>
    `;

    document.getElementById('preview-content').innerHTML = content;
    document.getElementById('preview-modal').style.display = 'flex';
}

// 关闭预览
function closePreview() {
    document.getElementById('preview-modal').style.display = 'none';
}

// 导出预览
function exportPreview() {
    const content = document.getElementById('preview-content').innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `周报_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
}

// 删除周报
function deleteReport(id) {
    if (!confirm('确定要删除这条周报吗？')) return;
    reports = reports.filter(r => r.id !== id);
    saveReports();
    renderTable();
    updateCharts();
}

// 更新图表
function updateCharts() {
    if (reports.length === 0) return;

    // 按日期排序
    const sortedReports = [...reports].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedReports.map(r => r.week);

    // 折线图数据
    const lineData = {
        labels: labels,
        datasets: [
            { label: '功耗', data: sortedReports.map(r => r.power), borderColor: '#FF6384', tension: 0.3 },
            { label: '性能', data: sortedReports.map(r => r.performance), borderColor: '#36A2EB', tension: 0.3 },
            { label: '功能集成', data: sortedReports.map(r => r.integration), borderColor: '#FFCE56', tension: 0.3 },
            { label: '稳定性', data: sortedReports.map(r => r.stability), borderColor: '#4BC0C0', tension: 0.3 },
            { label: '算法', data: sortedReports.map(r => r.algorithm), borderColor: '#9966FF', tension: 0.3 }
        ]
    };

    // 柱状图数据（最新一周）
    const latestReport = sortedReports[sortedReports.length - 1];
    const barData = {
        labels: ['功耗', '性能', '功能集成', '稳定性', '算法'],
        datasets: [{
            label: latestReport.week,
            data: [latestReport.power, latestReport.performance, latestReport.integration, latestReport.stability, latestReport.algorithm],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
    };

    // 雷达图数据（最新一周）
    const radarData = {
        labels: ['功耗', '性能', '功能集成', '稳定性', '算法'],
        datasets: [{
            label: latestReport.week,
            data: [latestReport.power, latestReport.performance, latestReport.integration, latestReport.stability, latestReport.algorithm],
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            borderColor: '#667eea',
            borderWidth: 2
        }]
    };

    // 渲染图表
    renderLineChart(lineData);
    renderBarChart(barData);
    renderRadarChart(radarData);
}

// 渲染折线图
function renderLineChart(data) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true, max: 10 } }
        }
    });
}

// 渲染柱状图
function renderBarChart(data) {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true, max: 10 } }
        }
    });
}

// 渲染雷达图
function renderRadarChart(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
            scales: { r: { beginAtZero: true, max: 10 } }
        }
    });
}

// 导出数据
function exportData() {
    if (reports.length === 0) {
        alert('暂无数据可导出');
        return;
    }

    // 生成CSV
    let csv = '周次,日期,作者,功耗,性能,功能集成,稳定性,算法,本周进展,问题与风险,下周计划\n';
    reports.forEach(report => {
        csv += `"${report.week}","${report.date}","${report.author}",${report.power},${report.performance},${report.integration},${report.stability},${report.algorithm},"${report.progress}","${report.issues}","${report.nextWeek}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `周报数据_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// 切换标签页
function showTab(tabId) {
    // 隐藏所有内容
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    // 显示选中的内容
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');

    // 如果切换到图表页面，更新图表
    if (tabId === 'charts') {
        updateCharts();
    }
}