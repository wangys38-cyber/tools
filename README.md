# Glass Todo - Python 待办事项管理应用

一个使用 Python 和 tkinter 创建的炫酷待办事项管理应用，具有毛玻璃视觉效果和完整的任务管理功能。

## 功能特点

- ✅ **毛玻璃视觉效果**：现代化的界面设计
- ✅ **完整的任务管理**：添加、编辑、删除和标记完成任务
- ✅ **任务分类**：工作、学习、生活、其他四个分类
- ✅ **优先级设置**：高、中、低三级优先级
- ✅ **截止日期**：支持设置任务截止日期，自动显示逾期提醒
- ✅ **数据持久化**：任务数据自动保存到本地文件
- ✅ **任务完成动画**：完成任务时显示炫酷的粒子爆炸效果
- ✅ **统计面板**：实时显示总任务、已完成和待完成数量

## 系统要求

- Python 3.6 或更高版本
- tkinter 库（大多数 Python 安装已包含）
- 可选：matplotlib 库（用于更好的中文字体支持）

## 安装和运行

### 方法一：直接运行 Python 文件

1. 确保已安装 Python 3.6 或更高版本
2. 下载 `todo_app.py` 文件
3. 在命令行中运行：

```bash
python todo_app.py
```

或者在支持 Python 的 IDE 中直接运行该文件。

### 方法二：创建可执行文件（Windows）

使用 PyInstaller 将 Python 脚本打包成可执行文件：

1. 安装 PyInstaller：

```bash
pip install pyinstaller
```

2. 打包应用：

```bash
pyinstaller --onefile --windowed --icon=todo.ico todo_app.py
```

3. 在 `dist` 文件夹中找到生成的可执行文件

## 使用说明

### 基本操作

1. **添加任务**：点击右下角的 `+` 按钮
2. **编辑任务**：点击任务卡片上的"编辑"按钮
3. **删除任务**：点击任务卡片上的"删除"按钮
4. **标记完成**：勾选任务卡片左侧的复选框

### 分类筛选

点击顶部的分类按钮（全部、工作、学习、生活、其他）可以筛选显示特定分类的任务。

### 数据存储

任务数据自动保存到用户主目录下的 `.glass_todo_data.json` 文件中。

## 自定义

### 修改主题色

在 `todo_app.py` 文件中修改 `self.colors` 字典来自定义颜色主题：

```python
self.colors = {
    'primary': '#8B5CF6',    # 主色调
    'secondary': '#3B82F6',  # 次要色调
    'dark': '#0F172A',       # 背景色
    'light': '#F8FAFC',      # 文字颜色
    # ... 其他颜色
}
```

### 添加自定义分类

在 `create_category_nav` 方法中修改 `categories` 列表来添加自定义分类：

```python
categories = [
    ('all', '全部', '📋'),
    ('work', '工作', '💼'),
    ('study', '学习', '📚'),
    ('life', '生活', '❤️'),
    ('custom', '自定义', '⭐')  # 添加自定义分类
]
```

同时需要在 `get_category_name` 方法中添加对应的中文名称：

```python
categories = {
    'work': '工作',
    'study': '学习',
    'life': '生活',
    'other': '其他',
    'custom': '自定义'  # 添加对应的中文名称
}
```

## 故障排除

### 中文字体显示问题

如果中文显示为方块或乱码，可以尝试：

1. 安装 matplotlib 库：

```bash
pip install matplotlib
```

2. 或者在代码中手动设置中文字体：

```python
# 在 __init__ 方法中添加
self.root.option_add("*Font", "Microsoft YaHei 10")
```

### 任务完成动画不显示

确保您的系统支持 tkinter 的 Canvas 动画功能。如果动画效果不理想，可以在 `toggle_task_completion` 方法中注释掉 `self.show_completion_celebration()` 行。

## 许可证

本项目采用 MIT 许可证。

## 贡献

欢迎提交问题报告和功能建议！

## 更新日志

### v1.0.0 (2024-01-01)

- 初始版本发布
- 实现基本的任务管理功能
- 添加毛玻璃视觉效果
- 实现任务完成动画