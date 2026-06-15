// data/matches.js - Base de datos de partidos y estadísticas
const MATCHES = [
  // ── MUNDIAL 2026 (partidos reales según calendario FIFA) ──────────────────
  {
    id: 10,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo A",
    local: "México",
    visit: "Sudáfrica",
    time: "Hoy 15:00 ET · Est. Azteca",
    statsLocal: {
      forma: ["V","V","E","V","G"],
      gfProm: 1.9,
      gcProm: 0.9,
      racha: "Anfitrión, fuerte en casa",
      posLiga: 15,
      golesUltimos5: [2,2,1,2,1],
      gcUltimos5: [1,0,1,0,2],
      localRecord: { v:7, e:3, d:1 }
    },
    statsVisit: {
      forma: ["V","G","E","V","G"],
      gfProm: 1.2,
      gcProm: 1.3,
      racha: "Irregular fuera",
      posLiga: 58,
      golesUltimos5: [1,0,1,2,0],
      gcUltimos5: [2,2,1,1,2],
      visitRecord: { v:2, e:3, d:5 }
    },
    h2h: {
      local: 3, empate: 1, visit: 1,
      golesLocal:  [2,1,3,1,2],
      golesVisit:  [0,1,1,2,1],
      partidos: [
        { fecha:"2022", res:"2-0", ganador:"local" },
        { fecha:"2018", res:"1-0", ganador:"local" },
        { fecha:"2014", res:"3-1", ganador:"local" },
        { fecha:"2010", res:"1-1", ganador:"empate" },
        { fecha:"2002", res:"1-2", ganador:"visit" }
      ]
    },
    mercados: [
      { label:"1 México",               odds:1.85, probCasa:0.541, probReal:0.55 },
      { label:"Empate",                 odds:3.40, probCasa:0.294, probReal:0.26 },
      { label:"2 Sudáfrica",            odds:4.50, probCasa:0.222, probReal:0.19 },
      { label:"Más de 2.5 goles",       odds:2.20, probCasa:0.455, probReal:0.42 },
      { label:"Menos de 2.5 goles",     odds:1.68, probCasa:0.595, probReal:0.58 },
      { label:"México no pierde",       odds:1.42, probCasa:0.704, probReal:0.81 }
    ],
    mercadosBetano: [
      { label:"1 México",   odds:1.80, probCasa:0.556, probReal:0.55 },
      { label:"Empate",     odds:3.55, probCasa:0.282, probReal:0.26 },
      { label:"2 Sudáfrica",odds:4.60, probCasa:0.217, probReal:0.19 }
    ],
    resultado: {
      status: "FT",
      scoreLocal: 2, scoreVisit: 0,
      goles: [
        { min: 9,  jugador: "J. Quiñones", equipo: "local" },
        { min: 67, jugador: "R. Jiménez",  equipo: "local" }
      ],
      amarillas: { local: [], visit: [] },
      rojas: [
        { min: 49,  jugador: "S. Sithole",  equipo: "visit" },
        { min: 84,  jugador: "T. Zwane",    equipo: "visit" },
        { min: 92,  jugador: "C. Montes",   equipo: "local" }
      ]
    },
    contexto: {
      jornada: 1,
      favoritoLocal: true,
      visitanteVelocistas: true,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: false,
      altaTension: false
    }
  },
  {
    id: 11,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo A",
    local: "Corea del Sur",
    visit: "Chequia",
    time: "Hoy 22:00 ET · Zapopan",
    statsLocal: {
      forma: ["V","E","V","G","V"],
      gfProm: 1.6,
      gcProm: 1.0,
      racha: "En forma reciente",
      posLiga: 22,
      golesUltimos5: [2,1,2,0,2],
      gcUltimos5: [1,1,0,2,1],
      localRecord: { v:5, e:3, d:3 }
    },
    statsVisit: {
      forma: ["V","V","G","V","E"],
      gfProm: 1.5,
      gcProm: 1.1,
      racha: "Consistente en Europa",
      posLiga: 37,
      golesUltimos5: [2,1,0,2,1],
      gcUltimos5: [1,0,2,1,1],
      visitRecord: { v:4, e:3, d:4 }
    },
    h2h: {
      local: 2, empate: 1, visit: 2,
      golesLocal:  [2,1,0,2,1],
      golesVisit:  [1,1,1,2,3],
      partidos: [
        { fecha:"2023", res:"2-1", ganador:"local" },
        { fecha:"2019", res:"0-1", ganador:"visit" },
        { fecha:"2016", res:"2-1", ganador:"local" },
        { fecha:"2010", res:"1-1", ganador:"empate" },
        { fecha:"2006", res:"1-3", ganador:"visit" }
      ]
    },
    mercados: [
      { label:"1 Corea del Sur",        odds:2.40, probCasa:0.417, probReal:0.38 },
      { label:"Empate",                 odds:3.10, probCasa:0.323, probReal:0.30 },
      { label:"2 Chequia",              odds:2.90, probCasa:0.345, probReal:0.32 },
      { label:"Más de 2.5 goles",       odds:2.00, probCasa:0.500, probReal:0.46 },
      { label:"Menos de 2.5 goles",     odds:1.80, probCasa:0.556, probReal:0.54 },
      { label:"Ambos anotan — Sí",      odds:1.90, probCasa:0.526, probReal:0.52 }
    ],
    mercadosBetano: [
      { label:"1 Corea del Sur", odds:2.38, probCasa:0.420, probReal:0.38 },
      { label:"Empate",          odds:3.15, probCasa:0.317, probReal:0.30 },
      { label:"2 Chequia",       odds:2.95, probCasa:0.339, probReal:0.32 }
    ],
    resultado: {
      status: "FT",
      scoreLocal: 2, scoreVisit: 1,
      goles: [
        { min: 59, jugador: "L. Krejčí",     equipo: "visit" },
        { min: 67, jugador: "Hwang In-Beom",  equipo: "local" },
        { min: 80, jugador: "Oh Hyeon-Gyu",   equipo: "local" }
      ],
      amarillas: { local: [], visit: [] },
      rojas: []
    },
    contexto: {
      jornada: 1,
      favoritoLocal: false,
      visitanteVelocistas: false,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: false,
      altaTension: false
    }
  },
  {
    id: 12,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo B",
    local: "Canadá",
    visit: "Bosnia y Herz.",
    time: "12 Jun 15:00 ET · Toronto",
    statsLocal: {
      forma: ["V","V","V","E","V"],
      gfProm: 1.8,
      gcProm: 0.8,
      racha: "Anfitrión en alza",
      posLiga: 40,
      golesUltimos5: [2,2,1,1,2],
      gcUltimos5: [1,0,1,1,0],
      localRecord: { v:6, e:3, d:2 }
    },
    statsVisit: {
      forma: ["G","V","G","V","G"],
      gfProm: 1.3,
      gcProm: 1.4,
      racha: "Irregular",
      posLiga: 62,
      golesUltimos5: [1,2,0,2,0],
      gcUltimos5: [2,1,2,1,2],
      visitRecord: { v:3, e:2, d:6 }
    },
    h2h: {
      local: 2, empate: 0, visit: 0,
      golesLocal:  [2,1],
      golesVisit:  [0,0],
      partidos: [
        { fecha:"2023", res:"2-0", ganador:"local" },
        { fecha:"2022", res:"1-0", ganador:"local" }
      ]
    },
    mercados: [
      { label:"1 Canadá",               odds:1.75, probCasa:0.571, probReal:0.58 },
      { label:"Empate",                 odds:3.50, probCasa:0.286, probReal:0.25 },
      { label:"2 Bosnia y Herz.",       odds:4.80, probCasa:0.208, probReal:0.17 },
      { label:"Más de 2.5 goles",       odds:2.30, probCasa:0.435, probReal:0.40 },
      { label:"Menos de 2.5 goles",     odds:1.62, probCasa:0.617, probReal:0.60 },
      { label:"Canadá no pierde",       odds:1.38, probCasa:0.725, probReal:0.83 }
    ],
    mercadosBetano: [
      { label:"1 Canadá",          odds:1.72, probCasa:0.581, probReal:0.58 },
      { label:"Empate",            odds:3.60, probCasa:0.278, probReal:0.25 },
      { label:"2 Bosnia y Herz.",  odds:4.90, probCasa:0.204, probReal:0.17 }
    ],
    resultado: { status:"FT", scoreLocal:1, scoreVisit:1, goles:[], amarillas:{local:[],visit:[]}, rojas:[] },
    contexto: {
      jornada: 1,
      favoritoLocal: true,
      visitanteVelocistas: false,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: false,
      altaTension: false
    }
  },
  {
    id: 13,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo D",
    local: "Estados Unidos",
    visit: "Paraguay",
    time: "12 Jun 21:00 ET · Inglewood",
    statsLocal: {
      forma: ["V","V","E","V","V"],
      gfProm: 1.9,
      gcProm: 0.8,
      racha: "Anfitrión fuerte",
      posLiga: 12,
      golesUltimos5: [2,2,1,1,2],
      gcUltimos5: [0,1,1,0,1],
      localRecord: { v:8, e:2, d:1 }
    },
    statsVisit: {
      forma: ["G","V","G","V","E"],
      gfProm: 1.4,
      gcProm: 1.2,
      racha: "Irregulares",
      posLiga: 63,
      golesUltimos5: [0,2,1,2,1],
      gcUltimos5: [2,1,2,0,1],
      visitRecord: { v:3, e:3, d:5 }
    },
    h2h: {
      local: 4, empate: 1, visit: 1,
      golesLocal:  [3,2,1,2,1],
      golesVisit:  [0,1,1,0,2],
      partidos: [
        { fecha:"2024", res:"3-0", ganador:"local" },
        { fecha:"2022", res:"2-0", ganador:"local" },
        { fecha:"2019", res:"1-0", ganador:"local" },
        { fecha:"2016", res:"1-1", ganador:"empate" },
        { fecha:"2013", res:"1-2", ganador:"visit" }
      ]
    },
    mercados: [
      { label:"1 Estados Unidos",       odds:1.65, probCasa:0.606, probReal:0.62 },
      { label:"Empate",                 odds:3.70, probCasa:0.270, probReal:0.22 },
      { label:"2 Paraguay",             odds:5.00, probCasa:0.200, probReal:0.16 },
      { label:"Más de 2.5 goles",       odds:2.10, probCasa:0.476, probReal:0.44 },
      { label:"Menos de 2.5 goles",     odds:1.72, probCasa:0.581, probReal:0.56 },
      { label:"EE.UU. gana 1T",         odds:2.40, probCasa:0.417, probReal:0.44 }
    ],
    mercadosBetano: [
      { label:"1 Estados Unidos", odds:1.62, probCasa:0.617, probReal:0.62 },
      { label:"Empate",           odds:3.80, probCasa:0.263, probReal:0.22 },
      { label:"2 Paraguay",       odds:5.20, probCasa:0.192, probReal:0.16 }
    ],
    resultado: { status:"FT", scoreLocal:4, scoreVisit:1, goles:[], amarillas:{local:[],visit:[]}, rojas:[] },
    contexto: {
      jornada: 1,
      favoritoLocal: true,
      visitanteVelocistas: false,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: false,
      altaTension: false
    }
  },
  {
    id: 14,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo C",
    local: "Brasil",
    visit: "Marruecos",
    time: "13 Jun 18:00 ET · East Rutherford",
    statsLocal: {
      forma: ["V","V","V","E","V"],
      gfProm: 2.4,
      gcProm: 0.7,
      racha: "Favorito del torneo",
      posLiga: 3,
      golesUltimos5: [3,2,2,1,3],
      gcUltimos5: [0,1,0,1,1],
      localRecord: { v:10, e:2, d:0 }
    },
    statsVisit: {
      forma: ["V","V","G","V","E"],
      gfProm: 1.5,
      gcProm: 0.9,
      racha: "Semifinalista 2022",
      posLiga: 13,
      golesUltimos5: [2,1,0,2,1],
      gcUltimos5: [1,0,1,1,1],
      visitRecord: { v:5, e:3, d:4 }
    },
    h2h: {
      local: 4, empate: 1, visit: 0,
      golesLocal:  [2,3,2,1,3],
      golesVisit:  [0,0,1,1,0],
      partidos: [
        { fecha:"2022", res:"2-0", ganador:"local" },
        { fecha:"2018", res:"1-0", ganador:"local" },
        { fecha:"2012", res:"3-0", ganador:"local" },
        { fecha:"2009", res:"1-0", ganador:"local" },
        { fecha:"1998", res:"3-0", ganador:"local" }
      ]
    },
    mercados: [
      { label:"1 Brasil",               odds:1.55, probCasa:0.645, probReal:0.65 },
      { label:"Empate",                 odds:4.00, probCasa:0.250, probReal:0.20 },
      { label:"2 Marruecos",            odds:5.50, probCasa:0.182, probReal:0.15 },
      { label:"Más de 2.5 goles",       odds:1.80, probCasa:0.556, probReal:0.58 },
      { label:"Menos de 2.5 goles",     odds:2.00, probCasa:0.500, probReal:0.42 },
      { label:"Brasil gana 1T",         odds:2.20, probCasa:0.455, probReal:0.48 }
    ],
    mercadosBetano: [
      { label:"1 Brasil",    odds:1.52, probCasa:0.658, probReal:0.65 },
      { label:"Empate",      odds:4.20, probCasa:0.238, probReal:0.20 },
      { label:"2 Marruecos", odds:5.70, probCasa:0.175, probReal:0.15 }
    ],
    resultado: {
      status: "LIVE",
      scoreLocal: 1, scoreVisit: 1,
      minuto: "65",
      goles: [
        { min: "?", jugador: "Gol Marruecos", equipo: "visit" },
        { min: "?", jugador: "Gol Brasil",    equipo: "local" }
      ],
      amarillas: { local: [], visit: [] },
      rojas: []
    },
    contexto: {
      jornada: 1,
      favoritoLocal: true,
      visitanteVelocistas: false,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: false,
      altaTension: false
    }
  },
  {
    id: 15,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo E",
    local: "Alemania",
    visit: "Curaçao",
    time: "14 Jun 13:00 ET · Houston",
    statsLocal: {
      forma: ["V","V","V","V","E"],
      gfProm: 2.8,
      gcProm: 0.8,
      racha: "Dominante en Europa",
      posLiga: 4,
      golesUltimos5: [4,3,2,2,3],
      gcUltimos5: [0,1,0,1,1],
      localRecord: { v:9, e:2, d:1 }
    },
    statsVisit: {
      forma: ["G","G","V","G","G"],
      gfProm: 0.8,
      gcProm: 2.1,
      racha: "Debutante mundialista",
      posLiga: 82,
      golesUltimos5: [0,1,2,0,1],
      gcUltimos5: [3,2,1,3,2],
      visitRecord: { v:1, e:1, d:7 }
    },
    h2h: {
      local: 1, empate: 0, visit: 0,
      golesLocal:  [3],
      golesVisit:  [0],
      partidos: [
        { fecha:"2024", res:"3-0", ganador:"local" }
      ]
    },
    mercados: [
      { label:"1 Alemania",             odds:1.12, probCasa:0.893, probReal:0.90 },
      { label:"Empate",                 odds:9.00, probCasa:0.111, probReal:0.07 },
      { label:"2 Curaçao",              odds:25.0, probCasa:0.040, probReal:0.03 },
      { label:"Más de 2.5 goles",       odds:1.25, probCasa:0.800, probReal:0.85 },
      { label:"Menos de 2.5 goles",     odds:4.00, probCasa:0.250, probReal:0.15 },
      { label:"Alemania +3.5 hándicap", odds:1.60, probCasa:0.625, probReal:0.68 }
    ],
    mercadosBetano: [
      { label:"1 Alemania", odds:1.10, probCasa:0.909, probReal:0.90 },
      { label:"Empate",     odds:9.50, probCasa:0.105, probReal:0.07 },
      { label:"2 Curaçao",  odds:26.0, probCasa:0.038, probReal:0.03 }
    ],
    resultado: { status:"FT", scoreLocal:7, scoreVisit:1, goles:[], amarillas:{local:[],visit:[]}, rojas:[] },
    contexto: {
      jornada: 1,
      favoritoLocal: true,
      visitanteVelocistas: false,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: true,
      altaTension: false
    }
  },
  {
    id: 16,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo F",
    local: "Países Bajos",
    visit: "Japón",
    time: "14 Jun 16:00 ET · Arlington",
    statsLocal: {
      forma: ["V","V","E","V","V"],
      gfProm: 2.1,
      gcProm: 0.9,
      racha: "Sólidos en defensa",
      posLiga: 7,
      golesUltimos5: [2,3,1,2,2],
      gcUltimos5: [1,0,1,0,1],
      localRecord: { v:8, e:3, d:1 }
    },
    statsVisit: {
      forma: ["V","V","V","G","V"],
      gfProm: 1.8,
      gcProm: 1.0,
      racha: "Potencia asiática",
      posLiga: 17,
      golesUltimos5: [2,2,2,0,2],
      gcUltimos5: [1,1,0,2,1],
      visitRecord: { v:6, e:2, d:4 }
    },
    h2h: {
      local: 3, empate: 1, visit: 1,
      golesLocal:  [2,1,2,3,1],
      golesVisit:  [0,1,0,2,2],
      partidos: [
        { fecha:"2022", res:"2-1 (WC)", ganador:"local" },
        { fecha:"2019", res:"1-0", ganador:"local" },
        { fecha:"2014", res:"3-2", ganador:"local" },
        { fecha:"2010", res:"1-0", ganador:"local" },
        { fecha:"2000", res:"1-2", ganador:"visit" }
      ]
    },
    mercados: [
      { label:"1 Países Bajos",         odds:1.80, probCasa:0.556, probReal:0.54 },
      { label:"Empate",                 odds:3.50, probCasa:0.286, probReal:0.24 },
      { label:"2 Japón",                odds:4.20, probCasa:0.238, probReal:0.22 },
      { label:"Más de 2.5 goles",       odds:1.90, probCasa:0.526, probReal:0.52 },
      { label:"Menos de 2.5 goles",     odds:1.90, probCasa:0.526, probReal:0.48 },
      { label:"Ambos anotan — Sí",      odds:1.80, probCasa:0.556, probReal:0.56 }
    ],
    mercadosBetano: [
      { label:"1 Países Bajos", odds:1.77, probCasa:0.565, probReal:0.54 },
      { label:"Empate",         odds:3.60, probCasa:0.278, probReal:0.24 },
      { label:"2 Japón",        odds:4.35, probCasa:0.230, probReal:0.22 }
    ],
    resultado: { status:"FT", scoreLocal:2, scoreVisit:2, goles:[], amarillas:{local:[],visit:[]}, rojas:[] },
    contexto: {
      jornada: 1,
      favoritoLocal: false,
      visitanteVelocistas: true,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: false,
      altaTension: false
    }
  },
  {
    id: 17,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo I",
    local: "Francia",
    visit: "Senegal",
    time: "16 Jun 15:00 ET · East Rutherford",
    statsLocal: {
      forma: ["V","V","V","G","V"],
      gfProm: 2.3,
      gcProm: 0.9,
      racha: "Candidato al título",
      posLiga: 2,
      golesUltimos5: [3,2,2,0,3],
      gcUltimos5: [0,1,0,2,1],
      localRecord: { v:8, e:2, d:2 }
    },
    statsVisit: {
      forma: ["V","V","E","V","G"],
      gfProm: 1.5,
      gcProm: 1.1,
      racha: "Cuartos en 2022",
      posLiga: 20,
      golesUltimos5: [2,1,1,2,0],
      gcUltimos5: [1,0,1,1,2],
      visitRecord: { v:4, e:3, d:5 }
    },
    h2h: {
      local: 3, empate: 1, visit: 1,
      golesLocal:  [2,1,3,1,2],
      golesVisit:  [0,1,1,2,1],
      partidos: [
        { fecha:"2023", res:"2-0", ganador:"local" },
        { fecha:"2022", res:"3-1 (WC)", ganador:"local" },
        { fecha:"2010", res:"1-2", ganador:"visit" },
        { fecha:"2002", res:"0-1", ganador:"visit" },
        { fecha:"1994", res:"2-1", ganador:"local" }
      ]
    },
    mercados: [
      { label:"1 Francia",              odds:1.60, probCasa:0.625, probReal:0.62 },
      { label:"Empate",                 odds:3.80, probCasa:0.263, probReal:0.22 },
      { label:"2 Senegal",              odds:5.20, probCasa:0.192, probReal:0.16 },
      { label:"Más de 2.5 goles",       odds:1.90, probCasa:0.526, probReal:0.52 },
      { label:"Menos de 2.5 goles",     odds:1.90, probCasa:0.526, probReal:0.48 },
      { label:"Francia no pierde",      odds:1.30, probCasa:0.769, probReal:0.84 }
    ],
    mercadosBetano: [
      { label:"1 Francia",  odds:1.57, probCasa:0.637, probReal:0.62 },
      { label:"Empate",     odds:3.90, probCasa:0.256, probReal:0.22 },
      { label:"2 Senegal",  odds:5.40, probCasa:0.185, probReal:0.16 }
    ],
    resultado: { status: "PRE" },
    contexto: {
      jornada: 1,
      favoritoLocal: true,
      visitanteVelocistas: false,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: false,
      altaTension: false
    }
  },
  {
    id: 18,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo J",
    local: "Argentina",
    visit: "Argelia",
    time: "16 Jun 21:00 ET · Kansas City",
    statsLocal: {
      forma: ["V","V","V","V","E"],
      gfProm: 2.2,
      gcProm: 0.7,
      racha: "Campeón defensor",
      posLiga: 1,
      golesUltimos5: [2,3,2,1,1],
      gcUltimos5: [0,0,1,0,1],
      localRecord: { v:11, e:2, d:0 }
    },
    statsVisit: {
      forma: ["V","E","V","G","V"],
      gfProm: 1.4,
      gcProm: 1.2,
      racha: "Buen cierre clasificatorio",
      posLiga: 36,
      golesUltimos5: [1,1,2,0,2],
      gcUltimos5: [0,1,1,2,1],
      visitRecord: { v:4, e:2, d:6 }
    },
    h2h: {
      local: 3, empate: 1, visit: 1,
      golesLocal:  [2,1,3,1,2],
      golesVisit:  [0,1,1,2,1],
      partidos: [
        { fecha:"2023", res:"2-0", ganador:"local" },
        { fecha:"2022", res:"1-1", ganador:"empate" },
        { fecha:"2018", res:"3-1", ganador:"local" },
        { fecha:"2010", res:"1-2", ganador:"visit" },
        { fecha:"1994", res:"2-1", ganador:"local" }
      ]
    },
    mercados: [
      { label:"1 Argentina",            odds:1.45, probCasa:0.690, probReal:0.70 },
      { label:"Empate",                 odds:4.20, probCasa:0.238, probReal:0.18 },
      { label:"2 Argelia",              odds:7.00, probCasa:0.143, probReal:0.12 },
      { label:"Más de 2.5 goles",       odds:1.75, probCasa:0.571, probReal:0.60 },
      { label:"Menos de 2.5 goles",     odds:2.05, probCasa:0.488, probReal:0.40 },
      { label:"Argentina gana 1T",      odds:2.00, probCasa:0.500, probReal:0.52 }
    ],
    mercadosBetano: [
      { label:"1 Argentina", odds:1.42, probCasa:0.704, probReal:0.70 },
      { label:"Empate",      odds:4.40, probCasa:0.227, probReal:0.18 },
      { label:"2 Argelia",   odds:7.20, probCasa:0.139, probReal:0.12 }
    ],
    resultado: { status: "PRE" },
    contexto: {
      jornada: 1,
      favoritoLocal: true,
      visitanteVelocistas: false,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: false,
      altaTension: false
    }
  },
  {
    id: 19,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo L",
    local: "Inglaterra",
    visit: "Croacia",
    time: "17 Jun 16:00 ET · Arlington",
    statsLocal: {
      forma: ["V","V","E","V","V"],
      gfProm: 2.0,
      gcProm: 0.7,
      racha: "Revancha del 2018",
      posLiga: 7,
      golesUltimos5: [2,2,1,1,3],
      gcUltimos5: [0,1,1,0,0],
      localRecord: { v:8, e:3, d:1 }
    },
    statsVisit: {
      forma: ["G","V","E","V","G"],
      gfProm: 1.4,
      gcProm: 1.2,
      racha: "Bajando nivel",
      posLiga: 10,
      golesUltimos5: [0,2,1,2,0],
      gcUltimos5: [2,1,1,1,2],
      visitRecord: { v:4, e:2, d:6 }
    },
    h2h: {
      local: 2, empate: 1, visit: 3,
      golesLocal:  [0,2,1,2,1],
      golesVisit:  [2,1,1,0,2],
      partidos: [
        { fecha:"2021", res:"1-0 (EURO)", ganador:"local" },
        { fecha:"2018", res:"1-2 (WC)", ganador:"visit" },
        { fecha:"2008", res:"1-4", ganador:"visit" },
        { fecha:"2007", res:"2-0", ganador:"local" },
        { fecha:"2006", res:"1-2", ganador:"visit" }
      ]
    },
    mercados: [
      { label:"1 Inglaterra",           odds:1.85, probCasa:0.541, probReal:0.55 },
      { label:"Empate",                 odds:3.50, probCasa:0.286, probReal:0.25 },
      { label:"2 Croacia",              odds:4.30, probCasa:0.233, probReal:0.20 },
      { label:"Más de 2.5 goles",       odds:2.10, probCasa:0.476, probReal:0.44 },
      { label:"Menos de 2.5 goles",     odds:1.72, probCasa:0.581, probReal:0.56 },
      { label:"Inglaterra no pierde",   odds:1.42, probCasa:0.704, probReal:0.80 }
    ],
    mercadosBetano: [
      { label:"1 Inglaterra", odds:1.83, probCasa:0.546, probReal:0.55 },
      { label:"Empate",       odds:3.60, probCasa:0.278, probReal:0.25 },
      { label:"2 Croacia",    odds:4.40, probCasa:0.227, probReal:0.20 }
    ],
    resultado: { status: "PRE" },
    contexto: {
      jornada: 1,
      favoritoLocal: true,
      visitanteVelocistas: false,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: false,
      altaTension: true
    }
  },
  {
    id: 20,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo K",
    local: "Portugal",
    visit: "Rep. D. Congo",
    time: "17 Jun 13:00 ET · Houston",
    statsLocal: {
      forma: ["V","V","V","V","G"],
      gfProm: 2.5,
      gcProm: 0.8,
      racha: "Liderado por CR7",
      posLiga: 6,
      golesUltimos5: [3,2,2,2,1],
      gcUltimos5: [0,1,0,0,2],
      localRecord: { v:9, e:2, d:1 }
    },
    statsVisit: {
      forma: ["V","G","V","G","V"],
      gfProm: 1.2,
      gcProm: 1.4,
      racha: "Sorpresa africana",
      posLiga: 51,
      golesUltimos5: [2,0,2,1,2],
      gcUltimos5: [1,2,1,2,1],
      visitRecord: { v:3, e:2, d:6 }
    },
    h2h: {
      local: 2, empate: 0, visit: 0,
      golesLocal:  [4,2],
      golesVisit:  [0,1],
      partidos: [
        { fecha:"2022", res:"4-0", ganador:"local" },
        { fecha:"2023", res:"2-1", ganador:"local" }
      ]
    },
    mercados: [
      { label:"1 Portugal",             odds:1.40, probCasa:0.714, probReal:0.72 },
      { label:"Empate",                 odds:4.50, probCasa:0.222, probReal:0.17 },
      { label:"2 Rep. D. Congo",        odds:8.00, probCasa:0.125, probReal:0.11 },
      { label:"Más de 2.5 goles",       odds:1.65, probCasa:0.606, probReal:0.65 },
      { label:"Menos de 2.5 goles",     odds:2.20, probCasa:0.455, probReal:0.35 },
      { label:"Portugal gana 1T",       odds:1.95, probCasa:0.513, probReal:0.55 }
    ],
    mercadosBetano: [
      { label:"1 Portugal",       odds:1.37, probCasa:0.730, probReal:0.72 },
      { label:"Empate",           odds:4.70, probCasa:0.213, probReal:0.17 },
      { label:"2 Rep. D. Congo",  odds:8.50, probCasa:0.118, probReal:0.11 }
    ],
    resultado: { status: "PRE" },
    contexto: {
      jornada: 1,
      favoritoLocal: true,
      visitanteVelocistas: false,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: false,
      altaTension: false
    }
  },
  {
    id: 21,
    comp: "Mundial 2026",
    compKey: "mundial",
    fase: "Fase de Grupos — Grupo G",
    local: "Escocia",
    visit: "Haití",
    time: "13 Jun · En curso",
    statsLocal: {
      forma: ["V","E","V","V","E"],
      gfProm: 1.5,
      gcProm: 1.0,
      racha: "Primer Mundial desde 1998",
      posLiga: 39,
      golesUltimos5: [2,1,1,2,1],
      gcUltimos5: [1,1,0,1,2],
      localRecord: { v:5, e:3, d:3 }
    },
    statsVisit: {
      forma: ["G","V","G","G","V"],
      gfProm: 0.8,
      gcProm: 1.6,
      racha: "Debut mundialista histórico",
      posLiga: 83,
      golesUltimos5: [0,1,0,1,2],
      gcUltimos5: [2,1,2,2,1],
      visitRecord: { v:1, e:2, d:7 }
    },
    h2h: {
      local: 2, empate: 0, visit: 0,
      golesLocal:  [3,2],
      golesVisit:  [0,1],
      partidos: [
        { fecha:"2019", res:"3-0", ganador:"local" },
        { fecha:"2015", res:"2-1", ganador:"local" }
      ]
    },
    mercados: [
      { label:"1 Escocia",              odds:1.75, probCasa:0.571, probReal:0.58 },
      { label:"Empate",                 odds:3.60, probCasa:0.278, probReal:0.24 },
      { label:"2 Haití",                odds:4.80, probCasa:0.208, probReal:0.18 },
      { label:"Más de 2.5 goles",       odds:2.20, probCasa:0.455, probReal:0.42 },
      { label:"Menos de 2.5 goles",     odds:1.65, probCasa:0.606, probReal:0.58 },
      { label:"Escocia no pierde",      odds:1.38, probCasa:0.725, probReal:0.82 }
    ],
    mercadosBetano: [
      { label:"1 Escocia", odds:1.72, probCasa:0.581, probReal:0.58 },
      { label:"Empate",    odds:3.70, probCasa:0.270, probReal:0.24 },
      { label:"2 Haití",   odds:4.90, probCasa:0.204, probReal:0.18 }
    ],
    resultado: { status:"FT", scoreLocal:1, scoreVisit:0, goles:[], amarillas:{local:[],visit:[]}, rojas:[] },
    contexto: {
      jornada: 1,
      favoritoLocal: true,
      visitanteVelocistas: false,
      clasificatorioLocal: null,
      clasificatorioVisit: null,
      diasDescansoLocal: null,
      diasDescansoVisit: null,
      suspensiones: [],
      arbitro: null,
      debut: true,
      altaTension: false
    }
  },

  // ── HOY 15 JUN ────────────────────────────────────────────────────────────
  {
    id: 22,
    comp: "Mundial 2026", compKey: "mundial",
    fase: "Fase de Grupos — Grupo H",
    local: "España", visit: "Cabo Verde",
    time: "15 Jun · 15:00 ET",
    statsLocal: {
      forma: ["V","V","V","E","V"], gfProm: 2.2, gcProm: 0.6,
      racha: "Campeón de Europa 2024", posLiga: 8,
      golesUltimos5: [3,2,1,2,3], gcUltimos5: [0,1,0,1,0],
      localRecord: { v:9, e:2, d:1 }
    },
    statsVisit: {
      forma: ["V","G","E","V","G"], gfProm: 0.9, gcProm: 1.4,
      racha: "Sorpresa africana", posLiga: 75,
      golesUltimos5: [1,0,1,2,0], gcUltimos5: [1,2,1,1,2],
      visitRecord: { v:2, e:2, d:6 }
    },
    h2h: { local: 2, empate: 0, visit: 0, golesLocal: [3,4], golesVisit: [0,1], partidos: [
      { fecha:"2023", res:"3-0", ganador:"local" }, { fecha:"2021", res:"4-1", ganador:"local" }
    ]},
    mercados: [
      { label:"1 España",            odds:1.22, probCasa:0.820, probReal:0.78 },
      { label:"Empate",              odds:6.50, probCasa:0.154, probReal:0.14 },
      { label:"2 Cabo Verde",        odds:13.0, probCasa:0.077, probReal:0.08 },
      { label:"Más de 2.5 goles",    odds:1.45, probCasa:0.690, probReal:0.72 },
      { label:"Menos de 2.5 goles",  odds:2.80, probCasa:0.357, probReal:0.28 },
      { label:"España gana 1T",      odds:1.65, probCasa:0.606, probReal:0.62 }
    ],
    mercadosBetano: [
      { label:"1 España",     odds:1.20, probCasa:0.833, probReal:0.78 },
      { label:"Empate",       odds:6.80, probCasa:0.147, probReal:0.14 },
      { label:"2 Cabo Verde", odds:13.5, probCasa:0.074, probReal:0.08 }
    ],
    resultado: { status: "PRE" },
    contexto: { jornada:1, favoritoLocal:true, visitanteVelocistas:false, clasificatorioLocal:null, clasificatorioVisit:null, diasDescansoLocal:null, diasDescansoVisit:null, suspensiones:[], arbitro:null, debut:false, altaTension:false }
  },
  {
    id: 23,
    comp: "Mundial 2026", compKey: "mundial",
    fase: "Fase de Grupos — Grupo I",
    local: "Bélgica", visit: "Egipto",
    time: "15 Jun · 18:00 ET",
    statsLocal: {
      forma: ["V","V","V","V","E"], gfProm: 2.0, gcProm: 0.8,
      racha: "Generación dorada en declive pero sólida", posLiga: 3,
      golesUltimos5: [2,3,1,2,1], gcUltimos5: [0,1,1,0,1],
      localRecord: { v:8, e:3, d:1 }
    },
    statsVisit: {
      forma: ["V","E","V","G","V"], gfProm: 1.5, gcProm: 1.0,
      racha: "Con Salah en plenitud", posLiga: 35,
      golesUltimos5: [2,1,1,0,2], gcUltimos5: [1,1,0,2,1],
      visitRecord: { v:4, e:3, d:5 }
    },
    h2h: { local: 3, empate: 1, visit: 1, golesLocal: [2,1,3,1,2], golesVisit: [0,1,1,2,1], partidos: [
      { fecha:"2022", res:"2-0", ganador:"local" }, { fecha:"2018", res:"3-1", ganador:"local" },
      { fecha:"2014", res:"2-1", ganador:"local" }, { fecha:"2010", res:"1-2", ganador:"visit" }
    ]},
    mercados: [
      { label:"1 Bélgica",           odds:1.70, probCasa:0.588, probReal:0.58 },
      { label:"Empate",              odds:3.60, probCasa:0.278, probReal:0.25 },
      { label:"2 Egipto",            odds:4.80, probCasa:0.208, probReal:0.17 },
      { label:"Más de 2.5 goles",    odds:1.95, probCasa:0.513, probReal:0.50 },
      { label:"Menos de 2.5 goles",  odds:1.85, probCasa:0.541, probReal:0.50 },
      { label:"Ambos anotan — Sí",   odds:1.85, probCasa:0.541, probReal:0.52 }
    ],
    mercadosBetano: [
      { label:"1 Bélgica", odds:1.67, probCasa:0.599, probReal:0.58 },
      { label:"Empate",    odds:3.70, probCasa:0.270, probReal:0.25 },
      { label:"2 Egipto",  odds:4.95, probCasa:0.202, probReal:0.17 }
    ],
    resultado: { status: "PRE" },
    contexto: { jornada:1, favoritoLocal:true, visitanteVelocistas:false, clasificatorioLocal:null, clasificatorioVisit:null, diasDescansoLocal:null, diasDescansoVisit:null, suspensiones:[], arbitro:null, debut:false, altaTension:false }
  },
  {
    id: 24,
    comp: "Mundial 2026", compKey: "mundial",
    fase: "Fase de Grupos — Grupo J",
    local: "Arabia Saudí", visit: "Uruguay",
    time: "15 Jun · 21:00 ET",
    statsLocal: {
      forma: ["V","E","G","V","E"], gfProm: 1.3, gcProm: 1.2,
      racha: "Campeón asiático 2023", posLiga: 55,
      golesUltimos5: [1,1,2,0,1], gcUltimos5: [0,1,2,1,1],
      localRecord: { v:5, e:3, d:4 }
    },
    statsVisit: {
      forma: ["V","V","E","V","G"], gfProm: 1.7, gcProm: 0.9,
      racha: "Experiencia mundialista", posLiga: 14,
      golesUltimos5: [2,1,1,2,0], gcUltimos5: [1,0,1,1,2],
      visitRecord: { v:5, e:3, d:4 }
    },
    h2h: { local: 0, empate: 1, visit: 2, golesLocal: [0,1,2], golesVisit: [1,2,2], partidos: [
      { fecha:"2022", res:"2-1", ganador:"local" }, { fecha:"2018", res:"0-0", ganador:"empate" },
      { fecha:"2010", res:"2-0", ganador:"visit" }
    ]},
    mercados: [
      { label:"1 Arabia Saudí",      odds:3.50, probCasa:0.286, probReal:0.26 },
      { label:"Empate",              odds:3.20, probCasa:0.313, probReal:0.28 },
      { label:"2 Uruguay",           odds:2.10, probCasa:0.476, probReal:0.46 },
      { label:"Más de 2.5 goles",    odds:2.30, probCasa:0.435, probReal:0.42 },
      { label:"Menos de 2.5 goles",  odds:1.60, probCasa:0.625, probReal:0.58 },
      { label:"Uruguay no pierde",   odds:1.55, probCasa:0.645, probReal:0.74 }
    ],
    mercadosBetano: [
      { label:"1 Arabia Saudí", odds:3.60, probCasa:0.278, probReal:0.26 },
      { label:"Empate",         odds:3.30, probCasa:0.303, probReal:0.28 },
      { label:"2 Uruguay",      odds:2.05, probCasa:0.488, probReal:0.46 }
    ],
    resultado: { status: "PRE" },
    contexto: { jornada:1, favoritoLocal:false, visitanteVelocistas:false, clasificatorioLocal:null, clasificatorioVisit:null, diasDescansoLocal:null, diasDescansoVisit:null, suspensiones:[], arbitro:null, debut:false, altaTension:false }
  },
  {
    id: 25,
    comp: "Mundial 2026", compKey: "mundial",
    fase: "Fase de Grupos — Grupo K",
    local: "Irán", visit: "Nueva Zelanda",
    time: "15 Jun · 21:00 ET",
    statsLocal: {
      forma: ["V","E","V","E","V"], gfProm: 1.4, gcProm: 1.0,
      racha: "Potencia asiática consolidada", posLiga: 25,
      golesUltimos5: [1,1,2,1,2], gcUltimos5: [0,1,1,2,0],
      localRecord: { v:6, e:3, d:2 }
    },
    statsVisit: {
      forma: ["G","V","G","G","E"], gfProm: 0.7, gcProm: 1.5,
      racha: "Debutante con ilusión", posLiga: 95,
      golesUltimos5: [0,1,0,1,1], gcUltimos5: [2,1,2,2,1],
      visitRecord: { v:1, e:2, d:7 }
    },
    h2h: { local: 1, empate: 0, visit: 0, golesLocal: [2], golesVisit: [0], partidos: [
      { fecha:"2019", res:"2-0", ganador:"local" }
    ]},
    mercados: [
      { label:"1 Irán",              odds:1.80, probCasa:0.556, probReal:0.56 },
      { label:"Empate",              odds:3.50, probCasa:0.286, probReal:0.26 },
      { label:"2 Nueva Zelanda",     odds:4.50, probCasa:0.222, probReal:0.18 },
      { label:"Más de 2.5 goles",    odds:2.40, probCasa:0.417, probReal:0.38 },
      { label:"Menos de 2.5 goles",  odds:1.55, probCasa:0.645, probReal:0.62 },
      { label:"Irán no pierde",      odds:1.40, probCasa:0.714, probReal:0.82 }
    ],
    mercadosBetano: [
      { label:"1 Irán",          odds:1.77, probCasa:0.565, probReal:0.56 },
      { label:"Empate",          odds:3.60, probCasa:0.278, probReal:0.26 },
      { label:"2 Nueva Zelanda", odds:4.60, probCasa:0.217, probReal:0.18 }
    ],
    resultado: { status: "PRE" },
    contexto: { jornada:1, favoritoLocal:true, visitanteVelocistas:false, clasificatorioLocal:null, clasificatorioVisit:null, diasDescansoLocal:null, diasDescansoVisit:null, suspensiones:[], arbitro:null, debut:true, altaTension:false }
  },

  // ── MAÑANA 14 JUN ─────────────────────────────────────────────────────────
  {
    id: 26,
    comp: "Mundial 2026", compKey: "mundial",
    fase: "Fase de Grupos — Grupo C",
    local: "Irak", visit: "Noruega",
    time: "16 Jun · 18:00 ET",
    statsLocal: {
      forma: ["V","G","E","V","G"], gfProm: 1.2, gcProm: 1.3,
      racha: "Sorpresa de Asia", posLiga: 65,
      golesUltimos5: [1,0,2,2,0], gcUltimos5: [1,2,1,1,2],
      visitRecord: { v:3, e:2, d:6 }
    },
    statsVisit: {
      forma: ["V","V","V","E","V"], gfProm: 2.1, gcProm: 0.9,
      racha: "Haaland lidera el ataque", posLiga: 20,
      golesUltimos5: [3,2,2,1,3], gcUltimos5: [1,0,1,1,0],
      visitRecord: { v:6, e:2, d:3 }
    },
    h2h: { local: 0, empate: 0, visit: 1, golesLocal: [0], golesVisit: [2], partidos: [
      { fecha:"2020", res:"0-2", ganador:"visit" }
    ]},
    mercados: [
      { label:"1 Irak",              odds:5.50, probCasa:0.182, probReal:0.14 },
      { label:"Empate",              odds:4.00, probCasa:0.250, probReal:0.22 },
      { label:"2 Noruega",           odds:1.60, probCasa:0.625, probReal:0.64 },
      { label:"Más de 2.5 goles",    odds:1.75, probCasa:0.571, probReal:0.58 },
      { label:"Menos de 2.5 goles",  odds:2.05, probCasa:0.488, probReal:0.42 },
      { label:"Noruega no pierde",   odds:1.32, probCasa:0.758, probReal:0.86 }
    ],
    mercadosBetano: [
      { label:"1 Irak",    odds:5.70, probCasa:0.175, probReal:0.14 },
      { label:"Empate",    odds:4.10, probCasa:0.244, probReal:0.22 },
      { label:"2 Noruega", odds:1.57, probCasa:0.637, probReal:0.64 }
    ],
    resultado: { status: "PRE" },
    contexto: { jornada:1, favoritoLocal:false, visitanteVelocistas:false, clasificatorioLocal:null, clasificatorioVisit:null, diasDescansoLocal:null, diasDescansoVisit:null, suspensiones:[], arbitro:null, debut:true, altaTension:false }
  },

  // ── VIE 13 JUN (completados) ───────────────────────────────────────────────
  {
    id: 27,
    comp: "Mundial 2026", compKey: "mundial",
    fase: "Fase de Grupos — Grupo A",
    local: "Qatar", visit: "Suiza",
    time: "13 Jun · 12:00 ET",
    statsLocal: {
      forma: ["G","E","G","E","G"], gfProm: 0.9, gcProm: 1.4,
      racha: "Anfitrión 2022", posLiga: 58,
      golesUltimos5: [0,1,1,2,0], gcUltimos5: [2,1,3,1,2],
      localRecord: { v:3, e:2, d:6 }
    },
    statsVisit: {
      forma: ["V","E","V","V","E"], gfProm: 1.8, gcProm: 0.8,
      racha: "Sólida defensivamente", posLiga: 15,
      golesUltimos5: [2,1,3,1,2], gcUltimos5: [0,1,0,1,0],
      visitRecord: { v:7, e:3, d:2 }
    },
    h2h: { local: 0, empate: 1, visit: 2, golesLocal: [0,1,0], golesVisit: [1,2,3], partidos: [
      { fecha:"2022", res:"0-3", ganador:"visit" }
    ]},
    mercados: [
      { label:"1 Qatar",   odds:5.00, probCasa:0.200, probReal:0.14 },
      { label:"Empate",    odds:3.80, probCasa:0.263, probReal:0.24 },
      { label:"2 Suiza",   odds:1.65, probCasa:0.606, probReal:0.62 }
    ],
    mercadosBetano: [
      { label:"1 Qatar",   odds:5.20, probCasa:0.192, probReal:0.14 },
      { label:"Empate",    odds:3.90, probCasa:0.256, probReal:0.24 },
      { label:"2 Suiza",   odds:1.62, probCasa:0.617, probReal:0.62 }
    ],
    resultado: { status: "FT", golesLocal: 1, golesVisit: 1 },
    contexto: { jornada:1, favoritoLocal:false, visitanteVelocistas:false, clasificatorioLocal:null, clasificatorioVisit:null, diasDescansoLocal:null, diasDescansoVisit:null, suspensiones:[], arbitro:null, debut:true, altaTension:false }
  },

  // ── SÁB 14 JUN (completados) ───────────────────────────────────────────────
  {
    id: 28,
    comp: "Mundial 2026", compKey: "mundial",
    fase: "Fase de Grupos — Grupo F",
    local: "Australia", visit: "Turquía",
    time: "14 Jun · 12:00 ET",
    statsLocal: {
      forma: ["V","V","E","V","G"], gfProm: 1.6, gcProm: 1.1,
      racha: "Socceroos en alza", posLiga: 24,
      golesUltimos5: [2,1,2,3,1], gcUltimos5: [1,0,1,2,1],
      localRecord: { v:5, e:3, d:3 }
    },
    statsVisit: {
      forma: ["V","E","G","V","V"], gfProm: 1.8, gcProm: 1.2,
      racha: "Clasificado directo", posLiga: 40,
      golesUltimos5: [2,1,0,2,3], gcUltimos5: [1,2,1,0,1],
      visitRecord: { v:4, e:3, d:4 }
    },
    h2h: { local: 2, empate: 1, visit: 1, golesLocal: [1,2,0,2], golesVisit: [0,1,2,1], partidos: [
      { fecha:"2010", res:"1-1", ganador:"empate" }
    ]},
    mercados: [
      { label:"1 Australia", odds:2.40, probCasa:0.417, probReal:0.42 },
      { label:"Empate",      odds:3.20, probCasa:0.313, probReal:0.28 },
      { label:"2 Turquía",   odds:2.80, probCasa:0.357, probReal:0.30 }
    ],
    mercadosBetano: [
      { label:"1 Australia", odds:2.45, probCasa:0.408, probReal:0.42 },
      { label:"Empate",      odds:3.25, probCasa:0.308, probReal:0.28 },
      { label:"2 Turquía",   odds:2.75, probCasa:0.364, probReal:0.30 }
    ],
    resultado: { status: "FT", golesLocal: 2, golesVisit: 0 },
    contexto: { jornada:1, favoritoLocal:true, visitanteVelocistas:false, clasificatorioLocal:null, clasificatorioVisit:null, diasDescansoLocal:null, diasDescansoVisit:null, suspensiones:[], arbitro:null, debut:true, altaTension:false }
  },
  {
    id: 29,
    comp: "Mundial 2026", compKey: "mundial",
    fase: "Fase de Grupos — Grupo G",
    local: "Costa de Marfil", visit: "Ecuador",
    time: "14 Jun · 15:00 ET",
    statsLocal: {
      forma: ["V","V","E","G","V"], gfProm: 1.7, gcProm: 1.1,
      racha: "Los Elefantes de vuelta al Mundial", posLiga: 52,
      golesUltimos5: [2,1,2,0,3], gcUltimos5: [1,0,2,2,1],
      localRecord: { v:5, e:2, d:4 }
    },
    statsVisit: {
      forma: ["E","V","G","V","E"], gfProm: 1.4, gcProm: 1.3,
      racha: "Regular en clasificatorias", posLiga: 44,
      golesUltimos5: [1,2,0,1,2], gcUltimos5: [1,1,2,0,1],
      visitRecord: { v:3, e:4, d:4 }
    },
    h2h: { local: 1, empate: 1, visit: 0, golesLocal: [2,1], golesVisit: [1,1], partidos: [
      { fecha:"2018", res:"2-1", ganador:"local" }
    ]},
    mercados: [
      { label:"1 Costa de Marfil", odds:2.50, probCasa:0.400, probReal:0.38 },
      { label:"Empate",            odds:3.00, probCasa:0.333, probReal:0.30 },
      { label:"2 Ecuador",         odds:2.70, probCasa:0.370, probReal:0.32 }
    ],
    mercadosBetano: [
      { label:"1 Costa de Marfil", odds:2.55, probCasa:0.392, probReal:0.38 },
      { label:"Empate",            odds:3.05, probCasa:0.328, probReal:0.30 },
      { label:"2 Ecuador",         odds:2.65, probCasa:0.377, probReal:0.32 }
    ],
    resultado: { status: "FT", golesLocal: 1, golesVisit: 0 },
    contexto: { jornada:1, favoritoLocal:true, visitanteVelocistas:false, clasificatorioLocal:null, clasificatorioVisit:null, diasDescansoLocal:null, diasDescansoVisit:null, suspensiones:[], arbitro:null, debut:true, altaTension:false }
  },
  {
    id: 30,
    comp: "Mundial 2026", compKey: "mundial",
    fase: "Fase de Grupos — Grupo H",
    local: "Suecia", visit: "Túnez",
    time: "14 Jun · 18:00 ET",
    statsLocal: {
      forma: ["V","V","V","E","V"], gfProm: 2.4, gcProm: 0.8,
      racha: "Ofensiva letal", posLiga: 18,
      golesUltimos5: [3,2,4,1,3], gcUltimos5: [0,1,0,1,0],
      localRecord: { v:8, e:2, d:1 }
    },
    statsVisit: {
      forma: ["G","E","G","V","G"], gfProm: 1.1, gcProm: 1.5,
      racha: "Debilitados en defensa", posLiga: 30,
      golesUltimos5: [1,1,0,2,1], gcUltimos5: [2,1,3,1,2],
      visitRecord: { v:2, e:3, d:6 }
    },
    h2h: { local: 2, empate: 1, visit: 0, golesLocal: [2,3,1], golesVisit: [0,1,0], partidos: [
      { fecha:"2002", res:"2-0", ganador:"local" }
    ]},
    mercados: [
      { label:"1 Suecia",  odds:1.45, probCasa:0.690, probReal:0.72 },
      { label:"Empate",    odds:4.00, probCasa:0.250, probReal:0.18 },
      { label:"2 Túnez",   odds:6.50, probCasa:0.154, probReal:0.10 }
    ],
    mercadosBetano: [
      { label:"1 Suecia",  odds:1.42, probCasa:0.704, probReal:0.72 },
      { label:"Empate",    odds:4.10, probCasa:0.244, probReal:0.18 },
      { label:"2 Túnez",   odds:6.80, probCasa:0.147, probReal:0.10 }
    ],
    resultado: { status: "FT", golesLocal: 5, golesVisit: 1 },
    contexto: { jornada:1, favoritoLocal:true, visitanteVelocistas:false, clasificatorioLocal:null, clasificatorioVisit:null, diasDescansoLocal:null, diasDescansoVisit:null, suspensiones:[], arbitro:null, debut:true, altaTension:false }
  }
];

