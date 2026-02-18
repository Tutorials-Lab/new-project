
import React from 'react';
import { Idea } from '../types';

interface IdeaCardProps {
  idea: Idea;
  onDelete: (id: string) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {idea.imageUrl && (
        <div className="relative h-56 w-full overflow-hidden">
          <img 
            src={idea.imageUrl} 
            alt={idea.expandedTitle} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{idea.expandedTitle}</h3>
          <button 
            onClick={() => onDelete(idea.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 leading-relaxed italic">"{idea.originalText}"</p>
        
        <div className="space-y-4">
          {idea.sections.map((section, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="text-sm font-semibold text-indigo-700 uppercase tracking-wider mb-2">{section.title}</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Created {new Date(idea.createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-2">
            <button className="text-indigo-600 text-xs font-semibold hover:underline">Share</button>
            <button className="text-indigo-600 text-xs font-semibold hover:underline">Copy Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
};
