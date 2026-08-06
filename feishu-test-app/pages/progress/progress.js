const app = getApp()

Page({
  data: {
    task: null,
    taskId: '',
    selectedProgress: 0,
    remark: '',
    issues: '',
    progressOptions: [
      { value: 10, label: '10%' },
      { value: 20, label: '20%' },
      { value: 30, label: '30%' },
      { value: 40, label: '40%' },
      { value: 50, label: '50%' },
      { value: 60, label: '60%' },
      { value: 70, label: '70%' },
      { value: 80, label: '80%' },
      { value: 90, label: '90%' },
      { value: 100, label: '100%' }
    ]
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        taskId: options.id
      })
      this.loadTask(options.id)
    }
  },

  loadTask: function(taskId) {
    const tasks = app.getTasks()
    const task = tasks.find(t => t.id === taskId)
    this.setData({
      task: task,
      selectedProgress: task ? Math.min(task.progress + 10, 100) : 10
    })
  },

  selectProgress: function(e) {
    const value = parseInt(e.currentTarget.dataset.value)
    this.setData({
      selectedProgress: value
    })
  },

  onRemarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  onIssuesInput: function(e) {
    this.setData({
      issues: e.detail.value
    })
  },

  submitProgress: function() {
    const { selectedProgress, remark, task } = this.data

    if (!remark.trim()) {
      wx.showToast({
        title: '请输入进度说明',
        icon: 'none'
      })
      return
    }

    if (selectedProgress <= task.progress) {
      wx.showToast({
        title: '进度不能小于或等于当前进度',
        icon: 'none'
      })
      return
    }

    const tasks = app.getTasks()
    const taskIndex = tasks.findIndex(t => t.id === this.data.taskId)

    if (taskIndex >= 0) {
      tasks[taskIndex].progress = selectedProgress
      
      const today = new Date().toLocaleDateString('zh-CN')
      const lastProgress = tasks[taskIndex].progressHistory[tasks[taskIndex].progressHistory.length - 1]
      
      if (!lastProgress || lastProgress.date !== today) {
        tasks[taskIndex].progressHistory.push({
          date: today,
          progress: selectedProgress,
          remark: remark.trim() + (this.data.issues ? ' | 问题：' + this.data.issues.trim() : '')
        })
      } else {
        lastProgress.progress = selectedProgress
        lastProgress.remark = remark.trim() + (this.data.issues ? ' | 问题：' + this.data.issues.trim() : '')
      }

      app.setTasks(tasks)

      wx.showToast({
        title: '进度更新成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  goBack: function() {
    wx.navigateBack()
  }
})