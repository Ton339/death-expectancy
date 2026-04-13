"use client"

import { motion } from "framer-motion"

interface AnimatedClockProps {
  isResultScreen: boolean
  isIntro: boolean
}

export function AnimatedClock({ isResultScreen, isIntro }: AnimatedClockProps) {
  const opacity = isResultScreen ? 1 : 0.25
  const animationDuration = isResultScreen ? 2 : 120

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity }}
    >
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Clock Face */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
        >
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
            { num: "XII", x: 100, y: 22 },
            { num: "I", x: 130, y: 28 },
            { num: "II", x: 155, y: 50 },
            { num: "III", x: 172, y: 104 },
            { num: "IV", x: 155, y: 155 },
            { num: "V", x: 130, y: 178 },
            { num: "VI", x: 100, y: 188 },
            { num: "VII", x: 70, y: 178 },
            { num: "VIII", x: 42, y: 155 },
            { num: "IX", x: 28, y: 104 },
            { num: "X", x: 42, y: 50 },
            { num: "XI", x: 70, y: 28 },
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
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const x1 = 100 + 80 * Math.cos(angle)
            const y1 = 100 + 80 * Math.sin(angle)
            const x2 = 100 + 88 * Math.cos(angle)
            const y2 = 100 + 88 * Math.sin(angle)
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
            )
          })}
          
          {/* Center dot */}
          <circle
            cx="100"
            cy="100"
            r="3"
            className="fill-zinc-400"
          />
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
      </div>
    </div>
  )
}
