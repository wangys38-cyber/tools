// UI Renderer Module - Handles all UI rendering

import { dataManager } from './dataManager.js';

export class UIRenderer {
    constructor() {
        this.currentLanguage = localStorage.getItem('project_target_language') || 'zh';
        this.t = this.currentLanguage === 'en' ? window.enData : window.zhData;
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        this.t = lang === 'en' ? window.enData : window.zhData;
    }

    // Render project cards
    renderProjects() {
        const projects = dataManager.projects;
        const container = document.getElementById('projects-list');
        const emptyState = document.getElementById('empty-projects');

        if (projects.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }

        emptyState.style.display = 'none';
        container.style.display = 'grid';
        
        container.innerHTML = projects.map(project => {
            const stats = dataManager.getProjectStats(project.id);
            return `
                <div class="project-card" data-project-id="${project.id}">
                    <div class="project-header">
                        <h3>${this.escapeHtml(project.name)}</h3>
                        <div class="project-status-badge ${this.getStatusClass(stats.completionRate)}">
                            ${stats.completionRate}%
                        </div>
                    </div>
                    ${project.description ? `<p>${this.escapeHtml(project.description)}</p>` : ''}
                    <div class="project-stats">
                        <div class="stat">
                            <span class="stat-value">${stats.totalTasks}</span>
                            <span class="stat-label">${this.t.project.targets || 'Targets'}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${stats.completedTasks}</span>
                            <span class="stat-label">${this.t.devPlan.statusOptions.completed || 'Completed'}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${stats.activeTasks}</span>
                            <span class="stat-label">${this.t.devPlan.statusOptions['in-progress'] || 'In Progress'}</span>
                        </div>
                    </div>
                    <div class="project-actions">
                        <button class="btn btn-sm" onclick="viewProjectDetail('${project.id}')">
                            ${this.t.project.viewDetails || 'View Details'}
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="showEditProjectModal('${project.id}')">
                            ${this.t.common.edit || 'Edit'}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="confirmDeleteProject('${project.id}')">
                            ${this.t.common.delete || 'Delete'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render version plans
    renderVersionPlans(projectId) {
        const versions = dataManager.getVersionPlansByProject(projectId);
        const container = document.getElementById('version-plan-list');
        const emptyState = document.getElementById('empty-version-plan');

        if (versions.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'flex';
            return;
        }

        emptyState.style.display = 'none';
        
        container.innerHTML = versions.map(version => `
            <div class="version-card" data-version-id="${version.id}">
                <div class="version-header">
                    <span class="version-name">${this.escapeHtml(version.versionName)}</span>
                    <span class="version-date">${this.formatDate(version.releaseDate)}</span>
                </div>
                ${version.description ? `<p>${this.escapeHtml(version.description)}</p>` : ''}
                <div class="version-actions">
                    <button class="btn btn-sm" onclick="showEditVersionModal('${version.id}')">
                        ${this.t.common.edit || 'Edit'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVersion('${version.id}')">
                        ${this.t.common.delete || 'Delete'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Render development plans
    renderDevPlans(projectId) {
        const devPlans = dataManager.getDevPlansByProject(projectId);
        const container = document.getElementById('dev-plan-list');
        const emptyState = document.getElementById('empty-dev-plan');

        if (devPlans.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'flex';
            return;
        }

        emptyState.style.display = 'none';
        
        container.innerHTML = devPlans.map(plan => `
            <div class="dev-plan-card" data-task-id="${plan.id}">
                <div class="dev-plan-header">
                    <h4>${this.escapeHtml(plan.taskName)}</h4>
                    <span class="priority-badge ${plan.priority}">${this.getPriorityLabel(plan.priority)}</span>
                </div>
                <div class="dev-plan-meta">
                    <span class="meta-item">👤 ${this.escapeHtml(plan.assignee || '-')}</span>
                    <span class="meta-item">📅 ${this.formatDate(plan.deadline)}</span>
                    <span class="meta-item">📌 ${this.getPhaseLabel(plan.phase)}</span>
                </div>
                <div class="dev-plan-status">
                    <span class="status-tag ${plan.status}">${this.getStatusLabel(plan.status)}</span>
                </div>
                ${plan.description ? `<p class="dev-plan-desc">${this.escapeHtml(plan.description)}</p>` : ''}
                <div class="dev-plan-actions">
                    <button class="btn btn-sm" onclick="showEditDevPlanModal('${plan.id}')">
                        ${this.t.common.edit || 'Edit'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDevPlan('${plan.id}')">
                        ${this.t.common.delete || 'Delete'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Render health data list
    renderHealthData(projectId) {
        const healthData = dataManager.getHealthDataByProject(projectId);
        const container = document.getElementById('health-data-list');
        
        if (healthData.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>${this.t.common.noData || 'No data available'}</p></div>`;
            return;
        }

        const sortedData = [...healthData].sort((a, b) => 
            new Date(b.entryDate) - new Date(a.entryDate)
        );

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>${this.t.dataEntry.entryDate || 'Date'}</th>
                        <th>${this.t.health.integrationRate || 'Integration Rate'}</th>
                        <th>${this.t.health.stability || 'MTTF'}</th>
                        <th>${this.t.health.crBlocker || 'Blocker CR'}</th>
                        <th>${this.t.health.crCritical || 'Critical CR'}</th>
                        <th>${this.t.common.action || 'Action'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedData.map(item => `
                        <tr>
                            <td>${this.formatDate(item.entryDate)}</td>
                            <td>${item.integration}%</td>
                            <td>${item.stability} ms</td>
                            <td>${item.cr_blocker}</td>
                            <td>${item.cr_critical}</td>
                            <td>
                                <button class="btn btn-sm btn-danger" onclick="deleteHealthData('${item.id}')">
                                    ${this.t.common.delete || 'Delete'}
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Render target inputs
    renderTargetInputs(projectId) {
        const project = dataManager.getProjectById(projectId);
        const container = document.getElementById('target-inputs');
        
        if (!project) return;

        const targets = project.targets || {
            integration: 80,
            stability: 9000,
            cr_blocker: 0,
            cr_critical: 1
        };

        container.innerHTML = `
            <div class="target-row">
                <label>${this.t.project.integrationTarget || 'Feature Integration Rate Target (%)'}</label>
                <input type="number" id="target-integration" value="${targets.integration}" min="0" max="100">
            </div>
            <div class="target-row">
                <label>${this.t.project.stabilityTarget || 'MTTF Duration Target (ms)'}</label>
                <input type="number" id="target-stability" value="${targets.stability}" min="0">
            </div>
            <div class="target-row">
                <label>${this.t.project.crBlockerTarget || 'Blocker CR Target'}</label>
                <input type="number" id="target-cr-blocker" value="${targets.cr_blocker}" min="0">
            </div>
            <div class="target-row">
                <label>${this.t.project.crCriticalTarget || 'Critical CR Target'}</label>
                <input type="number" id="target-cr-critical" value="${targets.cr_critical}" min="0">
            </div>
        `;
    }

    // Render project selector options
    renderProjectSelector(selectorId, selectedId = '') {
        const projects = dataManager.projects;
        const selector = document.getElementById(selectorId);
        
        if (!selector) return;

        selector.innerHTML = `
            <option value="" disabled ${!selectedId ? 'selected' : ''}>
                ${this.t.common.select || 'Please select'}
            </option>
            ${projects.map(project => `
                <option value="${project.id}" ${project.id === selectedId ? 'selected' : ''}>
                    ${this.escapeHtml(project.name)}
                </option>
            `).join('')}
        `;
    }

    // Render version selector options
    renderVersionSelector(selectorId, projectId, selectedId = '') {
        const versions = dataManager.getVersionPlansByProject(projectId);
        const selector = document.getElementById(selectorId);
        
        if (!selector) return;

        selector.innerHTML = `
            <option value="" disabled ${!selectedId ? 'selected' : ''}>
                ${this.t.common.select || 'Please select'}
            </option>
            ${versions.map(version => `
                <option value="${version.id}" ${version.id === selectedId ? 'selected' : ''}>
                    ${this.escapeHtml(version.versionName)}
                </option>
            `).join('')}
        `;
    }

    // Helper methods
    getStatusClass(rate) {
        if (rate >= 80) return 'status-excellent';
        if (rate >= 50) return 'status-good';
        if (rate >= 30) return 'status-warning';
        return 'status-critical';
    }

    getPriorityLabel(priority) {
        const labels = {
            high: this.t.devPlan.priorityOptions.high || 'High',
            medium: this.t.devPlan.priorityOptions.medium || 'Medium',
            low: this.t.devPlan.priorityOptions.low || 'Low'
        };
        return labels[priority] || priority;
    }

    getStatusLabel(status) {
        const labels = {
            pending: this.t.devPlan.statusOptions.pending || 'Pending',
            'in-progress': this.t.devPlan.statusOptions['in-progress'] || 'In Progress',
            completed: this.t.devPlan.statusOptions.completed || 'Completed',
            blocked: this.t.devPlan.statusOptions.blocked || 'Blocked'
        };
        return labels[status] || status;
    }

    getPhaseLabel(phase) {
        const labels = {
            firmware: this.t.devPlan.phases.firmware || 'Firmware',
            app: this.t.devPlan.phases.app || 'APP',
            integration: this.t.devPlan.phases.integration || 'Integration'
        };
        return labels[phase] || phase;
    }

    formatDate(dateStr) {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString(this.currentLanguage === 'zh' ? 'zh-CN' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Update all i18n texts
    updateTexts() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.translate(key);
            if (text) {
                element.textContent = text;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const text = this.translate(key);
            if (text) {
                element.placeholder = text;
            }
        });
    }

    translate(key) {
        const keys = key.split('.');
        let result = this.t;
        for (const k of keys) {
            result = result?.[k];
            if (!result) return null;
        }
        return result;
    }
}

// Create singleton instance
export const uiRenderer = new UIRenderer();