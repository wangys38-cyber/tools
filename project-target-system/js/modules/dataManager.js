// Data Manager Module - Handles all data storage and retrieval

const STORAGE_KEYS = {
    PROJECTS: 'project_target_projects',
    DATA: 'project_target_data',
    THEME: 'project_target_theme',
    VERSION_PLANS: 'project_target_version_plans',
    DEV_PLANS: 'project_target_dev_plans',
    HEALTH_DATA: 'project_target_health_data',
    LANGUAGE: 'project_target_language'
};

export class DataManager {
    constructor() {
        this.projects = [];
        this.versionPlans = [];
        this.devPlans = [];
        this.healthData = [];
        this.loadAllData();
    }

    loadAllData() {
        this.projects = this.loadData(STORAGE_KEYS.PROJECTS, []);
        this.versionPlans = this.loadData(STORAGE_KEYS.VERSION_PLANS, []);
        this.devPlans = this.loadData(STORAGE_KEYS.DEV_PLANS, []);
        this.healthData = this.loadData(STORAGE_KEYS.HEALTH_DATA, []);
    }

    loadData(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`Error loading data for ${key}:`, error);
            return defaultValue;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving data for ${key}:`, error);
            return false;
        }
    }

    // Project Management
    addProject(project) {
        const newProject = {
            id: Date.now().toString(),
            name: project.name,
            description: project.description || '',
            targets: project.targets || {
                integration: 80,
                stability: 9000,
                cr_blocker: 0,
                cr_critical: 1
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.projects.push(newProject);
        this.saveData(STORAGE_KEYS.PROJECTS, this.projects);
        return newProject;
    }

    updateProject(projectId, updates) {
        const index = this.projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            this.projects[index] = {
                ...this.projects[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveData(STORAGE_KEYS.PROJECTS, this.projects);
            return this.projects[index];
        }
        return null;
    }

    deleteProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        this.versionPlans = this.versionPlans.filter(v => v.projectId !== projectId);
        this.devPlans = this.devPlans.filter(d => d.projectId !== projectId);
        this.healthData = this.healthData.filter(h => h.projectId !== projectId);
        
        this.saveData(STORAGE_KEYS.PROJECTS, this.projects);
        this.saveData(STORAGE_KEYS.VERSION_PLANS, this.versionPlans);
        this.saveData(STORAGE_KEYS.DEV_PLANS, this.devPlans);
        this.saveData(STORAGE_KEYS.HEALTH_DATA, this.healthData);
        
        return true;
    }

    getProjectById(projectId) {
        return this.projects.find(p => p.id === projectId);
    }

    // Version Plan Management
    addVersionPlan(versionPlan) {
        const newVersion = {
            id: Date.now().toString(),
            projectId: versionPlan.projectId,
            versionName: versionPlan.versionName,
            releaseDate: versionPlan.releaseDate,
            description: versionPlan.description || '',
            createdAt: new Date().toISOString()
        };
        this.versionPlans.push(newVersion);
        this.saveData(STORAGE_KEYS.VERSION_PLANS, this.versionPlans);
        return newVersion;
    }

    updateVersionPlan(versionId, updates) {
        const index = this.versionPlans.findIndex(v => v.id === versionId);
        if (index !== -1) {
            this.versionPlans[index] = {
                ...this.versionPlans[index],
                ...updates
            };
            this.saveData(STORAGE_KEYS.VERSION_PLANS, this.versionPlans);
            return this.versionPlans[index];
        }
        return null;
    }

    deleteVersionPlan(versionId) {
        this.versionPlans = this.versionPlans.filter(v => v.id !== versionId);
        this.saveData(STORAGE_KEYS.VERSION_PLANS, this.versionPlans);
        return true;
    }

    getVersionPlansByProject(projectId) {
        return this.versionPlans.filter(v => v.projectId === projectId);
    }

    getVersionPlanById(versionId) {
        return this.versionPlans.find(v => v.id === versionId);
    }

    // Development Plan Management
    addDevPlan(devPlan) {
        const newDevPlan = {
            id: Date.now().toString(),
            projectId: devPlan.projectId,
            versionId: devPlan.versionId || null,
            taskName: devPlan.taskName,
            assignee: devPlan.assignee || '',
            status: devPlan.status || 'pending',
            priority: devPlan.priority || 'medium',
            deadline: devPlan.deadline || '',
            description: devPlan.description || '',
            phase: devPlan.phase || 'firmware',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.devPlans.push(newDevPlan);
        this.saveData(STORAGE_KEYS.DEV_PLANS, this.devPlans);
        return newDevPlan;
    }

    updateDevPlan(taskId, updates) {
        const index = this.devPlans.findIndex(d => d.id === taskId);
        if (index !== -1) {
            this.devPlans[index] = {
                ...this.devPlans[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveData(STORAGE_KEYS.DEV_PLANS, this.devPlans);
            return this.devPlans[index];
        }
        return null;
    }

    deleteDevPlan(taskId) {
        this.devPlans = this.devPlans.filter(d => d.id !== taskId);
        this.saveData(STORAGE_KEYS.DEV_PLANS, this.devPlans);
        return true;
    }

    getDevPlansByProject(projectId) {
        return this.devPlans.filter(d => d.projectId === projectId);
    }

    getDevPlanById(taskId) {
        return this.devPlans.find(d => d.id === taskId);
    }

    // Health Data Management
    addHealthData(healthDataItem) {
        const newHealthData = {
            id: Date.now().toString(),
            projectId: healthDataItem.projectId,
            versionId: healthDataItem.versionId,
            entryDate: healthDataItem.entryDate || new Date().toISOString().split('T')[0],
            integration: parseFloat(healthDataItem.integration) || 0,
            stability: parseFloat(healthDataItem.stability) || 0,
            cr_blocker: parseInt(healthDataItem.cr_blocker) || 0,
            cr_critical: parseInt(healthDataItem.cr_critical) || 0,
            createdAt: new Date().toISOString()
        };
        this.healthData.push(newHealthData);
        this.saveData(STORAGE_KEYS.HEALTH_DATA, this.healthData);
        return newHealthData;
    }

    updateHealthData(dataId, updates) {
        const index = this.healthData.findIndex(h => h.id === dataId);
        if (index !== -1) {
            this.healthData[index] = {
                ...this.healthData[index],
                ...updates
            };
            this.saveData(STORAGE_KEYS.HEALTH_DATA, this.healthData);
            return this.healthData[index];
        }
        return null;
    }

    deleteHealthData(dataId) {
        this.healthData = this.healthData.filter(h => h.id !== dataId);
        this.saveData(STORAGE_KEYS.HEALTH_DATA, this.healthData);
        return true;
    }

    getHealthDataByProject(projectId) {
        return this.healthData.filter(h => h.projectId === projectId);
    }

    getLatestHealthData(projectId) {
        const projectData = this.getHealthDataByProject(projectId);
        if (projectData.length === 0) return null;
        return projectData.reduce((latest, current) => 
            new Date(current.entryDate) > new Date(latest.entryDate) ? current : latest
        );
    }

    // Statistics
    getProjectStats(projectId) {
        const devPlans = this.getDevPlansByProject(projectId);
        const completedCount = devPlans.filter(d => d.status === 'completed').length;
        const activeCount = devPlans.filter(d => d.status === 'in-progress').length;
        
        return {
            totalTasks: devPlans.length,
            completedTasks: completedCount,
            activeTasks: activeCount,
            completionRate: devPlans.length > 0 ? Math.round((completedCount / devPlans.length) * 100) : 0
        };
    }

    // Export/Import
    exportAllData() {
        const exportData = {
            projects: this.projects,
            versionPlans: this.versionPlans,
            devPlans: this.devPlans,
            healthData: this.healthData,
            exportDate: new Date().toISOString()
        };
        return exportData;
    }

    importData(importData) {
        if (importData.projects) this.projects = importData.projects;
        if (importData.versionPlans) this.versionPlans = importData.versionPlans;
        if (importData.devPlans) this.devPlans = importData.devPlans;
        if (importData.healthData) this.healthData = importData.healthData;
        
        this.saveData(STORAGE_KEYS.PROJECTS, this.projects);
        this.saveData(STORAGE_KEYS.VERSION_PLANS, this.versionPlans);
        this.saveData(STORAGE_KEYS.DEV_PLANS, this.devPlans);
        this.saveData(STORAGE_KEYS.HEALTH_DATA, this.healthData);
        
        return true;
    }
}

// Create singleton instance
export const dataManager = new DataManager();