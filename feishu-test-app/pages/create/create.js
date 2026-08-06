const app = getApp()

Page({
  data: {
    formData: {
      title: '',
      description: '',
      assignee: '',
      assigneeId: '',
      estimatedDays: 3,
      remark: ''
    },
    testers: [
      { id: 'user1', name: '张三' },
      { id: 'user2', name: '李四' },
      { id: 'user3', name: '王五' },
      { id: 'user4', name: '赵六' },
      { id: 'user5', name: '钱七' }
    ]
  },

  onInput: function(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`formData.${field}`]: value
    })
  },

  onTesterChange: function(e) {
    const index = e.detail.value
    const tester = this.data.testers[index]
    this.setData({
      'formData.assignee': tester.name,
      'formData.assigneeId': tester.id
    })
  },

  decreaseDays: function() {
    const days = parseInt(this.data.formData.estimatedDays) || 1
    if (days > 1) {
      this.setData({
        'formData.estimatedDays': days - 1
      })
    }
  },

  increaseDays: function() {
    const days = parseInt(this.data.formData.estimatedDays) || 1
    if (days < 30) {
      this.setData({
        'formData.estimatedDays': days + 1
      })
    }
  },

  resetForm: function() {
    this.setData({
      formData: {
        title: '',
        description: '',
        assignee: '',
        assigneeId: '',
        estimatedDays: 3,
        remark: ''
      }
    })
  },

  submitForm: function() {
    const { title, assignee, estimatedDays } = this.data.formData

    if (!title.trim()) {
      wx.showToast({
        title: '请输入任务名称',
        icon: 'none'
      })
      return
    }

    if (!assignee) {
      wx.showToast({
        title: '请选择测试人员',
        icon: 'none'
      })
      return
    }

    if (!estimatedDays || estimatedDays < 1) {
      wx.showToast({
        title: '预估天数至少为1天',
        icon: 'none'
      })
      return
    }

    const tasks = app.getTasks()
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: this.data.formData.description.trim(),
      assignee: assignee,
      assigneeId: this.data.formData.assigneeId,
      status: 'pending',
      startTime: '',
      estimatedDays: parseInt(estimatedDays),
      progress: 0,
      progressHistory: [],
      createdAt: new Date().toLocaleString('zh-CN')
    }

    tasks.push(newTask)
    app.setTasks(tasks)

    wx.showToast({
      title: '任务创建成功',
      icon: 'success'
    })

    setTimeout(() => {
      this.resetForm()
    }, 1500)
  }
})