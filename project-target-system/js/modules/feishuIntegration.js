export class FeishuIntegration {
    constructor() {
        this.apiBase = 'http://localhost:3000';
        this.isLoggedIn = false;
        this.user = null;
        this.documents = [];
        this.currentDocument = null;
        this.useMock = false;
        
        this.mockDocuments = [
            {
                document_id: 'doc123',
                name: 'IOT设备测试报告 v2.1',
                type: 'docx',
                owner: '张三',
                updated_at: '2024-06-20',
                size: '256KB'
            },
            {
                document_id: 'doc456',
                name: '项目进度周报 - 第25周',
                type: 'docx',
                owner: '李四',
                updated_at: '2024-06-19',
                size: '128KB'
            },
            {
                document_id: 'sheet789',
                name: '测试数据统计表格',
                type: 'sheet',
                owner: '王五',
                updated_at: '2024-06-18',
                size: '512KB'
            },
            {
                document_id: 'doc001',
                name: '产品需求文档 - V3.0',
                type: 'docx',
                owner: '赵六',
                updated_at: '2024-06-17',
                size: '1MB'
            },
            {
                document_id: 'slide002',
                name: '项目评审PPT',
                type: 'slide',
                owner: '张三',
                updated_at: '2024-06-16',
                size: '2MB'
            },
            {
                document_id: 'doc003',
                name: '技术方案设计文档',
                type: 'docx',
                owner: '李四',
                updated_at: '2024-06-15',
                size: '768KB'
            }
        ];

        this.mockDocContents = {
            'doc123': [
                { type: 'heading1', text: 'IOT设备测试报告 v2.1' },
                { type: 'paragraph', text: '本次测试针对IOT传感器设备的各项功能进行了全面验证，包括电池续航、性能表现、稳定性等关键指标。' },
                { type: 'heading2', text: '测试环境' },
                { type: 'list', items: ['设备型号: IOT-Sensor-2024', '固件版本: v2.1.3', '测试温度: 25°C', '测试时间: 2024-06-15 至 2024-06-20'] },
                { type: 'heading2', text: '测试结果汇总' },
                { type: 'paragraph', text: '共执行测试用例 156 个，通过 142 个，失败 14 个，整体通过率 91.0%。' },
                { type: 'heading2', text: '电池续航测试' },
                { type: 'list', items: ['20Hz 典型场景: 8.2 天 (目标: 8 天)', '20Hz 重度场景: 7.1 天 (目标: 7 天)', '20Hz AOD场景: 9.3 天 (目标: 9 天)', '100Hz 典型场景: 7.5 天 (目标: 7 天)', '100Hz 重度场景: 6.8 天 (目标: 6 天)', '100Hz AOD场景: 8.7 天 (目标: 8 天)'] },
                { type: 'heading2', text: '性能测试' },
                { type: 'list', items: ['GPS冷启动时间: 8.5秒 (目标: 8秒)', 'GPS热启动时间: 2.3秒 (目标: 2秒)', '触摸响应时间: 45ms (目标: 50ms)', '按键响应时间: 38ms (目标: 40ms)', '滑动帧率: 58fps (目标: 60fps)', '滑动丢帧率: 1.2% (目标: 2%)'] },
                { type: 'heading2', text: '稳定性测试' },
                { type: 'list', items: ['MTTF: 9.2小时 (目标: 9小时)', '功能集成率: 85% (目标: 80%)', '算法准确率: 92% (目标: 90%)'] },
                { type: 'heading2', text: '缺陷统计' },
                { type: 'list', items: ['Blocker: 1个', 'Critical: 3个', 'Major: 5个', 'Minor: 5个'] }
            ],
            'doc456': [
                { type: 'heading1', text: '项目进度周报 - 第25周' },
                { type: 'paragraph', text: '本周项目进展顺利，各项任务按计划推进中。' },
                { type: 'heading2', text: '已完成任务' },
                { type: 'list', items: ['完成用户登录模块开发', '优化数据库查询性能', '修复3个Critical级Bug', '完成API文档编写'] },
                { type: 'heading2', text: '进行中任务' },
                { type: 'list', items: ['支付模块集成 (60%)', '消息推送功能开发 (40%)', '性能测试 (30%)'] },
                { type: 'heading2', text: '下周计划' },
                { type: 'list', items: ['完成支付模块集成', '启动UAT测试', '代码审查'] }
            ],
            'doc001': [
                { type: 'heading1', text: '产品需求文档 - V3.0' },
                { type: 'paragraph', text: '本文档详细描述了产品的功能需求和非功能需求。' },
                { type: 'heading2', text: '核心功能' },
                { type: 'list', items: ['用户管理系统', '数据可视化仪表盘', '实时消息通知', '多语言支持'] },
                { type: 'heading2', text: '性能要求' },
                { type: 'list', items: ['页面加载时间 < 2秒', '支持1000+并发用户', '数据同步延迟 < 500ms'] }
            ],
            'doc003': [
                { type: 'heading1', text: '技术方案设计文档' },
                { type: 'paragraph', text: '本文档描述了系统的技术架构和实现方案。' },
                { type: 'heading2', text: '架构设计' },
                { type: 'paragraph', text: '采用微服务架构，前后端分离，使用Redis做缓存，MySQL做持久化存储。' },
                { type: 'heading2', text: '技术栈' },
                { type: 'list', items: ['前端: Vue.js 3 + TypeScript', '后端: Node.js + Express', '数据库: MySQL + Redis', '部署: Docker + Kubernetes'] }
            ],
            'sheet789': [
                { type: 'heading1', text: '测试数据统计表格' },
                { type: 'paragraph', text: '包含各版本测试数据的统计汇总。' },
                { type: 'table', rows: [['版本', '测试用例数', '通过数', '失败数', '通过率'], ['v1.0', '100', '85', '15', '85%'], ['v1.1', '120', '108', '12', '90%'], ['v2.0', '156', '142', '14', '91%']] }
            ],
            'slide002': [
                { type: 'heading1', text: '项目评审PPT' },
                { type: 'paragraph', text: '项目进展汇报和下一步计划。' },
                { type: 'heading2', text: '项目状态' },
                { type: 'list', items: ['进度: 65%', '预算: 80%', '资源: 充足'] },
                { type: 'heading2', text: '关键里程碑' },
                { type: 'list', items: ['Q2目标: 完成核心功能开发', 'Q3目标: 上线Beta版本', 'Q4目标: 正式发布'] }
            ]
        };

        this.mockUser = {
            name: '飞书用户',
            open_id: 'ou_1234567890',
            avatar_url: ''
        };
    }

    async checkBackendAvailability() {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(`${this.apiBase}/auth/status`, {
                signal: controller.signal
            });
            
            clearTimeout(timeout);
            return response.ok;
        } catch (error) {
            console.log('Backend not available, switching to mock mode');
            return false;
        }
    }

    async checkAuthStatus() {
        if (this.useMock) {
            return this.isLoggedIn;
        }

        const available = await this.checkBackendAvailability();
        if (!available) {
            this.useMock = true;
            const savedLogin = localStorage.getItem('feishu_mock_login');
            if (savedLogin) {
                this.isLoggedIn = true;
                this.user = this.mockUser;
            }
            return this.isLoggedIn;
        }

        try {
            const response = await fetch(`${this.apiBase}/auth/status`, {
                credentials: 'include'
            });
            const data = await response.json();
            this.isLoggedIn = data.loggedIn;
            this.user = data.user || null;
            return this.isLoggedIn;
        } catch (error) {
            console.error('Auth check failed:', error);
            this.useMock = true;
            const savedLogin = localStorage.getItem('feishu_mock_login');
            if (savedLogin) {
                this.isLoggedIn = true;
                this.user = this.mockUser;
            }
            return this.isLoggedIn;
        }
    }

    login() {
        if (this.useMock) {
            this.mockLogin();
            return;
        }
        
        const available = this.checkBackendAvailability();
        if (!available) {
            this.useMock = true;
            this.mockLogin();
            return;
        }
        
        window.location.href = `${this.apiBase}/auth/login`;
    }

    mockLogin() {
        const loginModal = document.createElement('div');
        loginModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        loginModal.innerHTML = `
            <div style="background: #1a1a2e; padding: 40px; border-radius: 16px; text-align: center; max-width: 400px; border: 1px solid rgba(99,102,241,0.3);">
                <div style="font-size: 3rem; margin-bottom: 20px;">📄</div>
                <h3 style="color: #e2e8f0; margin-bottom: 10px;">模拟飞书登录</h3>
                <p style="color: #94a3b8; margin-bottom: 20px;">正在连接飞书账号...</p>
                <div style="width: 40px; height: 40px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            </div>
        `;
        
        document.body.appendChild(loginModal);
        
        setTimeout(() => {
            this.isLoggedIn = true;
            this.user = this.mockUser;
            localStorage.setItem('feishu_mock_login', 'true');
            
            loginModal.remove();
            
            const userInfo = document.getElementById('feishu-user-info');
            const userName = document.getElementById('feishu-user-name');
            const loginBtn = document.getElementById('feishu-login-btn');
            const logoutBtn = document.getElementById('feishu-logout-btn');
            const docBrowser = document.getElementById('feishu-doc-browser');
            const notLoggedIn = document.getElementById('feishu-not-logged-in');
            
            userInfo.style.display = 'inline';
            userName.textContent = this.user.name;
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline';
            docBrowser.style.display = 'block';
            notLoggedIn.style.display = 'none';
            
            if (window.loadFeishuDocs) {
                window.loadFeishuDocs();
            }
        }, 1500);
    }

    async logout() {
        if (this.useMock) {
            this.isLoggedIn = false;
            this.user = null;
            this.documents = [];
            this.currentDocument = null;
            localStorage.removeItem('feishu_mock_login');
            
            const userInfo = document.getElementById('feishu-user-info');
            const loginBtn = document.getElementById('feishu-login-btn');
            const logoutBtn = document.getElementById('feishu-logout-btn');
            const docBrowser = document.getElementById('feishu-doc-browser');
            const notLoggedIn = document.getElementById('feishu-not-logged-in');
            
            userInfo.style.display = 'none';
            loginBtn.style.display = 'inline';
            logoutBtn.style.display = 'none';
            docBrowser.style.display = 'none';
            notLoggedIn.style.display = 'block';
            
            return;
        }

        try {
            await fetch(`${this.apiBase}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            this.isLoggedIn = false;
            this.user = null;
            this.documents = [];
            this.currentDocument = null;
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    async getDocuments(query = '') {
        if (this.useMock) {
            this.documents = this.mockDocuments.filter(doc => 
                !query || doc.name.toLowerCase().includes(query.toLowerCase())
            );
            return this.documents;
        }

        try {
            let url = `${this.apiBase}/api/documents`;
            if (query) {
                url = `${this.apiBase}/api/documents/search?q=${encodeURIComponent(query)}`;
            }
            
            const response = await fetch(url, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    this.isLoggedIn = false;
                    throw new Error('Unauthorized');
                }
                throw new Error('Failed to fetch documents');
            }
            
            const data = await response.json();
            this.documents = data.documents || data.data?.items || data.data || [];
            return this.documents;
        } catch (error) {
            console.error('Get documents failed:', error);
            this.useMock = true;
            this.documents = this.mockDocuments.filter(doc => 
                !query || doc.name.toLowerCase().includes(query.toLowerCase())
            );
            return this.documents;
        }
    }

    async getDocumentContent(documentId) {
        if (this.useMock) {
            const content = this.mockDocContents[documentId];
            return content ? { success: true, content, title: this.mockDocuments.find(d => d.document_id === documentId)?.name || 'Document' } : null;
        }

        try {
            const response = await fetch(`${this.apiBase}/api/documents/${documentId}/content`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    this.isLoggedIn = false;
                    throw new Error('Unauthorized');
                }
                throw new Error('Failed to fetch document content');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get document content failed:', error);
            this.useMock = true;
            const content = this.mockDocContents[documentId];
            return content ? { success: true, content, title: this.mockDocuments.find(d => d.document_id === documentId)?.name || 'Document' } : null;
        }
    }

    async getDocumentMetadata(documentId) {
        if (this.useMock) {
            return this.mockDocuments.find(d => d.document_id === documentId) || {};
        }

        try {
            const response = await fetch(`${this.apiBase}/api/documents/${documentId}/metadata`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    this.isLoggedIn = false;
                    throw new Error('Unauthorized');
                }
                throw new Error('Failed to fetch document metadata');
            }
            
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Get document metadata failed:', error);
            return this.mockDocuments.find(d => d.document_id === documentId) || {};
        }
    }

    extractDocId(url) {
        if (!url) return null;
        
        const regex = /\/doc\/([a-zA-Z0-9]+)/;
        const match = url.match(regex);
        if (match) return match[1];
        
        const idRegex = /([a-zA-Z0-9]{10,})/;
        const idMatch = url.match(idRegex);
        return idMatch ? idMatch[1] : null;
    }
}

export const feishu = new FeishuIntegration();

window.feishu = feishu;
