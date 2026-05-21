module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(500).json({ error: 'Stripe key missing' });

  const { items } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'No items' });

  const origin = req.headers.origin || 'https://gogitta4life.vercel.app';

  // Build Stripe Checkout Session via REST API (no SDK needed)
  const lineItems = items.map((item, i) => ({
    [`line_items[${i}][price_data][currency]`]: 'usd',
    [`line_items[${i}][price_data][product_data][name]`]: item.name,
    [`line_items[${i}][price_data][product_data][description]`]: `${item.color} · Size ${item.size}`,
    [`line_items[${i}][price_data][unit_amount]`]: Math.round(item.price * 100),
    [`line_items[${i}][quantity]`]: item.qty,
  }));

  const body = new URLSearchParams();
  body.append('mode', 'payment');
  body.append('success_url', `${origin}/?success=true`);
  body.append('cancel_url', `${origin}/?canceled=true`);
  body.append('shipping_address_collection[allowed_countries][0]', 'US');
  body.append('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
  body.append('shipping_options[0][shipping_rate_data][fixed_amount][amount]', '599');
  body.append('shipping_options[0][shipping_rate_data][fixed_amount][currency]', 'usd');
  body.append('shipping_options[0][shipping_rate_data][display_name]', 'Standard Shipping (5-10 days)');
  body.append('shipping_options[1][shipping_rate_data][type]', 'fixed_amount');
  body.append('shipping_options[1][shipping_rate_data][fixed_amount][amount]', '1299');
  body.append('shipping_options[1][shipping_rate_data][fixed_amount][currency]', 'usd');
  body.append('shipping_options[1][shipping_rate_data][display_name]', 'Express Shipping (2-4 days)');

  lineItems.forEach(li => {
    Object.entries(li).forEach(([k, v]) => body.append(k, v));
  });

  try {
    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await resp.json();

    if (data.error) {
      console.error('Stripe API error:', data.error.message);
      return res.status(400).json({ error: data.error.message });
    }

    res.status(200).json({ url: data.url });
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
