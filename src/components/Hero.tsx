import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-20 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-200 dark:bg-blue-900/20 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-200 dark:bg-indigo-900/20 blur-3xl opacity-50"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-primary text-sm font-medium mb-6 border border-blue-100 dark:border-slate-700 shadow-sm">
          <Sparkles size={16} />
          <span>Kegiatan Edukasi Interaktif</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Naluri Kids <span className="text-primary">Programme</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed">
          Platform edukasi anak berbasis Montessori yang dirancang untuk merangsang rasa ingin tahu, 
          kemandirian, dan perkembangan kognitif sejak dini.
        </p>
      </div>
    </section>
  );
}
