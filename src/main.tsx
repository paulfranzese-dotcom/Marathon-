import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Activity, Brain, Calendar, Dumbbell, Flame, Gauge, Trophy, User } from 'lucide-react';
import './styles.css';

type DayType = 'rest' | 'easy' | 'long' | 'speed' | 'lift';
type NutritionGoal = 'lose weight' | 'maintain' | 'gain muscle' | 'performance fuel';

const user = { name: 'Alex Parker', weight: 172, goalWeight: 165, marathonDate: '2026-10-04', nutritionGoal: 'performance fuel' as NutritionGoal };
const week = [
  { day: 'Mon', run: 'Easy 5 mi', lift: 'Upper Body', nutrition: 'Moderate carbs', type: 'easy' as DayType, key: false },
  { day: 'Tue', run: 'Intervals 6x800m', lift: 'Mobility + Core', nutrition: 'High carbs', type: 'speed' as DayType, key: true },
  { day: 'Wed', run: 'Recovery 4 mi', lift: 'Full Body Light', nutrition: 'Moderate carbs', type: 'lift' as DayType, key: false },
  { day: 'Thu', run: 'Tempo 7 mi', lift: 'Rest', nutrition: 'High carbs', type: 'speed' as DayType, key: true },
  { day: 'Fri', run: 'Rest', lift: 'Lower Body Heavy', nutrition: 'Lower carbs', type: 'rest' as DayType, key: false },
  { day: 'Sat', run: 'Easy 4 mi', lift: 'Mobility', nutrition: 'Moderate carbs', type: 'easy' as DayType, key: false },
  { day: 'Sun', run: 'Long Run 14 mi', lift: 'Rest', nutrition: 'High carbs + hydration', type: 'long' as DayType, key: true },
];
const today = week[1];

function nutritionTarget(day: DayType) {
  const protein = Math.round(user.weight * 0.9);
  const carbs = day === 'long' || day === 'speed' ? 320 : day === 'lift' ? 250 : day === 'rest' ? 170 : 220;
  const fat = day === 'rest' ? 75 : 65;
  const base = 15 * user.weight;
  const adjust = user.nutritionGoal === 'lose weight' ? -250 : user.nutritionGoal === 'gain muscle' ? 200 : user.nutritionGoal === 'performance fuel' ? 150 : 0;
  return { calories: base + adjust, protein, carbs, fat };
}
const macros = nutritionTarget(today.type);

function coachReply(input: string) {
  const text = input.toLowerCase();
  if (text.includes('sore')) return 'If soreness is moderate, switch to upper body + mobility and keep run easy. If sharp pain, rest and assess.';
  if (text.includes('missed')) return 'No panic—shift the missed workout to tomorrow and reduce intensity by 10% to protect recovery.';
  if (text.includes('eat')) return 'Post-run: 30-40g protein + high-glycemic carbs within 60 minutes. Add fluids with sodium.';
  if (text.includes('race')) return 'Move heavy lifting 48 hours away from race day. Prioritize strides, sleep, and carb-focused meals.';
  return 'Great question. Prioritize key run quality, keep lifting supportive, and adjust load based on recovery signals.';
}

