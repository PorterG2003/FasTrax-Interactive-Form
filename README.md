# FasTrax Interactive Permit Builder

A Flask-based web application for building and submitting permit forms, deployed using Zappa on AWS Lambda.

## Personal Notes

### Environments
- **Dev**: Development environment for testing new features
- **Stage**: Pre-production testing environment
- **Prod**: Production environment

### Quick Commands

```bash
# Activate virtual environment
source venv/bin/activate

# Deploy to different environments
zappa deploy dev
zappa deploy stage
zappa deploy prod

# Update existing deployments
zappa update dev
zappa update stage
zappa update prod

# View logs
zappa tail dev
zappa tail stage
zappa tail prod
```

### Environment Setup

1. Create and activate virtual environment:
   ```bash
   python3.9 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure AWS credentials:
   ```bash
   aws configure
   ```

### Deployment Notes

- Each environment has its own S3 bucket for form storage
- Lambda functions are region-specific (check zappa_settings.json)
- Remember to update environment variables in AWS Lambda console
- Production has custom domain configuration

### Maintenance

- Check CloudWatch logs periodically
- Monitor Lambda execution times
- Review S3 storage usage
- Update dependencies regularly

### Troubleshooting

- If deployment fails, check CloudWatch logs
- For cold start issues, adjust Lambda memory/timeout
- VPC configuration must be correct for email sending
- Check IAM roles if experiencing permission issues

### Local Development

1. Set up environment variables:
   ```bash
   export FLASK_APP=app.py
   export FLASK_ENV=development
   ```

2. Run locally:
   ```bash
   flask run
   ```

## Project Structure

```
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── zappa_settings.json # Zappa configuration
├── static/            # Static assets
└── templates/         # HTML templates
```