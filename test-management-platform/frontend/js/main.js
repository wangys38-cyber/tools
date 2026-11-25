const STORAGE_KEYS = {
    MODULES: 'test_management_modules',
    TESTCASES: 'test_management_testcases',
    PROJECTS: 'test_management_projects',
    TESTRUNS: 'test_management_testruns',
    USERS: 'test_management_users',
    CURRENT_USER: 'test_management_current_user'
};

let modules = [];
let testcases = [];
let projects = [];
let testruns = [];
let users = [];

let currentUser = null;

let selectedProject = null;
let dashboardStats = { total: 0, pending: 0, in_progress: 0, passed: 0, failed: 0 };

let editingModule = null;
let editingTestcase = null;
let editingProject = null;
let assignProject = null;
let cancelingTestrunId = null;

// 管理员账号不再写死在代码里：首次在本机用管理员登录时，把这组邮箱/密码记到 localStorage
const ADMIN_STORAGE_KEY = 'test_management_admin';

function getLocalAdmin() {
    try {
        const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function setLocalAdmin(username, password) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({
        username: username.trim().toLowerCase(),
        password: password
    }));
}

function loadFromStorage() {
    modules = JSON.parse(localStorage.getItem(STORAGE_KEYS.MODULES) || '[]');
    testcases = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTCASES) || '[]');
    projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    testruns = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTRUNS) || '[]');
    users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    if (users.length === 0) {
        users = [
            { username: 'tester1@test.com', password: '123456', role: 'tester' },
            { username: 'tester2@test.com', password: '654321', role: 'tester' }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    
    console.log('=== 数据加载完成 ===');
    console.log('modules:', modules.length);
    console.log('testcases:', testcases.length);
    console.log('projects:', projects.length);
    console.log('testruns:', testruns.length);
    console.log('users:', users.length);
    console.log('currentUser:', currentUser ? JSON.stringify(currentUser) : 'null');
}

function saveToStorage() {
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
    localStorage.setItem(STORAGE_KEYS.TESTCASES, JSON.stringify(testcases));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    localStorage.setItem(STORAGE_KEYS.TESTRUNS, JSON.stringify(testruns));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;
    const errorElement = document.getElementById('login-error');
    
    if (!username || !password) {
        errorElement.textContent = '请输入邮箱和密码';
        errorElement.style.display = 'block';
        return;
    }
    
    if (!isValidEmail(username)) {
        errorElement.textContent = '请输入有效的邮箱地址';
        errorElement.style.display = 'block';
        return;
    }
    
    errorElement.style.display = 'none';
    
    if (role === 'admin') {
        if (!getLocalAdmin()) {
            if (!confirm('本机还没有管理员账号，是否把 ' + username + ' 设为本机管理员？')) {
                errorElement.textContent = '已取消管理员账号设置';
                errorElement.style.display = 'block';
                return;
            }
            setLocalAdmin(username, password);
        }
        const localAdmin = getLocalAdmin();
        if (localAdmin && localAdmin.username === username.trim().toLowerCase() && localAdmin.password === password) {
            currentUser = { username, role: 'admin' };
            saveToStorage();
            showMainPage();
        } else {
            errorElement.textContent = '管理员邮箱或密码错误';
            errorElement.style.display = 'block';
        }
    } else {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = { username, role: 'tester', name: user.name };
            saveToStorage();
            console.log('登录成功:', JSON.stringify(currentUser));
            console.log('当前testruns数量:', testruns.length);
            console.log('所有testruns:', JSON.stringify(testruns));
            showMainPage();
        } else {
            errorElement.textContent = '测试人员邮箱或密码错误';
            errorElement.style.display = 'block';
        }
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    showLoginPage();
}

function openRegisterModal() {
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm').value = '';
    document.getElementById('register-error').style.display = 'none';
    openModal('register-modal');
}

function register() {
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const errorElement = document.getElementById('register-error');
    
    errorElement.style.display = 'none';
    
    if (!name || !email || !password || !confirm) {
        errorElement.textContent = '请填写所有字段';
        errorElement.style.display = 'block';
        return;
    }
    
    if (!isValidEmail(email)) {
        errorElement.textContent = '请输入有效的邮箱地址';
        errorElement.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        errorElement.textContent = '密码长度至少6位';
        errorElement.style.display = 'block';
        return;
    }
    
    if (password !== confirm) {
        errorElement.textContent = '两次输入的密码不一致';
        errorElement.style.display = 'block';
        return;
    }
    
    const existingUser = users.find(u => u.username === email);
    if (existingUser) {
        errorElement.textContent = '该邮箱已被注册';
        errorElement.style.display = 'block';
        return;
    }
    
    const newUser = {
        username: email,
        password: password,
        name: name,
        role: 'tester',
        created_at: new Date().toLocaleString('zh-CN')
    };
    
    users.push(newUser);
    saveToStorage();
    closeModal('register-modal');
    
    alert('注册成功！请登录');
}

function showLoginPage() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('main-page').style.display = 'none';
}

function showMainPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-page').style.display = 'block';
    document.getElementById('current-user').textContent = '当前用户: ' + currentUser.username + ' (' + (currentUser.role === 'admin' ? '管理员' : '测试人员') + ')';
    
    updateUserPermissions();
    loadAllData();
}

function updateUserPermissions() {
    const navButtons = document.querySelectorAll('.nav-btn');
    if (currentUser.role === 'tester') {
        navButtons.forEach(btn => {
            const section = btn.getAttribute('data-section');
            if (section === 'modules' || section === 'testcases' || section === 'projects' || section === 'testers') {
                btn.style.display = 'none';
            }
        });
        showTab('tasks');
    } else {
        navButtons.forEach(btn => {
            btn.style.display = 'inline-block';
        });
    }
}

async function loadAllData() {
    loadFromStorage();
    render();
}

function render() {
    renderDashboard();
    renderModules();
    renderTestcases();
    renderProjects();
    renderTesters();
    renderHistory();
    renderMyTasks();
    updateTestcaseModuleOptions();
}

function renderDashboard() {
    const container = document.getElementById('dashboard-projects');
    
    if (projects.length === 0) {
        container.innerHTML = '<p>暂无项目，先创建项目</p>';
        return;
    }
    
    let html = '';
    projects.forEach(project => {
        const stats = getProjectStats(project.id);
        html += `
            <div class="project-card" onclick="selectProject(${JSON.stringify(project).replace(/"/g, '&quot;')})">
                <h3>${project.name}</h3>
                <p>固件版本: ${project.firmware_version || '-'}</p>
                <p>APP版本: ${project.app_version || '-'}</p>
                <div class="progress-summary">
                    <span>已执行: ${stats.passed + stats.failed}</span>
                    <span>总用例: ${stats.total}</span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function getProjectStats(projectId) {
    const projectTestruns = testruns.filter(t => t.project_id === projectId);
    return {
        total: projectTestruns.length,
        pending: projectTestruns.filter(t => t.status === 'pending').length,
        in_progress: projectTestruns.filter(t => t.status === 'in_progress').length,
        passed: projectTestruns.filter(t => t.status === 'passed').length,
        failed: projectTestruns.filter(t => t.status === 'failed').length
    };
}

async function selectProject(project) {
    selectedProject = project;
    dashboardStats = getProjectStats(project.id);
    renderDashboardDetail();
}

function renderDashboardDetail() {
    const detail = document.getElementById('dashboard-detail');
    if (!selectedProject) {
        detail.style.display = 'none';
        return;
    }
    detail.style.display = 'block';
    
    document.getElementById('dashboard-project-name').textContent = selectedProject.name + ' - 测试进度';
    
    const successRate = dashboardStats.total > 0 
        ? Math.round((dashboardStats.passed / dashboardStats.total) * 100) 
        : 0;
    
    document.getElementById('stat-total').textContent = dashboardStats.total;
    document.getElementById('stat-pending').textContent = dashboardStats.pending;
    document.getElementById('stat-in-progress').textContent = dashboardStats.in_progress;
    document.getElementById('stat-passed').textContent = dashboardStats.passed;
    document.getElementById('stat-failed').textContent = dashboardStats.failed;
    document.getElementById('stat-success-rate').textContent = successRate + '%';
    
    const projectTestruns = testruns.filter(t => t.project_id === selectedProject.id);
    let runsHtml = '<tr><th><input type="checkbox" id="select-all-testruns" onchange="toggleSelectAllTestruns()"></th><th>用例名称</th><th>模块</th><th>一级功能</th><th>二级功能</th><th>测试人员</th><th>状态</th><th>操作</th></tr>';
    projectTestruns.forEach(run => {
        const testcase = testcases.find(t => t.id === run.testcase_id);
        const module = modules.find(m => m.id === testcase?.module_id);
        runsHtml += `
            <tr>
                <td><input type="checkbox" class="testrun-checkbox" value="${run.id}"></td>
                <td>
                    <div class="testcase-name" onclick="toggleTestcaseDetails(this)">${testcase?.name || '-'}</div>
                    <div class="testcase-details">
                        <div><strong>测试前提:</strong> ${testcase?.prerequisite || '-'}</div>
                        <div><strong>测试步骤:</strong> ${testcase?.steps || '-'}</div>
                        <div><strong>预期结果:</strong> ${testcase?.expected || '-'}</div>
                    </div>
                </td>
                <td>${module?.name || '-'}</td>
                <td>${testcase?.function1 || '-'}</td>
                <td>${testcase?.function2 || '-'}</td>
                <td>${run.tester || '-'}</td>
                <td>
                    <select onchange="updateTestrunStatus('${run.id}', this.value, this)">
                        <option value="pending" ${run.status === 'pending' ? 'selected' : ''}>待测试</option>
                        <option value="in_progress" ${run.status === 'in_progress' ? 'selected' : ''}>进行中</option>
                        <option value="passed" ${run.status === 'passed' ? 'selected' : ''}>通过</option>
                        <option value="failed" ${run.status === 'failed' ? 'selected' : ''}>失败</option>
                    </select>
                </td>
                <td>
                    <button onclick="openCancelModal('${run.id}')">取消</button>
                </td>
            </tr>
        `;
    });
    document.getElementById('dashboard-testruns').innerHTML = runsHtml;
}

function updateTestrunStatus(id, status, selectElement) {
    const testrun = testruns.find(t => t.id === id);
    if (!testrun) {
        alert('未找到测试任务');
        if (selectElement) {
            selectElement.value = '';
        }
        return;
    }
    
    if (currentUser.role === 'tester' && testrun.tester !== currentUser.username) {
        alert('您只能修改自己名下的测试任务');
        if (selectElement) {
            selectElement.value = testrun.status;
        }
        return;
    }
    
    testrun.status = status;
    testrun.updated_at = new Date().toISOString();
    saveToStorage();
    
    if (selectedProject) {
        dashboardStats = getProjectStats(selectedProject.id);
        renderDashboardDetail();
        renderDashboard();
    }
    renderMyTasks();
    renderHistory();
}

function openCancelModal(testrunId) {
    cancelingTestrunId = testrunId;
    openModal('cancel-modal');
}

function confirmCancel() {
    if (!cancelingTestrunId) return;
    
    const index = testruns.findIndex(t => t.id === cancelingTestrunId);
    if (index > -1) {
        testruns.splice(index, 1);
        saveToStorage();
        
        if (selectedProject) {
            dashboardStats = getProjectStats(selectedProject.id);
            renderDashboardDetail();
            renderDashboard();
        }
        renderMyTasks();
        renderHistory();
        
        alert('任务已取消');
    }
    
    closeModal('cancel-modal');
    cancelingTestrunId = null;
}

function toggleSelectAllTestruns() {
    const checkboxes = document.querySelectorAll('.testrun-checkbox');
    const selectAll = document.getElementById('select-all-testruns');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
}

function toggleTestcaseDetails(element) {
    const details = element.nextElementSibling;
    if (details && details.classList.contains('testcase-details')) {
        details.style.display = details.style.display === 'none' || details.style.display === '' ? 'block' : 'none';
    }
}

function cancelSelectedTestruns() {
    const checkboxes = document.querySelectorAll('.testrun-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    
    if (selectedIds.length === 0) {
        alert('请选择要取消的任务');
        return;
    }
    
    if (confirm(`确定要取消选中的 ${selectedIds.length} 个任务吗？`)) {
        testruns = testruns.filter(t => !selectedIds.includes(t.id));
        saveToStorage();
        
        if (selectedProject) {
            dashboardStats = getProjectStats(selectedProject.id);
            renderDashboardDetail();
            renderDashboard();
        }
        renderMyTasks();
        renderHistory();
        
        alert(`成功取消 ${selectedIds.length} 个任务`);
    }
}

function renderModules() {
    const container = document.getElementById('modules-list');
    
    if (modules.length === 0) {
        container.innerHTML = '<p>暂无模块</p>';
        return;
    }
    
    let html = '';
    modules.forEach(module => {
        const count = testcases.filter(t => t.module_id === module.id).length;
        html += `
            <div class="module-card" onclick="showModuleTestcases('${module.id}')">
                <h3>${module.name}</h3>
                <p>${module.description || ''}</p>
                <span class="testcase-count">用例数: ${count}</span>
                <div class="actions">
                    <button onclick="event.stopPropagation(); editModule(${JSON.stringify(module).replace(/"/g, '&quot;')})">编辑</button>
                    <button onclick="event.stopPropagation(); deleteModule('${module.id}')">删除</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function showModuleTestcases(moduleId) {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
        const filter = document.getElementById('testcase-module-filter');
        if (filter) {
            filter.value = moduleId;
        }
        renderTestcases();
        const tab = document.getElementById('testcases-tab');
        if (tab) {
            tab.click();
        }
    }
}

