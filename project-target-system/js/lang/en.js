export const en = {
    // Navigation
    nav: {
        projects: 'Project Management',
        dashboard: 'Data Dashboard',
        aiAssistant: 'AI Assistant',
        versionPlan: 'Version Plan',
        devPlan: 'Development Plan',
        health: 'Health Tracking',
        dataEntry: 'Data Entry',
        charts: 'Comparison Charts'
    },
    
    // Common
    common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        confirm: 'Confirm',
        yes: 'Yes',
        no: 'No',
        close: 'Close',
        search: 'Search',
        select: 'Please select',
        action: 'Action',
        required: 'Required field',
        loading: 'Loading...',
        noData: 'No data available',
        confirmDelete: 'Are you sure you want to delete this item?',
        createdSuccess: 'Created successfully',
        updatedSuccess: 'Updated successfully',
        deletedSuccess: 'Deleted successfully',
        type: 'Type'
    },
    
    // Theme
    theme: {
        dark: 'Dark Mode',
        light: 'Light Mode'
    },
    
    // Project Management
    project: {
        title: 'Project Management',
        addProject: 'Add New Project',
        projectName: 'Project Name',
        description: 'Description',
        targets: 'Targets',
        integrationTarget: 'Feature Integration Rate Target (%)',
        stabilityTarget: 'MTTF Duration Target (ms)',
        crBlockerTarget: 'Blocker CR Target',
        crCriticalTarget: 'Critical CR Target',
        projectList: 'Project List',
        status: 'Status',
        action: 'Action',
        noProjects: 'No projects found. Please add a new project.',
        editProject: 'Edit Project',
        deleteProject: 'Delete Project',
        viewDetails: 'View Details'
    },
    
    // Data Dashboard
    dashboard: {
        title: 'Data Dashboard',
        selectProject: 'Select Project:',
        timePeriod: 'Time Period:',
        last7Days: 'Last 7 Days',
        last30Days: 'Last 30 Days',
        last90Days: 'Last 90 Days',
        allTime: 'All Time',
        projectName: 'Project Name',
        versionPlans: 'Version Plans',
        completionRate: 'Completion Rate',
        activeTasks: 'Active Tasks',
        projectOverview: 'Project Overview',
        recentEntries: 'Recent Data Entries',
        status: 'Status',
        date: 'Date',
        completion: 'Completion'
    },
    
    // AI Assistant
    ai: {
        title: 'AI Assistant',
        description: 'Let AI analyze your project data and provide insights',
        selectProject: 'Select Project:',
        enterPrompt: 'Enter your question or request:',
        promptPlaceholder: 'Ask AI to analyze your project data...\n\nExamples:\n- Summarize the current project status\n- What are the main issues?\n- Suggest improvements for the project\n- Analyze the completion rate',
        feishuDocUrl: 'Feishu Document URL:',
        feishuDocPlaceholder: 'https://example.feishu.cn/docx/...',
        generate: 'Generate Analysis',
        analyzeDoc: 'Analyze Document',
        clear: 'Clear',
        analyzing: 'AI is analyzing your project data...',
        analyzingDoc: 'AI is analyzing the document...',
        resultTitle: 'AI Analysis Result',
        docResultTitle: 'Document Analysis Result',
        poweredBy: 'Powered by Doubao'
    },
    
    // Version Plan
    version: {
        title: 'Version Plan',
        projectSelect: 'Select Project:',
        addVersion: 'Add Version Plan',
        versionName: 'Version Name',
        releaseDate: 'Release Date',
        description: 'Description',
        versionList: 'Version List',
        editVersion: 'Edit Version',
        deleteVersion: 'Delete Version',
        noVersions: 'No version plans found for this project.'
    },
    
    // Development Plan
    devPlan: {
        title: 'Development Plan',
        projectSelect: 'Select Project:',
        addTask: 'Add Development Task',
        taskName: 'Task Name',
        assignee: 'Assignee',
        status: 'Status',
        priority: 'Priority',
        deadline: 'Deadline',
        description: 'Description',
        statusOptions: {
            pending: 'Pending',
            'in-progress': 'In Progress',
            completed: 'Completed',
            blocked: 'Blocked'
        },
        priorityOptions: {
            high: 'High',
            medium: 'Medium',
            low: 'Low'
        },
        taskList: 'Task List',
        editTask: 'Edit Task',
        deleteTask: 'Delete Task',
        noTasks: 'No development tasks found for this project.'
    },
    
    // Health Tracking
    health: {
        title: 'Health Tracking',
        projectSelect: 'Select Project:',
        versionSelect: 'Select Version:',
        currentStatus: 'Current Health Status',
        metrics: 'Health Metrics',
        integrationRate: 'Feature Integration Rate',
        stability: 'MTTF Duration',
        crBlocker: 'Blocker CR Count',
        crCritical: 'Critical CR Count',
        healthScore: 'Health Score',
        excellent: 'Excellent',
        good: 'Good',
        warning: 'Warning',
        critical: 'Critical'
    },
    
    // Data Entry
    dataEntry: {
        title: 'Data Entry',
        projectSelect: 'Select Project:',
        versionSelect: 'Select Version:',
        entryDate: 'Entry Date',
        integrationRate: 'Feature Integration Rate (%)',
        stability: 'MTTF Duration (ms)',
        crBlocker: 'Blocker CR Count',
        crCritical: 'Critical CR Count',
        submit: 'Submit Data',
        entrySuccess: 'Data entry submitted successfully',
        noVersions: 'Please add a version plan first.'
    },
    
    // Comparison Charts
    charts: {
        title: 'Comparison Charts',
        projectSelect: 'Select Project:',
        selectMetric: 'Select Metric:',
        integration: 'Feature Integration Rate',
        stability: 'MTTF Duration',
        crBlocker: 'Blocker CR',
        crCritical: 'Critical CR',
        version: 'Version',
        value: 'Value',
        noData: 'No data available for chart display.'
    }
};