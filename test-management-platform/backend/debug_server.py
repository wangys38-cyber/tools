import sys
from flask import Flask, request, jsonify

app = Flask(__name__)

modules = []

@app.route('/api/modules', methods=['GET', 'POST'])
def handle_modules():
    print(f"Request method: {request.method}", flush=True)
    if request.method == 'GET':
        print(f"GET modules: {modules}", flush=True)
        return jsonify(modules)
    elif request.method == 'POST':
        print(f"POST data: {request.json}", flush=True)
        new_module = request.json
        new_module['id'] = str(len(modules) + 1)
        modules.append(new_module)
        print(f"Added module, total: {len(modules)}", flush=True)
        return jsonify(new_module), 201

if __name__ == '__main__':
    print("Starting server...", flush=True)
    try:
        app.run(debug=False, host='127.0.0.1', port=8888)
    except Exception as e:
        print(f"Server error: {e}", flush=True)
        sys.exit(1)
