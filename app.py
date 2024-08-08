from flask import Flask, request, jsonify, render_template
from fastrax_handler import FasTrax

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit_form():
    # Extract the JSON body from the POST request
    body = request.get_json()
    
    if body is None:
        return jsonify({'message': 'No JSON body provided'}), 400

    # Initialize FasTrax with the request body
    site_handler = FasTrax(body)

    # Run the FasTrax handler and get status and message
    status, message = site_handler.run()

    # Return the response as a JSON object with the appropriate headers
    return jsonify({
        'message': message
    }), status, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    }