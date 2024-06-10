from flask import Flask, request, jsonify
import os
import subprocess

app = Flask(__name__)

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify(error='Missing parameter url'), 400
    
    #os.environ['SERVER_URL'] = url

    with open('/usr/local/bin/env_vars.sh', 'w') as env_file:
        env_file.write(f'export SERVER_URL="{url}"\n')

    return jsonify(message="Subscribed"), 200

    

@app.route('/api/create_printer', methods=['POST'])
def create_printer():
    data = request.get_json()
    id = data.get('id')

    if not id:
        return jsonify(error='Missing printer id'), 400

    if os.path.isdir(f"/app/out/{id}"):
        return jsonify(error='Printer for this user  already exists'), 400
    
    command = ['./create_printer.sh', id]
    result = subprocess.run(command, capture_output=True, text=True)

    if result.returncode != 0:
        return jsonify(error=result.stderr), 500
    
    return jsonify(message="Printer created"), 200



@app.route('/api/delete_printer', methods=['POST'])
def delete_printer():
    data = request.get_json()
    id = data.get('id')

    if not id:
        return jsonify(error='Missing printer id'), 400
    
    command = ['./delete_printer.sh', id]
    result = subprocess.run(command, capture_output=True, text=True)

    if result.returncode == 0:
        return jsonify(message="Printer deleted"), 200
    elif result.returncode == 1:
        return jsonify(error='Printer does not exsist'), 400
    else:
        return jsonify(error=result.stderr), 500
    


@app.route('/api/check_for_printer', methods=['GET'])
def check_for_printer():
    id = request.args.get('id')

    if not id:
        return jsonify(error='Missing printer id'), 400
    
    result = subprocess.run(['lpstat', '-p', id], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    if result.returncode == 0:
        return jsonify(exists=True, message=f"Printer with ID {id} exists")
    else:
        return jsonify(exists=False, message=f"Printer with ID {id} does not exist")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

