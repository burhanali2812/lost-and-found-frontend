import emailjs from '@emailjs/browser';

emailjs.init(process.env.REACT_APP_EMAIL_PUBLIC_ID); 
console.log("Public ID:", process.env.REACT_APP_EMAIL_PUBLIC_ID);
console.log("Service ID:", process.env.REACT_APP_EMAIL_SERVICE_ID);
console.log("Template Generic ID:", process.env.REACT_APP_EMAIL_TEMPLATE_GENERIC_ID);
console.log("Template OTP ID:", process.env.REACT_APP_EMAIL_TEMPLATE_OTP_ID);


export const sendGenericEmail = (
  userEmail,
  userName,
  subject,
  messageBody,
  action 
) => {
  const templateParams =
    action === 'otp'
      ? {
          to_email: userEmail,
          user_name: userName,
         passcode: messageBody,
        }
      : {
          to_email: userEmail,
          user_name: userName,
          email_subject: subject,
          email_body: messageBody,
        };

  const templateId =
    action === 'otp'
      ? process.env.REACT_APP_EMAIL_TEMPLATE_OTP_ID
      : process.env.REACT_APP_EMAIL_TEMPLATE_GENERIC_ID;

  emailjs
    .send(
      process.env.REACT_APP_EMAIL_SERVICE_ID,
      templateId,
      templateParams
    )
    .then((response) => {
      console.log('Email sent successfully!', response.status, response.text);
    })
    .catch((error) => {
      console.error('Email sending failed:', error);
    });
};
