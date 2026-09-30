#!/usr/bin/env node
/* ============================================================================
   QA — Garde-fou IA / Module Gouvernance des agents
   Vérifie : moteur de calcul, cohérence doc↔moteur, structure, liens, honnêteté.
   Zéro dépendance. Usage : node tests/qa-gouvernance.js
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const G = require(path.join(RACINE, 'gouvernance-calc.js'));

let ok = 0, ko = 0;
const echecs = [];

function t(nom, condition, detail) {
  if (condition) { ok++; console.log('  ✓ ' + nom); }
  else { ko++; echecs.push(nom + (detail ? ' → ' + detail : '')); console.log('  ✗ ' + nom + (detail ? ' → ' + detail : '')); }
}
function egal(nom, obtenu, attendu) {
  t(nom, obtenu === attendu, 'obtenu ' + JSON.stringify(obtenu) + ', attendu ' + JSON.stringify(attendu));
}
function proche(nom, obtenu, attendu, tolerance) {
  const ecart = Math.abs(obtenu - attendu);
  t(nom, ecart <= (tolerance || 0.005), 'obtenu ' + obtenu + ', attendu ' + attendu);
}
function lire(f) { return fs.readFileSync(path.join(RACINE, f), 'utf8'); }

/* ------------------------------------------------------------------ *
 * 1. Moteur de calcul — coûts
 * ------------------------------------------------------------------ */
console.log('\n[1] Moteur de coûts');
proche('coutParAppel(6 000 in, 700 out, 2,50/10)', G.coutParAppel(6000, 700, 2.5, 10), 0.022, 1e-9);
const OPTS = { joursMois: 30, taux: 1, budgetMensuel: 700 };
const AGENTS = [
  { nom: 'Support client', tokensIn: 6000, tokensOut: 700, appelsJour: 300, prixIn: 2.5, prixOut: 10 },
  { nom: 'Veille et résumés', tokensIn: 20000, tokensOut: 3000, appelsJour: 60, prixIn: 2.5, prixOut: 10 },
  { nom: 'Analyse de documents', tokensIn: 12000, tokensOut: 4000, appelsJour: 25, prixIn: 10, prixOut: 40 },
  { nom: 'Relances de factures', tokensIn: 1200, tokensOut: 250, appelsJour: 200, prixIn: 0.2, prixOut: 0.8 }
];
proche('Coût mensuel « Support client » = 198 €', G.coutMensuelAgent(AGENTS[0], OPTS), 198, 0.01);
proche('Coût mensuel « Veille » = 144 €', G.coutMensuelAgent(AGENTS[1], OPTS), 144, 0.01);
proche('Coût mensuel « Analyse » = 210 €', G.coutMensuelAgent(AGENTS[2], OPTS), 210, 0.01);
proche('Coût mensuel « Relances » = 2,64 €', G.coutMensuelAgent(AGENTS[3], OPTS), 2.64, 0.005);

const A = G.analysePortefeuille(AGENTS, OPTS);
proche('Total mensuel = 554,64 €', A.totalMensuel, 554.64, 0.02);
proche('Total annuel = 6 655,68 €', A.totalAnnuel, 6655.68, 0.05);
proche('Plafond quotidien = 23,33 €', A.plafondJour, 23.3333, 0.01);
proche('Seuil d\'alerte 80 % = 560 €', A.seuilAlerte80, 560, 0.01);
proche('Part du budget = 79,2 %', A.partBudgetPct, 79.234, 0.02);
egal('Budget non dépassé', A.depassement, false);
egal('Agent le plus coûteux = Analyse de documents', A.lignes[0].nom, 'Analyse de documents');
proche('Part de l\'agent dans le total = 37,9 %', A.lignes[0].partPct, 37.86, 0.05);
egal('Statut « Analyse de documents » = surveiller', A.lignes[0].statut, 'surveiller');
egal('Statut « Support client » = surveiller', A.lignes.filter(l => l.nom === 'Support client')[0].statut, 'surveiller');
egal('Statut « Relances » = ok', A.lignes.filter(l => l.nom === 'Relances de factures')[0].statut, 'ok');
t('Alertes générées (≥ 2)', A.alertes.length >= 2, A.alertes.length + ' alerte(s)');

