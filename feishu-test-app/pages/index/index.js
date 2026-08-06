const app = getApp()

Page({
  data: {
    tasks: [],
    currentFilter: 'all',
    pendingCount: 0,
    inProgressCount: 0,
    completedCount: 0
  },

  onLoad: function() {
    this.loadTasks()
  },

  onShow: function() {
    this.loadTasks()
  },

  loadTasks: function() {
    const tasks = app.getTasks()
    this.setData({
      tasks: tasks,
      pendingCount: tasks.filter(t => t.status === 'pending').length,
      inProgressCount: tasks.filter(t => t.status === 'in_progress').length,
      completedCount: tasks.filter(t => t.status === 'completed').length
    })
  },

  setFilter: function(filter) {
    this.setData({
      currentFilter: filter
    })
  },

  get filteredTasks() {
    const { tasks, currentFilter } = this.data
    if (currentFilter === 'all') {
      return tasks
    }
    return tasks.filter(t => t.status === currentFilter)
  },

  getStatusText: function(status) {
    const statusMap = {
      pending: '待开始',
      in_progress: '进行中',
      completed: '已完成'
    }
    return statusMap[status] || status
  },

  goToTask: function(e) {
    const taskId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/task/task?id=${taskId}`
    })
  },

  goToCreate: function() {
    wx.navigateTo({
      url: '/pages/create/create'
    })
  }
})