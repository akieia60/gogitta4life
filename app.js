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
// Model pose crops cut from each colorway's photo sheet (assets/poses/*.jpg), front pose first
const POSES = {"mens_tracksuit":{"default":["mens_tracksuit_default_1","mens_tracksuit_default_0","mens_tracksuit_default_2"],"white":["mens_tracksuit_white_1","mens_tracksuit_white_0","mens_tracksuit_white_2"],"red":["mens_tracksuit_red_1","mens_tracksuit_red_0","mens_tracksuit_red_2"],"blue":["mens_tracksuit_blue_1","mens_tracksuit_blue_0","mens_tracksuit_blue_2"],"pink":["mens_tracksuit_pink_1","mens_tracksuit_pink_0","mens_tracksuit_pink_2"]},"womens_pink":{"default":["womens_pink_default_1","womens_pink_default_0","womens_pink_default_2"],"white":["womens_pink_white_1","womens_pink_white_0","womens_pink_white_2"],"red":["womens_pink_red_1","womens_pink_red_0","womens_pink_red_2"],"blue":["womens_pink_blue_1","womens_pink_blue_0","womens_pink_blue_2"],"pink":["womens_pink_pink_1","womens_pink_pink_0","womens_pink_pink_2"]},"womens_cropped":{"default":["womens_cropped_default_1","womens_cropped_default_0","womens_cropped_default_2"],"white":["womens_cropped_white_1","womens_cropped_white_0","womens_cropped_white_2"],"red":["womens_cropped_red_1","womens_cropped_red_0","womens_cropped_red_2"],"blue":["womens_cropped_blue_1","womens_cropped_blue_0","womens_cropped_blue_2"],"pink":["womens_cropped_pink_1","womens_cropped_pink_0","womens_cropped_pink_2"]},"mens_hoodie":{"default":["mens_hoodie_default_1","mens_hoodie_default_0","mens_hoodie_default_2"],"white":["mens_hoodie_white_1","mens_hoodie_white_0","mens_hoodie_white_2"],"red":["mens_hoodie_red_1","mens_hoodie_red_0","mens_hoodie_red_2"],"blue":["mens_hoodie_blue_1","mens_hoodie_blue_0","mens_hoodie_blue_2"],"pink":["mens_hoodie_pink_1","mens_hoodie_pink_0","mens_hoodie_pink_2"]},"tshirt":{"default":["tshirt_default_1","tshirt_default_0","tshirt_default_2"]},"neon_zip":{"default":["neon_zip_default_0","neon_zip_default_1"]},"green_jogger":{"default":["green_jogger_default_1","green_jogger_default_0","green_jogger_default_2"]},"hats":{"default":["hats_default_0","hats_default_1","hats_default_2"]},"mono_bucket":{"default":["mono_bucket_default_0","mono_bucket_default_1","mono_bucket_default_2","mono_bucket_default_3"],"white":["mono_bucket_white_0","mono_bucket_white_1","mono_bucket_white_2","mono_bucket_white_3"],"red":["mono_bucket_red_0","mono_bucket_red_1","mono_bucket_red_2","mono_bucket_red_3"],"blue":["mono_bucket_blue_0","mono_bucket_blue_1","mono_bucket_blue_2","mono_bucket_blue_3"],"pink":["mono_bucket_pink_0","mono_bucket_pink_1","mono_bucket_pink_2","mono_bucket_pink_3"]}};
const CAT_LABELS = { sweatsuits:'Sweatsuits', shirts:'Shirts', hoodies:'Hoodies', hats:'Hats' };

let cart = JSON.parse(localStorage.getItem('gg4l_cart')||'[]');
let currentFilter = 'all', pdpProduct = null, pdpColor = 'default', pdpSize = null, pdpQty = 1, lastScroll = 0;
const $ = id => document.getElementById(id);

const colorImg = (p, c) => c === 'default' ? p.img : `assets/${p.id}_${c}.png`;
const galleryFor = (p, c) => [...(POSES[p.id]?.[c] || []).map(n => `assets/poses/${n}.jpg`), colorImg(p, c)];
const hoverImg = p => { const g = galleryFor(p, 'default'); return g.length > 1 ? g[0] : null; };

function renderProducts() {
  const grid = $('product-grid');
  grid.innerHTML = '';
  const filtered = currentFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === currentFilter);
  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i*.06}s`;
    const alt = hoverImg(p);
    card.innerHTML = `<div class="product-image${alt?' has-alt':''}"><img src="${p.img}" alt="${p.name}" loading="lazy">${alt?`<img class="alt-img" src="${alt}" alt="" loading="lazy">`:''}<div class="quick-view"><span>View Item</span></div></div><div class="product-info"><div class="product-cat-badge">${CAT_LABELS[p.category]}</div><h3>${p.name}</h3><p class="price">$${p.price.toFixed(2)}</p></div>`;
    card.addEventListener('click', () => { location.hash = `#/item/${p.id}`; });
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

