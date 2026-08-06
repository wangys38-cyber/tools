from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import hashlib
import jwt
import datetime
from functools import wraps

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)  # 允许跨域请求
app.config['SECRET_KEY'] = 'your-secret-key'  # 用于JWT签名的密钥

# 验证JWT token的装饰器
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # 移除Bearer前缀
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# 根路径返回index.html
@app.route('/')
def index():
    return app.send_static_file('index.html')

# 处理其他静态文件请求
@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

# 数据文件路径
TESTCASES_FILE = 'testcases.json'
MODULES_FILE = 'modules.json'
TEST_PROGRESS_FILE = 'test_progress.json'
USERS_FILE = 'users.json'
PROJECTS_FILE = 'projects.json'
TEST_RUNS_FILE = 'test_runs.json'
TESTCASE_LIBRARY_FILE = 'testcase_library.json'

# 初始化数据文件
if not os.path.exists(TESTCASES_FILE):
    with open(TESTCASES_FILE, 'w') as f:
        json.dump([], f)

if not os.path.exists(MODULES_FILE):
    with open(MODULES_FILE, 'w') as f:
        json.dump([], f)

if not os.path.exists(TEST_PROGRESS_FILE):
    with open(TEST_PROGRESS_FILE, 'w') as f:
        json.dump({}, f)

if not os.path.exists(USERS_FILE):
    # 创建默认管理员用户
    default_users = [
        {
            'id': '1',
            'email': 'wangys38@lenovo.com',
            'password': hashlib.md5('*Wys#==！！'.encode()).hexdigest(),  # 密码加密存储
            'role': 'admin',  # admin, user
            'status': 'approved'  # pending, approved, rejected
        }
    ]
    with open(USERS_FILE, 'w') as f:
        json.dump(default_users, f)

if not os.path.exists(PROJECTS_FILE):
    with open(PROJECTS_FILE, 'w') as f:
        json.dump([], f)

if not os.path.exists(TEST_RUNS_FILE):
    with open(TEST_RUNS_FILE, 'w') as f:
        json.dump([], f)

if not os.path.exists(TESTCASE_LIBRARY_FILE):
    with open(TESTCASE_LIBRARY_FILE, 'w') as f:
        json.dump([], f)

