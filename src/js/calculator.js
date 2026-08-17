export function calculateSurviveSupplies({ persons = 1, days = 3, season = 'summer', hasVulnerable = false }) {
  const p = Math.max(1, parseInt(persons) || 1);
  const d = Math.max(1, parseInt(days) || 1);

  // 水分需求：基本飲用 3 公升 / 天，夏季或高溫加增至 4 公升 / 天
  const drinkingWaterPerPersonDay = season === 'summer' ? 4 : 3;
  const cookingSanitationWaterPerPersonDay = 1.5;
  const totalWaterPerDay = (drinkingWaterPerPersonDay + cookingSanitationWaterPerPersonDay) * p;
  const totalWater = totalWaterPerDay * d;

  // 熱量需求：成年人平均 2000 大卡 / 天，若有嬰幼兒或孕婦適度增加 10%
  const baseCaloriePerPersonDay = hasVulnerable ? 2200 : 2000;
  const totalCalories = p * d * baseCaloriePerPersonDay;

  // 電池與行動電源
  const powerbanksNeeded = Math.ceil((p * d) / 6); // 每 2 人使用 3 天約需 1 個 20000mAh 行動電源
  const aaBatteriesNeeded = Math.ceil(d / 2) * 4; // 供手電筒與收音機

  // 急救與衛生品
  const saltGrams = p * d * 5; // 每天每人 5 克電解質/食鹽
  const maskCount = p * d * 2; // 每天每人 2 片口罩

  return {
    persons: p,
    days: d,
    totalWater: totalWater.toFixed(1),
    drinkingWater: (drinkingWaterPerPersonDay * p * d).toFixed(1),
    sanitationWater: (cookingSanitationWaterPerPersonDay * p * d).toFixed(1),
    totalCalories: totalCalories.toLocaleString(),
    riceKg: ((totalCalories * 0.5) / 3500).toFixed(1), // 假設半數熱量由主食米/麵提供（1kg 米約 3500 kcal）
    cannedCount: Math.ceil(totalCalories * 0.3 / 400), // 30% 熱量由罐頭提供（每罐約 400 kcal）
    powerbanksNeeded,
    aaBatteriesNeeded,
    saltGrams,
    maskCount
  };
}