function openProduct(product, color = 'default') {
  if (!pdpProduct) lastScroll = window.scrollY;
  pdpProduct = product; pdpColor = product.colors.includes(color) ? color : 'default'; pdpSize = null; pdpQty = 1;
  $('pdp-name').textContent = product.name;
  $('pdp-sticky-name').textContent = product.name;
  $('pdp-price').textContent = $('pdp-sticky-price').textContent = `$${product.price.toFixed(2)}`;
  $('pdp-badge').textContent = $('pdp-crumb-cat').textContent = CAT_LABELS[product.category];
  $('pdp-crumb-name').textContent = product.name;
  $('pdp-qty').textContent = '1'; $('pdp-size-name').textContent = 'Select a size'; $('pdp-msg').textContent = '';
  $('pdp-details').innerHTML = [
    `Style: ${product.name}`,
    `Category: ${CAT_LABELS[product.category]}`,
    `Colors: ${product.colors.map(c => COLOR_MAP[c].label).join(', ')}`,
    `Sizes: ${SIZES.join(' · ')}`,
    `Go Gitta Records fist logo graphics`,
  ].map(t => `<li>${t}</li>`).join('');
  const sw = $('pdp-swatches'); sw.innerHTML = '';
  product.colors.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'color-btn'; btn.dataset.color = c; btn.title = COLOR_MAP[c].label; btn.setAttribute('aria-label', COLOR_MAP[c].label);
    btn.style.setProperty('--c1', COLOR_MAP[c].c1); btn.style.setProperty('--c2', COLOR_MAP[c].c2);
    btn.addEventListener('click', () => setColor(c));
    sw.appendChild(btn);
  });
  const sz = $('pdp-sizes'); sz.innerHTML = '';
  SIZES.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'size-btn'; btn.textContent = s;
    btn.addEventListener('click', () => { sz.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); pdpSize = s; $('pdp-size-name').textContent = s; $('pdp-msg').textContent = ''; });
    sz.appendChild(btn);
  });
  setColor(pdpColor, true);
  renderMore(product);
  $('pdp').classList.add('open'); $('pdp').setAttribute('aria-hidden', 'false');
  document.body.classList.add('pdp-open');
  $('pdp').scrollTop = 0;
}

function setColor(c, initial) {
  pdpColor = c;
  $('pdp-color-name').textContent = COLOR_MAP[c].label;
  $('pdp-swatches').querySelectorAll('.color-btn').forEach(b => b.classList.toggle('active', b.dataset.color === c));
  const imgs = galleryFor(pdpProduct, c);
  $('pdp-track').innerHTML = imgs.map((src, i) => `<figure class="pdp-slide" data-i="${i}"><img src="${src}" alt="${pdpProduct.name} — ${COLOR_MAP[c].label}, photo ${i+1}" ${i>1?'loading="lazy"':''}></figure>`).join('');
  $('pdp-thumbs').innerHTML = imgs.map((src, i) => `<button class="pdp-thumb${i===0?' active':''}" data-i="${i}" aria-label="Photo ${i+1}"><img src="${src}" alt="" loading="lazy"></button>`).join('');
  $('pdp-thumbs').querySelectorAll('.pdp-thumb').forEach(t => t.addEventListener('click', () => goSlide(+t.dataset.i)));
  $('pdp-track').querySelectorAll('.pdp-slide').forEach(f => f.addEventListener('click', () => openLightbox(f.querySelector('img').src)));
  $('pdp-track').querySelectorAll('img').forEach(im => im.addEventListener('load', () => updateCount(currentSlide(), imgs.length)));
  $('pdp-track').scrollLeft = 0;
  updateCount(0, imgs.length);
  if (!initial && pdpProduct) history.replaceState(null, '', `#/item/${pdpProduct.id}${c==='default'?'':'/'+c}`);
}

function slides() { return [...$('pdp-track').querySelectorAll('.pdp-slide')]; }
function currentSlide() {
  const t = $('pdp-track'), x = t.scrollLeft + 2;
  let idx = 0; slides().forEach((s, i) => { if (s.offsetLeft - t.offsetLeft <= x) idx = i; });
  return idx;
}
function goSlide(i) {
  const s = slides(); if (!s.length) return;
  i = Math.max(0, Math.min(s.length - 1, i));
  const t = $('pdp-track');
  t.scrollTo({ left: s[i].offsetLeft - t.offsetLeft, behavior: 'smooth' });
  updateCount(i, s.length);
}
function updateCount(i, n) {
  $('pdp-count').textContent = `${i+1} / ${n}`;
  $('pdp-thumbs').querySelectorAll('.pdp-thumb').forEach((b, j) => b.classList.toggle('active', j === i));
  const t = $('pdp-track');
  $('pdp-prev').disabled = i <= 0;
  $('pdp-next').disabled = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4;
  $('pdp-prev').hidden = $('pdp-next').hidden = n < 2;
}

