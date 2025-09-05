import { parseNumber, fmt } from './utils.js';
import { loadState, saveState, clearState } from './storage.js';

const INITIAL = 20;

const rowsEl = document.getElementById('rows');
const grandTotalEl = document.getElementById('grandTotal');
const add20Top = document.getElementById('add20Top');
const add20Bottom = document.getElementById('add20Bottom');
const resetBtn = document.getElementById('resetBtn');

let rowCount = 0;

function makeRow(index, qtyValue = '', priceValue = '') {
  const row = document.createElement('div');
  row.className = 'row';
  row.dataset.index = String(index);

  const qty = document.createElement('input');
  qty.type = 'number';
  qty.min = '0';
  qty.step = '1';
  qty.placeholder = 'Adet';
  qty.className = 'qty';
  qty.setAttribute('aria-label', `Satır ${index+1} adet`);
  qty.inputMode = 'numeric';
  qty.value = qtyValue;

  const price = document.createElement('input');
  price.type = 'text';
  price.placeholder = 'Fiyat';
  price.className = 'price';
  price.setAttribute('aria-label', `Satır ${index+1} birim fiyat`);
  price.inputMode = 'decimal';
  price.value = priceValue;

  const amount = document.createElement('output');
  amount.className = 'amount';
  amount.value = '0,00';
  amount.setAttribute('aria-live', 'polite');
  amount.setAttribute('aria-label', `Satır ${index+1} tutar`);
  amount.textContent = '0,00';

  row.append(qty, price, amount);
  return row;
}

export function addRows(n, preset = []) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const p = preset[i] || {};
    frag.appendChild(makeRow(rowCount++, p.qty ?? '', p.price ?? ''));
  }
  rowsEl.appendChild(frag);
  updateAllAmounts();
  persist();
}

function updateRow(row) {
  const qty = parseNumber(row.querySelector('.qty').value);
  const price = parseNumber(row.querySelector('.price').value);
  const total = qty * price;
  row.querySelector('.amount').textContent = fmt.format(total);
}

function updateGrandTotal() {
  let sum = 0;
  rowsEl.querySelectorAll('.row').forEach(r => {
    const qty = parseNumber(r.querySelector('.qty').value);
    const price = parseNumber(r.querySelector('.price').value);
    sum += qty * price;
  });
  grandTotalEl.textContent = fmt.format(sum);
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

function persist() {
  saveState(collectState());
}

// Event delegation for inputs
rowsEl.addEventListener('input', (e) => {
  const row = e.target.closest('.row');
  if (!row) return;
  if (e.target.classList.contains('qty') || e.target.classList.contains('price')){
    updateRow(row);
    updateGrandTotal();
    persist();
  }
});

// Enter key navigation
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
      // If at last row, create 20 more and focus first qty
      addRows(20);
      const firstNew = rowsEl.querySelector('.row:last-child'); // actually last; we'll focus last added block's qty?
      // Focus the first newly added qty: locate previous count minus n
      const all = rowsEl.querySelectorAll('.row');
      const target = all[all.length - 20]?.querySelector('.qty');
      target && target.focus();
    }
  }
});

// Buttons
add20Top.addEventListener('click', () => addRows(20));
add20Bottom.addEventListener('click', () => addRows(20));

resetBtn.addEventListener('click', () => {
  const ok = confirm('Tüm satırlar sıfırlansın mı? Bu işlem geri alınamaz.');
  if (!ok) return;
  rowsEl.innerHTML = '';
  rowCount = 0;
  clearState();
  addRows(INITIAL);
});

export function init() {
  const saved = loadState();
  if (saved && Array.isArray(saved.rows) && saved.rows.length > 0) {
    // Recreate saved rows (in blocks of 20 for convenience)
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
