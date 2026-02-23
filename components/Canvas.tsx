import React, { useRef, useState } from 'react';
import { CanvasElement, ElementType } from '../types';
import { GRID_SIZE } from '../constants';

interface CanvasProps {
  elements: CanvasElement[];
  onAddElement: (type: ElementType, x: number, y: number) => void;
  onSelectElement: (id: string | null) => void;
  selectedId: string | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onElementClick?: (element: CanvasElement) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  elements,
  onAddElement,
  onSelectElement,
  selectedId,
  onUpdateElement,
  onElementClick
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Drop Handler for new items
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const type = e.dataTransfer.getData('application/react-dnd-type') as ElementType;
    if (!type) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scrollLeft = canvasRef.current.scrollLeft;
    const scrollTop = canvasRef.current.scrollTop;

    const x = Math.floor((e.clientX - rect.left + scrollLeft) / GRID_SIZE) * GRID_SIZE;
    const y = Math.floor((e.clientY - rect.top + scrollTop) / GRID_SIZE) * GRID_SIZE;

    onAddElement(type, x, y);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleElementMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    onSelectElement(element.id);
    setDraggingId(element.id);
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scrollLeft = canvasRef.current.scrollLeft;
    const scrollTop = canvasRef.current.scrollTop;
    
    let newX = e.clientX - rect.left + scrollLeft - offset.x;
    let newY = e.clientY - rect.top + scrollTop - offset.y;

    newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
    newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

    newX = Math.max(0, newX);
    newY = Math.max(0, newY);

    onUpdateElement(draggingId, { x: newX, y: newY });
  };

  const handleCanvasMouseUp = () => {
    setDraggingId(null);
  };

  // Helper to render Table Content
  const renderTable = (content: string) => {
    try {
      const data = JSON.parse(content);
      if (!Array.isArray(data) || data.length === 0) return <div className="p-4 text-slate-400">Invalid Table Data</div>;
      
      const keys = Object.keys(data[0]);
      
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex bg-[#fafafc] border-b border-[#efeff5] px-4 py-2">
             {keys.map(k => (
               <div key={k} className="flex-1 font-medium text-black text-sm">{k}</div>
             ))}
          </div>
          <div className="flex-1 overflow-hidden">
             {data.map((row, idx) => (
               <div key={idx} className="flex px-4 py-2 border-b border-[#efeff5] hover:bg-[#f3f3f5] transition-colors">
                  {keys.map(k => (
                    <div key={k} className="flex-1 text-black text-sm">{row[k]}</div>
                  ))}
               </div>
             ))}
          </div>
        </div>
      );
    } catch (e) {
      return <div className="p-4 flex items-center justify-center h-full bg-[#fafafc] text-slate-400 text-sm">Table Data must be JSON Array</div>;
    }
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative bg-white overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseDown={() => onSelectElement(null)}
      style={{
        // Naive UI style grid dots
        backgroundImage: 'radial-gradient(#e0e0e6 1px, transparent 1px)',
        backgroundSize: `${GRID_SIZE * 2}px ${GRID_SIZE * 2}px`,
      }}
    >
      <div style={{ minWidth: '1200px', minHeight: '1400px', position: 'relative' }}>
        {elements.map((el) => {
          const isSelected = selectedId === el.id;
          
          return (
            <div
              key={el.id}
              onMouseDown={(e) => handleElementMouseDown(e, el)}
              onClick={() => onElementClick?.(el)}
              style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                zIndex: isSelected ? 10 : 1,
                ...el.style,
              }}
              className={`
                group cursor-move 
                ${isSelected ? 'ring-2 ring-[#18a058] ring-offset-2' : ''}
              `}
            >
              {/* Specialized Rendering for Naive UI feel */}
              {el.type === ElementType.BUTTON ? (
                <div 
                  className={`w-full h-full flex items-center justify-center rounded-[3px] transition-all duration-300
                    ${el.style.backgroundColor === '#18a058' 
                      ? 'hover:bg-[#36ad6a] text-white shadow-sm' 
                      : 'hover:text-[#18a058] hover:border-[#18a058] bg-white text-black border border-[#e0e0e6]'}
                  `}
                  style={{
                    // Override inline styles for specific CSS interactive states that we can't do in inline style
                    backgroundColor: el.style.backgroundColor,
                    color: el.style.color,
                    borderColor: el.style.borderColor || (typeof el.style.border === 'string' ? el.style.border.split(' ')[2] : undefined),
                  }}
                >
                  {el.content}
                </div>
              ) : el.type === ElementType.INPUT ? (
                <div 
                  className={`w-full h-full flex items-center px-3 bg-white border border-[#e0e0e6] rounded-[3px] text-black transition-all duration-300 hover:border-[#18a058] ${el.style.textAlign === 'right' ? 'justify-end' : ''}`}
                  style={{
                    // Mocking focus state visually if selected
                    borderColor: isSelected ? '#18a058' : '#e0e0e6',
                    boxShadow: isSelected ? '0 0 0 2px rgba(24, 160, 88, 0.2)' : 'none'
                  }}
                >
                  {el.content}
                </div>
              ) : el.type === ElementType.TABLE ? (
                 renderTable(el.content)
              ) : el.type === ElementType.IMAGE ? (
                <img 
                  src={el.content} 
                  alt="Prototype" 
                  className="w-full h-full object-cover pointer-events-none" 
                  style={{ borderRadius: el.style.borderRadius }}
                />
              ) : (
                <div className="w-full h-full flex items-center pointer-events-none" style={{ justifyContent: el.style.justifyContent || 'center' }}>
                  {el.content}
                </div>
              )}

              {/* Selection Indicators */}
              {isSelected && (
                <>
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#18a058] rounded-full shadow-sm" />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#18a058] rounded-full shadow-sm" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#18a058] rounded-full shadow-sm" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#18a058] rounded-full shadow-sm" />
                  
                  <div className="absolute -top-8 left-0 bg-[#18a058] text-white text-[10px] px-2 py-1 rounded-[3px] shadow-sm font-mono">
                    {el.width} × {el.height}
                    <div className="absolute bottom-[-4px] left-2 w-2 h-2 bg-[#18a058] rotate-45 transform"></div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};