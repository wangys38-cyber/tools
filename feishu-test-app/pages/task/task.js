const app = getApp()

Page({
  data: {
    task: null,
    taskId: ''
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        taskId: options.id
      })
      this.loadTask(options.id)
    }
  },

  onShow: function() {
    if (this.data.taskId) {
      this.loadTask(this.data.taskId)
    }
  },

  loadTask: function(taskId) {
    const tasks = app.getTasks()
    const task = tasks.find(t => t.id === taskId)
    this.setData({
      task: task
    })
  },

  getStatusText: function(status) {
    const statusMap = {
      pending: '待开始',
      in_progress: '进行中',
      completed: '已完成'
    }
    return statusMap[status] || status
  },

  startTest: function() {
    const tasks = app.getTasks()
    const taskIndex = tasks.findIndex(t => t.id === this.data.taskId)
    
    if (taskIndex >= 0) {
      tasks[taskIndex].status = 'in_progress'
      tasks[taskIndex].startTime = new Date().toLocaleString('zh-CN')
      tasks[taskIndex].progressHistory = [{
        date: new Date().toLocaleDateString('zh-CN'),
        progress: 0,
        remark: '开始测试'
      }]
      
      app.setTasks(tasks)
      this.loadTask(this.data.taskId)
      
      wx.showToast({
        title: '测试已开始',
        icon: 'success'
      })
    }
  },

  goToProgress: function() {
    wx.navigateTo({
      url: `/pages/progress/progress?id=${this.data.taskId}`
    })
  },

  completeTask: function() {
    wx.showModal({
      title: '确认完成',
      content: '确定要标记此任务为完成吗？',
      success: (res) => {
        if (res.confirm) {
          const tasks = app.getTasks()
          const taskIndex = tasks.findIndex(t => t.id === this.data.taskId)
          
          if (taskIndex >= 0) {
            tasks[taskIndex].status = 'completed'
            tasks[taskIndex].progress = 100
            
            const today = new Date().toLocaleDateString('zh-CN')
            const lastProgress = tasks[taskIndex].progressHistory[tasks[taskIndex].progressHistory.length - 1]
            
            if (!lastProgress || lastProgress.date !== today) {
              tasks[taskIndex].progressHistory.push({
                date: today,
                progress: 100,
                remark: '任务完成'
              })
            } else {
              lastProgress.progress = 100
              lastProgress.remark = '任务完成'
            }
            
            app.setTasks(tasks)
            this.loadTask(this.data.taskId)
            
            wx.showToast({
              title: '任务已完成',
              icon: 'success'
            })
          }
        }
      }
    })
  }
})