# 加载数据
def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 保存数据
def save_data(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# API: 获取所有模块
@app.route('/api/modules', methods=['GET'])
@token_required
def get_modules(current_user):
    modules = load_data(MODULES_FILE)
    return jsonify(modules)

# API: 创建模块
@app.route('/api/modules', methods=['POST'])
@token_required
def create_module(current_user):
    module_data = request.json
    modules = load_data(MODULES_FILE)
    
    # 生成模块ID
    module_id = str(len(modules) + 1)
    module = {
        'id': module_id,
        'name': module_data['name'],
        'description': module_data.get('description', '')
    }
    
    modules.append(module)
    save_data(modules, MODULES_FILE)
    return jsonify(module), 201

# API: 获取模块详情
@app.route('/api/modules/<module_id>', methods=['GET'])
@token_required
def get_module(current_user, module_id):
    modules = load_data(MODULES_FILE)
    module = next((m for m in modules if m['id'] == module_id), None)
    if not module:
        return jsonify({'error': 'Module not found'}), 404
    return jsonify(module)

# API: 获取模块的用例
@app.route('/api/modules/<module_id>/testcases', methods=['GET'])
@token_required
def get_module_testcases(current_user, module_id):
    testcases = load_data(TESTCASES_FILE)
    module_testcases = [tc for tc in testcases if tc['module_id'] == module_id]
    return jsonify(module_testcases)

# API: 编辑模块
@app.route('/api/modules/<module_id>', methods=['PUT'])
@token_required
def update_module(current_user, module_id):
    module_data = request.json
    modules = load_data(MODULES_FILE)
    
    module_index = next((i for i, m in enumerate(modules) if m['id'] == module_id), None)
    if module_index is None:
        return jsonify({'error': 'Module not found'}), 404
    
    modules[module_index].update({
        'name': module_data.get('name', modules[module_index]['name']),
        'description': module_data.get('description', modules[module_index].get('description', ''))
    })
    
    save_data(modules, MODULES_FILE)
    return jsonify(modules[module_index])

# API: 删除模块
@app.route('/api/modules/<module_id>', methods=['DELETE'])
@token_required
def delete_module(current_user, module_id):
    # 只有管理员可以删除模块
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    
    modules = load_data(MODULES_FILE)
    modules = [m for m in modules if m['id'] != module_id]
    save_data(modules, MODULES_FILE)
    return jsonify({'message': 'Module deleted successfully'})

# API: 获取用例列表
@app.route('/api/testcases', methods=['GET'])
@token_required
def get_testcases(current_user):
    testcases = load_data(TESTCASES_FILE)
    return jsonify(testcases)

# API: 创建用例
@app.route('/api/testcases', methods=['POST'])
@token_required
def create_testcase(current_user):
    testcase_data = request.json
    testcases = load_data(TESTCASES_FILE)
    
    # 生成用例ID
    testcase_id = str(len(testcases) + 1)
    testcase = {
        'id': testcase_id,
        'module_id': testcase_data['module_id'],
        'title': testcase_data['title'],
        'description': testcase_data.get('description', ''),
        'steps': testcase_data.get('steps', []),
        'expected_result': testcase_data.get('expected_result', ''),
        'status': 'pending',  # pending, in_progress, passed, failed
        'assignee': testcase_data.get('assignee', '')
    }
    
    testcases.append(testcase)
    save_data(testcases, TESTCASES_FILE)
    return jsonify(testcase), 201

# API: 获取用例详情
@app.route('/api/testcases/<testcase_id>', methods=['GET'])
@token_required
def get_testcase(current_user, testcase_id):
    testcases = load_data(TESTCASES_FILE)
    testcase = next((tc for tc in testcases if tc['id'] == testcase_id), None)
    if not testcase:
        return jsonify({'error': 'Testcase not found'}), 404
    return jsonify(testcase)

# API: 更新用例状态
@app.route('/api/testcases/<testcase_id>/status', methods=['PUT'])
@token_required
def update_testcase_status(current_user, testcase_id):
    status_data = request.json
    testcases = load_data(TESTCASES_FILE)
    
    testcase_index = next((i for i, tc in enumerate(testcases) if tc['id'] == testcase_id), None)
    if testcase_index is None:
        return jsonify({'error': 'Testcase not found'}), 404
    
    testcases[testcase_index]['status'] = status_data['status']
    save_data(testcases, TESTCASES_FILE)
    
    # 更新测试进度
    update_test_progress()
    
    return jsonify(testcases[testcase_index])

# API: 编辑用例
@app.route('/api/testcases/<testcase_id>', methods=['PUT'])
@token_required
def update_testcase(current_user, testcase_id):
    testcase_data = request.json
    testcases = load_data(TESTCASES_FILE)
    
    testcase_index = next((i for i, tc in enumerate(testcases) if tc['id'] == testcase_id), None)
    if testcase_index is None:
        return jsonify({'error': 'Testcase not found'}), 404
    
    testcases[testcase_index].update({
        'module_id': testcase_data.get('module_id', testcases[testcase_index]['module_id']),
        'title': testcase_data.get('title', testcases[testcase_index]['title']),
        'description': testcase_data.get('description', testcases[testcase_index]['description']),
        'steps': testcase_data.get('steps', testcases[testcase_index]['steps']),
        'expected_result': testcase_data.get('expected_result', testcases[testcase_index]['expected_result']),
        'assignee': testcase_data.get('assignee', testcases[testcase_index].get('assignee', '')),
        'project_id': testcase_data.get('project_id', testcases[testcase_index].get('project_id', '')),
        'firmware_version': testcase_data.get('firmware_version', testcases[testcase_index].get('firmware_version', '')),
        'app_version': testcase_data.get('app_version', testcases[testcase_index].get('app_version', ''))
    })
    
    save_data(testcases, TESTCASES_FILE)
    return jsonify(testcases[testcase_index])

# API: 下发用例
@app.route('/api/testcases/assign', methods=['POST'])
@token_required
def assign_testcases(current_user):
    # 只有管理员可以下发用例
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    
    assign_data = request.json
    testcase_ids = assign_data['testcase_ids']
    assignee = assign_data['assignee']
    project_id = assign_data.get('project_id')
    firmware_version = assign_data.get('firmware_version', '')
    app_version = assign_data.get('app_version', '')
    
    testcases = load_data(TESTCASES_FILE)
    
    for testcase_id in testcase_ids:
        testcase_index = next((i for i, tc in enumerate(testcases) if tc['id'] == testcase_id), None)
        if testcase_index is not None:
            testcases[testcase_index]['assignee'] = assignee
            testcases[testcase_index]['status'] = 'in_progress'
            testcases[testcase_index]['project_id'] = project_id
            testcases[testcase_index]['firmware_version'] = firmware_version
            testcases[testcase_index]['app_version'] = app_version
    
    save_data(testcases, TESTCASES_FILE)
    
    # 记录测试运行
    test_runs = load_data(TEST_RUNS_FILE)
    test_run_id = str(len(test_runs) + 1)
    test_run = {
        'id': test_run_id,
        'project_id': project_id,
        'testcase_ids': testcase_ids,
        'assignee': assignee,
        'firmware_version': firmware_version,
        'app_version': app_version,
        'created_at': datetime.datetime.now().isoformat(),
        'status': 'in_progress'
    }
    test_runs.append(test_run)
    save_data(test_runs, TEST_RUNS_FILE)
    
    return jsonify({'message': 'Testcases assigned successfully'})

# API: 获取测试进度
@app.route('/api/test-progress', methods=['GET'])
@token_required
def get_test_progress(current_user):
    progress = load_data(TEST_PROGRESS_FILE)
    
    # 测试者只能看到自己的测试进度，管理员可以看到所有测试进度
    if current_user['role'] != 'admin':
        # 这里简化处理，只返回总体进度和已下发的进度
        # 实际项目中可能需要根据用户角色过滤更详细的进度数据
        filtered_progress = {
            'overall': progress.get('overall', {}),
            'assigned': progress.get('assigned', {})
        }
        return jsonify(filtered_progress)
    
    return jsonify(progress)

# 更新测试进度
def update_test_progress():
    testcases = load_data(TESTCASES_FILE)
    modules = load_data(MODULES_FILE)
    
    progress = {}
    
    # 按模块统计
    for module in modules:
        module_testcases = [tc for tc in testcases if tc['module_id'] == module['id']]
        total = len(module_testcases)
        passed = len([tc for tc in module_testcases if tc['status'] == 'passed'])
        failed = len([tc for tc in module_testcases if tc['status'] == 'failed'])
        in_progress = len([tc for tc in module_testcases if tc['status'] == 'in_progress'])
        
        progress[module['id']] = {
            'module_name': module['name'],
            'total': total,
            'passed': passed,
            'failed': failed,
            'in_progress': in_progress,
            'pending': total - passed - failed - in_progress
        }
    
    # 总体统计
    total_testcases = len(testcases)
    total_passed = len([tc for tc in testcases if tc['status'] == 'passed'])
    total_failed = len([tc for tc in testcases if tc['status'] == 'failed'])
    total_in_progress = len([tc for tc in testcases if tc['status'] == 'in_progress'])
    
    progress['overall'] = {
        'total': total_testcases,
        'passed': total_passed,
        'failed': total_failed,
        'in_progress': total_in_progress,
        'pending': total_testcases - total_passed - total_failed - total_in_progress
    }
    
    # 已下发用例统计
    assigned_testcases = [tc for tc in testcases if tc.get('assignee')]
    assigned_total = len(assigned_testcases)
    assigned_passed = len([tc for tc in assigned_testcases if tc['status'] == 'passed'])
    assigned_failed = len([tc for tc in assigned_testcases if tc['status'] == 'failed'])
    assigned_in_progress = len([tc for tc in assigned_testcases if tc['status'] == 'in_progress'])
    
    progress['assigned'] = {
        'total': assigned_total,
        'passed': assigned_passed,
        'failed': assigned_failed,
        'in_progress': assigned_in_progress,
        'pending': assigned_total - assigned_passed - assigned_failed - assigned_in_progress
    }
    
    save_data(progress, TEST_PROGRESS_FILE)

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
        'password': hashlib.md5(user_data['password'].encode()).hexdigest(),  # 密码加密存储
        'role': 'user',  # 默认为普通用户
        'status': 'pending'  # 默认为待审批状态
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
    token = jwt.encode(
        {
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # 24小时过期
        },
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'role': user['role']
        }
    })