/*  — partidos no-Mundial eliminados — */
const _x = [  {
    id: 1,
    comp: "Copa Libertadores",
    compKey: "lib",
    fase: "Cuartos de Final",
    local: "Flamengo",
    visit: "River Plate",
    time: "Hoy 21:00",
    statsLocal: {
      forma: ["V","G","V","G","V"],
      gfProm: 2.1,
      gcProm: 0.9,
      racha: "3V seguidas",
      posLiga: 1,
      golesUltimos5: [2,1,3,0,2],
      gcUltimos5: [1,0,0,1,1],
      localRecord: { v:8, e:2, d:1 }
    },
    statsVisit: {
      forma: ["V","V","G","V","V"],
      gfProm: 1.8,
      gcProm: 0.8,
      racha: "4V en 5",
      posLiga: 2,
      golesUltimos5: [2,3,1,2,1],
      gcUltimos5: [1,0,2,0,1],
      visitRecord: { v:5, e:3, d:3 }
    },
    h2h: {
      local: 2, empate: 1, visit: 2,
      golesLocal:  [2,1,3,0,1],
      golesVisit:  [1,2,1,3,0],
      partidos: [
        { fecha:"2023", res:"2-1", ganador:"local" },
        { fecha:"2022", res:"1-2", ganador:"visit" },
        { fecha:"2022", res:"3-1", ganador:"local" },
        { fecha:"2021", res:"0-3", ganador:"visit" },
        { fecha:"2021", res:"1-0", ganador:"empate" }
      ]
    },
    mercados: [
      { label:"1 Flamengo",            odds:2.15, probCasa:0.465, probReal:0.43 },
      { label:"Empate",                odds:3.40, probCasa:0.294, probReal:0.27 },
      { label:"2 River Plate",         odds:3.20, probCasa:0.313, probReal:0.30 },
      { label:"Más de 2.5 goles",      odds:1.75, probCasa:0.571, probReal:0.63 },
      { label:"Menos de 2.5 goles",    odds:2.05, probCasa:0.488, probReal:0.37 },
      { label:"Ambos anotan — Sí",     odds:1.65, probCasa:0.606, probReal:0.66 }
    ]
  },
  {
    id: 2,
    comp: "Copa Libertadores",
    compKey: "lib",
    fase: "Cuartos de Final",
    local: "Boca Juniors",
    visit: "Palmeiras",
    time: "Hoy 23:30",
    statsLocal: {
      forma: ["V","G","V","V","G"],
      gfProm: 1.4,
      gcProm: 1.1,
      racha: "Irregular en casa",
      posLiga: 4,
      golesUltimos5: [1,0,2,2,1],
      gcUltimos5: [2,1,0,1,2],
      localRecord: { v:5, e:3, d:3 }
    },
    statsVisit: {
      forma: ["V","V","V","V","V"],
      gfProm: 2.3,
      gcProm: 0.6,
      racha: "5 victorias seguidas",
      posLiga: 1,
      golesUltimos5: [2,3,2,1,3],
      gcUltimos5: [0,1,0,1,0],
      visitRecord: { v:7, e:2, d:2 }
    },
    h2h: {
      local: 1, empate: 2, visit: 2,
      golesLocal:  [1,0,2,1,0],
      golesVisit:  [2,1,1,2,3],
      partidos: [
        { fecha:"2023", res:"1-2", ganador:"visit" },
        { fecha:"2022", res:"0-1", ganador:"visit" },
        { fecha:"2022", res:"2-1", ganador:"local" },
        { fecha:"2021", res:"1-1", ganador:"empate" },
        { fecha:"2021", res:"0-1", ganador:"empate" }
      ]
    },
    mercados: [
      { label:"1 Boca Juniors",          odds:2.80, probCasa:0.357, probReal:0.27 },
      { label:"Empate",                  odds:3.10, probCasa:0.323, probReal:0.31 },
      { label:"2 Palmeiras",             odds:2.40, probCasa:0.417, probReal:0.42 },
      { label:"Más de 2.5 goles",        odds:2.20, probCasa:0.455, probReal:0.40 },
      { label:"Menos de 2.5 goles",      odds:1.65, probCasa:0.606, probReal:0.60 },
      { label:"Palmeiras no pierde",     odds:1.52, probCasa:0.658, probReal:0.73 }
    ]
  },
  {
    id: 3,
    comp: "Copa Sudamericana",
    compKey: "sud",
    fase: "Semifinal",
    local: "LDU Quito",
    visit: "Nacional Montevideo",
    time: "Mañana 20:00",
    statsLocal: {
      forma: ["V","G","V","V","V"],
      gfProm: 1.9,
      gcProm: 0.7,
      racha: "Muy fuerte en casa",
      posLiga: 2,
      golesUltimos5: [2,1,3,1,2],
      gcUltimos5: [0,1,0,1,0],
      localRecord: { v:9, e:1, d:1 }
    },
    statsVisit: {
      forma: ["G","V","G","V","G"],
      gfProm: 1.2,
      gcProm: 1.3,
      racha: "Alternado",
      posLiga: 5,
      golesUltimos5: [0,2,1,2,0],
      gcUltimos5: [2,1,2,0,2],
      visitRecord: { v:3, e:2, d:6 }
    },
    h2h: {
      local: 3, empate: 1, visit: 1,
      golesLocal:  [2,1,3,1,2],
      golesVisit:  [0,1,1,2,1],
      partidos: [
        { fecha:"2023", res:"2-0", ganador:"local" },
        { fecha:"2022", res:"1-1", ganador:"empate" },
        { fecha:"2022", res:"3-1", ganador:"local" },
        { fecha:"2021", res:"1-2", ganador:"visit" },
        { fecha:"2021", res:"2-1", ganador:"local" }
      ]
    },
    mercados: [
      { label:"1 LDU Quito",           odds:1.90, probCasa:0.526, probReal:0.58 },
      { label:"Empate",                odds:3.50, probCasa:0.286, probReal:0.24 },
      { label:"2 Nacional",            odds:4.10, probCasa:0.244, probReal:0.18 },
      { label:"Más de 2.5 goles",      odds:2.00, probCasa:0.500, probReal:0.47 },
      { label:"Menos de 2.5 goles",    odds:1.80, probCasa:0.556, probReal:0.53 },
      { label:"LDU no pierde",         odds:1.45, probCasa:0.690, probReal:0.82 }
    ]
  },
  {
    id: 4,
    comp: "Liga Chilena",
    compKey: "liga",
    fase: "Fecha 20",
    local: "Colo-Colo",
    visit: "U. de Chile",
    time: "Dom 18:00",
    statsLocal: {
      forma: ["V","V","G","V","V"],
      gfProm: 2.0,
      gcProm: 0.8,
      racha: "Líder del torneo",
      posLiga: 1,
      golesUltimos5: [2,3,1,2,2],
      gcUltimos5: [0,1,1,0,1],
      localRecord: { v:10, e:2, d:1 }
    },
    statsVisit: {
      forma: ["G","V","G","G","G"],
      gfProm: 1.1,
      gcProm: 1.6,
      racha: "Mal momento",
      posLiga: 7,
      golesUltimos5: [0,2,1,0,1],
      gcUltimos5: [2,1,2,3,1],
      visitRecord: { v:2, e:3, d:7 }
    },
    h2h: {
      local: 3, empate: 1, visit: 1,
      golesLocal:  [2,3,1,2,1],
      golesVisit:  [0,1,2,0,1],
      partidos: [
        { fecha:"2024", res:"2-0", ganador:"local" },
        { fecha:"2023", res:"3-1", ganador:"local" },
        { fecha:"2023", res:"1-2", ganador:"visit" },
        { fecha:"2022", res:"2-0", ganador:"local" },
        { fecha:"2022", res:"1-1", ganador:"empate" }
      ]
    },
    mercados: [
      { label:"1 Colo-Colo",           odds:1.70, probCasa:0.588, probReal:0.65 },
      { label:"Empate",                odds:3.60, probCasa:0.278, probReal:0.22 },
      { label:"2 U. de Chile",         odds:4.80, probCasa:0.208, probReal:0.13 },
      { label:"Más de 2.5 goles",      odds:1.85, probCasa:0.541, probReal:0.53 },
      { label:"Menos de 2.5 goles",    odds:1.90, probCasa:0.526, probReal:0.47 },
      { label:"Colo-Colo gana 1T",     odds:2.20, probCasa:0.455, probReal:0.50 }
    ]
  },
  {
    id: 5,
    comp: "Copa Libertadores",
    compKey: "lib",
    fase: "Cuartos de Final",
    local: "Atlético Mineiro",
    visit: "Racing Club",
    time: "Mié 21:30",
    statsLocal: {
      forma: ["V","V","V","G","V"],
      gfProm: 2.2,
      gcProm: 0.7,
      racha: "Dominante en casa",
      posLiga: 2,
      golesUltimos5: [3,2,1,1,3],
      gcUltimos5: [0,0,1,2,0],
      localRecord: { v:9, e:2, d:0 }
    },
    statsVisit: {
      forma: ["V","G","V","G","V"],
      gfProm: 1.6,
      gcProm: 1.2,
      racha: "Alternado fuera",
      posLiga: 3,
      golesUltimos5: [2,1,2,0,2],
      gcUltimos5: [1,2,0,1,2],
      visitRecord: { v:4, e:2, d:5 }
    },
    h2h: {}
  }
]; // _x no se exporta

module.exports = MATCHES;
