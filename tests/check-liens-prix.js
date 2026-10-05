// Vérification des liens internes + cohérence des mentions de prix — zéro dépendance.
// Usage : node tests/check-liens-prix.js
'use strict';
const fs = require('fs');
const path = require('path');
const RACINE = path.resolve(__dirname, '..');
const PAGES = ['index.html', 'coupe-circuit.html', 'gouvernance-agents.html', 'outil-gouvernance.html', 'outil.html', 'cgv.html', 'mentions-legales.html', 'merci.html'];
let ko = 0;
PAGES.forEach(f => {
  const p = path.join(RACINE, f);
  if (!fs.existsSync(p)) { console.log('✗ manquant : ' + f); ko++; return; }
  const h = fs.readFileSync(p, 'utf8');
  const liens = Array.from(new Set((h.match(/href="([^"#?]+\.html)"/g) || []).map(x => x.replace(/href="|"/g, ''))));
  const casses = liens.filter(l => !fs.existsSync(path.join(RACINE, l)));
  console.log((casses.length ? '✗ ' : '✓ ') + f + ' — ' + liens.length + ' liens internes' + (casses.length ? ' CASSE : ' + casses.join(', ') : ''));
  if (casses.length) ko++;
});
// cohérence : les 4 prix du pack ne doivent jamais varier
const index = fs.readFileSync(path.join(RACINE, 'index.html'), 'utf8');
const cc = fs.readFileSync(path.join(RACINE, 'coupe-circuit.html'), 'utf8');
const attendus = ['29 €', '59 €', '119 €', '39 €'];
attendus.forEach(pr => {
  const dansIndex = index.includes(pr), dansCC = (pr === '29 €' || pr === '59 €') ? true : cc.includes(pr);
  const ok = dansIndex && dansCC;
  console.log((ok ? '✓ ' : '✗ ') + 'prix ' + pr + ' présent (index=' + dansIndex + ', coupe-circuit=' + dansCC + ')');
  if (!ok) ko++;
});
console.log(ko === 0 ? '\nLIENS & PRIX : TOUT OK' : '\nLIENS & PRIX : ' + ko + ' problème(s)');
process.exitCode = ko === 0 ? 0 : 1;
