from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

def load_data(filename):
    filepath = os.path.join(DATA_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_data(filename, data):
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/api/modules', methods=['GET', 'POST'])
def modules():
    if request.method == 'GET':
        modules = load_data('modules.json')
        return jsonify(modules)
    elif request.method == 'POST':
        modules = load_data('modules.json')
        new_module = request.json
        new_module['id'] = str(len(modules) + 1)
        new_module['created_at'] = datetime.now().isoformat()
        modules.append(new_module)
        save_data('modules.json', modules)
        return jsonify(new_module), 201

@app.route('/api/modules/<id>', methods=['GET', 'PUT', 'DELETE'])
def module(id):
    modules = load_data('modules.json')
    if request.method == 'GET':
        module = next((m for m in modules if m['id'] == id), None)
        if module:
            return jsonify(module)
        return jsonify({'error': 'Module not found'}), 404
    elif request.method == 'PUT':
        for m in modules:
            if m['id'] == id:
                m.update(request.json)
                m['updated_at'] = datetime.now().isoformat()
                save_data('modules.json', modules)
                return jsonify(m)
        return jsonify({'error': 'Module not found'}), 404
    elif request.method == 'DELETE':
        modules = [m for m in modules if m['id'] != id]
        save_data('modules.json', modules)
        return jsonify({'success': True})

@app.route('/api/testcases', methods=['GET', 'POST'])
def testcases():
    if request.method == 'GET':
        testcases = load_data('testcases.json')
        module_id = request.args.get('module_id')
        if module_id:
            testcases = [t for t in testcases if t['module_id'] == module_id]
        return jsonify(testcases)
    elif request.method == 'POST':
        testcases = load_data('testcases.json')
        new_testcase = request.json
        new_testcase['id'] = str(len(testcases) + 1)
        new_testcase['created_at'] = datetime.now().isoformat()
        testcases.append(new_testcase)
        save_data('testcases.json', testcases)
        return jsonify(new_testcase), 201

@app.route('/api/testcases/<id>', methods=['GET', 'PUT', 'DELETE'])
def testcase(id):
    testcases = load_data('testcases.json')
    if request.method == 'GET':
        testcase = next((t for t in testcases if t['id'] == id), None)
        if testcase:
            return jsonify(testcase)
        return jsonify({'error': 'Testcase not found'}), 404
    elif request.method == 'PUT':
        for t in testcases:
            if t['id'] == id:
                t.update(request.json)
                t['updated_at'] = datetime.now().isoformat()
                save_data('testcases.json', testcases)
                return jsonify(t)
        return jsonify({'error': 'Testcase not found'}), 404
    elif request.method == 'DELETE':
        testcases = [t for t in testcases if t['id'] != id]
        save_data('testcases.json', testcases)
        return jsonify({'success': True})

@app.route('/api/projects', methods=['GET', 'POST'])
def projects():
    if request.method == 'GET':
        projects = load_data('projects.json')
        return jsonify(projects)
    elif request.method == 'POST':
        projects = load_data('projects.json')
        new_project = request.json
        new_project['id'] = str(len(projects) + 1)
        new_project['created_at'] = datetime.now().isoformat()
        new_project['status'] = 'active'
        projects.append(new_project)
        save_data('projects.json', projects)
        return jsonify(new_project), 201

@app.route('/api/projects/<id>', methods=['GET', 'PUT', 'DELETE'])
def project(id):
    projects = load_data('projects.json')
    if request.method == 'GET':
        project = next((p for p in projects if p['id'] == id), None)
        if project:
            return jsonify(project)
        return jsonify({'error': 'Project not found'}), 404
    elif request.method == 'PUT':
        for p in projects:
            if p['id'] == id:
                p.update(request.json)
                p['updated_at'] = datetime.now().isoformat()
                save_data('projects.json', projects)
                return jsonify(p)
        return jsonify({'error': 'Project not found'}), 404
    elif request.method == 'DELETE':
        projects = [p for p in projects if p['id'] != id]
        save_data('projects.json', projects)
        return jsonify({'success': True})

@app.route('/api/testruns', methods=['GET', 'POST'])
def testruns():
    if request.method == 'GET':
        testruns = load_data('testruns.json')
        project_id = request.args.get('project_id')
        if project_id:
            testruns = [t for t in testruns if t['project_id'] == project_id]
        return jsonify(testruns)
    elif request.method == 'POST':
        testruns = load_data('testruns.json')
        new_testrun = request.json
        new_testrun['id'] = str(len(testruns) + 1)
        new_testrun['created_at'] = datetime.now().isoformat()
        new_testrun['status'] = 'pending'
        testruns.append(new_testrun)
        save_data('testruns.json', testruns)
        return jsonify(new_testrun), 201

@app.route('/api/testruns/<id>', methods=['GET', 'PUT', 'DELETE'])
def testrun(id):
    testruns = load_data('testruns.json')
    if request.method == 'GET':
        testrun = next((t for t in testruns if t['id'] == id), None)
        if testrun:
            return jsonify(testrun)
        return jsonify({'error': 'Testrun not found'}), 404
    elif request.method == 'PUT':
        for t in testruns:
            if t['id'] == id:
                t.update(request.json)
                t['updated_at'] = datetime.now().isoformat()
                save_data('testruns.json', testruns)
                return jsonify(t)
        return jsonify({'error': 'Testrun not found'}), 404
    elif request.method == 'DELETE':
        testruns = [t for t in testruns if t['id'] != id]
        save_data('testruns.json', testruns)
        return jsonify({'success': True})

@app.route('/api/dashboard/<project_id>')
def dashboard(project_id):
    testruns = load_data('testruns.json')
    project_testruns = [t for t in testruns if t['project_id'] == project_id]
    
    stats = {
        'total': len(project_testruns),
        'pending': sum(1 for t in project_testruns if t['status'] == 'pending'),
        'passed': sum(1 for t in project_testruns if t['status'] == 'passed'),
        'failed': sum(1 for t in project_testruns if t['status'] == 'failed'),
        'in_progress': sum(1 for t in project_testruns if t['status'] == 'in_progress')
    }
    
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
