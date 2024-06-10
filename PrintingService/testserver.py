from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/receive', methods=['POST'])
def receive():
    data = request.get_json()
    message = data.get('message', '')
    
    # Print the received message
    print(f"Received message: {data}")
    
    return jsonify({"status": "success"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
