// 全局变量
let modules = [];
let testcases = [];
let projects = [];
let testcaseLibrary = [];
let selectedTestcaseIds = [];
let overallChart = null;
let currentUser = null;

// DOM 元素
let navItems, sections, addTestcaseBtn, addModuleBtn, addProjectBtn, addTestcaseLibraryBtn, assignTestcasesBtn;
let moduleFilter, projectSelect, selectAllCheckbox, testcaseItems, moduleItems, projectItems, testcaseLibraryItems, moduleProgressCards, header;

// 模态框
let addTestcaseModal, addModuleModal, addProjectModal, addTestcaseLibraryModal, assignTestcasesModal, closeButtons;

// 表单
let addTestcaseForm, addModuleForm, addProjectForm, addTestcaseLibraryForm, assignTestcasesForm;

// 通知
let notification, notificationMessage;

// 初始化DOM元素
function initDOM() {
    // DOM 元素
    navItems = document.querySelectorAll('.nav-item');
    sections = document.querySelectorAll('.section');
    addTestcaseBtn = document.getElementById('add-testcase-btn');
    addModuleBtn = document.getElementById('add-module-btn');
    addProjectBtn = document.getElementById('add-project-btn');
    addTestcaseLibraryBtn = document.getElementById('add-testcase-library-btn');
    assignTestcasesBtn = document.getElementById('assign-testcases-btn');
    moduleFilter = document.getElementById('module-filter');
    projectSelect = document.getElementById('project-select');
    selectAllCheckbox = document.getElementById('select-all');
    testcaseItems = document.getElementById('testcase-items');
    moduleItems = document.getElementById('module-items');
    projectItems = document.getElementById('project-items');
    testcaseLibraryItems = document.getElementById('testcase-library-items');
    moduleProgressCards = document.getElementById('module-progress-cards');
    header = document.querySelector('.header');

    // 模态框
    addTestcaseModal = document.getElementById('add-testcase-modal');
    addModuleModal = document.getElementById('add-module-modal');
    addProjectModal = document.getElementById('add-project-modal');
    addTestcaseLibraryModal = document.getElementById('add-testcase-library-modal');
    assignTestcasesModal = document.getElementById('assign-testcases-modal');
    closeButtons = document.querySelectorAll('.close-btn, .close-modal');

    // 表单
    addTestcaseForm = document.getElementById('add-testcase-form');
    addModuleForm = document.getElementById('add-module-form');
    addProjectForm = document.getElementById('add-project-form');
    addTestcaseLibraryForm = document.getElementById('add-testcase-library-form');
    assignTestcasesForm = document.getElementById('assign-testcases-form');

    // 通知
    notification = document.getElementById('notification');
    notificationMessage = document.getElementById('notification-message');
}

// 检查登录状态
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
        currentUser = JSON.parse(userStr);
        return true;
    }
    return false;
}

// 初始化
async function init() {
    // 检查登录状态
    if (!checkLoginStatus()) {
        window.location.href = 'auth.html';
        return;
    }
    
    // 首先更新UI，确保所有元素都显示出来
    updateUIByRole(currentUser.role);
    
    // 然后初始化DOM元素
    initDOM();
    
    // 添加用户信息和登出按钮到头部
    addUserInfoToHeader();
    
    // 加载所有数据，让每个fetch函数自己处理权限问题
    await Promise.all([
        fetchModules(),
        fetchProjects(),
        fetchTestcaseLibrary(),
        fetchTestcases(),
        fetchTestProgress()
    ]);
    
    setupEventListeners();
    setupEditTestcaseForm();
    setupEditModuleForm();
    setupEditProjectForm();
    setupEditTestcaseLibraryForm();
    renderTestcases();
    renderModules();
    renderProjects();
    renderTestcaseLibrary();
    updateTestProgress();
    
    // 再次根据用户角色更新UI，确保所有新创建的DOM元素都能正确显示或隐藏
    updateUIByRole(currentUser.role);
}

// 根据用户角色更新UI
function updateUIByRole(role) {
    // 让所有用户都能看到所有功能，不需要权限区分
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        el.classList.remove('admin-only');
    });
}