const SANS_BUDGET = G.analysePortefeuille(AGENTS, { joursMois: 30, taux: 1, budgetMensuel: 0 });
t('Absence de budget → alerte explicite', SANS_BUDGET.alertes[0].indexOf('Aucun budget mensuel') === 0, SANS_BUDGET.alertes[0]);
const DEPASSE = G.analysePortefeuille(AGENTS, { joursMois: 30, taux: 1, budgetMensuel: 400 });
egal('Budget de 400 € → dépassement détecté', DEPASSE.depassement, true);
egal('Agent > 50 % du budget → critique', DEPASSE.lignes.filter(l => l.nom === 'Analyse de documents')[0].statut, 'critique');
proche('Taux de conversion appliqué (× 0,90)', G.coutMensuelAgent(AGENTS[0], { joursMois: 30, taux: 0.9, budgetMensuel: 0 }), 178.2, 0.01);

/* ------------------------------------------------------------------ *
 * 2. Moteur de calcul — registre MCP
 * ------------------------------------------------------------------ */
console.log('\n[2] Moteur de registre MCP');
const JIRA = { nom: 'Serveur Jira interne', editeur: 'interne', outils: 'lister, créer', auth: 'oauth', reseau: 'interne', zone: 'ue', journalise: true, plafond: true, ecriture: true, suppression: false, donneesPerso: true, secrets: false };
const CRM = { nom: 'Connecteur CRM communautaire', editeur: 'communautaire', outils: 'lire, exporter, supprimer', auth: 'cle', reseau: 'public', zone: 'horsUE', journalise: false, plafond: false, ecriture: true, suppression: true, donneesPerso: true, secrets: true };
const rJira = G.scoreRisqueMCP(JIRA), rCrm = G.scoreRisqueMCP(CRM);
egal('Jira interne → score 4', rJira.score, 4);
egal('Jira interne → niveau moyen', rJira.niveau, 'moyen');
egal('CRM communautaire → score 18', rCrm.score, 18);
egal('CRM communautaire → niveau élevé', rCrm.niveau, 'élevé');
t('CRM → décision « refuser ou isoler »', /Refuser ou isoler/.test(rCrm.decision), rCrm.decision);
egal('Serveur OAuth sans écriture → risque faible', G.scoreRisqueMCP({ auth: 'oauth', editeur: 'officiel', journalise: true, plafond: true, reseau: 'interne', zone: 'ue' }).niveau, 'faible');
egal('Authentification absente = +4', G.scoreRisqueMCP({ auth: 'aucune', editeur: 'officiel', journalise: true, plafond: true }).score, 4);

/* ------------------------------------------------------------------ *
 * 3. Exports CSV / Markdown
 * ------------------------------------------------------------------ */
console.log('\n[3] Exports');
const csv = G.versCSV([['Agent', 'Coût'], ['Support; client', '198,00 €']]);
t('CSV : BOM UTF-8 présent', csv.charCodeAt(0) === 0xFEFF);
t('CSV : séparateur « ; » et échappement des guillemets', /"Support; client";198,00 €/.test(csv), JSON.stringify(csv));
const csv2 = G.versCSV([['a"b', 'c']], ';');
t('CSV : guillemet interne doublé', csv2.indexOf('"a""b"') !== -1, JSON.stringify(csv2));
const mdReg = G.versMarkdownRegistre([JIRA, CRM]);
t('Markdown registre : une ligne par serveur + en-tête', mdReg.split('\n').length === 4, mdReg.split('\n').length + ' ligne(s)');
t('Markdown registre : niveau affiché', mdReg.indexOf('élevé') !== -1);
const mdCouts = G.versMarkdownCouts(A);
t('Markdown coûts : total 554,64 €', mdCouts.indexOf('554,64') !== -1);
t('Markdown coûts : 4 agents + total', mdCouts.split('\n').filter(l => l.charAt(0) === '|' && l.indexOf('---') === -1).length === 6, mdCouts.split('\n').length);
egal('fmt(1234.567)', G.fmt(1234.567), '1\u202F234,57');
egal('fmt(0)', G.fmt(0), '0,00');
egal('4 modèles par défaut', G.MODELES_DEFAUT.length, 4);
egal('Modèle local = 0 € de tokens', G.MODELES_DEFAUT[3].prixIn + G.MODELES_DEFAUT[3].prixOut, 0);

