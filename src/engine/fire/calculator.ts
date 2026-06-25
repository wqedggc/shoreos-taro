// FIRE 纯函数计算引擎 — 零外部依赖

export interface FireInputs {
  birthYear: number;
  currentYear: number;
  pensionYears: number;
  medicalYears: number;
  pensionMin: number;
  medicalMin: number;
  pensionSelfPay: number;
  medicalSelfPay: number;
  ssStrategy: 'min' | 'retire';
  incomePost: number;
  // 住房
  houseType: 'rent' | 'mortgage' | 'none';
  expRent: number;
  expMortgage: number;
  mortgageYearsLeft: number;
  expProperty: number;
  // 开销
  expFood: number; expTransport: number; expPet: number;
  expEntertain: number; expInsurance: number; expOther: number;
  expQFood: number; expQTransport: number; expQPet: number;
  expQEntertain: number; expQInsurance: number; expQOther: number;
  expQHousing: number;
  // 资产
  assetCash: number; assetDeposit: number; assetFund: number;
  assetStock: number; assetPension: number; assetReturn: number;
  // 子女
  childPlan: 'none' | 'one'; childCost: number;
}

export interface FireResult {
  age: number; freedomIndex: number; fireTarget: number; gap: number;
  yearsToFire: number; quitYears: number; monthlyExpense: number;
  minMonthlyExpense: number; totalAssets: number; annualSavings: number;
  penToMin: number; medToMin: number; ssTotalCost: number; ssSelfNow: number;
  scenarios: Scenario[];
  projections: { labels: string[]; continueWork: number[]; quitNow: number[]; quit35: number[]; quit40: number[]; };
  safetyMonths: number[];
}

export interface Scenario {
  label: string; age: number; assets: number; survival: number;
  penYears: number; medYears: number; freedomIndex: number; isFree: boolean;
}

