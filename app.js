/* GoGitta4Life — App.js */
const PRODUCTS = [
  { id:'mens_tracksuit', name:'Signature Men\'s Tracksuit', price:120, category:'sweatsuits', img:'assets/mens_tracksuit.png', colors:['default','white','red','blue','pink'] },
  { id:'womens_pink', name:'Women\'s Rose Gold Set', price:110, category:'sweatsuits', img:'assets/womens_pink.png', colors:['default','white','red','blue','pink'] },
  { id:'neon_zip', name:'Neon Zip Tracksuit', price:90, category:'sweatsuits', img:'assets/neon_zip.png', colors:['default','white','red','blue','pink'] },
  { id:'womens_cropped', name:'Women\'s Cropped Jogger Set', price:115, category:'sweatsuits', img:'assets/womens_cropped.png', colors:['default','white','red','blue','pink'] },
  { id:'tshirt', name:'Premium GoGitta Tee', price:35, category:'shirts', img:'assets/tshirt.png', colors:['default','white','red','blue','pink'] },
  { id:'mens_hoodie', name:'Classic Hoodie Set', price:130, category:'hoodies', img:'assets/mens_hoodie.png', colors:['default','white','red','blue','pink'] },
  { id:'green_jogger', name:'Emerald Accent Pullover', price:85, category:'hoodies', img:'assets/green_jogger.png', colors:['default','white','red','blue','pink'] },
  { id:'hats', name:'Signature Headwear', price:25, category:'hats', img:'assets/hats.png', colors:['default','white','red','blue','pink'] },
  { id:'mono_bucket', name:'Monogram Bucket Hat', price:80, category:'hats', img:'assets/mono_bucket.png', colors:['default','white','red','blue','pink'] },
];
const SIZES = ['S','M','L','XL','2XL'];
const COLOR_MAP = { default:{c1:'#050505',c2:'#00ff66',label:'Black/Green'}, white:{c1:'#ffffff',c2:'#dddddd',label:'White'}, red:{c1:'#ff0000',c2:'#cc0000',label:'Red'}, blue:{c1:'#0000ff',c2:'#0000cc',label:'Blue'}, pink:{c1:'#ffc0cb',c2:'#ff99aa',label:'Pink'} };
const CAT_LABELS = { sweatsuits:'Sweatsuits', shirts:'Shirts', hoodies:'Hoodies', hats:'Hats' };

let cart = JSON.parse(localStorage.getItem('gg4l_cart')||'[]');
let currentFilter = 'all', modalProduct = null, modalColor = 'default', modalSize = null;
const $ = id => document.getElementById(id);

