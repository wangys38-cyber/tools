// 全局变量
let currentUser = null;
let tasks = [];
let currentTaskId = null;
let selectedProgress = 0;
let testers = [];

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
  // 检查登录状态
  checkLoginStatus();
  
  // 绑定事件
  bindEvents();
  
  // 初始化Mock数据
  initMockData();
  
  // 加载测试人员
  loadTesters();
});

// 检查登录状态
function checkLoginStatus() {
  const savedUser = localStorage.getItem('feishu_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showAppPage();
  } else {
    showLoginPage();
  }
}

// 显示登录页面
function showLoginPage() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('app-page').style.display = 'none';
}

// 显示应用页面
function showAppPage() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('app-page').style.display = 'flex';
  
  // 更新用户信息
  updateUserInfo();
  
  // 加载任务列表
  loadTasks();
  
  // 显示默认页面
  showPage('tasks');
}

// 更新用户信息
function updateUserInfo() {
  if (currentUser) {
    document.getElementById('user-name').textContent = currentUser.name || '用户';
    if (currentUser.avatar) {
      document.getElementById('user-avatar').src = currentUser.avatar;
    }
  }
}

// 绑定事件
function bindEvents() {
  // 登录按钮
  document.getElementById('login-btn').addEventListener('click', login);
  
  // 退出按钮
  document.getElementById('logout-btn').addEventListener('click', logout);
  
  // 导航切换
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      const page = this.dataset.page;
      showPage(page);
    });
  });
  
  // 筛选按钮
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      filterTasks(this.dataset.filter);
    });
  });
  
  // 创建任务表单
  document.getElementById('create-form').addEventListener('submit', function(e) {
    e.preventDefault();
    createTask();
  });
  
  // 进度选项
  document.querySelectorAll('.progress-option').forEach(option => {
    option.addEventListener('click', function() {
      selectProgressOption(this.dataset.value);
    });
  });
}

// 飞书登录
function login() {
  // 使用飞书SDK进行登录
  if (window.h5sdk) {
    // 初始化飞书SDK
    window.h5sdk.config({
      appId: 'cli_aaa50689fff81bb7',
      timestamp: Date.now(),
      nonceStr: Math.random().toString(36).substr(2, 15),
      signature: '',
      jsApiList: ['getAuthCode', 'getUserInfo']
    });
    
    // 获取授权码
    window.h5sdk.ready(function() {
      window.h5sdk.invoke('getAuthCode', {}, function(res) {
        if (res.code === 0) {
          // 使用授权码获取用户信息
          fetchUserInfo(res.authCode);
        } else {
          // SDK调用失败，使用模拟数据
          handleMockLogin();
        }
      });
    });
  } else {
    // 飞书SDK不可用，使用模拟数据
    handleMockLogin();
  }
}

// 获取用户信息
function fetchUserInfo(authCode) {
  // 调用飞书API获取用户信息
  // 实际应用中需要后端配合
  fetch('https://open.feishu.cn/open-apis/authen/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: authCode,
      client_id: 'cli_aaa50689fff81bb7',
      client_secret: 'your_client_secret'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.access_token) {
      // 获取用户信息
      return fetch('https://open.feishu.cn/open-apis/contact/v3/users/me', {
        headers: {
          'Authorization': 'Bearer ' + data.access_token
        }
      });
    }
    throw new Error('获取token失败');
  })
  .then(response => response.json())
  .then(userData => {
    if (userData.data) {
      const user = {
        id: userData.data.user_id,
        name: userData.data.name || userData.data.email?.split('@')[0] || '用户',
        avatar: userData.data.avatar_url || '',
        email: userData.data.email || ''
      };
      saveUserAndLogin(user);
    } else {
      handleMockLogin();
    }
  })
  .catch(error => {
    console.error('飞书登录失败:', error);
    handleMockLogin();
  });
}

