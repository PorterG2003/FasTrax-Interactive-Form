from flask import Flask, request, jsonify, render_template
from fastrax_handler import FasTrax
import boto3
import json
import logging
import os

app = Flask(__name__)

ROUTE = os.getenv('ROUTE', '')

# Initialize the S3 client
s3 = boto3.client('s3', region_name='us-west-2')  # Specify your region here)
BUCKET_NAME = 'zappa-vy4tv2kgd' 

boto3.set_stream_logger(name='boto3', level=logging.DEBUG)

@app.route('/')
def index():
    return render_template('index.html', route=ROUTE, submitted_data="")

@app.route('/submit', methods=['POST'])
def submit_form():
    # Extract the JSON body from the POST request
    body = request.get_json()
    
    if body is None:
        return jsonify({'message': 'No JSON body provided'}), 400

    # Initialize FasTrax with the request body
    site_handler = FasTrax(body, route=ROUTE)

    # Run the FasTrax handler and get status and message
    status, message = site_handler.run()

    # Return the response as a JSON object with the appropriate headers
    return jsonify({
        'message': message
    }), status

@app.route('/submitted-forms/<uuid>', methods=['GET'])
def load_submitted_form(uuid):
    # The S3 key where the cookie data is stored
    s3_key = f'cookies/{uuid}.json'

    try:
        # Fetch the data from S3
        s3_object = s3.get_object(Bucket=BUCKET_NAME, Key=s3_key)
        cookie_data = json.loads(s3_object['Body'].read().decode('utf-8'))
        cookie_data = "{}" if not cookie_data else cookie_data

        # Render the index.html template with the cookie data
        return render_template('index.html', route=ROUTE, submitted_data=cookie_data)

    except Exception as e:
        # If there was an issue fetching the data, return an error message
        return jsonify({'message': f"Error fetching data for UUID {uuid} from bucket {BUCKET_NAME}: {str(e)}"}), 404

if __name__ == '__main__': # LOCAL RUNS
    app.run(debug=True)

    # Configure the root logger
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[logging.StreamHandler()]
    )
    logger = logging.getLogger(__name__)

else: # AWS RUNS
    LOCAL = False
    TEST = False

    # Configure the root logger
    logger = logging.getLogger()
    logger.setLevel("INFO")

    # AWS CALLS LAMBDA HANDLER ITSELF