function openAddModuleModal() {
    editingModule = null;
    document.getElementById('module-modal-title').textContent = '添加模块';
    document.getElementById('module-name').value = '';
    document.getElementById('module-description').value = '';
    openModal('add-module-modal');
}

function editModule(module) {
    editingModule = module;
    document.getElementById('module-modal-title').textContent = '编辑模块';
    document.getElementById('module-name').value = module.name;
    document.getElementById('module-description').value = module.description || '';
    openModal('add-module-modal');
}

function saveModule() {
    const name = document.getElementById('module-name').value.trim();
    const description = document.getElementById('module-description').value.trim();
    
    if (!name) {
        alert('请输入模块名称');
        return;
    }
    
    const data = { name, description };
    
    try {
        if (editingModule) {
            const index = modules.findIndex(m => m.id === editingModule.id);
            if (index !== -1) {
                modules[index] = { ...modules[index], ...data, updated_at: new Date().toISOString() };
            }
            alert('模块更新成功');
        } else {
            const newModule = {
                ...data,
                id: Date.now().toString(),
                created_at: new Date().toISOString()
            };
            modules.push(newModule);
            alert('模块添加成功');
        }
        
        saveToStorage();
        closeModal('add-module-modal');
        loadAllData();
    } catch (error) {
        console.error('保存模块失败:', error);
        alert('保存模块失败: ' + (error.message || '未知错误'));
    }
}

