// ── Leyendas animadas del fútbol mundial ────────────────────────────────────
const LEGENDS = [
  {
    id: 'maradona',
    name: 'Maradona',
    country: 'Argentina',
    num: '10',
    jerseyColor: '#75aadb',
    jerseyStripe: '#fff',
    shortColor: '#fff',
    skinColor: '#d4956a',
    hairColor: '#1a0a00',
    svg: (j, s, sk, h) => `
      <g class="legend-body">
        <!-- Pelo rizado Maradona -->
        <ellipse cx="24" cy="12" rx="11" ry="9" fill="${h}"/>
        <circle cx="17" cy="14" r="4" fill="${h}"/>
        <circle cx="31" cy="14" r="4" fill="${h}"/>
        <circle cx="14" cy="18" r="3" fill="${h}"/>
        <circle cx="34" cy="18" r="3" fill="${h}"/>
        <!-- Cara -->
        <ellipse cx="24" cy="16" rx="9" ry="10" fill="${sk}"/>
        <!-- Ojos -->
        <circle cx="20" cy="14" r="1.5" fill="#1a0a00"/>
        <circle cx="28" cy="14" r="1.5" fill="#1a0a00"/>
        <!-- Sonrisa -->
        <path d="M19 20 Q24 24 29 20" stroke="#8b4513" stroke-width="1.2" fill="none"/>
        <!-- Bigote -->
        <path d="M20 18 Q24 20 28 18" stroke="#1a0a00" stroke-width="1.5" fill="none"/>
        <!-- Cuerpo jersey celeste -->
        <path d="M15 26 Q24 23 33 26 L35 52 Q24 55 13 52 Z" fill="${j}"/>
        <!-- Número 10 -->
        <text x="24" y="44" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">10</text>
        <!-- Cuello -->
        <rect x="20" y="23" width="8" height="4" rx="2" fill="${sk}"/>
        <!-- Brazos -->
        <path d="M15 28 Q8 36 10 44" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M33 28 Q40 36 38 44" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Manos -->
        <circle cx="10" cy="45" r="3.5" fill="${sk}"/>
        <circle cx="38" cy="45" r="3.5" fill="${sk}"/>
        <!-- Short -->
        <path d="M14 52 L16 64 L24 62 L32 64 L34 52 Z" fill="${s}"/>
        <!-- Piernas -->
        <rect x="15" y="63" width="7" height="18" rx="3" fill="${sk}"/>
        <rect x="26" y="63" width="7" height="18" rx="3" fill="${sk}"/>
        <!-- Medias celeste -->
        <rect x="15" y="72" width="7" height="10" rx="2" fill="${j}"/>
        <rect x="26" y="72" width="7" height="10" rx="2" fill="${j}"/>
        <!-- Botines -->
        <ellipse cx="18" cy="82" rx="6" ry="3" fill="#111"/>
        <ellipse cx="29" cy="82" rx="6" ry="3" fill="#111"/>
      </g>`
  },
  {
    id: 'pele',
    name: 'Pelé',
    country: 'Brasil',
    num: '10',
    jerseyColor: '#f4c430',
    jerseyStripe: '#009c3b',
    shortColor: '#003087',
    skinColor: '#8b5a2b',
    hairColor: '#0a0a0a',
    svg: (j, s, sk, h) => `
      <g class="legend-body">
        <!-- Cabeza -->
        <ellipse cx="24" cy="15" rx="10" ry="11" fill="${sk}"/>
        <!-- Pelo corto -->
        <ellipse cx="24" cy="8" rx="10" ry="6" fill="${h}"/>
        <!-- Ojos -->
        <circle cx="20" cy="14" r="1.8" fill="#0a0a0a"/>
        <circle cx="28" cy="14" r="1.8" fill="#0a0a0a"/>
        <!-- Sonrisa grande Pelé -->
        <path d="M17 20 Q24 27 31 20" stroke="#4a1a00" stroke-width="1.2" fill="none"/>
        <path d="M18 21 Q24 26 30 21" fill="rgba(255,255,255,0.7)"/>
        <!-- Cuello -->
        <rect x="20" y="24" width="8" height="4" rx="2" fill="${sk}"/>
        <!-- Jersey amarillo Brasil -->
        <path d="M15 28 Q24 24 33 28 L35 54 Q24 57 13 54 Z" fill="${j}"/>
        <!-- Franja verde -->
        <path d="M13 38 Q24 35 35 38 L35 44 Q24 47 13 44 Z" fill="${s}" opacity="0.5"/>
        <!-- Número 10 -->
        <text x="24" y="46" text-anchor="middle" font-size="10" font-weight="bold" fill="${s}">10</text>
        <!-- Brazos -->
        <path d="M15 30 Q7 40 9 48" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M33 30 Q41 40 39 48" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="9" cy="49" r="3.5" fill="${sk}"/>
        <circle cx="39" cy="49" r="3.5" fill="${sk}"/>
        <!-- Short azul -->
        <path d="M14 54 L16 66 L24 64 L32 66 L34 54 Z" fill="${s}"/>
        <!-- Piernas -->
        <rect x="15" y="65" width="7" height="17" rx="3" fill="${sk}"/>
        <rect x="26" y="65" width="7" height="17" rx="3" fill="${sk}"/>
        <!-- Medias -->
        <rect x="15" y="73" width="7" height="9" rx="2" fill="${j}"/>
        <rect x="26" y="73" width="7" height="9" rx="2" fill="${j}"/>
        <!-- Botines -->
        <ellipse cx="18" cy="83" rx="6" ry="3" fill="#111"/>
        <ellipse cx="29" cy="83" rx="6" ry="3" fill="#111"/>
        <!-- Balón -->
        <circle cx="43" cy="75" r="7" fill="#fff" stroke="#222" stroke-width="1"/>
        <path d="M43 68 Q47 71 46 76 Q43 80 39 78 Q38 73 40 69 Z" fill="#222"/>
      </g>`
  },
  {
    id: 'r9',
    name: 'Ronaldo R9',
    country: 'Brasil',
    num: '9',
    jerseyColor: '#f4c430',
    jerseyStripe: '#009c3b',
    shortColor: '#003087',
    skinColor: '#8b5a2b',
    hairColor: '#0a0a0a',
    svg: (j, s, sk, h) => `
      <g class="legend-body">
        <!-- Cabeza + pelo hacia adelante (corte R9 2002) -->
        <ellipse cx="24" cy="15" rx="10" ry="11" fill="${sk}"/>
        <!-- Mechón frontal icónico -->
        <path d="M14 10 Q24 4 34 10 Q30 6 24 5 Q18 6 14 10 Z" fill="${h}"/>
        <path d="M20 5 Q24 2 28 5 Q26 8 24 8 Q22 8 20 5 Z" fill="${h}"/>
        <!-- Ojos -->
        <circle cx="20" cy="14" r="1.8" fill="#0a0a0a"/>
        <circle cx="28" cy="14" r="1.8" fill="#0a0a0a"/>
        <!-- Sonrisa con diente separado -->
        <path d="M18 21 Q24 26 30 21" stroke="#4a1a00" stroke-width="1.2" fill="none"/>
        <rect x="22" y="21" width="4" height="4" rx="1" fill="white" opacity="0.8"/>
        <!-- Cuello -->
        <rect x="20" y="24" width="8" height="4" rx="2" fill="${sk}"/>
        <!-- Jersey -->
        <path d="M15 28 Q24 24 33 28 L35 54 Q24 57 13 54 Z" fill="${j}"/>
        <text x="24" y="46" text-anchor="middle" font-size="10" font-weight="bold" fill="${s}">9</text>
        <!-- Brazos corriendo (levantado uno) -->
        <path d="M15 30 Q5 25 4 18" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M33 30 Q41 38 40 46" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="4" cy="17" r="3.5" fill="${sk}"/>
        <circle cx="40" cy="47" r="3.5" fill="${sk}"/>
        <!-- Short -->
        <path d="M14 54 L16 66 L24 64 L32 66 L34 54 Z" fill="${s}"/>
        <!-- Piernas (corriendo) -->
        <path d="M16 65 Q14 72 18 80" stroke="${sk}" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M32 65 Q36 74 30 80" stroke="${sk}" stroke-width="7" stroke-linecap="round" fill="none"/>
        <ellipse cx="18" cy="82" rx="6" ry="3" fill="#111"/>
        <ellipse cx="30" cy="82" rx="6" ry="3" fill="#111"/>
      </g>`
  },
  {
    id: 'zidane',
    name: 'Zidane',
    country: 'Francia',
    num: '10',
    jerseyColor: '#002395',
    jerseyStripe: '#ED2939',
    shortColor: '#002395',
    skinColor: '#d4956a',
    hairColor: '#3a2a1a',
    svg: (j, s, sk, h) => `
      <g class="legend-body">
        <!-- Cabeza calva con algo de pelo -->
        <ellipse cx="24" cy="15" rx="10" ry="11" fill="${sk}"/>
        <!-- Pelo muy corto (casi calvo) -->
        <path d="M14 11 Q24 5 34 11 Q30 7 24 7 Q18 7 14 11 Z" fill="${h}" opacity="0.7"/>
        <!-- Ojos profundos -->
        <circle cx="20" cy="14" r="2" fill="#2a1a0a"/>
        <circle cx="28" cy="14" r="2" fill="#2a1a0a"/>
        <!-- Cejas marcadas -->
        <path d="M17 10 Q20 9 23 10" stroke="${h}" stroke-width="1.5" fill="none"/>
        <path d="M25 10 Q28 9 31 10" stroke="${h}" stroke-width="1.5" fill="none"/>
        <!-- Boca seria -->
        <path d="M20 21 Q24 22 28 21" stroke="#8b4513" stroke-width="1.2" fill="none"/>
        <!-- Cuello -->
        <rect x="20" y="24" width="8" height="4" rx="2" fill="${sk}"/>
        <!-- Jersey azul Francia -->
        <path d="M15 28 Q24 24 33 28 L35 54 Q24 57 13 54 Z" fill="${j}"/>
        <!-- Detalle tricolor -->
        <path d="M15 28 L15 36 Q18 34 21 36 L21 28 Z" fill="#fff" opacity="0.6"/>
        <path d="M27 28 L27 36 Q30 34 33 36 L33 28 Z" fill="${s}" opacity="0.6"/>
        <text x="24" y="46" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">10</text>
        <!-- Brazos -->
        <path d="M15 30 Q8 40 10 48" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M33 30 Q40 40 38 48" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="10" cy="49" r="3.5" fill="${sk}"/>
        <circle cx="38" cy="49" r="3.5" fill="${sk}"/>
        <!-- Short -->
        <path d="M14 54 L16 66 L24 64 L32 66 L34 54 Z" fill="${j}"/>
        <!-- Piernas -->
        <rect x="15" y="65" width="7" height="17" rx="3" fill="${sk}"/>
        <rect x="26" y="65" width="7" height="17" rx="3" fill="${sk}"/>
        <ellipse cx="18" cy="83" rx="6" ry="3" fill="#111"/>
        <ellipse cx="29" cy="83" rx="6" ry="3" fill="#111"/>
      </g>`
  },
  {
    id: 'messi',
    name: 'Messi',
    country: 'Argentina',
    num: '10',
    jerseyColor: '#75aadb',
    jerseyStripe: '#fff',
    shortColor: '#111',
    skinColor: '#d4956a',
    hairColor: '#2a1a00',
    svg: (j, s, sk, h) => `
      <g class="legend-body">
        <!-- Cabeza -->
        <ellipse cx="24" cy="15" rx="9" ry="11" fill="${sk}"/>
        <!-- Pelo -->
        <path d="M15 12 Q24 4 33 12 Q28 6 24 5 Q20 6 15 12 Z" fill="${h}"/>
        <path d="M15 10 Q15 16 16 18" stroke="${h}" stroke-width="3" fill="none"/>
        <!-- Barba -->
        <path d="M16 20 Q24 26 32 20 Q30 25 24 27 Q18 25 16 20 Z" fill="${h}" opacity="0.8"/>
        <!-- Ojos -->
        <circle cx="20" cy="14" r="1.8" fill="#1a0a00"/>
        <circle cx="28" cy="14" r="1.8" fill="#1a0a00"/>
        <!-- Boca -->
        <path d="M20 20 Q24 22 28 20" stroke="#4a1a00" stroke-width="1" fill="none"/>
        <!-- Cuello -->
        <rect x="20" y="26" width="8" height="3" rx="2" fill="${sk}"/>
        <!-- Jersey celeste/blanco a rayas -->
        <path d="M15 29 Q24 25 33 29 L35 54 Q24 57 13 54 Z" fill="${j}"/>
        <rect x="21" y="29" width="6" height="25" fill="${s}" opacity="0.4"/>
        <text x="24" y="46" text-anchor="middle" font-size="10" font-weight="bold" fill="#111">10</text>
        <!-- Brazos (regateando) -->
        <path d="M15 31 Q6 38 8 46" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M33 31 Q42 28 44 20" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="8" cy="47" r="3.5" fill="${sk}"/>
        <circle cx="44" cy="19" r="3.5" fill="${sk}"/>
        <!-- Short -->
        <path d="M14 54 L16 66 L24 64 L32 66 L34 54 Z" fill="${s}"/>
        <!-- Piernas -->
        <rect x="15" y="65" width="7" height="17" rx="3" fill="${sk}"/>
        <rect x="26" y="65" width="7" height="17" rx="3" fill="${sk}"/>
        <rect x="15" y="72" width="7" height="10" rx="2" fill="${j}"/>
        <rect x="26" y="72" width="7" height="10" rx="2" fill="${j}"/>
        <ellipse cx="18" cy="83" rx="6" ry="3" fill="#111"/>
        <ellipse cx="29" cy="83" rx="6" ry="3" fill="#111"/>
      </g>`
  },
  {
    id: 'ronaldo',
    name: 'CR7',
    country: 'Portugal',
    num: '7',
    jerseyColor: '#006600',
    jerseyStripe: '#cc0000',
    shortColor: '#cc0000',
    skinColor: '#c8845a',
    hairColor: '#0a0a0a',
    svg: (j, s, sk, h) => `
      <g class="legend-body">
        <!-- Cabeza -->
        <ellipse cx="24" cy="14" rx="10" ry="11" fill="${sk}"/>
        <!-- Pelo CR7 con gel -->
        <path d="M14 10 Q24 3 34 10 Q28 4 24 3 Q20 4 14 10 Z" fill="${h}"/>
        <path d="M18 5 Q22 3 24 4 Q26 3 28 5" stroke="${h}" stroke-width="2" fill="none"/>
        <!-- Mandíbula cuadrada -->
        <path d="M14 18 Q14 24 24 26 Q34 24 34 18" fill="${sk}"/>
        <!-- Ojos -->
        <circle cx="20" cy="13" r="1.8" fill="#1a0a00"/>
        <circle cx="28" cy="13" r="1.8" fill="#1a0a00"/>
        <!-- Sonrisa perfecta -->
        <path d="M19 21 Q24 25 29 21" stroke="#4a1a00" stroke-width="1" fill="none"/>
        <path d="M20 22 Q24 25 28 22" fill="rgba(255,255,255,0.8)"/>
        <!-- Cuello -->
        <rect x="20" y="25" width="8" height="4" rx="2" fill="${sk}"/>
        <!-- Jersey verde Portugal -->
        <path d="M15 29 Q24 25 33 29 L35 54 Q24 57 13 54 Z" fill="${j}"/>
        <path d="M15 29 L15 54 L19 54 L19 29 Z" fill="${s}" opacity="0.7"/>
        <text x="25" y="46" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">7</text>
        <!-- Brazos musculosos -->
        <path d="M15 31 Q7 38 9 47" stroke="${j}" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M33 31 Q41 38 39 47" stroke="${j}" stroke-width="7" stroke-linecap="round" fill="none"/>
        <circle cx="9" cy="48" r="3.5" fill="${sk}"/>
        <circle cx="39" cy="48" r="3.5" fill="${sk}"/>
        <!-- Short -->
        <path d="M14 54 L16 67 L24 65 L32 67 L34 54 Z" fill="${s}"/>
        <!-- Piernas musculosas -->
        <rect x="15" y="66" width="8" height="17" rx="3" fill="${sk}"/>
        <rect x="25" y="66" width="8" height="17" rx="3" fill="${sk}"/>
        <ellipse cx="19" cy="84" rx="6" ry="3" fill="#111"/>
        <ellipse cx="29" cy="84" rx="6" ry="3" fill="#111"/>
      </g>`
  },
  {
    id: 'beckham',
    name: 'Beckham',
    country: 'Inglaterra',
    num: '7',
    jerseyColor: '#fff',
    jerseyStripe: '#cc0000',
    shortColor: '#fff',
    skinColor: '#e8c89a',
    hairColor: '#c8a000',
    svg: (j, s, sk, h) => `
      <g class="legend-body">
        <!-- Cabeza -->
        <ellipse cx="24" cy="14" rx="9" ry="10" fill="${sk}"/>
        <!-- Pelo rubio peinado -->
        <path d="M15 11 Q24 4 33 11 Q26 5 24 4 Q22 5 15 11 Z" fill="${h}"/>
        <path d="M15 9 Q18 6 22 7" stroke="${h}" stroke-width="2.5" fill="none"/>
        <!-- Ojos azules -->
        <circle cx="20" cy="13" r="1.8" fill="#3366cc"/>
        <circle cx="28" cy="13" r="1.8" fill="#3366cc"/>
        <!-- Sonrisa modelo -->
        <path d="M19 20 Q24 24 29 20" stroke="#8b4513" stroke-width="1" fill="none"/>
        <!-- Cuello -->
        <rect x="20" y="23" width="8" height="4" rx="2" fill="${sk}"/>
        <!-- Jersey blanco England -->
        <path d="M15 27 Q24 23 33 27 L35 52 Q24 55 13 52 Z" fill="${j}" stroke="#ddd" stroke-width="0.5"/>
        <path d="M19 27 L19 52" stroke="${s}" stroke-width="1" opacity="0.3"/>
        <path d="M29 27 L29 52" stroke="${s}" stroke-width="1" opacity="0.3"/>
        <text x="24" y="44" text-anchor="middle" font-size="10" font-weight="bold" fill="#cc0000">7</text>
        <!-- Brazos -->
        <path d="M15 29 Q8 37 10 45" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none" style="stroke:#ddd"/>
        <path d="M33 29 Q42 32 44 24" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none" style="stroke:#ddd"/>
        <circle cx="10" cy="46" r="3.5" fill="${sk}"/>
        <circle cx="44" cy="23" r="3.5" fill="${sk}"/>
        <!-- Short blanco -->
        <path d="M14 52 L16 64 L24 62 L32 64 L34 52 Z" fill="${j}" stroke="#ddd" stroke-width="0.5"/>
        <!-- Piernas -->
        <rect x="15" y="63" width="7" height="17" rx="3" fill="${sk}"/>
        <rect x="26" y="63" width="7" height="17" rx="3" fill="${sk}"/>
        <rect x="15" y="70" width="7" height="10" rx="2" fill="#cc0000"/>
        <rect x="26" y="70" width="7" height="10" rx="2" fill="#cc0000"/>
        <ellipse cx="18" cy="81" rx="6" ry="3" fill="#111"/>
        <ellipse cx="29" cy="81" rx="6" ry="3" fill="#111"/>
      </g>`
  },
  {
    id: 'cruyff',
    name: 'Cruyff',
    country: 'Holanda',
    num: '14',
    jerseyColor: '#ff6600',
    jerseyStripe: '#fff',
    shortColor: '#fff',
    skinColor: '#e8c89a',
    hairColor: '#8b6914',
    svg: (j, s, sk, h) => `
      <g class="legend-body">
        <!-- Cabeza -->
        <ellipse cx="24" cy="14" rx="9" ry="10" fill="${sk}"/>
        <!-- Pelo largo 70s -->
        <path d="M14 10 Q24 3 34 10 Q32 5 24 4 Q16 5 14 10 Z" fill="${h}"/>
        <path d="M14 10 Q11 16 13 22" stroke="${h}" stroke-width="3" fill="none"/>
        <path d="M34 10 Q37 16 35 22" stroke="${h}" stroke-width="3" fill="none"/>
        <!-- Ojos -->
        <circle cx="20" cy="13" r="1.8" fill="#3a2a10"/>
        <circle cx="28" cy="13" r="1.8" fill="#3a2a10"/>
        <!-- Expresión concentrada -->
        <path d="M20 20 Q24 22 28 20" stroke="#8b4513" stroke-width="1" fill="none"/>
        <!-- Cuello -->
        <rect x="20" y="23" width="8" height="4" rx="2" fill="${sk}"/>
        <!-- Jersey naranja Holanda -->
        <path d="M15 27 Q24 23 33 27 L35 52 Q24 55 13 52 Z" fill="${j}"/>
        <text x="24" y="44" text-anchor="middle" font-size="9" font-weight="bold" fill="#fff">14</text>
        <!-- Brazos señalando -->
        <path d="M15 29 Q4 28 2 22" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M33 29 Q40 36 38 44" stroke="${j}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="2" cy="21" r="3.5" fill="${sk}"/>
        <circle cx="38" cy="45" r="3.5" fill="${sk}"/>
        <!-- Short -->
        <path d="M14 52 L16 64 L24 62 L32 64 L34 52 Z" fill="${s}"/>
        <!-- Piernas -->
        <rect x="15" y="63" width="7" height="17" rx="3" fill="${sk}"/>
        <rect x="26" y="63" width="7" height="17" rx="3" fill="${sk}"/>
        <rect x="15" y="70" width="7" height="10" rx="2" fill="${j}"/>
        <rect x="26" y="70" width="7" height="10" rx="2" fill="${j}"/>
        <ellipse cx="18" cy="81" rx="6" ry="3" fill="#111"/>
        <ellipse cx="29" cy="81" rx="6" ry="3" fill="#111"/>
      </g>`
  }
];

