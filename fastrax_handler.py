import logging
import boto3 #type: ignore

from email_handler import EmailSender
from helpers import get_secret

logger = logging.getLogger(__name__)

class FasTrax:
    def __init__(self, body):
        self.body = body

        self.email_sender = self.get_email_sender()

        self.form_fields = body.get('FormFields', {})
        self.form = body.get('Form', '')

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
        
        # Complete HTML email body
        html_content = f"""
        <html>
        <body>
            {intro}
            <p>{content}</p>
        </body>
        </html>
        """

        # Send notification emails
        recipients = ["porter@pagtechnologies.com"]#, "ap@fastraxpermitservice.com "]
        for recipient in recipients:
            self.email_sender.send_email(
                from_address="porter@pagtechnologies.com", 
                to_address=recipient,
                subject="Interactive Form Submission",
                body=html_content,
                attachment_path=None,
                is_html=True  # Assuming send_email method can take this parameter to set content type
            )

        # Return response
        return 200, 'Form data processed successfully!'