// 添加用户信息到头部
function addUserInfoToHeader() {
    if (!currentUser) return;
    
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.innerHTML = `
        <span class="user-email">${currentUser.email}</span>
        ${currentUser.role === 'admin' ? '<a href="#approval" class="nav-item">审批管理</a>' : ''}
        <button id="logout-btn" class="btn secondary">登出</button>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .user-email {
            font-weight: 500;
            color: #333;
        }
    `;
    document.head.appendChild(style);
    
    header.appendChild(userInfo);
    
    // 添加登出事件监听
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'auth.html';
    });
    
    // 添加审批管理导航切换
    if (currentUser.role === 'admin') {
        const approvalNav = document.querySelector('a[href="#approval"]');
        approvalNav.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = approvalNav.getAttribute('href').substring(1);
            
            // 更新导航状态
            navItems.forEach(nav => nav.classList.remove('active'));
            approvalNav.classList.add('active');
            
            // 更新内容区域
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            // 加载审批页面
            loadApprovalPage();
        });
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 导航切换
    if (navItems && navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);
                
                // 更新导航状态
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // 更新内容区域
                if (sections && sections.length > 0) {
                    sections.forEach(section => {
                        section.classList.remove('active');
                        if (section.id === targetId) {
                            section.classList.add('active');
                        }
                    });
                }
                
                // 如果切换到测试进度页面，更新进度
                if (targetId === 'dashboard') {
                    fetchTestProgress().then(updateTestProgress);
                }
            });
        });
    }
    
    // 模块筛选
    if (moduleFilter) {
        moduleFilter.addEventListener('change', renderTestcases);
    }
    
    // 全选/取消全选
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.testcase-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
                const testcaseId = checkbox.dataset.testcaseId;
                if (e.target.checked) {
                    if (!selectedTestcaseIds.includes(testcaseId)) {
                        selectedTestcaseIds.push(testcaseId);
                    }
                } else {
                    selectedTestcaseIds = selectedTestcaseIds.filter(id => id !== testcaseId);
                }
            });
            updateAssignButtonState();
        });
    }
    
    // 添加用例按钮
    if (addTestcaseBtn) {
        addTestcaseBtn.addEventListener('click', () => {
            // 填充模块选择
            const testcaseModule = document.getElementById('testcase-module');
            if (testcaseModule) {
                testcaseModule.innerHTML = '<option value="">请选择模块</option>';
                modules.forEach(module => {
                    const option = document.createElement('option');
                    option.value = module.id;
                    option.textContent = module.name;
                    testcaseModule.appendChild(option);
                });
            }
            if (addTestcaseModal) {
                addTestcaseModal.classList.add('show');
            }
        });
    }
    
    // 添加模块按钮
    if (addModuleBtn) {
        addModuleBtn.addEventListener('click', () => {
            if (addModuleModal) {
                addModuleModal.classList.add('show');
            }
        });
    }
    
    // 添加项目按钮
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            if (addProjectModal) {
                addProjectModal.classList.add('show');
            }
        });
    }
    
    // 添加用例库按钮
    if (addTestcaseLibraryBtn) {
        addTestcaseLibraryBtn.addEventListener('click', () => {
            // 填充模块选择
            const testcaseLibraryModule = document.getElementById('testcase-library-module');
            if (testcaseLibraryModule) {
                testcaseLibraryModule.innerHTML = '<option value="">请选择模块</option>';
                modules.forEach(module => {
                    const option = document.createElement('option');
                    option.value = module.id;
                    option.textContent = module.name;
                    testcaseLibraryModule.appendChild(option);
                });
            }
            if (addTestcaseLibraryModal) {
                addTestcaseLibraryModal.classList.add('show');
            }
        });
    }
    
    // 下发用例按钮
    if (assignTestcasesBtn) {
        assignTestcasesBtn.addEventListener('click', () => {
            if (selectedTestcaseIds.length === 0) {
                showNotification('请选择要下发的用例', 'error');
                return;
            }
            
            // 填充项目选择
            if (projectSelect) {
                projectSelect.innerHTML = '<option value="">请选择项目</option>';
                projects.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project.id;
                    option.textContent = project.name;
                    projectSelect.appendChild(option);
                });
            }
            
            // 填充选中的用例
            const selectedTestcasesContainer = document.getElementById('selected-testcases');
            if (selectedTestcasesContainer) {
                selectedTestcasesContainer.innerHTML = '';
                selectedTestcaseIds.forEach(id => {
                    const testcase = testcases.find(tc => tc.id === id);
                    if (testcase) {
                        const module = modules.find(m => m.id === testcase.module_id);
                        const testcaseItem = document.createElement('div');
                        testcaseItem.className = 'selected-testcase-item';
                        testcaseItem.textContent = `${module?.name || '未知模块'} - ${testcase.title}`;
                        selectedTestcasesContainer.appendChild(testcaseItem);
                    }
                });
            }
            
            if (assignTestcasesModal) {
                assignTestcasesModal.classList.add('show');
            }
        });
    }
    
    // 关闭模态框
    if (closeButtons && closeButtons.length > 0) {
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (addTestcaseModal) addTestcaseModal.classList.remove('show');
                if (addModuleModal) addModuleModal.classList.remove('show');
                if (addProjectModal) addProjectModal.classList.remove('show');
                if (addTestcaseLibraryModal) addTestcaseLibraryModal.classList.remove('show');
                if (assignTestcasesModal) assignTestcasesModal.classList.remove('show');
            });
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (addTestcaseModal && e.target === addTestcaseModal) {
            addTestcaseModal.classList.remove('show');
        }
        if (addModuleModal && e.target === addModuleModal) {
            addModuleModal.classList.remove('show');
        }
        if (addProjectModal && e.target === addProjectModal) {
            addProjectModal.classList.remove('show');
        }
        if (addTestcaseLibraryModal && e.target === addTestcaseLibraryModal) {
            addTestcaseLibraryModal.classList.remove('show');
        }
        if (assignTestcasesModal && e.target === assignTestcasesModal) {
            assignTestcasesModal.classList.remove('show');
        }
    });
    
    // 添加用例表单提交
    if (addTestcaseForm) {
        addTestcaseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const moduleId = document.getElementById('testcase-module').value;
            const title = document.getElementById('testcase-title').value;
            const description = document.getElementById('testcase-description').value;
            const steps = document.getElementById('testcase-steps').value.split('\n').filter(step => step.trim());
            const expectedResult = document.getElementById('testcase-expected-result').value;
            
            try {
                const response = await fetch('http://localhost:5000/api/testcases', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        module_id: moduleId,
                        title,
                        description,
                        steps,
                        expected_result: expectedResult
                    })
                });
                
                if (response.ok) {
                    await fetchTestcases();
                    renderTestcases();
                    if (addTestcaseModal) addTestcaseModal.classList.remove('show');
                    if (addTestcaseForm) addTestcaseForm.reset();
                    showNotification('用例添加成功', 'success');
                } else {
                    showNotification('用例添加失败', 'error');
                }
            } catch (error) {
                console.error('Error adding testcase:', error);
                showNotification('网络错误，请稍后重试', 'error');
            }
        });
    }
    
    // 添加模块表单提交
    if (addModuleForm) {
        addModuleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('module-name').value;
            const description = document.getElementById('module-description').value;
            
            try {
                const response = await fetch('http://localhost:5000/api/modules', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        name,
                        description
                    })
                });
                
                if (response.ok) {
                    await fetchModules();
                    renderModules();
                    updateModuleFilter();
                    if (addModuleModal) addModuleModal.classList.remove('show');
                    if (addModuleForm) addModuleForm.reset();
                    showNotification('模块添加成功', 'success');
                } else {
                    showNotification('模块添加失败', 'error');
                }
            } catch (error) {
                console.error('Error adding module:', error);
                showNotification('网络错误，请稍后重试', 'error');
            }
        });
    }
    
    // 下发用例表单提交
    if (assignTestcasesForm) {
        assignTestcasesForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const projectId = document.getElementById('project-select').value;
            const firmwareVersion = document.getElementById('firmware-version').value;
            const appVersion = document.getElementById('app-version').value;
            const assignee = document.getElementById('assignee').value;
            
            try {
                const response = await fetch('http://localhost:5000/api/testcases/assign', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        testcase_ids: selectedTestcaseIds,
                        assignee,
                        project_id: projectId,
                        firmware_version: firmwareVersion,
                        app_version: appVersion
                    })
                });
                
                if (response.ok) {
                    await fetchTestcases();
                    renderTestcases();
                    if (assignTestcasesModal) assignTestcasesModal.classList.remove('show');
                    if (assignTestcasesForm) assignTestcasesForm.reset();
                    selectedTestcaseIds = [];
                    if (selectAllCheckbox) selectAllCheckbox.checked = false;
                    updateAssignButtonState();
                    showNotification('用例下发成功', 'success');
                } else {
                    showNotification('用例下发失败', 'error');
                }
            } catch (error) {
                console.error('Error assigning testcases:', error);
                showNotification('网络错误，请稍后重试', 'error');
            }
        });
    }
    
    // 添加项目表单提交
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('project-name').value;
            const description = document.getElementById('project-description').value;
            
            try {
                const response = await fetch('http://localhost:5000/api/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        name,
                        description
                    })
                });
                
                if (response.ok) {
                    await fetchProjects();
                    renderProjects();
                    if (addProjectModal) addProjectModal.classList.remove('show');
                    if (addProjectForm) addProjectForm.reset();
                    showNotification('项目添加成功', 'success');
                } else {
                    showNotification('项目添加失败', 'error');
                }
            } catch (error) {
                console.error('Error adding project:', error);
                showNotification('网络错误，请稍后重试', 'error');
            }
        });
    }
    
    // 添加用例库表单提交
    if (addTestcaseLibraryForm) {
        addTestcaseLibraryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const moduleId = document.getElementById('testcase-library-module').value;
            const title = document.getElementById('testcase-library-title').value;
            const description = document.getElementById('testcase-library-description').value;
            const steps = document.getElementById('testcase-library-steps').value.split('\n').filter(step => step.trim());
            const expectedResult = document.getElementById('testcase-library-expected-result').value;
            
            try {
                const response = await fetch('http://localhost:5000/api/testcase-library', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        module_id: moduleId,
                        title,
                        description,
                        steps,
                        expected_result: expectedResult
                    })
                });
                
                if (response.ok) {
                    await fetchTestcaseLibrary();
                    renderTestcaseLibrary();
                    if (addTestcaseLibraryModal) addTestcaseLibraryModal.classList.remove('show');
                    if (addTestcaseLibraryForm) addTestcaseLibraryForm.reset();
                    showNotification('用例库添加成功', 'success');
                } else {
                    showNotification('用例库添加失败', 'error');
                }
            } catch (error) {
                console.error('Error adding testcase library:', error);
                showNotification('网络错误，请稍后重试', 'error');
            }
        });
    }
}

