// src/server.js — v3.4-Mundial
const express = require('express');
const path = require('path');
const MATCHES = require('../data/matches');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ─── Base de datos de sedes FIFA 2026 ───────────────────────────────────────
const VENUES = {
  // México
  'Azteca':       { ciudad:'Ciudad de México', altitude:2240, altLevel:'critica', tempMax:23, rain:true,  climaTag:'🏔️ Altitud crítica 2,240m · Lluvias frecuentes' },
  'Akron':        { ciudad:'Guadalajara',       altitude:1566, altLevel:'moderada', tempMax:26, rain:true,  climaTag:'🏔️ Altitud moderada 1,566m · Lluvias frecuentes' },
  'BBVA':         { ciudad:'Monterrey',         altitude:538,  altLevel:null,       tempMax:37, rain:false, climaTag:'🌡️ Calor extremo 33–37°C — sede más caliente' },
  // EE.UU.
  'Arlington':    { ciudad:'Dallas/Arlington',  altitude:0,    altLevel:null,       tempMax:34, rain:false, climaTag:'🌡️ Calor extremo 30–35°C' },
  'Houston':      { ciudad:'Houston',           altitude:0,    altLevel:null,       tempMax:34, rain:false, climaTag:'🌡️ Calor extremo 30–35°C + humedad alta' },
  'Miami':        { ciudad:'Miami',             altitude:0,    altLevel:null,       tempMax:33, rain:false, climaTag:'🌡️ Calor húmedo 30–33°C' },
  'Atlanta':      { ciudad:'Atlanta',           altitude:0,    altLevel:null,       tempMax:32, rain:false, climaTag:'🌡️ Calor húmedo 28–33°C (SEMIFINALES)' },
  'KansasCity':   { ciudad:'Kansas City',       altitude:0,    altLevel:null,       tempMax:31, rain:false, climaTag:'🌡️ Calor moderado 25–32°C' },
  'EastRutherford':{ ciudad:'Nueva Jersey',     altitude:0,    altLevel:null,       tempMax:29, rain:false, climaTag:'☁️ Cálido húmedo 25–30°C (FINAL)' },
  'Philadelphia': { ciudad:'Philadelphia',      altitude:0,    altLevel:null,       tempMax:29, rain:false, climaTag:'☁️ Cálido 25–30°C' },
  'Inglewood':    { ciudad:'Los Ángeles',       altitude:0,    altLevel:null,       tempMax:26, rain:false, climaTag:'🌤️ Seco 22–27°C' },
  'SFO':          { ciudad:'San Francisco',     altitude:0,    altLevel:null,       tempMax:22, rain:false, climaTag:'✅ Óptimo 18–22°C' },
  'Seattle':      { ciudad:'Seattle',           altitude:0,    altLevel:null,       tempMax:19, rain:true,  climaTag:'✅ Óptimo 16–20°C · posible lluvia' },
  // Canadá
  'Toronto':      { ciudad:'Toronto',           altitude:0,    altLevel:null,       tempMax:23, rain:false, climaTag:'✅ Óptimo 18–24°C' },
  'Vancouver':    { ciudad:'Vancouver',         altitude:0,    altLevel:null,       tempMax:19, rain:true,  climaTag:'✅ Óptimo 15–20°C · posible lluvia' },
};

