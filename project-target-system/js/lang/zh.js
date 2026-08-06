export const zh = {
    // Navigation
    nav: {
        projects: '项目管理',
        dashboard: '数据仪表盘',
        aiAssistant: 'AI助手',
        versionPlan: '版本计划',
        devPlan: '开发计划',
        health: '健康跟踪',
        dataEntry: '数据录入',
        charts: '对比图表'
    },
    
    // Common
    common: {
        save: '保存',
        cancel: '取消',
        delete: '删除',
        edit: '编辑',
        add: '添加',
        confirm: '确认',
        yes: '是',
        no: '否',
        close: '关闭',
        search: '搜索',
        select: '请选择',
        action: '操作',
        required: '必填字段',
        loading: '加载中...',
        noData: '暂无数据',
        confirmDelete: '确定要删除此项目吗？',
        createdSuccess: '创建成功',
        updatedSuccess: '更新成功',
        deletedSuccess: '删除成功',
        type: '类型'
    },
    
    // Theme
    theme: {
        dark: '深色模式',
        light: '浅色模式'
    },
    
    // Project Management
    project: {
        title: '项目管理',
        addProject: '添加新项目',
        projectName: '项目名称',
        description: '描述',
        targets: '目标指标',
        integrationTarget: '功能集成率目标 (%)',
        stabilityTarget: 'MTTF持续时间目标 (ms)',
        crBlockerTarget: 'Blocker CR目标',
        crCriticalTarget: 'Critical CR目标',
        projectList: '项目列表',
        status: '状态',
        action: '操作',
        noProjects: '未找到项目，请添加新项目。',
        editProject: '编辑项目',
        deleteProject: '删除项目',
        viewDetails: '查看详情'
    },
    
    // Data Dashboard
    dashboard: {
        title: '数据仪表盘',
        selectProject: '选择项目:',
        timePeriod: '时间周期:',
        last7Days: '最近7天',
        last30Days: '最近30天',
        last90Days: '最近90天',
        allTime: '全部时间',
        projectName: '项目名称',
        versionPlans: '版本计划数',
        completionRate: '完成率',
        activeTasks: '活跃任务数',
        projectOverview: '项目概览',
        recentEntries: '最近数据录入',
        status: '状态',
        date: '日期',
        completion: '完成率'
    },
    
    // AI Assistant
    ai: {
        title: 'AI助手',
        description: '让AI分析您的项目数据并提供洞察',
        selectProject: '选择项目:',
        enterPrompt: '输入您的问题或请求:',
        promptPlaceholder: '向AI询问项目数据分析...\n\n示例：\n- 总结当前项目状态\n- 主要问题是什么？\n- 建议项目改进方案\n- 分析完成率',
        feishuDocUrl: '飞书文档链接:',
        feishuDocPlaceholder: 'https://example.feishu.cn/docx/...',
        generate: '生成分析',
        analyzeDoc: '分析文档',
        clear: '清除',
        analyzing: 'AI正在分析您的项目数据...',
        analyzingDoc: 'AI正在分析文档...',
        resultTitle: 'AI分析结果',
        docResultTitle: '文档分析结果',
        poweredBy: '由豆包提供支持'
    },
    
    // Version Plan
    version: {
        title: '版本计划',
        projectSelect: '选择项目:',
        addVersion: '添加版本计划',
        versionName: '版本名称',
        releaseDate: '发布日期',
        description: '描述',
        versionList: '版本列表',
        editVersion: '编辑版本',
        deleteVersion: '删除版本',
        noVersions: '该项目暂无版本计划。'
    },
    
    // Development Plan
    devPlan: {
        title: '开发计划',
        projectSelect: '选择项目:',
        addTask: '添加开发任务',
        taskName: '任务名称',
        assignee: '负责人',
        status: '状态',
        priority: '优先级',
        deadline: '截止日期',
        description: '描述',
        statusOptions: {
            pending: '待处理',
            'in-progress': '进行中',
            completed: '已完成',
            blocked: '阻塞'
        },
        priorityOptions: {
            high: '高',
            medium: '中',
            low: '低'
        },
        taskList: '任务列表',
        editTask: '编辑任务',
        deleteTask: '删除任务',
        noTasks: '该项目暂无开发任务。'
    },
    
    // Health Tracking
    health: {
        title: '健康跟踪',
        projectSelect: '选择项目:',
        versionSelect: '选择版本:',
        currentStatus: '当前健康状态',
        metrics: '健康指标',
        integrationRate: '功能集成率',
        stability: 'MTTF持续时间',
        crBlocker: 'Blocker CR数量',
        crCritical: 'Critical CR数量',
        healthScore: '健康分数',
        excellent: '优秀',
        good: '良好',
        warning: '警告',
        critical: '严重'
    },
    
    // Data Entry
    dataEntry: {
        title: '数据录入',
        projectSelect: '选择项目:',
        versionSelect: '选择版本:',
        entryDate: '录入日期',
        integrationRate: '功能集成率 (%)',
        stability: 'MTTF持续时间 (ms)',
        crBlocker: 'Blocker CR数量',
        crCritical: 'Critical CR数量',
        submit: '提交数据',
        entrySuccess: '数据录入成功',
        noVersions: '请先添加版本计划。'
    },
    
    // Comparison Charts
    charts: {
        title: '对比图表',
        projectSelect: '选择项目:',
        selectMetric: '选择指标:',
        integration: '功能集成率',
        stability: 'MTTF持续时间',
        crBlocker: 'Blocker CR',
        crCritical: 'Critical CR',
        version: '版本',
        value: '数值',
        noData: '暂无数据可显示。'
    }
};