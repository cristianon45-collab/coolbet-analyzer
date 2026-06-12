// public/js/app.js — Coolbet Analyzer

let allMatches   = [];
let selected     = {};   // key = "matchId-mktIdx" → { matchId, mktIdx, label, match, odds, probReal, ve }
let currentMatch = null; // para el modal

// ── Tooltip global de ayuda ──────────────────────────────────────────────────
const TIPS = {
  ve: {
    titulo: '¿Qué es el VE?',
    texto:  '🟢 Verde (+) = la cuota paga MÁS de lo que el riesgo justifica. Vale apostar.\n🔴 Rojo (−) = la casa cobra MÁS de lo justo. Tienen ventaja sobre ti.\n\nEjemplo práctico:\nVE −11.6% con cuota 2.40 → si apuestas $10.000 muchas veces, en promedio perderías $1.160 por apuesta.\n\nBusca siempre VE positivo o lo más cerca de 0.'
  },
  probReal: {
    titulo: '¿Qué es la Prob. Real?',
    texto:  'Es lo que NUESTRO MODELO calcula que va a pasar, usando estadísticas reales: goles promedio, forma reciente, historial, altitud, clima, etc.\n\nNo incluye el margen de ganancia de la casa.\n\nEjemplo: 38% real = el modelo cree que ese resultado ocurre unas 4 de cada 10 veces.'
  },
  probCasa: {
    titulo: '¿Qué es la Prob. Casa?',
    texto:  'Es lo que la casa de apuestas asigna al resultado según su cuota.\n\nFórmula: 1 ÷ cuota. Ejemplo: cuota 2.40 → 1÷2.40 = 42%\n\nSiempre es MAYOR que la Prob. Real porque incluye su margen de ganancia (5–10%).\n\nSi Prob. real > Prob. casa → hay valor en esa apuesta ✅'
  },
  confianza: {
    titulo: 'Nivel de Confianza',
    texto:  '🟢 Alta → el modelo está muy convencido. Muchos factores alineados.\n🟡 Media → hay señales pero también dudas.\n🔴 Baja → poca certeza o alguna alerta activa.\n⛔ Sin valor → el modelo dice que no conviene apostar ahí.'
  },
  kelly: {
    titulo: 'Kelly — ¿Cuánto apostar?',
    texto:  'Fórmula que calcula cuánto de tu plata apostar según tu ventaja real.\n\nUsamos Kelly al 25% para ser conservadores y proteger tu bankroll en rachas malas.\n\nEjemplo: Kelly 2% con $200.000 → apuesta ~$4.000 en ese partido.\n\n⚠️ Nunca apostar más de lo que Kelly sugiere.'
  },
  selecciones: {
    titulo: '¿Qué son las Selecciones?',
    texto:  'Son las apuestas que elegiste para tu ticket combinado.\n\nEjemplo: "Gana México" + "Más de 2.5 goles Brasil" = 2 selecciones.\n\n⚠️ Máximo recomendado: 4 selecciones.\nMás selecciones = más difícil ganar todas = más riesgo.'
  },
  cuotaTotal: {
    titulo: 'Cuota Total — ¿Cuánto ganas?',
    texto:  'Es la multiplicación de todas tus cuotas.\n\nEjemplo: 1.85 × 2.10 = 3.89\nSi apuestas $10.000 y ganas todo → recibes $38.900.\n\n⚠️ Cuota alta NO significa buena apuesta. Lo que importa es que el VE sea positivo.'
  },
  betbuilder: {
    titulo: '¿Qué es un BetBuilder?',
    texto:  'Combina 2 o más mercados del MISMO partido en una sola apuesta.\n\nEjemplo: "Gana México" + "Ambos anotan Sí" en México vs Sudáfrica.\n\nLa cuota se multiplica (más ganancia posible), pero también es más difícil.\n\n🔶 Mínimo 2 mercados del mismo partido.'
  },
  forma: {
    titulo: 'Forma reciente del equipo',
    texto:  'Últimos 5 partidos del equipo:\n\n🟢 V = Ganó\n🟡 E = Empató\n🔴 D = Perdió\n\nEl partido más reciente está a la derecha.\nEjemplo: V V V V V = equipo en racha perfecta.'
  },
  gfprom: {
    titulo: 'GF/p — ¿Cuánto mete?',
    texto:  'Goles a favor por partido en promedio.\n\nEjemplo: 1.9 GF/p = mete casi 2 goles por partido.\n\nAlto GF/p = equipo goleador → favorece apostar a Over goles y a que gane.'
  },
  gcprom: {
    titulo: 'GC/p — ¿Cuánto recibe?',
    texto:  'Goles en contra por partido en promedio.\n\nEjemplo: 0.9 GC/p = recibe menos de 1 gol por partido. Defensa sólida.\n\nAlto GC/p = defensa débil → favorece Over goles y que el rival también anote.'
  },
};

let tipTimeout = null;

function showTip(key, e) {
  e.stopPropagation();
  closeTip();
  const tip  = TIPS[key];
  if (!tip) return;
  const box  = document.createElement('div');
  box.className = 'tip-box';
  box.id = 'tip-global';
  box.innerHTML = `
    <div class="tip-header">
      <span class="tip-titulo">${tip.titulo}</span>
      <button class="tip-close" onclick="closeTip()">✕</button>
    </div>
    <div class="tip-texto">${tip.texto.replace(/\n/g,'<br>')}</div>`;
  document.body.appendChild(box);
  // Posicionar cerca del elemento clickeado
  const rect = e.target.getBoundingClientRect();
  const top  = Math.min(rect.bottom + 6, window.innerHeight - 200);
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - 280));
  box.style.top  = top  + window.scrollY + 'px';
  box.style.left = left + 'px';
  // Cerrar al tocar fuera
  tipTimeout = setTimeout(() => {
    document.addEventListener('click', closeTip, { once: true });
  }, 50);
}

function closeTip() {
  const box = document.getElementById('tip-global');
  if (box) box.remove();
  clearTimeout(tipTimeout);
}

// ── Utilidades ──────────────────────────────────────────────────────────────
const fmt = {
  odds:    v => parseFloat(v).toFixed(2),
  pct:     v => Math.round(v * 100) + '%',
  pctFmt:  v => (v >= 0 ? '+' : '') + (v * 100).toFixed(1) + '%',
  clp:     v => '$ ' + Math.round(v).toLocaleString('es-CL'),
};

function veClass(ve) {
  if (ve >  0.03) return 'pos';
  if (ve < -0.03) return 'neg';
  return 'neu';
}
function veLabel(ve) { return (ve >= 0 ? '+' : '') + (ve * 100).toFixed(1) + '%'; }
function formaChar(f) { return f === 'V' ? 'V' : f === 'G' ? 'D' : 'E'; }

// ── Carga partidos ───────────────────────────────────────────────────────────
async function loadMatches(comp = 'all') {
  document.getElementById('matches-list').innerHTML = '<div class="loading">Cargando partidos…</div>';
  try {
    const r = await fetch(`/api/matches?comp=${comp}`);
    allMatches = await r.json();
    renderMatches();
  } catch(e) {
    document.getElementById('matches-list').innerHTML = '<div class="loading">Error al cargar partidos.</div>';
  }
}

// ── Leyenda fija de indicadores ──────────────────────────────────────────────
const LEGEND_HTML = `
<div class="indicators-legend">
  <span class="legend-title">Cómo leer los mercados:</span>
  <span class="legend-item" onclick="showTip('probCasa',event)">
    <span class="legend-dot casa"></span>Prob. casa = lo que la casa cree que va a pasar
  </span>
  <span class="legend-item" onclick="showTip('probReal',event)">
    <span class="legend-dot real"></span>Prob. real = lo que el modelo calcula que va a pasar
  </span>
  <span class="legend-item" onclick="showTip('ve',event)">
    <span class="legend-dot ve"></span>VE = si la apuesta vale o no (verde = vale, rojo = no vale)
  </span>
  <span class="legend-item" onclick="showTip('confianza',event)">
    <span class="legend-dot conf"></span>Alta / Media / Baja = qué tan seguros estamos
  </span>
</div>`;

// ── Render partidos ──────────────────────────────────────────────────────────
function renderMatches() {
  const container = document.getElementById('matches-list');
  if (!allMatches.length) { container.innerHTML = '<div class="loading">Sin partidos disponibles.</div>'; return; }

  container.innerHTML = LEGEND_HTML + allMatches.map(m => renderMatchCard(m)).join('');
}

// Track active category tab per match card
const activeCat = {};

