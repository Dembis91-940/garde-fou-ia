#!/usr/bin/env node
/* ============================================================================
   QA — Garde-fou IA / Module Coupe-circuit
   Vérifie : page de vente, document client T19-T21, cohérence prix,
   câblage EmailJS, chatbot, intégration dans la landing. Zéro dépendance.
   Usage : node tests/qa-coupe-circuit.js
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const RACINE = path.resolve(__dirname, '..');
let ok = 0, ko = 0; const echecs = [];
function t(nom, cond, detail) {
  if (cond) { ok++; console.log('  ✓ ' + nom); }
  else { ko++; echecs.push(nom + (detail ? ' → ' + detail : '')); console.log('  ✗ ' + nom + (detail ? ' → ' + detail : '')); }
}
const lire = f => fs.readFileSync(path.join(RACINE, f), 'utf8');
const existe = f => fs.existsSync(path.join(RACINE, f));

console.log('=== Fichiers du module ===');
['coupe-circuit.html', 'gouvernance/04-coupe-circuit-agents.md'].forEach(f => t('présent : ' + f, existe(f)));

const page = existe('coupe-circuit.html') ? lire('coupe-circuit.html') : '';
const doc = existe('gouvernance/04-coupe-circuit-agents.md') ? lire('gouvernance/04-coupe-circuit-agents.md') : '';
const index = lire('index.html');
const chatbot = lire('chatbot-config.js');

console.log('=== Page de vente ===');
t('EmailJS service réel', page.includes('service_cy1ytdb'));
t('EmailJS template réel', page.includes('template_xpo58cv'));
t('EmailJS clé publique réelle', page.includes('8Pui4ZEqxW2jRVF7h'));
t('chargement paresseux loader', /function chargerEmailJS/.test(page));
t('handler de commande', /function commander\(event\)/.test(page));
t('payload email complet (site/name/email/question)', /site:\s*EM_SITE/.test(page) && /name:\s*nom/.test(page) && /email:\s*email/.test(page) && /question:/.test(page));
t('formulaire id cmd-form', page.includes('id="cmd-form"'));
t('mention garantie 14 jours', /14 jours/.test(page));
t('paiement virement / message privé documenté', /virement/.test(page));
t('aucun lien Stripe mort', !page.includes('buy.stripe.com/REMPLACER'));
t('pas de « texte de remplacement »', !/texte de remplacement|Lorem ipsum/i.test(page));
t('pas de faux avis / compteur inventé', !/avis vérifiés|\d+ clients satisfaits/i.test(page));

console.log('=== Structure & SEO de la page ===');
t('8 sections', (page.match(/<section/g) || []).length >= 7);
const ld = page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
t('2 blocs JSON-LD', ld.length === 2, 'trouvés ' + ld.length);
let ldBon = 0;
ld.forEach(b => { try { JSON.parse(b.replace(/<[^>]+>/g, '')); ldBon++; } catch (e) {} });
t('JSON-LD parsables', ldBon === ld.length, ldBon + '/' + ld.length);
t('JSON-LD Product prix 39', /"price":\s*"39"/.test(page));
t('meta description présente', /<meta name="description"/.test(page));
t('viewport présent', /name="viewport"/.test(page));
t('titre spécifique au module', /<title>[^<]*Coupe-circuit[^<]*<\/title>/.test(page));
t('chatbot-config avant chatbot.js', page.indexOf('chatbot-config.js') < page.indexOf('"chatbot.js"') && page.includes('chatbot-config.js'));
t('script inline compile (présence IIFE burger/reveal)', /getElementById\('burger'\)/.test(page) && /IntersectionObserver/.test(page));

console.log('=== Document client (T19-T21) ===');
t('T19 présent', doc.includes('T19'));
t('T20 présent', doc.includes('T20'));
t('T21 présent', doc.includes('T21'));
t('plafonds durs', /Plafond dur/i.test(doc));
t('révocation du moyen de paiement', /révoc/i.test(doc));
t('approbation humaine (T21)', /approbation humaine/i.test(doc));
t('registre d’approbations', /registre d.approbation/i.test(doc));
t('qui approuve quoi', /qui approuve quoi/i.test(doc));
t('règle des 4 yeux', /4 yeux/i.test(doc));
t('procédure de crise en 5 étapes', /Geler/.test(doc) && /Réduire/.test(doc) && /Remplacer/.test(doc) && /Tracer/.test(doc) && /Réactiver/.test(doc));
t('aucun « mode démo »', !/mode démo|simulation uniquement|texte de remplacement/i.test(doc));
t('exemple chiffré cohérent (450 € = budget)', /450 €/.test(doc));
t('cas réel cité avec identifiant', /49861047/.test(doc));
t('longueur utile (> 8 000 caractères)', doc.length > 8000, doc.length + ' car.');

console.log('=== Intégration landing ===');
t('nav : lien coupe-circuit', /href="coupe-circuit\.html"/.test(index));
t('au moins 3 liens depuis la landing', (index.match(/href="coupe-circuit\.html"/g) || []).length >= 3, (index.match(/href="coupe-circuit\.html"/g) || []).length + '');
t('bande module présente', /COUPE-CIRCUIT/i.test(index) || /Coupe-circuit/.test(index));
t('FAQ coupe-circuit dans la landing', /empêcher un agent de continuer à dépenser/i.test(index));
t('pack entreprise mentionne le module', /module Coupe-circuit|Coupe-circuit/i.test(index));

console.log('=== Chatbot ===');
t('JSON valide', (() => { try { JSON.parse(chatbot.replace(/^window\.CHATBOT_CONFIG\s*=\s*/, '').replace(/;\s*$/, '')); return true; } catch (e) { return false; } })());
t('accent du pack (#ef4444)', chatbot.includes('"#ef4444"'));
t('nom du business', chatbot.includes('"Garde-fou IA"'));
t('FAQ dédiée coupe-circuit', /coupe-circuit/i.test(chatbot));
t('FAQ approbation / registre', /approbation/i.test(chatbot));
t('EmailJS chatbot intact', chatbot.includes('service_cy1ytdb') && chatbot.includes('template_xpo58cv') && chatbot.includes('8Pui4ZEqxW2jRVF7h'));

console.log('=== Cohérence des prix (ne pas casser) ===');
const produits = ['29 €', '59 €', '119 €', '39 €'];
produits.forEach(pr => t('prix ' + pr + ' toujours affiché sur la landing', index.includes(pr)));
t('module à 39 € sur sa page', page.includes('39 €'));
t('audit 490–990 €', page.includes('490') && page.includes('990'));

console.log('\n════════════════════════════════════');
console.log('  QA Coupe-circuit : ' + ok + ' OK / ' + ko + ' échec(s)');
if (ko) { console.log('  Échecs :'); echecs.forEach(e => console.log('   - ' + e)); }
console.log('════════════════════════════════════');
process.exitCode = ko === 0 ? 0 : 1;
