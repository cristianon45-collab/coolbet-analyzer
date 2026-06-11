// src/server.js
const express = require('express');
const path = require('path');
const MATCHES = require('../data/matches');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ─── Helpers ────────────────────────────────────────────────────────────────
function poissonCDF(k, lambda) {
  let sum = 0, term = Math.exp(-lambda);
  for (let i = 0; i <= k; i++) {
    if (i > 0) term *= lambda / i;
    sum += term;
  }
  return sum;
}

function mkMercado(label, categoria, probReal, margen = 0.07) {
  const pc = Math.min(0.98, probReal * (1 + margen));
  const odds = parseFloat((1 / pc).toFixed(2));
  return {
    label, categoria,
    odds,
    probCasa:  parseFloat(pc.toFixed(4)),
    probReal:  parseFloat(Math.min(0.97, Math.max(0.03, probReal)).toFixed(4))
  };
}

// ─── Señales A-G del framework v3.3-Mundial ────────────────────────────────
function detectSignals(m) {
  const signals = [];
  const alerts  = [...(m.contexto?.alertas || [])];

  // Señal G: restricción diplomática
  const diplomaticTeams = ['Irán','Haití','Haiti','Iran'];
  if (diplomaticTeams.some(t => m.local === t || m.visit === t)) {
    signals.push({ id:'G', msg:'Restricción diplomática activa → bajar 1 nivel todos los mercados del equipo afectado', level:'danger' });
    alerts.push('🚨 Señal G: restricción diplomática');
  }

  // Señal altitud
  const altitudCritica  = ['Ciudad de México','Est. Azteca','Zapopan'];
  const altitudModerada = ['Guadalajara'];
  if (m.estadio && altitudCritica.some(a => m.estadio.includes(a))) {
    signals.push({ id:'ALT', msg:'Altitud crítica ~2,240m — impacto severo en ritmo y goles', level:'warn' });
    alerts.push('🏔️ Altitud crítica 2,240m');
  } else if (m.time && (m.time.includes('Zapopan') || (m.estadio && altitudModerada.some(a => m.estadio.includes(a))))) {
    signals.push({ id:'ALT', msg:'Altitud moderada ~1,566m — leve impacto en ritmo y físico', level:'info' });
    alerts.push('🏔️ Altitud moderada 1,566m');
  }
  if (m.time && m.time.includes('Azteca')) {
    signals.push({ id:'ALT', msg:'Altitud crítica ~2,240m — impacto severo', level:'warn' });
    alerts.push('🏔️ Altitud crítica 2,240m');
  }

  // Señal D: calor extremo (Houston, Arlington, Miami, Kansas City en verano)
  const hotVenues = ['Houston','Arlington','Miami','Kansas City','Zapopan'];
  if (hotVenues.some(v => m.time && m.time.includes(v))) {
    signals.push({ id:'D', msg:'Calor extremo +33°C → restar 2+ córneres a línea, ritmo reducido', level:'warn' });
    alerts.push('🌡️ Calor extremo +33°C');
  }

  // Dead rubber detector (ambos equipos con forma muy baja)
  const sl = m.statsLocal, sv = m.statsVisit;
  const formaL = sl.forma.filter(f => f === 'G').length;
  const formaV = sv.forma.filter(f => f === 'G').length;
  if (formaL >= 4 && formaV >= 4) {
    signals.push({ id:'DR', msg:'⚠️ Posible Dead Rubber — ambos equipos en racha negativa, motivación comprometida', level:'danger' });
    alerts.push('⚠️ Posible Dead Rubber');
  }

  return { signals, alerts };
}

// ─── Nivel de confianza por mercado ────────────────────────────────────────
function confLevel(probReal, ve, signals) {
  const hasG = signals.some(s => s.id === 'G');
  let level;
  if (ve > 0.06 && probReal > 0.55)      level = 'Alta';
  else if (ve > 0.02 && probReal > 0.40) level = 'Media';
  else if (ve >= 0)                       level = 'Baja';
  else                                    level = 'Sin valor';
  // Señal G baja un nivel
  if (hasG) {
    const orden = ['Alta','Media','Baja','Sin valor'];
    const idx = orden.indexOf(level);
    level = orden[Math.min(idx + 1, 3)];
  }
  return level;
}

