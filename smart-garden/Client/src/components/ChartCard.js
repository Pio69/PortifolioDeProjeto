import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './styles.css';

function ChartCard({ id, title, data, color }) {
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = document.getElementById(id).getContext('2d');

    // Destrói o gráfico existente antes de criar um novo
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: title,
            data,
            borderColor: color,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: title },
        },
      },
    });

    // Cleanup para destruir o gráfico ao desmontar o componente
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [id, title, data, color]); // Dependências para recriar o gráfico quando essas variáveis mudarem

  return (
    <div className="chart-container">
      <canvas id={id}></canvas>
    </div>
  );
}

export default ChartCard;