// Detecta venue desde el campo time/estadio del partido
function getVenue(m) {
  const src = (m.estadio || m.time || '').toLowerCase();
  for (const [key, v] of Object.entries(VENUES)) {
    if (src.includes(key.toLowerCase()) ||
        src.includes(v.ciudad.toLowerCase().split('/')[0])) return { key, ...v };
  }
  // Fallback por palabras clave
  if (src.includes('azteca'))     return { key:'Azteca',   ...VENUES.Azteca };
  if (src.includes('akron') || src.includes('zapopan')) return { key:'Akron', ...VENUES.Akron };
  if (src.includes('bbva') || src.includes('monterrey')) return { key:'BBVA', ...VENUES.BBVA };
  if (src.includes('arlington'))  return { key:'Arlington', ...VENUES.Arlington };
  if (src.includes('houston'))    return { key:'Houston',  ...VENUES.Houston };
  if (src.includes('inglewood') || src.includes('los angeles') || src.includes('sofi')) return { key:'Inglewood', ...VENUES.Inglewood };
  if (src.includes('east rutherford') || src.includes('metlife') || src.includes('new jersey')) return { key:'EastRutherford', ...VENUES.EastRutherford };
  if (src.includes('kansas')) return { key:'KansasCity', ...VENUES.KansasCity };
  if (src.includes('miami'))   return { key:'Miami',   ...VENUES.Miami };
  if (src.includes('atlanta')) return { key:'Atlanta', ...VENUES.Atlanta };
  if (src.includes('toronto')) return { key:'Toronto', ...VENUES.Toronto };
  if (src.includes('seattle')) return { key:'Seattle', ...VENUES.Seattle };
  if (src.includes('vancouver') || src.includes('bc place')) return { key:'Vancouver', ...VENUES.Vancouver };
  if (src.includes('san francisco') || src.includes('bay area') || src.includes('levi')) return { key:'SFO', ...VENUES.SFO };
  if (src.includes('philadelphia')) return { key:'Philadelphia', ...VENUES.Philadelphia };
  return null;
}

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