function renderMatchCard(m, cat) {
  const forma = (stats) => stats.forma.map(f => `<span class="forma-dot ${f}" title="${f}">${formaChar(f)}</span>`).join('');

  // Build category list
  const cats = ['Todos', ...new Set(m.mercados.map(mk => mk.categoria))];
  if (!activeCat[m.id]) activeCat[m.id] = 'Resultado';
  const currentCat = cat ?? activeCat[m.id];
  activeCat[m.id] = currentCat;

  const filtered = currentCat === 'Todos'
    ? m.mercados
    : m.mercados.filter(mk => mk.categoria === currentCat);

  const catTabs = cats.map(c => `
    <button class="cat-tab${c === currentCat ? ' active' : ''}"
            onclick="switchCat(${m.id},'${c}')">${c}</button>`).join('');

  const mkts = filtered.map((mk, _i) => {
    const i    = m.mercados.indexOf(mk);
    const key  = `${m.id}-${i}`;
    const isSel = !!selected[key];
    const vc   = veClass(mk.ve);
    const pct  = Math.round(mk.probReal * 100);
    const confClass = mk.confianza === 'Alta' ? 'conf-alta' : mk.confianza === 'Media' ? 'conf-media' : mk.confianza === 'Baja' ? 'conf-baja' : 'conf-sv';
    return `
    <div class="mkt-btn${isSel ? ' selected' : ''}"
         onclick="toggleSel(${m.id},${i})"
         title="Prob. casa: ${Math.round(mk.probImplicita*100)}%  |  Prob. real: ${pct}%  |  VE: ${veLabel(mk.ve)}">
      <span class="ve-badge ${vc}" onclick="showTip('ve',event)">${veLabel(mk.ve)} ⓘ</span>
      <span class="conf-badge ${confClass}" onclick="showTip('confianza',event)">${mk.confianza ?? '—'}</span>
      <div class="mkt-name">${mk.label}</div>
      <div class="mkt-odds">${fmt.odds(mk.odds)}</div>
      <div class="mkt-prob-row">
        <span class="mkt-real-prob" onclick="showTip('probReal',event)">${pct}% real ⓘ</span>
      </div>
      <div class="prob-bar"><div class="prob-fill ${vc}" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');

  const alertasHtml = (m.alertas && m.alertas.length)
    ? `<div class="match-alertas">${m.alertas.map(a => `<span class="alerta-chip">${a}</span>`).join('')}</div>`
    : '';

  // ── Resultado / Marcador ─────────────────────────────────────────────────
  const res = m.resultado || { status: 'PRE' };
  let resultadoHtml = '';
  if (res.status === 'FT' || res.status === 'LIVE') {
    const statusLabel = res.status === 'FT'
      ? `<span class="res-badge ft">FINAL</span>`
      : `<span class="res-badge live">● ${res.minuto}'</span>`;

    // Goles por equipo
    const golesLocal = (res.goles || []).filter(g => g.equipo === 'local')
      .map(g => `<span class="res-gol">⚽ ${g.jugador} <em>${g.min}'</em></span>`).join('');
    const golesVisit = (res.goles || []).filter(g => g.equipo === 'visit')
      .map(g => `<span class="res-gol">⚽ ${g.jugador} <em>${g.min}'</em></span>`).join('');

    // Amarillas
    const amL = (res.amarillas?.local || []).map(a => `<span class="res-tarjeta amarilla">🟨 ${a}</span>`).join('');
    const amV = (res.amarillas?.visit || []).map(a => `<span class="res-tarjeta amarilla">🟨 ${a}</span>`).join('');
    const rojas = (res.rojas || []).map(r => `<span class="res-tarjeta roja">🟥 ${r.jugador} ${typeof r.min === 'number' ? r.min + "'" : ''} <em>(${r.equipo === 'local' ? m.local : r.equipo === 'visit' ? m.visit : r.equipo})</em></span>`).join('');

    resultadoHtml = `
    <div class="res-box ${res.status === 'LIVE' ? 'res-live' : ''}">
      <div class="res-header">${statusLabel}</div>
      <div class="res-score-row">
        <div class="res-team-col">
          <span class="res-team-name">${m.local}</span>
          <div class="res-events">${golesLocal}${amL}</div>
        </div>
        <div class="res-score">
          <span class="res-num ${res.scoreLocal > res.scoreVisit ? 'winner' : ''}">${res.scoreLocal}</span>
          <span class="res-dash">-</span>
          <span class="res-num ${res.scoreVisit > res.scoreLocal ? 'winner' : ''}">${res.scoreVisit}</span>
        </div>
        <div class="res-team-col right">
          <span class="res-team-name">${m.visit}</span>
          <div class="res-events">${golesVisit}${amV}</div>
        </div>
      </div>
      ${rojas ? `<div class="res-rojas">${rojas}</div>` : ''}
    </div>`;
  }

  return `
  <div class="match-card ${res.status === 'FT' ? 'mc-played' : res.status === 'LIVE' ? 'mc-live' : ''}" id="mc-${m.id}">
    <div class="mc-top">
      <span class="mc-comp">${m.comp}</span>
      <span class="mc-fase">${m.fase}</span>
      <span class="mc-time">${res.status === 'PRE' ? '🕐 ' : ''}${res.status === 'PRE' ? m.time : res.status === 'LIVE' ? '🔴 EN VIVO' : '✅ ' + m.time}</span>
    </div>
    ${alertasHtml}
    ${resultadoHtml}
    <div class="mc-teams">
      <div class="team-block">
        <div class="team-name">${m.local}</div>
        <div class="team-forma">${forma(m.statsLocal)}</div>
        <div class="team-stats-row">
          <span class="stat-badge good" onclick="showTip('gfprom',event)">${m.statsLocal.gfProm.toFixed(1)} GF/p</span>
          <span class="stat-badge" onclick="showTip('gcprom',event)">${m.statsLocal.gcProm.toFixed(1)} GC/p</span>
          <span class="stat-badge">#${m.statsLocal.posLiga} FIFA</span>
        </div>
      </div>
      <div class="vs-block"><span class="vs-label">${res.status === 'PRE' ? 'vs' : res.scoreLocal + '-' + res.scoreVisit}</span></div>
      <div class="team-block right">
        <div class="team-name">${m.visit}</div>
        <div class="team-forma" style="justify-content:flex-end">${forma(m.statsVisit)}</div>
        <div class="team-stats-row" style="justify-content:flex-end">
          <span class="stat-badge good" onclick="showTip('gfprom',event)">${m.statsVisit.gfProm.toFixed(1)} GF/p</span>
          <span class="stat-badge" onclick="showTip('gcprom',event)">${m.statsVisit.gcProm.toFixed(1)} GC/p</span>
          <span class="stat-badge">#${m.statsVisit.posLiga} FIFA</span>
        </div>
      </div>
    </div>
    <div class="cat-tabs">${catTabs}</div>
    <div class="mc-markets">${mkts}</div>
    <button class="mc-info-btn" onclick="openMatchModal(${m.id})">
      📊 Ver estadísticas H2H y análisis de mercados
    </button>
  </div>`;
}

function switchCat(matchId, cat) {
  activeCat[matchId] = cat;
  const m = allMatches.find(x => x.id === matchId);
  const card = document.getElementById(`mc-${matchId}`);
  if (card && m) card.outerHTML = renderMatchCard(m, cat);
}

// ── Helpers BetBuilder ───────────────────────────────────────────────────────
// Agrupa selecciones por partido → legs
function getLegs() {
  const legMap = {};
  Object.values(selected).forEach(s => {
    if (!legMap[s.matchId]) legMap[s.matchId] = [];
    legMap[s.matchId].push(s);
  });
  return Object.values(legMap).map(mkts => {
    const legOdds = parseFloat(mkts.reduce((a, s) => a * s.odds, 1).toFixed(3));
    const legProb = mkts.reduce((a, s) => a * s.probReal, 1);
    const legVe   = legProb * legOdds - 1;
    const isBB    = mkts.length >= 2;
    return { mkts, legOdds, legProb, legVe, isBB, matchId: mkts[0].matchId, match: mkts[0].match };
  });
}

// Convierte legs a selecciones planas para la API
function getSelectionsForAPI() {
  return getLegs().map(leg => ({
    matchId:      leg.matchId,
    label:        leg.isBB
                    ? `BB: ${leg.mkts.map(m => m.label).join(' + ')}`
                    : leg.mkts[0].label,
    match:        leg.match,
    odds:         leg.legOdds,
    probReal:     leg.legProb,
    ve:           leg.legVe,
    isBetBuilder: leg.isBB
  }));
}

// ── Toggle selección ─────────────────────────────────────────────────────────
function toggleSel(matchId, mktIdx) {
  const key = `${matchId}-${mktIdx}`;
  const m   = allMatches.find(x => x.id === matchId);
  const mk  = m.mercados[mktIdx];

  if (selected[key]) {
    delete selected[key];
  } else {
    // BetBuilder: se permite agregar múltiples mercados del mismo partido
    selected[key] = {
      key, matchId, mktIdx,
      label:    mk.label,
      match:    `${m.local} vs ${m.visit}`,
      odds:     mk.odds,
      probReal: mk.probReal,
      ve:       mk.ve
    };
  }

  // Re-render solo la card afectada
  const card = document.getElementById(`mc-${matchId}`);
  if (card) card.outerHTML = renderMatchCard(m);

  updateSlip();
}

// ── Betslip ──────────────────────────────────────────────────────────────────
function updateSlip() {
  const legs  = getLegs();
  const count = legs.length;
  const totalMkts = Object.values(selected).length;
  document.getElementById('sel-count').textContent = count;

  const si = document.getElementById('slip-items');
  const sm = document.getElementById('slip-metrics');

  if (count === 0) {
    si.innerHTML = `
      <div class="slip-empty">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M12 8v8"/>
        </svg>
        <p>Selecciona cuotas para armar tu combinación</p>
        <span>BetBuilder: 2+ mercados del mismo partido</span>
      </div>`;
    sm.classList.add('hidden');
    document.getElementById('hdr-cuota').textContent = '—';
    updateMobBar(0, 0);
    return;
  }

  // Render legs agrupadas
  si.innerHTML = legs.map(leg => {
    const hasBB = leg.isBB;
    const mktsHtml = leg.mkts.map(s => `
      <div class="si-mkt-row">
        <span class="si-mkt-label">${s.label}</span>
        <span class="si-mkt-odds">${fmt.odds(s.odds)}</span>
        <span class="si-remove" onclick="removeItem('${s.key}')">✕</span>
      </div>`).join('');

    const legOddsHtml = hasBB
      ? `<div class="bb-leg-odds">
           Cuota BB: <strong>${fmt.odds(leg.legOdds)}</strong>
           <span class="bb-note">(aprox.)</span>
         </div>`
      : '';

    return `
    <div class="slip-leg${hasBB ? ' slip-leg-bb' : ''}">
      <div class="sl-leg-header">
        <span class="sl-leg-match">${leg.match}</span>
        ${hasBB ? '<span class="bb-badge">BetBuilder</span>' : ''}
      </div>
      ${mktsHtml}
      ${legOddsHtml}
    </div>`;
  }).join('');

  // Calcular métricas desde legs
  const cuotaTotal     = legs.reduce((a, l) => a * l.legOdds, 1);
  const probCombinada  = legs.reduce((a, l) => a * l.legProb, 1);
  const veTotal        = probCombinada * cuotaTotal - 1;
  const stake          = parseFloat(document.getElementById('stake-inp').value) || 10000;
  const retorno        = cuotaTotal * stake;

  document.getElementById('hdr-cuota').textContent = fmt.odds(cuotaTotal);
  document.getElementById('m-cuota').textContent   = fmt.odds(cuotaTotal);

  const probPct = Math.round(probCombinada * 100);
  const probEl  = document.getElementById('m-prob');
  probEl.textContent = probPct + '%';
  probEl.className   = 'mc-val ' + (probPct >= 50 ? 'green' : probPct >= 30 ? 'amber' : 'red');

  const veEl = document.getElementById('m-ve');
  veEl.textContent = veLabel(veTotal);
  veEl.className   = 'mc-val ' + (veTotal > 0.03 ? 'green' : veTotal < -0.03 ? 'red' : 'amber');

  document.getElementById('m-retorno').textContent = fmt.clp(retorno);

  // Kelly Criterion
  // Para combinadas: Kelly fraccional (25%) sobre la combinación
  const b = cuotaTotal - 1;
  const kellyFull = b > 0 ? (probCombinada * b - (1 - probCombinada)) / b : 0;
  const kellyFrac = Math.max(0, kellyFull * 0.25); // Kelly al 25% (conservador)
  const kellyEl = document.getElementById('kelly-row');
  const kellyPct = document.getElementById('kelly-pct');
  const kellyAmount = document.getElementById('kelly-amount');
  if (kellyEl && kellyPct && kellyAmount) {
    kellyEl.classList.toggle('hidden', kellyFrac <= 0);
    kellyPct.textContent = (kellyFrac * 100).toFixed(1) + '% del bankroll';
    kellyAmount.textContent = fmt.clp(stake * (kellyFrac / (parseFloat(document.getElementById('stake-inp').value) / stake || 1)));
    // Recalcular sobre bankroll estimado: si el stake ingresado ES el bankroll
    const bankroll = parseFloat(document.getElementById('stake-inp').value) || 10000;
    kellyAmount.textContent = fmt.clp(bankroll * kellyFrac);
    kellyPct.className = kellyFrac > 0.05 ? 'kelly-pct warn' : 'kelly-pct ok';
  }

  // Veredicto
  const bbLegs = legs.filter(l => l.isBB);
  const vd = document.getElementById('ve-verdict');
  const legDesc = count > 1 ? `${count} partidos` : '1 partido';
  const bbDesc  = bbLegs.length ? ` · ${bbLegs.length} BetBuilder` : '';
  if (count > 4) {
    vd.className = 've-verdict neg';
    vd.textContent = `⚠ ${count} partidos — demasiado riesgo acumulado. Reduce a máximo 4.`;
  } else if (veTotal > 0.08) {
    vd.className = 've-verdict pos';
    vd.textContent = `✅ Excelente — VE +${(veTotal*100).toFixed(1)}% · ${legDesc}${bbDesc}. Muy recomendada.`;
  } else if (veTotal > 0.03) {
    vd.className = 've-verdict pos';
    vd.textContent = `✓ Valor positivo (+${(veTotal*100).toFixed(1)}%) · ${legDesc}${bbDesc}.`;
  } else if (veTotal >= 0) {
    vd.className = 've-verdict warn';
    vd.textContent = `Valor marginal (${veLabel(veTotal)}) · ${legDesc}${bbDesc}. Procede con convicción.`;
  } else {
    vd.className = 've-verdict neg';
    vd.textContent = `✗ VE negativo (${veLabel(veTotal)}) · ${legDesc}${bbDesc}. La casa tiene ventaja.`;
  }

  // Alertas — mercados individuales con VE negativo
  const malas = Object.values(selected).filter(s => s.ve < -0.03);
  const alEl  = document.getElementById('ve-alerts');
  if (malas.length) {
    alEl.innerHTML = `Mercados con VE negativo (evalúa eliminar):<ul>` +
      malas.map(s => `<li>${s.label} — VE ${veLabel(s.ve)}</li>`).join('') + '</ul>';
    alEl.classList.remove('hidden');
  } else {
    alEl.classList.add('hidden');
  }

  sm.classList.remove('hidden');

  // Actualizar barra flotante móvil
  const cuotaFinal = legs.reduce((a, l) => a * l.legOdds, 1);
  updateMobBar(count, cuotaFinal);
}

// ── Barra flotante móvil ─────────────────────────────────────────────────────
function updateMobBar(count, cuotaTotal) {
  const bar = document.getElementById('mob-bar');
  if (!bar) return;
  if (count === 0) { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  document.getElementById('mob-count').textContent = count;
  document.getElementById('mob-odds').textContent  = fmt.odds(cuotaTotal);
}

function scrollToTicket() {
  const slip = document.querySelector('.cb-slip');
  if (slip) slip.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function removeItem(key) {
  const s = selected[key];
  if (!s) return;
  delete selected[key];
  // Re-render la card
  const m = allMatches.find(x => x.id === s.matchId);
  const card = document.getElementById(`mc-${s.matchId}`);
  if (card && m) card.outerHTML = renderMatchCard(m);
  updateSlip();
}

function clearSlip() {
  const matchIds = [...new Set(Object.values(selected).map(s => s.matchId))];
  selected = {};
  matchIds.forEach(id => {
    const m = allMatches.find(x => x.id === id);
    const card = document.getElementById(`mc-${id}`);
    if (card && m) card.outerHTML = renderMatchCard(m);
  });
  updateSlip();
}

// Stake input
document.addEventListener('input', e => {
  if (e.target.id === 'stake-inp') updateSlip();
});

// ── Análisis detallado POST /api/analyze ────────────────────────────────────
async function openModal() {
  const legs = getLegs();
  if (!legs.length) return;

  // Si hay una sola leg sin BetBuilder, abrir modal del partido
  if (legs.length === 1 && !legs[0].isBB) { openMatchModal(legs[0].matchId); return; }

  const apiItems = getSelectionsForAPI();
  const bbCount  = legs.filter(l => l.isBB).length;
  const title    = bbCount
    ? `Análisis — ${legs.length} partido${legs.length>1?'s':''} · ${bbCount} BetBuilder`
    : `Análisis de combinación (${legs.length} partidos)`;
  document.getElementById('modal-title').textContent = title;

  const body = document.getElementById('modal-body');
  body.innerHTML = '<div class="loading">Calculando…</div>';
  document.getElementById('modal').classList.remove('hidden');

  try {
    const r = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selections: apiItems })
    });
    const d = await r.json();
    renderAnalysisModal(d, apiItems);
  } catch(e) {
    body.innerHTML = '<div class="loading">Error al analizar.</div>';
  }
}

