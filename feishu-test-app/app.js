App({
  onLaunch: function() {
    console.log('测试任务管理小程序启动')
    this.initMockData()
  },
  
  onShow: function() {
    console.log('小程序显示')
  },
  
  onHide: function() {
    console.log('小程序隐藏')
  },
  
  initMockData: function() {
    const tasks = this.getTasks()
    if (tasks.length === 0) {
      const mockTasks = [
        {
          id: '1',
          title: '登录模块测试',
          description: '测试用户登录功能，包括账号密码登录、验证码登录、第三方登录',
          assignee: '张三',
          assigneeId: 'user1',
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
          assignee: '李四',
          assigneeId: 'user2',
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
          assignee: '王五',
          assigneeId: 'user3',
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
        }
      ]
      this.setTasks(mockTasks)
    }
  },
  
  getTasks: function() {
    try {
      const tasks = localStorage.getItem('test_tasks')
      return tasks ? JSON.parse(tasks) : []
    } catch (e) {
      return []
    }
  },
  
  setTasks: function(tasks) {
    try {
      localStorage.setItem('test_tasks', JSON.stringify(tasks))
    } catch (e) {
      console.error('保存任务失败', e)
    }
  },
  
  getCurrentUser: function() {
    return {
      id: 'user1',
      name: '张三',
      avatar: ''
    }
  }
})