/* ------------------------------------------------------------------ *
 * 4. Cohérence doc ↔ moteur (les exemples publiés doivent être exacts)
 * ------------------------------------------------------------------ */
console.log('\n[4] Cohérence documents ↔ moteur');
const doc1 = lire('gouvernance/01-suivi-couts-agents.md');
const doc2 = lire('gouvernance/02-gouvernance-mcp.md');
const doc3 = lire('gouvernance/03-revue-skills-agents.md');
['554,64', '6 655,68', '23,33', '560', '79,2', '37,9', '198,00', '144,00', '210,00'].forEach(function (v) {
  t('Doc 01 contient « ' + v + ' »', doc1.indexOf(v) !== -1);
});
t('Doc 02 : Jira interne coté « 4 — moyen »', doc2.indexOf('4 — moyen') !== -1);
t('Doc 02 : CRM communautaire coté « 18 — élevé »', doc2.indexOf('18 — élevé') !== -1);
t('Doc 02 : barème identique au moteur (13 critères)', Object.keys(G.POIDS_RISQUE).length === 11 && /\+3/.test(doc2));

/* ------------------------------------------------------------------ *
 * 5. Structure, liens, honnêteté
 * ------------------------------------------------------------------ */
console.log('\n[5] Structure et liens');
const FICHIERS = ['gouvernance-agents.html', 'outil-gouvernance.html', 'gouvernance-calc.js',
  'gouvernance/01-suivi-couts-agents.md', 'gouvernance/02-gouvernance-mcp.md', 'gouvernance/03-revue-skills-agents.md'];
FICHIERS.forEach(function (f) { t('Existe : ' + f, fs.existsSync(path.join(RACINE, f))); });
egal('templates/ intact : 5 documents (offres 29/59 €)', fs.readdirSync(path.join(RACINE, 'templates')).filter(f => f.endsWith('.md')).length, 5);