function renderAnalysisModal(d, items) {
  const vc = d.veTotal > 3 ? 'green' : d.veTotal < -3 ? 'red' : 'amber';
  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <div class="modal-section">
      <div class="modal-section-title">Resumen de combinación</div>
      <div class="metric-grid" style="margin-bottom:12px">
        <div class="metric-card"><div class="mc-label">Cuota total</div><div class="mc-val gold">${fmt.odds(d.cuotaTotal)}</div></div>
        <div class="metric-card"><div class="mc-label">Prob. combinada</div><div class="mc-val ${d.probCombinada >= 50 ? 'green' : d.probCombinada >= 30 ? 'amber' : 'red'}">${d.probCombinada.toFixed(1)}%</div></div>
        <div class="metric-card"><div class="mc-label">VE total</div><div class="mc-val ${vc}">${d.veTotal >= 0 ? '+' : ''}${d.veTotal.toFixed(1)}%</div></div>
      </div>
      <div class="ve-verdict ${d.veTotal > 3 ? 'pos' : d.veTotal < -3 ? 'neg' : 'warn'}">
        <strong>${d.clasificacion}</strong> — ${d.recomendacion}
      </div>
      ${d.alertas.length ? `<div class="ve-alerts" style="display:block">Selecciones con VE negativo:<ul>${d.alertas.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Desglose por selección</div>
      <div class="mkt-analysis-grid">
        ${items.map(s => `
          <div class="mkt-analysis-card">
            <div class="mac-label">${s.match}</div>
            <div style="font-size:12px;color:#7a90a4;margin-bottom:4px">${s.label}</div>
            <div class="mac-odds">${fmt.odds(s.odds)}</div>
            <div class="mac-row">
              <span>Prob. real</span><span style="color:#e8edf2">${Math.round(s.probReal*100)}%</span>
            </div>
            <div class="mac-row">
              <span>Prob. casa</span><span style="color:#e8edf2">${Math.round((1/s.odds)*100)}%</span>
            </div>
            <div class="mac-ve" style="color:${s.ve > 0 ? '#5dca9b' : '#f09595'}">
              VE: ${veLabel(s.ve)}
            </div>
          </div>`).join('')}
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Simulación de retorno</div>
      <div class="stats-card">
        <div class="stat-row"><span class="stat-row-label">Cuota combinada</span><span class="stat-row-val gold">${fmt.odds(d.cuotaTotal)}</span></div>
        <div class="stat-row"><span class="stat-row-label">Stake $10.000</span><span class="stat-row-val">${fmt.clp(d.cuotaTotal * 10000)}</span></div>
        <div class="stat-row"><span class="stat-row-label">Stake $20.000</span><span class="stat-row-val">${fmt.clp(d.cuotaTotal * 20000)}</span></div>
        <div class="stat-row"><span class="stat-row-label">Stake $50.000</span><span class="stat-row-val">${fmt.clp(d.cuotaTotal * 50000)}</span></div>
        <div class="stat-row"><span class="stat-row-label">Margen casa promedio</span><span class="stat-row-val red">${d.margenCasa >= 0 ? '+' : ''}${d.margenCasa.toFixed(1)}%</span></div>
      </div>
    </div>`;
}

// ── Modal H2H de un partido ──────────────────────────────────────────────────
async function openMatchModal(matchId) {
  const m = allMatches.find(x => x.id === matchId);
  if (!m) return;
  currentMatch = m;
  document.getElementById('modal-title').textContent = `${m.local} vs ${m.visit}`;
  document.getElementById('modal').classList.remove('hidden');
  renderMatchModal(m);
}

function renderMatchModal(m) {
  const h = m.h2h;
  const total = h.local + h.empate + h.visit;
  const pL = Math.round(h.local / total * 100);
  const pE = Math.round(h.empate / total * 100);
  const pV = Math.round(h.visit / total * 100);

  const avgGolLocal  = (h.golesLocal.reduce((a,b) => a+b, 0) / h.golesLocal.length).toFixed(2);
  const avgGolVisit  = (h.golesVisit.reduce((a,b) => a+b, 0) / h.golesVisit.length).toFixed(2);
  const avgTotal     = ((parseFloat(avgGolLocal) + parseFloat(avgGolVisit))).toFixed(2);
  const sl = m.statsLocal, sv = m.statsVisit;

  const partidos = h.partidos.map(p => `
    <tr>
      <td>${p.fecha}</td>
      <td>${p.res}</td>
      <td class="${p.ganador === 'local' ? 'badge-local' : p.ganador === 'visit' ? 'badge-visit' : 'badge-emp'}">
        ${p.ganador === 'local' ? m.local : p.ganador === 'visit' ? m.visit : 'Empate'}
      </td>
    </tr>`).join('');

  // ── Bloque 0 — Contexto del torneo (v3.4) ──────────────────────────────
  const b0 = m.bloque0 || {};
  const b0Html = `
    <div class="modal-section b0-section">
      <div class="modal-section-title">📋 Bloque 0 — Contexto del torneo</div>
      <div class="b0-grid">
        <div class="b0-row"><span class="b0-lbl">Fase</span><span class="b0-val">${b0.fase || m.fase || '—'}</span></div>
        ${b0.jornada ? `<div class="b0-row"><span class="b0-lbl">Jornada</span><span class="b0-val">${b0.jornada}</span></div>` : ''}
        <div class="b0-row"><span class="b0-lbl">Sede</span><span class="b0-val">${b0.sede || '—'}</span></div>
        ${b0.clima ? `<div class="b0-row"><span class="b0-lbl">Clima</span><span class="b0-val">${b0.clima}</span></div>` : ''}
        ${b0.altitud ? `<div class="b0-row"><span class="b0-lbl">Altitud</span><span class="b0-val">${b0.altitud}</span></div>` : ''}
        ${b0.clasificatoriLocal ? `<div class="b0-row"><span class="b0-lbl">${m.local}</span><span class="b0-val b0-cl-${b0.clasificatoriLocal}">${b0.clasificatoriLocal.toUpperCase()}</span></div>` : ''}
        ${b0.clasificatoriVisit ? `<div class="b0-row"><span class="b0-lbl">${m.visit}</span><span class="b0-val b0-cl-${b0.clasificatoriVisit}">${b0.clasificatoriVisit.toUpperCase()}</span></div>` : ''}
        ${b0.diasDescanso?.local ? `<div class="b0-row"><span class="b0-lbl">Descanso local</span><span class="b0-val">${b0.diasDescanso.local} días</span></div>` : ''}
        ${b0.diasDescanso?.visit ? `<div class="b0-row"><span class="b0-lbl">Descanso visit.</span><span class="b0-val">${b0.diasDescanso.visit} días</span></div>` : ''}
        ${b0.suspensiones?.length ? `<div class="b0-row"><span class="b0-lbl">Suspensiones</span><span class="b0-val red">${b0.suspensiones.join(', ')}</span></div>` : ''}
        ${b0.arbitro ? `<div class="b0-row"><span class="b0-lbl">Árbitro</span><span class="b0-val">${b0.arbitro.nombre} (${b0.arbitro.pais})</span></div>` : ''}
      </div>
      ${b0.alerta ? `<div class="b0-alerta">${b0.alerta}</div>` : ''}
    </div>`;

  // ── Señales activas ─────────────────────────────────────────────────────
  const signalsHtml = (m.signals && m.signals.length) ? `
    <div class="modal-section">
      <div class="modal-section-title">⚡ Señales activas — Framework v3.4-Mundial</div>
      <div class="signals-list">
        ${m.signals.map(s => `
          <div class="signal-item signal-${s.level || 'info'}">
            <span class="signal-id">Señal ${s.id}</span>
            <span class="signal-msg">${s.msg}</span>
          </div>`).join('')}
      </div>
    </div>` : '';

  // ── Capa de Decisión: coherencia ────────────────────────────────────────
  const coh = m.coherencia;
  const cohHtml = coh ? `
    <div class="modal-section">
      <div class="modal-section-title">🔍 Capa de Decisión — Verificación de coherencia</div>
      <div class="coherencia-box">
        <div class="coh-declaracion">${coh.declaracion}</div>
        ${coh.apuestaRecomendada ? `
          <div class="coh-recomendada">
            <span class="coh-rec-lbl">⭐ Apuesta recomendada:</span>
            <span class="coh-rec-mkt">${coh.apuestaRecomendada.label}</span>
            <span class="coh-rec-odds">${fmt.odds(coh.apuestaRecomendada.odds)}</span>
            <span class="coh-rec-ve" style="color:#5dca9b">VE ${veLabel(coh.apuestaRecomendada.ve)}</span>
          </div>` : '<div class="coh-sinap">⚠️ Sin apuesta recomendada con valor suficiente para este partido.</div>'}
      </div>
    </div>` : '';

  document.getElementById('modal-body').innerHTML = b0Html + signalsHtml + cohHtml + `

    <div class="modal-section">
      <div class="modal-section-title">Head to Head — últimos ${total} partidos</div>
      <div class="h2h-bar-wrap">
        <div class="h2h-totals">
          <div class="h2h-seg" style="width:${pL}%;background:#f4c430;color:#1a2332">${h.local}V ${pL}%</div>
          <div class="h2h-seg" style="width:${pE}%;background:#4a6070;color:#fff">${h.empate}E ${pE}%</div>
          <div class="h2h-seg" style="width:${pV}%;background:#378add;color:#fff">${h.visit}V ${pV}%</div>
        </div>
        <div class="h2h-labels">
          <span style="color:#f4c430">${m.local}</span>
          <span>Empate</span>
          <span style="color:#378add">${m.visit}</span>
        </div>
      </div>
      <table class="h2h-table">
        <thead><tr><th>Año</th><th>Resultado</th><th>Ganador</th></tr></thead>
        <tbody>${partidos}</tbody>
      </table>
      <div style="font-size:11px;color:#7a90a4;margin-top:8px">
        Promedio goles: <strong style="color:#e8edf2">${m.local} ${avgGolLocal}</strong> — <strong style="color:#e8edf2">${m.visit} ${avgGolVisit}</strong> — Total: <strong style="color:#f4c430">${avgTotal}/p</strong>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Estadísticas de temporada</div>
      <div class="stats-grid">
        <div class="stats-card">
          <div class="stats-card-title" style="color:#f4c430">${m.local}</div>
          <div class="stat-row"><span class="stat-row-label">GF promedio</span><span class="stat-row-val">${sl.gfProm.toFixed(1)}/p</span></div>
          <div class="stat-row"><span class="stat-row-label">GC promedio</span><span class="stat-row-val">${sl.gcProm.toFixed(1)}/p</span></div>
          <div class="stat-row"><span class="stat-row-label">Posición liga</span><span class="stat-row-val">#${sl.posLiga}</span></div>
          <div class="stat-row"><span class="stat-row-label">Local: V-E-D</span><span class="stat-row-val">${sl.localRecord.v}-${sl.localRecord.e}-${sl.localRecord.d}</span></div>
          <div class="stat-row"><span class="stat-row-label">Racha</span><span class="stat-row-val" style="font-size:11px">${sl.racha}</span></div>
        </div>
        <div class="stats-card">
          <div class="stats-card-title" style="color:#378add">${m.visit}</div>
          <div class="stat-row"><span class="stat-row-label">GF promedio</span><span class="stat-row-val">${sv.gfProm.toFixed(1)}/p</span></div>
          <div class="stat-row"><span class="stat-row-label">GC promedio</span><span class="stat-row-val">${sv.gcProm.toFixed(1)}/p</span></div>
          <div class="stat-row"><span class="stat-row-label">Posición liga</span><span class="stat-row-val">#${sv.posLiga}</span></div>
          <div class="stat-row"><span class="stat-row-label">Visita: V-E-D</span><span class="stat-row-val">${sv.visitRecord.v}-${sv.visitRecord.e}-${sv.visitRecord.d}</span></div>
          <div class="stat-row"><span class="stat-row-label">Racha</span><span class="stat-row-val" style="font-size:11px">${sv.racha}</span></div>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Análisis de mercados</div>
      <div class="mkt-analysis-grid">
        ${m.mercados.map((mk, i) => {
          const vc = veClass(mk.ve);
          const probImp = Math.round(mk.probImplicita * 100);
          const probReal = Math.round(mk.probReal * 100);
          const key = `${m.id}-${i}`;
          const isSel = !!selected[key];
          return `
          <div class="mkt-analysis-card" style="${isSel ? 'border-color:#f4c430;box-shadow:0 0 0 1px #f4c430' : ''}" onclick="toggleSel(${m.id},${i});renderMatchModal(allMatches.find(x=>x.id===${m.id}))" style="cursor:pointer">
            <div class="mac-label">${mk.label}</div>
            <div class="mac-odds">${fmt.odds(mk.odds)}</div>
            <div class="mac-row"><span>Prob. casa</span><span>${probImp}%</span></div>
            <div class="mac-row"><span>Prob. real</span><span style="color:#e8edf2;font-weight:600">${probReal}%</span></div>
            <div class="mac-ve" style="color:${vc === 'pos' ? '#5dca9b' : vc === 'neg' ? '#f09595' : '#f4c430'}">
              VE: ${veLabel(mk.ve)} ${vc === 'pos' ? '✓' : vc === 'neg' ? '✗' : '~'}
            </div>
            <div class="prob-bar" style="margin-top:6px"><div class="prob-fill ${vc}" style="width:${probReal}%"></div></div>
            ${isSel ? '<div style="font-size:10px;color:#f4c430;margin-top:5px">✓ Seleccionado</div>' : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function closeModal() { document.getElementById('modal').classList.add('hidden'); }

// ── Simulador Monte Carlo ────────────────────────────────────────────────────
function openSimulador() {
  if (!getLegs().length) { alert('Selecciona al menos una cuota primero.'); return; }
  document.getElementById('sim-modal').classList.remove('hidden');
  document.getElementById('sim-result').innerHTML = '';
}
function closeSimulador() { document.getElementById('sim-modal').classList.add('hidden'); }

async function runSimulacion() {
  const items    = getSelectionsForAPI();
  if (!items.length) return;
  const bankroll = parseFloat(document.getElementById('sim-bankroll').value) || 200000;
  const stake    = parseFloat(document.getElementById('sim-stake').value)    || 10000;
  const nBets    = parseInt(document.getElementById('sim-nbets').value)      || 1000;
  const resEl    = document.getElementById('sim-result');
  resEl.innerHTML = '<div class="loading">Corriendo simulación…</div>';

  try {
    const r = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selections: items, stake, nBets, bankroll })
    });
    const d = await r.json();
    renderSimResult(d, items);
  } catch(e) {
    resEl.innerHTML = '<div class="loading">Error al simular.</div>';
  }
}

