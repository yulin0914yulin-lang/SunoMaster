import React, { useState } from 'react';
import { CanvasElement } from '../types';
import { Wand2, X, AlertCircle, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { generateLayoutFromPrompt } from '../services/geminiService';

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onGenerateLayout: (elements: CanvasElement[]) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onGenerateLayout,
  isGenerating,
  setIsGenerating
}) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleStyleChange = (key: keyof React.CSSProperties, value: string) => {
    if (!selectedElement) return;
    onUpdateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        [key]: value
      }
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const elements = await generateLayoutFromPrompt(prompt);
      onGenerateLayout(elements);
    } catch (err) {
      setError("Failed to generate layout. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 shadow-lg z-10">
      {/* AI Assistant Section */}
      <div className="p-5 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-purple-600" />
          AI Assistant
        </h2>
        <div className="relative">
          <textarea
            className="w-full h-24 p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white placeholder-slate-400"
            placeholder="Describe a UI layout (e.g., 'A login form with email, password inputs and a blue submit button')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="absolute bottom-2 right-2 p-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm"
            title="Generate Layout"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
          </button>
        </div>
        {error && (
          <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </div>
        )}
      </div>

      {/* Properties Section */}
      <div className="flex-1 overflow-y-auto p-5">
        {!selectedElement ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Icons.MousePointerClick size={24} />
            </div>
            <p className="text-sm font-medium">Select an element</p>
            <p className="text-xs mt-1">Click on any component in the canvas to edit its properties.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {selectedElement.type} Properties
              </h3>
              <button 
                onClick={() => onDeleteElement(selectedElement.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                title="Delete Element"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Content Control */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Content</label>
              <input
                type="text"
                value={selectedElement.content}
                onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Geometry Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">X Position</label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => onUpdateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 pl-3 text-sm border border-slate-300 rounded-md"
                  />
                  <span className="absolute right-2 top-2 text-xs text-slate-400">px</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Y Position</label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => onUpdateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 pl-3 text-sm border border-slate-300 rounded-md"
                  />
                  <span className="absolute right-2 top-2 text-xs text-slate-400">px</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Width</label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) => onUpdateElement(selectedElement.id, { width: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 pl-3 text-sm border border-slate-300 rounded-md"
                  />
                  <span className="absolute right-2 top-2 text-xs text-slate-400">px</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Height</label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) => onUpdateElement(selectedElement.id, { height: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 pl-3 text-sm border border-slate-300 rounded-md"
                  />
                  <span className="absolute right-2 top-2 text-xs text-slate-400">px</span>
                </div>
              </div>
            </div>

            {/* Style Controls */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
               <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Appearance</h4>
               
               <div className="space-y-2">
                 <label className="text-xs font-semibold text-slate-500">Background Color</label>
                 <div className="flex gap-2 items-center">
                   <input
                     type="color"
                     value={String(selectedElement.style.backgroundColor || '#ffffff')}
                     onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                     className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5 bg-white"
                   />
                   <input
                     type="text"
                     value={String(selectedElement.style.backgroundColor || '')}
                     onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                     className="flex-1 p-1.5 text-xs border border-slate-300 rounded font-mono text-slate-600"
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-semibold text-slate-500">Text Color</label>
                 <div className="flex gap-2 items-center">
                   <input
                     type="color"
                     value={String(selectedElement.style.color || '#000000')}
                     onChange={(e) => handleStyleChange('color', e.target.value)}
                     className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5 bg-white"
                   />
                    <input
                     type="text"
                     value={String(selectedElement.style.color || '')}
                     onChange={(e) => handleStyleChange('color', e.target.value)}
                     className="flex-1 p-1.5 text-xs border border-slate-300 rounded font-mono text-slate-600"
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-semibold text-slate-500">Corner Radius</label>
                 <input
                   type="range"
                   min="0"
                   max="30"
                   value={parseInt(String(selectedElement.style.borderRadius || '0'))}
                   onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                   className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                 />
                 <div className="flex justify-between text-xs text-slate-400">
                    <span>0px</span>
                    <span>{selectedElement.style.borderRadius || '0px'}</span>
                    <span>30px</span>
                 </div>
               </div>
               
               <div className="space-y-2">
                 <label className="text-xs font-semibold text-slate-500">Font Size</label>
                 <select 
                   value={selectedElement.style.fontSize || '16px'}
                   onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                   className="w-full p-2 text-sm border border-slate-300 rounded-md bg-white"
                 >
                   {[12, 14, 16, 18, 20, 24, 32, 48].map(size => (
                     <option key={size} value={`${size}px`}>{size}px</option>
                   ))}
                 </select>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Fake import to satisfy linter for Icons usage in empty state
import * as Icons from 'lucide-react';
