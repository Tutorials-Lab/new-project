
import React, { useState, useCallback, useEffect } from 'react';
import { Idea } from './types';
import { expandIdea, generateImageForIdea } from './services/geminiService';
import { IdeaCard } from './components/IdeaCard';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isExpanding, setIsExpanding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('sparkmind_ideas');
    if (saved) {
      try {
        setIdeas(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved ideas");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('sparkmind_ideas', JSON.stringify(ideas));
  }, [ideas]);

  const handleExpand = async () => {
    if (!inputValue.trim()) return;

    setIsExpanding(true);
    setStatusMessage("Architecting your idea...");

    try {
      const expansion = await expandIdea(inputValue);
      setStatusMessage("Generating visual representation...");
      
      let imageUrl = undefined;
      if ((expansion as any).imagePrompt) {
        imageUrl = await generateImageForIdea((expansion as any).imagePrompt);
      }

      const newIdea: Idea = {
        id: crypto.randomUUID(),
        originalText: inputValue,
        expandedTitle: expansion.expandedTitle || 'Untitled Vision',
        description: expansion.description || '',
        sections: expansion.sections || [],
        imageUrl,
        createdAt: Date.now()
      };

      setIdeas(prev => [newIdea, ...prev]);
      setInputValue('');
      setStatusMessage(null);
    } catch (err) {
      console.error(err);
      setStatusMessage("Something went wrong. Please try again.");
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsExpanding(false);
    }
  };

  const deleteIdea = useCallback((id: string) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="gradient-bg py-12 px-4 shadow-lg text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">SparkMind AI</h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            Ignite your simple thoughts. Our AI expands your core idea into a structured vision with professional blueprints and vivid visuals.
          </p>
        </div>
      </header>

      {/* Input Section - Sticky */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExpand()}
              placeholder="Enter a simple thought (e.g., 'A cafe for cats', 'A space gardening app')"
              className="flex-1 px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-lg shadow-sm"
              disabled={isExpanding}
            />
            <Button 
              onClick={handleExpand}
              isLoading={isExpanding}
              className="md:w-40 py-4 h-full"
            >
              Ignite
            </Button>
          </div>
          {statusMessage && (
            <p className="text-center mt-3 text-indigo-600 font-medium animate-pulse text-sm">
              {statusMessage}
            </p>
          )}
        </div>
      </div>

      {/* Ideas Grid */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-8">
        {ideas.length === 0 && !isExpanding ? (
          <div className="text-center py-24 opacity-60">
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-gray-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No sparks yet</h2>
            <p className="text-gray-500">Your brilliant blueprints will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map(idea => (
              <IdeaCard key={idea.id} idea={idea} onDelete={deleteIdea} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm">
          Powered by Gemini 3 & Gemini 2.5 Flash
        </p>
      </footer>
    </div>
  );
};

export default App;
