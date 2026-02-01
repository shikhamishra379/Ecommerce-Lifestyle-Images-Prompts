import React, { useState, useRef } from 'react';
import { GenerationResult } from './types';
import { CATEGORIES, getFallbackBlueprints } from './constants';
import { generateProfessionalPrompts } from './geminiService';
import { PromptCard } from './components/PromptCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';

const App: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setProductName('');
    setCategory(CATEGORIES[0]);
    setImage(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!productName.trim()) {
      setError("Please enter a product name.");
      return;
    }

    setError(null);
    setIsGenerating(true);
    setResults(null);

    try {
      const response = await generateProfessionalPrompts({
        name: productName,
        category: category,
        image: image || undefined
      });
      setResults(response);
    } catch (err: any) {
      console.error("Generation error:", err);
      const fallbacks = getFallbackBlueprints(productName, category);
      setResults({
        blueprints: fallbacks,
        analysis: "API simulation active. Using deterministic fallback engine for prompt generation."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-16 max-w-2xl w-full">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight gradient-text">
          PromptEngine Pro
        </h1>
        <p className="text-slate-400 text-lg font-light serif italic">
          High-fidelity commercial photography blueprints for the AI era.
        </p>
      </header>

      <div className="w-full max-w-4xl glass rounded-3xl p-8 mb-12 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Product Name</label>
              <input 
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Obsidian Noir Wristwatch"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Market Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors text-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Visual Reference (Optional)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`flex-grow border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-all overflow-hidden relative group min-h-[140px] ${image ? 'p-0' : 'p-6'}`}
            >
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              {image ? (
                <>
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-sm font-medium">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-slate-500 text-sm">Upload Reference</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4 relative">
          {error && <p className="text-red-400 text-sm w-full text-center md:absolute md:-top-8">{error}</p>}
          
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full md:w-auto px-12 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isGenerating ? "Analyzing & Engineering..." : "Engineer Blueprints"}
          </button>

          <button 
            onClick={handleReset}
            disabled={isGenerating}
            className="w-full md:w-auto px-8 py-4 rounded-full glass text-slate-300 font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
          >
            <svg className={`w-5 h-5 transition-transform duration-500 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl">
        {results?.analysis && (
          <div className="mb-8 glass p-6 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-1">Visual Intelligence Report</h4>
              <p className="text-sm text-slate-300 italic serif">{results.analysis}</p>
            </div>
          </div>
        )}

        {isGenerating ? (
          <LoadingSkeleton />
        ) : results ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.blueprints.map((blueprint, idx) => (
              <PromptCard key={idx} blueprint={blueprint} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-600 italic serif text-xl">Enter product details to begin generation.</p>
          </div>
        )}
      </div>

      <footer className="mt-20 py-8 text-slate-600 text-xs tracking-widest uppercase">
        &copy; {new Date().getFullYear()} PromptEngine Pro • Powered by Gemini 3 Pro
      </footer>
    </div>
  );
};

export default App;