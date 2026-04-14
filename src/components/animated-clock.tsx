"use client";

import { motion } from "framer-motion";

interface AnimatedClockProps {
  isResultScreen: boolean;
  isIntro: boolean;
  isTransitioning?: boolean;
}

export function AnimatedClock({
  isResultScreen,
  isTransitioning,
}: AnimatedClockProps) {
  const isFullClock = !!isTransitioning;
  const opacity = isResultScreen ? 1 : 0.25;
  const animationDuration = isResultScreen ? 2 : 120;

  const clockAnimation = {
    opacity: isTransitioning ? 0.8 : opacity,
    y: isFullClock ? 0 : -80,
    WebkitMaskPosition: isFullClock ? "0% 0%" : "0% 100%",
    maskPosition: isFullClock ? "0% 0%" : "0% 100%",
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative w-80 h-80 md:w-96 md:h-96"
        initial={false}
        animate={clockAnimation}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskSize: "100% 200%",
          maskSize: "100% 200%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        {/* Clock Face */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Clock circle */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-zinc-600"
          />

          {/* Roman numerals */}
          {[
            { num: "XII", x: 100, y: 30 },
            { num: "I", x: 130, y: 40 },
            { num: "II", x: 155, y: 70 },
            { num: "III", x: 165, y: 101 },
            { num: "IV", x: 155, y: 135 },
            { num: "V", x: 135, y: 160 },
            { num: "VI", x: 100, y: 170 },
            { num: "VII", x: 65, y: 160 },
            { num: "VIII", x: 45, y: 135 },
            { num: "IX", x: 35, y: 101 },
            { num: "X", x: 45, y: 70 },
            { num: "XI", x: 70, y: 40 },
          ].map((item) => (
            <text
              key={item.num}
              x={item.x}
              y={item.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-zinc-400 text-[10px]"
              style={{ fontFamily: "serif" }}
            >
              {item.num}
            </text>
          ))}

          {/* Hour marks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = Number((100 + 80 * Math.cos(angle)).toFixed(4));
            const y1 = Number((100 + 80 * Math.sin(angle)).toFixed(4));
            const x2 = Number((100 + 88 * Math.cos(angle)).toFixed(4));
            const y2 = Number((100 + 88 * Math.sin(angle)).toFixed(4));
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1"
                className="text-zinc-500"
              />
            );
          })}

          {/* Center dot */}
          <circle cx="100" cy="100" r="3" className="fill-zinc-400" />
        </svg>

        {/* Hour Hand */}
        <motion.div
          className="absolute top-1/2 left-1/2 origin-bottom"
          style={{
            width: 4,
            height: "25%",
            marginLeft: -2,
            marginTop: "-25%",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: animationDuration * 12,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-full h-full bg-zinc-400 rounded-full" />
        </motion.div>

        {/* Minute Hand */}
        <motion.div
          className="absolute top-1/2 left-1/2 origin-bottom"
          style={{
            width: 2,
            height: "35%",
            marginLeft: -1,
            marginTop: "-35%",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-full h-full bg-zinc-300 rounded-full" />
        </motion.div>

        {/* Second Hand */}
        <motion.div
          className="absolute top-1/2 left-1/2 origin-bottom"
          style={{
            width: 1,
            height: "40%",
            marginLeft: -0.5,
            marginTop: "-40%",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: animationDuration / 60,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-full h-full bg-zinc-500 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}