// ─── Señales A-G del framework v3.4-Mundial ────────────────────────────────
function detectSignals(m) {
  const signals = [];
  const alerts  = [...(m.contexto?.alertas || [])];
  const ctx     = m.contexto || {};
  const venue   = getVenue(m);

  // ── SEÑAL G: Restricción diplomática ──────────────────────────────────────
  const diplomaticMap = {
    'Irán': 'extreme', 'Iran': 'extreme',
    'Haití': 'moderate', 'Haiti': 'moderate',
  };
  const gTeam = Object.keys(diplomaticMap).find(t => m.local === t || m.visit === t);
  if (gTeam) {
    const sev = diplomaticMap[gTeam];
    if (sev === 'extreme') {
      signals.push({ id:'G', msg:`Restricción EXTREMA (${gTeam}): entrada/salida mismo día en EE.UU., 15+ staff sin visa. Bajar 1 nivel todos los mercados de este equipo.`, level:'danger' });
      alerts.push(`🚨 Señal G EXTREMA: ${gTeam} — restricción diplomática`);
    } else {
      signals.push({ id:'G', msg:`Restricción logística moderada (${gTeam}): travel ban con exención deportiva. Bajar 1 nivel.`, level:'danger' });
      alerts.push(`🚨 Señal G: ${gTeam} — restricción logística`);
    }
  }

  // ── SEÑAL ALT: Altitud (vía base de datos de sedes) ───────────────────────
  if (venue) {
    if (venue.altLevel === 'critica') {
      if (!signals.some(s => s.id === 'ALT')) {
        signals.push({ id:'ALT', msg:`Altitud crítica ~${venue.altitude}m (${venue.ciudad}) — impacto SEVERO en ritmo, goles y resistencia, especialmente primeros 60 min.`, level:'warn' });
        alerts.push(`🏔️ Altitud crítica ${venue.altitude}m`);
      }
    } else if (venue.altLevel === 'moderada') {
      if (!signals.some(s => s.id === 'ALT')) {
        signals.push({ id:'ALT', msg:`Altitud moderada ~${venue.altitude}m (${venue.ciudad}) — impacto leve en ritmo. Equipos europeos y asiáticos lo notan claramente.`, level:'info' });
        alerts.push(`🏔️ Altitud moderada ${venue.altitude}m`);
      }
    }
  }

  // ── SEÑAL D: Clima extremo → impacta córneres y ritmo ────────────────────
  if (venue && !venue.altLevel && venue.tempMax >= 33) {
    signals.push({ id:'D', msg:`Calor extremo ${venue.tempMax}°C (${venue.ciudad}) → restar 2+ córneres a la línea estimada, ritmo reducido, más sustituciones tempranas.`, level:'warn' });
    alerts.push(`🌡️ Calor extremo ${venue.tempMax}°C`);
  } else if (venue && venue.rain) {
    signals.push({ id:'D-LLUVIA', msg:`Lluvias frecuentes (${venue.ciudad}) → reduce córneres y tiros lejanos, perjudica juego combinativo.`, level:'info' });
  }

  // ── SEÑAL B: Rotaciones por clasificación definida ────────────────────────
  const clL = ctx.clasificatorioLocal, clV = ctx.clasificatorioVisit;
  if (clL === 'clasificado' || clL === 'eliminado') {
    signals.push({ id:'B', msg:`Rotaciones probables — ${m.local} con situación clasificatoria definida (${clL}). Goleador titular baja a confianza Baja.`, level:'warn' });
    alerts.push(`🔄 Señal B: posibles rotaciones (${m.local})`);
  }
  if (clV === 'clasificado' || clV === 'eliminado') {
    signals.push({ id:'B', msg:`Rotaciones probables — ${m.visit} con situación clasificatoria definida (${clV}). Goleador titular baja a confianza Baja.`, level:'warn' });
    alerts.push(`🔄 Señal B: posibles rotaciones (${m.visit})`);
  }

  // ── SEÑAL DR: Dead rubber ─────────────────────────────────────────────────
  const deadRubberCtx = (clL === 'eliminado' && clV === 'eliminado') ||
                        (clL === 'clasificado' && clV === 'clasificado');
  const sl = m.statsLocal, sv = m.statsVisit;
  const formaL = sl.forma.filter(f => f === 'G').length;
  const formaV = sv.forma.filter(f => f === 'G').length;
  if (deadRubberCtx || (formaL >= 4 && formaV >= 4)) {
    signals.push({ id:'DR', msg:'⚠️ Posible Dead Rubber — motivación comprometida. Mercados 1X2, BTTS y O/U goles pierden fiabilidad. Priorizar tarjetas y córneres.', level:'danger' });
    alerts.push('⚠️ Posible Dead Rubber');
  }

  // ── SEÑAL PACTO TÁCTICO: J3 ambos clasifican con empate ──────────────────
  if (ctx.jornada === 3 && ctx.pactoPosible) {
    signals.push({ id:'PT', msg:'⚠️ Posible pacto táctico — a ambos equipos les conviene el empate. Suspender apuesta 1X2.', level:'danger' });
    alerts.push('⚠️ Riesgo de pacto táctico (J3)');
  }

  // ── SEÑAL F: Factor poco priceado detectado ───────────────────────────────
  const underpriced = [];
  if (signals.some(s => s.id === 'ALT')) underpriced.push('altitud');
  if (signals.some(s => s.id === 'G'))   underpriced.push('restricción logística');
  if (signals.some(s => s.id === 'B'))   underpriced.push('rotaciones');
  if (ctx.debut) underpriced.push('debut mundialista');
  if (ctx.cambioCampamento) underpriced.push('cambio de campamento base');
  if (ctx.diasDescansoLocal <= 3 || ctx.diasDescansoVisit <= 3) underpriced.push('fatiga/descanso insuficiente');
  if (underpriced.length) {
    signals.push({ id:'F', msg:`Factor poco priceado: ${underpriced.join(', ')}. Revisar si el mercado relacionado merece escalar confianza.`, level:'info' });
  }

  // ── REGLAS FIFA 2026 ──────────────────────────────────────────────────────
  if (ctx.altaTension || ctx.rivalidadHistorica) {
    signals.push({ id:'FIFA26', msg:'Reglas FIFA 2026: roja automática por taparse la boca en discusión + roja por abandonar campo en protesta. En partidos de alta tensión: escalar confianza en Over tarjetas rojas.', level:'info' });
  }

  // ── AMNISTÍA DE TARJETAS ──────────────────────────────────────────────────
  if (ctx.jornada === 3) {
    signals.push({ id:'AMN', msg:'Amnistía J3: al terminar la fase de grupos todas las amarillas individuales se borran. Solo afecta jugadores con 1 tarjeta; suspensiones pendientes se cumplen igual.', level:'info' });
  }

  return { signals, alerts, venue };
}