# API: 获取待审批用户列表
@app.route('/api/auth/pending-users', methods=['GET'])
def get_pending_users():
    users = load_data(USERS_FILE)
    pending_users = [u for u in users if u['status'] == 'pending']
    # 移除密码字段
    for user in pending_users:
        user.pop('password', None)
    return jsonify(pending_users)

# API: 审批用户
@app.route('/api/auth/users/<user_id>/approve', methods=['PUT'])
def approve_user(user_id):
    users = load_data(USERS_FILE)
    
    user_index = next((i for i, u in enumerate(users) if u['id'] == user_id), None)
    if user_index is None:
        return jsonify({'error': 'User not found'}), 404
    
    users[user_index]['status'] = 'approved'
    save_data(users, USERS_FILE)
    
    # 移除密码字段
    users[user_index].pop('password', None)
    return jsonify(users[user_index])

# API: 拒绝用户
@app.route('/api/auth/users/<user_id>/reject', methods=['PUT'])
def reject_user(user_id):
    users = load_data(USERS_FILE)
    
    user_index = next((i for i, u in enumerate(users) if u['id'] == user_id), None)
    if user_index is None:
        return jsonify({'error': 'User not found'}), 404
    
    users[user_index]['status'] = 'rejected'
    save_data(users, USERS_FILE)
    
    # 移除密码字段
    users[user_index].pop('password', None)
    return jsonify(users[user_index])

