/* ============================================================================
   Garde-fou IA — Module Gouvernance des agents
   gouvernance-calc.js — logique de calcul pure (aucune donnée ne quitte le poste)

   Utilisable dans le navigateur (window.GOVCALC) ET en Node (module.exports)
   pour être testé. Zéro dépendance, zéro appel réseau.

   Trois moteurs :
     1) Coûts des agents (FinOps)   : coût/appel, coût mensuel, alertes, budget
     2) Registre MCP                : score de risque d'un serveur MCP
     3) Export                      : CSV (Excel FR) + table Markdown
   ========================================================================= */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.GOVCALC = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 1. COÛTS DES AGENTS
   * ------------------------------------------------------------------ */

  /** Coût d'un appel en devise du fournisseur (prix pour 1 million de tokens).
   *  coutParAppel(12000, 800, 2.5, 10) => 0.038 $ */
  function coutParAppel(tokensIn, tokensOut, prixIn, prixOut) {
    var i = Number(tokensIn) || 0, o = Number(tokensOut) || 0;
    var pi = Number(prixIn) || 0, po = Number(prixOut) || 0;
    if (i < 0 || o < 0 || pi < 0 || po < 0) return 0;
    return (i / 1e6) * pi + (o / 1e6) * po;
  }

  /** Coût mensuel d'un agent, en euros.
   *  agent = { nom, tokensIn, tokensOut, appelsJour, prixIn, prixOut } */
  function coutMensuelAgent(agent, opts) {
    opts = opts || {};
    var jours = num(opts.joursMois, 30);
    var taux = num(opts.taux, 1);
    var appels = num(agent.appelsJour, 0);
    var parAppel = coutParAppel(agent.tokensIn, agent.tokensOut, agent.prixIn, agent.prixOut);
    return parAppel * appels * jours * taux;
  }

  /** Cout annuel (x12 mois). */
  function coutAnnuelAgent(agent, opts) {
    return coutMensuelAgent(agent, opts) * 12;
  }

  /** Plafond quotidien à afficher sur la console de l'agent (budget / jours). */
  function plafondQuotidien(budgetMensuel, joursMois) {
    var b = num(budgetMensuel, 0), j = num(joursMois, 30) || 30;
    if (b <= 0) return 0;
    return b / j;
  }

  /** Plafond par appel : au-delà, l'agent doit s'arrêter (protection anti-boucle). */
  function plafondParAppel(budgetMensuel, joursMois, appelsJour) {
    var a = num(appelsJour, 0);
    if (a <= 0) return 0;
    return plafondQuotidien(budgetMensuel, joursMois) / a;
  }

  /** Statut d'un agent par rapport au budget mensuel. */
  function statutAgent(coutMensuel, budgetMensuel) {
    var b = num(budgetMensuel, 0), c = num(coutMensuel, 0);
    if (b <= 0) return 'ok';                 // pas de budget = pas de jugement
    var part = c / b;
    if (part > 0.5) return 'critique';
    if (part > 0.2) return 'surveiller';
    return 'ok';
  }

  /** Analyse complète d'un portefeuille d'agents.
   *  analysePortefeuille(agents, { budgetMensuel, joursMois, taux }) */
  function analysePortefeuille(agents, opts) {
    opts = opts || {};
    var jours = num(opts.joursMois, 30);
    var taux = num(opts.taux, 1);
    var budget = num(opts.budgetMensuel, 0);

    var lignes = (agents || []).map(function (a) {
      var cout = coutMensuelAgent(a, { joursMois: jours, taux: taux });
      return {
        nom: a.nom || '(sans nom)',
        coutMensuel: cout,
        coutAnnuel: cout * 12,
        appelsMois: num(a.appelsJour, 0) * jours,
        statut: statutAgent(cout, budget)
      };
    });

    var total = lignes.reduce(function (s, l) { return s + l.coutMensuel; }, 0);
    lignes.forEach(function (l) {
      l.partPct = total > 0 ? (l.coutMensuel / total) * 100 : 0;
      l.partBudgetPct = budget > 0 ? (l.coutMensuel / budget) * 100 : 0;
    });
    lignes.sort(function (a, b) { return b.coutMensuel - a.coutMensuel; });

    var alertes = [];
    if (budget <= 0) {
      alertes.push("Aucun budget mensuel saisi : impossible de déclencher l'alerte de coupure. Fixez un budget par agent (onglet « Budget »).");
    } else if (total > budget) {
      alertes.push('Budget dépassé de ' + fmt(total - budget) + ' € / mois. Appliquez la règle de coupure : plafond quotidien ' +
        fmt(plafondQuotidien(budget, jours)) + ' € par équipe, et coupez les agents en statut « critique ».');
    }
    var critiques = lignes.filter(function (l) { return l.statut === 'critique'; });
    var surveiller = lignes.filter(function (l) { return l.statut === 'surveiller'; });
    if (critiques.length) {
      alertes.push('Agent(s) au-dessus de 50 % du budget : ' + critiques.map(function (l) { return l.nom + ' (' + fmt(l.coutMensuel) + ' €)'; }).join(', ') +
        ' → plafond par appel ' + fmt(plafondParAppel(budget, jours, 1)) + ' € x appels/jour de l\'agent.');
    }
    if (total > 0 && !critiques.length && surveiller.length) {
      alertes.push('À surveiller (20–50 % du budget) : ' + surveiller.map(function (l) { return l.nom; }).join(', ') + '.');
    }
    if (total > 0) {
      var top = lignes[0];
      alertes.push('Agent le plus coûteux : ' + top.nom + ' — ' + fmt(top.coutMensuel) + ' €/mois (' +
        fmt(top.partPct) + ' % du total). Vérifiez d\'abord ses tokens de sortie : ce sont les plus chers.');
    }

    return {
      lignes: lignes,
      totalMensuel: total,
      totalAnnuel: total * 12,
      budgetMensuel: budget,
      reste: budget - total,
      depassement: budget > 0 && total > budget,
      partBudgetPct: budget > 0 ? (total / budget) * 100 : 0,
      plafondJour: plafondQuotidien(budget, jours),
      seuilAlerte80: budget * 0.8,
      seuilCoupure: budget,
      alertes: alertes
    };
  }

  /* ------------------------------------------------------------------ *
   * 2. REGISTRE MCP — score de risque d'un serveur MCP
   * ------------------------------------------------------------------ */

  var POIDS = {
    ecriture: 2,        // peut modifier des données
    suppression: 3,     // peut supprimer
    donneesPerso: 2,    // touche des données personnelles
    secrets: 2,         // accès à des secrets / identifiants
    authAucune: 4,
    authCle: 2,
    editeurInconnu: 2,  // serveur communautaire / non maintenu
    nonJournalise: 2,   // aucun log des appels d'outils
    reseauPublic: 1,    // exposé sur Internet
    horsUE: 1,          // transfert hors UE
    sansPlafond: 1      // usage facturé sans plafond
  };

  /** scoreRisqueMCP({ecriture, suppression, donneesPerso, secrets, auth, editeur, journalise, reseau, zone, plafond}) */
  function scoreRisqueMCP(s) {
    s = s || {};
    var score = 0, raisons = [];
    function add(poids, texte) { score += poids; raisons.push(texte); }

    if (s.ecriture) add(POIDS.ecriture, 'Peut modifier des données (+2)');
    if (s.suppression) add(POIDS.suppression, 'Peut supprimer des données (+3)');
    if (s.donneesPerso) add(POIDS.donneesPerso, 'Accède à des données personnelles (+2)');
    if (s.secrets) add(POIDS.secrets, 'Accède à des secrets ou identifiants (+2)');

    if (s.auth === 'aucune') add(POIDS.authAucune, 'Aucune authentification (+4)');
    else if (s.auth === 'cle') add(POIDS.authCle, 'Authentification par clé statique (+2)');
    else if (s.auth === 'oauth') raisons.push('Authentification OAuth, révocable (0)');
    else add(POIDS.authCle, 'Authentification non précisée (+2)');

    if (s.editeur === 'inconnu' || s.editeur === 'communautaire') add(POIDS.editeurInconnu, 'Éditeur communautaire ou non maintenu (+2)');
    if (s.journalise === false) add(POIDS.nonJournalise, 'Aucun journal des appels d\'outils (+2)');
    if (s.reseau === 'public') add(POIDS.reseauPublic, 'Exposé sur Internet (+1)');
    if (s.zone === 'horsUE') add(POIDS.horsUE, 'Données transférées hors UE (+1)');
    if (s.plafond === false) add(POIDS.sansPlafond, 'Usage facturé sans plafond (+1)');

    var niveau = score >= 7 ? 'élevé' : (score >= 4 ? 'moyen' : 'faible');
    var decision = niveau === 'élevé'
      ? 'Refuser ou isoler : sandbox, accès lecture seule, validation humaine obligatoire.'
      : (niveau === 'moyen'
        ? 'Accepter avec conditions : permissions limitées, journalisation activée, revue trimestrielle.'
        : 'Accepter : vérifier la maintenance et le plan de sortie à la prochaine revue.');

    return { score: score, niveau: niveau, decision: decision, raisons: raisons };
  }

  /* ------------------------------------------------------------------ *
   * 3. EXPORTS
   * ------------------------------------------------------------------ */

  /** CSV compatible Excel FR (séparateur ; + BOM UTF-8). */
  function versCSV(lignes) {
    var sep = ';';
    return '\uFEFF' + (lignes || []).map(function (l) {
      return l.map(function (c) {
        var v = c === null || c === undefined ? '' : String(c);
        return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      }).join(sep);
    }).join('\r\n') + '\r\n';
  }

  /** Table Markdown d'un registre MCP (document de gouvernance). */
  function versMarkdownRegistre(serveurs) {
    var t = ['| Serveur | Éditeur | Outils exposés | Accès | Auth | Score risque | Niveau | Décision | Revue |',
      '|---|---|---|---|---|---|---|---|---|'];
    (serveurs || []).forEach(function (s) {
      var r = scoreRisqueMCP(s);
      var acces = [s.ecriture ? 'écriture' : 'lecture', s.suppression ? 'suppression' : '', s.donneesPerso ? 'données perso' : '']
        .filter(Boolean).join(', ');
      t.push('| ' + [s.nom || '', s.editeur || '', s.outils || '', acces, s.auth || '', r.score, r.niveau, r.decision, s.revue || ''].join(' | ') + ' |');
    });
    return t.join('\n');
  }

  function versMarkdownCouts(analyse, opts) {
    opts = opts || {};
    var t = ['| Agent | Appels/mois | Coût mensuel | Coût annuel | Part du budget | Statut |', '|---|---|---|---|---|---|'];
    (analyse.lignes || []).forEach(function (l) {
      t.push('| ' + [l.nom, fmt(l.appelsMois), fmt(l.coutMensuel) + ' €', fmt(l.coutAnnuel) + ' €',
        fmt(l.partBudgetPct) + ' %', l.statut].join(' | ') + ' |');
    });
    t.push('| **TOTAL** |  | **' + fmt(analyse.totalMensuel) + ' €** | **' + fmt(analyse.totalAnnuel) + ' €** | **' +
      fmt(analyse.partBudgetPct) + ' %** | ' + (analyse.depassement ? 'dépassé' : 'dans le budget') + ' |');
    if (analyse.budgetMensuel > 0) {
      t.push('');
      t.push('Budget : ' + fmt(analyse.budgetMensuel) + ' €/mois · Plafond quotidien : ' + fmt(analyse.plafondJour) +
        ' € · Seuil d\'alerte (80 %) : ' + fmt(analyse.seuilAlerte80) + ' €');
    }
    return t.join('\n');
  }

  /* ------------------------------------------------------------------ *
   * Utilitaires
   * ------------------------------------------------------------------ */

  function num(v, def) {
    var n = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : v;
    return (typeof n === 'number' && isFinite(n)) ? n : def;
  }

  /** Format français : 1 234,56 */
  function fmt(v) {
    var n = num(v, 0);
    var s = n.toFixed(2);
    var parts = s.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
    return parts.join(',');
  }

  /** Prix par défaut (indicatifs, modifiables) — par million de tokens. */
  var MODELES_DEFAUT = [
    { id: 'petit', nom: 'Petit modèle (rapide, économique)', prixIn: 0.20, prixOut: 0.80 },
    { id: 'intermediaire', nom: 'Modèle intermédiaire (usage général)', prixIn: 2.50, prixOut: 10.00 },
    { id: 'raisonnement', nom: 'Modèle de raisonnement (haut de gamme)', prixIn: 10.00, prixOut: 40.00 },
    { id: 'local', nom: 'Modèle local sur site (0 € de tokens)', prixIn: 0, prixOut: 0 }
  ];

  return {
    coutParAppel: coutParAppel,
    coutMensuelAgent: coutMensuelAgent,
    coutAnnuelAgent: coutAnnuelAgent,
    plafondQuotidien: plafondQuotidien,
    plafondParAppel: plafondParAppel,
    statutAgent: statutAgent,
    analysePortefeuille: analysePortefeuille,
    scoreRisqueMCP: scoreRisqueMCP,
    versCSV: versCSV,
    versMarkdownRegistre: versMarkdownRegistre,
    versMarkdownCouts: versMarkdownCouts,
    MODELES_DEFAUT: MODELES_DEFAUT,
    POIDS_RISQUE: POIDS,
    fmt: fmt
  };
});
