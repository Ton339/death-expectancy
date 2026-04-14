"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateRemainingDays, type FormData } from "@/app/actions/calculate";
import { AnimatedClock } from "./animated-clock";
import { WheelPicker } from "./wheel-picker";


interface StepConfig {
  key: string;
  title: string;
  unit: string;
  min: number;
  max: number;
  default: number;
}

const steps: StepConfig[] = [
  {
    key: "age",
    title: "เวลาที่ใช้ชีวิตมาแล้ว",
    unit: "ปี",
    min: 0,
    max: 69,
    default: 20,
  },
  {
    key: "weight",
    title: "น้ำหนัก",
    unit: "กิโลกรัม",
    min: 30,
    max: 150,
    default: 60,
  },
  {
    key: "height",
    title: "ส่วนสูง",
    unit: "เซนติเมตร",
    min: 100,
    max: 220,
    default: 160,
  },
  {
    key: "sleep",
    title: "ชั่วโมงในการหลับใหล",
    unit: "ชั่วโมงต่อวัน",
    min: 0,
    max: 12,
    default: 8,
  },
  {
    key: "diet",
    title: "มื้ออาหารที่ครบ 5 หมู่",
    unit: "วันต่อสัปดาห์",
    min: 0,
    max: 7,
    default: 3,
  },
  {
    key: "alcohol",
    title: "ดื่มแอลกอฮอล์",
    unit: "ครั้งต่อเดือน",
    min: 0,
    max: 30,
    default: 2,
  },
  {
    key: "smoke",
    title: "สูบบุหรี่",
    unit: "มวนต่อวัน",
    min: 0,
    max: 21,
    default: 0,
  },
  {
    key: "exercise",
    title: "ออกกำลังกาย",
    unit: "ครั้งต่อสัปดาห์",
    min: 0,
    max: 7,
    default: 1,
  },
];

function getResultContent(days: number) {
  if (days < 3000) {
    return {
      bg: "bg-black",
      text: "text-zinc-300",
      title: "ความตายอยู่ในเงาของคุณ",
      description:
        "ทุกเข็มนาฬิกาที่ขยับ...\nคือลมหายใจที่ดับลงไปช้าๆ\nไม่มีเวลาให้แก้ไขสิ่งใดอีกแล้ว",
      gradient: "",
    };
  } else if (days < 7000) {
    return {
      bg: "bg-black",
      text: "text-zinc-300",
      title: "ความตายเดินเคียงข้าง...\nแต่อยู่ในม่านหมอก",
      description:
        "แสงสว่างยังมีอยู่\nแต่ชะตากรรมยังแกว่งไกว\nการกระทำหลังจากนี้จะเป็นผู้กำหนดทิศทาง",
      gradient:
        "radial-gradient(circle at center, rgba(250, 250, 249, 0.2) 0%, transparent 70%)",
    };
  } else {
    return {
      bg: "bg-zinc-50",
      text: "text-zinc-900",
      title: "ความตายกำลังเฝ้ามองคุณ\nอยู่ในที่ที่ห่างไกล",
      description:
        "สังขารของคุณยังคงทนทาน...\nจงใช้เวลาที่เหลือสร้างความหมาย\nก่อนที่สายตาคู่นั้นจะขยับเข้าใกล้คุณอีกครั้ง",
      gradient: "",
    };
  }
}