# API: 获取所有项目
@app.route('/api/projects', methods=['GET'])
@token_required
def get_projects(current_user):
    # 只有管理员可以访问项目管理
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    
    projects = load_data(PROJECTS_FILE)
    return jsonify(projects)

# API: 创建项目
@app.route('/api/projects', methods=['POST'])
@token_required
def create_project(current_user):
    # 只有管理员可以创建项目
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    
    project_data = request.json
    projects = load_data(PROJECTS_FILE)
    
    # 生成项目ID
    project_id = str(len(projects) + 1)
    project = {
        'id': project_id,
        'name': project_data['name'],
        'description': project_data.get('description', ''),
        'created_at': datetime.datetime.now().isoformat()
    }
    
    projects.append(project)
    save_data(projects, PROJECTS_FILE)
    return jsonify(project), 201

# API: 获取项目详情
@app.route('/api/projects/<project_id>', methods=['GET'])
@token_required
def get_project(current_user, project_id):
    # 只有管理员可以访问项目详情
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    
    projects = load_data(PROJECTS_FILE)
    project = next((p for p in projects if p['id'] == project_id), None)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify(project)

# API: 获取项目的测试运行
@app.route('/api/projects/<project_id>/test-runs', methods=['GET'])
@token_required
def get_project_test_runs(current_user, project_id):
    # 只有管理员可以访问项目的测试运行
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    
    test_runs = load_data(TEST_RUNS_FILE)
    project_test_runs = [tr for tr in test_runs if tr['project_id'] == project_id]
    return jsonify(project_test_runs)

# API: 编辑项目
@app.route('/api/projects/<project_id>', methods=['PUT'])
@token_required
def update_project(current_user, project_id):
    # 只有管理员可以编辑项目
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    
    project_data = request.json
    projects = load_data(PROJECTS_FILE)
    
    project_index = next((i for i, p in enumerate(projects) if p['id'] == project_id), None)
    if project_index is None:
        return jsonify({'error': 'Project not found'}), 404
    
    projects[project_index].update({
        'name': project_data.get('name', projects[project_index]['name']),
        'description': project_data.get('description', projects[project_index].get('description', ''))
    })
    
    save_data(projects, PROJECTS_FILE)
    return jsonify(projects[project_index])

# API: 删除项目
@app.route('/api/projects/<project_id>', methods=['DELETE'])
@token_required
def delete_project(current_user, project_id):
    # 只有管理员可以删除项目
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    
    projects = load_data(PROJECTS_FILE)
    projects = [p for p in projects if p['id'] != project_id]
    save_data(projects, PROJECTS_FILE)
    return jsonify({'message': 'Project deleted successfully'})

# API: 获取所有测试运行
@app.route('/api/test-runs', methods=['GET'])
@token_required
def get_test_runs(current_user):
    # 只有管理员可以访问测试运行
    if current_user['role'] != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    
    test_runs = load_data(TEST_RUNS_FILE)
    return jsonify(test_runs)

# API: 获取用例库
@app.route('/api/testcase-library', methods=['GET'])
@token_required
def get_testcase_library(current_user):
    testcase_library = load_data(TESTCASE_LIBRARY_FILE)
    return jsonify(testcase_library)