function App() {
  const [screen, setScreen] = React.useState<'onboard' | 'dashboard' | 'calendar' | 'nutrition' | 'coach' | 'progress' | 'profile'>('onboard');
  const [question, setQuestion] = React.useState('Should I lift today if my legs are sore?');

  if (screen === 'onboard') return <Onboarding onDone={() => setScreen('dashboard')} />;

  return <div className="min-h-screen text-slate-100 bg-slate-950 max-w-md mx-auto pb-20 px-4 pt-5 space-y-4">
    <header className="flex justify-between items-center"><div><p className="text-xs text-slate-400">Hybrid Runner</p><h1 className="text-2xl font-bold">Hey, {user.name.split(' ')[0]}</h1></div><span className="badge">Week 6/18</span></header>
    {screen === 'dashboard' && <>
      <Card title="Today"><p>{today.run}</p><p>{today.lift}</p><p>{macros.calories} kcal • P{macros.protein}/C{macros.carbs}/F{macros.fat}</p></Card>
      <div className="grid grid-cols-2 gap-3"><Stat label="Weekly mileage" value="24 / 36 mi" /><Stat label="Strength" value="2 / 3" /><Stat label="Recovery" value="79" /><Stat label="Next key" value="Tempo Thu" /></div>
      <Card title="Coach">You are stacking strong consistency. Keep easy days easy to crush Thursday tempo.</Card>
      <Card title="18-week structure"><p>Base (wks 1-6) → Build (7-12) with deload every 4th week → Peak (13-15) → Taper (16-18).</p><p>Long run progression: 8 → 10 → 12 → 9(deload) → ... → 20 peak.</p><p>Strength: 2-3 sessions/wk, heavy legs away from intervals/long run, progressive overload + substitutions.</p></Card>
    </>}
    {screen === 'calendar' && <Card title="Weekly Calendar">{week.map(d => <button key={d.day} className="w-full text-left p-3 mt-2 rounded-xl bg-slate-800/80"><div className="flex justify-between"><b>{d.day}</b>{d.key && <span className="badge">Key</span>}</div><p>{d.run} • {d.lift}</p><p className="text-cyan-300 text-sm">{d.nutrition}</p></button>)}</Card>}
    {screen === 'nutrition' && <Card title="Nutrition Assistant"><p>{macros.calories} kcal | Protein {macros.protein}g | Carbs {macros.carbs}g | Fat {macros.fat}g</p><ul className="list-disc ml-5 text-sm"><li>Pre: banana + toast + whey.</li><li>Post: rice bowl + lean protein.</li><li>Dinner: salmon, potatoes, greens.</li><li>Hydration: 500ml pre, 150-250ml every 20 min during long/speed.</li></ul><p className="text-xs text-slate-400 mt-2">Rules: protein 0.7–1.0 g/lb, carbs scale by workout load, calories adjusted by goal.</p></Card>}
    {screen === 'coach' && <Card title="AI Coach"><textarea value={question} onChange={e=>setQuestion(e.target.value)} className="w-full h-24 input" /><p className="mt-2 text-cyan-200">{coachReply(question)}</p><p className="text-xs text-slate-400 mt-2">Local mock logic for now. Swap `coachReply` with OpenAI API call later.</p></Card>}
    {screen === 'progress' && <><Card title="Progress"><p>Mileage trend: 18 → 21 → 24 → 20 (deload) → 26 mi</p><p>Long run trend: 8 → 10 → 12 → 9 → 14 mi</p><p>Completed workouts: 41</p><p>Streak: 16 days</p><div className="flex gap-2 mt-2"><span className="badge">Consistency</span><span className="badge">Long Run Hero</span></div></Card></>}
    {screen === 'profile' && <Card title="Edit Preferences"><p>Goal weight: {user.goalWeight} lb</p><p>Marathon: {user.marathonDate}</p><p>Diet: Omnivore, dislikes mushrooms</p><p>Lift days: Mon/Wed/Fri • Run days: Mon/Tue/Wed/Thu/Sat/Sun</p></Card>}

    <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-slate-900/95 border-t border-slate-800 grid grid-cols-6 p-2 text-xs">{[
      ['dashboard', <Gauge size={16}/>], ['calendar', <Calendar size={16}/>], ['nutrition', <Flame size={16}/>], ['coach', <Brain size={16}/>], ['progress', <Trophy size={16}/>], ['profile', <User size={16}/>]
    ].map(([k,icon]) => <button key={k} className={`nav ${screen===k?'text-cyan-300':''}`} onClick={()=>setScreen(k as any)}>{icon}{k}</button>)}</nav>
    <p className="text-[11px] text-slate-500 pt-2">General guidance only; not medical advice. Consult qualified professionals for injuries, medical conditions, or major diet changes.</p>
  </div>
}

function Onboarding({ onDone }:{ onDone: ()=>void }) {
  const fields = ['Name','Age','Sex','Height','Weight','Goal weight','Marathon date','Current weekly mileage','Target weekly mileage','Marathon goal time','Running experience','Weightlifting experience','Available lifting days','Available running days','Injury history','Dietary preferences','Foods disliked','Nutrition goal'];
  return <div className="min-h-screen bg-slate-950 text-slate-100 max-w-md mx-auto p-5"><h1 className="text-3xl font-bold">Hybrid Runner</h1><p className="text-slate-400 mb-4">Build your coordinated run + strength + nutrition plan.</p>{fields.map(f=><input key={f} className="input" placeholder={f} />)}<motion.button whileTap={{scale:.98}} className="btn" onClick={onDone}>Create My Plan</motion.button></div>
}
function Card({ title, children }:{ title:string, children: React.ReactNode }){ return <section className="card"><h2 className="font-semibold mb-2">{title}</h2>{children}</section>}
function Stat({label,value}:{label:string,value:string}){ return <div className="card"><p className="text-xs text-slate-400">{label}</p><p className="text-lg font-bold">{value}</p></div>}

createRoot(document.getElementById('root')!).render(<App />);
