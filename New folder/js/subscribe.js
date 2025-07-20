document.getElementById('subscribe-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const messageDiv = document.getElementById('message');
  try {
    const res = await fetch(e.target.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (res.ok) {
      messageDiv.textContent = 'Thanks for subscribing! A confirmation email is on its way.';
      e.target.reset();
    } else {
      const data = await res.json();
      messageDiv.textContent = data.error || 'Subscription failed. Please try again.';
    }
  } catch (err) {
    messageDiv.textContent = 'An unexpected error occurred.';
  }
});
