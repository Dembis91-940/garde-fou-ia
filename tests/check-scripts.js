#!/usr/bin/env node
/* Vérifie que TOUS les scripts inline des pages (hors JSON-LD) sont compilables. */
'use strict';
const fs = require('fs'), path = require('path');
const RACINE = path.resolve(__dirname, '..');
const PAGES = ['index.html', 'coupe-circuit.html', 'gouvernance-agents.html', 'outil-gouvernance.html', 'outil.html'];
let ko = 0;
PAGES.forEach(function (p) {
  const html = fs.readFileSync(path.join(RACINE, p), 'utf8');
  const blocs = (html.match(/<script(?![^>]*src=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g) || []);
  blocs.forEach(function (b, i) {
    const code = b.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
    try { new Function(code); console.log('  ✓ ' + p + ' — script #' + (i + 1) + ' compile'); }
    catch (e) { ko++; console.log('  ✗ ' + p + ' — script #' + (i + 1) + ' : ' + e.message); }
  });
});
console.log(ko ? '\n  ' + ko + ' script(s) en erreur\n' : '\n  Tous les scripts inline compilent\n');
process.exit(ko ? 1 : 0);
