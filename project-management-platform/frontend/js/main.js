// 全局变量
let currentUser = null;
let projects = [];
let tasks = [];
let teams = [];
let isLoading = false;

// DOM元素
let navItems;
let sections;
let projectItems;
let taskItems;
let teamItems;
let projectFilter;
let taskProjectSelect;
let editTaskProjectSelect;

// 初始化
async function init() {
    // 检查登录状态
    if (!checkLoginStatus()) {
        window.location.href = 'auth.html';
        return;
    }

    // 获取DOM元素
    initDOM();

    // 添加用户信息到头部
    addUserInfoToHeader();

    // 显示加载状态
    isLoading = true;
    renderProjects();
    renderTasks();
    renderTeams();

    // 加载数据
    try {
        await Promise.all([
            fetchProjects(),
            fetchTasks(),
            fetchTeams()
        ]);
    } finally {
        // 隐藏加载状态
        isLoading = false;
        renderProjects();
        renderTasks();
        renderTeams();
    }

    // 设置事件监听器
    setupEventListeners();

    // 设置表单提交
    setupAddProjectForm();
    setupEditProjectForm();
    setupAddTaskForm();
    setupEditTaskForm();
    setupAddTeamForm();
    setupEditTeamForm();
}

// 初始化DOM元素
function initDOM() {
    navItems = document.querySelectorAll('.nav-item');
    sections = document.querySelectorAll('.section');
    projectItems = document.getElementById('project-items');
    taskItems = document.getElementById('task-items');
    teamItems = document.getElementById('team-items');
    projectFilter = document.getElementById('project-filter');
    taskProjectSelect = document.getElementById('task-project');
    editTaskProjectSelect = document.getElementById('edit-task-project');
}

// 检查登录状态
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        currentUser = JSON.parse(user);
        return true;
    }
    return false;
}

// 添加用户信息到头部
function addUserInfoToHeader() {
    if (!currentUser) return;
    
    const userEmail = document.getElementById('user-email');
    if (userEmail) {
        userEmail.textContent = currentUser.email;
    }
}

// 获取项目列表
async function fetchProjects() {
    try {
        const response = await fetch('http://localhost:5000/api/projects', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            projects = await response.json();
            updateProjectSelects();
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// 获取任务列表
async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:5000/api/tasks', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            tasks = await response.json();
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// 获取团队列表
async function fetchTeams() {
    try {
        const response = await fetch('http://localhost:5000/api/teams', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            teams = await response.json();
        }
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
}

// 更新项目选择器
function updateProjectSelects() {
    if (projectFilter) {
        projectFilter.innerHTML = '<option value="all">所有项目</option>';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            projectFilter.appendChild(option);
        });
    }

    if (taskProjectSelect) {
        taskProjectSelect.innerHTML = '<option value="">选择项目</option>';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            taskProjectSelect.appendChild(option);
        });
    }

    if (editTaskProjectSelect) {
        editTaskProjectSelect.innerHTML = '<option value="">选择项目</option>';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            editTaskProjectSelect.appendChild(option);
        });
    }
}

// 渲染加载状态
function renderLoading(container) {
    if (!container) return;
    
    container.innerHTML = '';
    const loadingItem = document.createElement('div');
    loadingItem.className = 'loading-item';
    loadingItem.style.gridColumn = '1 / -1';
    loadingItem.style.textAlign = 'center';
    loadingItem.style.padding = '40px 0';
    loadingItem.innerHTML = `
        <div class="loading-spinner"></div>
        <p style="margin-top: 16px; color: #666;">加载中...</p>
    `;
    container.appendChild(loadingItem);
}