function renderSimResult(d, items) {
  const ganancia  = d.bankrollFinal - d.bankrollInicial;
  const roiClass  = d.roi > 0 ? 'green' : d.roi < -10 ? 'red' : 'amber';
  const roiSign   = d.roi >= 0 ? '+' : '';

  // Construir SVG de la curva de bankroll
  const pts   = d.curva;
  const minY  = Math.min(...pts);
  const maxY  = Math.max(...pts);
  const range = maxY - minY || 1;
  const W = 460, H = 110, padL = 52, padB = 20, padT = 8, padR = 8;
  const iW = W - padL - padR, iH = H - padB - padT;

  const svgPts = pts.map((v, i) => {
    const x = padL + (i / (pts.length - 1)) * iW;
    const y = padT + iH - ((v - minY) / range) * iH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Línea base (bankroll inicial)
  const baseY = padT + iH - ((d.bankrollInicial - minY) / range) * iH;
  const lineColor = ganancia >= 0 ? '#1db954' : '#e24b4a';

  const fmtCLP = v => '$ ' + Math.round(v).toLocaleString('es-CL');

  document.getElementById('sim-result').innerHTML = `
    <div class="sim-metrics">
      <div class="sim-metric">
        <div class="sm-label">ROI final</div>
        <div class="sm-val ${roiClass}">${roiSign}${d.roi}%</div>
      </div>
      <div class="sim-metric">
        <div class="sm-label">Bankroll final</div>
        <div class="sm-val ${roiClass}">${fmtCLP(d.bankrollFinal)}</div>
      </div>
      <div class="sim-metric">
        <div class="sm-label">Tasa de acierto</div>
        <div class="sm-val">${d.winRate}%</div>
      </div>
      <div class="sim-metric">
        <div class="sm-label">Ganadas / Perdidas</div>
        <div class="sm-val">${d.wins} / ${d.losses}</div>
      </div>
      <div class="sim-metric">
        <div class="sm-label">VE esperado</div>
        <div class="sm-val ${d.expectativa >= 0 ? 'green' : 'red'}">${d.expectativa >= 0 ? '+' : ''}${d.expectativa}%</div>
      </div>
      <div class="sim-metric">
        <div class="sm-label">Prob. ganar ticket</div>
        <div class="sm-val">${d.probGanar}%</div>
      </div>
    </div>

    <div class="sim-chart-wrap">
      <div class="sim-chart-title">Curva de bankroll — ${d.nBets} apuestas simuladas</div>
      <svg viewBox="0 0 ${W} ${H}" class="sim-chart-svg">
        <!-- Grid lines -->
        <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + iH}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <line x1="${padL}" y1="${padT + iH}" x2="${padL + iW}" y2="${padT + iH}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <!-- Línea base bankroll inicial -->
        <line x1="${padL}" y1="${baseY.toFixed(1)}" x2="${padL + iW}" y2="${baseY.toFixed(1)}"
              stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4,3"/>
        <!-- Área bajo la curva -->
        <polygon points="${padL},${padT + iH} ${svgPts} ${padL + iW},${padT + iH}"
                 fill="${lineColor}" fill-opacity="0.08"/>
        <!-- Curva principal -->
        <polyline points="${svgPts}" fill="none" stroke="${lineColor}" stroke-width="2" stroke-linejoin="round"/>
        <!-- Labels eje Y -->
        <text x="${padL - 4}" y="${(padT + 4).toFixed(1)}" fill="#7a90a4" font-size="8" text-anchor="end">${fmtCLP(maxY)}</text>
        <text x="${padL - 4}" y="${(padT + iH).toFixed(1)}" fill="#7a90a4" font-size="8" text-anchor="end">${fmtCLP(minY)}</text>
        <text x="${padL - 4}" y="${baseY.toFixed(1)}" fill="rgba(255,255,255,0.35)" font-size="7" text-anchor="end">inicio</text>
        <!-- Labels eje X -->
        <text x="${padL}" y="${H - 4}" fill="#7a90a4" font-size="8">0</text>
        <text x="${(padL + iW).toFixed(1)}" y="${H - 4}" fill="#7a90a4" font-size="8" text-anchor="end">${d.nBets}</text>
      </svg>
    </div>

    <div class="sim-selecciones">
      <div class="sim-sel-title">Ticket simulado (${items.length} partido${items.length > 1 ? 's' : ''})</div>
      ${items.map(s => `<div class="sim-sel-item${s.isBetBuilder ? ' sim-sel-bb' : ''}">
        <span>${s.match}${s.isBetBuilder ? ' <em class="bb-tag">BB</em>' : ''} — ${s.label}</span>
        <span class="sim-sel-odds">${fmt.odds(s.odds)}</span>
      </div>`).join('')}
      <div class="sim-sel-item" style="border-top:1px solid rgba(255,255,255,0.08);margin-top:4px;padding-top:6px">
        <span style="color:#e8edf2;font-weight:600">Cuota combinada</span>
        <span class="sim-sel-odds" style="color:#f4c430">${fmt.odds(d.cuota)}</span>
      </div>
    </div>
  `;
}

// ── Nav filtros ──────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadMatches(btn.dataset.comp);
  });
});