// ─── Nivel de confianza por mercado (v3.4) ─────────────────────────────────
function confLevel(probReal, ve, signals, categoria = '') {
  const hasG   = signals.some(s => s.id === 'G');
  const hasDR  = signals.some(s => s.id === 'DR');
  const hasPT  = signals.some(s => s.id === 'PT');
  const hasB   = signals.some(s => s.id === 'B');
  const orden  = ['Alta','Media','Baja','Sin valor'];

  // Dead rubber o pacto → sin valor en mercados de resultado/goles
  if ((hasDR || hasPT) && ['Resultado','Totales','BTTS'].includes(categoria)) {
    return 'Sin valor';
  }

  let level;
  if (ve > 0.06 && probReal > 0.55)      level = 'Alta';
  else if (ve > 0.02 && probReal > 0.40) level = 'Media';
  else if (ve >= 0)                       level = 'Baja';
  else                                    level = 'Sin valor';

  // Señal G: baja 1 nivel todos los mercados del equipo afectado
  if (hasG) level = orden[Math.min(orden.indexOf(level) + 1, 3)];

  // Señal B: goleador baja a Baja si hay rotaciones
  if (hasB && categoria === 'Primer Gol') level = 'Baja';

  return level;
}

// ─── Verificación de coherencia interna (Capa de Decisión v3.4) ────────────
function coherenceCheck(mercados, signals, m) {
  const corrections = [];
  const ctx = m.contexto || {};

  // SEÑAL A: velocistas vs BTTS
  // Sub-condición J1: favorito local dominante + J1 → BTTS No-Baja es válido sin corrección
  const bttsYes = mercados.find(mk => mk.label.includes('Ambos anotan') && mk.label.includes('Sí'));
  const bttsNo  = mercados.find(mk => mk.label.includes('Ambos anotan') && mk.label.includes('No'));
  const esJ1FavoritoLocal = ctx.jornada === 1 && ctx.favoritoLocal &&
                             Math.abs((m.statsLocal?.posLiga || 50) - (m.statsVisit?.posLiga || 50)) >= 20;
  if (ctx.visitanteVelocistas && bttsNo && !esJ1FavoritoLocal) {
    if (bttsNo.confianza === 'Media' || bttsNo.confianza === 'Alta') {
      corrections.push('🔴 Señal A: Velocistas del visitante → BTTS-No bajado a Baja');
      bttsNo.confianza = 'Baja';
    }
  }
  if (ctx.visitanteVelocistas && bttsYes && !esJ1FavoritoLocal) {
    if (!bttsYes.confianza || bttsYes.confianza === 'Baja') {
      corrections.push('🟡 Señal A: Velocistas presentes → revisado BTTS-Sí');
    }
  }

  // SEÑAL C: hándicap en partido ajustado
  const pL = m.mercados?.[0]?.probReal || 0.4;
  const pV = m.mercados?.[2]?.probReal || 0.3;
  const handicapMkt = mercados.find(mk => mk.categoria === 'Hándicap' &&
    (mk.label.includes('-1') || mk.label.includes('-0')));
  if (Math.abs(pL - pV) < 0.15 && handicapMkt?.confianza === 'Alta') {
    corrections.push('🔴 Señal C: partido ajustado → hándicap -1 bajado de Alta a Media');
    handicapMkt.confianza = 'Media';
  }

  // SEÑAL D: clima extremo vs línea córneres
  const hasClima = signals.some(s => s.id === 'D');
  if (hasClima) {
    const overCornHigh = mercados.find(mk =>
      mk.categoria === 'Córneres' && mk.label.includes('Más de') &&
      ['9.5','10.5','11.5'].some(l => mk.label.includes(l)) && mk.confianza !== 'Baja'
    );
    if (overCornHigh) {
      corrections.push('🔴 Señal D: clima extremo → línea córneres alta bajada a Baja');
      overCornHigh.confianza = 'Baja';
    }
  }

  // SEÑAL E: rival débil → Over goles puede escalar
  const gcVisitAlto = (m.statsVisit?.gcProm || 0) > 1.8;
  const gfLocalAlto = (m.statsLocal?.gfProm || 0) > 2.2;
  const over25 = mercados.find(mk => mk.label === 'Más de 2.5 goles');
  if (gcVisitAlto && gfLocalAlto && over25 && over25.confianza === 'Media') {
    corrections.push('🟢 Señal E: rival frágil + local en forma → Over 2.5 escalado a Alta');
    over25.confianza = 'Alta';
  }

  // FILTRO DE CALIDAD (Paso 3)
  const apuestaCandidatos = mercados
    .filter(mk => mk.confianza === 'Alta' && mk.ve > 0.03 && mk.odds > 1.20)
    .sort((a, b) => b.ve - a.ve);

  const apuestaRecomendada = apuestaCandidatos[0] || null;

  const declaracion = corrections.length
    ? corrections.join(' | ')
    : '✅ Sin contradicciones detectadas';

  return { corrections, declaracion, apuestaRecomendada };
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
      confianza: confLevel(mk.probReal, ve, signals, mk.categoria || '')
    };
  });
}

