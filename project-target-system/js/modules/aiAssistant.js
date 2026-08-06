// AI Assistant Module - Handles AI analysis and document processing

import { dataManager } from './dataManager.js';

export class AIAssistant {
    constructor() {
        this.currentLanguage = localStorage.getItem('project_target_language') || 'zh';
        this.t = this.currentLanguage === 'en' ? window.enData : window.zhData;
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        this.t = lang === 'en' ? window.enData : window.zhData;
    }

    // Main analysis entry point
    async analyzeProject(projectId, userPrompt) {
        const project = dataManager.getProjectById(projectId);
        const healthData = dataManager.getHealthDataByProject(projectId);
        const devPlans = dataManager.getDevPlansByProject(projectId);
        
        if (!project) {
            return this.t.common.noData || 'No project data available';
        }

        const latestData = healthData.length > 0 
            ? healthData.reduce((latest, current) => 
                new Date(current.entryDate) > new Date(latest.entryDate) ? current : latest
            ) : null;

        const completedTasks = devPlans.filter(d => d.status === 'completed').length;
        const activeTasks = devPlans.filter(d => d.status === 'in-progress').length;
        const devPlanCount = devPlans.length;
        const totalDataEntries = healthData.length;
        const versionCount = dataManager.getVersionPlansByProject(projectId).length;
        const projectName = project.name;
        const targets = project.targets;

        return this.generateAnalysis(userPrompt, {
            project,
            latestData,
            completedTasks,
            activeTasks,
            devPlanCount,
            totalDataEntries,
            versionCount,
            projectName,
            targets
        });
    }

    // Advanced intent recognition with weighted keyword matching
    recognizeIntent(prompt) {
        const promptLower = prompt.toLowerCase();
        
        const intentPatterns = {
            summarize: {
                keywords: ['总结', '概况', '概要', '整体', '总体', '状态', 'summary', 'overview', 'status', '报告', '汇报'],
                weight: 1
            },
            issue: {
                keywords: ['问题', 'issue', '风险', 'risk', '隐患', 'trouble', '异常', '错误', '失败', '故障'],
                weight: 1
            },
            improve: {
                keywords: ['改进', '建议', 'suggest', 'improve', '优化', 'optimize', '提升', 'enhance', 'better', '方案', '措施'],
                weight: 1
            },
            completion: {
                keywords: ['完成率', 'completion', 'rate', '进度', 'progress', '任务', 'task', '完成', 'percent'],
                weight: 1
            },
            data: {
                keywords: ['数据', 'data', '质量', 'quality', '录入', 'entry', '记录', 'record', '统计', '指标'],
                weight: 1
            },
            risk: {
                keywords: ['风险', 'risk', '危险', 'danger', '评估', 'assessment', '安全', '威胁'],
                weight: 1
            },
            performance: {
                keywords: ['性能', 'performance', '表现', '效果', 'effect', '效率', '速度'],
                weight: 1
            },
            metrics: {
                keywords: ['指标', 'metrics', '集成率', '稳定性', 'MTTF', 'CR', 'blocker', 'critical', '数据指标'],
                weight: 1
            },
            trend: {
                keywords: ['趋势', 'trend', '变化', 'history', '历史', '对比', 'compare', '增长', '下降'],
                weight: 1
            },
            forecast: {
                keywords: ['预测', 'forecast', '预估', '预计', '未来', 'next', '下一步'],
                weight: 1
            },
            comparison: {
                keywords: ['对比', 'compare', '比较', 'vs', '差异', '区别'],
                weight: 1
            },
            why: {
                keywords: ['为什么', 'why', '原因', 'reason', '因为', '为何'],
                weight: 1.5
            },
            how: {
                keywords: ['怎么', 'how', '如何', '方法', '步骤', '做法'],
                weight: 1.5
            },
            what: {
                keywords: ['什么', 'what', '哪些', '哪一个', '哪类'],
                weight: 1.5
            },
            general: {
                keywords: ['分析', 'analyze', '帮助', 'help', '指导', 'guide', '建议', 'advice'],
                weight: 0.5
            }
        };

        const intentScores = {};
        Object.keys(intentPatterns).forEach(intent => {
            intentScores[intent] = intentPatterns[intent].keywords
                .filter(keyword => promptLower.includes(keyword))
                .length * intentPatterns[intent].weight;
        });

        const sortedIntents = Object.entries(intentScores)
            .filter(([, score]) => score > 0)
            .sort((a, b) => b[1] - a[1]);

        return {
            topIntent: sortedIntents.length > 0 ? sortedIntents[0][0] : 'general',
            secondaryIntents: sortedIntents.slice(1).map(([intent]) => intent),
            scores: intentScores
        };
    }

    // Generate analysis based on intent with enhanced UX
    generateAnalysis(prompt, context) {
        try {
            const { project, latestData, completedTasks, activeTasks, devPlanCount, 
                    totalDataEntries, versionCount, projectName, targets } = context;

            // Validate context
            if (!projectName) {
                const isZh = this.currentLanguage === 'zh';
                const t = this.getAnalysisTexts(isZh);
                return isZh ? `${t.errorNoProject}\n\n${t.footer}` : `${t.errorNoProject}\n\n${t.footer}`;
            }

            const intent = this.recognizeIntent(prompt);
            const isZh = this.currentLanguage === 'zh';
            const t = this.getAnalysisTexts(isZh);

            // Build intent flags with priority logic
            const intentFlags = this.buildIntentFlags(intent);

            let analysis = `${t.aiAnalysis}\n\n`;
            analysis += `**${t.analyzing}**: ${projectName}\n\n`;

            // Handle intent-based analysis with fallback logic
            analysis += this.dispatchAnalysis(intentFlags, {
                latestData,
                targets,
                activeTasks,
                completedTasks,
                devPlanCount,
                totalDataEntries,
                versionCount,
                projectName,
                t,
                isZh
            });

            // Add actionable insights when data is available
            if (latestData) {
                analysis += this.generateActionableInsights(latestData, targets, t, isZh);
            }

            analysis += `\n\n${t.footer}`;
            return analysis;

        } catch (error) {
            console.error('AI Analysis Error:', error);
            const isZh = this.currentLanguage === 'zh';
            const t = this.getAnalysisTexts(isZh);
            return isZh ? `${t.errorGeneric}\n\n${t.footer}` : `${t.errorGeneric}\n\n${t.footer}`;
        }
    }

    // Build intent flags with priority ordering
    buildIntentFlags(intent) {
        return {
            isWhy: intent.topIntent === 'why',
            isHow: intent.topIntent === 'how',
            isWhat: intent.topIntent === 'what',
            isMetrics: intent.topIntent === 'metrics' || intent.secondaryIntents.includes('metrics'),
            isTrend: intent.topIntent === 'trend' || intent.secondaryIntents.includes('trend'),
            isForecast: intent.topIntent === 'forecast' || intent.secondaryIntents.includes('forecast'),
            isComparison: intent.topIntent === 'comparison' || intent.secondaryIntents.includes('comparison'),
            isSummarize: intent.topIntent === 'summarize' || intent.secondaryIntents.includes('summarize'),
            isIssue: intent.topIntent === 'issue' || intent.secondaryIntents.includes('issue'),
            isImprove: intent.topIntent === 'improve' || intent.secondaryIntents.includes('improve'),
            isCompletion: intent.topIntent === 'completion' || intent.secondaryIntents.includes('completion'),
            isData: intent.topIntent === 'data' || intent.secondaryIntents.includes('data'),
            isRisk: intent.topIntent === 'risk' || intent.secondaryIntents.includes('risk'),
            isPerformance: intent.topIntent === 'performance' || intent.secondaryIntents.includes('performance'),
            isGeneral: intent.topIntent === 'general' && Object.keys(intent.scores).filter(k => intent.scores[k] > 0).length === 0,
            topIntent: intent.topIntent,
            secondaryIntents: intent.secondaryIntents
        };
    }