function deleteModule(id) {
    if (!confirm('确定删除该模块？')) return;
    
    const testcaseCount = testcases.filter(t => t.module_id === id).length;
    if (testcaseCount > 0) {
        alert('该模块下还有用例，无法删除');
        return;
    }
    
    modules = modules.filter(m => m.id !== id);
    saveToStorage();
    loadAllData();
}

function renderTestcases() {
    const container = document.getElementById('testcases-table-body');
    const filter = document.getElementById('testcase-module-filter');
    const filterModule = filter ? filter.value : '';
    
    let filteredTestcases = testcases;
    if (filterModule) {
        filteredTestcases = testcases.filter(t => t.module_id === filterModule);
    }
    
    if (filteredTestcases.length === 0) {
        container.innerHTML = '<tr><td colspan="10">暂无用例</td></tr>';
        document.getElementById('select-all-testcases').checked = false;
        document.getElementById('btn-batch-delete').style.display = 'none';
        return;
    }
    
    let html = '';
    filteredTestcases.forEach(testcase => {
        const module = modules.find(m => m.id === testcase.module_id);
        html += `
            <tr>
                <td><input type="checkbox" class="testcase-checkbox" value="${testcase.id}" onchange="updateBatchDeleteButton()"></td>
                <td>${testcase.name}</td>
                <td>${module?.name || '-'}</td>
                <td>${testcase.function1 || '-'}</td>
                <td>${testcase.function2 || '-'}</td>
                <td>${testcase.prerequisite || '-'}</td>
                <td>${testcase.steps || '-'}</td>
                <td>${testcase.expected || '-'}</td>
                <td>${testcase.priority === 'high' ? '高' : testcase.priority === 'medium' ? '中' : '低'}</td>
                <td>
                    <button onclick="editTestcaseById('${testcase.id}')">编辑</button>
                    <button onclick="deleteTestcase('${testcase.id}')">删除</button>
                </td>
            </tr>
        `;
    });
    container.innerHTML = html;
    document.getElementById('btn-batch-delete').style.display = 'none';
}

function toggleSelectAllTestcases() {
    const checkboxes = document.querySelectorAll('.testcase-checkbox');
    const selectAll = document.getElementById('select-all-testcases');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
    updateBatchDeleteButton();
}

function updateBatchDeleteButton() {
    const checkboxes = document.querySelectorAll('.testcase-checkbox');
    const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    document.getElementById('btn-batch-delete').style.display = selectedCount > 0 ? 'inline-block' : 'none';
}

function batchDeleteTestcases() {
    const checkboxes = document.querySelectorAll('.testcase-checkbox');
    const selectedIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
    
    if (selectedIds.length === 0) {
        alert('请选择要删除的用例');
        return;
    }
    
    if (!confirm(`确定删除选中的 ${selectedIds.length} 条用例？`)) {
        return;
    }
    
    let deletedCount = 0;
    let notDeletedCount = 0;
    
    selectedIds.forEach(id => {
        const isAssigned = testruns.some(t => t.testcase_id === id);
        if (isAssigned) {
            notDeletedCount++;
        } else {
            testcases = testcases.filter(t => t.id !== id);
            deletedCount++;
        }
    });
    
    saveToStorage();
    loadAllData();
    
    if (notDeletedCount > 0) {
        alert(`成功删除 ${deletedCount} 条用例，${notDeletedCount} 条用例已被下发测试，无法删除`);
    } else {
        alert(`成功删除 ${deletedCount} 条用例`);
    }
}

function toggleSelectAllAssign() {
    const checkboxes = document.querySelectorAll('#assign-testcases input[type="checkbox"]');
    const selectAll = document.getElementById('select-all-assign');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
}

function updateTestcaseModuleOptions() {
    const select = document.getElementById('testcase-module');
    select.innerHTML = '<option value="">选择模块</option>';
    modules.forEach(module => {
        select.innerHTML += `<option value="${module.id}">${module.name}</option>`;
    });
}

function openAddTestcaseModal() {
    editingTestcase = null;
    document.getElementById('testcase-modal-title').textContent = '添加用例';
    document.getElementById('testcase-name').value = '';
    document.getElementById('testcase-module').value = '';
    document.getElementById('testcase-function1').value = '';
    document.getElementById('testcase-function2').value = '';
    document.getElementById('testcase-prerequisite').value = '';
    document.getElementById('testcase-steps').value = '';
    document.getElementById('testcase-expected').value = '';
    document.getElementById('testcase-priority').value = 'medium';
    openModal('add-testcase-modal');
}

function editTestcaseById(id) {
    const testcase = testcases.find(t => t.id === id);
    if (testcase) {
        editTestcase(testcase);
    }
}

function editTestcase(testcase) {
    editingTestcase = testcase;
    document.getElementById('testcase-modal-title').textContent = '编辑用例';
    document.getElementById('testcase-name').value = testcase.name;
    document.getElementById('testcase-module').value = testcase.module_id;
    document.getElementById('testcase-function1').value = testcase.function1 || '';
    document.getElementById('testcase-function2').value = testcase.function2 || '';
    document.getElementById('testcase-prerequisite').value = testcase.prerequisite || '';
    document.getElementById('testcase-steps').value = testcase.steps || '';
    document.getElementById('testcase-expected').value = testcase.expected || '';
    document.getElementById('testcase-priority').value = testcase.priority || 'medium';
    openModal('add-testcase-modal');
}

