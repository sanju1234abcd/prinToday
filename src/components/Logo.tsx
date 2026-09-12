import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 600 220" 
      className={className}
    >
      <defs>
        <style>
          {`
            .text-prin {
              font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-weight: 800;
              font-size: 68px;
              fill: #1B00B2;
            }
            .text-today {
              font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-weight: 800;
              font-size: 68px;
              fill: #00C853;
            }
            .text-tagline {
              font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-weight: 700;
              font-style: italic;
              font-size: 23px;
              fill: #000000;
              letter-spacing: 0.2px;
            }
              .text-tagline2 {
              font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-weight: 700;
              font-style: italic;
              font-size: 33.5px;
              fill: #000000;
              letter-spacing: 0.2px;
            }
          `}
        </style>
      </defs>

      <g id="logo-icon">
        <polygon points="110,75 178,110 110,145 42,110" fill="#00C853" />
        <polygon points="110,38 177,122 43,122" fill="#1B00B2" />
      </g>

      <g id="logo-text">
        <text x="200" y="117">
          <tspan className="text-prin">Prin</tspan><tspan className="text-today">Today</tspan>
        </text>

      </g>
      <text x="50" y="200" className="text-tagline2">By Zyflare Event Services PVT. LTD.</text>
    </svg>
  );
};
