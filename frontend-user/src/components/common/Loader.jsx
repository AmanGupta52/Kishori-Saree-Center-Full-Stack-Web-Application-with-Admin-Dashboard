import { useId } from "react";
import "./KishoriLoader.css";

export default function Loader({
  size = 60,
  fullscreen = false,
  label = "Loading…"
}) {
  const id = useId();

  const goldEdge = `${id}-goldEdge`;
  const maroonFill = `${id}-maroonFill`;
  const centerFill = `${id}-centerFill`;

  const spinner = (
    <svg
      className="kishori-loader"
      style={{ width: size, height: size }}
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient
          id={goldEdge}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#E8C766" />
          <stop offset="50%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#9C7A16" />
        </linearGradient>

        <radialGradient
          id={maroonFill}
          cx="35%"
          cy="30%"
          r="80%"
        >
          <stop offset="0%" stopColor="#7A1B31" />
          <stop offset="100%" stopColor="#4A0E1D" />
        </radialGradient>

        <radialGradient
          id={centerFill}
          cx="35%"
          cy="30%"
          r="75%"
        >
          <stop offset="0%" stopColor="#6E1128" />
          <stop offset="100%" stopColor="#3E0815" />
        </radialGradient>
      </defs>

      <circle
        cx="150"
        cy="150"
        r="118"
        fill="none"
        stroke="#C9A227"
        strokeWidth="0.75"
        strokeDasharray="1 5"
        opacity="0.35"
      />

      <g className="rotor">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <g
            key={deg}
            transform={`rotate(${deg} 150 150)`}
          >
            <path
              d="M150,150 C136,128 128,92 150,44 C172,92 164,128 150,150 Z"
              fill={`url(#${maroonFill})`}
              stroke={`url(#${goldEdge})`}
              strokeWidth="1.4"
            />
          </g>
        ))}
      </g>

      <g fill="#D9B24C">
        {[30, 90, 150, 210, 270, 330].map((deg) => (
          <circle
            key={deg}
            cx="150"
            cy="76"
            r="2.4"
            transform={`rotate(${deg} 150 150)`}
          />
        ))}
      </g>

      <g className="glow">
        <circle
          cx="150"
          cy="150"
          r="38"
          fill={`url(#${centerFill})`}
          stroke={`url(#${goldEdge})`}
          strokeWidth="2"
        />

        <circle
          cx="150"
          cy="150"
          r="32"
          fill="none"
          stroke="#D9B24C"
          strokeWidth="0.6"
          opacity="0.55"
        />

        <text
          x="150"
          y="163"
          textAnchor="middle"
          fontFamily="Georgia, 'Playfair Display', serif"
          fontSize="34"
          fill="#E8C766"
          fontWeight="600"
        >
          K
        </text>

        <path
          d="M172,132 C176,128 182,129 182,134 C182,138 177,140 173,137 Z"
          fill="#D9B24C"
          opacity="0.9"
        />
      </g>
    </svg>
  );

  if (!fullscreen) {
    return (
      <div className="kishori-loader-container">
        {spinner}
        {label && (
          <p className="kishori-loader-label">
            {label}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="kishori-loader-overlay">
      {spinner}
      {label && (
        <p className="kishori-loader-label">
          {label}
        </p>
      )}
    </div>
  );
}