function renderMore(product) {
  const same = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category);
  const rest = PRODUCTS.filter(p => p.id !== product.id && p.category !== product.category);
  $('pdp-more').innerHTML = [...same, ...rest].slice(0, 4).map(p => { const alt = hoverImg(p); return `<a class="product-card" href="#/item/${p.id}"><div class="product-image${alt?' has-alt':''}"><img src="${p.img}" alt="${p.name}" loading="lazy">${alt?`<img class="alt-img" src="${alt}" alt="" loading="lazy">`:''}</div><div class="product-info"><div class="product-cat-badge">${CAT_LABELS[p.category]}</div><h3>${p.name}</h3><p class="price">$${p.price.toFixed(2)}</p></div></a>`; }).join('');
}

function closeProduct() {
  if (!pdpProduct) return;
  pdpProduct = null;
  $('pdp').classList.remove('open'); $('pdp').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('pdp-open');
  window.scrollTo(0, lastScroll);
}

function addFromPdp() {
  if (!pdpSize) { $('pdp-msg').textContent = 'Pick your size first.'; $('pdp-sizes').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
  addToCart(pdpProduct, pdpColor, pdpSize, pdpQty);
}

function openLightbox(src) { $('lightbox-img').src = src; $('lightbox').classList.add('open'); }
function closeLightbox() { $('lightbox').classList.remove('open'); }

function route() {
  const m = location.hash.match(/^#\/item\/([a-z_]+)(?:\/([a-z]+))?/);
  const p = m && PRODUCTS.find(x => x.id === m[1]);
  if (p) openProduct(p, m[2] || 'default'); else closeProduct();
}

function saveCart() { localStorage.setItem('gg4l_cart', JSON.stringify(cart)); }

function addToCart(product, color, size, qty = 1) {
  if (!size) { alert('Please select a size'); return; }
  const key = `${product.id}_${color}_${size}`;
  const existing = cart.find(i => i.key === key);
  if (existing) { existing.qty += qty; } else {
    cart.push({ key, id:product.id, name:product.name, price:product.price, color, colorLabel:COLOR_MAP[color].label, size, qty, img:colorImg(product, color), category:product.category });
  }
  saveCart(); renderCart(); openCart();
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
  $('pdp-add').addEventListener('click', addFromPdp);
  $('pdp-sticky-add').addEventListener('click', addFromPdp);
  $('pdp-minus').addEventListener('click', () => { pdpQty = Math.max(1, pdpQty - 1); $('pdp-qty').textContent = pdpQty; });
  $('pdp-plus').addEventListener('click', () => { pdpQty = Math.min(10, pdpQty + 1); $('pdp-qty').textContent = pdpQty; });
  $('pdp-prev').addEventListener('click', () => goSlide(currentSlide() - 1));
  $('pdp-next').addEventListener('click', () => goSlide(currentSlide() + 1));
  let st; $('pdp-track').addEventListener('scroll', () => { clearTimeout(st); st = setTimeout(() => updateCount(currentSlide(), slides().length), 80); });
  $('lightbox').addEventListener('click', closeLightbox);
  new IntersectionObserver(([e]) => $('pdp-sticky').classList.toggle('show', !e.isIntersecting && !!pdpProduct), { root: $('pdp') }).observe($('pdp-buy'));
  window.addEventListener('hashchange', route);
  route();
  $('checkout-btn').addEventListener('click', checkout);
  $('hamburger').addEventListener('click', () => { const open = $('mobile-nav').classList.toggle('open'); document.body.style.overflow = open?'hidden':''; });
  window.addEventListener('scroll', () => { $('navbar').style.borderBottomColor = window.scrollY>100?'rgba(212,175,55,.15)':''; });
  if (window.location.search.includes('success=true')) { cart=[]; saveCart(); renderCart(); $('success-banner').style.display='flex'; history.replaceState({},'','/'); }
  document.addEventListener('keydown', e => { if(e.key==='Escape'){ if($('lightbox').classList.contains('open')) closeLightbox(); else if(pdpProduct) location.hash='#shop'; closeCart(); closeMobileNav(); } if(pdpProduct && !$('lightbox').classList.contains('open')){ if(e.key==='ArrowRight') goSlide(currentSlide()+1); if(e.key==='ArrowLeft') goSlide(currentSlide()-1); } });
});