function enrichMercados(m) {
  const base = m.mercados;
  // Leer 1X2 base (los primeros 3 mercados siempre son 1/X/2)
  const pL = base[0]?.probReal ?? 0.40;
  const pE = base[1]?.probReal ?? 0.27;
  const pV = base[2]?.probReal ?? 0.33;

  const avgG = (m.statsLocal.gfProm + m.statsVisit.gfProm) * 0.88;
  const pO15 = 1 - poissonCDF(1, avgG);
  const pO25 = 1 - poissonCDF(2, avgG);
  const pO35 = 1 - poissonCDF(3, avgG);
  const pBTTS = (1 - Math.exp(-m.statsLocal.gfProm * 0.88)) *
                (1 - Math.exp(-m.statsVisit.gfProm * 0.88));

  const lN = m.local, vN = m.visit;

  const dobleOp = [
    mkMercado(`1X — ${lN} o Empate`,    'Doble Op.', Math.min(0.96, pL + pE)),
    mkMercado(`X2 — Empate o ${vN}`,    'Doble Op.', Math.min(0.96, pE + pV)),
    mkMercado(`12 — ${lN} o ${vN}`,     'Doble Op.', Math.min(0.98, pL + pV)),
  ];

  const totales = [
    mkMercado('Más de 1.5 goles',    'Totales', Math.min(0.95, pO15)),
    mkMercado('Menos de 1.5 goles',  'Totales', Math.max(0.05, 1 - pO15)),
    mkMercado('Más de 2.5 goles',    'Totales', Math.min(0.90, pO25)),
    mkMercado('Menos de 2.5 goles',  'Totales', Math.max(0.10, 1 - pO25)),
    mkMercado('Más de 3.5 goles',    'Totales', Math.min(0.80, pO35)),
    mkMercado('Menos de 3.5 goles',  'Totales', Math.max(0.20, 1 - pO35)),
  ];

  const btts = [
    mkMercado('Ambos anotan — Sí', 'BTTS', Math.min(0.85, pBTTS)),
    mkMercado('Ambos anotan — No', 'BTTS', Math.max(0.15, 1 - pBTTS)),
  ];

  const handicap = [
    mkMercado(`${lN} -1 (hándicap)`,     'Hándicap', Math.max(0.05, pL - 0.15)),
    mkMercado(`Empate / ${lN} +1`,        'Hándicap', Math.min(0.75, pE + pV * 0.5)),
    mkMercado(`${vN} +1 (hándicap)`,     'Hándicap', Math.min(0.85, pV + 0.18)),
  ];

  // 1er tiempo: empate es más frecuente (~55%), victoria reducida
  const pH1L = pL * 0.62, pH1V = pV * 0.62, pH1E = 1 - pH1L - pH1V;
  const primerTiempo = [
    mkMercado(`1T — Gana ${lN}`,  '1er Tiempo', Math.max(0.05, pH1L)),
    mkMercado('1T — Empate',       '1er Tiempo', Math.min(0.75, pH1E)),
    mkMercado(`1T — Gana ${vN}`,  '1er Tiempo', Math.max(0.05, pH1V)),
  ];

  const primerGol = [
    mkMercado(`Primer gol: ${lN}`,   'Primer Gol', Math.min(0.80, pL * 1.25)),
    mkMercado('Sin goles (0-0)',      'Primer Gol', Math.max(0.04, poissonCDF(0, avgG))),
    mkMercado(`Primer gol: ${vN}`,   'Primer Gol', Math.min(0.65, pV * 1.25)),
  ];

  // Córneres: ~4.8 córneres por equipo por partido en promedio
  // Equipos atacantes generan más; escalar por gfProm
  const avgCornLocal  = m.statsLocal.gfProm  * 2.2 + 1.8;
  const avgCornVisit  = m.statsVisit.gfProm  * 2.0 + 1.5;
  const avgCornTotal  = avgCornLocal + avgCornVisit;
  const pO85  = 1 - poissonCDF(8,  avgCornTotal);
  const pO95  = 1 - poissonCDF(9,  avgCornTotal);
  const pO105 = 1 - poissonCDF(10, avgCornTotal);
  const pO115 = 1 - poissonCDF(11, avgCornTotal);
  const corneres = [
    mkMercado('Córneres Más de 8.5',  'Córneres', Math.min(0.92, pO85)),
    mkMercado('Córneres Menos de 8.5','Córneres', Math.max(0.08, 1 - pO85)),
    mkMercado('Córneres Más de 9.5',  'Córneres', Math.min(0.85, pO95)),
    mkMercado('Córneres Menos de 9.5','Córneres', Math.max(0.15, 1 - pO95)),
    mkMercado('Córneres Más de 10.5', 'Córneres', Math.min(0.75, pO105)),
    mkMercado('Córneres Menos de 10.5','Córneres',Math.max(0.25, 1 - pO105)),
    mkMercado('Córneres Más de 11.5', 'Córneres', Math.min(0.60, pO115)),
    mkMercado('Córneres Menos de 11.5','Córneres',Math.max(0.40, 1 - pO115)),
    mkMercado(`${lN} más córneres`,   'Córneres', Math.min(0.80, pL * 0.9 + 0.25)),
    mkMercado(`${vN} más córneres`,   'Córneres', Math.min(0.70, pV * 0.9 + 0.20)),
  ];

  return [
    ...base.map(mk => ({ ...mk, categoria: mk.categoria ?? 'Resultado' })),
    ...dobleOp, ...totales, ...btts, ...handicap, ...primerTiempo, ...primerGol, ...corneres
  ];
}

function calcVE(mercados, signals = []) {
  return mercados.map(mk => {
    const ve = parseFloat((mk.probReal * mk.odds - 1).toFixed(4));
    return {
      ...mk,
      ve,
      probImplicita: parseFloat((1 / mk.odds).toFixed(4)),
      confianza: confLevel(mk.probReal, ve, signals)
    };
  });
}

