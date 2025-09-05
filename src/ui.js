import { parseNumber, fmt } from './utils.js';
import { loadState, saveState, clearState } from './storage.js';

const INITIAL = 20;
const WA_NUMBER = '905330795539'; // 05330795539 → uluslararası

const rowsEl       = document.getElementById('rows');
const grandTotalEl = document.getElementById('grandTotal');
const add20Bottom  = document.getElementById('add20Bottom');
const resetBtn     = document.getElementById('resetBtn');
const footerEl     = document.getElementById('footer');
const endSentinel  = document.getElementById('endSentinel');
const waBtn        = document.getElementById('waBtn');

let focusedEl = null;


let rowCounter = 0;

/* ----------- row factory ----------- */
function makeRow(index, qtyValue = '', priceValue = '') {
  const row = document.createElement('div');
  row.className = 'row';

  const num = document.createElement('div');
  num.className = 'row-num';
  num.textContent = index + 1;

  // ADET — text + inputmode=numeric => klavyede "Next"
  const qty = document.createElement('input');
  qty.type = 'text';
  qty.placeholder = 'Adet';
  qty.className = 'qty';
  qty.inputMode = 'numeric';
  qty.pattern = '[0-9]*';
  qty.autocomplete = 'off';
  qty.autocapitalize = 'off';
  qty.spellcheck = false;
  qty.enterKeyHint = 'next';
  qty.value = qtyValue;

  // FİYAT — text + inputmode=decimal => klavyede "Next"
  const price = document.createElement('input');
  price.type = 'text';
  price.placeholder = 'Fiyat';
  price.className = 'price';
  price.inputMode = 'decimal';
  price.autocomplete = 'off';
  price.autocapitalize = 'off';
  price.spellcheck = false;
  price.enterKeyHint = 'next';
  price.value = priceValue;

  // TUTAR (küçük rozet)
  const amount = document.createElement('output');
  amount.className = 'amount';
  amount.textContent = '0,00';

  row.append(num, qty, price, amount);
  return row;
}

export function addRows(n, preset = []) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const p = preset[i] || {};
    frag.appendChild(makeRow(rowCounter++, p.qty ?? '', p.price ?? ''));
  }
  rowsEl.appendChild(frag);
  renumberRows();
  updateAllAmounts(); // WhatsApp linki de burada güncellenir
  persist();
}

function renumberRows(){
  let i = 1;
  rowsEl.querySelectorAll('.row-num').forEach(num => { num.textContent = i++; });
}

function updateRow(row) {
  const qty = parseNumber(row.querySelector('.qty').value);
  const price = parseNumber(row.querySelector('.price').value);
  const total = qty * price;
  row.querySelector('.amount').textContent = fmt.format(total);
}

function computeTotals(){
  let sumAmount = 0;
  let sumQty = 0;
  rowsEl.querySelectorAll('.row').forEach(r => {
    const qty = parseNumber(r.querySelector('.qty').value);
    const price = parseNumber(r.querySelector('.price').value);
    sumQty += qty;
    sumAmount += qty * price;
  });
  return { sumQty, sumAmount };
}

function updateGrandTotal() {
  const { sumQty, sumAmount } = computeTotals();
  grandTotalEl.textContent = fmt.format(sumAmount);
  updateWhatsAppLink(sumQty, sumAmount);
}

function updateWhatsAppLink(totalQty, totalAmount){
  if (!waBtn) return;
  const text =
    `Toplam Ürün Adedi: ${totalQty}%0A` +
    `Toplam Tutar: ${fmt.format(totalAmount)}%0A`;
  waBtn.href = `https://wa.me/${WA_NUMBER}?text=${text}`;
}

function updateAllAmounts() {
  rowsEl.querySelectorAll('.row').forEach(updateRow);
  updateGrandTotal();
}

function collectState() {
  const rows = [];
  rowsEl.querySelectorAll('.row').forEach(r => {
    rows.push({
      qty: r.querySelector('.qty').value,
      price: r.querySelector('.price').value
    });
  });
  return rows;
}
function persist() { saveState(collectState()); }

/* Footer görünürlüğü */
if (endSentinel && footerEl) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.target === endSentinel){
        if(e.isIntersecting) footerEl.classList.add('show');
        else footerEl.classList.remove('show');
      }
    });
  },{root:null, threshold:0.01});
  io.observe(endSentinel);
}

/* Olaylar */
rowsEl.addEventListener('input', (e) => {
  const row = e.target.closest('.row');
  if (!row) return;
  if (e.target.classList.contains('qty') || e.target.classList.contains('price')){
    updateRow(row);
    updateGrandTotal();
    persist();
  }
});
rowsEl.addEventListener('change', (e) => {
  const row = e.target.closest('.row');
  if (!row) return;
  if (e.target.classList.contains('qty') || e.target.classList.contains('price')){
    updateRow(row);
    updateGrandTotal();
    persist();
  }
});

// Odaklanma takibi (basit)
document.addEventListener('focusin', (e) => {
  const el = e.target;
  if (el.matches('input.qty, input.price')) {
    focusedEl = el;
  }
});

// Odaktan çıkınca temizle
document.addEventListener('focusout', (e) => {
  setTimeout(() => {
    const a = document.activeElement;
    if (!a || !a.matches('input.qty, input.price')) {
      focusedEl = null;
    }
  }, 50);
});

/* Enter/Next akışı */
rowsEl.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const t = e.target;
  const row = t.closest('.row');
  if (!row) return;
  e.preventDefault();
  if (t.classList.contains('qty')){
    const next = row.querySelector('.price');
    next && next.focus();
  } else if (t.classList.contains('price')){
    const nextRow = row.nextElementSibling;
    if (nextRow){
      const target = nextRow.querySelector('.qty');
      target && target.focus();
    } else {
      addRows(20);
      const all = rowsEl.querySelectorAll('.row');
      const target = all[all.length - 20]?.querySelector('.qty');
      target && target.focus();
    }
  }
});


/* Alt +20 butonu */
if (add20Bottom) {
  add20Bottom.addEventListener('click', () => addRows(20));
}

/* Sıfırla */
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    const ok = confirm('Tüm satırlar sıfırlansın mı? Bu işlem geri alınamaz.');
    if (!ok) return;
    rowsEl.innerHTML = '';
    rowCounter = 0;
    clearState();
    addRows(INITIAL);
  });
}

/* Başlat */
export function init() {
  const saved = loadState();
  if (saved && Array.isArray(saved.rows) && saved.rows.length > 0) {
    const chunks = Math.ceil(saved.rows.length / 20);
    for (let i = 0; i < chunks; i++) {
      const slice = saved.rows.slice(i*20, (i+1)*20);
      addRows(slice.length, slice);
    }
  } else {
    addRows(INITIAL);
  }
  updateAllAmounts();
}