// 渲染项目列表
function renderProjects() {
    if (!projectItems) return;
    
    projectItems.innerHTML = '';
    
    if (isLoading) {
        renderLoading(projectItems);
        return;
    }
    
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
            <div class="description-column">${project.description || '无'}</div>
            <div class="owner-column">${project.owner}</div>
            <div class="status-column">
                <span class="status-badge ${project.status}">${getStatusText(project.status)}</span>
            </div>
            <div class="actions-column">
                <button class="action-btn edit" onclick="editProject('${project.id}')">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="action-btn delete" onclick="deleteProject('${project.id}')">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        `;
        
        projectItems.appendChild(projectItem);
    });
}

// 渲染任务列表
function renderTasks() {
    if (!taskItems) return;
    
    taskItems.innerHTML = '';
    
    if (isLoading) {
        renderLoading(taskItems);
        return;
    }
    
    let filteredTasks = tasks;
    if (projectFilter && projectFilter.value !== 'all') {
        filteredTasks = tasks.filter(task => task.project_id === projectFilter.value);
    }
    
    if (filteredTasks.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.className = 'task-item';
        emptyItem.style.gridColumn = '1 / -1';
        emptyItem.style.textAlign = 'center';
        emptyItem.textContent = '暂无任务';
        taskItems.appendChild(emptyItem);
        return;
    }
    
    filteredTasks.forEach(task => {
        const project = projects.find(p => p.id === task.project_id);
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        
        taskItem.innerHTML = `
            <div class="id-column">${task.id}</div>
            <div class="title-column">${task.title}</div>
            <div class="project-column">${project?.name || '未知项目'}</div>
            <div class="status-column">
                <span class="status-badge ${task.status}">${getStatusText(task.status)}</span>
            </div>
            <div class="priority-column">
                <span class="priority-badge ${task.priority}">${getPriorityText(task.priority)}</span>
            </div>
            <div class="assignee-column">${task.assignee || '未分配'}</div>
            <div class="due-date-column">${task.due_date || '无'}</div>
            <div class="actions-column">
                <button class="action-btn edit" onclick="editTask('${task.id}')">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="action-btn delete" onclick="deleteTask('${task.id}')">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        `;
        
        taskItems.appendChild(taskItem);
    });
}

// 渲染团队列表
function renderTeams() {
    if (!teamItems) return;
    
    teamItems.innerHTML = '';
    
    if (isLoading) {
        renderLoading(teamItems);
        return;
    }
    
    if (teams.length === 0) {
        const emptyItem = document.createElement('div');
        emptyItem.className = 'team-item';
        emptyItem.style.gridColumn = '1 / -1';
        emptyItem.style.textAlign = 'center';
        emptyItem.textContent = '暂无团队';
        teamItems.appendChild(emptyItem);
        return;
    }
    
    teams.forEach(team => {
        const teamItem = document.createElement('div');
        teamItem.className = 'team-item';
        
        teamItem.innerHTML = `
            <div class="id-column">${team.id}</div>
            <div class="name-column">${team.name}</div>
            <div class="description-column">${team.description || '无'}</div>
            <div class="members-column">${team.members.join(', ') || '无'}</div>
            <div class="actions-column">
                <button class="action-btn edit" onclick="editTeam('${team.id}')">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="action-btn delete" onclick="deleteTeam('${team.id}')">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        `;
        
        teamItems.appendChild(teamItem);
    });
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
            });
        });
    }
    
    // 项目筛选
    if (projectFilter) {
        projectFilter.addEventListener('change', renderTasks);
    }
    
    // 登出按钮
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'auth.html';
        });
    }
    
    // 添加项目按钮
    const addProjectBtn = document.getElementById('add-project-btn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            document.getElementById('add-project-modal').classList.add('show');
        });
    }
    
    // 添加任务按钮
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            document.getElementById('add-task-modal').classList.add('show');
        });
    }
    
    // 添加团队按钮
    const addTeamBtn = document.getElementById('add-team-btn');
    if (addTeamBtn) {
        addTeamBtn.addEventListener('click', () => {
            document.getElementById('add-team-modal').classList.add('show');
        });
    }
    
    // 关闭模态框
    const closeBtns = document.querySelectorAll('.close-btn, .close-modal');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // 点击模态框外部关闭
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// 设置添加项目表单
function setupAddProjectForm() {
    const addProjectForm = document.getElementById('add-project-form');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const projectData = {
                name: document.getElementById('project-name').value,
                description: document.getElementById('project-description').value
            };
            
            // 禁用提交按钮
            const submitBtn = addProjectForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('http://localhost:5000/api/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(projectData)
                });
                
                if (response.ok) {
                    // 显示加载状态
                    isLoading = true;
                    renderProjects();
                    
                    await fetchProjects();
                    
                    // 隐藏加载状态
                    isLoading = false;
                    renderProjects();
                    
                    document.getElementById('add-project-modal').classList.remove('show');
                    addProjectForm.reset();
                    showNotification('项目添加成功', 'success');
                } else {
                    showNotification('项目添加失败', 'error');
                }
            } catch (error) {
                console.error('Error adding project:', error);
                showNotification('网络错误，请稍后重试', 'error');
            } finally {
                // 恢复提交按钮
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// 设置编辑项目表单
function setupEditProjectForm() {
    const editProjectForm = document.getElementById('edit-project-form');
    if (editProjectForm) {
        editProjectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const projectId = document.getElementById('edit-project-id').value;
            const projectData = {
                name: document.getElementById('edit-project-name').value,
                description: document.getElementById('edit-project-description').value,
                status: document.getElementById('edit-project-status').value
            };
            
            // 禁用提交按钮
            const submitBtn = editProjectForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(projectData)
                });
                
                if (response.ok) {
                    // 显示加载状态
                    isLoading = true;
                    renderProjects();
                    
                    await fetchProjects();
                    
                    // 隐藏加载状态
                    isLoading = false;
                    renderProjects();
                    
                    document.getElementById('edit-project-modal').classList.remove('show');
                    showNotification('项目编辑成功', 'success');
                } else {
                    showNotification('项目编辑失败', 'error');
                }
            } catch (error) {
                console.error('Error editing project:', error);
                showNotification('网络错误，请稍后重试', 'error');
            } finally {
                // 恢复提交按钮
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// 设置添加任务表单
function setupAddTaskForm() {
    const addTaskForm = document.getElementById('add-task-form');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const taskData = {
                project_id: document.getElementById('task-project').value,
                title: document.getElementById('task-title').value,
                description: document.getElementById('task-description').value,
                status: document.getElementById('task-status').value,
                priority: document.getElementById('task-priority').value,
                assignee: document.getElementById('task-assignee').value,
                due_date: document.getElementById('task-due-date').value
            };
            
            // 禁用提交按钮
            const submitBtn = addTaskForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('http://localhost:5000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(taskData)
                });
                
                if (response.ok) {
                    // 显示加载状态
                    isLoading = true;
                    renderTasks();
                    
                    await fetchTasks();
                    
                    // 隐藏加载状态
                    isLoading = false;
                    renderTasks();
                    
                    document.getElementById('add-task-modal').classList.remove('show');
                    addTaskForm.reset();
                    showNotification('任务添加成功', 'success');
                } else {
                    showNotification('任务添加失败', 'error');
                }
            } catch (error) {
                console.error('Error adding task:', error);
                showNotification('网络错误，请稍后重试', 'error');
            } finally {
                // 恢复提交按钮
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// 设置编辑任务表单
function setupEditTaskForm() {
    const editTaskForm = document.getElementById('edit-task-form');
    if (editTaskForm) {
        editTaskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const taskId = document.getElementById('edit-task-id').value;
            const taskData = {
                project_id: document.getElementById('edit-task-project').value,
                title: document.getElementById('edit-task-title').value,
                description: document.getElementById('edit-task-description').value,
                status: document.getElementById('edit-task-status').value,
                priority: document.getElementById('edit-task-priority').value,
                assignee: document.getElementById('edit-task-assignee').value,
                due_date: document.getElementById('edit-task-due-date').value
            };
            
            // 禁用提交按钮
            const submitBtn = editTaskForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(taskData)
                });
                
                if (response.ok) {
                    // 显示加载状态
                    isLoading = true;
                    renderTasks();
                    
                    await fetchTasks();
                    
                    // 隐藏加载状态
                    isLoading = false;
                    renderTasks();
                    
                    document.getElementById('edit-task-modal').classList.remove('show');
                    showNotification('任务编辑成功', 'success');
                } else {
                    showNotification('任务编辑失败', 'error');
                }
            } catch (error) {
                console.error('Error editing task:', error);
                showNotification('网络错误，请稍后重试', 'error');
            } finally {
                // 恢复提交按钮
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// 设置添加团队表单
function setupAddTeamForm() {
    const addTeamForm = document.getElementById('add-team-form');
    if (addTeamForm) {
        addTeamForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const teamData = {
                name: document.getElementById('team-name').value,
                description: document.getElementById('team-description').value,
                members: document.getElementById('team-members').value.split(',').map(m => m.trim()).filter(m => m)
            };
            
            // 禁用提交按钮
            const submitBtn = addTeamForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('http://localhost:5000/api/teams', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(teamData)
                });
                
                if (response.ok) {
                    // 显示加载状态
                    isLoading = true;
                    renderTeams();
                    
                    await fetchTeams();
                    
                    // 隐藏加载状态
                    isLoading = false;
                    renderTeams();
                    
                    document.getElementById('add-team-modal').classList.remove('show');
                    addTeamForm.reset();
                    showNotification('团队添加成功', 'success');
                } else {
                    showNotification('团队添加失败', 'error');
                }
            } catch (error) {
                console.error('Error adding team:', error);
                showNotification('网络错误，请稍后重试', 'error');
            } finally {
                // 恢复提交按钮
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// 设置编辑团队表单
function setupEditTeamForm() {
    const editTeamForm = document.getElementById('edit-team-form');
    if (editTeamForm) {
        editTeamForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const teamId = document.getElementById('edit-team-id').value;
            const teamData = {
                name: document.getElementById('edit-team-name').value,
                description: document.getElementById('edit-team-description').value,
                members: document.getElementById('edit-team-members').value.split(',').map(m => m.trim()).filter(m => m)
            };
            
            // 禁用提交按钮
            const submitBtn = editTeamForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(teamData)
                });
                
                if (response.ok) {
                    // 显示加载状态
                    isLoading = true;
                    renderTeams();
                    
                    await fetchTeams();
                    
                    // 隐藏加载状态
                    isLoading = false;
                    renderTeams();
                    
                    document.getElementById('edit-team-modal').classList.remove('show');
                    showNotification('团队编辑成功', 'success');
                } else {
                    showNotification('团队编辑失败', 'error');
                }
            } catch (error) {
                console.error('Error editing team:', error);
                showNotification('网络错误，请稍后重试', 'error');
            } finally {
                // 恢复提交按钮
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// 编辑项目
async function editProject(projectId) {
    try {
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const project = await response.json();
        
        // 填充编辑表单
        document.getElementById('edit-project-id').value = project.id;
        document.getElementById('edit-project-name').value = project.name;
        document.getElementById('edit-project-description').value = project.description || '';
        document.getElementById('edit-project-status').value = project.status;
        
        // 显示编辑模态框
        document.getElementById('edit-project-modal').classList.add('show');
    } catch (error) {
        console.error('Error fetching project:', error);
        showNotification('获取项目详情失败', 'error');
    }
}

// 删除项目
async function deleteProject(projectId) {
    if (confirm('确定要删除这个项目吗？')) {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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

// 编辑任务
async function editTask(taskId) {
    try {
        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const task = await response.json();
        
        // 填充编辑表单
        document.getElementById('edit-task-id').value = task.id;
        document.getElementById('edit-task-project').value = task.project_id;
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-description').value = task.description || '';
        document.getElementById('edit-task-status').value = task.status;
        document.getElementById('edit-task-priority').value = task.priority;
        document.getElementById('edit-task-assignee').value = task.assignee || '';
        document.getElementById('edit-task-due-date').value = task.due_date || '';
        
        // 显示编辑模态框
        document.getElementById('edit-task-modal').classList.add('show');
    } catch (error) {
        console.error('Error fetching task:', error);
        showNotification('获取任务详情失败', 'error');
    }
}

// 删除任务
async function deleteTask(taskId) {
    if (confirm('确定要删除这个任务吗？')) {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                await fetchTasks();
                renderTasks();
                showNotification('任务删除成功', 'success');
            } else {
                showNotification('任务删除失败', 'error');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            showNotification('网络错误，请稍后重试', 'error');
        }
    }
}

// 编辑团队
async function editTeam(teamId) {
    try {
        const response = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const team = await response.json();
        
        // 填充编辑表单
        document.getElementById('edit-team-id').value = team.id;
        document.getElementById('edit-team-name').value = team.name;
        document.getElementById('edit-team-description').value = team.description || '';
        document.getElementById('edit-team-members').value = team.members.join(', ');
        
        // 显示编辑模态框
        document.getElementById('edit-team-modal').classList.add('show');
    } catch (error) {
        console.error('Error fetching team:', error);
        showNotification('获取团队详情失败', 'error');
    }
}

// 删除团队
async function deleteTeam(teamId) {
    if (confirm('确定要删除这个团队吗？')) {
        try {
            const response = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                await fetchTeams();
                renderTeams();
                showNotification('团队删除成功', 'success');
            } else {
                showNotification('团队删除失败', 'error');
            }
        } catch (error) {
            console.error('Error deleting team:', error);
            showNotification('网络错误，请稍后重试', 'error');
        }
    }
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'active': '活跃',
        'completed': '已完成',
        'on_hold': '暂停',
        'todo': '待办',
        'in_progress': '进行中',
        'blocked': '阻塞'
    };
    return statusMap[status] || status;
}

// 获取优先级文本
function getPriorityText(priority) {
    const priorityMap = {
        'low': '低',
        'medium': '中',
        'high': '高',
        'urgent': '紧急'
    };
    return priorityMap[priority] || priority;
}

// 显示通知
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