    // Dispatch analysis based on intent flags
    dispatchAnalysis(flags, params) {
        const { latestData, targets, activeTasks, completedTasks, devPlanCount, 
                totalDataEntries, versionCount, projectName, t, isZh } = params;

        if (flags.isWhy) {
            return this.generateWhyAnalysis(latestData, targets, t, isZh);
        } else if (flags.isHow) {
            return this.generateHowAnalysis(latestData, activeTasks, targets, t, isZh);
        } else if (flags.isWhat) {
            return this.generateWhatAnalysis(latestData, devPlanCount, completedTasks, activeTasks, projectName, t, isZh);
        } else if (flags.isMetrics) {
            return this.generateMetricsAnalysis(latestData, targets, t, isZh);
        } else if (flags.isTrend) {
            return this.generateTrendAnalysis(totalDataEntries, latestData, targets, t, isZh);
        } else if (flags.isForecast) {
            return this.generateForecastAnalysis(devPlanCount, completedTasks, activeTasks, t, isZh);
        } else if (flags.isComparison) {
            return this.generateComparisonAnalysis(latestData, targets, t, isZh);
        } else if (flags.isSummarize) {
            return this.generateSummaryAnalysis(completedTasks, devPlanCount, activeTasks, latestData, t, isZh);
        } else if (flags.isIssue) {
            return this.generateIssueAnalysis(activeTasks, completedTasks, latestData, targets, t, isZh);
        } else if (flags.isImprove) {
            return this.generateImprovementAnalysis(activeTasks, latestData, targets, t, isZh);
        } else if (flags.isCompletion) {
            return this.generateCompletionAnalysis(devPlanCount, completedTasks, activeTasks, t, isZh);
        } else if (flags.isData) {
            return this.generateDataQualityAnalysis(totalDataEntries, versionCount, t, isZh);
        } else if (flags.isRisk) {
            return this.generateRiskAnalysis(latestData, activeTasks, completedTasks, targets, t, isZh);
        } else if (flags.isPerformance) {
            return this.generatePerformanceAnalysis(latestData, targets, t, isZh);
        } else if (flags.isGeneral) {
            return this.generateGeneralAnalysis(devPlanCount, completedTasks, activeTasks, totalDataEntries, latestData, t, isZh);
        } else {
            return this.generateDefaultAnalysis(projectName, devPlanCount, completedTasks, activeTasks, latestData, t, isZh);
        }
    }

    // Generate actionable insights based on current data
    generateActionableInsights(latestData, targets, t, isZh) {
        if (!latestData) return '';
        
        let insights = `\n\n**${t.actionableInsights}**\n`;
        const actionableItems = [];

        if (targets) {
            const integrationDiff = parseFloat(targets.integration) - parseFloat(latestData.integration);
            if (integrationDiff > 5) {
                actionableItems.push(isZh ? 
                    `• ${t.integrationGap} ${integrationDiff.toFixed(1)}%` :
                    `• ${t.integrationGap} ${integrationDiff.toFixed(1)}%`);
            }

            const stabilityDiff = parseFloat(targets.stability) - parseFloat(latestData.stability);
            if (stabilityDiff > 100) {
                actionableItems.push(isZh ? 
                    `• ${t.stabilityGap} ${stabilityDiff.toFixed(0)}ms` :
                    `• ${t.stabilityGap} ${stabilityDiff.toFixed(0)}ms`);
            }
        }

        if (parseFloat(latestData.cr_blocker) > 0) {
            actionableItems.push(isZh ? 
                `• ${t.blockerAction}` :
                `• ${t.blockerAction}`);
        }

        if (parseFloat(latestData.cr_critical) > 2) {
            actionableItems.push(isZh ? 
                `• ${t.criticalAction}` :
                `• ${t.criticalAction}`);
        }

        if (actionableItems.length === 0) {
            insights += isZh ? `• ${t.allMetricsGood}\n` : `• ${t.allMetricsGood}\n`;
        } else {
            actionableItems.forEach(item => {
                insights += `${item}\n`;
            });
        }

        return insights;
    }

    // Generate WHY analysis
    generateWhyAnalysis(latestData, targets, t, isZh) {
        let analysis = `${t.whyAnalysis}\n\n`;
        
        if (!latestData) {
            return analysis + t.whyNoData;
        }

        const whyAnalysisItems = [];
        if (targets && parseFloat(latestData.integration) < parseFloat(targets.integration)) {
            whyAnalysisItems.push(t.whyIntegrationLow);
        }
        if (targets && parseFloat(latestData.stability) < parseFloat(targets.stability)) {
            whyAnalysisItems.push(t.whyStabilityLow);
        }
        if (parseFloat(latestData.cr_blocker) > 0) {
            whyAnalysisItems.push(t.whyBlockerExists);
        }

        if (whyAnalysisItems.length === 0) {
            return analysis + t.whyAllGood;
        }

        whyAnalysisItems.forEach((item, index) => {
            analysis += `${index + 1}. ${item}\n`;
        });

        return analysis;
    }

    // Generate HOW analysis
    generateHowAnalysis(latestData, activeTasks, targets, t, isZh) {
        let analysis = `${t.howAnalysis}\n\n`;
        
        if (!latestData) {
            return analysis + t.howNoData;
        }

        const howAnalysisItems = [];
        if (targets && parseFloat(latestData.integration) < parseFloat(targets.integration)) {
            howAnalysisItems.push(t.howImproveIntegration);
        }
        if (targets && parseFloat(latestData.stability) < parseFloat(targets.stability)) {
            howAnalysisItems.push(t.howImproveStability);
        }
        if (parseFloat(latestData.cr_blocker) > 0) {
            howAnalysisItems.push(t.howResolveBlocker);
        }
        if (activeTasks > 3) {
            howAnalysisItems.push(t.howManageTasks);
        }
        howAnalysisItems.push(t.howRegularUpdate);

        howAnalysisItems.forEach((item, index) => {
            analysis += `${index + 1}. ${item}\n`;
        });

        return analysis;
    }

    // Generate WHAT analysis
    generateWhatAnalysis(latestData, devPlanCount, completedTasks, activeTasks, projectName, t, isZh) {
        let analysis = `${t.whatAnalysis}\n\n`;
        
        analysis += `**${t.projectName}**: ${projectName}\n\n`;
        
        if (latestData) {
            analysis += `**${t.whatLatestMetrics}**:\n`;
            analysis += `- ${t.integrationRate}: ${latestData.integration}%\n`;
            analysis += `- ${t.mtbfDuration}: ${latestData.stability} ms\n`;
            analysis += `- ${t.blockerCR}: ${latestData.cr_blocker}\n`;
            analysis += `- ${t.criticalCR}: ${latestData.cr_critical}\n\n`;
        }
        
        analysis += `**${t.whatTasks}**:\n`;
        analysis += `- ${t.totalTasks}: ${devPlanCount}\n`;
        analysis += `- ${t.completedTasks}: ${completedTasks}\n`;
        analysis += `- ${t.activeTasks}: ${activeTasks}\n\n`;
        
        analysis += `**${t.whatCompletionRate}**: ${devPlanCount > 0 ? Math.round((completedTasks / devPlanCount) * 100) : 0}%\n`;

        return analysis;
    }

    // Generate Metrics analysis
    generateMetricsAnalysis(latestData, targets, t, isZh) {
        let analysis = `${t.metricsAnalysis}\n\n`;
        
        if (!latestData || !targets) {
            return analysis + t.noData;
        }

        const metrics = [
            { key: 'integration', label: t.integrationRate, target: targets.integration, actual: latestData.integration, unit: '%', higherBetter: true },
            { key: 'stability', label: t.mtbfDuration, target: targets.stability, actual: latestData.stability, unit: ' ms', higherBetter: true },
            { key: 'cr_blocker', label: t.blockerCR, target: targets.cr_blocker, actual: latestData.cr_blocker, unit: '', higherBetter: false },
            { key: 'cr_critical', label: t.criticalCR, target: targets.cr_critical, actual: latestData.cr_critical, unit: '', higherBetter: false }
        ];

        analysis += `| ${t.metric} | ${t.target} | ${t.actual} | ${t.status} |\n`;
        analysis += `|-----------|--------|--------|--------|\n`;

        metrics.forEach(metric => {
            const target = parseFloat(metric.target);
            const actual = parseFloat(metric.actual);
            const achieved = metric.higherBetter ? actual >= target : actual <= target;
            analysis += `| ${metric.label} | ${target}${metric.unit} | ${actual}${metric.unit} | ${achieved ? t.pass : t.fail} |\n`;
        });

        return analysis;
    }

    // Generate Trend analysis
    generateTrendAnalysis(totalDataEntries, latestData, targets, t, isZh) {
        let analysis = `${t.trendAnalysis}\n\n`;
        
        if (totalDataEntries < 2) {
            return analysis + t.trendInsufficientData;
        }

        analysis += t.trendBasedOnHistory;
        analysis += `\n\n${t.trendDataPoints}: ${totalDataEntries}\n`;

        if (latestData && targets) {
            const trends = [];
            if (parseFloat(latestData.integration) >= parseFloat(targets.integration) * 0.9) {
                trends.push(t.trendIntegrationGood);
            } else {
                trends.push(t.trendIntegrationNeedsWork);
            }
            if (parseFloat(latestData.stability) >= parseFloat(targets.stability) * 0.9) {
                trends.push(t.trendStabilityGood);
            } else {
                trends.push(t.trendStabilityNeedsWork);
            }

            trends.forEach((trend, index) => {
                analysis += `${index + 1}. ${trend}\n`;
            });
        }

        return analysis;
    }