function buildBloque0(m, signals, venue) {
  const ctx = m.contexto || {};
  const clL = ctx.clasificatorioLocal  || null;
  const clV = ctx.clasificatorioVisit  || null;
  const hasDR  = signals.some(s => s.id === 'DR');
  const hasPT  = signals.some(s => s.id === 'PT');
  const hasG   = signals.some(s => s.id === 'G');
  const hasB   = signals.some(s => s.id === 'B');
  const hasAlt = signals.some(s => s.id === 'ALT');
  const hasClima = signals.some(s => ['D','D-LLUVIA'].includes(s.id));

  const alerta = hasDR ? '⚠️ DEAD RUBBER — motivación comprometida'
               : hasPT ? '⚠️ RIESGO PACTO TÁCTICO (J3)'
               : hasG  ? '🚨 RESTRICCIÓN DIPLOMÁTICA ACTIVA'
               : null;

  return {
    fase:      m.fase || '—',
    jornada:   ctx.jornada ? `J${ctx.jornada}` : null,
    sede:      venue ? `${venue.ciudad} (${venue.key})` : (m.time || '—'),
    clima:     venue?.climaTag || null,
    altitud:   venue?.altitude > 0 ? `${venue.altitude}m (${venue.altLevel})` : null,
    clasificatoriLocal:  clL,
    clasificatoriVisit:  clV,
    deadRubber:   hasDR,
    pactoPosible: hasPT,
    restriccion:  hasG,
    rotaciones:   hasB,
    factorAltitud: hasAlt,
    factorClima:   hasClima,
    alerta,
    arbitro:   ctx.arbitro || null,
    suspensiones: ctx.suspensiones || [],
    diasDescanso: {
      local: ctx.diasDescansoLocal || null,
      visit: ctx.diasDescansoVisit || null
    }
  };
}

function processMatch(m) {
  const { signals, alerts, venue } = detectSignals(m);
  const mercadosRaw  = calcVE(enrichMercados(m), signals);
  const coherence    = coherenceCheck(mercadosRaw, signals, m);
  const bloque0      = buildBloque0(m, signals, venue);
  return {
    ...m,
    signals,
    alertas: alerts,
    mercados: mercadosRaw,
    coherencia: coherence,
    bloque0
  };
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
