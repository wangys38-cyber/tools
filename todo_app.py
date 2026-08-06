#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Glass Todo - 炫酷待办事项管理应用
Python版本，使用tkinter创建GUI界面
"""

import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
import json
import os
import datetime
from typing import List, Dict, Any, Optional
import random
import math

# 设置中文字体支持
try:
    import matplotlib
    matplotlib.use('Agg')  # 非交互式后端
    from matplotlib import font_manager
    # 尝试使用系统中文字体
    system_fonts = font_manager.findSystemFonts(fontpaths=None, fontext='ttf')
    chinese_fonts = [f for f in system_fonts if any('song' in f.lower() or 'hei' in f.lower() or 'microsoftyahei' in f.lower() or 'simhei' in f.lower() or 'simsun' in f.lower() or 'msyh' in f.lower())]
    if chinese_fonts:
        CHINESE_FONT = chinese_fonts[0]
    else:
        CHINESE_FONT = None
except ImportError:
    CHINESE_FONT = None

class GlassTodoApp:
    """毛玻璃风格的待办事项管理应用"""
    
    def __init__(self, root: tk.Tk):
        """初始化应用"""
        self.root = root
        self.root.title("Glass Todo")
        self.root.geometry("1000x800")
        self.root.minsize(800, 600)
        
        # 设置窗口透明度和背景
        self.root.attributes('-alpha', 0.85)  # 增加窗口透明度，增强毛玻璃效果
        
        # 设置主题色
        self.colors = {
            'primary': '#6366F1',  # 主色调：靛蓝色
            'secondary': '#EC4899',  # 辅助色：粉色
            'accent': '#10B981',  # 强调色：绿色
            'dark': '#0F172A',  # 深色背景
            'light': '#F8FAFC',  # 浅色文本
            'success': '#10B981',  # 成功色
            'warning': '#F59E0B',  # 警告色
            'danger': '#EF4444',  # 危险色
            'glass_bg': '#1E293B',  # 毛玻璃背景
            'glass_fg': '#F8FAFC',  # 毛玻璃前景
            'glass_border': '#475569',  # 毛玻璃边框
            'card_bg': '#1E293B',  # 卡片背景
            'card_hover': '#2D3748'  # 卡片悬停背景
        }
        
        # 任务数据
        self.tasks: List[Dict[str, Any]] = []
        self.current_category = 'all'
        self.current_edit_id = None
        
        # 数据文件路径
        self.data_file = os.path.join(os.path.expanduser("~"), ".glass_todo_data.json")
        
        # 初始化界面
        self.setup_ui()
        
        # 加载数据
        self.load_data()
        
        # 如果没有任务，添加示例任务
        if not self.tasks:
            self.add_sample_tasks()
    
    def setup_ui(self) -> None:
        """设置用户界面"""
        # 设置背景
        self.root.configure(bg=self.colors['dark'])
        
        # 创建主框架
        self.main_frame = ttk.Frame(self.root, style="Glass.TFrame")
        self.main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # 设置样式
        self.setup_styles()
        
        # 创建头部
        self.create_header()
        
        # 创建统计面板
        self.create_stats_panel()
        
        # 创建任务列表
        self.create_task_list()
        
        # 创建分类导航
        self.create_category_nav()
        
        # 创建添加任务按钮
        self.create_add_button()
        
        # 创建模态框
        self.create_modals()
    
    def setup_styles(self) -> None:
        """设置ttk样式"""
        style = ttk.Style()
        
        # 玻璃效果样式
        style.configure("Glass.TFrame", 
                       background=self.colors['glass_bg'],
                       bordercolor=self.colors['glass_border'],
                       borderwidth=1)
        
        # 主按钮样式
        style.configure("Glass.TButton",
                       background=self.colors['primary'],
                       foreground=self.colors['light'],
                       bordercolor=self.colors['primary'],
                       borderwidth=0,
                       padding=(12, 6),
                       font=('Microsoft YaHei', 11, 'normal'),
                       relief='flat')
        
        # 按钮悬停效果
        style.map("Glass.TButton",
                 background=[('active', self.lighten_color(self.colors['primary'], 20))],
                 bordercolor=[('active', self.lighten_color(self.colors['primary'], 30))],
                 relief=[('active', 'raised')])
        
        # 标签样式
        style.configure("Glass.TLabel",
                       background=self.colors['glass_bg'],
                       foreground=self.colors['light'],
                       font=('Microsoft YaHei', 10))
        
        # 输入框样式
        style.configure("Glass.TEntry",
                       fieldbackground=self.colors['glass_bg'],
                       foreground=self.colors['light'],
                       bordercolor=self.colors['glass_border'],
                       borderwidth=1,
                       padding=(8, 5),
                       font=('Microsoft YaHei', 10))
        
        # 文本框样式
        style.configure("Glass.TText",
                       background=self.colors['glass_bg'],
                       foreground=self.colors['light'],
                       bordercolor=self.colors['glass_border'],
                       borderwidth=1,
                       font=('Microsoft YaHei', 10))
        
        # 下拉框样式
        style.configure("Glass.TCombobox",
                       fieldbackground=self.colors['glass_bg'],
                       foreground=self.colors['light'],
                       bordercolor=self.colors['glass_border'],
                       borderwidth=1,
                       padding=(8, 5),
                       font=('Microsoft YaHei', 10))
        
        # 分类按钮样式
        style.configure("Category.TButton",
                       background=self.colors['glass_bg'],
                       foreground=self.colors['light'],
                       bordercolor=self.colors['glass_border'],
                       borderwidth=1,
                       padding=(15, 8),
                       font=('Microsoft YaHei', 11, 'normal'),
                       relief='flat')
        
        style.map("Category.TButton",
                 background=[('active', self.colors['card_hover']),
                            ('selected', self.colors['primary'])],
                 foreground=[('selected', self.colors['light'])],
                 relief=[('active', 'raised')])
        
        # 任务卡片样式
        style.configure("TaskCard.TFrame",
                       background=self.colors['card_bg'],
                       bordercolor=self.colors['glass_border'],
                       borderwidth=1,
                       relief='flat',
                       padding=10)
        
        # 任务卡片悬停样式
        style.configure("TaskCardHover.TFrame",
                       background=self.colors['card_hover'],
                       bordercolor=self.colors['primary'],
                       borderwidth=2,
                       relief='flat',
                       padding=10)
        
        # 统计面板样式
        style.configure("Stat.TFrame",
                       background=self.colors['glass_bg'],
                       bordercolor=self.colors['glass_border'],
                       borderwidth=1,
                       relief='flat',
                       padding=15)
        
        # 优先级标签样式
        style.configure("Priority.High.TLabel",
                       background=self.colors['danger'],
                       foreground=self.colors['light'],
                       padding=(10, 4),
                       font=('Microsoft YaHei', 10, 'bold'),
                       relief='flat',
                       borderwidth=0)
        
        style.configure("Priority.Medium.TLabel",
                       background=self.colors['warning'],
                       foreground=self.colors['dark'],
                       padding=(10, 4),
                       font=('Microsoft YaHei', 10, 'bold'),
                       relief='flat',
                       borderwidth=0)
        
        style.configure("Priority.Low.TLabel",
                       background=self.colors['success'],
                       foreground=self.colors['light'],
                       padding=(10, 4),
                       font=('Microsoft YaHei', 10, 'bold'),
                       relief='flat',
                       borderwidth=0)
        

    
    def lighten_color(self, color: str, percent: int) -> str:
        """将颜色变亮"""
        # 移除#号
        color = color.lstrip('#')
        # 转换为RGB
        r = int(color[:2], 16)
        g = int(color[2:4], 16)
        b = int(color[4:6], 16)
        
        # 增加亮度
        r = min(255, int(r + (255 - r) * percent / 100))
        g = min(255, int(g + (255 - g) * percent / 100))
        b = min(255, int(b + (255 - b) * percent / 100))
        
        # 转换回十六进制
        return f'#{r:02x}{g:02x}{b:02x}'
    
    def create_header(self) -> None:
        """创建头部"""
        header_frame = ttk.Frame(self.main_frame, style="Glass.TFrame")
        header_frame.pack(fill=tk.X, pady=(0, 30))
        
        # 创建标题容器
        title_container = ttk.Frame(header_frame, style="Glass.TFrame")
        title_container.pack(fill=tk.X, pady=10)
        
        # 主标题
        title_label = ttk.Label(title_container, text="Glass Todo", 
                              font=("Microsoft YaHei", 42, "bold"),
                              style="Glass.TLabel",
                              foreground=self.colors['primary'])
        title_label.pack(pady=(10, 5))
        
        # 副标题
        subtitle_label = ttk.Label(title_container, 
                                 text="炫酷待办事项管理，让任务完成更有成就感",
                                 font=("Microsoft YaHei", 14),
                                 style="Glass.TLabel",
                                 foreground='#94A3B8')
        subtitle_label.pack(pady=(0, 15))
        
        # 添加装饰线
        line_frame = ttk.Frame(header_frame, height=2, style="Glass.TFrame")
        line_frame.pack(fill=tk.X, pady=(0, 10))
        line_canvas = tk.Canvas(line_frame, height=2, bg=self.colors['dark'], highlightthickness=0)
        line_canvas.pack(fill=tk.X)
        # 绘制渐变线条
        line_canvas.create_rectangle(0, 0, 1000, 2, fill=self.colors['primary'])
    
    def create_category_nav(self) -> None:
        """创建分类导航"""
        nav_frame = ttk.Frame(self.main_frame, style="Glass.TFrame", padding=10)
        nav_frame.pack(fill=tk.X, pady=(0, 20))
        
        self.category_buttons = {}
        categories = [
            ('all', '全部', '📋'),
            ('work', '工作', '💼'),
            ('study', '学习', '📚'),
            ('life', '生活', '❤️'),
            ('other', '其他', '📌')
        ]
        
        for category_id, category_name, icon in categories:
            btn = ttk.Button(nav_frame, 
                           text=f"{icon} {category_name}",
                           style="Category.TButton",
                           command=lambda c=category_id: self.switch_category(c))
            btn.pack(side=tk.LEFT, padx=5)
            self.category_buttons[category_id] = btn
        
        # 默认选中"全部"
        self.switch_category('all')
    
    def create_stats_panel(self) -> None:
        """创建统计面板"""
        stats_frame = ttk.Frame(self.main_frame, style="Glass.TFrame", padding=20)
        stats_frame.pack(fill=tk.X, pady=(0, 25))
        
        # 创建三个统计项
        self.total_label = self.create_stat_item(stats_frame, "总任务", "0", 0, self.colors['primary'])
        self.completed_label = self.create_stat_item(stats_frame, "已完成", "0", 1, self.colors['success'])
        self.pending_label = self.create_stat_item(stats_frame, "待完成", "0", 2, self.colors['warning'])
    
    def create_stat_item(self, parent: ttk.Frame, title: str, value: str, index: int, color: str) -> ttk.Label:
        """创建单个统计项"""
        stat_frame = ttk.Frame(parent, style="Stat.TFrame", padding=15)
        stat_frame.grid(row=0, column=index, sticky="nsew", padx=10, pady=5)
        
        # 设置列权重
        parent.grid_columnconfigure(index, weight=1)
        
        # 标题
        title_label = ttk.Label(stat_frame, text=title, style="Glass.TLabel", 
                              font=("Microsoft YaHei", 12, "normal"),
                              foreground='#94A3B8')
        title_label.pack(pady=(0, 10))
        
        # 数值
        value_label = ttk.Label(stat_frame, text=value, style="Glass.TLabel", 
                              font=("Microsoft YaHei", 32, "bold"),
                              foreground=color)
        value_label.pack()
        
        # 装饰线
        line_canvas = tk.Canvas(stat_frame, height=3, width=40, bg=self.colors['dark'], highlightthickness=0)
        line_canvas.pack(pady=(10, 0))
        line_canvas.create_rectangle(0, 0, 40, 3, fill=color)
        
        return value_label
    
    def create_task_list(self) -> None:
        """创建任务列表"""
        tasks_frame = ttk.Frame(self.main_frame, style="Glass.TFrame", padding=15)
        tasks_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 20))
        
        # 创建滚动条
        scrollbar = ttk.Scrollbar(tasks_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # 创建任务列表容器
        self.tasks_canvas = tk.Canvas(tasks_frame, 
                                    bg=self.colors['glass_bg'],
                                    yscrollcommand=scrollbar.set,
                                    highlightthickness=0)
        self.tasks_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        scrollbar.config(command=self.tasks_canvas.yview)
        
        # 创建任务列表框架
        self.tasks_list_frame = ttk.Frame(self.tasks_canvas, style="Glass.TFrame")
        self.tasks_canvas.create_window((0, 0), window=self.tasks_list_frame, anchor=tk.NW, width=900)
        
        # 绑定滚动事件
        self.tasks_list_frame.bind("<Configure>", lambda e: self.tasks_canvas.configure(scrollregion=self.tasks_canvas.bbox("all")))
        
        # 空状态标签
        self.empty_label = ttk.Label(self.tasks_list_frame, 
                                   text="暂无任务，点击右下角按钮添加",
                                   style="Glass.TLabel",
                                   font=("Microsoft YaHei", 14),
                                   foreground='#94A3B8')
        self.empty_label.pack(pady=80)
    
    def create_add_button(self) -> None:
        """创建添加任务按钮"""
        # 创建圆形添加按钮
        add_button = ttk.Button(self.main_frame,
                              text="+",
                              style="Glass.TButton",
                              command=self.open_add_task_dialog,
                              width=3,
                              padding=(25, 25))
        # 使用样式配置
        style = ttk.Style()
        style.configure("AddButton.TButton",
                       background=self.colors['secondary'],
                       foreground=self.colors['light'],
                       bordercolor=self.colors['secondary'],
                       borderwidth=0,
                       font=('Microsoft YaHei', 28, 'bold'),
                       relief='flat')
        
        style.map("AddButton.TButton",
                 background=[('active', self.lighten_color(self.colors['secondary'], 20))],
                 bordercolor=[('active', self.lighten_color(self.colors['secondary'], 30))],
                 relief=[('active', 'raised')])
        
        add_button.config(style="AddButton.TButton")
        add_button.place(relx=0.95, rely=0.95, anchor=tk.SE)
    
    def create_modals(self) -> None:
        """创建模态框"""
        # 任务编辑对话框
        self.task_dialog = None
        
        # 删除确认对话框
        self.delete_dialog = None
    
    def switch_category(self, category: str) -> None:
        """切换任务分类"""
        self.current_category = category
        
        # 更新按钮状态
        for cat_id, btn in self.category_buttons.items():
            if cat_id == category:
                btn.state(['selected'])
            else:
                btn.state(['!selected'])
        
        # 刷新任务列表
        self.refresh_task_list()
    
    def refresh_task_list(self) -> None:
        """刷新任务列表"""
        # 清空当前列表
        for widget in self.tasks_list_frame.winfo_children():
            widget.destroy()
        
        # 过滤任务
        filtered_tasks = self.tasks
        if self.current_category != 'all':
            filtered_tasks = [task for task in self.tasks if task['category'] == self.current_category]
        
        # 按优先级和创建时间排序
        filtered_tasks.sort(key=lambda x: (x['completed'], 
                                         0 if x['priority'] == 'high' else 1 if x['priority'] == 'medium' else 2,
                                         -datetime.datetime.fromisoformat(x['createdAt']).timestamp()))
        
        if not filtered_tasks:
            # 显示空状态
            self.empty_label = ttk.Label(self.tasks_list_frame, 
                                       text="暂无任务，点击右下角按钮添加",
                                       style="Glass.TLabel",
                                       font=("Microsoft YaHei", 12))
            self.empty_label.pack(pady=50)
        else:
            # 显示任务列表
            for task in filtered_tasks:
                self.create_task_card(task)
        
        # 更新统计
        self.update_stats()
        
        # 更新画布滚动区域
        self.tasks_canvas.update_idletasks()
        self.tasks_canvas.configure(scrollregion=self.tasks_canvas.bbox("all"))
    
    def create_task_card(self, task: Dict[str, Any]) -> None:
        """创建任务卡片"""
        card_frame = ttk.Frame(self.tasks_list_frame, style="TaskCard.TFrame", padding=15)
        card_frame.pack(fill=tk.X, pady=8, padx=2)
        
        # 添加卡片悬停效果
        def on_enter(event):
            card_frame.config(style="TaskCardHover.TFrame")
            # 添加轻微的缩放效果
            card_frame.pack_configure(pady=6, padx=0)
        
        def on_leave(event):
            card_frame.config(style="TaskCard.TFrame")
            # 恢复原始大小
            card_frame.pack_configure(pady=8, padx=2)
        
        card_frame.bind("<Enter>", on_enter)
        card_frame.bind("<Leave>", on_leave)
        
        # 任务标题行
        title_frame = ttk.Frame(card_frame, style="Glass.TFrame")
        title_frame.pack(fill=tk.X, pady=(0, 10))
        
        # 完成按钮 - 使用自定义样式
        complete_var = tk.BooleanVar(value=task['completed'])
        complete_btn = ttk.Checkbutton(title_frame,
                                     variable=complete_var,
                                     command=lambda t=task: self.toggle_task_completion(t['id']),
                                     style="Glass.TButton")
        complete_btn.pack(side=tk.LEFT, padx=5)
        
        # 任务标题
        title_font = ("Microsoft YaHei", 14, "bold")
        if task['completed']:
            title_font = ("Microsoft YaHei", 14, "bold overstrike")
        
        title_label = ttk.Label(title_frame,
                              text=task['title'],
                              style="Glass.TLabel",
                              font=title_font,
                              anchor=tk.W)
        title_label.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=10)
        
        # 任务信息行
        info_frame = ttk.Frame(card_frame, style="Glass.TFrame")
        info_frame.pack(fill=tk.X, pady=(0, 10))
        
        # 优先级标签
        priority_style = f"Priority.{task['priority'].capitalize()}.TLabel"
        priority_text = "高" if task['priority'] == 'high' else "中" if task['priority'] == 'medium' else "低"
        priority_label = ttk.Label(info_frame,
                                 text=priority_text,
                                 style=priority_style,
                                 padding=(10, 4),
                                 borderwidth=0,
                                 relief='flat')
        priority_label.pack(side=tk.LEFT, padx=5)
        
        # 分类标签
        category_text = self.get_category_name(task['category'])
        category_label = ttk.Label(info_frame,
                                 text=category_text,
                                 style="Glass.TLabel",
                                 padding=(10, 4),
                                 background=self.colors['glass_bg'],
                                 borderwidth=1,
                                 relief='flat')
        category_label.pack(side=tk.LEFT, padx=5)
        
        # 截止日期
        due_date_text = "无截止日期"
        due_date_color = self.colors['light']
        if task['dueDate']:
            due_date = datetime.datetime.fromisoformat(task['dueDate'].replace('Z', '+00:00'))
            due_date_text = due_date.strftime("%Y-%m-%d")
            
            # 检查是否逾期
            if not task['completed'] and due_date.date() < datetime.date.today():
                due_date_text = f"{due_date_text} (已逾期)"
                due_date_color = self.colors['danger']
        
        due_date_label = ttk.Label(info_frame,
                                 text=due_date_text,
                                 style="Glass.TLabel",
                                 font=("Microsoft YaHei", 11),
                                 foreground=due_date_color)
        due_date_label.pack(side=tk.RIGHT, padx=5)
        
        # 任务描述
        if 'description' in task and task['description']:
            desc_font = ("Microsoft YaHei", 11)
            if task['completed']:
                desc_font = ("Microsoft YaHei", 11, "overstrike")
            
            desc_label = ttk.Label(card_frame,
                                 text=task['description'],
                                 style="Glass.TLabel",
                                 font=desc_font,
                                 wraplength=850,
                                 justify=tk.LEFT,
                                 anchor=tk.W,
                                 foreground='#CBD5E1')
            desc_label.pack(fill=tk.X, pady=(5, 15), padx=5)
        
        # 操作按钮行
        actions_frame = ttk.Frame(card_frame, style="Glass.TFrame")
        actions_frame.pack(fill=tk.X, pady=(5, 0))
        
        # 编辑按钮
        edit_btn = ttk.Button(actions_frame,
                            text="编辑",
                            style="Glass.TButton",
                            command=lambda t=task: self.open_edit_task_dialog(t))
        edit_btn.pack(side=tk.RIGHT, padx=5)
        
        # 删除按钮
        delete_btn = ttk.Button(actions_frame,
                              text="删除",
                              style="Glass.TButton",
                              command=lambda t=task: self.confirm_delete_task(t))
        delete_btn.pack(side=tk.RIGHT, padx=5)
    
    def get_category_name(self, category_id: str) -> str:
        """获取分类名称"""
        categories = {
            'work': '工作',
            'study': '学习',
            'life': '生活',
            'other': '其他'
        }
        return categories.get(category_id, '其他')
    
    def open_add_task_dialog(self) -> None:
        """打开添加任务对话框"""
        self.current_edit_id = None
        self.show_task_dialog("添加新任务")
    
    def open_edit_task_dialog(self, task: Dict[str, Any]) -> None:
        """打开编辑任务对话框"""
        self.current_edit_id = task['id']
        self.show_task_dialog("编辑任务", task)
    
    def show_task_dialog(self, title: str, task: Optional[Dict[str, Any]] = None) -> None:
        """显示任务编辑对话框"""
        # 创建对话框
        dialog = tk.Toplevel(self.root)
        dialog.title(title)
        dialog.geometry("500x400")
        dialog.transient(self.root)
        dialog.grab_set()
        
        # 设置对话框样式
        dialog.configure(bg=self.colors['glass_bg'])
        
        # 创建输入表单
        form_frame = ttk.Frame(dialog, style="Glass.TFrame", padding=20)
        form_frame.pack(fill=tk.BOTH, expand=True)
        
        # 任务标题
        ttk.Label(form_frame, text="任务标题:", style="Glass.TLabel").grid(row=0, column=0, sticky=tk.W, pady=5)
        title_var = tk.StringVar(value=task['title'] if task else "")
        title_entry = ttk.Entry(form_frame, textvariable=title_var, style="Glass.TEntry", width=40)
        title_entry.grid(row=0, column=1, sticky=tk.W, pady=5)
        
        # 任务描述
        ttk.Label(form_frame, text="任务描述:", style="Glass.TLabel").grid(row=1, column=0, sticky=tk.NW, pady=5)
        desc_var = tk.StringVar(value=task['description'] if task else "")
        desc_text = tk.Text(form_frame, height=5, width=40, bg=self.colors['glass_bg'], fg=self.colors['glass_fg'],
                          insertbackground=self.colors['glass_fg'], borderwidth=1, relief=tk.SUNKEN)
        desc_text.insert(tk.END, task['description'] if task else "")
        desc_text.grid(row=1, column=1, sticky=tk.W, pady=5)
        
        # 任务分类
        ttk.Label(form_frame, text="任务分类:", style="Glass.TLabel").grid(row=2, column=0, sticky=tk.W, pady=5)
        category_var = tk.StringVar(value=task['category'] if task else 'work')
        category_combo = ttk.Combobox(form_frame, textvariable=category_var, style="Glass.TCombobox", width=38)
        category_combo['values'] = ['work', 'study', 'life', 'other']
        category_combo.grid(row=2, column=1, sticky=tk.W, pady=5)
        
        # 优先级
        ttk.Label(form_frame, text="优先级:", style="Glass.TLabel").grid(row=3, column=0, sticky=tk.W, pady=5)
        priority_var = tk.StringVar(value=task['priority'] if task else 'medium')
        priority_combo = ttk.Combobox(form_frame, textvariable=priority_var, style="Glass.TCombobox", width=38)
        priority_combo['values'] = ['high', 'medium', 'low']
        priority_combo.grid(row=3, column=1, sticky=tk.W, pady=5)
        
        # 截止日期
        ttk.Label(form_frame, text="截止日期:", style="Glass.TLabel").grid(row=4, column=0, sticky=tk.W, pady=5)
        today = datetime.date.today()
        tomorrow = today + datetime.timedelta(days=1)
        date_var = tk.StringVar(value=task['dueDate'].split('T')[0] if task and task['dueDate'] else tomorrow.strftime("%Y-%m-%d"))
        date_entry = ttk.Entry(form_frame, textvariable=date_var, style="Glass.TEntry", width=40)
        date_entry.grid(row=4, column=1, sticky=tk.W, pady=5)
        
        # 按钮行
        btn_frame = ttk.Frame(dialog, style="Glass.TFrame", padding=10)
        btn_frame.pack(fill=tk.X)
        
        # 取消按钮
        cancel_btn = ttk.Button(btn_frame, text="取消", style="Glass.TButton", command=dialog.destroy)
        cancel_btn.pack(side=tk.RIGHT, padx=5)
        
        # 保存按钮
        save_btn = ttk.Button(btn_frame, text="保存", style="Glass.TButton", 
                            command=lambda: self.save_task(dialog, title_var.get(), desc_text.get("1.0", tk.END).strip(),
                                                          category_var.get(), priority_var.get(), date_var.get()))
        save_btn.pack(side=tk.RIGHT, padx=5)
        
        # 设置焦点
        title_entry.focus_set()
    
    def save_task(self, dialog: tk.Toplevel, title: str, description: str, category: str, 
                  priority: str, due_date: str) -> None:
        """保存任务"""
        if not title.strip():
            messagebox.showwarning("警告", "任务标题不能为空！")
            return
        
        task_data = {
            'title': title.strip(),
            'description': description.strip(),
            'category': category,
            'priority': priority,
            'dueDate': f"{due_date}T00:00:00Z" if due_date else None,
            'completed': False,
            'createdAt': datetime.datetime.now().isoformat()
        }
        
        if self.current_edit_id:
            # 编辑现有任务
            task_index = next((i for i, t in enumerate(self.tasks) if t['id'] == self.current_edit_id), None)
            if task_index is not None:
                task_data['id'] = self.current_edit_id
                task_data['createdAt'] = self.tasks[task_index]['createdAt']
                task_data['completed'] = self.tasks[task_index]['completed']
                self.tasks[task_index] = task_data
                messagebox.showinfo("成功", "任务已更新！")
        else:
            # 添加新任务
            task_data['id'] = str(datetime.datetime.now().timestamp())
            self.tasks.append(task_data)
            messagebox.showinfo("成功", "任务已添加！")
        
        # 保存数据
        self.save_data()
        
        # 刷新任务列表
        self.refresh_task_list()
        
        # 关闭对话框
        dialog.destroy()
    
    def confirm_delete_task(self, task: Dict[str, Any]) -> None:
        """确认删除任务"""
        if messagebox.askyesno("确认删除", f"确定要删除任务 '{task['title']}' 吗？此操作无法撤销。"):
            self.delete_task(task['id'])
    
    def delete_task(self, task_id: str) -> None:
        """删除任务"""
        self.tasks = [task for task in self.tasks if task['id'] != task_id]
        
        # 保存数据
        self.save_data()
        
        # 刷新任务列表
        self.refresh_task_list()
        
        messagebox.showinfo("成功", "任务已删除！")
    
    def toggle_task_completion(self, task_id: str) -> None:
        """切换任务完成状态"""
        task_index = next((i for i, t in enumerate(self.tasks) if t['id'] == task_id), None)
        if task_index is not None:
            task = self.tasks[task_index]
            was_completed = task['completed']
            task['completed'] = not was_completed
            
            # 如果任务从未完成变为已完成，显示庆祝效果
            if task['completed'] and not was_completed:
                self.show_completion_celebration()
                messagebox.showinfo("恭喜！", "任务完成！")
            
            # 保存数据
            self.save_data()
            
            # 刷新任务列表
            self.refresh_task_list()
    
    def show_completion_celebration(self) -> None:
        """显示任务完成庆祝效果"""
        # 创建庆祝窗口
        celebration_window = tk.Toplevel(self.root)
        celebration_window.overrideredirect(True)  # 无边框窗口
        celebration_window.attributes('-topmost', True)  # 置顶
        celebration_window.geometry("200x200+{}+{}".format(
            self.root.winfo_x() + self.root.winfo_width() // 2 - 100,
            self.root.winfo_y() + self.root.winfo_height() // 2 - 100
        ))
        
        # 创建画布
        canvas = tk.Canvas(celebration_window, width=200, height=200, bg=self.colors['dark'])
        canvas.pack()
        
        # 创建粒子
        particles = []
        for _ in range(50):
            x = 100
            y = 100
            size = random.randint(3, 8)
            color = random.choice(['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'])
            angle = random.uniform(0, 2 * math.pi)
            speed = random.uniform(2, 5)
            vx = math.cos(angle) * speed
            vy = math.sin(angle) * speed
            
            particle = canvas.create_oval(x-size, y-size, x+size, y+size, fill=color, outline='')
            particles.append((particle, vx, vy, size))
        
        # 动画函数
        def animate():
            for i, (particle, vx, vy, size) in enumerate(particles):
                canvas.move(particle, vx, vy)
                x1, y1, x2, y2 = canvas.coords(particle)
                
                # 淡出效果
                if x1 < 0 or x1 > 200 or y1 < 0 or y1 > 200:
                    canvas.delete(particle)
                    particles[i] = None
                else:
                    # 逐渐减小粒子大小
                    new_size = max(0, size - 0.1)
                    if new_size > 0:
                        canvas.coords(particle, x1 + (size - new_size), y1 + (size - new_size),
                                    x2 - (size - new_size), y2 - (size - new_size))
                        particles[i] = (particle, vx, vy, new_size)
                    else:
                        canvas.delete(particle)
                        particles[i] = None
            
            # 移除已删除的粒子
            particles[:] = [p for p in particles if p is not None]
            
            if particles:
                celebration_window.after(30, animate)
            else:
                celebration_window.destroy()
        
        # 开始动画
        animate()
    
    def update_stats(self) -> None:
        """更新统计信息"""
        total = len(self.tasks)
        completed = sum(1 for task in self.tasks if task['completed'])
        pending = total - completed
        
        self.total_label.config(text=str(total))
        self.completed_label.config(text=str(completed))
        self.pending_label.config(text=str(pending))
    
    def load_data(self) -> None:
        """从文件加载数据"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    self.tasks = json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                print(f"加载数据失败: {e}")
                self.tasks = []
    
    def save_data(self) -> None:
        """保存数据到文件"""
        try:
            with open(self.data_file, 'w', encoding='utf-8') as f:
                json.dump(self.tasks, f, ensure_ascii=False, indent=2)
        except IOError as e:
            print(f"保存数据失败: {e}")
            messagebox.showerror("错误", "保存数据失败！")
    
    def add_sample_tasks(self) -> None:
        """添加示例任务"""
        today = datetime.date.today()
        tomorrow = today + datetime.timedelta(days=1)
        day_after_tomorrow = today + datetime.timedelta(days=2)
        
        sample_tasks = [
            {
                'id': '1',
                'title': '完成项目报告',
                'description': '准备下周会议的项目进度报告',
                'category': 'work',
                'priority': 'high',
                'dueDate': f"{tomorrow.isoformat()}T00:00:00Z",
                'completed': False,
                'createdAt': datetime.datetime.now().isoformat()
            },
            {
                'id': '2',
                'title': '学习Python高级特性',
                'description': '阅读关于装饰器和生成器的教程',
                'category': 'study',
                'priority': 'medium',
                'dueDate': f"{day_after_tomorrow.isoformat()}T00:00:00Z",
                'completed': False,
                'createdAt': datetime.datetime.now().isoformat()
            },
            {
                'id': '3',
                'title': '购买生日礼物',
                'description': '为朋友准备生日礼物',
                'category': 'life',
                'priority': 'medium',
                'dueDate': f"{(today + datetime.timedelta(days=3)).isoformat()}T00:00:00Z",
                'completed': False,
                'createdAt': datetime.datetime.now().isoformat()
            }
        ]
        
        self.tasks = sample_tasks
        self.save_data()
        self.refresh_task_list()

if __name__ == "__main__":
    root = tk.Tk()
    app = GlassTodoApp(root)
    root.mainloop()