    // Generate Forecast analysis
    generateForecastAnalysis(devPlanCount, completedTasks, activeTasks, t, isZh) {
        let analysis = `${t.forecastAnalysis}\n\n`;
        
        const completionRate = devPlanCount > 0 ? Math.round((completedTasks / devPlanCount) * 100) : 0;
        
        if (completionRate >= 80) {
            analysis += t.forecastOnTrack;
        } else if (completionRate >= 50) {
            analysis += t.forecastNeedsEffort;
        } else {
            analysis += t.forecastAtRisk;
        }
        
        analysis += `\n\n${t.forecastRecommendations}:\n`;
        analysis += `1. ${t.forecastMonitorProgress}\n`;
        if (activeTasks > 3) {
            analysis += `2. ${t.forecastPrioritizeTasks}\n`;
        }
        analysis += `3. ${t.forecastAdjustPlan}\n`;

        return analysis;
    }

    // Generate Comparison analysis
    generateComparisonAnalysis(latestData, targets, t, isZh) {
        let analysis = `${t.comparisonAnalysis}\n\n`;
        
        if (!latestData || !targets) {
            return analysis + t.comparisonNoData;
        }

        analysis += `**${t.comparisonTargetVsActual}**\n\n`;
        analysis += `| ${t.metric} | ${t.target} | ${t.actual} | ${t.gap} |\n`;
        analysis += `|-----------|--------|--------|------|\n`;

        const metrics = [
            { label: t.integrationRate, target: targets.integration, actual: latestData.integration, unit: '%', higherBetter: true },
            { label: t.mtbfDuration, target: targets.stability, actual: latestData.stability, unit: ' ms', higherBetter: true },
            { label: t.blockerCR, target: targets.cr_blocker, actual: latestData.cr_blocker, unit: '', higherBetter: false },
            { label: t.criticalCR, target: targets.cr_critical, actual: latestData.cr_critical, unit: '', higherBetter: false }
        ];

        metrics.forEach(metric => {
            const target = parseFloat(metric.target);
            const actual = parseFloat(metric.actual);
            let gap = metric.higherBetter 
                ? (actual >= target ? t.meetsTarget : `${(target - actual).toFixed(1)}${metric.unit}`)
                : (actual <= target ? t.meetsTarget : `${(actual - target).toFixed(1)}${metric.unit}`);
            analysis += `| ${metric.label} | ${target}${metric.unit} | ${actual}${metric.unit} | ${gap} |\n`;
        });

        return analysis;
    }

    // Generate Summary analysis
    generateSummaryAnalysis(completedTasks, devPlanCount, activeTasks, latestData, t, isZh) {
        let analysis = `${t.summary}\n\n`;
        analysis += `**${t.overallHealth}**: ${devPlanCount > 0 && completedTasks / devPlanCount > 0.5 ? t.good : t.needsAttention}\n\n`;
        analysis += `**${t.strengths}**:\n`;
        if (completedTasks > 0) analysis += `- ${completedTasks} ${t.completedSuccessfully}\n`;
        if (latestData && parseFloat(latestData.stability) > 0) analysis += `- ${t.stabilityTracked}\n`;
        
        analysis += `\n**${t.improvement}**:\n`;
        if (activeTasks > completedTasks) analysis += `- ${t.moreInProgress}\n`;
        if (latestData && parseFloat(latestData.cr_blocker) > 0) analysis += `- ${latestData.cr_blocker} ${t.blockerAttention}\n`;

        return analysis;
    }

    // Generate Issue analysis
    generateIssueAnalysis(activeTasks, completedTasks, latestData, targets, t, isZh) {
        let analysis = `${t.issues}\n\n`;
        
        const issues = [];
        if (activeTasks > completedTasks * 2) {
            issues.push(t.tooManyTasks);
        }
        if (latestData && parseFloat(latestData.cr_blocker) > 0) {
            issues.push(`${latestData.cr_blocker} ${t.blockerDetected}`);
        }
        if (latestData && parseFloat(latestData.cr_critical) > targets?.cr_critical) {
            issues.push(t.criticalExceeds);
        }
        if (!latestData) {
            issues.push(t.noData);
        }
        
        if (issues.length === 0) {
            analysis += t.noIssues;
        } else {
            issues.forEach((issue, index) => {
                analysis += `${index + 1}. ${issue}\n`;
            });
        }

        return analysis;
    }

    // Generate Improvement analysis
    generateImprovementAnalysis(activeTasks, latestData, targets, t, isZh) {
        let analysis = `${t.recommendations}\n\n`;
        
        const suggestions = [];
        if (activeTasks > 3) {
            suggestions.push(t.limitWIP);
        }
        if (latestData && parseFloat(latestData.cr_blocker) > 0) {
            suggestions.push(t.resolveBlocker);
        }
        if (targets && latestData) {
            if (parseFloat(latestData.integration) < parseFloat(targets.integration)) {
                suggestions.push(t.increaseIntegration);
            }
            if (parseFloat(latestData.stability) < parseFloat(targets.stability)) {
                suggestions.push(t.improveStability);
            }
        }
        suggestions.push(t.regularEntry);
        
        suggestions.forEach((suggestion, index) => {
            analysis += `${index + 1}. ${suggestion}\n`;
        });

        return analysis;
    }

    // Generate Completion analysis
    generateCompletionAnalysis(devPlanCount, completedTasks, activeTasks, t, isZh) {
        let analysis = `${t.completionAnalysis}\n\n`;
        const completionRate = devPlanCount > 0 ? Math.round((completedTasks / devPlanCount) * 100) : 0;
        
        analysis += `- **${t.taskCompletionRate}**: ${completionRate}%\n`;
        analysis += `- **${t.activeTasks}**: ${activeTasks}\n`;
        analysis += `- **${t.completedTasks}**: ${completedTasks}\n\n`;
        
        if (completionRate >= 80) {
            analysis += t.excellent;
        } else if (completionRate >= 50) {
            analysis += t.goodProgress;
        } else {
            analysis += t.considerPrioritize;
        }

        return analysis;
    }

    // Generate Data Quality analysis
    generateDataQualityAnalysis(totalDataEntries, versionCount, t, isZh) {
        let analysis = `${t.dataQuality}\n\n`;
        
        if (totalDataEntries >= 5) {
            analysis += `✅ ${t.sufficientData}\n`;
        } else {
            analysis += `⚠️ ${t.insufficientData}\n`;
        }
        
        if (versionCount >= 2) {
            analysis += `✅ ${t.versionTracking}\n`;
        } else {
            analysis += `⚠️ ${t.noVersionTracking}\n`;
        }

        return analysis;
    }

    // Generate Risk analysis
    generateRiskAnalysis(latestData, activeTasks, completedTasks, targets, t, isZh) {
        let analysis = `${t.riskAnalysis}\n\n`;
        
        let riskLevel = 'low';
        const riskFactors = [];
        
        if (latestData && parseFloat(latestData.cr_blocker) > 0) {
            riskLevel = 'high';
            riskFactors.push(`${latestData.cr_blocker} ${t.blockerAttention}`);
        }
        if (activeTasks > completedTasks * 2) {
            riskLevel = riskLevel === 'high' ? 'high' : 'medium';
            riskFactors.push(t.tooManyTasks);
        }
        if (latestData && parseFloat(latestData.cr_critical) > targets?.cr_critical) {
            riskLevel = riskLevel === 'high' ? 'high' : 'medium';
            riskFactors.push(t.criticalExceeds);
        }
        
        if (riskLevel === 'low') {
            analysis += t.lowRisk;
        } else if (riskLevel === 'medium') {
            analysis += t.mediumRisk;
            riskFactors.forEach((factor, index) => {
                analysis += `${index + 1}. ${factor}\n`;
            });
        } else {
            analysis += t.highRisk;
            riskFactors.forEach((factor, index) => {
                analysis += `${index + 1}. ${factor}\n`;
            });
        }

        return analysis;
    }

