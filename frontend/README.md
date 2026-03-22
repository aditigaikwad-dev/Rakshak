# RAKSHAK Dashboard

RAKSHAK is an industrial safety monitoring dashboard built with React and Vite.
It provides real-time worker tracking, pre-entry approval flows, alert timelines, ward risk mapping, worker profile management, and daily reporting.

## Tech Stack

### Frontend
- React 19
- Vite 8
- React Router DOM 7
- Tailwind CSS 3
- Lucide React (icons)
- CLSX (class composition)

### Data, Realtime, and Services
- Axios (API-ready HTTP layer)
- Socket.io-client (real-time stream integration hook)
- Mock services to mirror backend endpoints

### Visualization and Mapping
- Chart.js + react-chartjs-2
- Leaflet + react-leaflet

### Build and Quality
- ESLint 9
- PostCSS + Autoprefixer

## Key Features Implemented

- Live Monitoring dashboard with:
	- Real-time worker updates (mocked socket stream)
	- Alert sound trigger for danger/critical events
	- Worker filters (all, alerts only, by ward)
	- Worker search and selection
	- Interactive map markers and card focus actions

- Pre-Entry Gate:
	- Manhole status cards (SAFE, UNSAFE, PENDING)
	- Gas readings and reason display
	- Depth-based chart
	- Approve entry action with UNSAFE override confirmation

- Alert History:
	- Timeline cards
	- Severity/status filtering
	- Acknowledge action with feedback

- Risk Map:
	- Ward-based risk overlays
	- Legend and risk threshold filter
	- Solapur, Maharashtra map coordinates

- Worker Profiles:
	- Searchable worker table
	- Health trend charts
	- Assign jacket action
	- Emergency contact save action

- Daily Report:
	- KPI cards
	- Alerts by hour chart
	- Alerts table
	- Generate PDF via `window.print()`

- Settings:
	- Audio toggle
	- Refresh interval slider
	- Theme preference: White (default), Auto, Dark
	- Local persistence with reset defaults

- UI/UX system:
	- Reusable components (`Card`, `Badge`, `StatusDot`, `Loader`, `ChartWrapper`)
	- Loading, empty, and error states
	- Global error boundary fallback
	- Theme-aware chart colors and cross-theme surface contrast tuning

## Health Detection Logic (Biometric Anomaly)

RAKSHAK uses a rule-based biometric classifier (in `src/utils/healthClassifier.js`) that converts live wearable vitals into actionable health states.

### Inputs Used
- Heart rate (`hr`)
- Blood oxygen (`spo2`)
- Body temperature (`temperature`)
- Immobility duration (`immobilitySeconds`)
- Previous `spo2` (for rapid-drop pattern)

### State Classification Rules
- `CRITICAL` when any of the following is true:
	- Collapse pattern: `hr >= 130`, `spo2 drop >= 2`, `spo2 <= 90`, and `immobilitySeconds >= 30`
	- `hr >= 145`
	- `spo2 <= 86`
	- `temperature >= 39.2`

- `DISTRESSED` when any of the following is true:
	- `hr >= 125`
	- `spo2 <= 91`
	- `temperature >= 38.5`
	- `immobilitySeconds >= 25`

- `STRESSED` when any of the following is true:
	- `hr >= 108`
	- `spo2 <= 95`
	- `temperature >= 37.7`

- Otherwise: `NORMAL`

### Severity Mapping
- `CRITICAL` -> `CRITICAL`
- `DISTRESSED` -> `DANGER`
- `STRESSED` -> `WARNING`
- `NORMAL` -> `NORMAL`

This status is merged with gas-based severity to derive the final live worker severity shown on cards/map.

## Pre-Entry Risk Score Logic (AI-Assisted Gate Decision)

RAKSHAK computes an explainable risk score (in `src/utils/preEntryRiskClassifier.js`) before gate entry approval.

### Inputs Used
- Multi-gas scan readings (`H2S`, `CH4`, `CO`, `O2`, `NH3`)
- Historical risk score (`historicalRiskScore`, normalized to 0-100)
- Incident count (`incidentCount`)
- Seasonal adjustment factor (`seasonalFactor`)

### Step 1: Gas Scan Risk
Each gas contributes severity points using threshold bands from `GAS_THRESHOLDS`:
- Critical breach: `+30`
- Danger breach: `+22`
- Warning breach: `+14`
- Safe range: `+4`

For inverse-threshold gases like oxygen, lower values are riskier.

Composite gas risk:
- `scanRisk = round(totalPoints / 5)`

### Step 2: Derived Factors
- `historical = clamp(round(historicalRiskScore * 100), 0, 100)`
- `incidentRisk = clamp(incidentCount * 7, 0, 35)`
- `seasonalRisk = clamp(round((seasonalFactor - 1) * 20), -10, 20)`

### Step 3: Final AI Risk Score

`score = clamp(round(scanRisk * 0.52 + historical * 0.28 + incidentRisk + seasonalRisk), 0, 100)`

### Step 4: Classification
- `score >= 70` -> `DANGEROUS`
- `score >= 40` and `< 70` -> `CAUTION`
- `< 40` -> `SAFE`

### Operational Behavior in UI
- DANGEROUS approvals require explicit supervisor override confirmation.
- Approval actions store approver identity and timestamp in UI state.
- Factor breakdown (`scanRisk`, `historical`, `incidentRisk`, `seasonalRisk`) is shown for explainability.

## Application Routes

- `/` -> Live Monitoring
- `/live` -> Live Monitoring
- `/gate` -> Pre-Entry Gate
- `/alerts` -> Alert History
- `/map` -> Risk Map
- `/workers` -> Worker Profiles
- `/report` -> Daily Report
- `/settings` -> Settings

## Project Structure

```text
src/
	app/
		App.jsx
		routes.jsx
	components/
		charts/
		map/
		ui/
		worker/
	constants/
	context/
	hooks/
	screens/
	services/
	styles/
	utils/
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

Open:
- `http://localhost:5173/`
- `http://localhost:5173/live`

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Deployment (Netlify: https://cerulean-taffy-ba9479.netlify.app/)

Netlify SPA routing is configured through `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist`
- Redirect: `/*` -> `/index.html` with status `200`

This ensures deep links like `/live`, `/alerts`, and `/workers` work after deployment.

## Theme Behavior

- Default theme: **White**
- Available options: **White**, **Auto (System)**, **Dark**
- Theme preference is saved in local storage (`rakshak.settings`)
- Auto mode follows OS color scheme changes

## Notes

- Current realtime and service responses are mock-driven but backend-ready.
- The API and hook structure is designed for easy replacement with real endpoints and socket events.
