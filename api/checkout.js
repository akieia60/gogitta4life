const Stripe = require('stripe');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { items } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'No items' });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: { currency:'usd', product_data:{ name:item.name, description:`${item.color} · Size ${item.size}` }, unit_amount:Math.round(item.price*100) },
        quantity: item.qty,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin||'https://gogitta4life.vercel.app'}/?success=true`,
      cancel_url: `${req.headers.origin||'https://gogitta4life.vercel.app'}/?canceled=true`,
      shipping_address_collection: { allowed_countries:['US'] },
      shipping_options: [
        { shipping_rate_data:{ type:'fixed_amount', fixed_amount:{amount:599,currency:'usd'}, display_name:'Standard Shipping (5-10 days)', delivery_estimate:{minimum:{unit:'business_day',value:5},maximum:{unit:'business_day',value:10}} } },
        { shipping_rate_data:{ type:'fixed_amount', fixed_amount:{amount:1299,currency:'usd'}, display_name:'Express Shipping (2-4 days)', delivery_estimate:{minimum:{unit:'business_day',value:2},maximum:{unit:'business_day',value:4}} } },
      ],
    });
    res.status(200).json({ url: session.url });
  } catch(err) { console.error('Stripe error:', err.message); res.status(500).json({ error: err.message }); }
};