    // Generate Performance analysis
    generatePerformanceAnalysis(latestData, targets, t, isZh) {
        let analysis = `${t.performanceAnalysis}\n\n`;
        
        let performanceIssues = [];
        let performanceGood = true;
        
        if (targets && latestData) {
            if (parseFloat(latestData.integration) < parseFloat(targets.integration)) {
                performanceIssues.push(t.increaseIntegration);
                performanceGood = false;
            }
            if (parseFloat(latestData.stability) < parseFloat(targets.stability)) {
                performanceIssues.push(t.improveStability);
                performanceGood = false;
            }
        }
        
        if (performanceGood) {
            analysis += t.performanceGood;
        } else {
            analysis += t.performanceNeedsImprovement;
            performanceIssues.forEach((issue, index) => {
                analysis += `${index + 1}. ${issue}\n`;
            });
        }

        return analysis;
    }

    // Generate General analysis
    generateGeneralAnalysis(devPlanCount, completedTasks, activeTasks, totalDataEntries, latestData, t, isZh) {
        let analysis = `${t.generalAnalysis}\n\n`;
        const completionRate = devPlanCount > 0 ? Math.round((completedTasks / devPlanCount) * 100) : 0;
        
        analysis += `**${t.projectStatus}**: `;
        if (completionRate >= 80) {
            analysis += t.good;
        } else if (completionRate >= 50) {
            analysis += t.needsAttention;
        } else {
            analysis += '需要改进';
        }
        analysis += '\n\n';
        
        analysis += `**${t.nextSteps}**:\n`;
        if (activeTasks > 3) {
            analysis += `- ${t.focusOnHighPriority}\n`;
        }
        if (totalDataEntries < 5) {
            analysis += `- ${t.improveDataQuality}\n`;
        }
        analysis += `- ${t.monitorMetrics}\n`;
        if (latestData && parseFloat(latestData.cr_blocker) > 0) {
            analysis += `- ${t.addressBlocker}\n`;
        }

        return analysis;
    }

    // Generate Default analysis
    generateDefaultAnalysis(projectName, devPlanCount, completedTasks, activeTasks, latestData, t, isZh) {
        let analysis = `${t.basedOnRequest}\n\n`;
        analysis += `${projectName} ${t.currentlyHas} ${devPlanCount} ${t.totalTasks}, ${completedTasks} ${t.withCompleted}, ${activeTasks} ${t.inProgress}.\n\n`;
        
        if (latestData) {
            analysis += `${t.latestMetrics}:\n`;
            analysis += `- ${t.integrationRate}: ${latestData.integration}%\n`;
            analysis += `- ${t.mtbfDuration}: ${latestData.stability} ms\n`;
            analysis += `- ${t.blockerCR}: ${latestData.cr_blocker}\n`;
            analysis += `- ${t.criticalCR}: ${latestData.cr_critical}\n\n`;
        }
        
        analysis += `${t.keyRecommendations}:\n`;
        analysis += `1. ${t.trackRegularly}\n`;
        if (activeTasks > completedTasks) {
            analysis += `2. ${t.reviewDistribution}\n`;
        }
        if (latestData && parseFloat(latestData.cr_blocker) > 0) {
            analysis += `3. ${t.addressBlocker}\n`;
        }

        return analysis;
    }

