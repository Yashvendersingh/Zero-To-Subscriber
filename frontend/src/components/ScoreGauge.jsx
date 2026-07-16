import { useEffect, useState } from "react";

export default function ScoreGauge({ score, size = 120, strokeWidth = 10 }) {
  const [offset, setOffset] = useState(0);
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Animate the score progress bar
    const progressOffset = circumference - (score / 100) * circumference;
    const timer = setTimeout(() => {
      setOffset(progressOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  const getScoreColor = (val) => {
    if (val >= 80) return "stroke-emerald-500 shadow-emerald-500/50";
    if (val >= 60) return "stroke-amber-500 shadow-amber-500/50";
    return "stroke-rose-500 shadow-rose-500/50";
  };

  const getTextColor = (val) => {
    if (val >= 80) return "text-emerald-400";
    if (val >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className="stroke-dark-600 fill-transparent"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={`fill-transparent transition-all duration-1000 ease-out ${getScoreColor(score)}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {/* Inner Score Text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-3xl font-extrabold tracking-tight ${getTextColor(score)}`}>
          {score}
        </span>
        <span className="text-[10px] text-gray-500 uppercase font-semibold">ATS Match</span>
      </div>
    </div>
  );
}
