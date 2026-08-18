# Procédure d'incident — version entreprise

> **À qui s'adresse ce document** : aux entreprises qui déploient plusieurs agents, avec plusieurs équipes et des obligations renforcées (données personnelles, clients professionnels, secteur réglementé).
> **Complément du pack** : ce document complète la procédure d'incident standard (template 8) et la fiche d'incident (template 9). Il ajoute la gouvernance : rôles RACI, cellule de crise, escalade, communication et obligations CNIL. Conservez les deux documents ensemble.
> **Temps de remplissage** : 1 h à 1 h 30, avec le responsable sécurité / DPO si vous en avez un.

---

## 1. Gouvernance : rôles RACI

RACI = **R**esponsable (fait), **A**pprobateur (valide), **C**onsulté (donne son avis), **I**nformé (est tenu au courant).

| Tâche | Directeur sécurité / DPO | Responsable de l'agent | Équipe exploitation | Direction | Communication | Juridique |
|---|---|---|---|---|---|---|
| Décision de coupure | A | R | C | I | I | I |
| Exécution de la coupure | A | C | R | I | I | I |
| Analyse de la portée | R | C | C | I | I | C |
| Décision de notification CNIL | A | I | I | C | C | R |
| Communication clients | A | C | I | C | R | C |
| Compte rendu d'incident | A | R | C | I | I | I |
| Actions correctives | A | R | C | I | I | I |

**Remplissez les noms** :

| Rôle | Nom | Contact | Remplacement |
|---|---|---|---|
| Directeur sécurité / DPO | [nom] | [contact] | [nom] |
| Responsables d'agents (par périmètre) | [nom / périmètre] | [contact] | [nom] |
| Équipe exploitation | [nom] | [contact] | [nom] |
| Communication | [nom] | [contact] | [nom] |
| Juridique | [nom / cabinet] | [contact] | [nom] |

## 2. Seuils d'escalade

| Gravité | Définition | Escalade | Décision |
|---|---|---|---|
| Faible | Erreur interne corrigée, aucun tiers touché, aucun coût significatif | Responsable de l'agent | Traitement en routine, mention en revue mensuelle |
| Moyenne | Un tiers touché (client), coût < 5 000 €, pas de donnée personnelle sensible | + Directeur sécurité | Correction + communication client |
| Élevée | Données personnelles divulguées, coût 5 000 € à 50 000 €, plusieurs clients | + Direction + Juridique | Évaluation CNIL sous 72 h, communication structurée |
| Critique | Données sensibles, coût > 50 000 €, risque juridique, activité impactée | Cellule de crise complète | Plan de crise, communication externe, DPO + CNIL |

## 3. Cellule de crise

Déclenchée pour toute gravité « élevée » ou « critique ». Membre permanent : [directeur sécurité / DPO], [responsable de l'agent], [communication], [juridique], [direction].

**Première réunion, dans les 30 minutes** : coupure confirmée, portée provisoire, communication minimale, répartition des tâches (RACI), prochaine réunion fixée (au plus tard 4 h après).

**Règles de la cellule** :
- Une seule voix vers l'extérieur : [nom / fonction] communique, personne d'autre ne parle aux clients ou aux médias sans validation.
- Toute information vers l'extérieur est écrite, relue par [juridique], et datée.
- Les journaux et décisions de la cellule sont consignés (ils serviront au compte rendu et, le cas échéant, à la CNIL).
- La cellule se dissout uniquement après : correction testée, communication envoyée, compte rendu rédigé.

## 4. Communication

### Interne
Annonce immédiate : [modèle, ex. : « Incident en cours sur l'agent X — coupé depuis [heure]. Périmètre : [données]. Consigne : ne pas relancer l'agent, ne pas manipuler les journaux. Point d'étape à [heure]. »]

Mise à jour : [canal interne, fréquence — ex. : deux points par jour tant que la cellule de crise est active].

### Clients (si concernés)
Message type : « Nous avons détecté une anomalie affectant [description] le [date]. Nous avons immédiatement stoppé le système concerné. [Information exacte / correction]. Vos données : [portée réelle]. Un contact dédié vous répond : [nom, coordonnées]. Nous vous présentons nos excuses. »

Règle : jamais de spéculation sur la cause tant que l'analyse n'est pas validée ; on communique les faits, la portée réelle et les mesures prises.

### Externe (médias, partenaires)
Uniquement via [nom / fonction], avec validation [juridique]. Déclaration type : [« Nous confirmons un incident limité à [périmètre]. Il est maîtrisé. Les autorités compétentes ont été informées [le cas échéant]. »]

## 5. Obligations CNIL (RGPD)

- **Notification sous 72 heures** : toute violation de données personnelles est notifiée à la CNIL dans les 72 heures suivant la prise de connaissance, sauf si le risque pour les personnes est faible (appréciation documentée).
- **Contenu de la notification** : nature de la violation, catégories et nombre de personnes concernées, conséquences probables, mesures prises, coordonnées du délégué à la protection des données ou du contact.
- **Information des personnes** : si le risque est élevé, les personnes concernées sont informées directement, avec des conseils de protection.
- **Registre des violations** : chaque violation est consignée (date, faits, effets, mesures) — c'est la fiche d'incident du pack, complétée.
- **Documentation** : la matrice de risques, le registre des agents et les journaux constituent les éléments de démonstration de votre diligence en cas de contrôle.

**Contact CNIL** : https://www.cnil.fr — portail de notification des violations de données.

## 6. Tests et exercices

- **Test trimestriel du coupe-circuit** : chaque trimestre, coupez réellement un agent de production (ou un miroir) et mesurez le temps de coupure. Objectif : moins de 5 minutes.
- **Exercice annuel de crise** : un exercice « table » d'une heure avec la cellule de crise, sur un scénario critique (ex. : fuite de données sensibles détectée un vendredi soir). Corrigez la procédure avec les enseignements.
- **Revue de la procédure** : la procédure d'incident est relue après chaque incident et au moins une fois par an, en même temps que la revue mensuelle de janvier.

---

*Document livré avec le pack Garde-fou IA — offre Entreprise. Formation « Les 7 réflexes de sécurité » (module 6).*
