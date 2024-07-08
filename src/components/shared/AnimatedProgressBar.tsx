import React, { useEffect, useRef } from 'react';

interface AnimatedProgressBarProps {
  progress: number; // 0 to 100
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({ progress }) => {
  const progressRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.strokeDasharray = `${progress}, 100`;
    }
  }, [progress]);

  return (
    <div className="progress-container w-full">
      <svg width="100%" height="8" viewBox="0 0 100 8">
        <defs>
          <linearGradient id="pingGradient">
            <stop offset="0%" stopColor="rgba(8, 224, 74, 0.5)" />
            <stop offset="100%" stopColor="rgba(8, 224, 74, 0)" />
          </linearGradient>
        </defs>
        <path
          d="M0 4 L100 4"
          stroke="#E0E0E0"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          ref={progressRef}
          d="M0 4 L100 4"
          stroke="#08E04A"
          strokeWidth="8"
          strokeLinecap="round"
          className="progress-path"
        />
        <rect
          x="0"
          y="0"
          width="100%"
          height="8"
          fill="url(#pingGradient)"
          className="ping-animation"
        />
      </svg>
    </div>
  );
};

export default AnimatedProgressBar;