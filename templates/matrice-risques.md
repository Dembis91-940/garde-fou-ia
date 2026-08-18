# Template 10 — Matrice de risques

> **Comment utiliser ce template** : pour chaque agent, listez les scénarios de risque réalistes. Cotez la probabilité et l'impact de 1 à 5, multipliez-les pour obtenir le score de criticité, puis décidez des mesures (et de leur responsable). Relisez la matrice à chaque revue mensuelle et après chaque incident.
> **Temps de remplissage** : 30 à 45 minutes par agent, en réunissant 2 à 3 personnes (dont une qui ne connaît pas l'agent : elle pose les bonnes questions).

---

## 1. Échelles de cotation

### Probabilité (P) — de 1 à 5
| Note | Signification |
|---|---|
| 1 | Improbable (jamais vu, nécessite des conditions très particulières) |
| 2 | Peu probable (rare, mais déjà observé) |
| 3 | Possible (peut arriver dans l'année) |
| 4 | Probable (déjà arrivé, ou configuration à risque) |
| 5 | Quasi certain (arrive régulièrement sans mesure) |

### Impact (I) — de 1 à 5
| Note | Signification |
|---|---|
| 1 | Négligeable (gêne mineure, aucun coût significatif) |
| 2 | Mineur (coût < 500 €, perte de temps, un client mécontent) |
| 3 | Modéré (coût 500 € à 5 000 €, atteinte à la réputation, plusieurs clients) |
| 4 | Majeur (coût 5 000 € à 50 000 €, donnée personnelle divulguée, notification CNIL) |
| 5 | Critique (coût > 50 000 €, données sensibles divulguées, mise en cause juridique, arrêt d'activité) |

### Criticité (C = P × I) et priorité
| Score | Niveau | Action |
|---|---|---|
| 1 à 4 | Faible | Surveiller lors de la revue mensuelle |
| 5 à 9 | Moyen | Mesure de réduction à planifier sous 30 jours |
| 10 à 16 | Élevé | Mesure de réduction sous 7 jours, responsable désigné |
| 17 à 25 | Critique | Action immédiate : l'agent est restreint ou arrêté tant que le risque n'est pas réduit |

---

## 2. Matrice par agent

**Agent** : [nom] — **Mission** : [mission] — **Responsable** : [nom] — **Mise à jour le** : [date]

| # | Scénario de risque | P | I | C (P×I) | Niveau | Mesure de réduction | Responsable | Échéance | Statut |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Ex. : fuite de données personnelles par réponse à un email piégé | 3 | 4 | 12 | Élevé | Liste de données interdites + accès restreints + signalement des demandes hors périmètre (modules 2 et 3 de la formation) | [nom] | [date] | En cours / Fait |
| 2 | Ex. : envoi d'un mauvais montant à un client | 4 | 3 | 12 | Élevé | Validation humaine sur tout envoi (template prompt 5) + test de refus avant déploiement | [nom] | [date] | Fait |
| 3 | Ex. : coût mensuel explosif (boucle) | 3 | 2 | 6 | Moyen | Plafond par tâche + budget mensuel + alerte à 80 % (module 5) | [nom] | [date] | Fait |
| 4 | [scénario] | | | | | [mesure] | [nom] | [date] | |
| 5 | [scénario] | | | | | [mesure] | [nom] | [date] | |
| 6 | [scénario] | | | | | [mesure] | [nom] | [date] | |

**Risques résiduels acceptés** (après mesures, criticité ≤ 4) : [liste, avec justification — ex. : « coût d'une tâche individuelle erronée sans envoi : aucune sortie vers l'extérieur possible »]

---

## 3. Scénarios types à ne pas oublier

Puisque l'oubli est le premier risque, voici la liste de contrôle des scénarios à examiner pour chaque agent :

- [ ] Fuite de données personnelles (réponse, envoi, pièce jointe, email piégé)
- [ ] Fuite de secrets (mot de passe, clé API, token) dans une réponse ou un log
- [ ] Envoi erroné (mauvais destinataire, mauvais montant, contenu faux, hallucination)
- [ ] Action non autorisée (paiement, suppression, publication, modification de données)
- [ ] Prompt injection (instruction cachée dans un email, un fichier, une page web)
- [ ] Boucle coûteuse (agent qui tourne sans fin, budget explosé)
- [ ] Dépendance cachée (un autre système ou une autre équipe s'appuie sur l'agent sans le savoir)
- [ ] Accès oublié (collaborateur parti, accès élargi pour un projet, compte partagé)
- [ ] Donnée mal classée (fichier sensible rangé dans un dossier autorisé)
- [ ] Non-disponibilité (l'agent tombe en panne : qui s'en aperçoit, que se passe-t-il ?)

---

*Document livré avec le pack Garde-fou IA — formation « Les 7 réflexes de sécurité » (modules 1, 6 et 7).*
