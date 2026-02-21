export interface FestivalTheme {
  id: string;
  name: string;
  backgroundClass: string; // Tailwind classes for the background
  overlayClass?: string; // Optional overlay (e.g., patterns)
  textClass?: string; // Optional text color override
}

export const FESTIVAL_THEMES: Record<string, FestivalTheme> = {
  default: {
    id: 'default',
    name: 'Classic',
    backgroundClass: 'bg-slate-50 dark:bg-slate-950',
    overlayClass: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white dark:from-slate-800 dark:via-slate-950 dark:to-black opacity-80',
  },
  holi: {
    id: 'holi',
    name: 'Holi (Vibrant)',
    backgroundClass: 'bg-white dark:bg-slate-900',
    // Multi-color radial splashes to simulate colors
    overlayClass: 'bg-[radial-gradient(circle_at_20%_30%,_rgba(236,72,153,0.15),_transparent_25%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.15),_transparent_25%),radial-gradient(circle_at_40%_80%,_rgba(234,179,8,0.15),_transparent_25%),radial-gradient(circle_at_90%_90%,_rgba(34,197,94,0.15),_transparent_25%)]',
  },
  diwali: {
    id: 'diwali',
    name: 'Diwali (Gold)',
    backgroundClass: 'bg-slate-900',
    // Deep red/maroon base with a golden glow from the bottom
    overlayClass: 'bg-[conic-gradient(at_bottom,_var(--tw-gradient-stops))] from-amber-900 via-red-950 to-slate-950 dark:from-amber-700/30 dark:via-red-900/40 dark:to-black',
  },
  navratri: {
    id: 'navratri',
    name: 'Navratri (Festive)',
    backgroundClass: 'bg-indigo-50 dark:bg-indigo-950',
    // Energetic purple/orange mix
    overlayClass: 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-300/40 via-purple-300/40 to-indigo-300/40 dark:from-orange-500/20 dark:via-purple-500/20 dark:to-indigo-900',
  },
  independence: {
    id: 'independence',
    name: 'Tricolor (Patriotic)',
    backgroundClass: 'bg-white dark:bg-slate-900',
    // Subtle tricolor wash: Saffron top-left, Green bottom-right
    overlayClass: 'bg-[linear-gradient(135deg,_rgba(249,115,22,0.1)_0%,_rgba(255,255,255,0)_45%,_rgba(255,255,255,0)_55%,_rgba(22,163,74,0.1)_100%)] dark:bg-[linear-gradient(135deg,_rgba(249,115,22,0.15)_0%,_rgba(15,23,42,0)_45%,_rgba(15,23,42,0)_55%,_rgba(22,163,74,0.15)_100%)]',
  },
  rakhi: {
    id: 'rakhi',
    name: 'Raksha Bandhan',
    backgroundClass: 'bg-rose-50 dark:bg-rose-950',
    // Soft, elegant pinks and golds
    overlayClass: 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-100 via-pink-50 to-white dark:from-rose-900/40 dark:via-pink-950/40 dark:to-black',
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas',
    backgroundClass: 'bg-slate-50 dark:bg-slate-900',
    // Red and Green corners with a "snowy" center
    overlayClass: 'bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.1),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(22,163,74,0.1),_transparent_40%)]',
  },
  royal: {
    id: 'royal',
    name: 'Royal Blue',
    backgroundClass: 'bg-slate-900',
    overlayClass: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black',
  }
};

export const getAutoFestivalTheme = (): string => {
  const date = new Date();
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  // Simple fixed date logic for major festivals (Approximate for demo purposes if exact lunar calc is too complex)
  
  // Republic Day: Jan 26
  if (month === 0 && day === 26) return 'independence'; // Reuse tricolor
  
  // Holi: March (Approx)
  if (month === 2 && day <= 10) return 'holi';

  // Raksha Bandhan: August (Approx)
  if (month === 7 && day >= 1 && day <= 20) return 'rakhi';

  // Independence Day: Aug 15
  if (month === 7 && day === 15) return 'independence';

  // Navratri/Dussehra: Oct (Approx)
  if (month === 9) return 'navratri';

  // Diwali: Nov (Approx)
  if (month === 10) return 'diwali';

  // Christmas: Dec 25
  if (month === 11 && day >= 20 && day <= 30) return 'christmas';

  return 'default';
};
