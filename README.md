# Garde-fou IA — Pack de sécurité pour agents IA

**Promesse** : « Déployez vos agents IA avec les mêmes réflexes que vos serveurs. »

Pack prêt à vendre pour solopreneur : landing + formation PDF + templates de sécurité + procédure d'incident + sensibilisation équipe + **module Gouvernance des agents** (coûts, serveurs MCP, revue des skills).

## Offres

| Offre | Prix | Contenu |
|---|---|---|
| Formation | 29 € | Formation PDF « Les 7 réflexes de sécurité » (~20 pages), exemples réels, checklist de déploiement 10 points, glossaire, mises à jour 12 mois |
| Module Gouvernance | 39 € | Les 8 templates de gouvernance (`gouvernance/`, 3 documents .md) : coûts des agents + plafonds de coupure, gouvernance des serveurs MCP, revue des skills. Outil de calcul accessible librement |
| Formation + Templates | 59 € — **LE PLUS CHOISI** | Tout l'offre 29 € + **10 templates** (5 documents .md) : politique d'usage + registre des agents, 3 prompts sécurisés, 2 check-lists, procédure d'incident + fiche d'incident, matrice de risques |
| Pack Entreprise | 119 € | Tout l'offre 59 € + **module Gouvernance (8 templates)** + procédure d'incident version entreprise (rôles RACI, cellule de crise, escalade, communication, obligations CNIL) + kit de sensibilisation équipe (email d'annonce, atelier 45 min, quiz 10 questions) |
| Audit gouvernance | 490 – 990 € | Prestation sur mesure : relevé réel des agents/volumes/factures, inventaire des serveurs MCP et permissions, registre + budget + règles de coupure configurés, restitution écrite et visio |

> Total templates : **10** (offre 59 €) + **8** (module Gouvernance) = **18 templates en 8 documents**.

## Structure du dossier

```
garde-fou-ia/
├── index.html                      # Landing (acier/rouge) : hero, douleurs, méthode, 7 réflexes, module Gouvernance, offres, commande Stripe, FAQ, footer
├── gouvernance-agents.html         # Page du module Gouvernance : 39 € / inclus 119 € / audit 490–990 €, formulaire EmailJS, FAQ, JSON-LD
├── outil-gouvernance.html          # OUTIL GRATUIT : calculateur de coûts d'agents + registre MCP (100 % local, export CSV/Markdown, impression)
├── gouvernance-calc.js             # Moteur de calcul pur (coûts, plafonds, score de risque MCP, exports) — testé par tests/qa-gouvernance.js
├── formation-garde-fou.md          # LA FORMATION (~20 pages) : 7 modules, fil rouge Nadia & Chloé, exemples réels, checklist, glossaire
├── templates/                      # 5 documents = 10 templates (offre 59 €)
│   ├── politique-usage-agents.md   # T1 politique d'usage + T2 registre des agents
│   ├── prompt-securise.md          # T3 prompt générique + T4 zone de données verrouillée + T5 validation humaine
│   ├── checklist-avant-deploiement.md  # T6 check-list avant déploiement + T7 check-list de revue mensuelle
│   ├── procedure-incident.md       # T8 procédure d'incident + T9 fiche d'incident
│   └── matrice-risques.md          # T10 matrice de risques + échelles + scénarios types
├── gouvernance/                    # 3 documents = 8 templates (module 39 € / inclus 119 €)
│   ├── 01-suivi-couts-agents.md    # T11 grille de suivi des coûts + T12 règles de coupure et revue
│   ├── 02-gouvernance-mcp.md       # T13 checklist 12 points + T14 registre MCP + T15 politique des outils autorisés
│   └── 03-revue-skills-agents.md   # T16 inventaire des skills + T17 grille de revue trimestrielle + T18 règles du harnais
├── entreprise/                     # Suppléments offre 119 €
│   ├── procedure-incident-entreprise.md  # RACI, cellule de crise, escalade, communication, CNIL 72 h
│   └── kit-sensibilisation-equipe.md     # Email d'annonce, atelier 45 min, quiz 10 questions corrigé
├── tests/qa-gouvernance.js         # Harness Node (zéro dépendance) : moteur, doc↔moteur, liens, honnêteté
├── chatbot-config.js               # Widget chatbot FAQ + leads (accent #ef4444), 13 FAQ dont coûts / MCP / skills
├── chatbot.js                      # Widget chatbot (pattern ai-course-builder)
├── og-image.svg                    # Image de partage réseaux (1200 × 630)
└── README.md
```

## Stack (zéro simulateur)

- **Landing + module** : statique, HTML/CSS/JS pur, design « sécurité industrielle » — gris acier + rouge signal `#FF3B30` + fond `#0A0C12`, bandes de danger, panneaux de contrôle.
- **Commande** : la landing passe par **Stripe Payment Links** (29 / 59 / 119 €, `STRIPE_LINKS` en bas de `index.html`). La page du module utilise le **formulaire EmailJS réel** — `serviceId=service_cy1ytdb`, `templateId=template_xpo58cv`, `publicKey=8Pui4ZEqxW2jRVF7h`, payload `{site, name, email, question}` (site = « Garde-fou IA — Module Gouvernance », question = « Commande : <offre> — <contexte> »). **Aucun lien Stripe 39 € pour l'instant** : le module se règle par lien de paiement envoyé sous 24 h ouvrées (créer le Payment Link puis remplacer le CTA quand la clé Stripe est disponible).
- **Outil de calcul** : `outil-gouvernance.html` + `gouvernance-calc.js`, **aucune dépendance, aucune requête réseau**, données conservées en `localStorage` (clés `gf_gouv_*`), exports CSV (BOM + `;` pour Excel FR) et Markdown. Les prix des modèles sont des **ordres de grandeur éditables** — l'outil affiche explicitement qu'ils doivent être ajustés sur la page tarifaire du fournisseur.
- **Chatbot** : widget autonome FAQ + capture de leads, accent `#ef4444`, 13 FAQ business (prix exacts 29 / 39 / 59 / 119 €, différence des offres, coûts des agents, serveurs MCP, skills, livraison 24 h ouvrées, prérequis, garantie 14 jours, RGPD, incidents, paiement). Chute en capture de leads EmailJS si question hors FAQ.
- **SEO** : JSON-LD Product + FAQPage sur la landing et sur la page module, Open Graph (og:image = og-image.svg), meta description, favicon SVG.
- **Animations** : reveal au scroll (IntersectionObserver, respecte `prefers-reduced-motion`), accordéon FAQ, burger mobile.

## Livraison aux clients (process à tenir)

1. Réception de la commande par email (template EmailJS) ou par Stripe — objet : `🆕 Lead Garde-fou IA : <name>`.
2. Réponse sous 24 h ouvrées avec le lien de téléchargement (Google Drive / WeTransfer) : formation en **PDF** (convertir `formation-garde-fou.md` — script `~/Documents/scripts/md2pdf.py`) + templates en `.md`.
3. Facture sur demande.
4. Mises à jour pendant 12 mois : renvoyer les fichiers mis à jour aux acheteurs (liste à tenir dans un tableur).
5. Acheteurs du Pack Entreprise antérieurs au module : **renvoyer gratuitement** les 3 documents de `gouvernance/` (c'est une mise à jour du pack).

## Cohérence chiffrée (à ne pas casser)

- Prix : 29 / 39 / 59 / 119 € — mêmes montants partout (landing, page module, FAQ, chatbot, JSON-LD, README). Audit : 490 – 990 €.
- « 10 templates en 5 documents » = `templates/` (offre 59 €) — **ne pas ajouter de fichier dans `templates/`** sans mettre à jour l'énumération de l'offre 59 €.
- « 8 templates en 3 documents » = `gouvernance/` (module 39 € et Pack Entreprise). Total annoncé : **18 templates en 8 documents**.
- 7 réflexes = 7 modules de la formation = 7 cartes de la section réflexes de la landing.
- Checklist de déploiement : 10 points — identiques dans la landing, la formation et le template T6.
- Checklist MCP : **12 points** (T13) — identique dans le document 02 et la page du module.
- Cas réels cités : fuite Samsung (module 2), chatbot Air Canada (module 3), SUV vendu 1 dollar (module 3), notification CNIL 72 h (module 6).
- Fil rouge : Nadia (dirigeante d'Atelier Nadia) et Chloé (agent de relance de factures) — modules 1 à 7.
- Les exemples chiffrés du document 01 (554,64 € / 6 655,68 € / 23,33 € / 79,2 % / 37,9 %) sont **vérifiés par le harness** contre `gouvernance-calc.js` : si le barème ou les formules changent, corriger le document ou le moteur, jamais l'un sans l'autre.
- Barème de risque MCP : les 13 critères de `gouvernance-calc.js` (`POIDS`) doivent correspondre au tableau § 14.3 du document 02. Le harness vérifie les deux exemples (Jira interne = 4 « moyen », connecteur communautaire = 18 « élevé »).

## Déploiement

Statique → GitHub Pages ou tout hébergement statique. **Publier après validation de Demba** (l'encaisse passe par Stripe ; le module encaisse par lien de paiement envoyé par email). Après publication, vérifier : `curl -s https://<user>.github.io/garde-fou-ia/outil-gouvernance.html | grep gouvernance-calc.js` et tester le chatbot.

## Vérifications à refaire avant chaque mise en ligne

- [ ] `node tests/qa-gouvernance.js` → **tous les tests verts** (moteur, doc↔moteur, liens locaux, JSON-LD, prix, honnêteté)
- [ ] `python3 -m http.server` puis `curl -s -o /dev/null -w "%{http_code}"` sur index.html, gouvernance-agents.html, outil-gouvernance.html, outil.html → **200**
- [ ] `grep -rli "simulation\|simulé\|mode test\|placeholder\|démo uniquement" .` → 0 résultat
- [ ] `grep -rn "mailto:" index.html gouvernance-agents.html` → aucun mailto dans les handlers de soumission
- [ ] Orthographe : `python3 ~/.hermes/skills/business/ai-formation-authoring/scripts/verify_ortho_fr.py` sur index.html + gouvernance-agents.html + formation + templates + gouvernance
- [ ] JSON-LD : tous les blocs parsent (landing : 2 blocs ; page module : 2 blocs)
- [ ] Rendu navigateur : console sans erreur, reveal actif, _onglets de l'outil fonctionnels_, exports CSV/Markdown téléchargent un fichier, chatbot fonctionnel, envoi EmailJS (status 200 attendu)
- [ ] Cohérence chiffrée : grep croisé 29 / 39 / 59 / 119 / 490–990 / 24 h / 14 jours / 10 templates / 8 templates / 7 réflexes / 12 points
