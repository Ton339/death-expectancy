"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"

interface WheelPickerProps {
  min: number
  max: number
  defaultValue: number
  onValueChange: (value: number) => void
}

const ITEM_HEIGHT = 60

export function WheelPicker({ min, max, defaultValue, onValueChange }: WheelPickerProps) {
  const [currentValue, setCurrentValue] = useState(defaultValue)
  const [isAnimating, setIsAnimating] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const defaultIndex = defaultValue - min

  useEffect(() => {
    // On mount animation: start from max and spin down to default
    const spinDown = async () => {
      setIsAnimating(true)
      const startIndex = values.length - 1
      const targetIndex = defaultIndex
      
      // Calculate positions
      const startY = -startIndex * ITEM_HEIGHT
      const endY = -targetIndex * ITEM_HEIGHT
      
      // Set initial position at max
      await controls.set({ y: startY })
      
      // Animate to default value
      await controls.start({
        y: endY,
        transition: {
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
        }
      })
      
      setCurrentValue(defaultValue)
      setIsAnimating(false)
    }
    
    spinDown()
  }, [min, max, defaultValue])

  const handleScroll = () => {
    if (!containerRef.current || isAnimating) return
    
    const scrollTop = containerRef.current.scrollTop
    const index = Math.round(scrollTop / ITEM_HEIGHT)
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1))
    const newValue = values[clampedIndex]
    
    if (newValue !== currentValue) {
      setCurrentValue(newValue)
      onValueChange(newValue)
    }
  }

  const handleItemClick = (value: number) => {
    if (isAnimating) return
    
    const index = value - min
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: "smooth"
      })
    }
    setCurrentValue(value)
    onValueChange(value)
  }

  // Sync scroll position after animation completes
  useEffect(() => {
    if (!isAnimating && containerRef.current) {
      const targetIndex = currentValue - min
      containerRef.current.scrollTop = targetIndex * ITEM_HEIGHT
    }
  }, [isAnimating, currentValue, min])

  return (
    <div className="relative h-[180px] w-full overflow-hidden">
      {/* Gradient overlays */}
      {/* <div className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" /> */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" /> */}
      
      {/* Selection indicator */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-[60px] border-t border-b border-zinc-700 pointer-events-none z-0" /> */}
      
      {/* Animated display during spin */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center"
            style={{ paddingTop: 60 }}
          >
            <motion.div
              animate={controls}
              className="flex flex-col items-center"
            >
              {values.map((value, index) => {
                return (
                  <div
                    key={value}
                    className="flex items-center justify-center text-zinc-100 transition-all"
                    style={{ 
                      height: ITEM_HEIGHT,
                      fontSize: "2.5rem",
                    }}
                  >
                    {value}
                  </div>
                )
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scrollable container */}
      {!isAnimating && (
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          onScroll={handleScroll}
          style={{
            scrollSnapType: "y mandatory",
            paddingTop: 60,
            paddingBottom: 60,
          }}
        >
          {values.map((value) => {
            const isActive = value === currentValue
            const distance = Math.abs(value - currentValue)
            const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.25
            
            return (
              <div
                key={value}
                className="flex items-center justify-center cursor-pointer snap-center transition-all duration-150"
                style={{ 
                  height: ITEM_HEIGHT,
                  opacity,
                  fontSize: isActive ? "2.5rem" : "2rem",
                }}
                onClick={() => handleItemClick(value)}
              >
                <span className="text-zinc-100">{value}</span>
              </div>
            )
          })}
        </div>
      )}
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
