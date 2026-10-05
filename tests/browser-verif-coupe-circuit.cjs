/* ============================================================
   Vérification navigateur RÉELLE (Chromium headless local, CDP brut)
   pour le module Coupe-circuit du pack Garde-fou IA.

   Usage :  node tests/browser-verif-coupe-circuit.cjs [baseUrl]
   Prérequis : python3 -m http.server dans le dossier du site.

   Contrôles (sans jamais envoyer d'email réel : stub EmailJS) :
     - erreurs console / exceptions JS
     - chatbot-config chargé au runtime (nom + accent) et bouton présent
     - formulaire de commande : chemin succès (payload capturé) + chemin d'erreur
     - débordement horizontal mobile 390 px
     - chevauchements de texte (intersection > 35 %, paires parent/enfant exclues)
   ============================================================ */
'use strict';
const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const PORT = 9345;
const BASE = process.argv[2] || 'http://localhost:8765';

const PAGES = [
  { name: 'coupe-circuit', url: '/coupe-circuit.html' },
  { name: 'index', url: '/index.html' },
  { name: 'gouvernance-agents', url: '/gouvernance-agents.html' }
];

function findShell() {
  const cache = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  const dirs = fs.readdirSync(cache).filter(d => d.startsWith('chromium_headless_shell-'));
  if (!dirs.length) throw new Error('Aucun chromium_headless_shell en cache');
  const out = [];
  for (const d of dirs) {
    for (const sub of fs.readdirSync(path.join(cache, d))) {
      const p = path.join(cache, d, sub, 'chrome-headless-shell');
      if (fs.existsSync(p)) out.push(p);
    }
  }
  return out[0];
}

const browser = spawn(findShell(), [
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=/tmp/cdp-verif-coupe-circuit',
  '--no-first-run', '--no-default-browser-check', '--disable-gpu',
  'about:blank'
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      if (list.length) return list[0].webSocketDebuggerUrl;
    } catch (e) {}
    await sleep(250);
  }
  throw new Error('CDP endpoint indisponible');
}

let msgId = 0;
const pending = new Map();
async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  const send = (method, params = {}) => {
    const id = ++msgId;
    return new Promise(r => { pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
  };
  return { ws, send };
}

async function evalJs(cdp, expression) {
  const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.result && r.result.exceptionDetails) {
    return { __error: (r.result.exceptionDetails.exception || {}).description || r.result.exceptionDetails.text };
  }
  return r.result.result.value;
}

const PROBE = `JSON.stringify({
  title: document.title,
  chatCfg: window.CHATBOT_CONFIG ? { name: window.CHATBOT_CONFIG.name, accent: window.CHATBOT_CONFIG.accent, faqs: (window.CHATBOT_CONFIG.faqs||[]).length } : null,
  chatBtn: !!document.querySelector('#cb-btn'),
  chatPanelColor: (function(){ var p = document.getElementById('cb-panel'); if(!p) return null; var s=getComputedStyle(p); return { color:s.color, bg:s.backgroundColor }; })(),
  sections: document.querySelectorAll('section').length,
  forms: document.querySelectorAll('form').length,
  ccLinks: document.querySelectorAll('a[href="coupe-circuit.html"]').length,
  ldjson: Array.prototype.map.call(document.querySelectorAll('script[type="application/ld+json"]'), function(s){ try{ JSON.parse(s.textContent); return 'OK'; }catch(e){ return 'KO:'+e.message; } }),
  scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth
})`;

const MOBILE = `(function(){ return JSON.stringify({ scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth }); })()`;

