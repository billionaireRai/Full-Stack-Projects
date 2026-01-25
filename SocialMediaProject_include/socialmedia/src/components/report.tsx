interface ReportSuccessProps {
  reportedFor: string
  reason: string
  description: string
}


export const generateReportEmailHTML = ({ reportedFor , reason , description }: ReportSuccessProps): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Report Submitted</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .content {
          padding: 40px 30px;
          line-height: 1.6;
        }
        .content h2 {
          color: #667eea;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          margin-bottom: 20px;
          font-size: 16px;
        }
        .highlight {
          background-color: #f0f8ff;
          padding: 15px;
          border-left: 4px solid #667eea;
          margin: 20px 0;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 20px 30px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Report Submitted</h1>
        </div>
        <div class="content">
          <h2>Hello,</h2>
          <p>Thank you for submitting your report. We have received your submission and will review it promptly to ensure a safe and positive community.</p>
          <div class="highlight">
            <strong>Report Details:</strong><br>
            Reported For: ${reportedFor}<br>
            Reason: ${reason}<br>
            Description: ${description}
          </div>
          <p>Our moderation team will investigate this matter. If you have any additional information or questions, please contact our support team.</p>
        </div>
        <div class="footer">
          <p>© 2023 Our Social Media Platform. All rights reserved. | <a href="localhost:3000/privacy">Privacy Policy</a> | <a href="localhost:3000/terms">Terms of Service</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
