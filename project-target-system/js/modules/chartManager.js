// Chart Manager Module - Handles all chart rendering

import { dataManager } from './dataManager.js';

export class ChartManager {
    constructor() {
        this.charts = {};
        this.currentLanguage = localStorage.getItem('project_target_language') || 'zh';
        this.t = this.currentLanguage === 'en' ? window.enData : window.zhData;
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        this.t = lang === 'en' ? window.enData : window.zhData;
    }

    // Destroy existing chart
    destroyChart(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    }

    // Render comparison chart for target vs actual
    renderComparisonChart(projectId, metricType) {
        const chartId = 'comparison-chart';
        const ctx = document.getElementById(chartId)?.getContext('2d');
        
        if (!ctx) return;

        this.destroyChart(chartId);

        const project = dataManager.getProjectById(projectId);
        const healthData = dataManager.getHealthDataByProject(projectId);
        
        if (!project || healthData.length === 0) {
            this.showNoDataMessage('comparison-chart-container');
            return;
        }

        document.getElementById('comparison-chart-container')?.classList.remove('no-data');

        const targetValue = project.targets?.[metricType] || 0;
        
        // Filter out zero values and sort by date
        const filteredData = healthData
            .filter(item => item[metricType] > 0)
            .sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));

        const labels = filteredData.map(item => {
            const date = new Date(item.entryDate);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        const actualValues = filteredData.map(item => item[metricType]);
        const targetValues = filteredData.map(() => targetValue);

        const metricLabel = this.getMetricLabel(metricType);
        const unit = this.getMetricUnit(metricType);

        const isLightTheme = document.body.classList.contains('light-theme');
        const textColor = isLightTheme ? '#334155' : '#f1f5f9';
        const gridColor = isLightTheme ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.1)';
        const borderColor = isLightTheme ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.3)';

        this.charts[chartId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: this.t.charts.target || 'Target',
                        data: targetValues,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.3,
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#ef4444',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2
                    },
                    {
                        label: this.t.charts.actual || 'Actual',
                        data: actualValues,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: '#6366f1',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: '#8b5cf6',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: textColor,
                            font: {
                                size: 13,
                                weight: '500'
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: isLightTheme ? '#fff' : 'rgba(30, 30, 50, 0.95)',
                        titleColor: isLightTheme ? '#1e293b' : '#fff',
                        bodyColor: isLightTheme ? '#475569' : '#e2e8f0',
                        borderColor: isLightTheme ? '#e2e8f0' : 'rgba(99, 102, 241, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: {
                            size: 13,
                            weight: '600'
                        },
                        bodyFont: {
                            size: 12
                        },
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${context.parsed.y}${unit}`;
                            }
                        }
                    },
                    datalabels: {
                        display: true,
                        color: textColor,
                        font: {
                            size: 11,
                            weight: '500'
                        },
                        formatter: (value) => `${value}${unit}`,
                        anchor: 'end',
                        align: 'top',
                        offset: 4
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: isLightTheme ? '#64748b' : '#94a3b8',
                            font: {
                                size: 12
                            }
                        },
                        title: {
                            display: true,
                            text: this.t.charts.version || 'Version/Date',
                            color: textColor,
                            font: {
                                size: 13,
                                weight: '600'
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: isLightTheme ? '#64748b' : '#94a3b8',
                            font: {
                                size: 12
                            },
                            callback: (value) => `${value}${unit}`
                        },
                        title: {
                            display: true,
                            text: `${metricLabel} (${unit})`,
                            color: textColor,
                            font: {
                                size: 13,
                                weight: '600'
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Render dashboard charts
    renderDashboardCharts(projectId) {
        const project = dataManager.getProjectById(projectId);
        const healthData = dataManager.getHealthDataByProject(projectId);
        
        if (!project || healthData.length === 0) return;

        this.renderIntegrationChart(projectId);
        this.renderStabilityChart(projectId);
        this.renderCrChart(projectId);
    }

    // Integration rate chart
    renderIntegrationChart(projectId) {
        const chartId = 'integration-chart';
        const ctx = document.getElementById(chartId)?.getContext('2d');
        
        if (!ctx) return;

        this.destroyChart(chartId);

        const project = dataManager.getProjectById(projectId);
        const healthData = dataManager.getHealthDataByProject(projectId);
        
        if (!project || healthData.length === 0) return;

        const targetValue = project.targets?.integration || 80;
        const filteredData = healthData
            .filter(item => item.integration > 0)
            .sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));

        this.renderSimpleLineChart(chartId, ctx, filteredData, 'integration', targetValue, 
            this.t.health.integrationRate || 'Integration Rate', '%');
    }

    // Stability chart
    renderStabilityChart(projectId) {
        const chartId = 'stability-chart';
        const ctx = document.getElementById(chartId)?.getContext('2d');
        
        if (!ctx) return;

        this.destroyChart(chartId);

        const project = dataManager.getProjectById(projectId);
        const healthData = dataManager.getHealthDataByProject(projectId);
        
        if (!project || healthData.length === 0) return;

        const targetValue = project.targets?.stability || 9000;
        const filteredData = healthData
            .filter(item => item.stability > 0)
            .sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));

        this.renderSimpleLineChart(chartId, ctx, filteredData, 'stability', targetValue, 
            this.t.health.stability || 'MTTF Duration', 'ms');
    }

    // CR chart
    renderCrChart(projectId) {
        const chartId = 'cr-chart';
        const ctx = document.getElementById(chartId)?.getContext('2d');
        
        if (!ctx) return;

        this.destroyChart(chartId);

        const healthData = dataManager.getHealthDataByProject(projectId);
        
        if (healthData.length === 0) return;

        const filteredData = healthData
            .filter(item => item.cr_blocker > 0 || item.cr_critical > 0)
            .sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));

        const labels = filteredData.map(item => {
            const date = new Date(item.entryDate);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        const isLightTheme = document.body.classList.contains('light-theme');
        const textColor = isLightTheme ? '#334155' : '#f1f5f9';
        const gridColor = isLightTheme ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.1)';

        this.charts[chartId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Blocker CR',
                        data: filteredData.map(item => item.cr_blocker),
                        backgroundColor: 'rgba(239, 68, 68, 0.8)',
                        borderColor: '#ef4444',
                        borderWidth: 1,
                        borderRadius: 6
                    },
                    {
                        label: 'Critical CR',
                        data: filteredData.map(item => item.cr_critical),
                        backgroundColor: 'rgba(249, 115, 22, 0.8)',
                        borderColor: '#f97316',
                        borderWidth: 1,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: textColor,
                            font: {
                                size: 12,
                                weight: '500'
                            },
                            padding: 16,
                            usePointStyle: true
                        }
                    },
                    datalabels: {
                        display: true,
                        color: textColor,
                        font: {
                            size: 11,
                            weight: '600'
                        },
                        anchor: 'end',
                        align: 'top',
                        offset: 4
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: isLightTheme ? '#64748b' : '#94a3b8',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: isLightTheme ? '#64748b' : '#94a3b8',
                            font: {
                                size: 11
                            },
                            stepSize: 1
                        },
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Helper: render simple line chart
    renderSimpleLineChart(chartId, ctx, data, field, targetValue, label, unit) {
        const labels = data.map(item => {
            const date = new Date(item.entryDate);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        const actualValues = data.map(item => item[field]);
        const targetValues = data.map(() => targetValue);

        const isLightTheme = document.body.classList.contains('light-theme');
        const textColor = isLightTheme ? '#334155' : '#f1f5f9';
        const gridColor = isLightTheme ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.1)';

        this.charts[chartId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: this.t.charts.target || 'Target',
                        data: targetValues,
                        borderColor: '#ef4444',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0,
                        fill: false,
                        pointRadius: 0
                    },
                    {
                        label: this.t.charts.actual || 'Actual',
                        data: actualValues,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        borderWidth: 2.5,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: '#6366f1',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 1.5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: isLightTheme ? '#fff' : 'rgba(30, 30, 50, 0.95)',
                        titleColor: isLightTheme ? '#1e293b' : '#fff',
                        bodyColor: isLightTheme ? '#475569' : '#e2e8f0',
                        borderColor: isLightTheme ? '#e2e8f0' : 'rgba(99, 102, 241, 0.3)',
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.parsed.y}${unit}`
                        }
                    },
                    datalabels: {
                        display: true,
                        color: textColor,
                        font: {
                            size: 10,
                            weight: '500'
                        },
                        formatter: (value) => `${value}${unit}`,
                        anchor: 'end',
                        align: 'top',
                        offset: 2
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: isLightTheme ? '#64748b' : '#94a3b8',
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: isLightTheme ? '#64748b' : '#94a3b8',
                            font: {
                                size: 10
                            },
                            callback: (value) => `${value}${unit}`
                        }
                    }
                },
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Show no data message
    showNoDataMessage(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.add('no-data');
        }
    }

    // Get metric label
    getMetricLabel(metricType) {
        const labels = {
            integration: this.t.charts.integration || 'Feature Integration Rate',
            stability: this.t.charts.stability || 'MTTF Duration',
            cr_blocker: this.t.charts.crBlocker || 'Blocker CR',
            cr_critical: this.t.charts.crCritical || 'Critical CR'
        };
        return labels[metricType] || metricType;
    }

    // Get metric unit
    getMetricUnit(metricType) {
        const units = {
            integration: '%',
            stability: 'ms',
            cr_blocker: '',
            cr_critical: ''
        };
        return units[metricType] || '';
    }
}

// Create singleton instance
export const chartManager = new ChartManager();