const OVERLAP = `(function(){
  function vis(e){ var s=getComputedStyle(e); if(s.display==='none'||s.visibility==='hidden') return false;
    var r=e.getBoundingClientRect(); return r.width>2 && r.height>2; }
  var els=[].slice.call(document.querySelectorAll('body *')).filter(function(e){
    if(!vis(e)) return false; var t=(e.textContent||'').trim(); if(!t) return false;
    if(e.children.length===0 && t.length<2) return false;
    if(e.scrollHeight===0) return false;
    var pos=getComputedStyle(e).position; if(pos==='fixed'||pos==='absolute') return false;
    return true; });
  var out=[];
  for(var i=0;i<els.length;i++){
    for(var j=i+1;j<els.length;j++){
      var a=els[i],b=els[j];
      if(a.contains(b)||b.contains(a)) continue;
      var ra=a.getBoundingClientRect(), rb=b.getBoundingClientRect();
      var ix=Math.max(0,Math.min(ra.right,rb.right)-Math.max(ra.left,rb.left));
      var iy=Math.max(0,Math.min(ra.bottom,rb.bottom)-Math.max(ra.top,rb.top));
      if(ix>4&&iy>4){
        var inter=ix*iy, small=Math.min(ra.width*ra.height, rb.width*rb.height);
        if(inter/small>0.35) out.push({a:a.tagName+'.'+a.className.toString().slice(0,30), b:b.tagName+'.'+b.className.toString().slice(0,30), ratio:+(inter/small).toFixed(2)});
      }
    }
  }
  return JSON.stringify(out.slice(0,12));
})()`;

(async () => {
  let cdp; const rapport = []; let echecs = 0;
  try {
    cdp = await connect(await getWsUrl());
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable');
    const erreurs = [];
    cdp.ws.addEventListener('message', ev => {
      const m = JSON.parse(ev.data);
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') erreurs.push(m.params.entry.text.slice(0, 200));
      if (m.method === 'Runtime.exceptionThrown') erreurs.push('EXC: ' + ((m.params.exceptionDetails.exception || {}).description || m.params.exceptionDetails.text).slice(0, 200));
    });

    for (const p of PAGES) {
      erreurs.length = 0;
      await cdp.send('Page.navigate', { url: BASE + p.url });
      await sleep(2200);
      const probe = await evalJs(cdp, PROBE);
      const overlaps = await evalJs(cdp, OVERLAP);
      const entry = { page: p.name, probe, overlaps: JSON.parse(overlaps || '[]'), consoleErrors: erreurs.slice() };

      if (p.name === 'coupe-circuit') {
        // chemin d'erreur : champs vides (validation applicative via novalidate)
        await evalJs(cdp, `window.emailjs = { init:function(){}, send:function(s,t,par){ window.__cap={sid:s,tid:t,params:par}; return Promise.resolve({status:200}); } };
          document.getElementById('nom').value=''; document.getElementById('email').value='test@local';
          document.getElementById('cmd-form').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true})); true`);
        await sleep(500);
        entry.errPath = await evalJs(cdp, `JSON.stringify({ err: document.getElementById('err').textContent, errDisp: document.getElementById('err').style.display, cap: window.__cap||null, btn: document.getElementById('submit-btn').textContent })`);
        // chemin succès avec stub en place
        await evalJs(cdp, `window.__cap = null; window.emailjs = { init:function(){}, send:function(s,t,par){ window.__cap={sid:s,tid:t,params:par}; return Promise.resolve({status:200}); } };
          document.getElementById('nom').value='Test Verif'; document.getElementById('email').value='test.verif@exemple.fr';
          document.getElementById('offre').value='Module Coupe-circuit — 39 €';
          document.getElementById('cmd-form').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true})); true`);
        await sleep(700);
        entry.okPath = await evalJs(cdp, `JSON.stringify({ cap: window.__cap||null, okDisp: document.getElementById('ok').style.display, okTxt: document.getElementById('ok').textContent.slice(0,90), btn: document.getElementById('submit-btn').textContent, stubUsed: window.emailjs.send.toString().includes('__cap') })`);
        // mobile 390
        await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
        await sleep(700);
        entry.mobile = await evalJs(cdp, MOBILE);
        await cdp.send('Emulation.clearDeviceMetricsOverride');
      }
      rapport.push(entry);
      const bad = (entry.consoleErrors || []).length + (entry.overlaps || []).length;
      const mob = entry.mobile ? (JSON.parse(entry.mobile).scrollW > JSON.parse(entry.mobile).clientW ? 1 : 0) : 0;
      if (bad + mob > 0) echecs++;
    }
    console.log(JSON.stringify(rapport, null, 1));
    console.log('=== pages avec anomalies : ' + echecs + ' ===');
  } catch (e) {
    console.error('ERREUR:', e.message);
    process.exitCode = 1;
  } finally {
    if (cdp) { try { cdp.ws.close(); } catch (e) {} }
    browser.kill('SIGKILL');
  }
})();