    // Get analysis texts
    getAnalysisTexts(isZh) {
        return {
            aiAnalysis: isZh ? '## 🤖 AI分析报告' : '## 🤖 AI Analysis Report',
            
            // Summary
            summary: isZh ? '### 📊 项目概况' : '### 📊 Project Summary',
            overallHealth: isZh ? '整体健康状况' : 'Overall Health',
            good: isZh ? '良好' : 'Good',
            needsAttention: isZh ? '需要关注' : 'Needs Attention',
            strengths: isZh ? '优势' : 'Strengths',
            completedSuccessfully: isZh ? '项任务已成功完成' : 'tasks completed successfully',
            stabilityTracked: isZh ? '系统稳定性已被有效跟踪' : 'System stability is being tracked effectively',
            improvement: isZh ? '待改进项' : 'Areas for Improvement',
            moreInProgress: isZh ? '进行中的任务多于已完成的任务' : 'More tasks in progress than completed',
            blockerAttention: isZh ? '个Blocker级问题需要关注' : 'blocker issues need attention',
            
            // Issues
            issues: isZh ? '### 🔍 问题识别' : '### 🔍 Issue Identification',
            tooManyTasks: isZh ? '任务过多，可能导致资源分散' : 'Too many tasks may cause resource dispersion',
            blockerDetected: isZh ? '个Blocker级问题被检测到' : 'blocker issues detected',
            criticalExceeds: isZh ? 'Critical级别问题数量超过目标' : 'Critical issues exceed target',
            noIssues: isZh ? '🎉 未发现明显问题，项目运行良好！' : '🎉 No significant issues found, project is running well!',
            
            // Recommendations
            recommendations: isZh ? '### 💡 改进建议' : '### 💡 Improvement Recommendations',
            limitWIP: isZh ? '限制在制品数量，建议不超过3个并行任务' : 'Limit WIP (Work in Progress) to no more than 3 concurrent tasks',
            resolveBlocker: isZh ? '优先解决Blocker级问题，清除阻塞项' : 'Prioritize resolving Blocker issues to clear blockers',
            increaseIntegration: isZh ? '提高功能集成率，加快集成测试进度' : 'Increase feature integration rate, accelerate integration testing',
            improveStability: isZh ? '优化系统稳定性，提升MTTF指标' : 'Improve system stability, enhance MTTF metrics',
            regularEntry: isZh ? '定期更新项目数据，保持数据质量' : 'Regularly update project data to maintain data quality',
            
            // Completion
            completionAnalysis: isZh ? '### 📈 完成率分析' : '### 📈 Completion Rate Analysis',
            taskCompletionRate: isZh ? '任务完成率' : 'Task Completion Rate',
            activeTasks: isZh ? '进行中任务' : 'Active Tasks',
            completedTasks: isZh ? '已完成任务' : 'Completed Tasks',
            excellent: isZh ? '🎉 优秀！任务完成率达到80%以上' : '🎉 Excellent! Task completion rate exceeds 80%',
            goodProgress: isZh ? '👍 良好！任务完成率在50%-80%之间' : '👍 Good progress! Task completion rate is between 50%-80%',
            considerPrioritize: isZh ? '⚠️ 需要关注！建议重新评估任务优先级' : '⚠️ Needs attention! Consider re-evaluating task priorities',
            
            // Data Quality
            dataQuality: isZh ? '### 📝 数据质量评估' : '### 📝 Data Quality Assessment',
            sufficientData: isZh ? '数据充足，可以进行有效的分析' : 'Sufficient data for effective analysis',
            insufficientData: isZh ? '数据不足，建议增加数据录入' : 'Insufficient data, recommend adding more data entries',
            versionTracking: isZh ? '版本跟踪良好' : 'Good version tracking',
            noVersionTracking: isZh ? '版本跟踪不足，建议建立版本管理' : 'Insufficient version tracking, recommend establishing version management',
            
            // Risk Analysis
            riskAnalysis: isZh ? '### 🚨 风险分析' : '### 🚨 Risk Analysis',
            lowRisk: isZh ? '✅ 低风险：项目运行平稳，无重大风险' : '✅ Low Risk: Project running smoothly, no major risks',
            mediumRisk: isZh ? '⚠️ 中等风险：存在一些需要关注的问题：' : '⚠️ Medium Risk: Some issues need attention:',
            highRisk: isZh ? '🔴 高风险：存在严重问题需要立即处理：' : '🔴 High Risk: Critical issues require immediate attention:',
            
            // Performance Analysis
            performanceAnalysis: isZh ? '### ⚡ 性能分析' : '### ⚡ Performance Analysis',
            performanceGood: isZh ? '✅ 性能良好，各项指标达到预期' : '✅ Good performance, all metrics meet expectations',
            performanceNeedsImprovement: isZh ? '⚠️ 性能需要改进：' : '⚠️ Performance needs improvement:',
            
            // General
            generalAnalysis: isZh ? '### 📋 综合分析' : '### 📋 Comprehensive Analysis',
            projectStatus: isZh ? '项目状态' : 'Project Status',
            nextSteps: isZh ? '下一步行动' : 'Next Steps',
            focusOnHighPriority: isZh ? '专注于高优先级任务' : 'Focus on high-priority tasks',
            monitorMetrics: isZh ? '持续监控关键指标' : 'Continuously monitor key metrics',
            improveDataQuality: isZh ? '提高数据录入质量' : 'Improve data entry quality',
            
            // Default
            basedOnRequest: isZh ? '### 根据您的请求' : '### Based on your request',
            currentlyHas: isZh ? '目前有' : 'currently has',
            totalTasks: isZh ? '个任务' : 'tasks',
            withCompleted: isZh ? '个已完成' : 'completed',
            inProgress: isZh ? '个进行中' : 'in progress',
            latestMetrics: isZh ? '最新指标' : 'Latest Metrics',
            keyRecommendations: isZh ? '关键建议' : 'Key Recommendations',
            trackRegularly: isZh ? '定期跟踪项目进展' : 'Track project progress regularly',
            reviewDistribution: isZh ? '审查任务分配情况' : 'Review task distribution',
            addressBlocker: isZh ? '处理Blocker级问题' : 'Address blocker issues',
            footer: isZh ? '*此分析由AI根据项目数据生成，仅供参考*' : '*This analysis is generated by AI based on project data, for reference only*',
            
            // New intent-specific translations
            whyAnalysis: isZh ? '### 🤔 原因分析' : '### 🤔 Root Cause Analysis',
            whyNoData: isZh ? '暂无项目数据，无法进行原因分析。请先添加项目数据。' : 'No project data available for root cause analysis. Please add project data first.',
            whyIntegrationLow: isZh ? '功能集成率未达目标可能是因为：功能开发进度滞后、集成测试未完成、依赖模块尚未就绪。' : 'Feature integration rate below target may be caused by: delayed feature development, incomplete integration testing, or pending dependency modules.',
            whyStabilityLow: isZh ? 'MTTF稳定性未达目标可能是因为：存在内存泄漏、并发处理问题、硬件兼容性问题或代码质量问题。' : 'MTTF stability below target may be caused by: memory leaks, concurrency issues, hardware compatibility problems, or code quality issues.',
            whyBlockerExists: isZh ? 'Blocker CR存在可能是因为：关键功能存在严重缺陷、影响核心流程、需要立即修复才能继续开发。' : 'Blocker CRs exist because: critical functionality has severe defects, core workflows are impacted, immediate fixes are required to continue development.',
            whyAllGood: isZh ? '🎉 各项指标均已达到或超过目标，项目运行良好！' : '🎉 All metrics meet or exceed targets. Project is running well!',
            
            howAnalysis: isZh ? '### 🔧 操作建议' : '### 🔧 Action Recommendations',
            howNoData: isZh ? '暂无项目数据，无法提供操作建议。请先添加项目数据。' : 'No project data available for action recommendations. Please add project data first.',
            howImproveIntegration: isZh ? '**提高功能集成率**：优先完成剩余功能开发，加强集成测试，及时解决依赖问题。' : '**Improve Feature Integration**: Prioritize completing remaining feature development, enhance integration testing, and resolve dependency issues promptly.',
            howImproveStability: isZh ? '**提高稳定性**：进行性能测试和压力测试，分析内存使用情况，修复内存泄漏问题。' : '**Improve Stability**: Conduct performance and stress testing, analyze memory usage, and fix memory leaks.',
            howResolveBlocker: isZh ? '**解决Blocker CR**：立即组织团队分析问题，分配专人处理，设定修复时限。' : '**Resolve Blocker CRs**: Immediately organize the team to analyze issues, assign dedicated resources, and set fix deadlines.',
            howManageTasks: isZh ? '**任务管理**：审查任务优先级，限制并行任务数量，确保资源合理分配。' : '**Task Management**: Review task priorities, limit concurrent tasks, and ensure proper resource allocation.',
            howRegularUpdate: isZh ? '**定期更新**：每周更新项目数据，跟踪指标变化，及时发现问题。' : '**Regular Updates**: Update project data weekly, track metric changes, and detect issues promptly.',
            
            whatAnalysis: isZh ? '### 📋 信息查询' : '### 📋 Information Query',
            whatLatestMetrics: isZh ? '最新指标' : 'Latest Metrics',
            whatTasks: isZh ? '任务概览' : 'Task Overview',
            whatCompletionRate: isZh ? '任务完成率' : 'Task Completion Rate',
            projectName: isZh ? '项目名称' : 'Project Name',
            
            metric: isZh ? '指标' : 'Metric',
            status: isZh ? '状态' : 'Status',
            pass: isZh ? '✅ 通过' : '✅ Pass',
            fail: isZh ? '❌ 失败' : '❌ Fail',
            
            trendAnalysis: isZh ? '### 📈 趋势分析' : '### 📈 Trend Analysis',
            trendInsufficientData: isZh ? '数据点不足，无法进行趋势分析。建议至少添加2个数据条目。' : 'Insufficient data points for trend analysis. At least 2 data entries are recommended.',
            trendBasedOnHistory: isZh ? '根据历史数据趋势分析：' : 'Based on historical data trend analysis:',
            trendDataPoints: isZh ? '数据点数量' : 'Number of Data Points',
            trendIntegrationGood: isZh ? '功能集成率趋势良好，接近目标值' : 'Feature integration rate trend is good, approaching target',
            trendIntegrationNeedsWork: isZh ? '功能集成率需要提升，建议加快开发进度' : 'Feature integration rate needs improvement, consider accelerating development',
            trendStabilityGood: isZh ? '稳定性趋势良好，指标正常' : 'Stability trend is good, metrics are normal',
            trendStabilityNeedsWork: isZh ? '稳定性需要改进，建议进行性能优化' : 'Stability needs improvement, consider performance optimization',
            
            forecastAnalysis: isZh ? '### 🔮 预测分析' : '### 🔮 Forecast Analysis',
            forecastOnTrack: isZh ? '✅ 项目进展顺利，预计能按时完成目标。' : '✅ Project is on track, expected to meet targets on time.',
            forecastNeedsEffort: isZh ? '⚠️ 项目需要增加投入才能按时完成。建议优化资源分配。' : '⚠️ Additional effort is needed to complete on time. Consider optimizing resource allocation.',
            forecastAtRisk: isZh ? '🔴 项目进度落后，存在延期风险。建议立即审查并调整计划。' : '🔴 Project is behind schedule, at risk of delay. Immediate review and plan adjustment recommended.',
            forecastRecommendations: isZh ? '预测建议' : 'Forecast Recommendations',
            forecastMonitorProgress: isZh ? '密切监控项目进度，及时发现偏差' : 'Monitor project progress closely, detect deviations promptly',
            forecastPrioritizeTasks: isZh ? '优先处理高优先级任务，确保关键路径畅通' : 'Prioritize high-priority tasks, ensure critical path is clear',
            forecastAdjustPlan: isZh ? '根据实际情况调整计划，必要时寻求额外资源' : 'Adjust plan based on actual situation, seek additional resources if needed',
            
            comparisonAnalysis: isZh ? '### ⚖️ 对比分析' : '### ⚖️ Comparison Analysis',
            comparisonNoData: isZh ? '暂无足够数据进行对比分析。' : 'Insufficient data for comparison analysis.',
            comparisonTargetVsActual: isZh ? '目标值与实际值对比' : 'Target vs Actual Comparison',
            gap: isZh ? '差距' : 'Gap',
            meetsTarget: isZh ? '✅ 达标' : '✅ Met',
            
            integrationRate: isZh ? '功能集成率' : 'Feature Integration Rate',
            mtbfDuration: isZh ? 'MTTF持续时间' : 'MTTF Duration',
            blockerCR: isZh ? 'Blocker CR' : 'Blocker CR',
            criticalCR: isZh ? 'Critical CR' : 'Critical CR',
            actual: isZh ? '实际值' : 'Actual',
            target: isZh ? '目标值' : 'Target',
            
            // Error handling
            errorNoProject: isZh ? '❌ 请先选择一个项目' : '❌ Please select a project first',
            errorGeneric: isZh ? '⚠️ 分析过程中出现错误，请重试' : '⚠️ An error occurred during analysis, please try again',
            
            // Actionable insights
            actionableInsights: isZh ? '🎯 可操作建议' : '🎯 Actionable Insights',
            integrationGap: isZh ? '功能集成率差距' : 'Integration rate gap',
            stabilityGap: isZh ? '稳定性差距' : 'Stability gap',
            blockerAction: isZh ? '立即处理Blocker级问题' : 'Address Blocker issues immediately',
            criticalAction: isZh ? '关注Critical级问题，制定修复计划' : 'Address Critical issues with a fix plan',
            allMetricsGood: isZh ? '各项指标均达标，继续保持！' : 'All metrics meet targets, keep up the good work!',
            
            // Additional analysis texts
            analyzing: isZh ? '正在分析项目' : 'Analyzing Project'
        };
    }

    // Document analysis
    async analyzeDocument(docUrl) {
        const docId = this.extractDocId(docUrl);
        const documentContent = await this.simulateDocumentExtraction(docUrl, docId);
        return await this.generateDocumentAnalysis(documentContent);
    }

    extractDocId(url) {
        // Simple extraction - in real implementation use URL parsing
        const match = url.match(/doc\/([a-zA-Z0-9]+)/);
        return match ? match[1] : Date.now().toString();
    }

