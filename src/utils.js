// Türkçe sayı biçimi: her zaman 2 ondalık basamak göster
export const fmt = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false   // binlik ayırıcı yok
});

export function parseNumber(raw) {
  if (raw == null) return 0;
  let s = String(raw).trim().replace(/\s+/g, '');
  // hem virgül hem nokta kabul et
  s = s.replace(/,/g, '.').replace(/[^0-9.\-]/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}