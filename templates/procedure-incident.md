# Templates 8 et 9 — Procédure d'incident et fiche d'incident

> **Comment utiliser ces templates** : remplissez la procédure maintenant (30 minutes), avant le premier incident. Testez le coupe-circuit. À chaque incident, remplissez une fiche d'incident et archivez-la avec les journaux. La version « entreprise » du pack (rôles RACI, cellule de crise, communication, obligations CNIL) se trouve dans le document `procedure-incident-entreprise.md`.

---

# Template 8 — Procédure d'incident

## 1. Rôles (même en solo, écrivez-les)

| Rôle | Personne | Contact (tel / email) | Remplacement |
|---|---|---|---|
| Décideur de coupure | [nom] | [contact] | [nom] |
| Responsable de l'agent concerné | [nom] | [contact] | [nom] |
| Contact clients | [nom] | [contact] | [nom] |
| Rédacteur du compte rendu | [nom] | [contact] | [nom] |
| Contact CNIL / juridique (le cas échéant) | [nom / service] | [contact] | [nom] |

## 2. Qu'est-ce qu'un incident ?

Signalez immédiatement : envoi erroné (mauvais montant, mauvais destinataire, contenu faux), accès anormal à des données, comportement hors périmètre, soupçon de prompt injection, coût anormal, agent qui tourne en boucle, toute action non autorisée détectée dans les journaux.

## 3. Les six étapes

### Étape 1 — DÉTECTER
- [ ] Décrire le signalement : quoi, quand, par qui, quel agent.
- [ ] Ouvrir la fiche d'incident (template 9) et noter l'heure exacte de détection (**elle fait foi**).

### Étape 2 — STOPPER (réflexe n° 1 : arrêter la casse)
- [ ] Couper l'agent : [mode d'emploi exact du coupe-circuit, ex. : « bouton Arrêter dans la plateforme X, ou révocation de l'accès Y »].
- [ ] Révoquer les accès sensibles si nécessaire : [liste des accès à révoquer en urgence].
- [ ] Bloquer les envois si nécessaire : [méthode].
- [ ] Noter l'heure de coupure dans la fiche.

### Étape 3 — PRÉSERVER les preuves
- [ ] Geler les journaux : [où, comment — ex. : export des journaux vers un dossier « Incidents » non modifiable].
- [ ] Copier les traces : contenu envoyé, prompt en vigueur (version), configuration, accès.
- [ ] NE RIEN MODIFIER avant la copie : ni prompt, ni accès, ni journaux.

### Étape 4 — ÉVALUER la portée
- [ ] Quelles données ont été touchées ? [personnelles / sensibles / secrets / autres]
- [ ] Quels clients, quels montants, quels destinataires ?
- [ ] Qui doit être prévenu ? [interne / client(s) / CNIL sous 72 h si données personnelles / assurance]
- [ ] Gravité : [faible / moyenne / élevée / critique] (voir matrice de risques).

### Étape 5 — CORRIGER
- [ ] Corriger la cause : [accès, prompt, seuil, configuration…].
- [ ] Tester la correction : rejouer le scénario, vérifier que l'incident ne se reproduit pas.
- [ ] Remettre l'agent en service SEULEMENT après test concluant, avec l'accord du décideur.

### Étape 6 — APPRENDRE
- [ ] Écrire le compte rendu (fiche d'incident complétée) dans les 48 heures.
- [ ] Identifier la cause racine (pourquoi, pas qui).
- [ ] Lister les actions de prévention (au moins une) et leur échéance.
- [ ] Mettre à jour : registre, données interdites, seuils, prompts, cette procédure.
- [ ] Partager la leçon avec l'équipe (sans blâme) — c'est le rôle de la revue mensuelle suivante.

## 4. Messages types

**Interne** : « Incident sur l'agent [nom] — [description courte]. Il est arrêté depuis [heure]. Données touchées : [portée]. Correction en cours, compte rendu sous 48 h. Ne relancez pas l'agent. »

**Client** : « Nous avons détecté une anomalie dans un message envoyé par notre assistant [date]. Nous vous présentons nos excuses : [correction / information exacte]. Votre dossier est traité par [contact] : [coordonnées]. »

**CNIL (si données personnelles, sous 72 h)** : « Notification de violation de données personnelles — [entreprise], incident du [date], agent [nom], données concernées : [catégories], mesures prises : [coupure, correction], personnes concernées : [nombre, le cas échéant]. Contact : [nom, coordonnées]. »

## 5. Coupe-circuit : test trimestriel

| Date du test | Agent | Temps pour couper | Problème rencontré | Corrigé le |
|---|---|---|---|---|
| [date] | [nom] | [durée] | [aucun / détail] | [date] |
| [date] | [nom] | [durée] | [aucun / détail] | [date] |

---

# Template 9 — Fiche d'incident

*Une fiche par incident. À remplir pendant l'incident (étapes 1 à 4) et compléter dans les 48 h (étapes 5 et 6).*

| Champ | Réponse |
|---|---|
| Numéro de fiche | [INC-2026-00X] |
| Date et heure de détection | [date — heure] |
| Date et heure de coupure | [date — heure] |
| Agent concerné | [nom, version du prompt] |
| Signalé par | [nom] |
| Description du fait | [ce qui s'est passé, factuel] |
| Données touchées | [catégories : personnelles / sensibles / secrets / autres — détail] |
| Personnes ou clients touchés | [nombre, catégories] |
| Cause racine | [pourquoi — pas qui] |
| Gravité | [faible / moyenne / élevée / critique] |
| Étape de la procédure où la détection a eu lieu | [journal / alerte / client / validation refusée…] |
| Actions d'arrêt réalisées | [coupure, révocation, blocage — avec heures] |
| Preuves préservées | [où sont les journaux et traces] |
| Corrections apportées | [accès, prompt, seuil, configuration] |
| Test de non-reproduction | [résultat du rejeu du scénario] |
| Actions de prévention | [au moins une — avec échéance et responsable] |
| Notification | [interne ☐ / client(s) ☐ / CNIL ☐ / assurance ☐ — date et heure] |
| Compte rendu rédigé le | [date] |
| Validé par | [nom, signature] |

**Leçon en une phrase** (à partager en revue mensuelle) : ________________________________

---

*Documents livrés avec le pack Garde-fou IA — formation « Les 7 réflexes de sécurité » (module 6).*