    async simulateDocumentExtraction(url, docId) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            docId: docId,
            url: url,
            title: 'IOT设备测试报告 v2.1',
            content: 'This is a simulated test report document.',
            documentType: 'test_report',
            sections: [
                { type: 'heading', level: 1, content: '测试概述' },
                { type: 'paragraph', content: '本次测试针对IOT传感器设备的各项功能进行了全面验证。' },
                { type: 'heading', level: 2, content: '测试环境' },
                { type: 'list', items: ['设备型号: IOT-Sensor-2024', '固件版本: v2.1.3'] },
                { type: 'heading', level: 2, content: '测试结果汇总' },
                { type: 'paragraph', content: '共执行测试用例 156 个，通过 142 个，失败 14 个，整体通过率 91.0%。' },
                { type: 'heading', level: 2, content: '电池续航测试' },
                { type: 'list', items: ['20Hz 典型场景: 8.2 天 (目标: 8 天)', '20Hz 重度场景: 7.1 天 (目标: 7 天)'] },
                { type: 'heading', level: 2, content: '性能测试' },
                { type: 'list', items: ['GPS冷启动时间: 8.5秒 (目标: 8秒)', '触摸响应时间: 45ms (目标: 50ms)'] },
                { type: 'heading', level: 2, content: '稳定性测试' },
                { type: 'list', items: ['MTTF: 9.2小时 (目标: 9小时)', '功能集成率: 85% (目标: 80%)'] },
                { type: 'heading', level: 2, content: '缺陷统计' },
                { type: 'list', items: ['Blocker CR: 0个', 'Critical CR: 1个', 'Major CR: 5个', 'Minor CR: 8个'] },
                { type: 'heading', level: 2, content: '测试结论' },
                { type: 'paragraph', content: '本次测试整体表现良好，各项关键指标均达到或超过预期目标。' }
            ],
            testData: {
                totalTestCases: 156,
                passedTestCases: 142,
                failedTestCases: 14,
                passRate: 91.0,
                batteryTests: {
                    '20hz_typical': { actual: 8.2, target: 8, status: 'pass' },
                    '20hz_heavy': { actual: 7.1, target: 7, status: 'pass' },
                    '20hz_aod': { actual: 9.3, target: 9, status: 'pass' },
                    '100hz_typical': { actual: 7.5, target: 7, status: 'pass' },
                    '100hz_heavy': { actual: 6.8, target: 6, status: 'pass' },
                    '100hz_aod': { actual: 8.7, target: 8, status: 'pass' }
                },
                performanceTests: {
                    'gps_cold': { actual: 8.5, target: 8, status: 'fail' },
                    'gps_hot': { actual: 2.3, target: 2, status: 'pass' },
                    'touch_response': { actual: 45, target: 50, status: 'pass' },
                    'key_response': { actual: 38, target: 40, status: 'pass' },
                    'slide_fps': { actual: 58, target: 60, status: 'fail' },
                    'slide_drop': { actual: 1.2, target: 2, status: 'pass' }
                },
                stabilityTests: {
                    'mttf': { actual: 9.2, target: 9, status: 'pass' },
                    'integration': { actual: 85, target: 80, status: 'pass' },
                    'algorithm': { actual: 92, target: 90, status: 'pass' }
                },
                defects: { blocker: 0, critical: 1, major: 5, minor: 8 }
            },
            metadata: { wordCount: 850, paragraphCount: 12, headingCount: 8, lastModified: new Date().toISOString() }
        };
    }

    async generateDocumentAnalysis(documentContent) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const isTestReport = documentContent.documentType === 'test_report';
        const isZh = this.currentLanguage === 'zh';
        
        const t = {
            title: isZh ? '## 文档分析报告' : '## Document Analysis Report',
            docInfo: isZh ? '### 📄 文档信息' : '### 📄 Document Information',
            docId: isZh ? '文档ID' : 'Document ID',
            url: isZh ? '链接' : 'URL',
            wordCount: isZh ? '字数' : 'Word Count',
            paragraphCount: isZh ? '段落数' : 'Paragraph Count',
            headingCount: isZh ? '标题数' : 'Heading Count',
            lastModified: isZh ? '最后修改' : 'Last Modified',
            
            contentAnalysis: isZh ? '### 📊 内容分析' : '### 📊 Content Analysis',
            docType: isZh ? '文档类型' : 'Document Type',
            docTypeValue: isTestReport ? (isZh ? '测试报告' : 'Test Report') : (isZh ? '技术文档' : 'Technical Document'),
            targetAudience: isZh ? '目标受众' : 'Target Audience',
            targetAudienceValue: isTestReport ? (isZh ? '测试工程师、开发人员、项目经理' : 'Test engineers, Developers, Project managers') : (isZh ? '技术开发人员、项目经理' : 'Technical developers, Project managers'),
            complexity: isZh ? '复杂度' : 'Complexity',
            complexityLevel: isTestReport ? (isZh ? '高' : 'High') : (isZh ? '中等' : 'Medium'),
            readability: isZh ? '可读性' : 'Readability',
            readabilityScore: isZh ? '良好 (8.0/10)' : 'Good (8.0/10)',
            
            structureAnalysis: isZh ? '### 🏗️ 结构分析' : '### 🏗️ Structure Analysis',
            structureDetail: isZh ? '文档结构清晰，层次分明：' : 'Document structure is clear and well-organized:',
            heading1Count: isZh ? '一级标题' : 'Level 1 Headings',
            heading2Count: isZh ? '二级标题' : 'Level 2 Headings',
            listCount: isZh ? '列表项' : 'List Items',
            avgParagraphLength: isZh ? '平均段落长度' : 'Average Paragraph Length',
            
            contentQuality: isZh ? '### ✅ 内容质量' : '### ✅ Content Quality',
            qualityDetail: isZh ? '内容质量评估：' : 'Content quality assessment:',
            completeness: isZh ? '完整性' : 'Completeness',
            completenessScore: isTestReport ? (isZh ? '优秀 - 测试覆盖全面' : 'Excellent - Comprehensive test coverage') : (isZh ? '优秀 - 内容覆盖全面' : 'Excellent - Comprehensive coverage'),
            accuracy: isZh ? '准确性' : 'Accuracy',
            accuracyScore: isTestReport ? (isZh ? '优秀 - 数据准确可靠' : 'Excellent - Accurate and reliable data') : (isZh ? '良好 - 信息准确可靠' : 'Good - Accurate and reliable information'),
            relevance: isZh ? '相关性' : 'Relevance',
            relevanceScore: isZh ? '优秀 - 与主题高度相关' : 'Excellent - Highly relevant to topic',
            
            testDataSection: isZh ? '### 🧪 测试数据分析' : '### 🧪 Test Data Analysis',
            testSummary: isZh ? '测试汇总' : 'Test Summary',
            totalCases: isZh ? '总测试用例数' : 'Total Test Cases',
            passedCases: isZh ? '通过用例数' : 'Passed Test Cases',
            failedCases: isZh ? '失败用例数' : 'Failed Test Cases',
            passRate: isZh ? '通过率' : 'Pass Rate',
            
            batteryTestSection: isZh ? '#### 🔋 电池续航测试' : '#### 🔋 Battery Life Tests',
            performanceTestSection: isZh ? '#### ⚡ 性能测试' : '#### ⚡ Performance Tests',
            stabilityTestSection: isZh ? '#### 🛡️ 稳定性测试' : '#### 🛡️ Stability Tests',
            defectsSection: isZh ? '#### 🐛 缺陷统计' : '#### 🐛 Defect Statistics',
            
            actual: isZh ? '实际值' : 'Actual',
            target: isZh ? '目标值' : 'Target',
            status: isZh ? '状态' : 'Status',
            pass: isZh ? '✅ 通过' : '✅ Pass',
            fail: isZh ? '❌ 失败' : '❌ Fail',
            
            keyPoints: isZh ? '### 🔑 关键发现' : '### 🔑 Key Findings',
            keywords: isZh ? '### 🏷️ 关键词提取' : '### 🏷️ Keyword Extraction',
            keywordsList: isTestReport ? 
                (isZh ? '- 测试报告\n- 电池续航\n- 性能测试\n- 稳定性测试\n- 缺陷统计\n- MTTF\n- 功能集成率\n- GPS性能' : 
                '- Test Report\n- Battery Life\n- Performance Testing\n- Stability Testing\n- Defect Statistics\n- MTTF\n- Feature Integration\n- GPS Performance') :
                (isZh ? '- 项目管理\n- 技术实施\n- 风险控制\n- 质量保证\n- 团队协作\n- 性能优化\n- 系统稳定性' : 
                '- Project Management\n- Technical Implementation\n- Risk Control\n- Quality Assurance\n- Team Collaboration\n- Performance Optimization\n- System Stability'),
            
            improvementSuggestions: isZh ? '### 💡 改进建议' : '### 💡 Improvement Suggestions',
            summary: isZh ? '### 📝 总结' : '### 📝 Summary',
            summaryText: isTestReport ? 
                (isZh ? '该测试报告是一份高质量的测试文档，测试覆盖全面，数据详实可靠。各项关键指标均达到或超过预期目标，整体通过率达到91.0%。建议重点关注GPS冷启动时间和滑动帧率的优化，并及时修复发现的Critical级别缺陷。' : 
                'This is a high-quality test report with comprehensive test coverage and detailed, reliable data. All key metrics meet or exceed expected targets, with an overall pass rate of 91.0%. It is recommended to focus on optimizing GPS cold start time and slide frame rate, and to promptly fix the discovered Critical-level defects.') :
                (isZh ? '该文档是一份高质量的技术文档，内容全面、结构清晰、逻辑严谨。建议按照改进建议进一步优化文档。' : 
                'This is a high-quality technical document with comprehensive content, clear structure, and rigorous logic. It is recommended to further optimize the document according to the improvement suggestions.'),
            footer: isZh ? '*此分析由AI根据文档内容生成，仅供参考*' : '*This analysis is generated by AI based on document content, for reference only*'
        };

        let analysis = `${t.title}\n\n`;
        
        // Document information
        analysis += `${t.docInfo}\n`;
        analysis += `- **${t.docId}**: \`${documentContent.docId}\`\n`;
        analysis += `- **${t.url}**: ${documentContent.url}\n`;
        analysis += `- **${t.wordCount}**: ${documentContent.metadata.wordCount} ${isZh ? '字' : 'words'}\n`;
        analysis += `- **${t.paragraphCount}**: ${documentContent.metadata.paragraphCount} ${isZh ? '个段落' : 'paragraphs'}\n`;
        analysis += `- **${t.headingCount}**: ${documentContent.metadata.headingCount} ${isZh ? '个标题' : 'headings'}\n`;
        analysis += `- **${t.lastModified}**: ${new Date(documentContent.metadata.lastModified).toLocaleString()}\n\n`;
        
        // Content analysis
        analysis += `${t.contentAnalysis}\n`;
        analysis += `- **${t.docType}**: ${t.docTypeValue}\n`;
        analysis += `- **${t.targetAudience}**: ${t.targetAudienceValue}\n`;
        analysis += `- **${t.complexity}**: ${t.complexityLevel}\n`;
        analysis += `- **${t.readability}**: ${t.readabilityScore}\n\n`;
        
        // Structure analysis
        analysis += `${t.structureAnalysis}\n`;
        analysis += `${t.structureDetail}\n`;
        analysis += `- ${t.heading1Count}: ${documentContent.sections.filter(s => s.type === 'heading' && s.level === 1).length}\n`;
        analysis += `- ${t.heading2Count}: ${documentContent.sections.filter(s => s.type === 'heading' && s.level === 2).length}\n`;
        const totalListItems = documentContent.sections.filter(s => s.type === 'list').reduce((sum, s) => sum + (s.items ? s.items.length : 0), 0);
        analysis += `- ${t.listCount}: ${totalListItems}\n`;
        const avgLength = Math.round(documentContent.metadata.wordCount / documentContent.metadata.paragraphCount);
        analysis += `- ${t.avgParagraphLength}: ${avgLength} ${isZh ? '字/段落' : 'words/paragraph'}\n\n`;
        
        // Content quality
        analysis += `${t.contentQuality}\n`;
        analysis += `${t.qualityDetail}\n`;
        analysis += `- **${t.completeness}**: ${t.completenessScore}\n`;
        analysis += `- **${t.accuracy}**: ${t.accuracyScore}\n`;
        analysis += `- **${t.relevance}**: ${t.relevanceScore}\n\n`;
        
        // Test data analysis
        if (isTestReport && documentContent.testData) {
            const testData = documentContent.testData;
            
            analysis += `${t.testDataSection}\n\n`;
            
            // Test summary
            analysis += `${t.testSummary}\n`;
            analysis += `- **${t.totalCases}**: ${testData.totalTestCases}\n`;
            analysis += `- **${t.passedCases}**: ${testData.passedTestCases}\n`;
            analysis += `- **${t.failedCases}**: ${testData.failedTestCases}\n`;
            analysis += `- **${t.passRate}**: ${testData.passRate}%\n\n`;
            
            // Battery tests
            analysis += `${t.batteryTestSection}\n`;
            analysis += `| 场景 | ${t.actual} | ${t.target} | ${t.status} |\n`;
            analysis += `|------|----------|----------|----------|\n`;
            const batteryLabels = {
                '20hz_typical': isZh ? '20Hz 典型' : '20Hz Typical',
                '20hz_heavy': isZh ? '20Hz 重度' : '20Hz Heavy',
                '20hz_aod': isZh ? '20Hz AOD' : '20Hz AOD',
                '100hz_typical': isZh ? '100Hz 典型' : '100Hz Typical',
                '100hz_heavy': isZh ? '100Hz 重度' : '100Hz Heavy',
                '100hz_aod': isZh ? '100Hz AOD' : '100Hz AOD'
            };
            Object.keys(testData.batteryTests).forEach(key => {
                const test = testData.batteryTests[key];
                analysis += `| ${batteryLabels[key]} | ${test.actual} ${isZh ? '天' : 'days'} | ${test.target} ${isZh ? '天' : 'days'} | ${test.status === 'pass' ? t.pass : t.fail} |\n`;
            });
            analysis += '\n';
            
            // Performance tests
            analysis += `${t.performanceTestSection}\n`;
            analysis += `| 测试项 | ${t.actual} | ${t.target} | ${t.status} |\n`;
            analysis += `|--------|----------|----------|----------|\n`;
            const perfLabels = {
                'gps_cold': isZh ? 'GPS冷启动' : 'GPS Cold Start',
                'gps_hot': isZh ? 'GPS热启动' : 'GPS Hot Start',
                'touch_response': isZh ? '触摸响应' : 'Touch Response',
                'key_response': isZh ? '按键响应' : 'Key Response',
                'slide_fps': isZh ? '滑动帧率' : 'Slide FPS',
                'slide_drop': isZh ? '滑动丢帧率' : 'Slide Drop Rate'
            };
            const perfUnits = {
                'gps_cold': isZh ? '秒' : 's',
                'gps_hot': isZh ? '秒' : 's',
                'touch_response': 'ms',
                'key_response': 'ms',
                'slide_fps': 'fps',
                'slide_drop': '%'
            };
            Object.keys(testData.performanceTests).forEach(key => {
                const test = testData.performanceTests[key];
                analysis += `| ${perfLabels[key]} | ${test.actual} ${perfUnits[key]} | ${test.target} ${perfUnits[key]} | ${test.status === 'pass' ? t.pass : t.fail} |\n`;
            });
            analysis += '\n';
            
            // Stability tests
            analysis += `${t.stabilityTestSection}\n`;
            analysis += `| 测试项 | ${t.actual} | ${t.target} | ${t.status} |\n`;
            analysis += `|--------|----------|----------|----------|\n`;
            const stabilityLabels = {
                'mttf': 'MTTF',
                'integration': isZh ? '功能集成率' : 'Integration Rate',
                'algorithm': isZh ? '算法准确率' : 'Algorithm Accuracy'
            };
            const stabilityUnits = {
                'mttf': isZh ? '小时' : 'h',
                'integration': '%',
                'algorithm': '%'
            };
            Object.keys(testData.stabilityTests).forEach(key => {
                const test = testData.stabilityTests[key];
                analysis += `| ${stabilityLabels[key]} | ${test.actual} ${stabilityUnits[key]} | ${test.target} ${stabilityUnits[key]} | ${test.status === 'pass' ? t.pass : t.fail} |\n`;
            });
            analysis += '\n';
            
            // Defects
            analysis += `${t.defectsSection}\n`;
            analysis += `- **Blocker**: ${testData.defects.blocker}\n`;
            analysis += `- **Critical**: ${testData.defects.critical}\n`;
            analysis += `- **Major**: ${testData.defects.major}\n`;
            analysis += `- **Minor**: ${testData.defects.minor}\n`;
            analysis += `- **${isZh ? '总计' : 'Total'}**: ${testData.defects.blocker + testData.defects.critical + testData.defects.major + testData.defects.minor}\n\n`;
        }
        
        // Key findings (context-aware)
        analysis += `${t.keyPoints}\n`;
        if (isTestReport && documentContent.testData) {
            const testData = documentContent.testData;
            
            const overallStatus = testData.passRate >= 90 ? (isZh ? '优秀' : 'Excellent') : 
                                 testData.passRate >= 80 ? (isZh ? '良好' : 'Good') : 
                                 testData.passRate >= 70 ? (isZh ? '一般' : 'Average') : (isZh ? '较差' : 'Poor');
            
            analysis += isZh ? 
                `1. **整体表现${overallStatus}**：本次测试共执行 ${testData.totalTestCases} 个测试用例，通过 ${testData.passedTestCases} 个，通过率达到 ${testData.passRate}%。` :
                `1. **Overall Performance: ${overallStatus}**: A total of ${testData.totalTestCases} test cases were executed, with ${testData.passedTestCases} passing, achieving a pass rate of ${testData.passRate}%.`;
            analysis += '\n\n';
            
            const batteryResults = Object.values(testData.batteryTests);
            const allBatteryPassed = batteryResults.every(t => t.status === 'pass');
            analysis += isZh ? 
                `2. **电池续航表现${allBatteryPassed ? '优秀' : '需关注'}**：${allBatteryPassed ? '所有电池测试项均通过，续航表现超出预期。' : '部分电池测试项未达标，建议优化电源管理策略。'}` :
                `2. **Battery Life Performance: ${allBatteryPassed ? 'Excellent' : 'Needs Attention'}**: ${allBatteryPassed ? 'All battery tests passed, exceeding expectations.' : 'Some battery tests did not meet targets, consider optimizing power management.'}`;
            analysis += '\n\n';
            
            const failedPerfTests = Object.entries(testData.performanceTests).filter(([, t]) => t.status === 'fail');
            analysis += isZh ? 
                `3. **性能瓶颈识别**：${failedPerfTests.length === 0 ? '所有性能测试均通过！' : `发现 ${failedPerfTests.length} 项性能指标未达标：${failedPerfTests.map(([k]) => perfLabels[k]).join('、')}`}` :
                `3. **Performance Bottlenecks**: ${failedPerfTests.length === 0 ? 'All performance tests passed!' : `${failedPerfTests.length} performance metrics did not meet targets: ${failedPerfTests.map(([k]) => perfLabels[k]).join(', ')}`}`;
            analysis += '\n\n';
            
            const stabilityResults = Object.values(testData.stabilityTests);
            const allStabilityPassed = stabilityResults.every(t => t.status === 'pass');
            const mttfValue = testData.stabilityTests.mttf.actual;
            analysis += isZh ? 
                `4. **系统稳定性${allStabilityPassed ? '良好' : '需改进'}**：MTTF达到 ${mttfValue} 小时${mttfValue >= 9 ? '，超出目标要求。' : '，未达到目标要求。'}功能集成率 ${testData.stabilityTests.integration.actual}%，算法准确率 ${testData.stabilityTests.algorithm.actual}%。` :
                `4. **System Stability: ${allStabilityPassed ? 'Good' : 'Needs Improvement'}**: MTTF reached ${mttfValue} hours ${mttfValue >= 9 ? ', exceeding target.' : ', below target.'} Feature integration rate is ${testData.stabilityTests.integration.actual}%, algorithm accuracy is ${testData.stabilityTests.algorithm.actual}%.`;
            analysis += '\n\n';
            
            const totalDefects = testData.defects.blocker + testData.defects.critical + testData.defects.major + testData.defects.minor;
            analysis += isZh ? 
                `5. **缺陷分布分析**：共发现 ${totalDefects} 个缺陷。${testData.defects.blocker === 0 ? '无Blocker级缺陷，' : `${testData.defects.blocker} 个Blocker级缺陷需立即修复。`}${testData.defects.critical > 0 ? `${testData.defects.critical} 个Critical级缺陷需优先处理。` : ''}建议优先解决Critical级别缺陷。` :
                `5. **Defect Distribution**: A total of ${totalDefects} defects were found. ${testData.defects.blocker === 0 ? 'No Blocker defects. ' : `${testData.defects.blocker} Blocker defects require immediate attention. `}${testData.defects.critical > 0 ? `${testData.defects.critical} Critical defects need priority handling. ` : ''}Recommend prioritizing Critical defect fixes.`;
            analysis += '\n\n';
            
        } else {
            analysis += `${t.summaryText}\n\n`;
        }
        
        // Keywords
        analysis += `${t.keywords}\n`;
        analysis += `${t.keywordsList}\n\n`;
        
        // Improvement suggestions (context-aware)
        analysis += `${t.improvementSuggestions}\n`;
        if (isTestReport && documentContent.testData) {
            const testData = documentContent.testData;
            const perfTests = testData.performanceTests;
            const suggestions = [];
            
            if (perfTests.gps_cold.status === 'fail') {
                suggestions.push(isZh ? 
                    '1. **优化GPS冷启动时间**：当前GPS冷启动时间为 ' + perfTests.gps_cold.actual + ' 秒，超出目标 ' + perfTests.gps_cold.target + ' 秒。建议优化定位算法或增加辅助定位数据源。' :
                    '1. **Optimize GPS Cold Start Time**: Current GPS cold start time is ' + perfTests.gps_cold.actual + 's, exceeding the target of ' + perfTests.gps_cold.target + 's. Suggest optimizing positioning algorithms or adding auxiliary positioning data sources.');
            }
            
            if (perfTests.slide_fps.status === 'fail') {
                suggestions.push(isZh ? 
                    '2. **提升滑动帧率**：当前滑动帧率为 ' + perfTests.slide_fps.actual + ' fps，目标为 ' + perfTests.slide_fps.target + ' fps。建议优化UI渲染逻辑，减少不必要的重绘。' :
                    '2. **Improve Slide Frame Rate**: Current slide frame rate is ' + perfTests.slide_fps.actual + ' fps, target is ' + perfTests.slide_fps.target + ' fps. Suggest optimizing UI rendering logic to reduce unnecessary redraws.');
            }
            
            if (testData.defects.critical > 0) {
                suggestions.push(isZh ? 
                    '3. **优先修复Critical缺陷**：发现 ' + testData.defects.critical + ' 个Critical级缺陷，建议在下一版本迭代中优先处理。' :
                    '3. **Prioritize Critical Defects**: Found ' + testData.defects.critical + ' Critical-level defects, recommend prioritizing these in the next iteration.');
            }
            
            if (testData.defects.major > 3) {
                suggestions.push(isZh ? 
                    '4. **关注Major缺陷**：存在 ' + testData.defects.major + ' 个Major级缺陷，建议制定修复计划逐步解决。' :
                    '4. **Address Major Defects**: There are ' + testData.defects.major + ' Major-level defects, suggest developing a fix plan.');
            }
            
            suggestions.push(isZh ? 
                '5. **持续监控稳定性**：MTTF当前表现良好，但建议建立持续监控机制，确保系统稳定性持续达标。' :
                '5. **Continuous Stability Monitoring**: MTTF performance is currently good, but recommend establishing continuous monitoring to ensure ongoing stability compliance.');
            
            suggestions.forEach(s => {
                analysis += `${s}\n\n`;
            });
            
        } else {
            analysis += isZh ? 
                '1. **增加可视化内容**：建议在文档中添加更多图表、流程图和架构图。\n\n2. **补充案例说明**：建议增加实际案例和示例，使抽象的概念更加具体化。\n\n3. **优化章节组织**：建议重新组织章节结构，将相关内容归类。\n\n4. **添加索引和目录**：建议在文档开头添加详细目录，在文档末尾添加关键词索引。\n\n5. **建立版本控制**：建议使用文档版本控制系统，记录每次修改的内容和原因。\n\n' :
                '1. **Add Visual Content**: Consider adding more charts, flowcharts, and architecture diagrams.\n\n2. **Add Case Studies**: Consider adding real-world cases and examples to make abstract concepts more concrete.\n\n3. **Optimize Chapter Organization**: Consider reorganizing the chapter structure to group related content together.\n\n4. **Add Index and Table of Contents**: Consider adding a detailed table of contents at the beginning and a keyword index at the end.\n\n5. **Establish Version Control**: Recommend using a document version control system to record the content and reason for each change.\n\n';
        }
        
        // Summary
        analysis += `${t.summary}\n`;
        analysis += `${t.summaryText}\n\n`;
        
        analysis += `${t.footer}`;
        
        return analysis;
    }
}

// Create singleton instance
export const aiAssistant = new AIAssistant();