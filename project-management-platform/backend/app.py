from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import hashlib
import jwt
import datetime

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)

# 配置
app.config['SECRET_KEY'] = 'your-secret-key'

# 数据文件路径
USERS_FILE = 'users.json'
PROJECTS_FILE = 'projects.json'
TASKS_FILE = 'tasks.json'
TEAMS_FILE = 'teams.json'

# 初始化数据文件
def init_data_files():
    if not os.path.exists(USERS_FILE):
        # 创建默认管理员账号
        admin_user = {
            'id': '1',
            'email': 'admin@example.com',
            'password': hashlib.md5('admin123'.encode()).hexdigest(),
            'role': 'admin',
            'status': 'approved'
        }
        with open(USERS_FILE, 'w') as f:
            json.dump([admin_user], f, indent=2)
    
    if not os.path.exists(PROJECTS_FILE):
        with open(PROJECTS_FILE, 'w') as f:
            json.dump([], f, indent=2)
    
    if not os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, 'w') as f:
            json.dump([], f, indent=2)
    
    if not os.path.exists(TEAMS_FILE):
        with open(TEAMS_FILE, 'w') as f:
            json.dump([], f, indent=2)

# 数据缓存
_data_cache = {}

# 加载数据
def load_data(file_path):
    # 检查缓存
    if file_path in _data_cache:
        return _data_cache[file_path]
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # 更新缓存
            _data_cache[file_path] = data
            return data
    except Exception as e:
        print(f"Error loading data from {file_path}: {e}")
        return []

# 保存数据
def save_data(data, file_path):
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        # 更新缓存
        _data_cache[file_path] = data
    except Exception as e:
        print(f"Error saving data to {file_path}: {e}")

# JWT认证装饰器
def token_required(f):
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data['user']
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    # 设置装饰器返回的函数名与原始函数名相同，避免路由冲突
    decorated.__name__ = f.__name__
    return decorated

# API: 用户注册
@app.route('/api/auth/register', methods=['POST'])
def register():
    user_data = request.json
    users = load_data(USERS_FILE)
    
    # 检查邮箱是否已存在
    existing_user = next((u for u in users if u['email'] == user_data['email']), None)
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 400
    
    # 生成用户ID
    user_id = str(len(users) + 1)
    user = {
        'id': user_id,
        'email': user_data['email'],
        'password': hashlib.md5(user_data['password'].encode()).hexdigest(),
        'role': 'user',
        'status': 'pending'
    }
    
    users.append(user)
    save_data(users, USERS_FILE)
    return jsonify({'message': 'Registration successful, waiting for approval'}), 201

