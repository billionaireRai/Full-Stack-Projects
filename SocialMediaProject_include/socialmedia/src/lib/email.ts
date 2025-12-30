import { Resend } from 'resend';

const resend_api_key = process.env.RESEND_API_KEY ; // defining api-key... 
const resend = new Resend(resend_api_key); // initializing resend instance...

// argument typing...
interface functionArgType {
    to:string,
    subject:string,
    html:string
}

const sendEmailFunction = async ( { to, subject, html } : functionArgType ) => {
  try {
    const response = await resend.emails.send({
      from: `Briezl <onboarding@resend.dev>`, to , subject , html,
    });
    if(response.data) {
      console.log("Email sent successfully. Response:", response.data);
    }
    return response.error ;
  } catch (error) {
    console.error("Email Error:", error);
    throw new Error("Email sending failed");
  }
}

export default sendEmailFunction ;