const client = require('@sendgrid/client');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

client.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  try {
    // Fetch all contacts in your list
    const [_, contactsRes] = await client.request({
      url: '/v3/marketing/contacts/search/emails',
      method: 'POST',
      body: { list_ids: [process.env.SENDGRID_LIST_ID] },
    });
    const emails = contactsRes.result.map(c => c.email);

    // Send broadcast
    const msg = {
      from: process.env.SENDER_EMAIL,
      subject: 'New Post Published!',
      text: `A new post is live: ${process.env.SITE_URL}`,
      html: `<p>A new post is live: <a href="${process.env.SITE_URL}">${process.env.SITE_URL}</a></p>`,
    };
    const messages = emails.map(email => ({ ...msg, to: email }));
    await sgMail.send(messages);

    return { statusCode: 200, body: JSON.stringify({ success: true, sent: emails.length }) };
  } catch (error) {
    console.error('Broadcast error', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
