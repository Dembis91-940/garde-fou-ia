# Template 1 — Politique d'usage des agents IA

> **Comment utiliser ce template** : remplissez les champs entre crochets `[ ]`, supprimez les notes en italique, faites valider par la direction, datez et signez. Conservez la politique à un endroit connu de tous (drive partagé, intranet). Mettez-la à jour à chaque revue mensuelle.
> **Temps de remplissage** : 45 minutes à 1 heure.

---

## 1. Objet

La présente politique encadre l'utilisation des agents IA au sein de [nom de l'entreprise]. Elle s'applique à tout agent, automatisation ou assistant IA capable d'agir sur des données ou des systèmes de l'entreprise, qu'il soit développé en interne, acheté ou configuré sur une plateforme tierce.

## 2. Champ d'application

- [ ] Tous les salariés, stagiaires, prestataires et sous-traitants qui créent, configurent, supervisent ou utilisent un agent IA.
- [ ] Tous les agents IA, quels que soient l'outil, la plateforme ou le modèle utilisé.

## 3. Principes fondamentaux

L'entreprise applique les **7 réflexes de sécurité** à chaque agent IA :

| Réflexe | Règle |
|---|---|
| Moindre privilège | Chaque agent n'a que les accès strictement nécessaires à sa mission. Aucun compte administrateur par défaut. |
| Données interdites | Chaque agent dispose d'une liste écrite des données hors de son périmètre, avec barrières techniques. |
| Validation humaine | Toute action sensible (envoi, paiement, publication, suppression) est validée par un humain. |
| Journalisation | Chaque action est tracée (qui, quoi, quand, coût, résultat) et les journaux sont conservés [durée, ex. 12 mois]. |
| Limites de coûts | Chaque agent a un plafond par tâche et un budget mensuel, avec alerte et coupe-circuit. |
| Sortie d'incident | Une procédure écrite existe, le coupe-circuit est connu et testé au moins une fois par trimestre. |
| Revue mensuelle | Chaque agent est revu le premier lundi du mois : accès, données, journaux, coûts, valeur. |

## 4. Règles d'usage

1. **Création** : aucun agent n'est mis en production sans passage par la checklist de déploiement (template dédié) et sans inscription au registre des agents.
2. **Accès** : chaque agent possède un compte dédié, jamais un compte humain partagé. Les accès sont accordés par [nom du responsable], jamais par l'agent lui-même.
3. **Données** : les données interdites listées par agent ne doivent jamais être copiées dans le contexte d'un modèle. En cas de doute sur une donnée, on la considère interdite.
4. **Actions** : les actions sensibles suivantes exigent une validation humaine : [liste, ex. : envoi d'email en masse, paiement, publication externe, suppression de données, export]. Les seuils d'approbation sont définis dans le registre.
5. **Coûts** : tout dépassement de budget d'un agent est signalé au responsable [nom]. Le plafond coupe automatiquement l'agent.
6. **Incident** : tout incident (erreur, fuite, comportement anormal, soupçon de prompt injection) est signalé immédiatement à [nom / contact] et traité selon la procédure d'incident. Un incident caché est une faute professionnelle.
7. **Revue** : chaque agent est revu mensuellement. Un agent qui ne justifie plus sa valeur est restreint ou arrêté.

## 5. Données personnelles et RGPD

- Les agents ne traitent que les données personnelles strictement nécessaires à leur mission (principe de minimisation).
- Le registre des agents et la matrice de risques sont tenus à jour : ils servent de documentation de conformité en cas de contrôle.
- En cas de violation de données personnelles, la procédure d'incident s'applique, y compris la notification à la CNIL sous 72 heures si nécessaire.

## 6. Sanctions et responsabilités

- Le responsable de chaque agent est désigné dans le registre. Il répond de la conformité de son agent.
- Toute utilisation d'un agent hors de sa mission déclarée, tout contournement des validations ou des plafonds, expose l'auteur aux sanctions prévues par le règlement intérieur.
- Les journaux constituent des preuves : leur modification ou leur suppression est interdite.

## 7. Entrée en vigueur et révision

- Date d'entrée en vigueur : [date]
- Révision prévue : [date / fréquence]
- Validée par : [nom, fonction, signature]

---

# Template 2 — Registre des agents

> **Comment utiliser ce template** : un tableau par agent (ou un tableau unique avec une ligne par agent). Complétez chaque colonne, datez chaque modification, et relisez l'ensemble à chaque revue mensuelle.
> **Temps de remplissage** : 10 minutes par agent.

## Tableau principal

| Agent | Mission (1 phrase) | Outils / plateforme | Modèle | Compte dédié | Accès accordés | Données interdites | Budget mensuel | Responsable | Statut | Prochaine revue |
|---|---|---|---|---|---|---|---|---|---|---|
| Ex. : Chloé | Relancer les factures impayées | [plateforme] | [modèle] | chloe@[domaine] | Boîte dédiée, facturation (lecture) | Cartes bancaires, santé, contrats | 60 € | Nadia | Actif | 1er lundi du mois |
| [nom] | [mission] | [outil] | [modèle] | [compte] | [accès] | [données] | [budget] | [responsable] | Actif / En test / Arrêté | [date] |
| [nom] | [mission] | [outil] | [modèle] | [compte] | [accès] | [données] | [budget] | [responsable] | Actif / En test / Arrêté | [date] |

## Liste des données interdites (par agent)

| Agent | Données interdites | Barrière technique en place | Vérifiée le |
|---|---|---|---|
| [nom] | Mots de passe et clés API ; données de santé ; fichiers « salaires* » ; contrats en négociation | Accès refusé (permissions) + filtre sur la boîte | [date] |
| [nom] | [liste] | [accès / filtre / validation humaine] | [date] |

## Seuils de validation humaine (par agent)

| Agent | Action validée systématiquement | Seuil d'approbation | Validateur | Testé le |
|---|---|---|---|---|
| [nom] | Envoi d'email en masse | Au-delà de [N] destinataires ou [montant] € | [nom] | [date] |
| [nom] | Paiement | Tout montant | [nom] | [date] |

## Historique des revues mensuelles

| Date | Agent | Accès retirés | Données ajoutées aux interdites | Budget ajusté | Décision (conserver / restreindre / arrêter) | Signature |
|---|---|---|---|---|---|---|
| [date] | [nom] | [liste] | [liste] | [avant → après] | [décision] | [nom] |
| [date] | [nom] | [liste] | [liste] | [avant → après] | [décision] | [nom] |

---

*Document livré avec le pack Garde-fou IA — formation « Les 7 réflexes de sécurité » (module 1 et module 7).*
