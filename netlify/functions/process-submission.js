const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://your-database-name.firebaseio.com'
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  const data = JSON.parse(event.body);
  
  // Validate data
  const { name, email, loanAmount, eligibilityCriteria } = data;
  if (!name || !email || !loanAmount || !eligibilityCriteria) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid input' }),
    };
  }

  // Store in Firebase
  try {
    const db = admin.database();
    await db.ref('submissions').push(data);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error storing data', error: error.toString() }),
    };
  }

  // Send confirmation email via Resend API
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_RESEND_API_KEY`,
    },
    body: JSON.stringify({
      to: email,
      from: 'no-reply@yourdomain.com',
      subject: 'Submission Confirmation',
      html: `<p>Thank you for your submission, ${name}!</p>`,
    }),
  });

  if (!response.ok) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Submission successful' }),
  };
};
