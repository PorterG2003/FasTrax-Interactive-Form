import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os

class EmailSender:
    def __init__(self, smtp_server, smtp_port, username, password):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.username = username
        self.password = password

    def send_email(self, from_address, to_address, subject, body, attachment_path=None, is_html=False):
        # Create the email
        msg = MIMEMultipart()
        msg['From'] = from_address
        msg['To'] = to_address
        msg['Subject'] = subject

        # Attach the email body
        if is_html:
            msg.attach(MIMEText(body, 'html'))
        else:
            msg.attach(MIMEText(body, 'plain'))

        # Attach the file if provided
        if attachment_path:
            attachment = MIMEBase('application', 'octet-stream')
            with open(attachment_path, 'rb') as file:
                attachment.set_payload(file.read())
            encoders.encode_base64(attachment)
            attachment.add_header('Content-Disposition', f'attachment; filename={os.path.basename(attachment_path)}')
            msg.attach(attachment)

        # Set up the SMTP server and send the email
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.username, self.password)
            server.send_message(msg)
            server.quit()
            print("Email sent successfully!")
        except Exception as e:
            print(f"Failed to send email: {e}")

# Example usage:
if __name__ == "__main__":
    smtp_server = "smtp.example.com"
    smtp_port = 587
    username = "your_email@example.com"
    password = "your_password"
    from_address = "your_email@example.com"
    to_address = "recipient@example.com"
    subject = "Test Email"
    body = "This is a test email from EmailSender class."
    attachment_path = "path/to/attachment.txt"  # or None if no attachment

    email_sender = EmailSender(smtp_server, smtp_port, username, password)
    email_sender.send_email(from_address, to_address, subject, body, attachment_path)