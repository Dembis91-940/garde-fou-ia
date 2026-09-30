#!/usr/bin/env node
/* ============================================================================
   Smoke test — exécute RÉELLEMENT le script de outil-gouvernance.html
   avec un DOM simulé minimal, et vérifie les valeurs affichées.
   Prouve que la page fonctionne (initialisation + calcul + alertes), sans navigateur.
   Usage : node tests/smoke-outil.js
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const RACINE = path.resolve(__dirname, '..');

const html = fs.readFileSync(path.join(RACINE, 'outil-gouvernance.html'), 'utf8');

// script inline principal = dernier <script> sans attribut src
const blocs = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
if (!blocs.length) { console.error('Aucun script inline trouvé'); process.exit(1); }
const code = blocs[blocs.length - 1].replace(/^<script>/, '').replace(/<\/script>$/, '');

/* ---------- DOM simulé ---------- */
const VALEURS = { jours: '30', taux: '1', budget: '300' };
const COCHES = { 'm-journalise': true, 'm-plafond': true, 'm-ecriture': false, 'm-suppression': false, 'm-perso': false, 'm-secrets': false };
const elements = {};

function creerElement(id) {
  return {
    id: id,
    value: Object.prototype.hasOwnProperty.call(VALEURS, id) ? VALEURS[id] : '',
    checked: !!COCHES[id],
    textContent: '', innerHTML: '', disabled: false,
    style: {}, dataset: {},
    addEventListener: function () {}, removeChild: function () {}, click: function () {},
    setAttribute: function () {}, getAttribute: function () { return null; },
    querySelector: function () { return creerElement('fils'); }
  };
}
const documentSimule = {
  getElementById: function (id) { if (!elements[id]) elements[id] = creerElement(id); return elements[id]; },
  createElement: function (tag) { return creerElement('cree-' + tag); },
  body: { appendChild: function () {}, removeChild: function () {} },
  head: { appendChild: function () {} },
  querySelectorAll: function () { return []; }
};
const stockage = {};
const localStorageSimule = {
  getItem: function (k) { return Object.prototype.hasOwnProperty.call(stockage, k) ? stockage[k] : null; },
  setItem: function (k, v) { stockage[k] = String(v); }
};
const windowSimule = { GOVCALC: require(path.join(RACINE, 'gouvernance-calc.js')), print: function () {} };

/* ---------- exécution réelle ---------- */
let erreur = null;
try {
  const f = new Function('window', 'document', 'localStorage', 'alert', 'Blob', 'URL', 'setTimeout', code);
  f(windowSimule, documentSimule, localStorageSimule, function () {}, function () {}, { createObjectURL: function () { return 'blob:test'; }, revokeObjectURL: function () {} }, function () {});
} catch (e) { erreur = e; }

let ok = 0, ko = 0;
function t(nom, cond, detail) {
  if (cond) { ok++; console.log('  ✓ ' + nom); }
  else { ko++; console.log('  ✗ ' + nom + (detail ? ' → ' + detail : '')); }
}

console.log('\n[Smoke] outil-gouvernance.html — exécution du script de page');
t('Le script de page s\'exécute sans erreur', !erreur, erreur && erreur.message);
if (erreur) { console.log('\n' + erreur.stack); process.exit(1); }

const txt = id => (elements[id] ? elements[id].textContent : undefined);
const htm = id => (elements[id] ? elements[id].innerHTML : undefined);

t('Tableau des agents rendu (3 lignes par défaut)', (htm('lignes') || '').split('<tr>').length - 1 === 3, htm('lignes'));
t('Total mensuel affiché = 50,85 €', txt('k-total') === '50,85 €', txt('k-total'));
t('Total annuel affiché = 610,20 €', txt('k-annuel') === '610,20 €', txt('k-annuel'));
t('Plafond quotidien affiché = 10,00 €', txt('k-jour') === '10,00 €', txt('k-jour'));
t('Seuil d\'alerte 80 % affiché = 240,00 €', txt('k-80') === '240,00 €', txt('k-80'));
t('Coût par agent calculé dans le tableau', txt('cm-2') === '36,00 €', txt('cm-2'));
t('Coût/appel de l\'agent 1 affiché', txt('cp-0') === '0,01 $', txt('cp-0'));
t('Graphique des coûts rendu', (htm('bars') || '').indexOf('Assistant direction') !== -1);
t('Alertes affichées', (htm('alertes') || '').indexOf('Agent le plus coûteux') !== -1, htm('alertes'));
t('4 règles de coupure générées', (htm('regles-grid') || '').split('<div class="regle">').length - 1 === 4, htm('regles-grid'));
t('Règles chiffrées avec le plafond du jour (10,00 €)', (htm('regles-grid') || '').indexOf('10,00 €') !== -1);
t('Registre MCP : état vide explicite', (htm('m-lignes') || '').indexOf('Aucun serveur enregistré') !== -1, htm('m-lignes'));
t('État persisté en localStorage', !!stockage['gf_gouv_couts_v1'] && !!stockage['gf_gouv_opts_v1']);

/* second passage : le registre MCP doit coter un serveur à risque */
(function () {
  const c = windowSimule.GOVCALC;
  const r = c.scoreRisqueMCP({ nom: 'CRM communautaire', editeur: 'communautaire', auth: 'cle', reseau: 'public', zone: 'horsUE', journalise: false, plafond: false, ecriture: true, suppression: true, donneesPerso: true, secrets: true });
  t('Registre MCP : serveur à risque élevé (18)', r.score === 18 && r.niveau === 'élevé', JSON.stringify(r));
  const csv = c.versMarkdownCouts(c.analysePortefeuille([{ nom: 'Test', tokensIn: 1000000, tokensOut: 0, appelsJour: 1, prixIn: 1, prixOut: 0 }], { joursMois: 30, taux: 1, budgetMensuel: 30 }));
  t('Export Markdown coûts généré', csv.indexOf('| Test |') !== -1);
})();

console.log('\n  Smoke : ' + ok + ' OK / ' + ko + ' échec(s)\n');
process.exit(ko ? 1 : 0);
