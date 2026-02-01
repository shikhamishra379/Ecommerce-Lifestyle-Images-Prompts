
import React, { useState } from 'react';
import { PromptBlueprint } from '../types';

interface PromptCardProps {
  blueprint: PromptBlueprint;
}

// Fixed: Moved Section component outside and used React.FC to properly handle 'key' and other props
const Section: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="mb-4">
    <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400/80 block mb-1">
      {title}
    </span>
    <p className="text-sm text-slate-300 leading-relaxed font-light">{content}</p>
  </div>
);

export const PromptCard: React.FC<PromptCardProps> = ({ blueprint }) => {
  const [copied, setCopied] = useState(false);

  // Map fields to the descriptive labels from the user's example style
  const sections = [
    { title: "Scene & Environment", content: blueprint.scene },
    { title: "Placement & Interaction", content: blueprint.placement },
    { title: "Supporting Props", content: blueprint.supportingProps },
    { title: "Product Rules (@img1)", content: blueprint.dynamicElements }, // We used dynamicElements to store Rules in the schema mapping
    { title: "Lighting Geometry", content: blueprint.lighting },
    { title: "Camera & Composition", content: blueprint.camera },
    { title: "Style & Color Grading", content: blueprint.color },
    { title: "Technical Specs", content: blueprint.techSpecs },
    { title: "Quality Metrics", content: blueprint.quality },
  ];

  const fullPrompt = `${blueprint.header}. ${blueprint.scene}. ${blueprint.placement}. Props: ${blueprint.supportingProps}. Rules: ${blueprint.dynamicElements}. Lighting: ${blueprint.lighting}. Camera: ${blueprint.camera}. Style: ${blueprint.color}. Tech: ${blueprint.techSpecs}, ${blueprint.quality}. Negative: ${blueprint.negativePrompts}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-7 flex flex-col relative group overflow-hidden h-[600px]">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button 
          onClick={handleCopy}
          className="p-2 glass rounded-lg hover:bg-white/20 transition-colors"
          title="Copy full blueprint"
        >
          {copied ? (
             <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[9px] uppercase font-black tracking-[0.2em] border border-indigo-500/20">
          {blueprint.scenarioType}
        </span>
      </div>

      <h3 className="text-2xl font-bold mb-6 text-white leading-tight serif pr-10">
        {blueprint.header}
      </h3>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-3">
        {sections.map((sec, i) => (
          <Section key={i} title={sec.title} content={sec.content} />
        ))}
        
        <div className="mt-2 pt-4 border-t border-white/5">
          <span className="text-[10px] uppercase tracking-widest font-bold text-red-400/60 block mb-1">
            Exclude (Negative)
          </span>
          <p className="text-[11px] text-slate-500 leading-tight italic">{blueprint.negativePrompts}</p>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center">
         <div className="flex flex-col">
           <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Photography Standard</span>
           <span className="text-[10px] text-indigo-300/80 font-medium tracking-widest">PHOTOREAL • 8K • RAW</span>
         </div>
         <button 
           onClick={handleCopy}
           className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
         >
           {copied ? "COPIED" : "COPY PROMPT"}
         </button>
      </div>
    </div>
  );
};