function processMatch(m) {
  const { signals, alerts } = detectSignals(m);
  const mercados = calcVE(enrichMercados(m), signals);
  return { ...m, signals, alertas: alerts, mercados };
}

// ─── API: todos los partidos ────────────────────────────────────────────────
app.get('/api/matches', (req, res) => {
  const { comp } = req.query;
  let result = MATCHES;
  if (comp && comp !== 'all') result = MATCHES.filter(m => m.compKey === comp);
  res.json(result.map(processMatch));
});

// ─── API: detalle + H2H de un partido ──────────────────────────────────────
app.get('/api/matches/:id', (req, res) => {
  const m = MATCHES.find(x => x.id === parseInt(req.params.id));
  if (!m) return res.status(404).json({ error: 'Partido no encontrado' });
  res.json(processMatch(m));
});

// ─── API: análisis de combinación ──────────────────────────────────────────
app.post('/api/analyze', (req, res) => {
  const { selections } = req.body; // [{ matchId, mktIdx, odds, probReal }]
  if (!selections || selections.length === 0)
    return res.status(400).json({ error: 'Sin selecciones' });

  const cuotaTotal  = selections.reduce((acc, s) => acc * s.odds, 1);
  const probCombinada = selections.reduce((acc, s) => acc * s.probReal, 1);
  const veTotal     = probCombinada * cuotaTotal - 1;
  const margen      = selections.reduce((acc, s) => acc + (1 / s.odds - s.probReal), 0) / selections.length;

  // Clasificación de valor
  let clasificacion, recomendacion;
  if (veTotal > 0.08)       { clasificacion = 'EXCELENTE'; recomendacion = 'Combinación con valor alto. Recomendada.'; }
  else if (veTotal > 0.03)  { clasificacion = 'BUENA';     recomendacion = 'Valor positivo. Procede con confianza.'; }
  else if (veTotal >= 0)    { clasificacion = 'MARGINAL';  recomendacion = 'Valor marginal. Solo si tienes convicción alta.'; }
  else if (veTotal > -0.05) { clasificacion = 'RIESGO';    recomendacion = 'La casa tiene ventaja. Evalúa eliminar selecciones con VE-.'; }
  else                      { clasificacion = 'EVITAR';    recomendacion = 'VE muy negativo. No recomendado.'; }

  // Selecciones con VE individual negativo
  const alertas = selections
    .filter(s => (s.probReal * s.odds - 1) < -0.03)
    .map(s => s.label);

  res.json({
    cuotaTotal:       parseFloat(cuotaTotal.toFixed(3)),
    probCombinada:    parseFloat((probCombinada * 100).toFixed(2)),
    veTotal:          parseFloat((veTotal * 100).toFixed(2)),
    margenCasa:       parseFloat((margen * 100).toFixed(2)),
    clasificacion,
    recomendacion,
    alertas,
    nSelecciones:     selections.length
  });
});

// ─── API: simulación Monte Carlo ───────────────────────────────────────────
app.post('/api/simulate', (req, res) => {
  const { selections, stake = 10000, nBets = 1000, bankroll = 200000 } = req.body;
  if (!selections || !selections.length)
    return res.status(400).json({ error: 'Sin selecciones' });

  const cuota      = selections.reduce((a, s) => a * s.odds, 1);
  const probGanar  = selections.reduce((a, s) => a * s.probReal, 1);
  const N          = Math.min(Math.max(parseInt(nBets) || 1000, 100), 5000);

  let bank = bankroll;
  const curva = [];          // bankroll tras cada apuesta
  let wins = 0, maxBank = bankroll, minBank = bankroll;

  for (let i = 0; i < N; i++) {
    const gana = Math.random() < probGanar;
    if (gana) { bank += stake * (cuota - 1); wins++; }
    else        bank -= stake;
    if (bank > maxBank) maxBank = bank;
    if (bank < minBank) minBank = bank;
    // Guardar ~100 puntos para la curva
    if (i % Math.floor(N / 100) === 0) curva.push(Math.round(bank));
  }
  curva.push(Math.round(bank));

  const roi        = ((bank - bankroll) / (bankroll)) * 100;
  const winRate    = wins / N * 100;
  const expectativa = (probGanar * cuota - 1) * 100; // VE%

  res.json({
    nBets: N, stake, bankrollInicial: bankroll,
    bankrollFinal: Math.round(bank),
    roi: parseFloat(roi.toFixed(2)),
    winRate: parseFloat(winRate.toFixed(1)),
    wins, losses: N - wins,
    maxBank, minBank,
    expectativa: parseFloat(expectativa.toFixed(2)),
    cuota: parseFloat(cuota.toFixed(3)),
    probGanar: parseFloat((probGanar * 100).toFixed(2)),
    curva  // ~100 puntos de la curva de bankroll
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅  Coolbet Analyzer corriendo en → http://localhost:${PORT}\n`);
});
