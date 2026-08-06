from flask import Flask, request, jsonify

app = Flask(__name__)

modules = []

@app.route('/api/modules', methods=['GET', 'POST'])
def handle_modules():
    if request.method == 'GET':
        return jsonify(modules)
    elif request.method == 'POST':
        new_module = request.json
        new_module['id'] = str(len(modules) + 1)
        modules.append(new_module)
        print(f"Added module: {new_module}")
        return jsonify(new_module), 201

if __name__ == '__main__':
    app.run(debug=False, host='127.0.0.1', port=8080)