function saveTestcase() {
    const name = document.getElementById('testcase-name').value.trim();
    const module_id = document.getElementById('testcase-module').value;
    const function1 = document.getElementById('testcase-function1').value.trim();
    const function2 = document.getElementById('testcase-function2').value.trim();
    const prerequisite = document.getElementById('testcase-prerequisite').value.trim();
    const steps = document.getElementById('testcase-steps').value.trim();
    const expected = document.getElementById('testcase-expected').value.trim();
    const priority = document.getElementById('testcase-priority').value;
    
    if (!name) {
        alert('请输入用例名称');
        return;
    }
    
    if (!module_id) {
        alert('请选择模块');
        return;
    }
    
    const data = { name, module_id, function1, function2, prerequisite, steps, expected, priority };
    
    try {
        if (editingTestcase) {
            const index = testcases.findIndex(t => t.id === editingTestcase.id);
            if (index !== -1) {
                testcases[index] = { ...testcases[index], ...data, updated_at: new Date().toISOString() };
            }
            alert('用例更新成功');
        } else {
            const newTestcase = {
                ...data,
                id: Date.now().toString(),
                created_at: new Date().toISOString()
            };
            testcases.push(newTestcase);
            alert('用例添加成功');
        }
        
        saveToStorage();
        closeModal('add-testcase-modal');
        loadAllData();
    } catch (error) {
        console.error('保存用例失败:', error);
        alert('保存用例失败: ' + (error.message || '未知错误'));
    }
}

function deleteTestcase(id) {
    if (!confirm('确定删除该用例？')) return;
    
    const runCount = testruns.filter(t => t.testcase_id === id).length;
    if (runCount > 0) {
        alert('该用例已被下发测试，无法删除');
        return;
    }
    
    testcases = testcases.filter(t => t.id !== id);
    saveToStorage();
    loadAllData();
}