function renderProducts() {
  const grid = $('product-grid');
  grid.innerHTML = '';
  const filtered = currentFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === currentFilter);
  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i*.06}s`;
    card.innerHTML = `<div class="product-image"><img src="${p.img}" alt="${p.name}" loading="lazy"><div class="quick-view"><span>Quick View</span></div></div><div class="product-info"><div class="product-cat-badge">${CAT_LABELS[p.category]}</div><h3>${p.name}</h3><p class="price">$${p.price.toFixed(2)}</p></div>`;
    card.addEventListener('click', () => openModal(p));
    grid.appendChild(card);
  });
}

function initCategoryTabs() {
  document.querySelectorAll('.cat-tab').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.cat;
    renderProducts();
  }));
  document.querySelectorAll('[data-cat]').forEach(link => link.addEventListener('click', () => {
    const cat = link.dataset.cat;
    if (cat) { currentFilter = cat; document.querySelectorAll('.cat-tab').forEach(b => b.classList.toggle('active', b.dataset.cat === cat)); renderProducts(); closeMobileNav(); }
  }));
}

function openModal(product) {
  modalProduct = product; modalColor = 'default'; modalSize = null;
  $('modal-img').src = product.img;
  $('modal-name').textContent = product.name;
  $('modal-price').textContent = `$${product.price.toFixed(2)}`;
  $('modal-badge').textContent = CAT_LABELS[product.category];
  const colorsDiv = $('modal-colors');
  colorsDiv.innerHTML = '';
  product.colors.forEach(c => {
    const btn = document.createElement('button');
    btn.className = `color-btn${c==='default'?' active':''}`;
    btn.style.setProperty('--c1', COLOR_MAP[c].c1);
    btn.style.setProperty('--c2', COLOR_MAP[c].c2);
    btn.title = COLOR_MAP[c].label;
    btn.addEventListener('click', () => { colorsDiv.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); modalColor = c; $('modal-img').src = c==='default' ? product.img : `assets/${product.id}_${c}.png`; });
    colorsDiv.appendChild(btn);
  });
  const sizesDiv = $('modal-sizes');
  sizesDiv.innerHTML = '';
  SIZES.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'size-btn';
    btn.textContent = s;
    btn.addEventListener('click', () => { sizesDiv.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); modalSize = s; });
    sizesDiv.appendChild(btn);
  });
  $('product-modal').classList.add('open');
  $('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() { $('product-modal').classList.remove('open'); $('modal-overlay').classList.remove('open'); document.body.style.overflow = ''; }

function saveCart() { localStorage.setItem('gg4l_cart', JSON.stringify(cart)); }

function addToCart(product, color, size) {
  if (!size) { alert('Please select a size'); return; }
  const key = `${product.id}_${color}_${size}`;
  const existing = cart.find(i => i.key === key);
  if (existing) { existing.qty++; } else {
    cart.push({ key, id:product.id, name:product.name, price:product.price, color, colorLabel:COLOR_MAP[color].label, size, qty:1, img:color==='default'?product.img:`assets/${product.id}_${color}.png`, category:product.category });
  }
  saveCart(); renderCart(); closeModal(); openCart();
}

function removeFromCart(key) { cart = cart.filter(i => i.key !== key); saveCart(); renderCart(); }
function updateQty(key, delta) { const item = cart.find(i => i.key === key); if (!item) return; item.qty += delta; if (item.qty <= 0) { removeFromCart(key); return; } saveCart(); renderCart(); }

function renderCart() {
  $('cart-count').textContent = cart.reduce((s,i) => s+i.qty, 0);
  if (cart.length === 0) { $('cart-items').innerHTML = '<p class="cart-empty">Your bag is empty</p>'; $('cart-footer').style.display = 'none'; return; }
  $('cart-footer').style.display = 'block';
  $('cart-total-price').textContent = `$${cart.reduce((s,i) => s+i.price*i.qty, 0).toFixed(2)}`;
  $('cart-items').innerHTML = cart.map(i => `<div class="cart-item"><div class="cart-item-img"><img src="${i.img}" alt="${i.name}"></div><div class="cart-item-details"><span class="cart-item-name">${i.name}</span><span class="cart-item-meta">${i.colorLabel} · ${i.size}</span><span class="cart-item-price">$${(i.price*i.qty).toFixed(2)}</span><div class="cart-item-qty"><button onclick="updateQty('${i.key}',-1)">−</button><span>${i.qty}</span><button onclick="updateQty('${i.key}',1)">+</button></div><button class="cart-item-remove" onclick="removeFromCart('${i.key}')">Remove</button></div></div>`).join('');
}

function openCart() { $('cart-drawer').classList.add('open'); $('cart-overlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeCart() { $('cart-drawer').classList.remove('open'); $('cart-overlay').classList.remove('open'); document.body.style.overflow = ''; }
function closeMobileNav() { $('mobile-nav').classList.remove('open'); document.body.style.overflow = ''; }

async function checkout() {
  const btn = $('checkout-btn');
  btn.disabled = true; btn.textContent = 'Processing...';
  try {
    const res = await fetch('/api/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ items:cart.map(i => ({id:i.id,name:i.name,price:i.price,qty:i.qty,size:i.size,color:i.colorLabel,img:i.img})) }) });
    const data = await res.json();
    if (data.url) { window.location.href = data.url; } else { throw new Error(data.error||'Checkout failed'); }
  } catch(err) { alert('Checkout error: '+err.message+'\n\nStripe is being configured. Please try again soon.'); btn.disabled = false; btn.textContent = 'Checkout'; }
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(); initCategoryTabs(); renderCart();
  $('cart-toggle').addEventListener('click', openCart);
  $('cart-close').addEventListener('click', closeCart);
  $('cart-overlay').addEventListener('click', closeCart);
  $('modal-close').addEventListener('click', closeModal);
  $('modal-overlay').addEventListener('click', closeModal);
  $('modal-add-btn').addEventListener('click', () => { if(modalProduct) addToCart(modalProduct, modalColor, modalSize); });
  $('checkout-btn').addEventListener('click', checkout);
  $('hamburger').addEventListener('click', () => { const open = $('mobile-nav').classList.toggle('open'); document.body.style.overflow = open?'hidden':''; });
  window.addEventListener('scroll', () => { $('navbar').style.borderBottomColor = window.scrollY>100?'rgba(212,175,55,.15)':''; });
  if (window.location.search.includes('success=true')) { cart=[]; saveCart(); renderCart(); $('success-banner').style.display='flex'; history.replaceState({},'','/'); }
  document.addEventListener('keydown', e => { if(e.key==='Escape'){closeModal();closeCart();closeMobileNav();} });
});