// 使用模拟数据登录
function handleMockLogin() {
  const mockUser = {
    id: 'user1',
    name: '张三',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20asian%20business%20person%20portrait%20avatar%20friendly%20smile%20white%20background&image_size=square',
    email: 'zhangsan@example.com'
  };
  
  saveUserAndLogin(mockUser);
}

// 保存用户信息并登录
function saveUserAndLogin(user) {
  currentUser = user;
  localStorage.setItem('feishu_user', JSON.stringify(user));
  
  showToast('登录成功');
  setTimeout(() => {
    showAppPage();
  }, 1000);
}

// 退出登录
function logout() {
  localStorage.removeItem('feishu_user');
  currentUser = null;
  showToast('已退出登录');
  setTimeout(() => {
    showLoginPage();
  }, 1000);
}

// 显示页面
function showPage(pageName) {
  // 更新导航状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === pageName) {
      item.classList.add('active');
    }
  });
  
  // 隐藏所有页面
  document.querySelectorAll('.content-page').forEach(page => {
    page.style.display = 'none';
  });
  
  // 显示目标页面
  document.getElementById(pageName + '-page').style.display = 'block';
  
  // 如果是统计页面，更新图表
  if (pageName === 'statistics') {
    updateCharts();
  }
  
  // 如果是测试人员页面，加载测试人员列表
  if (pageName === 'testers') {
    renderTestersList();
  }
  
  // 如果是创建任务页面，更新测试人员选择框
  if (pageName === 'create') {
    updateTesterSelect();
  }
}

// 初始化Mock数据
function initMockData() {
  const savedTasks = localStorage.getItem('test_tasks');
  if (!savedTasks) {
    tasks = [
      {
        id: '1',
        title: '登录模块测试',
        description: '测试用户登录功能，包括账号密码登录、验证码登录、第三方登录',
        assignee: 'user1',
        assigneeName: '张三',
        status: 'in_progress',
        startTime: '2024-01-15 09:00',
        estimatedDays: 5,
        progress: 60,
        progressHistory: [
          { date: '2024-01-15', progress: 20, remark: '开始测试' },
          { date: '2024-01-16', progress: 40, remark: '完成账号密码登录测试' },
          { date: '2024-01-17', progress: 60, remark: '完成验证码登录测试' }
        ],
        createdAt: '2024-01-14 10:00'
      },
      {
        id: '2',
        title: '支付功能测试',
        description: '测试微信支付、支付宝支付、银行卡支付等支付方式',
        assignee: 'user2',
        assigneeName: '李四',
        status: 'pending',
        startTime: '',
        estimatedDays: 7,
        progress: 0,
        progressHistory: [],
        createdAt: '2024-01-14 11:00'
      },
      {
        id: '3',
        title: '订单模块测试',
        description: '测试订单创建、支付、发货、退款等完整流程',
        assignee: 'user3',
        assigneeName: '王五',
        status: 'completed',
        startTime: '2024-01-10 08:30',
        estimatedDays: 3,
        progress: 100,
        progressHistory: [
          { date: '2024-01-10', progress: 30, remark: '开始订单创建测试' },
          { date: '2024-01-11', progress: 70, remark: '完成支付和发货测试' },
          { date: '2024-01-12', progress: 100, remark: '完成退款测试，任务完成' }
        ],
        createdAt: '2024-01-09 15:00'
      },
      {
        id: '4',
        title: '商品管理测试',
        description: '测试商品上架、下架、编辑、删除等功能',
        assignee: 'user4',
        assigneeName: '赵六',
        status: 'pending',
        startTime: '',
        estimatedDays: 4,
        progress: 0,
        progressHistory: [],
        createdAt: '2024-01-15 09:00'
      },
      {
        id: '5',
        title: '用户中心测试',
        description: '测试用户信息修改、头像上传、密码修改等功能',
        assignee: 'user5',
        assigneeName: '钱七',
        status: 'in_progress',
        startTime: '2024-01-16 10:00',
        estimatedDays: 3,
        progress: 40,
        progressHistory: [
          { date: '2024-01-16', progress: 20, remark: '开始测试' },
          { date: '2024-01-17', progress: 40, remark: '完成用户信息修改测试' }
        ],
        createdAt: '2024-01-15 14:00'
      }
    ];
    saveTasks();
  } else {
    tasks = JSON.parse(savedTasks);
  }
}