export default function DeathExpectancyCalculator() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 is intro
  const [showResult, setShowResult] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    age: 20,
    weight: 60,
    height: 160,
    sleep: 8,
    diet: 3,
    alcohol: 2,
    smoke: 0,
    exercise: 1,
  });
  const [displayedDays, setDisplayedDays] = useState(0);
  const [countdownComplete, setCountdownComplete] = useState(false);
  const [resultDays, setResultDays] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleValueChange = useCallback(
    (value: number) => {
      if (currentStep >= 0) {
        const step = steps[currentStep];
        setFormData((prev) => ({ ...prev, [step.key]: value }));
        setHasInteracted(true);
      }
    },
    [currentStep],
  );

  const handleNext = () => {
    if (isTransitioning) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setHasInteracted(false);
    } else {
      setIsTransitioning(true);

      try {
        // ยิงข้อมูลไปให้ Server Action คำนวณ
        const result = await calculateRemainingDays(formData);

        // คำนวณเสร็จแล้วก็ทำ Animation ต่อ
        setTimeout(() => {
          setResultDays(result);
          setShowResult(true);
          setIsTransitioning(false);

          // Animate countdown from base days to result
          const baseDays = (70 - formData.age) * 365;
          setDisplayedDays(baseDays);

          const duration = 2500;
          const startTime = Date.now();
          const diff = baseDays - result;

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(baseDays - diff * eased);
            setDisplayedDays(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCountdownComplete(true);
            }
          };

          requestAnimationFrame(animate);
        }, 1000); // ปรับเวลาลงนิดนึงเพราะเราหน่วงที่ฝั่ง Server มาแล้ว 1 วินาที
      } catch (error) {
        console.error("Failed to calculate fate:", error);
      }
    }
  };

  const handleStart = () => {
    setCurrentStep(0);
  };

  const resultContent =
    showResult && resultDays !== null ? getResultContent(resultDays) : null;

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${showResult && resultContent ? resultContent.bg : "bg-black"}`}
      style={
        resultContent?.gradient
          ? { background: `${resultContent.gradient}, black` }
          : {}
      }
    >
      {/* URL indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-zinc-500 text-sm z-10">
        /web-url
      </div>

      {/* Animated Clock Background */}
      <AnimatedClock
        isResultScreen={showResult}
        isIntro={currentStep === -1}
        isTransitioning={isTransitioning}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <AnimatePresence mode="wait">
          {currentStep === -1 && !showResult && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <h1 className="text-2xl text-zinc-100 mb-2">
                นาฬิกาชีวิตที่ไม่อาจย้อนกลับ
              </h1>
              <p className="text-zinc-400 mb-8">ความตายยืนรออยู่ปลายทาง...</p>
              <motion.button
                onClick={handleStart}
                className="py-3 text-xl text-zinc-100 transition-colors tracking-wide"
                animate={{
                  textShadow: [
                    "0px 0px 0px rgba(255,255,255,0)",
                    "0px 0px 15px rgba(255,255,255,0.8)",
                    "0px 0px 0px rgba(255,255,255,0)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ยอมรับชะตากรรม
              </motion.button>
            </motion.div>
          )}

          {currentStep >= 0 && !showResult && !isTransitioning && (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center text-center w-full max-w-sm"
            >
              <h2 className="text-xl text-zinc-100 mb-8">
                {steps[currentStep].title}
              </h2>

              <WheelPicker
                min={steps[currentStep].min}
                max={steps[currentStep].max}
                defaultValue={
                  formData[steps[currentStep].key as keyof FormData]
                }
                onValueChange={handleValueChange}
                key={`picker-${currentStep}`}
              />

              <p className="text-zinc-400 mt-6">{steps[currentStep].unit}</p>
            </motion.div>
          )}

          {showResult && resultContent && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className={`flex flex-col items-center text-center ${resultContent.text}`}
            >
              <h2 className="text-lg whitespace-pre-line mb-6">
                {resultContent.title}
              </h2>

              <motion.div
                className="text-6xl font-light mb-6"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {displayedDays.toLocaleString()}
              </motion.div>

              <AnimatePresence>
                {countdownComplete && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-sm whitespace-pre-line leading-relaxed opacity-80"
                  >
                    {resultContent.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <AnimatePresence>
          {currentStep >= 0 && !showResult && !isTransitioning && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                ...(hasInteracted
                  ? {
                      textShadow: [
                        "0px 0px 0px rgba(255,255,255,0)",
                        "0px 0px 15px rgba(255,255,255,0.8)",
                        "0px 0px 0px rgba(255,255,255,0)",
                      ],
                    }
                  : {
                      textShadow: "0px 0px 0px rgba(255,255,255,0)",
                    }),
              }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.3,
                textShadow: hasInteracted
                  ? {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : { duration: 0.3 },
              }}
              onClick={handleNext}
              disabled={isTransitioning}
              className={`absolute bottom-12 py-3 text-xl transition-colors tracking-wide ${isTransitioning ? "text-zinc-600 cursor-not-allowed" : "text-zinc-100"}`}
            >
              {currentStep === steps.length - 1
                ? "ล่วงรู้วาระสุดท้าย"
                : "ดำดิ่งต่อไป"}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        {showResult && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 3, duration: 1 }}
            className="absolute bottom-4 left-4 right-4 text-xs text-zinc-500 text-center"
          >
            เนื้อหานี้มีไว้เพื่อวัตถุประสงค์ในการฝึกการเขียนโปรแกรมเท่านั้น
            โปรดปรึกษาผู้เชี่ยวชาญหากต้องการคำแนะนำหรือการวินิจฉัยทางการแพทย์
          </motion.p>
        )}
      </div>
    </div>
  );
}