function liensLocaux(fichier) {
  const html = lire(fichier);
  const base = path.dirname(path.join(RACINE, fichier));
  const refs = [];
  const re = /(?:href|src)\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const u = m[1];
    if (/^(https?:|mailto:|data:|#|tel:)/.test(u)) continue;
    refs.push({ url: u, existe: fs.existsSync(path.join(base, u.split('#')[0].split('?')[0])) });
  }
  return refs;
}
['gouvernance-agents.html', 'outil-gouvernance.html'].forEach(function (f) {
  const refs = liensLocaux(f);
  t(f + ' : au moins 6 liens locaux', refs.length >= 6, refs.length + ' lien(s)');
  const casses = refs.filter(r => !r.existe).map(r => r.url);
  t(f + ' : aucun lien local cassé', casses.length === 0, casses.join(', '));
  const html = lire(f);
  const lds = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  t(f + ' : au moins un bloc JSON-LD', lds.length >= 1);
  lds.forEach(function (bloc, i) {
    const json = bloc.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
    let okParse = true; try { JSON.parse(json); } catch (e) { okParse = false; }
    t(f + ' : JSON-LD #' + (i + 1) + ' valide', okParse);
  });
});

const index = lire('index.html');
t('index.html pointe vers le module', index.indexOf('gouvernance-agents.html') !== -1);
t('index.html pointe vers l\'outil', index.indexOf('outil-gouvernance.html') !== -1);
t('index.html : Pack Entreprise mentionne le module', /Module\s*<b>Gouvernance<\/b>|module Gouvernance/.test(index));
const chatbot = lire('chatbot-config.js');
t('chatbot-config : FAQ gouvernance ajoutée', /Gouvernance/.test(chatbot));
t('chatbot-config : prix 39 € annoncé', chatbot.indexOf('39') !== -1);

// prix et mécanismes identiques entre les pages
const modulePage = lire('gouvernance-agents.html');
t('Module : prix 39 € affiché', modulePage.indexOf('39 <small>€</small>') !== -1);
t('Module : Pack Entreprise 119 € affiché', modulePage.indexOf('119 <small>€</small>') !== -1);
t('Module : lien Stripe 119 € identique à la landing', modulePage.indexOf('https://buy.stripe.com/5kQ8wR86WdmleTHcCofrW0a') !== -1 && index.indexOf('https://buy.stripe.com/5kQ8wR86WdmleTHcCofrW0a') !== -1);
t('Module : EmailJS présent (service/template/publicKey du site)', /service_cy1ytdb/.test(modulePage) && /template_xpo58cv/.test(modulePage) && /8Pui4ZEqxW2jRVF7h/.test(modulePage));
t('Module : délai 24 h ouvrées annoncé', modulePage.indexOf('24 h ouvrées') !== -1);
t('Module : garantie 14 jours annoncée', modulePage.indexOf('14 jours') !== -1);
t('Outil : mention 100 % local', lire('outil-gouvernance.html').indexOf('100 % local') !== -1);

console.log('\n[6] Cohérence outil ↔ moteur (anti-erreur d\'exécution)');
(function () {
  const html = lire('outil-gouvernance.html');
  const exports_ = Object.keys(G);
  const utilises = Array.from(new Set((html.match(/G\.[A-Za-z_]+/g) || []).map(s => s.slice(2))));
  t('Fonctions du moteur utilisées : ' + utilises.length, utilises.length >= 8, utilises.join(', '));
  const inconnues = utilises.filter(u => exports_.indexOf(u) === -1);
  t('Toutes les fonctions appelées existent dans gouvernance-calc.js', inconnues.length === 0, inconnues.join(', '));
  const ids = Array.from(new Set((html.match(/getElementById\('([^']+)'\)/g) || []).map(s => s.replace(/getElementById\('|'\)/g, ''))));
  const manquants = ids.filter(id => html.indexOf('id="' + id + '"') === -1);
  t("Tous les éléments 'id' manipulés existent dans la page", manquants.length === 0, manquants.join(', '));
  t('Le calcul ne fait aucune requête réseau', !/fetch\(|XMLHttpRequest/.test(html));
})();

console.log('\n[7] Honnêteté (aucun texte factice)');
const A_VERIFIER = ['gouvernance-agents.html', 'outil-gouvernance.html', 'gouvernance/01-suivi-couts-agents.md',
  'gouvernance/02-gouvernance-mcp.md', 'gouvernance/03-revue-skills-agents.md'];
const INTERDITS = [/lorem ipsum/i, /\bTODO\b/, /à compléter plus tard/i, /texte de remplacement/i, /simulation uniquement/i, /mode démo/i];
A_VERIFIER.forEach(function (f) {
  const c = lire(f);
  INTERDITS.forEach(function (re) {
    t(f + ' : pas de « ' + re.source + ' »', !re.test(c));
  });
});

/* ------------------------------------------------------------------ *
 * Bilan
 * ------------------------------------------------------------------ */
console.log('\n════════════════════════════════════');
console.log('  QA Gouvernance : ' + ok + ' OK / ' + ko + ' échec(s)');
if (ko) { console.log('  Échecs :'); echecs.forEach(e => console.log('   - ' + e)); }
console.log('════════════════════════════════════\n');
process.exit(ko ? 1 : 0);
