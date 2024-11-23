import React from 'react';
import './styles.css';

function ActivityFeed({ activities }) {
  return (
    <div className="activity-feed">
      <h3>Recent Activity</h3>
      {activities.map((activity, index) => (
        <div key={index} className="activity-item">
          <div className="activity-dot" style={{ background: activity.color }}></div>
          <div>{activity.text}</div>
          <div style={{ marginLeft: 'auto' }}>{activity.time}</div>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed;
