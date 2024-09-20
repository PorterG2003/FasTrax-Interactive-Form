import logging
import boto3 #type: ignore
import uuid
import json

from email_handler import EmailSender
from helpers import get_secret

logger = logging.getLogger(__name__)

class FasTrax:
    def __init__(self, body, route="/dev"):
        self.body = body

        self.email_sender = self.get_email_sender()

        self.form_fields = body.get('FormFields', {})
        self.form = body.get('Form', '')

        # Initialize the S3 client
        self.s3 = boto3.client('s3')
        self.bucket_name = 'zappa-vy4tv2kgd'  # Replace with your S3 bucket name
        self.route = route

    def get_email_sender(self):
        smtp_secret = get_secret('smtp')
        server = smtp_secret['SERVER']
        port = smtp_secret['PORT']
        username = smtp_secret['USERNAME']
        password = smtp_secret['PASSWORD']
        email_sender = EmailSender(smtp_server=server, smtp_port=port, username=username, password=password)
        return email_sender
    
    def run(self):
        # Determine method to run
        if self.form == "Submit":
            return self.runSubmit()
        else:
            return 400, f"No form in the FasTrax handler matches the received form, '{self.form}'"

    def runSubmit(self):
        # Save cookie data to s3
        cookie_data = self.body.get('cookieData')
        unique_id = self.save_cookie_data_to_s3(cookie_data)

        # Prep email content
        intro = "<p>You have a new interactive form submission!</p>"
        content_lines = []
        
        for section, fields in self.form_fields.items():
            content_lines.append(f"<strong>{section}:</strong><br>")
            for key, value in fields.items():
                if isinstance(value, (str, bool)):
                    content_lines.append(f"&emsp;{key}: {value}<br>")
                elif isinstance(value, dict):
                    content_lines.append(f"&emsp;<strong>{key}:</strong><br>")
                    for sub_key, sub_value in value.items():
                        content_lines.append(f"&emsp;&emsp;{sub_key}: {sub_value}<br>")

        content = "".join(content_lines)

        if self.route == "/dev":
            base_url = f"https://86whlxedc6.execute-api.us-west-2.amazonaws.com{self.route}"
        elif self.route == "/stage":
            base_url = f"https://8qjlq1wt87.execute-api.us-west-2.amazonaws.com{self.route}"
        elif self.route == "":
            base_url = f"https://form.fastraxpermitservice.com"

        
        # Complete HTML email body
        html_content = f"""
        <html>
        <body>
            {intro}
            <p>Check it out at {base_url}/submitted-forms/{unique_id}</p><br>
            <p>{content}</p>
        </body>
        </html>
        """

        unit_numbers = [str(self.form_fields['Section 5'][unit]["Unit Number"]) for unit in self.form_fields['Section 5'].keys()]
        subject = f"{self.form_fields['Section 1']['Carrier']}"
        subject += " - Unit Numbers: " if len(unit_numbers) > 1 else " - Unit Number: "
        for index, unit_number in enumerate(unit_numbers):
            subject += unit_number
            if index+1 != len(unit_numbers):
                subject += ", "


        # Send notification emails
        if self.route=="/stage":
            recipients = ["porter@pagtechnologies.com", "ap@fastraxpermitservice.com"]
        elif self.route=="/":
            recipients = ["porter@pagtechnologies.com", "ap@fastraxpermitservice.com"]
        else:
            recipients = ["porter@pagtechnologies.com"]
            subject += "THIS WAS ONLY SENT TO THIS EMAIL"

        for recipient in recipients:
            self.email_sender.send_email(
                from_address="porter@pagtechnologies.com",
                to_address=recipient,
                subject=subject,
                body=html_content,
                attachment_path=None,
                is_html=True  # Assuming send_email method can take this parameter to set content type
            )

        # Return response
        return 200, 'Form data processed successfully!'

    def save_cookie_data_to_s3(self, cookie_data):
        """
        Save the provided cookie data to an S3 bucket with a unique identifier.
        :param cookie_data: Dictionary containing the cookie data to be saved.
        :return: The unique identifier used to save the data in S3.
        """
        # Generate a unique identifier
        unique_id = str(uuid.uuid4())

        # Convert the cookie data to a JSON string
        cookie_data_string = json.dumps(cookie_data)

        # The key (filename) for the S3 object
        s3_key = f'cookies/{unique_id}.json'

        try:
            # Save the JSON string to the S3 bucket
            self.s3.put_object(Bucket=self.bucket_name, Key=s3_key, Body=cookie_data_string)

            logger.info(f"Cookie data saved to S3 with key: {s3_key}")

            # Return the unique identifier
            return unique_id

        except Exception as e:
            logger.error(f"Failed to save cookie data to S3: {str(e)}")
            raise e