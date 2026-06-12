// public/js/app.js — Coolbet Analyzer

let allMatches   = [];
let selected     = {};   // key = "matchId-mktIdx" → { matchId, mktIdx, label, match, odds, probReal, ve }
let currentMatch = null; // para el modal

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

// ── Render partidos ──────────────────────────────────────────────────────────
function renderMatches() {
  const container = document.getElementById('matches-list');
  if (!allMatches.length) { container.innerHTML = '<div class="loading">Sin partidos disponibles.</div>'; return; }

  container.innerHTML = allMatches.map(m => renderMatchCard(m)).join('');
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
      <span class="ve-badge ${vc}">${veLabel(mk.ve)}</span>
      <span class="conf-badge ${confClass}">${mk.confianza ?? '—'}</span>
      <div class="mkt-name">${mk.label}</div>
      <div class="mkt-odds">${fmt.odds(mk.odds)}</div>
      <div class="mkt-prob-row">
        <span class="mkt-real-prob">${pct}% real</span>
      </div>
      <div class="prob-bar"><div class="prob-fill ${vc}" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');

  const alertasHtml = (m.alertas && m.alertas.length)
    ? `<div class="match-alertas">${m.alertas.map(a => `<span class="alerta-chip">${a}</span>`).join('')}</div>`
    : '';

  return `
  <div class="match-card" id="mc-${m.id}">
    <div class="mc-top">
      <span class="mc-comp">${m.comp}</span>
      <span class="mc-fase">${m.fase}</span>
      <span class="mc-time">🕐 ${m.time}</span>
    </div>
    ${alertasHtml}
    <div class="mc-teams">
      <div class="team-block">
        <div class="team-name">${m.local}</div>
        <div class="team-forma">${forma(m.statsLocal)}</div>
        <div class="team-stats-row">
          <span class="stat-badge good">${m.statsLocal.gfProm.toFixed(1)} GF/p</span>
          <span class="stat-badge">${m.statsLocal.gcProm.toFixed(1)} GC/p</span>
          <span class="stat-badge">#${m.statsLocal.posLiga} FIFA</span>
        </div>
      </div>
      <div class="vs-block"><span class="vs-label">vs</span></div>
      <div class="team-block right">
        <div class="team-name">${m.visit}</div>
        <div class="team-forma" style="justify-content:flex-end">${forma(m.statsVisit)}</div>
        <div class="team-stats-row" style="justify-content:flex-end">
          <span class="stat-badge good">${m.statsVisit.gfProm.toFixed(1)} GF/p</span>
          <span class="stat-badge">${m.statsVisit.gcProm.toFixed(1)} GC/p</span>
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
  const items = Object.values(selected);
  if (!items.length) { alert('Selecciona al menos una cuota primero.'); return; }
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

// ── Init ─────────────────────────────────────────────────────────────────────
loadMatches('mundial');