// 获取token
function getToken() {
    return localStorage.getItem('token');
}

// 获取模块列表
async function fetchModules() {
    try {
        const response = await fetch('http://localhost:5000/api/modules', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (response.ok) {
            modules = await response.json();
            updateModuleFilter();
        } else if (response.status === 403) {
            // 权限不足，忽略错误
            console.log('Permission denied for modules');
        }
    } catch (error) {
        console.error('Error fetching modules:', error);
    }
}

// 获取项目列表
async function fetchProjects() {
    try {
        const response = await fetch('http://localhost:5000/api/projects', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (response.ok) {
            projects = await response.json();
        } else if (response.status === 403) {
            // 权限不足，忽略错误
            console.log('Permission denied for projects');
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// 获取用例库列表
async function fetchTestcaseLibrary() {
    try {
        const response = await fetch('http://localhost:5000/api/testcase-library', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (response.ok) {
            testcaseLibrary = await response.json();
        } else if (response.status === 403) {
            // 权限不足，忽略错误
            console.log('Permission denied for testcase library');
        }
    } catch (error) {
        console.error('Error fetching testcase library:', error);
    }
}

// 获取用例列表
async function fetchTestcases() {
    try {
        const response = await fetch('http://localhost:5000/api/testcases', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (response.ok) {
            testcases = await response.json();
        }
    } catch (error) {
        console.error('Error fetching testcases:', error);
    }
}

// 获取测试进度
async function fetchTestProgress() {
    try {
        const response = await fetch('http://localhost:5000/api/test-progress', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (response.ok) {
            return await response.json();
        }
        return {};
    } catch (error) {
        console.error('Error fetching test progress:', error);
        return {};
    }
}

// 更新模块筛选器
function updateModuleFilter() {
    moduleFilter.innerHTML = '<option value="all">所有模块</option>';
    modules.forEach(module => {
        const option = document.createElement('option');
        option.value = module.id;
        option.textContent = module.name;
        moduleFilter.appendChild(option);
    });
}

// 渲染用例列表
function renderTestcases() {
    const selectedModule = moduleFilter.value;
    const filteredTestcases = selectedModule === 'all' 
        ? testcases 
        : testcases.filter(tc => tc.module_id === selectedModule);
    
    testcaseItems.innerHTML = '';
    
    if (filteredTestcases.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.className = 'testcase-item';
        emptyItem.style.gridColumn = '1 / -1';
        emptyItem.style.textAlign = 'center';
        emptyItem.textContent = '暂无用例';
        testcaseItems.appendChild(emptyItem);
        return;
    }
    
    filteredTestcases.forEach(testcase => {
        const module = modules.find(m => m.id === testcase.module_id);
        const testcaseItem = document.createElement('div');
        testcaseItem.className = 'testcase-item';
        
        testcaseItem.innerHTML = `
            <div class="checkbox-column">
                <input type="checkbox" class="testcase-checkbox" data-testcase-id="${testcase.id}" ${selectedTestcaseIds.includes(testcase.id) ? 'checked' : ''}>
            </div>
            <div class="id-column">${testcase.id}</div>
            <div class="title-column">${testcase.title}</div>
            <div class="module-column">${module?.name || '未知模块'}</div>
            <div class="status-column">
                <span class="status-badge ${testcase.status}">${getStatusText(testcase.status)}</span>
            </div>
            <div class="assignee-column">${testcase.assignee || '未分配'}</div>
            <div class="actions-column">
                <button class="action-btn edit" onclick="editTestcase('${testcase.id}')">编辑</button>
                <button class="action-btn delete" onclick="deleteTestcase('${testcase.id}')">删除</button>
                <select class="status-select" onchange="updateTestcaseStatus('${testcase.id}', this.value)">
                    <option value="pending" ${testcase.status === 'pending' ? 'selected' : ''}>待测试</option>
                    <option value="in_progress" ${testcase.status === 'in_progress' ? 'selected' : ''}>进行中</option>
                    <option value="passed" ${testcase.status === 'passed' ? 'selected' : ''}>通过</option>
                    <option value="failed" ${testcase.status === 'failed' ? 'selected' : ''}>失败</option>
                </select>
            </div>
        `;
        
        testcaseItems.appendChild(testcaseItem);
    });
    
    // 添加复选框事件监听器
    document.querySelectorAll('.testcase-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const testcaseId = e.target.dataset.testcaseId;
            if (e.target.checked) {
                if (!selectedTestcaseIds.includes(testcaseId)) {
                    selectedTestcaseIds.push(testcaseId);
                }
            } else {
                selectedTestcaseIds = selectedTestcaseIds.filter(id => id !== testcaseId);
            }
            updateAssignButtonState();
        });
    });
}

// 渲染模块列表
function renderModules() {
    moduleItems.innerHTML = '';
    
    if (modules.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.className = 'module-item';
        emptyItem.style.gridColumn = '1 / -1';
        emptyItem.style.textAlign = 'center';
        emptyItem.textContent = '暂无模块';
        moduleItems.appendChild(emptyItem);
        return;
    }
    
    modules.forEach(module => {
        const moduleItem = document.createElement('div');
        moduleItem.className = 'module-item';
        moduleItem.style.cursor = 'pointer';
        moduleItem.addEventListener('click', (e) => {
            // 防止点击按钮时触发模块项的点击事件
            if (!e.target.classList.contains('action-btn')) {
                showModuleTestcases(module.id, module.name);
            }
        });
        
        moduleItem.innerHTML = `
            <div class="id-column">${module.id}</div>
            <div class="name-column">${module.name}</div>
            <div class="description-column">${module.description || '-'}</div>
            <div class="actions-column">
                <button class="action-btn edit" onclick="editModule('${module.id}')">编辑</button>
                <button class="action-btn delete" onclick="deleteModule('${module.id}')">删除</button>
            </div>
        `;
        
        moduleItems.appendChild(moduleItem);
    });
}

// 渲染项目列表
function renderProjects() {
    projectItems.innerHTML = '';
    
    if (projects.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.className = 'project-item';
        emptyItem.style.gridColumn = '1 / -1';
        emptyItem.style.textAlign = 'center';
        emptyItem.textContent = '暂无项目';
        projectItems.appendChild(emptyItem);
        return;
    }
    
    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        projectItem.innerHTML = `
            <div class="id-column">${project.id}</div>
            <div class="name-column">${project.name}</div>
            <div class="description-column">${project.description || '-'}</div>
            <div class="actions-column">
                <button class="action-btn edit" onclick="editProject('${project.id}')">编辑</button>
                <button class="action-btn delete" onclick="deleteProject('${project.id}')">删除</button>
            </div>
        `;
        
        projectItems.appendChild(projectItem);
    });
}

// 渲染用例库列表
function renderTestcaseLibrary() {
    testcaseLibraryItems.innerHTML = '';
    
    if (testcaseLibrary.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.className = 'testcase-library-item';
        emptyItem.style.gridColumn = '1 / -1';
        emptyItem.style.textAlign = 'center';
        emptyItem.textContent = '暂无用例库';
        testcaseLibraryItems.appendChild(emptyItem);
        return;
    }
    
    testcaseLibrary.forEach(library => {
        const module = modules.find(m => m.id === library.module_id);
        const libraryItem = document.createElement('div');
        libraryItem.className = 'testcase-library-item';
        
        libraryItem.innerHTML = `
            <div class="id-column">${library.id}</div>
            <div class="title-column">${library.title}</div>
            <div class="module-column">${module?.name || '未知模块'}</div>
            <div class="description-column">${library.description || '-'}</div>
            <div class="actions-column">
                <button class="action-btn edit" onclick="editTestcaseLibrary('${library.id}')">编辑</button>
                <button class="action-btn delete" onclick="deleteTestcaseLibrary('${library.id}')">删除</button>
                <button class="action-btn add" onclick="addToTestcases('${library.id}')">添加到测试</button>
            </div>
        `;
        
        testcaseLibraryItems.appendChild(libraryItem);
    });
}

// 更新测试进度
async function updateTestProgress() {
    const progress = await fetchTestProgress();
    
    // 更新总体进度
    const overall = progress.overall || {
        total: 0,
        passed: 0,
        failed: 0,
        in_progress: 0,
        pending: 0
    };
    
    document.getElementById('total-testcases').textContent = overall.total;
    document.getElementById('passed-testcases').textContent = overall.passed;
    document.getElementById('failed-testcases').textContent = overall.failed;
    document.getElementById('in-progress-testcases').textContent = overall.in_progress;
    document.getElementById('pending-testcases').textContent = overall.pending;
    
    // 更新总体进度图表
    updateOverallChart(overall);
    
    // 更新模块进度
    moduleProgressCards.innerHTML = '';
    
    // 先添加已下发用例进度
    const assigned = progress.assigned || {
        total: 0,
        passed: 0,
        failed: 0,
        in_progress: 0,
        pending: 0
    };
    
    const assignedCard = document.createElement('div');
    assignedCard.className = 'module-progress-card';
    
    const assignedTotal = assigned.total || 0;
    const assignedPassed = assigned.passed || 0;
    const assignedCompleted = assignedPassed + (assigned.failed || 0);
    const assignedProgressPercentage = assignedTotal > 0 ? (assignedCompleted / assignedTotal) * 100 : 0;
    
    assignedCard.innerHTML = `
        <h4>已下发用例</h4>
        <div class="module-progress-stats">
            <div class="module-stat-item">
                <span class="module-stat-value">${assignedTotal}</span>
                <span class="module-stat-label">总用例</span>
            </div>
            <div class="module-stat-item">
                <span class="module-stat-value passed">${assignedPassed}</span>
                <span class="module-stat-label">通过</span>
            </div>
            <div class="module-stat-item">
                <span class="module-stat-value failed">${assigned.failed || 0}</span>
                <span class="module-stat-label">失败</span>
            </div>
            <div class="module-stat-item">
                <span class="module-stat-value">${Math.round(assignedProgressPercentage)}%</span>
                <span class="module-stat-label">完成率</span>
            </div>
        </div>
        <div class="module-progress-bar">
            <div class="module-progress-fill" style="width: ${assignedProgressPercentage}%; background-color: ${assignedPassed === assignedTotal ? '#4caf50' : '#2196f3'}"></div>
        </div>
    `;
    
    moduleProgressCards.appendChild(assignedCard);
    
    // 再添加模块进度
    Object.keys(progress).forEach(key => {
        if (key !== 'overall' && key !== 'assigned') {
            const moduleProgress = progress[key];
            const progressCard = document.createElement('div');
            progressCard.className = 'module-progress-card';
            
            const total = moduleProgress.total || 0;
            const passed = moduleProgress.passed || 0;
            const completed = passed + (moduleProgress.failed || 0);
            const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
            
            progressCard.innerHTML = `
                <h4>${moduleProgress.module_name || '未知模块'}</h4>
                <div class="module-progress-stats">
                    <div class="module-stat-item">
                        <span class="module-stat-value">${total}</span>
                        <span class="module-stat-label">总用例</span>
                    </div>
                    <div class="module-stat-item">
                        <span class="module-stat-value passed">${passed}</span>
                        <span class="module-stat-label">通过</span>
                    </div>
                    <div class="module-stat-item">
                        <span class="module-stat-value failed">${moduleProgress.failed || 0}</span>
                        <span class="module-stat-label">失败</span>
                    </div>
                    <div class="module-stat-item">
                        <span class="module-stat-value">${Math.round(progressPercentage)}%</span>
                        <span class="module-stat-label">完成率</span>
                    </div>
                </div>
                <div class="module-progress-bar">
                    <div class="module-progress-fill" style="width: ${progressPercentage}%; background-color: ${passed === total ? '#4caf50' : '#2196f3'}"></div>
                </div>
            `;
            
            moduleProgressCards.appendChild(progressCard);
        }
    });
}

// 更新总体进度图表
function updateOverallChart(overall) {
    const ctx = document.getElementById('overall-chart').getContext('2d');
    
    if (overallChart) {
        overallChart.destroy();
    }
    
    overallChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['通过', '失败', '进行中', '待测试'],
            datasets: [{
                data: [overall.passed, overall.failed, overall.in_progress, overall.pending],
                backgroundColor: [
                    '#4caf50',
                    '#f44336',
                    '#2196f3',
                    '#9e9e9e'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 更新用例状态
async function updateTestcaseStatus(testcaseId, status) {
    try {
        const response = await fetch(`http://localhost:5000/api/testcases/${testcaseId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            await fetchTestcases();
            renderTestcases();
            await fetchTestProgress();
            updateTestProgress();
            showNotification('用例状态更新成功', 'success');
        } else {
            showNotification('用例状态更新失败', 'error');
        }
    } catch (error) {
        console.error('Error updating testcase status:', error);
        showNotification('网络错误，请稍后重试', 'error');
    }
}

// 编辑用例
async function editTestcase(testcaseId) {
    try {
        // 获取用例详情
        const response = await fetch(`http://localhost:5000/api/testcases/${testcaseId}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const testcase = await response.json();
        
        // 填充编辑表单
        document.getElementById('edit-testcase-id').value = testcase.id;
        document.getElementById('edit-testcase-title').value = testcase.title;
        document.getElementById('edit-testcase-description').value = testcase.description || '';
        document.getElementById('edit-testcase-steps').value = testcase.steps || '';
        document.getElementById('edit-testcase-expected-result').value = testcase.expected_result || '';
        document.getElementById('edit-testcase-assignee').value = testcase.assignee || '';
        document.getElementById('edit-testcase-project').value = testcase.project_id || '';
        document.getElementById('edit-testcase-firmware-version').value = testcase.firmware_version || '';
        document.getElementById('edit-testcase-app-version').value = testcase.app_version || '';
        
        // 填充模块下拉框
        const moduleSelect = document.getElementById('edit-testcase-module');
        moduleSelect.innerHTML = '<option value="">请选择模块</option>';
        modules.forEach(module => {
            const option = document.createElement('option');
            option.value = module.id;
            option.textContent = module.name;
            if (module.id === testcase.module_id) {
                option.selected = true;
            }
            moduleSelect.appendChild(option);
        });
        
        // 显示编辑模态框
        document.getElementById('edit-testcase-modal').classList.add('show');
    } catch (error) {
        console.error('Error fetching testcase:', error);
        showNotification('获取用例详情失败', 'error');
    }
}

// 编辑用例表单提交
function setupEditTestcaseForm() {
    if (editTestcaseForm) {
        editTestcaseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const testcaseId = document.getElementById('edit-testcase-id').value;
            const testcaseData = {
                module_id: document.getElementById('edit-testcase-module').value,
                title: document.getElementById('edit-testcase-title').value,
                description: document.getElementById('edit-testcase-description').value,
                steps: document.getElementById('edit-testcase-steps').value,
                expected_result: document.getElementById('edit-testcase-expected-result').value,
                assignee: document.getElementById('edit-testcase-assignee').value,
                project_id: document.getElementById('edit-testcase-project').value,
                firmware_version: document.getElementById('edit-testcase-firmware-version').value,
                app_version: document.getElementById('edit-testcase-app-version').value
            };
            
            try {
                const response = await fetch(`http://localhost:5000/api/testcases/${testcaseId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify(testcaseData)
                });
                
                if (response.ok) {
                    await fetchTestcases();
                    renderTestcases();
                    document.getElementById('edit-testcase-modal').classList.remove('show');
                    showNotification('用例编辑成功', 'success');
                } else {
                    showNotification('用例编辑失败', 'error');
                }
            } catch (error) {
                console.error('Error editing testcase:', error);
                showNotification('网络错误，请稍后重试', 'error');
            }
        });
    }
    
    // 关闭编辑用例模态框
    const editTestcaseModal = document.getElementById('edit-testcase-modal');
    if (editTestcaseModal) {
        const editTestcaseModalClose = editTestcaseModal.querySelector('.close-btn');
        const editTestcaseModalCancel = editTestcaseModal.querySelector('.close-modal');
        
        if (editTestcaseModalClose) {
                editTestcaseModalClose.addEventListener('click', () => {
                    editTestcaseModal.classList.remove('show');
                });
            }
            
            if (editTestcaseModalCancel) {
                editTestcaseModalCancel.addEventListener('click', () => {
                    editTestcaseModal.classList.remove('show');
                });
            }
    }
}

// 删除用例
async function deleteTestcase(testcaseId) {
    if (confirm('确定要删除这个用例吗？')) {
        try {
            const response = await fetch(`http://localhost:5000/api/testcases/${testcaseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            
            if (response.ok) {
                await fetchTestcases();
                renderTestcases();
                showNotification('用例删除成功', 'success');
            } else {
                showNotification('用例删除失败', 'error');
            }
        } catch (error) {
            console.error('Error deleting testcase:', error);
            showNotification('网络错误，请稍后重试', 'error');
        }
    }
}

// 编辑模块
async function editModule(moduleId) {
    try {
        // 获取模块详情
        const response = await fetch(`http://localhost:5000/api/modules/${moduleId}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const module = await response.json();
        
        // 填充编辑表单
        document.getElementById('edit-module-id').value = module.id;
        document.getElementById('edit-module-name').value = module.name;
        document.getElementById('edit-module-description').value = module.description || '';
        
        // 显示编辑模态框
        document.getElementById('edit-module-modal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching module:', error);
        showNotification('获取模块详情失败', 'error');
    }
}

// 编辑模块表单提交
function setupEditModuleForm() {
    const editModuleForm = document.getElementById('edit-module-form');
    if (editModuleForm) {
        editModuleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const moduleId = document.getElementById('edit-module-id').value;
            const moduleData = {
                name: document.getElementById('edit-module-name').value,
                description: document.getElementById('edit-module-description').value
            };
            
            try {
                const response = await fetch(`http://localhost:5000/api/modules/${moduleId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify(moduleData)
                });
                
                if (response.ok) {
                    await fetchModules();
                    renderModules();
                    document.getElementById('edit-module-modal').style.display = 'none';
                    showNotification('模块编辑成功', 'success');
                } else {
                    showNotification('模块编辑失败', 'error');
                }
            } catch (error) {
                console.error('Error editing module:', error);
                showNotification('网络错误，请稍后重试', 'error');
            }
        });
    }
    
    // 关闭编辑模块模态框
    const editModuleModal = document.getElementById('edit-module-modal');
    if (editModuleModal) {
        const editModuleModalClose = editModuleModal?.querySelector('.close-btn');
        const editModuleModalCancel = editModuleModal?.querySelector('.close-modal');
        
        if (editModuleModalClose) {
            editModuleModalClose.addEventListener('click', () => {
                editModuleModal.style.display = 'none';
            });
        }
        
        if (editModuleModalCancel) {
            editModuleModalCancel.addEventListener('click', () => {
                editModuleModal.style.display = 'none';
            });
        }
    }
}

// 删除模块
async function deleteModule(moduleId) {
    if (confirm('确定要删除这个模块吗？')) {
        try {
            const response = await fetch(`http://localhost:5000/api/modules/${moduleId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            
            if (response.ok) {
                await fetchModules();
                renderModules();
                showNotification('模块删除成功', 'success');
            } else {
                showNotification('模块删除失败', 'error');
            }
        } catch (error) {
            console.error('Error deleting module:', error);
            showNotification('网络错误，请稍后重试', 'error');
        }
    }
}

// 编辑项目
async function editProject(projectId) {
    try {
        // 获取项目详情
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const project = await response.json();
        
        // 填充编辑表单
        document.getElementById('edit-project-id').value = project.id;
        document.getElementById('edit-project-name').value = project.name;
        document.getElementById('edit-project-description').value = project.description || '';
        
        // 显示编辑模态框
        document.getElementById('edit-project-modal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching project:', error);
        showNotification('获取项目详情失败', 'error');
    }
}

// 编辑项目表单提交
function setupEditProjectForm() {
    const editProjectForm = document.getElementById('edit-project-form');
    if (editProjectForm) {
        editProjectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const projectId = document.getElementById('edit-project-id').value;
            const projectData = {
                name: document.getElementById('edit-project-name').value,
                description: document.getElementById('edit-project-description').value
            };
            
            try {
                const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify(projectData)
                });
                
                if (response.ok) {
                    await fetchProjects();
                    renderProjects();
                    document.getElementById('edit-project-modal').style.display = 'none';
                    showNotification('项目编辑成功', 'success');
                } else {
                    showNotification('项目编辑失败', 'error');
                }
            } catch (error) {
                console.error('Error editing project:', error);
                showNotification('网络错误，请稍后重试', 'error');
            }
        });
    }
    
    // 关闭编辑项目模态框
    const editProjectModal = document.getElementById('edit-project-modal');
    if (editProjectModal) {
        const editProjectModalClose = editProjectModal?.querySelector('.close-btn');
        const editProjectModalCancel = editProjectModal?.querySelector('.close-modal');
        
        if (editProjectModalClose) {
            editProjectModalClose.addEventListener('click', () => {
                editProjectModal.style.display = 'none';
            });
        }
        
        if (editProjectModalCancel) {
            editProjectModalCancel.addEventListener('click', () => {
                editProjectModal.style.display = 'none';
            });
        }
    }
}

// 删除项目
async function deleteProject(projectId) {
    if (confirm('确定要删除这个项目吗？')) {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            
            if (response.ok) {
                await fetchProjects();
                renderProjects();
                showNotification('项目删除成功', 'success');
            } else {
                showNotification('项目删除失败', 'error');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            showNotification('网络错误，请稍后重试', 'error');
        }
    }
}

// 编辑用例库
async function editTestcaseLibrary(libraryId) {
    try {
        // 获取用例库详情
        const response = await fetch(`http://localhost:5000/api/testcase-library/${libraryId}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const library = await response.json();
        
        // 填充编辑表单
        document.getElementById('edit-testcase-library-id').value = library.id;
        document.getElementById('edit-testcase-library-title').value = library.title;
        document.getElementById('edit-testcase-library-description').value = library.description || '';
        document.getElementById('edit-testcase-library-steps').value = library.steps || '';
        document.getElementById('edit-testcase-library-expected-result').value = library.expected_result || '';
        
        // 填充模块下拉框
        const moduleSelect = document.getElementById('edit-testcase-library-module');
        moduleSelect.innerHTML = '<option value="">请选择模块</option>';
        modules.forEach(module => {
            const option = document.createElement('option');
            option.value = module.id;
            option.textContent = module.name;
            if (module.id === library.module_id) {
                option.selected = true;
            }
            moduleSelect.appendChild(option);
        });
        
        // 显示编辑模态框
        document.getElementById('edit-testcase-library-modal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching testcase library:', error);
        showNotification('获取用例库详情失败', 'error');
    }
}

// 编辑用例库表单提交
function setupEditTestcaseLibraryForm() {
    const editTestcaseLibraryForm = document.getElementById('edit-testcase-library-form');
    if (editTestcaseLibraryForm) {
        editTestcaseLibraryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const libraryId = document.getElementById('edit-testcase-library-id').value;
            const libraryData = {
                module_id: document.getElementById('edit-testcase-library-module').value,
                title: document.getElementById('edit-testcase-library-title').value,
                description: document.getElementById('edit-testcase-library-description').value,
                steps: document.getElementById('edit-testcase-library-steps').value,
                expected_result: document.getElementById('edit-testcase-library-expected-result').value
            };
            
            try {
                const response = await fetch(`http://localhost:5000/api/testcase-library/${libraryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify(libraryData)
                });
                
                if (response.ok) {
                    await fetchTestcaseLibrary();
                    renderTestcaseLibrary();
                    document.getElementById('edit-testcase-library-modal').style.display = 'none';
                    showNotification('用例库编辑成功', 'success');
                } else {
                    showNotification('用例库编辑失败', 'error');
                }
            } catch (error) {
                console.error('Error editing testcase library:', error);
                showNotification('网络错误，请稍后重试', 'error');
            }
        });
    }
    
    // 关闭编辑用例库模态框
    const editTestcaseLibraryModal = document.getElementById('edit-testcase-library-modal');
    if (editTestcaseLibraryModal) {
        const editTestcaseLibraryModalClose = editTestcaseLibraryModal?.querySelector('.close-btn');
        const editTestcaseLibraryModalCancel = editTestcaseLibraryModal?.querySelector('.close-modal');
        
        if (editTestcaseLibraryModalClose) {
            editTestcaseLibraryModalClose.addEventListener('click', () => {
                editTestcaseLibraryModal.style.display = 'none';
            });
        }
        
        if (editTestcaseLibraryModalCancel) {
            editTestcaseLibraryModalCancel.addEventListener('click', () => {
                editTestcaseLibraryModal.style.display = 'none';
            });
        }
    }
}

// 显示模块的用例列表
async function showModuleTestcases(moduleId, moduleName) {
    try {
        // 切换到用例管理页面
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector('a[href="#testcases"]').classList.add('active');
        
        // 滚动到用例管理页面
        document.getElementById('testcases').scrollIntoView({ behavior: 'smooth' });
        
        // 获取该模块的用例
        const response = await fetch(`http://localhost:5000/api/modules/${moduleId}/testcases`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const moduleTestcases = await response.json();
        
        // 显示模块名称
        const testcasesHeader = document.querySelector('#testcases .section-header h2');
        testcasesHeader.textContent = `${moduleName} - 用例列表`;
        
        // 渲染该模块的用例
        testcaseItems.innerHTML = '';
        
        if (moduleTestcases.length === 0) {
            const emptyItem = document.createElement('div');
            emptyItem.className = 'testcase-item';
            emptyItem.style.gridColumn = '1 / -1';
            emptyItem.style.textAlign = 'center';
            emptyItem.textContent = '该模块暂无用例';
            testcaseItems.appendChild(emptyItem);
            return;
        }
        
        moduleTestcases.forEach(testcase => {
            const module = modules.find(m => m.id === testcase.module_id);
            const testcaseItem = document.createElement('div');
            testcaseItem.className = 'testcase-item';
            
            testcaseItem.innerHTML = `
                <div class="id-column">${testcase.id}</div>
                <div class="title-column">${testcase.title}</div>
                <div class="module-column">${module?.name || '未知模块'}</div>
                <div class="status-column">
                    <select class="status-select" onchange="updateTestcaseStatus('${testcase.id}', this.value)">
                        <option value="pending" ${testcase.status === 'pending' ? 'selected' : ''}>待测试</option>
                        <option value="in_progress" ${testcase.status === 'in_progress' ? 'selected' : ''}>进行中</option>
                        <option value="passed" ${testcase.status === 'passed' ? 'selected' : ''}>通过</option>
                        <option value="failed" ${testcase.status === 'failed' ? 'selected' : ''}>失败</option>
                    </select>
                </div>
                <div class="assignee-column">${testcase.assignee || '-'}</div>
                <div class="actions-column">
                    <button class="action-btn edit" onclick="editTestcase('${testcase.id}')">编辑</button>
                    <button class="action-btn delete" onclick="deleteTestcase('${testcase.id}')">删除</button>
                </div>
            `;
            
            testcaseItems.appendChild(testcaseItem);
        });
        
        showNotification(`已显示 ${moduleName} 模块的用例列表`, 'success');
    } catch (error) {
        console.error('Error fetching module testcases:', error);
        showNotification('获取模块用例失败', 'error');
    }
}

// 删除用例库
async function deleteTestcaseLibrary(libraryId) {
    if (confirm('确定要删除这个用例库吗？')) {
        try {
            const response = await fetch(`http://localhost:5000/api/testcase-library/${libraryId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await fetchTestcaseLibrary();
                renderTestcaseLibrary();
                showNotification('用例库删除成功', 'success');
            } else {
                showNotification('用例库删除失败', 'error');
            }
        } catch (error) {
            console.error('Error deleting testcase library:', error);
            showNotification('网络错误，请稍后重试', 'error');
        }
    }
}

// 从用例库添加用例到测试任务
async function addToTestcases(libraryId) {
    try {
        // 显示添加到测试的模态框，让用户输入项目、负责人等信息
        const projectId = prompt('请输入项目ID:');
        const assignee = prompt('请输入负责人:');
        const firmwareVersion = prompt('请输入固件版本:');
        const appVersion = prompt('请输入APP版本:');
        
        if (!projectId || !assignee) {
            showNotification('请输入项目ID和负责人', 'error');
            return;
        }
        
        const response = await fetch(`http://localhost:5000/api/testcase-library/${libraryId}/add-to-testcases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                project_id: projectId,
                assignee,
                firmware_version: firmwareVersion || '',
                app_version: appVersion || ''
            })
        });
        
        if (response.ok) {
            await fetchTestcases();
            renderTestcases();
            showNotification('用例添加到测试成功', 'success');
        } else {
            showNotification('用例添加到测试失败', 'error');
        }
    } catch (error) {
        console.error('Error adding library to testcases:', error);
        showNotification('网络错误，请稍后重试', 'error');
    }
}

// 更新下发按钮状态
function updateAssignButtonState() {
    assignTestcasesBtn.disabled = selectedTestcaseIds.length === 0;
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        pending: '待测试',
        in_progress: '进行中',
        passed: '通过',
        failed: '失败'
    };
    return statusMap[status] || status;
}

// 显示通知
function showNotification(message, type = 'info') {
    notificationMessage.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 加载审批管理页面
async function loadApprovalPage() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/pending-users');
        if (response.ok) {
            const pendingUsers = await response.json();
            renderApprovalPage(pendingUsers);
        } else {
            showNotification('获取待审批用户失败', 'error');
        }
    } catch (error) {
        console.error('Error loading pending users:', error);
        showNotification('网络错误，请稍后重试', 'error');
    }
}

// 渲染审批管理页面
function renderApprovalPage(pendingUsers) {
    // 检查是否存在审批管理区域，如果不存在则创建
    let approvalSection = document.getElementById('approval');
    if (!approvalSection) {
        approvalSection = document.createElement('section');
        approvalSection.id = 'approval';
        approvalSection.className = 'section';
        main.appendChild(approvalSection);
    }
    
    approvalSection.innerHTML = `
        <div class="section-header">
            <h2>用户审批管理</h2>
        </div>
        <div class="approval-list">
            <div class="approval-list-header">
                <div class="id-column">ID</div>
                <div class="email-column">邮箱</div>
                <div class="actions-column">操作</div>
            </div>
            <div id="approval-items" class="approval-items">
                ${pendingUsers.length === 0 ? 
                    '<div class="approval-item" style="grid-column: 1 / -1; text-align: center;">暂无待审批用户</div>' : 
                    pendingUsers.map(user => `
                        <div class="approval-item">
                            <div class="id-column">${user.id}</div>
                            <div class="email-column">${user.email}</div>
                            <div class="actions-column">
                                <button class="btn primary" onclick="approveUser('${user.id}')">批准</button>
                                <button class="btn secondary" onclick="rejectUser('${user.id}')">拒绝</button>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
    
    // 添加审批列表样式
    const style = document.createElement('style');
    style.textContent = `
        .approval-list {
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
        }
        .approval-list-header {
            display: grid;
            grid-template-columns: 60px 1fr 200px;
            background-color: #f8f9fa;
            padding: 12px 15px;
            font-weight: 600;
            border-bottom: 1px solid #e0e0e0;
        }
        .approval-items {
            max-height: 500px;
            overflow-y: auto;
        }
        .approval-item {
            display: grid;
            grid-template-columns: 60px 1fr 200px;
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
            align-items: center;
            transition: background-color 0.2s ease;
        }
        .approval-item:hover {
            background-color: #f8f9fa;
        }
        .approval-item .actions-column {
            display: flex;
            gap: 10px;
        }
        .approval-item .btn {
            flex: 1;
            margin: 0;
        }
    `;
    document.head.appendChild(style);
}

// 批准用户
async function approveUser(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/auth/users/${userId}/approve`, {
            method: 'PUT'
        });
        if (response.ok) {
            showNotification('用户批准成功', 'success');
            // 重新加载审批页面
            loadApprovalPage();
        } else {
            showNotification('用户批准失败', 'error');
        }
    } catch (error) {
        console.error('Error approving user:', error);
        showNotification('网络错误，请稍后重试', 'error');
    }
}

// 拒绝用户
async function rejectUser(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/auth/users/${userId}/reject`, {
            method: 'PUT'
        });
        if (response.ok) {
            showNotification('用户拒绝成功', 'success');
            // 重新加载审批页面
            loadApprovalPage();
        } else {
            showNotification('用户拒绝失败', 'error');
        }
    } catch (error) {
        console.error('Error rejecting user:', error);
        showNotification('网络错误，请稍后重试', 'error');
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', init);
