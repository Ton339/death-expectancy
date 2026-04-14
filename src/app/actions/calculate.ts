"use server"; // บรรทัดนี้คือเวทมนตร์ที่บอกว่าไฟล์นี้ทำงานบน Server เท่านั้น!

export interface FormData {
  age: number;
  weight: number;
  height: number;
  sleep: number;
  diet: number;
  alcohol: number;
  smoke: number;
  exercise: number;
}

export async function calculateRemainingDays(data: FormData): Promise<number> {
  const { age, weight, height, sleep, diet, alcohol, smoke, exercise } = data;

  // Base Days
  const baseDays = (70 - age) * 365;
  let modifiers = 0;

  // จำลองความหน่วงของ Server นิดหน่อย ให้ดูเหมือนกำลัง "ประมวลผลชะตากรรม" จริงๆ (ประมาณ 1 วินาที)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // BMI calculation
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  if (bmi < 18.5) modifiers -= 300;
  else if (bmi >= 18.5 && bmi <= 24.9) modifiers += 0;
  else if (bmi >= 25.0 && bmi <= 29.9) modifiers -= 200;
  else if (bmi >= 30.0) modifiers -= 600;

  // Sleep
  if (sleep < 5) modifiers -= 400;
  else if (sleep >= 5 && sleep <= 6) modifiers -= 150;
  else if (sleep >= 7 && sleep <= 8) modifiers += 200;
  else modifiers += 0;

  // Diet
  if (diet <= 1) modifiers -= 300;
  else if (diet >= 2 && diet <= 3) modifiers += 40;
  else if (diet >= 4 && diet <= 5) modifiers += 250;
  else if (diet >= 6) modifiers += 500;

  // Alcohol
  if (alcohol === 0) modifiers += 100;
  else if (alcohol >= 1 && alcohol <= 4) modifiers += 0;
  else if (alcohol >= 5 && alcohol <= 15) modifiers -= 200;
  else if (alcohol >= 16) modifiers -= 500;

  // Smoke
  if (smoke === 0) modifiers += 0;
  else if (smoke >= 1 && smoke <= 6) modifiers -= 200;
  else if (smoke >= 7 && smoke <= 10) modifiers -= 500;
  else if (smoke >= 11 && smoke <= 20) modifiers -= 1500;
  else if (smoke >= 21) modifiers -= 3500;

  // Exercise
  if (exercise === 0) modifiers -= 300;
  else if (exercise >= 1 && exercise <= 2) modifiers += 100;
  else if (exercise >= 3 && exercise <= 4) modifiers += 300;
  else if (exercise >= 5) modifiers += 500;

  return Math.max(0, baseDays + modifiers);
}