export function calculate(inputs: FireInputs): FireResult | null {
  const age = inputs.currentYear - inputs.birthYear;
  if (age <= 0 || age > 120) return null;

  // 社保计算
  const penY = inputs.pensionYears, medY = inputs.medicalYears;
  const penMin = inputs.pensionMin, medMin = inputs.medicalMin;
  const penSelf = inputs.pensionSelfPay, medSelf = inputs.medicalSelfPay;

  let ssSelfNow = 0;
  if (penY < penMin) ssSelfNow += penSelf;
  if (medY < medMin) ssSelfNow += medSelf;
  if (inputs.ssStrategy === 'retire') ssSelfNow = penSelf + medSelf;

  let ssTotalCost = 0;
  if (inputs.ssStrategy === 'retire') {
    ssTotalCost = Math.max(60 - age, 0) * (penSelf + medSelf) * 12;
  } else {
    let pR = Math.max(penMin - penY, 0), mR = Math.max(medMin - medY, 0);
    const stage1 = Math.min(pR, mR);
    ssTotalCost += stage1 * (penSelf + medSelf) * 12;
    mR -= stage1;
    if (mR > 0) ssTotalCost += mR * medSelf * 12;
  }

  // 开销
  const housing = inputs.houseType === 'rent' ? inputs.expRent :
    inputs.houseType === 'mortgage' ? inputs.expMortgage + inputs.expProperty : inputs.expProperty;
  const currentMonthly = housing + inputs.expFood + inputs.expTransport + inputs.expPet + inputs.expEntertain + inputs.expInsurance + inputs.expOther;
  
  const minMonthly = (inputs.expQHousing || 0) + inputs.expQFood + inputs.expQTransport + inputs.expQPet + inputs.expQEntertain + inputs.expQInsurance + inputs.expQOther + ssSelfNow;

  // 资产
  const totalAssets = inputs.assetCash * 10000 + inputs.assetDeposit * 10000 + inputs.assetFund * 10000 + inputs.assetStock * 10000 + inputs.assetPension * 10000;
  const ret = inputs.assetReturn / 100;
  const income = inputs.incomePost * 10000;

  // 房贷
  let mgPrincipal = 0, mgMonthly = 0, mgYears = 0;
  if (inputs.houseType === 'mortgage') {
    mgMonthly = inputs.expMortgage;
    mgYears = inputs.mortgageYearsLeft;
    if (mgMonthly > 0 && mgYears > 0) mgPrincipal = mgMonthly * 12 * mgYears * 0.85;
  }

  // FIRE
  const longTermAnnual = (minMonthly - ssSelfNow - mgMonthly) * 12;
  const fireTarget = Math.max(longTermAnnual, 0) * 25 + mgPrincipal;
  const investableAssets = Math.max(totalAssets - mgPrincipal, 0);
  const freedomIndex = fireTarget > 0 ? Math.min(investableAssets / fireTarget * 100, 100) : 0;

  const annualSavings = Math.max(income - currentMonthly * 12, 0);
  const quitYears = minMonthly > 0 ? totalAssets / minMonthly / 12 : 999;
  const gap = Math.max(fireTarget - investableAssets, 0);
  const yearsToFire = annualSavings > 0 ? gap / annualSavings : 999;

  // 情景推演
  const scenarios: Scenario[] = [];
  for (const ta of [age, 35, 40, 45, 50, 55, 60]) {
    if (ta < age) continue;
    const wy = ta - age;
    let a = totalAssets;
    for (let i = 0; i < wy; i++) a = a * (1 + ret) + annualSavings;
    scenarios.push({
      label: ta === age ? '现在就不工作' : `坚持到${ta}岁`,
      age: ta, assets: a,
      survival: minMonthly > 0 ? a / minMonthly / 12 : 999,
      penYears: penY + wy, medYears: medY + wy,
      freedomIndex: fireTarget > 0 ? Math.min((a - mgPrincipal) / fireTarget * 100, 100) : 0,
      isFree: a >= fireTarget,
    });
  }

  // 资产预测
  const labels: string[] = [], cw: number[] = [], qn: number[] = [], q35: number[] = [], q40: number[] = [];
  for (let y = 0; y <= 35; y++) {
    labels.push((age + y) + '岁');
    let aw = totalAssets; for (let i = 0; i < y; i++) aw = aw * (1 + ret) + annualSavings; cw.push(aw / 10000);
    let aq = totalAssets; for (let i = 0; i < y; i++) { let e = minMonthly * 12; if (i < mgYears) e += mgMonthly * 12; aq = aq * (1 + ret) - e; } qn.push(Math.max(aq / 10000, 0));
    const w35 = Math.max(35 - age, 0); let a35 = totalAssets;
    for (let i = 0; i < y; i++) { if (i < w35) a35 = a35 * (1 + ret) + annualSavings; else { let e = minMonthly * 12; if (i - w35 < mgYears) e += mgMonthly * 12; a35 = a35 * (1 + ret) - e; } } q35.push(Math.max(a35 / 10000, 0));
    const w40 = Math.max(40 - age, 0); let a40 = totalAssets;
    for (let i = 0; i < y; i++) { if (i < w40) a40 = a40 * (1 + ret) + annualSavings; else { let e = minMonthly * 12; if (i - w40 < mgYears) e += mgMonthly * 12; a40 = a40 * (1 + ret) - e; } } q40.push(Math.max(a40 / 10000, 0));
  }

  const pY = [1, 2, 3, 5, 8, 10];
  const safetyMonths = pY.map(y => (annualSavings * y / (minMonthly * 12)) * 12);

  return {
    age, freedomIndex, fireTarget, gap, yearsToFire, quitYears,
    monthlyExpense: currentMonthly, minMonthlyExpense: minMonthly,
    totalAssets, annualSavings,
    penToMin: Math.max(penMin - penY, 0), medToMin: Math.max(medMin - medY, 0),
    ssTotalCost, ssSelfNow,
    scenarios,
    projections: { labels, continueWork: cw, quitNow: qn, quit35: q35, quit40: q40 },
    safetyMonths,
  };
}