# API: 创建用例库
@app.route('/api/testcase-library', methods=['POST'])
@token_required
def create_testcase_library(current_user):
    library_data = request.json
    testcase_library = load_data(TESTCASE_LIBRARY_FILE)
    
    # 生成用例库ID
    library_id = str(len(testcase_library) + 1)
    library = {
        'id': library_id,
        'module_id': library_data['module_id'],
        'title': library_data['title'],
        'description': library_data.get('description', ''),
        'steps': library_data.get('steps', []),
        'expected_result': library_data.get('expected_result', '')
    }
    
    testcase_library.append(library)
    save_data(testcase_library, TESTCASE_LIBRARY_FILE)
    return jsonify(library), 201

# API: 获取用例库详情
@app.route('/api/testcase-library/<library_id>', methods=['GET'])
@token_required
def get_testcase_library_detail(current_user, library_id):
    testcase_library = load_data(TESTCASE_LIBRARY_FILE)
    library = next((l for l in testcase_library if l['id'] == library_id), None)
    if not library:
        return jsonify({'error': 'Testcase library not found'}), 404
    return jsonify(library)

# API: 更新用例库
@app.route('/api/testcase-library/<library_id>', methods=['PUT'])
@token_required
def update_testcase_library(current_user, library_id):
    library_data = request.json
    testcase_library = load_data(TESTCASE_LIBRARY_FILE)
    
    library_index = next((i for i, l in enumerate(testcase_library) if l['id'] == library_id), None)
    if library_index is None:
        return jsonify({'error': 'Testcase library not found'}), 404
    
    testcase_library[library_index].update({
        'module_id': library_data.get('module_id', testcase_library[library_index]['module_id']),
        'title': library_data.get('title', testcase_library[library_index]['title']),
        'description': library_data.get('description', testcase_library[library_index]['description']),
        'steps': library_data.get('steps', testcase_library[library_index]['steps']),
        'expected_result': library_data.get('expected_result', testcase_library[library_index]['expected_result'])
    })
    
    save_data(testcase_library, TESTCASE_LIBRARY_FILE)
    return jsonify(testcase_library[library_index])

# API: 删除用例库
@app.route('/api/testcase-library/<library_id>', methods=['DELETE'])
@token_required
def delete_testcase_library(current_user, library_id):
    testcase_library = load_data(TESTCASE_LIBRARY_FILE)
    
    library_index = next((i for i, l in enumerate(testcase_library) if l['id'] == library_id), None)
    if library_index is None:
        return jsonify({'error': 'Testcase library not found'}), 404
    
    testcase_library.pop(library_index)
    save_data(testcase_library, TESTCASE_LIBRARY_FILE)
    return jsonify({'message': 'Testcase library deleted successfully'})

# API: 从用例库添加用例到测试任务
@app.route('/api/testcase-library/<library_id>/add-to-testcases', methods=['POST'])
@token_required
def add_library_to_testcases(current_user, library_id):
    
    add_data = request.json
    project_id = add_data.get('project_id')
    assignee = add_data.get('assignee', '')
    firmware_version = add_data.get('firmware_version', '')
    app_version = add_data.get('app_version', '')
    
    # 获取用例库详情
    testcase_library = load_data(TESTCASE_LIBRARY_FILE)
    library = next((l for l in testcase_library if l['id'] == library_id), None)
    if not library:
        return jsonify({'error': 'Testcase library not found'}), 404
    
    # 添加到测试用例
    testcases = load_data(TESTCASES_FILE)
    testcase_id = str(len(testcases) + 1)
    testcase = {
        'id': testcase_id,
        'module_id': library['module_id'],
        'title': library['title'],
        'description': library['description'],
        'steps': library['steps'],
        'expected_result': library['expected_result'],
        'status': 'pending',
        'assignee': assignee,
        'project_id': project_id,
        'firmware_version': firmware_version,
        'app_version': app_version
    }
    
    testcases.append(testcase)
    save_data(testcases, TESTCASES_FILE)
    
    return jsonify(testcase), 201

# API: 删除用例
@app.route('/api/testcases/<testcase_id>', methods=['DELETE'])
@token_required
def delete_testcase(current_user, testcase_id):
    testcases = load_data(TESTCASES_FILE)
    
    testcase_index = next((i for i, t in enumerate(testcases) if t['id'] == testcase_id), None)
    if testcase_index is None:
        return jsonify({'error': 'Testcase not found'}), 404
    
    testcases.pop(testcase_index)
    save_data(testcases, TESTCASES_FILE)
    return jsonify({'message': 'Testcase deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
