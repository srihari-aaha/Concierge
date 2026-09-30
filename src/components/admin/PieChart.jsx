import React, { useState } from 'react';
import './PieChart.css';

export default function PieChart({
  data = [],
  centerValue = '',
  centerLabel = '',
  size = 200,
  innerRadius = 58,
  outerRadius = 88
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate slice coordinates
  let cumulativeAngle = 0;
  const slices = data.map((item, idx) => {
    const sliceAngle = total > 0 ? (item.value / total) * 360 : 0;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle = endAngle;

    const isHovered = hoveredIdx === idx;
    const rOut = isHovered ? outerRadius + 4 : outerRadius;
    const rIn = isHovered ? innerRadius - 2 : innerRadius;
    const cx = size / 2;
    const cy = size / 2;

    // Convert degrees to radians (offset by -90 deg so 0 is at 12 o'clock)
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + rOut * Math.cos(startRad);
    const y1 = cy + rOut * Math.sin(startRad);
    const x2 = cx + rOut * Math.cos(endRad);
    const y2 = cy + rOut * Math.sin(endRad);

    const x3 = cx + rIn * Math.cos(endRad);
    const y3 = cy + rIn * Math.sin(endRad);
    const x4 = cx + rIn * Math.cos(startRad);
    const y4 = cy + rIn * Math.sin(startRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    const pathData = `M ${x1} ${y1} A ${rOut} ${rOut} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
    const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;

    return {
      ...item,
      pathData,
      percentage,
      isHovered
    };
  });

  const activeItem = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="pie-chart-container">
      {/* Visual Chart with Center Metric */}
      <div className="pie-graphic-area" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="pie-svg"
          aria-hidden="true"
        >
          {slices.map((slice, idx) => (
            <path
              key={slice.label}
              d={slice.pathData}
              fill={slice.color}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className={`pie-slice ${slice.isHovered ? 'active' : ''}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center Cutout Text */}
        <div className="pie-center-badge">
          <span className="pie-center-value">
            {activeItem ? activeItem.formattedVal : centerValue}
          </span>
          <span className="pie-center-label">
            {activeItem ? activeItem.label : centerLabel}
          </span>
          {activeItem && (
            <span
              className="pie-center-pct"
              style={{ color: activeItem.color, backgroundColor: `${activeItem.color}15` }}
            >
              {activeItem.percentage}% of total
            </span>
          )}
        </div>
      </div>

      {/* Structured Legend */}
      <div className="pie-legend-block">
        {slices.map((item, idx) => (
          <div
            key={item.label}
            className={`pie-legend-row ${hoveredIdx === idx ? 'highlighted' : ''}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="legend-info">
              <span className="legend-bullet" style={{ backgroundColor: item.color }} />
              <div>
                <span className="legend-name">{item.label}</span>
                {item.desc && <span className="legend-desc">{item.desc}</span>}
              </div>
            </div>

            <div className="legend-metric">
              <span className="legend-val">{item.formattedVal}</span>
              <span
                className="legend-tag"
                style={{ color: item.color, backgroundColor: `${item.color}14` }}
              >
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
