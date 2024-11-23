import React from 'react';
import './styles.css';

function StatCard({ title, value, trend, trendColor }) {
  return (
    <div className="stat-card">
      <div>{title}</div>
      <div className="stat-value">{value}</div>
      <div style={{ color: trendColor }}>{trend}</div>
    </div>
  );
}

export default StatCard;