# API: 用户登录
@app.route('/api/auth/login', methods=['POST'])
def login():
    login_data = request.json
    users = load_data(USERS_FILE)
    
    # 查找用户
    user = next((u for u in users if u['email'] == login_data['email']), None)
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # 检查密码
    if user['password'] != hashlib.md5(login_data['password'].encode()).hexdigest():
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # 检查用户状态
    if user['status'] != 'approved':
        return jsonify({'error': 'Account not approved yet'}), 403
    
    # 生成JWT token
    token = jwt.encode({
        'user': user,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'])
    
    return jsonify({'token': token, 'user': user}), 200

# API: 获取所有项目
@app.route('/api/projects', methods=['GET'])
@token_required
def get_projects(current_user):
    projects = load_data(PROJECTS_FILE)
    return jsonify(projects)

# API: 创建项目
@app.route('/api/projects', methods=['POST'])
@token_required
def create_project(current_user):
    project_data = request.json
    projects = load_data(PROJECTS_FILE)
    
    # 生成项目ID - 确保唯一且递增
    if projects:
        max_id = max(int(p['id']) for p in projects)
        project_id = str(max_id + 1)
    else:
        project_id = '1'
    
    project = {
        'id': project_id,
        'name': project_data['name'],
        'description': project_data.get('description', ''),
        'owner': current_user['email'],
        'status': 'active',
        'created_at': datetime.datetime.utcnow().isoformat(),
        'updated_at': datetime.datetime.utcnow().isoformat()
    }
    
    projects.append(project)
    save_data(projects, PROJECTS_FILE)
    return jsonify(project), 201

# API: 获取项目详情
@app.route('/api/projects/<project_id>', methods=['GET'])
@token_required
def get_project(current_user, project_id):
    projects = load_data(PROJECTS_FILE)
    project = next((p for p in projects if p['id'] == project_id), None)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify(project)

# API: 更新项目
@app.route('/api/projects/<project_id>', methods=['PUT'])
@token_required
def update_project(current_user, project_id):
    project_data = request.json
    projects = load_data(PROJECTS_FILE)
    
    project_index = next((i for i, p in enumerate(projects) if p['id'] == project_id), None)
    if project_index is None:
        return jsonify({'error': 'Project not found'}), 404
    
    projects[project_index].update({
        'name': project_data.get('name', projects[project_index]['name']),
        'description': project_data.get('description', projects[project_index]['description']),
        'status': project_data.get('status', projects[project_index]['status']),
        'updated_at': datetime.datetime.utcnow().isoformat()
    })
    
    save_data(projects, PROJECTS_FILE)
    return jsonify(projects[project_index])

# API: 删除项目
@app.route('/api/projects/<project_id>', methods=['DELETE'])
@token_required
def delete_project(current_user, project_id):
    projects = load_data(PROJECTS_FILE)
    
    project_index = next((i for i, p in enumerate(projects) if p['id'] == project_id), None)
    if project_index is None:
        return jsonify({'error': 'Project not found'}), 404
    
    projects.pop(project_index)
    save_data(projects, PROJECTS_FILE)
    return jsonify({'message': 'Project deleted successfully'})

# API: 获取所有任务
@app.route('/api/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = load_data(TASKS_FILE)
    return jsonify(tasks)

# API: 创建任务
@app.route('/api/tasks', methods=['POST'])
@token_required
def create_task(current_user):
    task_data = request.json
    tasks = load_data(TASKS_FILE)
    
    # 生成任务ID
    task_id = str(len(tasks) + 1)
    task = {
        'id': task_id,
        'project_id': task_data['project_id'],
        'title': task_data['title'],
        'description': task_data.get('description', ''),
        'status': 'todo',
        'priority': task_data.get('priority', 'medium'),
        'assignee': task_data.get('assignee', ''),
        'due_date': task_data.get('due_date', ''),
        'created_at': datetime.datetime.utcnow().isoformat(),
        'updated_at': datetime.datetime.utcnow().isoformat()
    }
    
    tasks.append(task)
    save_data(tasks, TASKS_FILE)
    return jsonify(task), 201

# API: 获取任务详情
@app.route('/api/tasks/<task_id>', methods=['GET'])
@token_required
def get_task(current_user, task_id):
    tasks = load_data(TASKS_FILE)
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    return jsonify(task)

# API: 更新任务
@app.route('/api/tasks/<task_id>', methods=['PUT'])
@token_required
def update_task(current_user, task_id):
    task_data = request.json
    tasks = load_data(TASKS_FILE)
    
    task_index = next((i for i, t in enumerate(tasks) if t['id'] == task_id), None)
    if task_index is None:
        return jsonify({'error': 'Task not found'}), 404
    
    tasks[task_index].update({
        'title': task_data.get('title', tasks[task_index]['title']),
        'description': task_data.get('description', tasks[task_index]['description']),
        'status': task_data.get('status', tasks[task_index]['status']),
        'priority': task_data.get('priority', tasks[task_index]['priority']),
        'assignee': task_data.get('assignee', tasks[task_index]['assignee']),
        'due_date': task_data.get('due_date', tasks[task_index]['due_date']),
        'updated_at': datetime.datetime.utcnow().isoformat()
    })
    
    save_data(tasks, TASKS_FILE)
    return jsonify(tasks[task_index])

# API: 删除任务
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user, task_id):
    tasks = load_data(TASKS_FILE)
    
    task_index = next((i for i, t in enumerate(tasks) if t['id'] == task_id), None)
    if task_index is None:
        return jsonify({'error': 'Task not found'}), 404
    
    tasks.pop(task_index)
    save_data(tasks, TASKS_FILE)
    return jsonify({'message': 'Task deleted successfully'})

# API: 获取所有团队
@app.route('/api/teams', methods=['GET'])
@token_required
def get_teams(current_user):
    teams = load_data(TEAMS_FILE)
    return jsonify(teams)

# API: 创建团队
@app.route('/api/teams', methods=['POST'])
@token_required
def create_team(current_user):
    team_data = request.json
    teams = load_data(TEAMS_FILE)
    
    # 生成团队ID
    team_id = str(len(teams) + 1)
    team = {
        'id': team_id,
        'name': team_data['name'],
        'description': team_data.get('description', ''),
        'members': team_data.get('members', []),
        'created_at': datetime.datetime.utcnow().isoformat(),
        'updated_at': datetime.datetime.utcnow().isoformat()
    }
    
    teams.append(team)
    save_data(teams, TEAMS_FILE)
    return jsonify(team), 201

# API: 获取团队详情
@app.route('/api/teams/<team_id>', methods=['GET'])
@token_required
def get_team(current_user, team_id):
    teams = load_data(TEAMS_FILE)
    team = next((t for t in teams if t['id'] == team_id), None)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    return jsonify(team)

# API: 更新团队
@app.route('/api/teams/<team_id>', methods=['PUT'])
@token_required
def update_team(current_user, team_id):
    team_data = request.json
    teams = load_data(TEAMS_FILE)
    
    team_index = next((i for i, t in enumerate(teams) if t['id'] == team_id), None)
    if team_index is None:
        return jsonify({'error': 'Team not found'}), 404
    
    teams[team_index].update({
        'name': team_data.get('name', teams[team_index]['name']),
        'description': team_data.get('description', teams[team_index]['description']),
        'members': team_data.get('members', teams[team_index]['members']),
        'updated_at': datetime.datetime.utcnow().isoformat()
    })
    
    save_data(teams, TEAMS_FILE)
    return jsonify(teams[team_index])

# API: 删除团队
@app.route('/api/teams/<team_id>', methods=['DELETE'])
@token_required
def delete_team(current_user, team_id):
    teams = load_data(TEAMS_FILE)
    
    team_index = next((i for i, t in enumerate(teams) if t['id'] == team_id), None)
    if team_index is None:
        return jsonify({'error': 'Team not found'}), 404
    
    teams.pop(team_index)
    save_data(teams, TEAMS_FILE)
    return jsonify({'message': 'Team deleted successfully'})

# 根路径
@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

# 静态文件路由
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../frontend', path)

if __name__ == '__main__':
    init_data_files()
    app.run(debug=True, host='0.0.0.0', port=5000)
