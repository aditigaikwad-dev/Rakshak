import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ labels, values, label = 'Readings', color = '#F59E0B' }) {
  const css = getComputedStyle(document.documentElement);
  const chartText = css.getPropertyValue('--chart-text').trim() || '#334155';
  const chartGrid = css.getPropertyValue('--chart-grid').trim() || 'rgba(148, 163, 184, 0.2)';

  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        borderRadius: 8,
        backgroundColor: color
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: chartText }
      }
    },
    scales: {
      x: { ticks: { color: chartText }, grid: { color: chartGrid } },
      y: { ticks: { color: chartText }, grid: { color: chartGrid } }
    }
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