// ── Keyboard: ESC cierra modal ───────────────────────────────────────────────
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Bind tooltips del header ──────────────────────────────────────────────────
document.getElementById('tip-sel')?.addEventListener('click', e => { e.stopPropagation(); showTip('selecciones', e); });
document.getElementById('tip-cuota')?.addEventListener('click', e => { e.stopPropagation(); showTip('cuotaTotal', e); });
document.getElementById('tip-kelly')?.addEventListener('click', e => { e.stopPropagation(); showTip('kelly', e); });

// ── Skin switcher ─────────────────────────────────────────────────────────────
const SKINS = {
  saoriii: {
    tagline: 'con <strong>Saori Atenea</strong> 🏛️',
    glow: 'radial-gradient(ellipse,rgba(180,160,255,.35) 0%,transparent 70%)',
    svg: `<defs>
      <radialGradient id="sskin" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#fde8d0"/><stop offset="100%" stop-color="#f5c9a0"/>
      </radialGradient>
      <radialGradient id="sdress" cx="30%" cy="20%" r="80%">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="60%" stop-color="#f0eaff"/><stop offset="100%" stop-color="#d8ccff"/>
      </radialGradient>
      <radialGradient id="sgold" cx="40%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#ffe566"/><stop offset="100%" stop-color="#c8900a"/>
      </radialGradient>
      <filter id="sglow">
        <feGaussianBlur stdDeviation="1.2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="divineGlow">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- AURA DIVINA de Atenea -->
    <ellipse cx="40" cy="55" rx="36" ry="50" fill="#a080ff" opacity="0.06" filter="url(#divineGlow)"/>

    <!-- PELO LARGO NEGRO (fluye hasta abajo) -->
    <!-- Mechones laterales largos -->
    <path d="M24 20 Q12 35 10 65 Q11 80 16 85 Q18 70 20 55 Q22 40 26 28 Z" fill="#3a0060"/>
    <path d="M56 20 Q68 35 70 65 Q69 80 64 85 Q62 70 60 55 Q58 40 54 28 Z" fill="#3a0060"/>
    <!-- Cuerpo del pelo detrás -->
    <ellipse cx="40" cy="22" rx="17" ry="19" fill="#3a0060"/>
    <!-- Flequillo con ondas suaves -->
    <path d="M25 16 Q28 10 35 12 Q40 10 45 12 Q52 10 55 16 Q50 13 40 14 Q30 13 25 16Z" fill="#3a0060"/>
    <!-- Mechón lateral derecho cayendo por el pecho -->
    <path d="M55 25 Q62 40 60 70 Q58 80 56 85 Q54 72 55 58 Q56 42 54 30 Z" fill="#5a0090"/>
    <!-- Mechón lateral izquierdo -->
    <path d="M25 25 Q18 40 20 70 Q22 80 24 85 Q26 72 25 58 Q24 42 26 30 Z" fill="#5a0090"/>

    <!-- CARA -->
    <ellipse cx="40" cy="25" rx="13" ry="14" fill="url(#sskin)"/>

    <!-- Orejas -->
    <ellipse cx="27" cy="26" rx="2.5" ry="3" fill="#f5c9a0"/>
    <ellipse cx="53" cy="26" rx="2.5" ry="3" fill="#f5c9a0"/>

    <!-- Diadema dorada de Atenea -->
    <path d="M28 15 Q40 10 52 15 Q48 12 40 11 Q32 12 28 15Z" fill="url(#sgold)" stroke="#c8900a" stroke-width="0.3"/>
    <!-- Joya central diadema (omega/cruz) -->
    <circle cx="40" cy="13" r="2.5" fill="url(#sgold)" stroke="#fff" stroke-width="0.5"/>
    <text x="40" y="15" text-anchor="middle" font-size="3" fill="#5a0080" font-weight="bold">Ω</text>

    <!-- Cejas finas elegantes -->
    <path d="M31 18 Q35 16 38 18" stroke="#3d1a00" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M42 18 Q45 16 49 18" stroke="#3d1a00" stroke-width="1.2" fill="none" stroke-linecap="round"/>

    <!-- Ojos grandes anime — violeta/azul profundo (Saori) -->
    <ellipse cx="34" cy="23" rx="4" ry="4.5" fill="#1a0a30"/>
    <ellipse cx="46" cy="23" rx="4" ry="4.5" fill="#1a0a30"/>
    <ellipse cx="34" cy="23.5" rx="2.8" ry="3.2" fill="#6a35cc"/>
    <ellipse cx="46" cy="23.5" rx="2.8" ry="3.2" fill="#6a35cc"/>
    <ellipse cx="34" cy="24" rx="1.4" ry="1.8" fill="#9060ff"/>
    <ellipse cx="46" cy="24" rx="1.4" ry="1.8" fill="#9060ff"/>
    <!-- Brillo ojos -->
    <circle cx="35.8" cy="21.5" r="1.3" fill="white"/>
    <circle cx="47.8" cy="21.5" r="1.3" fill="white"/>
    <circle cx="33" cy="25" r="0.6" fill="white" opacity="0.7"/>
    <circle cx="45" cy="25" r="0.6" fill="white" opacity="0.7"/>
    <!-- Pestañas -->
    <path d="M30 20 Q32 18 34 19" stroke="#3a0060" stroke-width="1" fill="none"/>
    <path d="M34 19 Q36 18 38 19.5" stroke="#3a0060" stroke-width="1" fill="none"/>
    <path d="M42 19.5 Q44 18 46 19" stroke="#3a0060" stroke-width="1" fill="none"/>
    <path d="M46 19 Q48 18 50 20" stroke="#3a0060" stroke-width="1" fill="none"/>

    <!-- Nariz pequeña delicada -->
    <path d="M38.5 28 Q40 29.5 41.5 28" stroke="#d4a070" stroke-width="0.8" fill="none" stroke-linecap="round"/>

    <!-- Boca con leve sonrisa serena -->
    <path d="M35 31.5 Q40 34.5 45 31.5" stroke="#c06878" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M36 31.8 Q40 34 44 31.8" fill="#e8909a" opacity="0.35"/>

    <!-- Mejillas suaves rosadas -->
    <ellipse cx="28" cy="28" rx="4" ry="2.5" fill="#ffb8c0" opacity="0.4"/>
    <ellipse cx="52" cy="28" rx="4" ry="2.5" fill="#ffb8c0" opacity="0.4"/>

    <!-- CUELLO -->
    <rect x="37" y="39" width="6" height="7" rx="2" fill="url(#sskin)"/>

    <!-- VESTIDO BLANCO/LILA de Atenea (toga griega con faja dorada) -->
    <!-- Cuerpo principal del vestido -->
    <path d="M14 47 L20 42 Q28 39 36 40 L40 44 L44 40 Q52 39 60 42 L66 47 L64 105 L16 105 Z" fill="url(#sdress)"/>
    <!-- Faja/cinturón dorado -->
    <rect x="18" y="62" width="44" height="5" rx="2" fill="url(#sgold)" stroke="#c8900a" stroke-width="0.4"/>
    <!-- Escote V con borde dorado -->
    <path d="M28 41 L40 54 L52 41" stroke="url(#sgold)" stroke-width="1.8" fill="none" stroke-linejoin="round"/>
    <!-- Pliegues del vestido (toga) -->
    <path d="M22 50 Q20 75 22 100" stroke="#c8bfee" stroke-width="0.8" fill="none" opacity="0.6"/>
    <path d="M30 42 Q28 65 29 100" stroke="#c8bfee" stroke-width="0.6" fill="none" opacity="0.5"/>
    <path d="M50 42 Q52 65 51 100" stroke="#c8bfee" stroke-width="0.6" fill="none" opacity="0.5"/>
    <path d="M58 50 Q60 75 58 100" stroke="#c8bfee" stroke-width="0.8" fill="none" opacity="0.6"/>
    <!-- Borde inferior dorado -->
    <path d="M16 104 Q40 108 64 104" stroke="url(#sgold)" stroke-width="1.5" fill="none"/>

    <!-- Hombros / drapeado toga -->
    <path d="M14 47 Q10 52 12 60 Q16 58 18 50 Z" fill="#e8e0ff"/>
    <path d="M66 47 Q70 52 68 60 Q64 58 62 50 Z" fill="#e8e0ff"/>

    <!-- BÁCULO DORADO DE ATENEA (mano derecha) -->
    <!-- Palo del báculo -->
    <rect x="62" y="15" width="3" height="75" rx="1.5" fill="url(#sgold)" filter="url(#sglow)"/>
    <!-- Cabeza del báculo — Cruz Ankh / símbolo Atenea -->
    <!-- Círculo superior -->
    <circle cx="63.5" cy="12" r="6" fill="none" stroke="url(#sgold)" stroke-width="2.2" filter="url(#sglow)"/>
    <!-- Cruz del ankh -->
    <line x1="63.5" y1="6" x2="63.5" y2="18" stroke="url(#sgold)" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="58" y1="14" x2="69" y2="14" stroke="url(#sgold)" stroke-width="2" stroke-linecap="round"/>
    <!-- Omega en el círculo -->
    <text x="63.5" y="14" text-anchor="middle" font-size="5.5" fill="#fff" font-weight="bold" opacity="0.9">Ω</text>
    <!-- Brillo en el báculo -->
    <rect x="63.5" y="18" width="1" height="70" rx="0.5" fill="white" opacity="0.4"/>
    <!-- Punta inferior del báculo -->
    <path d="M62 90 L63.5 97 L65 90 Z" fill="url(#sgold)"/>

    <!-- Mano derecha sosteniendo báculo -->
    <ellipse cx="63" cy="72" rx="3.5" ry="3" fill="url(#sskin)"/>

    <!-- Brazo izquierdo (extendido elegantemente) -->
    <path d="M16 52 L8 68 Q6 73 10 74 L14 72 L18 56 Z" fill="url(#sdress)"/>
    <!-- Mano izquierda -->
    <ellipse cx="9" cy="74" rx="4" ry="3" fill="url(#sskin)"/>

    <!-- Sandalias doradas (pies asoman bajo vestido) -->
    <ellipse cx="28" cy="103" rx="8" ry="3.5" fill="url(#sgold)" opacity="0.8"/>
    <ellipse cx="52" cy="103" rx="8" ry="3.5" fill="url(#sgold)" opacity="0.8"/>
    <!-- Tiras sandalia -->
    <path d="M22 100 Q28 102 34 100" stroke="#c8900a" stroke-width="1" fill="none"/>
    <path d="M46 100 Q52 102 58 100" stroke="#c8900a" stroke-width="1" fill="none"/>

    <!-- Destellos divinos alrededor -->
    <g filter="url(#divineGlow)" opacity="0.7">
      <polygon points="6,30 7.5,35 12,35 8.5,38 10,43 6,40 2,43 3.5,38 0,35 4.5,35" fill="#f0d060" opacity="0.6" transform="scale(0.6) translate(5,10)"/>
      <polygon points="6,30 7.5,35 12,35 8.5,38 10,43 6,40 2,43 3.5,38 0,35 4.5,35" fill="#c8a0ff" opacity="0.5" transform="scale(0.5) translate(120,5)"/>
    </g>`
  },

  maul: {
    tagline: 'con <strong>darth maul</strong> ⚔️',
    glow: 'radial-gradient(ellipse,rgba(180,0,0,.35) 0%,transparent 70%)',
    svg: `<defs>
      <radialGradient id="faceGrad" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#cc1010"/><stop offset="100%" stop-color="#8b0000"/>
      </radialGradient>
      <filter id="saberBlur"><feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glowRed"><feGaussianBlur stdDeviation="1" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <ellipse cx="40" cy="22" rx="19" ry="21" fill="#111"/>
    <path d="M21 22 Q18 50 20 80 Q30 85 40 85 Q50 85 60 80 Q62 50 59 22 Z" fill="#0a0a0a"/>
    <path d="M28 8 Q26 2 29 0 Q31 4 30 9 Z" fill="#1a0000"/>
    <path d="M34 6 Q33 1 36 0 Q37 4 36 7 Z" fill="#1a0000"/>
    <path d="M52 8 Q54 2 51 0 Q49 4 50 9 Z" fill="#1a0000"/>
    <path d="M46 6 Q47 1 44 0 Q43 4 44 7 Z" fill="#1a0000"/>
    <path d="M40 5 Q39 0 40 -1 Q41 0 41 5 Z" fill="#1a0000"/>
    <ellipse cx="40" cy="26" rx="13" ry="14" fill="url(#faceGrad)"/>
    <path d="M27 20 Q28 15 33 14 Q36 16 37 26 Q36 35 33 38 Q28 37 27 32 Z" fill="#000"/>
    <rect x="37" y="13" width="6" height="5" rx="1" fill="#000"/>
    <rect x="37" y="29" width="6" height="6" rx="1" fill="#000"/>
    <ellipse cx="50" cy="30" rx="4" ry="5" fill="#000" opacity="0.8"/>
    <ellipse cx="35" cy="24" rx="3.5" ry="3" fill="#ffcc00"/>
    <ellipse cx="45" cy="24" rx="3.5" ry="3" fill="#ffcc00"/>
    <ellipse cx="35" cy="24" rx="1.8" ry="2" fill="#cc0000"/>
    <ellipse cx="45" cy="24" rx="1.8" ry="2" fill="#cc0000"/>
    <circle cx="36" cy="23" r="0.8" fill="#fff8" opacity="0.6"/>
    <circle cx="46" cy="23" r="0.8" fill="#fff8" opacity="0.6"/>
    <ellipse cx="40" cy="30" rx="2" ry="1.5" fill="#8b0000"/>
    <path d="M34 35 Q40 33 46 35" stroke="#5a0000" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M30 19 Q33 17 37 19" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M43 19 Q47 17 50 19" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="36" y="39" width="8" height="6" rx="2" fill="#8b0000"/>
    <path d="M16 46 L22 42 Q30 39 37 40 L40 44 L43 40 Q50 39 58 42 L64 46 L62 80 L18 80 Z" fill="#0d0d0d"/>
    <path d="M16 46 Q8 55 6 90 Q10 92 14 88 Q16 70 22 55 Z" fill="#080808"/>
    <path d="M64 46 Q72 55 74 90 Q70 92 66 88 Q64 70 58 55 Z" fill="#080808"/>
    <path d="M18 50 L8 70 Q6 74 10 75 L14 72 L20 54 Z" fill="#0d0d0d"/>
    <path d="M62 50 L55 72 Q54 76 58 77 Q63 75 65 70 L68 56 Z" fill="#0d0d0d"/>
    <ellipse cx="10" cy="75" rx="4" ry="3" fill="#2a0000"/>
    <ellipse cx="60" cy="77" rx="3.5" ry="3" fill="#2a0000"/>
    <rect x="58" y="74" width="5" height="10" rx="2" fill="#555"/>
    <rect x="60" y="30" width="6" height="46" rx="3" fill="#ff000033" filter="url(#saberBlur)"/>
    <rect x="61.5" y="30" width="3" height="46" rx="1.5" fill="#ff4444" filter="url(#glowRed)"/>
    <rect x="62.2" y="30" width="1.6" height="46" rx="0.8" fill="#ffffff" opacity="0.8"/>
    <path d="M18 80 L20 97 L36 97 L40 85 L44 97 L60 97 L62 80 Z" fill="#080808"/>
    <rect x="16" y="95" width="20" height="9" rx="3" fill="#111"/>
    <rect x="44" y="95" width="20" height="9" rx="3" fill="#111"/>`
  },

  vidal: {
    tagline: 'con <strong>el rey arturo</strong> 🍺',
    glow: 'radial-gradient(ellipse,rgba(244,196,48,.3) 0%,transparent 70%)',
    svg: `<defs>
      <radialGradient id="vidalSkin" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#c8854a"/><stop offset="100%" stop-color="#a0622a"/>
      </radialGradient>
      <radialGradient id="vidalShirt" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#f5f5f5"/><stop offset="100%" stop-color="#e0e0e0"/>
      </radialGradient>
      <radialGradient id="beerGrad" cx="40%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#ffe066"/><stop offset="100%" stop-color="#d4a000"/>
      </radialGradient>
    </defs>
    <!-- Cabeza rapada / pelo corto muy oscuro -->
    <ellipse cx="40" cy="24" rx="15" ry="16" fill="#1a0a00"/>
    <ellipse cx="40" cy="25" rx="13" ry="14" fill="url(#vidalSkin)"/>
    <!-- Orejas -->
    <ellipse cx="27" cy="26" rx="3" ry="3.5" fill="#b8743a"/>
    <ellipse cx="53" cy="26" rx="3" ry="3.5" fill="#b8743a"/>
    <!-- Barba corta / tupida - estilo Vidal -->
    <path d="M28 32 Q30 38 40 40 Q50 38 52 32 Q48 36 40 37 Q32 36 28 32Z" fill="#1a0800" opacity="0.85"/>
    <path d="M30 28 Q28 32 29 35" stroke="#1a0800" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 28 Q52 32 51 35" stroke="#1a0800" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Cejas fuertes / gruesas estilo Vidal -->
    <path d="M29 18 Q33 15 38 17" stroke="#1a0800" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M42 17 Q47 15 51 18" stroke="#1a0800" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <!-- Ojos intensos oscuros -->
    <ellipse cx="34" cy="23" rx="3.5" ry="3.2" fill="#111"/>
    <ellipse cx="46" cy="23" rx="3.5" ry="3.2" fill="#111"/>
    <ellipse cx="34" cy="23" rx="2" ry="2.2" fill="#3a1500"/>
    <ellipse cx="46" cy="23" rx="2" ry="2.2" fill="#3a1500"/>
    <circle cx="35.2" cy="21.8" r="1" fill="white" opacity="0.7"/>
    <circle cx="47.2" cy="21.8" r="1" fill="white" opacity="0.7"/>
    <!-- Nariz ancha -->
    <ellipse cx="40" cy="28" rx="2.5" ry="1.8" fill="#9a5a22"/>
    <!-- Boca seria / sonrisa pícara -->
    <path d="M33 33 Q40 37 47 33" stroke="#7a3010" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M34 33 Q40 36 46 33" fill="#cc6040" opacity="0.35"/>
    <!-- Cuello fuerte -->
    <rect x="35" y="39" width="10" height="8" rx="2" fill="#b8743a"/>
    <!-- Camiseta COLO-COLO blanca con franja negra -->
    <path d="M16 47 L22 42 Q30 39 37 40 L40 44 L43 40 Q50 39 58 42 L64 47 L62 80 L18 80 Z" fill="url(#vidalShirt)"/>
    <!-- Franja negra central Colo-Colo -->
    <rect x="37" y="40" width="6" height="40" fill="#111"/>
    <!-- Cuello V -->
    <path d="M31 41 L40 51 L49 41" stroke="#111" stroke-width="2" fill="none" stroke-linejoin="round"/>
    <!-- Número 8 en el pecho izquierdo -->
    <text x="24" y="61" font-size="10" font-weight="800" fill="#111" font-family="Arial,sans-serif">8</text>
    <!-- Estrella Colo-Colo -->
    <polygon points="52,48 53.5,53 59,53 54.5,56 56,61 52,58 48,61 49.5,56 45,53 50.5,53"
             fill="#f4c430" stroke="#c49a24" stroke-width="0.5"/>
    <!-- Brazos fuertes musculosos -->
    <path d="M18 50 L6 66 Q4 72 8 73 L13 71 L20 54 Z" fill="url(#vidalShirt)"/>
    <path d="M62 50 L70 66 Q72 72 68 73 L64 71 L60 54 Z" fill="url(#vidalShirt)"/>
    <!-- Mano izq sosteniendo cerveza -->
    <ellipse cx="8" cy="73" rx="4.5" ry="3.5" fill="#b8743a"/>
    <!-- Vaso de cerveza ENORME -->
    <rect x="-2" y="53" width="18" height="22" rx="3" fill="url(#beerGrad)" stroke="#c49a24" stroke-width="1"/>
    <!-- Espuma cerveza -->
    <ellipse cx="7" cy="53" rx="9" ry="4" fill="white" opacity="0.95"/>
    <ellipse cx="3" cy="52" rx="4" ry="3" fill="white"/>
    <ellipse cx="11" cy="51.5" rx="3.5" ry="2.5" fill="white"/>
    <!-- Burbujas en la cerveza -->
    <circle cx="4" cy="60" r="1.2" fill="#ffe066" opacity="0.6"/>
    <circle cx="10" cy="65" r="1" fill="#ffe066" opacity="0.5"/>
    <circle cx="6" cy="70" r="0.8" fill="#ffe066" opacity="0.5"/>
    <!-- Mano der levantada / puño arriba (celebración) -->
    <ellipse cx="68" cy="70" rx="4.5" ry="4" fill="#b8743a"/>
    <rect x="66" y="62" width="4" height="8" rx="2" fill="#b8743a"/>
    <!-- Pantalón negro Colo-Colo -->
    <path d="M18 80 L20 97 L36 97 L40 85 L44 97 L60 97 L62 80 Z" fill="#111"/>
    <line x1="40" y1="80" x2="40" y2="97" stroke="#222" stroke-width="1"/>
    <!-- Botines negros -->
    <rect x="16" y="95" width="20" height="9" rx="3" fill="#111"/>
    <rect x="44" y="95" width="20" height="9" rx="3" fill="#111"/>
    <rect x="17" y="96" width="18" height="3" rx="2" fill="#333"/>
    <rect x="45" y="96" width="18" height="3" rx="2" fill="#333"/>`
  }
};

function applySkin(name) {
  const skin = SKINS[name];
  if (!skin) return;
  // Swap SVG internals
  const svg = document.getElementById('mascot-svg');
  if (svg) svg.innerHTML = skin.svg;
  // Swap glow
  const glow = document.getElementById('mascot-glow');
  if (glow) glow.style.background = skin.glow;
  // Swap tagline
  const tag = document.getElementById('mascot-tagline');
  if (tag) tag.innerHTML = skin.tagline;
  // Update active button
  document.querySelectorAll('.skin-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.skin === name);
  });
  localStorage.setItem('coolbet-skin', name);
}

document.querySelectorAll('.skin-btn').forEach(btn => {
  btn.addEventListener('click', () => applySkin(btn.dataset.skin));
});

// Restaurar skin guardado
const savedSkin = localStorage.getItem('coolbet-skin') || 'maul';
applySkin(savedSkin);

// ── Init ─────────────────────────────────────────────────────────────────────
loadMatches('mundial');