// ── Spawn en esquina inferior derecha ────────────────────────────────────────
let activeLegend = null;

function createLegendEl(legend) {
  const size = 80 + Math.random() * 20;
  const svgContent = legend.svg(
    legend.jerseyColor, legend.shortColor, legend.skinColor, legend.hairColor
  );

  const wrap = document.createElement('div');
  wrap.className = 'legend-char legend-corner';
  wrap.title = `${legend.name} — ${legend.country} #${legend.num}`;
  wrap.style.cssText = `
    position: fixed;
    bottom: 16px;
    right: 380px;
    width: ${size}px;
    pointer-events: none;
    z-index: 10;
    opacity: 0;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.8));
    transform: translateY(30px) scale(0.8);
    transition: opacity .5s ease, transform .5s cubic-bezier(.34,1.56,.64,1);
  `;

  wrap.innerHTML = `
    <svg viewBox="0 0 48 88" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.83}">
      <defs>
        <filter id="legendGlow${legend.id}">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g style="filter:url(#legendGlow${legend.id})" transform="scale(0.48) translate(0,0)">
        ${svgContent}
      </g>
    </svg>
    <div class="legend-name-tag">${legend.name}</div>
  `;

  return wrap;
}

function spawnLegend() {
  // Remover el anterior si existe
  if (activeLegend) {
    activeLegend.style.opacity = '0';
    activeLegend.style.transform = 'translateY(30px) scale(0.8)';
    setTimeout(() => activeLegend?.remove(), 500);
    activeLegend = null;
  }

  const legend = LEGENDS[Math.floor(Math.random() * LEGENDS.length)];
  const el     = createLegendEl(legend);
  document.body.appendChild(el);
  activeLegend = el;

  // Entrada
  requestAnimationFrame(() => {
    setTimeout(() => {
      el.style.opacity = '0.92';
      el.style.transform = 'translateY(0) scale(1)';
    }, 30);
  });

  // Idle bounce suave mientras está visible
  let bounceDir = 1;
  const bounce = setInterval(() => {
    if (!el.parentNode) { clearInterval(bounce); return; }
    el.style.transform = `translateY(${bounceDir * -6}px) scale(1)`;
    bounceDir *= -1;
  }, 1200);

  // Salida después de 8s
  setTimeout(() => {
    clearInterval(bounce);
    if (el.parentNode) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px) scale(0.8)';
      setTimeout(() => { el.remove(); if (activeLegend === el) activeLegend = null; }, 600);
    }
  }, 8000);
}

function scheduleLegend() {
  const delay = 7000 + Math.random() * 9000; // 7-16s entre apariciones
  setTimeout(() => {
    spawnLegend();
    scheduleLegend();
  }, delay);
}

// Primera aparición a los 3s
setTimeout(() => {
  spawnLegend();
  scheduleLegend();
}, 3000);
