interface loginEmailType {
    email:string, 
    handle:string,
    name:string
}

export const loginemail = ({ email , handle , name } : loginEmailType) : string => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Alert - Our Social Media Platform</title>
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
        .button {
          display: inline-block;
          background-color: #667eea;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin-top: 20px;
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
          <h1>Login Alert</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>We noticed a successful login to your account. If this was you, no further action is required. If you did not initiate this login, please secure your account immediately by CHANGING YOUR PASSOWRD.</p>
          <div class="highlight">
            <strong>Login Details:</strong><br>
            Email: ${email}<br>
            Username: ${handle}<br>
            Time: ${new Date().toLocaleString()}
          </div>
          <p>For your security, we recommend reviewing your account settings and enabling TWO-FACTOR authentication if not already done.</p>
          <a href="${baseUrl}/@${handle}" class="button">View Your Profile</a>
        </div>
        <div class="footer">
          <p>If you have any concerns, please contact our support team.</p>
          <p>© 2023 Our Social Media Platform. All rights reserved. | <a href="${baseUrl}/privacy">Privacy Policy</a> | <a href="${baseUrl}/terms">Terms of Service</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