function renderProjects() {
    const container = document.getElementById('projects-list');
    
    if (projects.length === 0) {
        container.innerHTML = '<p>暂无项目</p>';
        return;
    }
    
    let html = '';
    projects.forEach(project => {
        const stats = getProjectStats(project.id);
        html += `
            <div class="project-item">
                <h3>${project.name}</h3>
                <p>固件版本: ${project.firmware_version || '-'}</p>
                <p>APP版本: ${project.app_version || '-'}</p>
                <div class="progress-mini">
                    <span>进度: ${stats.passed + stats.failed}/${stats.total}</span>
                </div>
                <div class="actions">
                    <button onclick="assignTestcases('${project.id}')">下发用例</button>
                    <button onclick="editProject(${JSON.stringify(project).replace(/"/g, '&quot;')})">编辑</button>
                    <button onclick="deleteProject('${project.id}')">删除</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function openAddProjectModal() {
    editingProject = null;
    document.getElementById('project-modal-title').textContent = '添加项目';
    document.getElementById('project-name').value = '';
    document.getElementById('project-firmware').value = '';
    document.getElementById('project-app').value = '';
    openModal('add-project-modal');
}

function editProject(project) {
    editingProject = project;
    document.getElementById('project-modal-title').textContent = '编辑项目';
    document.getElementById('project-name').value = project.name;
    document.getElementById('project-firmware').value = project.firmware_version || '';
    document.getElementById('project-app').value = project.app_version || '';
    openModal('add-project-modal');
}

function saveProject() {
    const name = document.getElementById('project-name').value.trim();
    const firmware_version = document.getElementById('project-firmware').value.trim();
    const app_version = document.getElementById('project-app').value.trim();
    
    if (!name) {
        alert('请输入项目名称');
        return;
    }
    
    const data = { name, firmware_version, app_version };
    
    try {
        if (editingProject) {
            const index = projects.findIndex(p => p.id === editingProject.id);
            if (index !== -1) {
                projects[index] = { ...projects[index], ...data, updated_at: new Date().toISOString() };
            }
            alert('项目更新成功');
        } else {
            const newProject = {
                ...data,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
                status: 'active'
            };
            projects.push(newProject);
            alert('项目添加成功');
        }
        
        saveToStorage();
        closeModal('add-project-modal');
        loadAllData();
    } catch (error) {
        console.error('保存项目失败:', error);
        alert('保存项目失败: ' + (error.message || '未知错误'));
    }
}

function deleteProject(id) {
    if (!confirm('确定删除该项目？')) return;
    
    const runCount = testruns.filter(t => t.project_id === id).length;
    if (runCount > 0) {
        alert('该项目下还有测试用例，无法删除');
        return;
    }
    
    projects = projects.filter(p => p.id !== id);
    saveToStorage();
    loadAllData();
}

function deleteTestrun(id) {
    if (!confirm('确定删除该测试记录？')) return;
    
    testruns = testruns.filter(t => t.id !== id);
    saveToStorage();
    if (selectedProject) {
        dashboardStats = getProjectStats(selectedProject.id);
        renderDashboardDetail();
        renderDashboard();
    }
    renderMyTasks();
}

function assignTestcases(projectId) {
    assignProject = projectId;
    const project = projects.find(p => p.id === projectId);
    document.getElementById('assign-title').textContent = '分配用例 - ' + (project?.name || '');
    
    const assignedTestcaseIds = testruns.filter(t => t.project_id === projectId).map(t => t.testcase_id);
    const availableTestcases = testcases.filter(t => !assignedTestcaseIds.includes(t.id));
    
    let html = '';
    availableTestcases.forEach(testcase => {
        const module = modules.find(m => m.id === testcase.module_id);
        html += `
            <div class="assign-item">
                <input type="checkbox" id="tc-${testcase.id}" value="${testcase.id}">
                <label for="tc-${testcase.id}">
                    <span>${testcase.name}</span>
                    <span class="module-tag">${module?.name || '-'}</span>
                </label>
            </div>
        `;
    });
    
    document.getElementById('assign-testcases').innerHTML = html || '<p>没有可用的用例</p>';
    
    const testerSelect = document.getElementById('assign-tester');
    testerSelect.innerHTML = '<option value="">请选择测试人员</option>';
    const testers = users.filter(u => u.role === 'tester');
    testers.forEach(tester => {
        const option = document.createElement('option');
        option.value = tester.username;
        option.textContent = tester.username;
        testerSelect.appendChild(option);
    });
    
    openModal('assign-modal');
}

function saveAssignments() {
    const checkboxes = document.querySelectorAll('#assign-testcases input[type="checkbox"]');
    const selectedIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
    
    const tester = document.getElementById('assign-tester').value;
    if (!tester) {
        alert('请选择测试人员');
        return;
    }
    
    selectedIds.forEach(testcaseId => {
        const newTestrun = {
            id: Date.now().toString() + '-' + testcaseId,
            project_id: assignProject,
            testcase_id: testcaseId,
            tester: tester,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        testruns.push(newTestrun);
    });
    
    saveToStorage();
    closeModal('assign-modal');
    loadAllData();
    alert('用例下发成功');
}

function renderMyTasks() {
    const container = document.getElementById('my-tasks-body');
    const statsContainer = document.getElementById('my-tasks-stats');
    
    if (!currentUser) {
        container.innerHTML = '<tr><td colspan="8">请先登录</td></tr>';
        return;
    }
    
    const debugInfo = document.getElementById('my-tasks-debug');
    const currentUserLower = currentUser.username.toLowerCase().trim();
    
    let taskDetails = '';
    testruns.forEach((t, index) => {
        const taskTesterLower = t.tester ? t.tester.toLowerCase().trim() : '';
        const matches = currentUserLower === taskTesterLower ? '✓ 匹配' : '✗ 不匹配';
        taskDetails += `<div>任务${index+1}: tester="${t.tester || '空'}", 匹配: ${matches}</div>`;
    });
    
    if (debugInfo) {
        debugInfo.innerHTML = `
            <div style="padding: 1rem; background: #f7fafc; border-radius: 4px; margin-bottom: 1rem; font-size: 0.85rem;">
                <strong>=== 调试信息 ===</strong><br>
                当前用户: "${currentUser.username}"<br>
                当前用户(小写): "${currentUserLower}"<br>
                用户角色: ${currentUser.role}<br>
                总任务数: ${testruns.length}<br>
                <br><strong>所有任务详情:</strong><br>
                ${taskDetails || '无任务'}
            </div>
        `;
    }
    
    const myTestruns = testruns.filter(t => {
        const taskTester = t.tester ? t.tester.toLowerCase().trim() : '';
        return taskTester === currentUserLower;
    });
    
    const stats = {
        total: myTestruns.length,
        pending: myTestruns.filter(t => t.status === 'pending').length,
        in_progress: myTestruns.filter(t => t.status === 'in_progress').length,
        passed: myTestruns.filter(t => t.status === 'passed').length,
        failed: myTestruns.filter(t => t.status === 'failed').length
    };
    
    statsContainer.innerHTML = `
        <div class="stat-card total">
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">总任务数</div>
        </div>
        <div class="stat-card pending">
            <div class="stat-value">${stats.pending}</div>
            <div class="stat-label">待测试</div>
        </div>
        <div class="stat-card in-progress">
            <div class="stat-value">${stats.in_progress}</div>
            <div class="stat-label">进行中</div>
        </div>
        <div class="stat-card passed">
            <div class="stat-value">${stats.passed}</div>
            <div class="stat-label">通过</div>
        </div>
        <div class="stat-card failed">
            <div class="stat-value">${stats.failed}</div>
            <div class="stat-label">失败</div>
        </div>
    `;
    
    if (myTestruns.length === 0) {
        container.innerHTML = '<tr><td colspan="8">暂无测试任务</td></tr>';
        return;
    }
    
    let html = '';
    myTestruns.forEach(run => {
        const testcase = testcases.find(t => t.id === run.testcase_id);
        const module = modules.find(m => m.id === testcase?.module_id);
        const project = projects.find(p => p.id === run.project_id);
        html += `
            <tr>
                <td>${testcase?.name || '-'}</td>
                <td>${module?.name || '-'}</td>
                <td>${testcase?.prerequisite || '-'}</td>
                <td>${testcase?.steps || '-'}</td>
                <td>${testcase?.expected || '-'}</td>
                <td>${project?.name || '-'}</td>
                <td>
                    <select onchange="updateTestrunStatus('${run.id}', this.value, this)">
                        <option value="pending" ${run.status === 'pending' ? 'selected' : ''}>待测试</option>
                        <option value="in_progress" ${run.status === 'in_progress' ? 'selected' : ''}>进行中</option>
                        <option value="passed" ${run.status === 'passed' ? 'selected' : ''}>通过</option>
                        <option value="failed" ${run.status === 'failed' ? 'selected' : ''}>失败</option>
                    </select>
                </td>
                <td>
                    <button onclick="viewTestcaseDetail('${run.testcase_id}')">查看详情</button>
                </td>
            </tr>
        `;
    });
    container.innerHTML = html;
}

function viewTestcaseDetail(testcaseId) {
    const testcase = testcases.find(t => t.id === testcaseId);
    if (testcase) {
        const module = modules.find(m => m.id === testcase.module_id);
        alert(`用例详情:\n名称: ${testcase.name}\n模块: ${module?.name || '-'}\n优先级: ${testcase.priority === 'high' ? '高' : testcase.priority === 'medium' ? '中' : '低'}\n描述: ${testcase.description || '无'}`);
    }
}

function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function showTab(tabId) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    const section = document.getElementById(tabId);
    if (section) {
        section.classList.add('active');
    }
    
    const navBtn = document.querySelector(`[data-section="${tabId}"]`);
    if (navBtn) {
        navBtn.classList.add('active');
    }
}

function filterTestcases() {
    renderTestcases();
}

function renderTesters() {
    const container = document.getElementById('testers-body');
    const testers = users.filter(u => u.role === 'tester');
    
    if (testers.length === 0) {
        container.innerHTML = '<tr><td colspan="5">暂无测试人员</td></tr>';
        return;
    }
    
    let html = '';
    testers.forEach((tester, index) => {
        const taskCount = testruns.filter(t => t.tester === tester.username).length;
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${tester.name || '-'}</td>
                <td>${tester.username}</td>
                <td>${tester.created_at || '-'}</td>
                <td>${taskCount > 0 ? `有 ${taskCount} 个任务` : '空闲'}</td>
            </tr>
        `;
    });
    container.innerHTML = html;
}