// 保存任务
function saveTasks() {
  localStorage.setItem('test_tasks', JSON.stringify(tasks));
}

// 加载任务
function loadTasks() {
  const savedTasks = localStorage.getItem('test_tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  renderTaskList(tasks);
  updateStats();
}

// 渲染任务列表
function renderTaskList(taskList) {
  const container = document.getElementById('task-list');
  
  if (taskList.length === 0) {
    container.innerHTML = '';
    document.getElementById('empty-tasks').style.display = 'block';
    return;
  }
  
  document.getElementById('empty-tasks').style.display = 'none';
  
  container.innerHTML = taskList.map(task => `
    <div class="task-card">
      <div class="task-card-header">
        <h4 class="task-title" onclick="openTaskModal('${task.id}')">${task.title}</h4>
        <div class="task-actions">
          <span class="status-badge status-${task.status}">${getStatusText(task.status)}</span>
          <button class="delete-btn" onclick="showDeleteConfirm('${task.id}', '${task.title}')" title="删除任务">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="task-meta" onclick="openTaskModal('${task.id}')">
        <span>👤 ${task.assigneeName}</span>
        <span>📅 ${task.startTime || '未开始'}</span>
      </div>
      ${task.status !== 'pending' ? `
        <div class="task-progress" onclick="openTaskModal('${task.id}')">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${task.progress}%"></div>
          </div>
          <span class="progress-text">进度 ${task.progress}%</span>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// 显示删除确认弹窗
function showDeleteConfirm(taskId, taskTitle) {
  document.getElementById('delete-task-id').value = taskId;
  document.getElementById('delete-task-title').textContent = taskTitle;
  document.getElementById('delete-modal').style.display = 'flex';
}

// 删除任务
function deleteTask() {
  const taskId = document.getElementById('delete-task-id').value;
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasks();
  loadTasks();
  
  showToast('任务已删除');
  closeDeleteModal();
}

// 关闭删除确认弹窗
function closeDeleteModal() {
  document.getElementById('delete-modal').style.display = 'none';
  document.getElementById('delete-task-id').value = '';
}

// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    pending: '待开始',
    in_progress: '进行中',
    completed: '已完成'
  };
  return statusMap[status] || status;
}

// 更新统计数据
function updateStats() {
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const progressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  
  document.getElementById('pending-count').textContent = pendingCount;
  document.getElementById('progress-count').textContent = progressCount;
  document.getElementById('completed-count').textContent = completedCount;
}

// 加载测试人员
function loadTesters() {
  const savedTesters = localStorage.getItem('testers');
  if (savedTesters) {
    testers = JSON.parse(savedTesters);
  } else {
    // 初始化默认测试人员
    testers = [
      { id: 'user1', name: '张三', email: '' },
      { id: 'user2', name: '李四', email: '' },
      { id: 'user3', name: '王五', email: '' },
      { id: 'user4', name: '赵六', email: '' },
      { id: 'user5', name: '钱七', email: '' }
    ];
    saveTesters();
  }
}

// 保存测试人员
function saveTesters() {
  localStorage.setItem('testers', JSON.stringify(testers));
}

// 渲染测试人员列表
function renderTestersList() {
  const container = document.getElementById('testers-list');
  const emptyState = document.getElementById('empty-testers');
  
  if (testers.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  
  container.innerHTML = testers.map(tester => `
    <div class="tester-card">
      <div class="tester-avatar">
        <i class="fa-solid fa-user"></i>
      </div>
      <div class="tester-info">
        <h4 class="tester-name">${tester.name}</h4>
        <p class="tester-id">ID: ${tester.id}</p>
        ${tester.email ? `<p class="tester-email">${tester.email}</p>` : ''}
      </div>
      <button class="delete-tester-btn" onclick="deleteTester('${tester.id}')" title="删除测试人员">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join('');
}

// 显示添加测试人员弹窗
function showAddTesterModal() {
  document.getElementById('add-tester-modal').style.display = 'flex';
  document.getElementById('tester-name').value = '';
  document.getElementById('tester-id').value = '';
  document.getElementById('tester-email').value = '';
}

// 关闭添加测试人员弹窗
function closeAddTesterModal() {
  document.getElementById('add-tester-modal').style.display = 'none';
}

// 添加测试人员
function addTester(event) {
  event.preventDefault();
  
  const name = document.getElementById('tester-name').value.trim();
  const id = document.getElementById('tester-id').value.trim();
  const email = document.getElementById('tester-email').value.trim();
  
  if (!name || !id) {
    showToast('请填写必填项');
    return;
  }
  
  // 检查ID是否已存在
  if (testers.some(t => t.id === id)) {
    showToast('该飞书ID已存在');
    return;
  }
  
  testers.push({ id, name, email });
  saveTesters();
  renderTestersList();
  closeAddTesterModal();
  
  showToast('测试人员添加成功');
}

// 删除测试人员
function deleteTester(testerId) {
  if (!confirm('确定要删除该测试人员吗？')) {
    return;
  }
  
  testers = testers.filter(t => t.id !== testerId);
  saveTesters();
  renderTestersList();
  
  showToast('测试人员已删除');
}

// 更新测试人员选择框
function updateTesterSelect() {
  const select = document.getElementById('task-assignee');
  select.innerHTML = testers.map(tester => 
    `<option value="${tester.id}">${tester.name}</option>`
  ).join('');
}

// 筛选任务
function filterTasks(filter) {
  // 更新筛选按钮状态
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === filter) {
      btn.classList.add('active');
    }
  });
  
  // 筛选任务
  let filteredTasks = tasks;
  if (filter !== 'all') {
    filteredTasks = tasks.filter(t => t.status === filter);
  }
  
  // 重新渲染列表
  renderTaskList(filteredTasks);
}

// 创建任务
function createTask() {
  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-desc').value.trim();
  const assignee = document.getElementById('task-assignee').value;
  const days = parseInt(document.getElementById('task-days').value);
  
  if (!title) {
    showToast('请输入任务名称');
    return;
  }
  
  if (!assignee) {
    showToast('请选择测试人员');
    return;
  }
  
  const tester = testers.find(t => t.id === assignee);
  if (!tester) {
    showToast('测试人员不存在');
    return;
  }
  
  const newTask = {
    id: Date.now().toString(),
    title: title,
    description: description,
    assignee: assignee,
    assigneeName: tester.name,
    status: 'pending',
    startTime: '',
    estimatedDays: days,
    progress: 0,
    progressHistory: [],
    createdAt: new Date().toLocaleString('zh-CN')
  };
  
  tasks.push(newTask);
  saveTasks();
  loadTasks();
  
  showToast('任务创建成功');
  resetForm();
  
  // 切换到任务列表页面
  showPage('tasks');
}

// 重置表单
function resetForm() {
  document.getElementById('task-title').value = '';
  document.getElementById('task-desc').value = '';
  document.getElementById('task-assignee').value = '';
  document.getElementById('task-days').value = '3';
}

// 增加天数
function increaseDays() {
  const input = document.getElementById('task-days');
  const value = parseInt(input.value);
  if (value < 30) {
    input.value = value + 1;
  }
}

// 减少天数
function decreaseDays() {
  const input = document.getElementById('task-days');
  const value = parseInt(input.value);
  if (value > 1) {
    input.value = value - 1;
  }
}

// 打开任务详情弹窗
function openTaskModal(taskId) {
  currentTaskId = taskId;
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) return;
  
  document.getElementById('modal-title').textContent = task.title;
  document.getElementById('modal-status').textContent = getStatusText(task.status);
  document.getElementById('modal-status').className = `status-badge status-${task.status}`;
  document.getElementById('modal-assignee').textContent = task.assigneeName;
  document.getElementById('modal-days').textContent = task.estimatedDays + '天';
  document.getElementById('modal-start').textContent = task.startTime || '未开始';
  document.getElementById('modal-progress-value').textContent = task.progress + '%';
  document.getElementById('modal-progress-fill').style.width = task.progress + '%';
  
  // 更新历史记录
  renderHistory(task.progressHistory);
  
  // 显示/隐藏操作按钮
  document.getElementById('start-btn').style.display = task.status === 'pending' ? 'block' : 'none';
  document.getElementById('progress-btn').style.display = task.status === 'in_progress' ? 'block' : 'none';
  document.getElementById('complete-btn').style.display = (task.status === 'in_progress' && task.progress >= 80) ? 'block' : 'none';
  
  document.getElementById('task-modal').style.display = 'flex';
}

// 渲染历史记录
function renderHistory(history) {
  const container = document.getElementById('modal-history');
  
  if (history.length === 0) {
    container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">暂无进度记录</p>';
    return;
  }
  
  container.innerHTML = history.map(item => `
    <div class="history-item">
      <div class="history-date">${item.date}</div>
      <div class="history-content">
        <div class="history-progress-bar">
          <div class="history-progress-fill" style="width: ${item.progress}%"></div>
        </div>
        <div class="history-info">
          <span class="history-percent">${item.progress}%</span>
          <span class="history-remark">${item.remark}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// 关闭弹窗
function closeModal() {
  document.getElementById('task-modal').style.display = 'none';
  currentTaskId = null;
}

// 开始任务
function startTask() {
  const task = tasks.find(t => t.id === currentTaskId);
  if (!task) return;
  
  task.status = 'in_progress';
  task.startTime = new Date().toLocaleString('zh-CN');
  task.progressHistory = [{
    date: new Date().toLocaleDateString('zh-CN'),
    progress: 0,
    remark: '开始测试'
  }];
  
  saveTasks();
  loadTasks();
  
  showToast('测试已开始');
  closeModal();
}

// 打开进度更新弹窗
function openProgressUpdate() {
  const task = tasks.find(t => t.id === currentTaskId);
  if (!task) return;
  
  // 设置默认进度为当前进度+10%
  selectedProgress = Math.min(task.progress + 10, 100);
  
  // 更新进度选项状态
  document.querySelectorAll('.progress-option').forEach(opt => {
    opt.classList.remove('active');
    if (opt.dataset.value == selectedProgress) {
      opt.classList.add('active');
    }
  });
  
  // 清空输入
  document.getElementById('progress-remark').value = '';
  document.getElementById('progress-issues').value = '';
  
  // 关闭任务弹窗，打开进度弹窗
  document.getElementById('task-modal').style.display = 'none';
  document.getElementById('progress-modal').style.display = 'flex';
}

// 选择进度选项
function selectProgressOption(value) {
  selectedProgress = parseInt(value);
  
  document.querySelectorAll('.progress-option').forEach(opt => {
    opt.classList.remove('active');
    if (opt.dataset.value == selectedProgress) {
      opt.classList.add('active');
    }
  });
}

// 关闭进度弹窗
function closeProgressModal() {
  document.getElementById('progress-modal').style.display = 'none';
  selectedProgress = 0;
}

// 提交进度
function submitProgress() {
  const remark = document.getElementById('progress-remark').value.trim();
  const issues = document.getElementById('progress-issues').value.trim();
  
  if (!remark) {
    showToast('请输入进度说明');
    return;
  }
  
  const task = tasks.find(t => t.id === currentTaskId);
  if (!task) return;
  
  if (selectedProgress <= task.progress) {
    showToast('进度不能小于或等于当前进度');
    return;
  }
  
  task.progress = selectedProgress;
  
  const today = new Date().toLocaleDateString('zh-CN');
  const lastProgress = task.progressHistory[task.progressHistory.length - 1];
  
  if (!lastProgress || lastProgress.date !== today) {
    task.progressHistory.push({
      date: today,
      progress: selectedProgress,
      remark: remark + (issues ? ' | 问题：' + issues : '')
    });
  } else {
    lastProgress.progress = selectedProgress;
    lastProgress.remark = remark + (issues ? ' | 问题：' + issues : '');
  }
  
  saveTasks();
  loadTasks();
  
  showToast('进度更新成功');
  closeProgressModal();
}

// 完成任务
function completeTask() {
  const task = tasks.find(t => t.id === currentTaskId);
  if (!task) return;
  
  task.status = 'completed';
  task.progress = 100;
  
  const today = new Date().toLocaleDateString('zh-CN');
  const lastProgress = task.progressHistory[task.progressHistory.length - 1];
  
  if (!lastProgress || lastProgress.date !== today) {
    task.progressHistory.push({
      date: today,
      progress: 100,
      remark: '任务完成'
    });
  } else {
    lastProgress.progress = 100;
    lastProgress.remark = '任务完成';
  }
  
  saveTasks();
  loadTasks();
  
  showToast('任务已完成');
  closeModal();
}

// 更新图表
function updateCharts() {
  // 任务状态分布饼图
  const pending = tasks.filter(t => t.status === 'pending').length;
  const progress = tasks.filter(t => t.status === 'in_progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  
  if (window.statusChart) {
    window.statusChart.destroy();
  }
  
  const statusCtx = document.getElementById('status-chart').getContext('2d');
  window.statusChart = new Chart(statusCtx, {
    type: 'doughnut',
    data: {
      labels: ['待开始', '进行中', '已完成'],
      datasets: [{
        data: [pending, progress, completed],
        backgroundColor: ['#fa8c16', '#1890ff', '#52c41a'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
  
  // 测试进度趋势图
  const progressData = tasks.filter(t => t.status !== 'pending').map(t => ({
    name: t.title.slice(0, 6) + '...',
    progress: t.progress
  }));
  
  if (window.progressChart) {
    window.progressChart.destroy();
  }
  
  const progressCtx = document.getElementById('progress-chart').getContext('2d');
  window.progressChart = new Chart(progressCtx, {
    type: 'bar',
    data: {
      labels: progressData.map(d => d.name),
      datasets: [{
        label: '完成度',
        data: progressData.map(d => d.progress),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 8
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
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
  
  // 更新排行榜
  updateRanking();
}

// 更新排行榜
function updateRanking() {
  const assigneeStats = {};
  
  tasks.forEach(task => {
    if (!assigneeStats[task.assignee]) {
      assigneeStats[task.assignee] = {
        name: task.assigneeName,
        completed: 0,
        totalProgress: 0,
        count: 0
      };
    }
    if (task.status === 'completed') {
      assigneeStats[task.assignee].completed++;
    }
    assigneeStats[task.assignee].totalProgress += task.progress;
    assigneeStats[task.assignee].count++;
  });
  
  const ranking = Object.values(assigneeStats).map(stat => ({
    ...stat,
    avgProgress: stat.count > 0 ? Math.round(stat.totalProgress / stat.count) : 0
  })).sort((a, b) => b.completed - a.completed);
  
  const tbody = document.getElementById('ranking-body');
  tbody.innerHTML = ranking.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.completed}</td>
      <td>${item.avgProgress}%</td>
    </tr>
  `).join('');
}

// 显示Toast消息
function showToast(message) {
  document.getElementById('toast-message').textContent = message;
  document.getElementById('toast').style.display = 'flex';
  
  setTimeout(() => {
    document.getElementById('toast').style.display = 'none';
  }, 2000);
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});