# Coolbet Analyzer — Analizador de Combinaciones

App web local estilo Coolbet para analizar probabilidades reales, valor esperado (VE) y armar combinaciones de apuestas con criterio estadístico.

## Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor
npm start

# 3. Abrir en el navegador
http://localhost:3000
```

## Funcionalidades

### Vista principal
- **Partidos** con cuotas reales de Coolbet (Copa Libertadores, Sudamericana, Liga Chilena)
- **Forma reciente** de cada equipo (últimos 5 partidos: V/E/D)
- **Estadísticas** de goles a favor/en contra por partido y posición en liga
- **Cuota + VE** para cada mercado: badge verde (VE+) o rojo (VE-) con porcentaje exacto
- **Barra de probabilidad real** vs. probabilidad implícita de la cuota

### Ticket de combinación (columna derecha)
- Selecciona 1 cuota por partido (igual que Coolbet real)
- Calcula automáticamente:
  - Cuota total combinada
  - Probabilidad real combinada (producto de prob. individuales)
  - **Valor Esperado total** del ticket
  - Retorno estimado en CLP para el stake ingresado
- Veredicto: EXCELENTE / BUENA / MARGINAL / RIESGO / EVITAR
- Alertas de selecciones individuales con VE negativo

### Modal de análisis
- **H2H histórico** (últimos 5 partidos con barra visual)
- **Estadísticas de temporada** (récord local/visita, promedios de goles, racha)
- **Análisis de mercados**: prob. casa vs. prob. real vs. VE para cada mercado
- **Simulación de retorno** en tres stakes distintos

## Cómo se calcula el VE

```
VE = (Probabilidad_real × Cuota) - 1
```

- **VE > 0**: La cuota paga más de lo que el evento vale estadísticamente → Apostar
- **VE < 0**: La casa tiene ventaja → Evitar o ponderar muy bien
- **VE > +5%**: Excelente oportunidad

## Agregar partidos

Editar `data/matches.js` y agregar un objeto con la misma estructura de los existentes.
Los campos clave son `mercados[].probReal` (probabilidad estimada basada en estadísticas).

## Stack técnico
- **Backend**: Node.js + Express
- **Frontend**: HTML/CSS/JS vanilla (sin dependencias externas)
- **Puerto**: 3000 (configurable via variable de entorno PORT)
