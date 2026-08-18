# Garde-fou IA — Pack de sécurité pour agents IA

**Promesse** : « Déployez vos agents IA avec les mêmes réflexes que vos serveurs. »

Pack prêt à vendre pour solopreneur : landing + formation PDF + templates de sécurité + procédure d'incident + sensibilisation équipe.

## Offres

| Offre | Prix | Contenu |
|---|---|---|
| Formation | 29 € | Formation PDF « Les 7 réflexes de sécurité » (~20 pages), exemples réels, checklist de déploiement 10 points, glossaire, mises à jour 12 mois |
| Formation + Templates | 59 € — **LE PLUS CHOISI** | Tout l'offre 29 € + **10 templates** (5 documents .md) : politique d'usage + registre des agents, 3 prompts sécurisés, 2 check-lists, procédure d'incident + fiche d'incident, matrice de risques |
| Pack Entreprise | 119 € | Tout l'offre 59 € + procédure d'incident version entreprise (rôles RACI, cellule de crise, escalade, communication, obligations CNIL) + kit de sensibilisation équipe (email d'annonce, atelier 45 min, quiz 10 questions) |

## Structure du dossier

```
garde-fou-ia/
├── index.html                      # Landing (acier/rouge) : hero, douleurs, méthode, 7 réflexes, offres, commande EmailJS, FAQ, footer
├── formation-garde-fou.md          # LA FORMATION (~20 pages) : 7 modules, fil rouge Nadia & Chloé, exemples réels, checklist, glossaire
├── templates/                      # 5 documents = 10 templates (offre 59 €)
│   ├── politique-usage-agents.md   # T1 politique d'usage + T2 registre des agents
│   ├── prompt-securise.md          # T3 prompt générique + T4 zone de données verrouillée + T5 validation humaine
│   ├── checklist-avant-deploiement.md  # T6 check-list avant déploiement + T7 check-list de revue mensuelle
│   ├── procedure-incident.md       # T8 procédure d'incident + T9 fiche d'incident
│   └── matrice-risques.md          # T10 matrice de risques + échelles + scénarios types
├── entreprise/                     # Suppléments offre 119 €
│   ├── procedure-incident-entreprise.md  # RACI, cellule de crise, escalade, communication, CNIL 72 h
│   └── kit-sensibilisation-equipe.md     # Email d'annonce, atelier 45 min, quiz 10 questions corrigé
├── chatbot-config.js               # Widget chatbot FAQ + leads (accent #ef4444)
├── chatbot.js                      # Widget chatbot (pattern ai-course-builder)
├── og-image.svg                    # Image de partage réseaux (1200 × 630)
└── README.md
```

## Stack (zéro simulateur)

- **Landing** : statique, HTML/CSS/JS pur, design « sécurité industrielle » — gris acier `#475569` + rouge signal `#ef4444` + blanc, bandes de danger, panneaux de contrôle.
- **Commande** : formulaire EmailJS **réel** — `serviceId=service_cy1ytdb`, `templateId=template_xpo58cv`, `publicKey=8Pui4ZEqxW2jRVF7h`, payload `{site, name, email, question}` (site = « Garde-fou IA », question = « Commande : <offre> »). Les boutons des offres pré-remplissent le sélecteur et font défiler vers le formulaire.
- **Chatbot** : widget autonome FAQ + capture de leads (pattern ai-course-builder), accent `#ef4444`, 9 FAQ business (prix exacts 29/59/119 €, différence des offres, livraison 24 h ouvrées, prérequis, garantie 14 jours, RGPD, incidents, paiement). Chute en capture de leads EmailJS si question hors FAQ.
- **SEO** : JSON-LD Product + FAQPage, Open Graph (og:image = og-image.svg), meta description, favicon SVG.
- **Animations** : reveal au scroll (IntersectionObserver, respecte `prefers-reduced-motion`), accordéon FAQ, burger mobile.

## Livraison aux clients (process à tenir)

1. Réception de la commande par email (template EmailJS) — objet : `🆕 Lead Garde-fou IA : <name>`.
2. Réponse sous 24 h ouvrées avec le lien de téléchargement (Google Drive / WeTransfer) : formation en **PDF** (convertir `formation-garde-fou.md` — script `~/Documents/scripts/md2pdf.py`) + templates en `.md`.
3. Facture sur demande. Paiement par virement ou message privé.
4. Mises à jour pendant 12 mois : renvoyer le PDF mis à jour aux acheteurs (liste à tenir dans un tableur).

## Cohérence chiffrée (à ne pas casser)

- Prix : 29 / 59 / 119 € — mêmes montants partout (landing, FAQ, chatbot, JSON-LD, formation).
- « 10 templates en 5 documents » — l'énumération des templates dans l'offre 59 € doit toujours correspondre aux 5 fichiers de `templates/`.
- 7 réflexes = 7 modules de la formation = 7 cartes de la section réflexes de la landing.
- Checklist de déploiement : 10 points — identiques dans la landing, la formation et le template T6.
- Cas réels cités : fuite Samsung (module 2), chatbot Air Canada (module 3), SUV vendu 1 dollar (module 3), notification CNIL 72 h (module 6).
- Fil rouge : Nadia (dirigeante d'Atelier Nadia) et Chloé (agent de relance de factures) — modules 1 à 7.

## Déploiement

Statique → GitHub Pages ou tout hébergement statique. **Ne pas publier tant que le paiement réel n'est pas branché** (Stripe en attente ; le formulaire EmailJS commande, le virement/DM encaisse). Après publication, vérifier : `curl -s https://<user>.github.io/garde-fou-ia/ | grep service_cy1ytdb` et tester le chatbot.

## Vérifications à refaire avant chaque mise en ligne

- [ ] `grep -rli "simulation\|simulé\|mode test\|placeholder\|démo uniquement" .` → 0 résultat
- [ ] `grep -rn "mailto:" index.html` → aucun mailto dans le handler de soumission
- [ ] Orthographe : `python3 ~/.hermes/skills/business/ai-formation-authoring/scripts/verify_ortho_fr.py` sur index.html + formation + templates
- [ ] JSON-LD : les deux blocs (Product, FAQPage) parsent
- [ ] Rendu navigateur : console sans erreur, reveal actif, chatbot fonctionnel, envoi EmailJS (status 200 attendu)
- [ ] Cohérence chiffrée : grep croisé 29 / 59 / 119 / 24 h / 14 jours / 10 templates / 7 réflexes
