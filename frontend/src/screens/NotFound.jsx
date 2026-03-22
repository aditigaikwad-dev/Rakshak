import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

export default function NotFound() {
  return (
    <Card className="mx-auto max-w-xl p-8 text-center">
      <h2 className="text-2xl font-semibold text-slate-100">Route not found</h2>
      <p className="mt-2 text-sm text-slate-400">The page you requested does not exist in RAKSHAK console.</p>
      <Link
        to="/live"
        className="mt-6 inline-flex rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200"
      >
        Go to Live Dashboard
      </Link>
    </Card>
  );
}
