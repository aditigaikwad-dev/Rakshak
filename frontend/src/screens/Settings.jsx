import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';

const DEFAULT_SETTINGS = {
  audio: true,
  refreshInterval: 3.5,
  theme: 'light'
};

const VALID_THEMES = new Set(['light', 'auto', 'dark']);

const resolveTheme = (themePreference) => {
  if (themePreference === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return themePreference;
};

const applyThemePreference = (themePreference) => {
  const resolved = resolveTheme(themePreference);
  document.documentElement.dataset.theme = resolved;
};

export default function Settings() {
  const [audio, setAudio] = useState(DEFAULT_SETTINGS.audio);
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_SETTINGS.refreshInterval);
  const [theme, setTheme] = useState(DEFAULT_SETTINGS.theme);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rakshak.settings') || 'null');
      if (saved) {
        setAudio(Boolean(saved.audio));
        setRefreshInterval(Number(saved.refreshInterval) || DEFAULT_SETTINGS.refreshInterval);
        setTheme(VALID_THEMES.has(saved.theme) ? saved.theme : DEFAULT_SETTINGS.theme);
      }
    } catch {
      // ignore malformed saved settings
    }
  }, []);

  useEffect(() => {
    applyThemePreference(theme);
  }, [theme]);

  const saveSettings = () => {
    const payload = { audio, refreshInterval, theme };
    localStorage.setItem('rakshak.settings', JSON.stringify(payload));
    setMessage('Settings saved locally.');
  };

  const resetSettings = () => {
    setAudio(DEFAULT_SETTINGS.audio);
    setRefreshInterval(DEFAULT_SETTINGS.refreshInterval);
    setTheme(DEFAULT_SETTINGS.theme);
    localStorage.setItem('rakshak.settings', JSON.stringify(DEFAULT_SETTINGS));
    setMessage('Settings reset to default.');
  };

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card className="space-y-4 p-4" hover>
        <h2 className="text-sm font-semibold text-slate-100">Alert Preferences</h2>
        <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/70 p-3">
          <span className="text-sm text-slate-200">Enable audio alerts</span>
          <input
            type="checkbox"
            checked={audio}
            onChange={(e) => setAudio(e.target.checked)}
            className="h-4 w-4"
          />
        </label>

        <label className="block rounded-lg border border-slate-700 bg-slate-800/70 p-3">
          <span className="text-sm text-slate-200">Refresh interval: {refreshInterval}s</span>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </label>
      </Card>

      <Card className="space-y-4 p-4" hover>
        <h2 className="text-sm font-semibold text-slate-100">Environment</h2>
        <label className="block text-sm text-slate-300">
          Theme
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
          >
            <option value="light">White</option>
            <option value="auto">Auto (System)</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <button
          type="button"
          onClick={saveSettings}
          className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
        >
          Save Settings
        </button>

        <button
          type="button"
          onClick={resetSettings}
          className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
        >
          Reset Defaults
        </button>

        {message ? <p className="text-xs text-emerald-300">{message}</p> : null}
      </Card>
    </section>
  );
}