function renderHistory() {
    const container = document.getElementById('history-table-body');
    
    const completedTestruns = testruns.filter(t => t.status !== 'pending' && t.status !== 'in_progress');
    
    if (completedTestruns.length === 0) {
        container.innerHTML = '<tr><td colspan="7">暂无测试历史记录</td></tr>';
        return;
    }
    
    const sortedTestruns = completedTestruns.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
    
    let html = '';
    sortedTestruns.forEach(testrun => {
        const project = projects.find(p => p.id === testrun.project_id);
        const testcase = testcases.find(t => t.id === testrun.testcase_id);
        const module = testcase ? modules.find(m => m.id === testcase.module_id) : null;
        
        html += `
            <tr>
                <td>${project?.name || '-'}</td>
                <td>${testcase?.name || '-'}</td>
                <td>${module?.name || '-'}</td>
                <td>${testrun.tester || '-'}</td>
                <td><span class="status-badge ${testrun.status}">${getStatusText(testrun.status)}</span></td>
                <td>${formatDate(testrun.updated_at || testrun.created_at)}</td>
                <td>${testrun.remarks || '-'}</td>
            </tr>
        `;
    });
    container.innerHTML = html;
}

function getStatusText(status) {
    const statusMap = {
        pending: '待测试',
        in_progress: '进行中',
        passed: '通过',
        failed: '失败'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function exportTestResults() {
    const completedTestruns = testruns.filter(t => t.status !== 'pending' && t.status !== 'in_progress');
    
    if (completedTestruns.length === 0) {
        alert('没有可导出的测试结果');
        return;
    }
    
    let csvContent = '项目,用例名称,模块,测试人员,测试状态,测试时间,备注\n';
    
    completedTestruns.forEach(testrun => {
        const project = projects.find(p => p.id === testrun.project_id);
        const testcase = testcases.find(t => t.id === testrun.testcase_id);
        const module = testcase ? modules.find(m => m.id === testcase.module_id) : null;
        
        const row = [
            `"${project?.name || '-'}"`,
            `"${testcase?.name || '-'}"`,
            `"${module?.name || '-'}"`,
            `"${testrun.tester || '-'}"`,
            `"${getStatusText(testrun.status)}"`,
            `"${formatDate(testrun.updated_at || testrun.created_at)}"`,
            `"${testrun.remarks || '-'}"`
        ];
        
        csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `测试结果_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

let importedTestcases = [];

function openImportModal() {
    importedTestcases = [];
    document.getElementById('import-preview').style.display = 'none';
    document.getElementById('btn-import').style.display = 'none';
    document.getElementById('excel-file').value = '';
    openModal('import-excel-modal');
}

function handleExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            parseExcel(workbook);
        } catch (error) {
            alert('解析Excel文件失败: ' + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

function parseExcel(workbook) {
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: ['name', 'module', 'function1', 'function2', 'prerequisite', 'steps', 'expected', 'priority'],
        raw: false
    });
    
    if (jsonData.length === 0) {
        alert('Excel文件中没有数据');
        return;
    }
    
    const firstRow = jsonData[0];
    const hasHeader = isHeaderRow(firstRow);
    
    importedTestcases = [];
    const startRow = hasHeader ? 1 : 0;
    
    for (let i = startRow; i < jsonData.length; i++) {
        const row = jsonData[i];
        const name = row.name != null ? String(row.name).trim() : '';
        const module = row.module != null ? String(row.module).trim() : '';
        
        if (!name || !module) continue;
        
        importedTestcases.push({
            name: name,
            module: module,
            function1: row.function1 != null ? String(row.function1).trim() : '',
            function2: row.function2 != null ? String(row.function2).trim() : '',
            prerequisite: row.prerequisite != null ? String(row.prerequisite).trim() : '',
            steps: row.steps != null ? String(row.steps).trim() : '',
            expected: row.expected != null ? String(row.expected).trim() : '',
            priority: row.priority != null ? String(row.priority).trim().toLowerCase() : 'medium'
        });
    }
    
    if (importedTestcases.length === 0) {
        alert('没有找到有效的用例数据\n\n请确保Excel文件格式正确：\n第1列：用例名称（必填）\n第2列：模块名称（必填）');
        return;
    }
    
    showImportPreview();
}

function isHeaderRow(row) {
    const headerKeywords = ['用例名称', '名称', 'testcase', 'name', '模块', 'module', '功能', 'function'];
    const nameValue = row.name != null ? String(row.name).toLowerCase().trim() : '';
    const moduleValue = row.module != null ? String(row.module).toLowerCase().trim() : '';
    
    return headerKeywords.some(keyword => nameValue.includes(keyword) || moduleValue.includes(keyword));
}

function showImportPreview() {
    const previewBody = document.getElementById('import-preview-body');
    let html = '';
    const displayCount = Math.min(5, importedTestcases.length);
    
    for (let i = 0; i < displayCount; i++) {
        const tc = importedTestcases[i];
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>${tc.name}</td>
                <td>${tc.module}</td>
                <td>${tc.function1 || '-'}</td>
                <td>${tc.function2 || '-'}</td>
                <td>${tc.priority === 'high' ? '高' : tc.priority === 'low' ? '低' : '中'}</td>
            </tr>
        `;
    }
    
    if (importedTestcases.length > 5) {
        html += `<tr><td colspan="6" style="text-align: center; color: #718096;">... 还有 ${importedTestcases.length - 5} 条数据</td></tr>`;
    }
    
    previewBody.innerHTML = html;
    document.getElementById('import-preview').style.display = 'block';
    document.getElementById('btn-import').style.display = 'inline-block';
}

function importTestcases() {
    if (importedTestcases.length === 0) return;
    
    let successCount = 0;
    let newModuleCount = 0;
    const createdModules = {};
    
    importedTestcases.forEach(tc => {
        const moduleName = tc.module.trim();
        
        let moduleId = modules.find(m => m.name.trim().toLowerCase() === moduleName.toLowerCase())?.id;
        
        if (!moduleId) {
            const cachedId = Object.keys(createdModules).find(key => key.toLowerCase() === moduleName.toLowerCase());
            if (cachedId) {
                moduleId = createdModules[cachedId];
            } else {
                const newModule = {
                    id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9) + '-module',
                    name: moduleName,
                    description: '自动创建的模块',
                    created_at: new Date().toISOString()
                };
                modules.push(newModule);
                moduleId = newModule.id;
                createdModules[moduleName] = moduleId;
                newModuleCount++;
            }
        }
        
        const priority = tc.priority === 'high' || tc.priority === '高' || tc.priority === 'HIGH' ? 'high' :
                         tc.priority === 'low' || tc.priority === '低' || tc.priority === 'LOW' ? 'low' : 'medium';
        
        const newTestcase = {
            id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
            name: tc.name,
            module_id: moduleId,
            function1: tc.function1,
            function2: tc.function2,
            prerequisite: tc.prerequisite,
            steps: tc.steps,
            expected: tc.expected,
            priority: priority,
            created_at: new Date().toISOString()
        };
        
        testcases.push(newTestcase);
        successCount++;
    });
    
    saveToStorage();
    closeModal('import-excel-modal');
    loadAllData();
    
    alert(`成功导入 ${successCount} 条用例，${newModuleCount > 0 ? '自动创建了 ' + newModuleCount + ' 个新模块' : ''}`);
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    
    if (currentUser) {
        showMainPage();
    } else {
        showLoginPage();
    }
    
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectionId = e.target.getAttribute('data-section');
            if (sectionId) {
                showTab(sectionId);
            }
        });
    });
});