export interface PregnancyTip {
  week: number;
  trimester: 1 | 2 | 3 | 4; // 4 = Postpartum / General Women's Wellness
  babySizeComparison: string;
  babyLengthCm: string;
  babyWeightG: string;
  title: string;
  highlight: string;
  fetalDevelopment: string;
  maternalBodyChanges: string;
  nutritionTip: string;
  recommendedClinicService?: string;
  recommendedServiceType?: 'Check-Up' | 'Ultrasound';
  scanRecommendation?: string;
  warningSigns: string[];
  reviewedBy: string;
}

export const PREGNANCY_WEEKLY_TIPS: PregnancyTip[] = [
  {
    week: 6,
    trimester: 1,
    babySizeComparison: 'Sweet Pea (0.5 cm)',
    babyLengthCm: '0.5 cm',
    babyWeightG: '< 1 g',
    title: 'Early Embryonic Development & Neural Tube Closure',
    highlight: 'Your baby’s heart is now beating at 100–160 bpm, and the neural tube is closing.',
    fetalDevelopment: 'The primitive heart tube is actively contracting. Optic vesicles (early eyes) and limb buds begin forming.',
    maternalBodyChanges: 'Morning sickness and elevated human chorionic gonadotropin (hCG) levels may cause fatigue and breast tenderness.',
    nutritionTip: 'Continue taking 400–800 mcg of daily Folic Acid to support neural tube development.',
    recommendedClinicService: 'First Trimester Dating & Viability TVS',
    recommendedServiceType: 'Ultrasound',
    scanRecommendation: 'Transvaginal Ultrasound (TVS) confirms intrauterine pregnancy and cardiac activity.',
    warningSigns: ['Unilateral sharp pelvic pain', 'Vaginal spotting or heavy bleeding', 'Severe dizziness'],
    reviewedBy: 'Dr. Bernice D. Paule, MD, FPOGS, FPSUOG',
  },
  {
    week: 8,
    trimester: 1,
    babySizeComparison: 'Raspberry (1.6 cm)',
    babyLengthCm: '1.6 cm',
    babyWeightG: '1 g',
    title: 'Organogenesis & First Clinical Check-up Milestone',
    highlight: 'Facial features, tiny fingers, and respiratory airways are beginning to branch out.',
    fetalDevelopment: 'Webbed fingers and toes develop. The brain is rapidly expanding into distinct cerebral hemispheres.',
    maternalBodyChanges: 'Heightened sense of smell and mild food aversions are common due to surging progesterone.',
    nutritionTip: 'Eat small, frequent protein-rich meals and ginger tea to alleviate first-trimester nausea.',
    recommendedClinicService: 'Comprehensive First Prenatal OB-GYNE Consult',
    recommendedServiceType: 'Check-Up',
    scanRecommendation: 'Initial prenatal baseline labs (CBC, blood type, urinalysis, OGTT screening).',
    warningSigns: ['Inability to retain fluids for >24 hours (Hyperemesis Gravidarum)', 'High fever above 38.5°C'],
    reviewedBy: 'Dr. Bernice D. Paule, MD, FPOGS, FPSUOG',
  },
  {
    week: 12,
    trimester: 1,
    babySizeComparison: 'Plum (5.4 cm)',
    babyLengthCm: '5.4 cm',
    babyWeightG: '14 g',
    title: 'First Trimester Completion & Reflex Genesis',
    highlight: 'All major organ systems have formed; baby begins moving arms, curling toes, and practicing swallowing.',
    fetalDevelopment: 'Vocal cords, fingernails, and kidney filtration are actively functioning. Reflexes are emerging.',
    maternalBodyChanges: 'Morning sickness often begins to taper off as the placenta takes over hormone synthesis.',
    nutritionTip: 'Focus on calcium-rich foods (yogurt, fortified milk, dark leafy greens) for developing skeletal bones.',
    recommendedClinicService: 'Nuchal Translucency (NT) First Trimester Screen',
    recommendedServiceType: 'Ultrasound',
    scanRecommendation: 'First-trimester sonogram screening to assess nuchal fold thickness and nasal bone visibility.',
    warningSigns: ['Bright red bleeding with cramps', 'Severe abdominal pressure'],
    reviewedBy: 'Dr. Bernice D. Paule, MD, FPOGS, FPSUOG',
  },
  {
    week: 16,
    trimester: 2,
    babySizeComparison: 'Avocado (11.6 cm)',
    babyLengthCm: '11.6 cm',
    babyWeightG: '100 g',
    title: 'Facial Expressions & Golden Second Trimester',
    highlight: 'Baby can perceive light, make sucking motions, and react to external maternal sounds.',
    fetalDevelopment: 'Fine lanugo hair covers the skin to retain vernix caseosa. Tiny bones inside the middle ear begin hardening.',
    maternalBodyChanges: 'Energy rebound occurs! Mild ligament stretching (round ligament pain) may be felt on the lower abdomen.',
    nutritionTip: 'Increase dietary Iron and Vitamin C pairing (e.g. citrus + lean meats) to support expanding blood volume.',
    recommendedClinicService: 'Second Trimester Routine Prenatal Check',
    recommendedServiceType: 'Check-Up',
    scanRecommendation: 'Fetal doppler heart tone monitoring during clinic consultation.',
    warningSigns: ['Sudden gush of fluid', 'Unilateral leg swelling or severe calf pain'],
    reviewedBy: 'Dr. Bernice D. Paule, MD, FPOGS, FPSUOG',
  },
  {
    week: 20,
    trimester: 2,
    babySizeComparison: 'Banana (25.6 cm)',
    babyLengthCm: '25.6 cm',
    babyWeightG: '300 g',
    title: 'The Halfway Mark & Congenital Anomaly Scan (CAS)',
    highlight: 'You may now feel definitive fetal flutters ("quickening"). Baby sleeps and wakes in regular cycles.',
    fetalDevelopment: 'Myelination of spinal nerves is underway. Vernix protects the delicate skin from amniotic fluid exposure.',
    maternalBodyChanges: 'Uterine fundus reaches the level of your navel. Mild back aches may occur as your center of gravity shifts.',
    nutritionTip: 'Incorporate Omega-3 DHA (200–300 mg daily) to support fetal brain and retinal development.',
    recommendedClinicService: 'Congenital Anomaly Scan (CAS / Level II Ultrasound)',
    recommendedServiceType: 'Ultrasound',
    scanRecommendation: 'Crucial detailed anatomic survey evaluating the brain, heart 4-chamber view, spine, kidneys, and limbs.',
    warningSigns: ['Lack of fetal movements after previously feeling regular flutters', 'Persistent headaches'],
    reviewedBy: 'Dr. Bernice D. Paule, MD, FPOGS, FPSUOG',
  },
  {
    week: 24,
    trimester: 2,
    babySizeComparison: 'Ear of Corn (30 cm)',
    babyLengthCm: '30.0 cm',
    babyWeightG: '600 g',
    title: 'Lung Branching & Gestational Diabetes Screening',
    highlight: 'Lungs begin producing surfactant, a crucial lipoprotein required for post-birth alveolar expansion.',
    fetalDevelopment: 'Inner ear vestibular apparatus is mature; baby can orient their position in space inside the amniotic sac.',
    maternalBodyChanges: 'Physiological blood volume has increased by 40%. Glucose tolerance test (OGTT) is recommended.',
    nutritionTip: 'Choose complex low-glycemic carbohydrates (oats, brown rice, legumes) to maintain steady blood glucose.',
    recommendedClinicService: '75g Oral Glucose Tolerance Test (OGTT)',
    recommendedServiceType: 'Check-Up',
    scanRecommendation: 'Routine maternal blood pressure and urine protein dipstick checks at Balibago clinic.',
    warningSigns: ['Excessive sudden swelling in hands and face', 'Visual disturbances or light flashes'],
    reviewedBy: 'Dr. Bernice D. Paule, MD, FPOGS, FPSUOG',
  },
  {
    week: 28,
    trimester: 3,
    babySizeComparison: 'Eggplant (37.6 cm)',
    babyLengthCm: '37.6 cm',
    babyWeightG: '1,000 g',
    title: 'Entering the Third Trimester & 3D/4D Sonogram Window',
    highlight: 'Baby’s eyes open and blink; brain wave patterns show distinct REM (rapid eye movement) dream states.',
    fetalDevelopment: 'Body fat increases rapidly to prepare for thermoregulation outside the womb.',
    maternalBodyChanges: 'Shortness of breath may occur as the enlarged uterus pushes upward against the diaphragm.',
    nutritionTip: 'Ensure adequate hydration (2.5–3 liters daily) to maintain optimal amniotic fluid index (AFI).',
    recommendedClinicService: '3D/4D High-Definition Ultrasound',
    recommendedServiceType: 'Ultrasound',
    scanRecommendation: 'Optimal gestational window (28–32 weeks) for clear 3D/4D facial imaging and placental localization.',
    warningSigns: ['Fewer than 10 fetal kicks in 2 hours during active observation', 'Premature regular contractions'],
    reviewedBy: 'Dr. Bernice D. Paule, MD, FPOGS, FPSUOG',
  },
  {
    week: 32,
    trimester: 3,
    babySizeComparison: 'Pineapple (42.4 cm)',
    babyLengthCm: '42.4 cm',
    babyWeightG: '1,700 g',
    title: 'Bone Mineralization & Fetal Movement Tracking',
    highlight: 'Baby is practicing breathing movements by inhaling and exhaling amniotic fluid into developing lungs.',
    fetalDevelopment: 'All five senses are functional. Toenails and fingernails are fully formed.',
    maternalBodyChanges: 'Braxton Hicks practice contractions may increase. Heartburn may occur as stomach capacity decreases.',
    nutritionTip: 'Eat smaller meals and avoid lying down immediately after eating to prevent acid reflux.',
    recommendedClinicService: 'Third Trimester Biophysical Profile (BPS)',
    recommendedServiceType: 'Ultrasound',
    scanRecommendation: 'Evaluates fetal tone, gross movement, breathing motion, and amniotic fluid pockets.',
    warningSigns: ['Persistent epigastric pain under right ribcage', 'Decreased fetal kick counts'],
    reviewedBy: 'Dr. Bernice D. Paule, MD, FPOGS, FPSUOG',
  },
  {
    week: 36,
    trimester: 3,
    babySizeComparison: 'Papaya (47.4 cm)',
    babyLengthCm: '47.4 cm',
    babyWeightG: '2,600 g',
    title: 'Cephalic Engagement & Birth Preparedness',
    highlight: 'Baby often turns head-down (vertex position) and settles into the maternal pelvic inlet.',
    fetalDevelopment: 'Immune antibodies are transferred through maternal blood to provide initial newborn protection.',
    maternalBodyChanges: '"Lightening" occurs as baby drops lower, easing diaphragmatic pressure but increasing pelvic pressure.',
    nutritionTip: 'Keep easily digestible, nutritious snacks ready for hospital labor bag preparation.',
    recommendedClinicService: 'Pre-Labor Assessment & Group B Strep (GBS) Screening',
    recommendedServiceType: 'Check-Up',
    scanRecommendation: 'Presentation and estimated fetal weight (EFW) ultrasound to evaluate delivery readiness.',
    warningSigns: ['Continuous leaking or rupture of amniotic membranes', 'Regular contractions every 5 mins'],
    reviewedBy: 'Dr. Bernice D. Paule, MD, FPOGS, FPSUOG',
  },
  {
    week: 40,
    trimester: 3,
    babySizeComparison: 'Watermelon (51.2 cm)',
    babyLengthCm: '51.2 cm',
    babyWeightG: '3,400 g',
    title: 'Full Term Milestone & Labor Onset Awareness',
    highlight: 'Your baby is fully prepared for birth. Vernix caseosa is mostly shed, revealing smooth newborn skin.',
    fetalDevelopment: 'Skull bones remain soft and separated by fontanelles to allow safe passage through the birth canal.',
    maternalBodyChanges: 'Cervical softening (effacement) and early dilation may begin.',
    nutritionTip: 'Stay hydrated with electrolyte-balanced fluids and rest between early labor surges.',
    recommendedClinicService: 'Term Biophysical Assessment & Non-Stress Test (NST)',
    recommendedServiceType: 'Ultrasound',
    scanRecommendation: 'AFI and Doppler umbilical artery resistance index evaluation to verify fetal wellbeing.',
    warningSigns: ['Green or brown stained amniotic fluid (meconium)', 'Heavy vaginal bleeding', 'Loss of fetal movement'],
    reviewedBy: 'Dr. Bernice D. Paule, MD, FPOGS, FPSUOG',
  },
];

/**
 * Returns a weekly tip based on the current calendar week of the year
 * or falls back to a default selected week.
 */
export function getTipForCurrentCalendarWeek(): PregnancyTip {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const currentWeekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

  // Map calendar week (1..52) to our tip catalog index
  const tipIndex = currentWeekNumber % PREGNANCY_WEEKLY_TIPS.length;
  return PREGNANCY_WEEKLY_TIPS[tipIndex];
}
