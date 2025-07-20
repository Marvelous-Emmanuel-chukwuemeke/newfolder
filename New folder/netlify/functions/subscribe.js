const client = require('@sendgrid/client');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

client.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  const { email } = JSON.parse(event.body || '{}');
  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) };
  }
  try {
    // Add to contact list
    await client.request({
      url: '/v3/marketing/contacts',
      method: 'PUT',
      body: {
        list_ids: [process.env.SENDGRID_LIST_ID],
        contacts: [{ email }],
      },
    });
    // Send welcome email
    await sgMail.send({
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'Welcome to Our Newsletter!',
      text: 'Thank you for subscribing. You will receive updates when we publish new posts.',
      html: '<p>Thank you for subscribing. You will receive updates when we publish new posts.</p>',
    });
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error('Subscription error', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
