import React, { useState, useCallback } from 'react';
import { LeftPanel } from './components/LeftPanel';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Canvas } from './components/Canvas';
import { CanvasElement, ElementType } from './types';
import { COMPONENT_REGISTRY } from './constants';
import { BoxSelect, Code, Download, Layers, RotateCcw } from 'lucide-react';

const initialElements: CanvasElement[] = [
  // Header Area
  { id: 'h1', type: ElementType.TEXT, x: 40, y: 30, width: 200, height: 40, content: '招聘申请单', style: { fontSize: '24px', fontWeight: '500', color: '#000000', justifyContent: 'flex-start' } },
  
  // Buttons
  { id: 'b1', type: ElementType.BUTTON, x: 800, y: 30, width: 80, height: 34, content: '保存', style: { backgroundColor: 'white', color: '#000000', border: '1px solid #e0e0e6', borderRadius: '3px', cursor: 'pointer' } },
  { id: 'b2', type: ElementType.BUTTON, x: 890, y: 30, width: 80, height: 34, content: '提交', style: { backgroundColor: 'white', color: '#000000', border: '1px solid #e0e0e6', borderRadius: '3px', cursor: 'pointer' } },

  // Section 1: Basic Info
  { id: 'c1', type: ElementType.CARD, x: 20, y: 80, width: 960, height: 120, content: '', style: { backgroundColor: 'white', borderRadius: '3px', boxShadow: '0 1px 2px -2px rgba(0,0,0,0.08)', border: '1px solid #efeff5', alignItems: 'flex-start', justifyContent: 'flex-start' } },
  { id: 't1', type: ElementType.TEXT, x: 40, y: 95, width: 920, height: 30, content: '基本信息', style: { fontSize: '16px', fontWeight: '500', borderBottom: '1px solid #efeff5', justifyContent: 'flex-start', color: '#000000' } },
  
  { id: 'l1', type: ElementType.TEXT, x: 40, y: 140, width: 100, height: 20, content: '单据编号', style: { fontSize: '12px', color: '#000000', justifyContent: 'flex-start' } },
  { id: 'v1', type: ElementType.TEXT, x: 40, y: 160, width: 100, height: 20, content: 'NEW', style: { fontSize: '14px', color: '#000000', justifyContent: 'flex-start' } },
  
  { id: 'l2', type: ElementType.TEXT, x: 300, y: 140, width: 100, height: 20, content: '申请人', style: { fontSize: '12px', color: '#000000', justifyContent: 'flex-start' } },
  { id: 'v2', type: ElementType.TEXT, x: 300, y: 160, width: 100, height: 20, content: '辛测试', style: { fontSize: '14px', color: '#000000', justifyContent: 'flex-start' } },

  // Section 2: Dept Info
  { id: 'c2', type: ElementType.CARD, x: 20, y: 220, width: 960, height: 150, content: '', style: { backgroundColor: 'white', borderRadius: '3px', boxShadow: '0 1px 2px -2px rgba(0,0,0,0.08)', border: '1px solid #efeff5', alignItems: 'flex-start', justifyContent: 'flex-start' } },
  { id: 't2', type: ElementType.TEXT, x: 40, y: 235, width: 920, height: 30, content: '需求部门情况', style: { fontSize: '16px', fontWeight: '500', borderBottom: '1px solid #efeff5', justifyContent: 'flex-start', color: '#000000' } },

  { id: 'l3', type: ElementType.TEXT, x: 40, y: 280, width: 200, height: 20, content: '*校招项目', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'i1', type: ElementType.INPUT, x: 40, y: 305, width: 220, height: 34, content: '🔍', style: { borderRadius: '3px', borderColor: '#e0e0e6', backgroundColor: 'white', textAlign: 'right', paddingRight: '10px', color: '#000000' } },

  { id: 'l4', type: ElementType.TEXT, x: 300, y: 280, width: 200, height: 20, content: '*实际需求部门', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'i2', type: ElementType.INPUT, x: 300, y: 305, width: 220, height: 34, content: '▼', style: { borderRadius: '3px', borderColor: '#e0e0e6', backgroundColor: 'white', textAlign: 'right', paddingRight: '10px', color: '#000000' } },

  { id: 'l5', type: ElementType.TEXT, x: 560, y: 280, width: 200, height: 20, content: '部门现有人数', style: { fontSize: '12px', color: '#000000', justifyContent: 'flex-start' } },
  { id: 'v3', type: ElementType.TEXT, x: 560, y: 310, width: 100, height: 20, content: '4', style: { fontSize: '14px', color: '#000000', justifyContent: 'flex-start' } },

  { id: 'l6', type: ElementType.TEXT, x: 700, y: 280, width: 200, height: 20, content: '近三年校招生数', style: { fontSize: '12px', color: '#000000', justifyContent: 'flex-start' } },
  { id: 'v4', type: ElementType.TEXT, x: 700, y: 310, width: 100, height: 20, content: '5', style: { fontSize: '14px', color: '#000000', justifyContent: 'flex-start' } },

  // Section 3: Position Info
  { id: 'c3', type: ElementType.CARD, x: 20, y: 390, width: 960, height: 850, content: '', style: { backgroundColor: 'white', borderRadius: '3px', boxShadow: '0 1px 2px -2px rgba(0,0,0,0.08)', border: '1px solid #efeff5', alignItems: 'flex-start', justifyContent: 'flex-start' } },
  { id: 't3', type: ElementType.TEXT, x: 40, y: 405, width: 920, height: 30, content: '招聘岗位情况', style: { fontSize: '16px', fontWeight: '500', borderBottom: '1px solid #efeff5', justifyContent: 'flex-start', color: '#000000' } },
  
  // Tiny buttons
  { id: 'b3', type: ElementType.BUTTON, x: 760, y: 400, width: 60, height: 28, content: '添加', style: { backgroundColor: 'white', color: '#000000', border: '1px solid #e0e0e6', fontSize: '12px', borderRadius: '3px' } },
  { id: 'b4', type: ElementType.BUTTON, x: 830, y: 400, width: 60, height: 28, content: '删除', style: { backgroundColor: 'white', color: '#000000', border: '1px solid #e0e0e6', fontSize: '12px', borderRadius: '3px' } },
  { id: 'b5', type: ElementType.BUTTON, x: 900, y: 400, width: 60, height: 28, content: '复制', style: { backgroundColor: 'white', color: '#000000', border: '1px solid #e0e0e6', fontSize: '12px', borderRadius: '3px' } },

  { id: 'seq', type: ElementType.TEXT, x: 40, y: 450, width: 100, height: 20, content: '☑ 序号 1', style: { fontSize: '14px', fontWeight: '500', justifyContent: 'flex-start', color: '#000000' } },

  // Gray Area Container
  { id: 'gray_box', type: ElementType.CONTAINER, x: 40, y: 480, width: 920, height: 740, content: '', style: { backgroundColor: '#f9f9fc', border: '1px solid #efeff5', borderRadius: '3px' } },

  // Row 1
  { id: 'r1_l1', type: ElementType.TEXT, x: 60, y: 500, width: 100, height: 20, content: '*职族', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r1_i1', type: ElementType.INPUT, x: 60, y: 525, width: 180, height: 34, content: '▼', style: { backgroundColor: 'white', textAlign: 'right', paddingRight: '10px', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },
  
  { id: 'r1_l2', type: ElementType.TEXT, x: 280, y: 500, width: 100, height: 20, content: '*序列', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r1_i2', type: ElementType.INPUT, x: 280, y: 525, width: 180, height: 34, content: '🔍', style: { backgroundColor: 'white', textAlign: 'right', paddingRight: '10px', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },

  { id: 'r1_l3', type: ElementType.TEXT, x: 500, y: 500, width: 100, height: 20, content: '*职级', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r1_i3', type: ElementType.INPUT, x: 500, y: 525, width: 180, height: 34, content: '▼', style: { backgroundColor: 'white', textAlign: 'right', paddingRight: '10px', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },

  { id: 'r1_l4', type: ElementType.TEXT, x: 720, y: 500, width: 100, height: 20, content: '*岗位', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r1_i4', type: ElementType.INPUT, x: 720, y: 525, width: 180, height: 34, content: '🔍', style: { backgroundColor: 'white', textAlign: 'right', paddingRight: '10px', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },

  // Row 2
  { id: 'r2_l1', type: ElementType.TEXT, x: 60, y: 580, width: 150, height: 20, content: '*招聘岗位人数', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r2_i1', type: ElementType.INPUT, x: 60, y: 605, width: 180, height: 34, content: '', style: { backgroundColor: 'white', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },
  
  { id: 'r2_l2', type: ElementType.TEXT, x: 280, y: 580, width: 150, height: 20, content: '*人才类型', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r2_i2', type: ElementType.INPUT, x: 280, y: 605, width: 180, height: 34, content: '▼', style: { backgroundColor: 'white', textAlign: 'right', paddingRight: '10px', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },

  { id: 'r2_l3', type: ElementType.TEXT, x: 500, y: 580, width: 150, height: 20, content: '*直接上级', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r2_i3', type: ElementType.INPUT, x: 500, y: 605, width: 180, height: 34, content: '🔍', style: { backgroundColor: 'white', textAlign: 'right', paddingRight: '10px', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },

  { id: 'r2_l4', type: ElementType.TEXT, x: 720, y: 580, width: 150, height: 20, content: '*学历', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r2_i4', type: ElementType.INPUT, x: 720, y: 605, width: 180, height: 34, content: '▼', style: { backgroundColor: 'white', textAlign: 'right', paddingRight: '10px', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },

  // Row 3
  { id: 'r3_l1', type: ElementType.TEXT, x: 60, y: 660, width: 150, height: 20, content: '*专业', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r3_i1', type: ElementType.INPUT, x: 60, y: 685, width: 180, height: 34, content: '', style: { backgroundColor: 'white', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },
  
  { id: 'r3_l2', type: ElementType.TEXT, x: 280, y: 660, width: 150, height: 20, content: '*语言要求', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r3_i2', type: ElementType.INPUT, x: 280, y: 685, width: 180, height: 34, content: '▼', style: { backgroundColor: 'white', textAlign: 'right', paddingRight: '10px', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },

  { id: 'r3_l3', type: ElementType.TEXT, x: 500, y: 660, width: 200, height: 20, content: '公司任职资格标准', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r3_t3', type: ElementType.TEXT, x: 500, y: 690, width: 250, height: 20, content: '点击链接查看任职资格详情', style: { fontSize: '12px', color: '#000000', textDecoration: 'underline', justifyContent: 'flex-start' } },

  // Row 4 (Reason)
  { id: 'r4_l1', type: ElementType.TEXT, x: 60, y: 740, width: 250, height: 20, content: '*岗位招聘申请理由', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r4_i1', type: ElementType.INPUT, x: 60, y: 765, width: 840, height: 60, content: '', style: { backgroundColor: 'white', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },

  // Row 5 (Qualifications)
  { id: 'r5_l1', type: ElementType.TEXT, x: 60, y: 845, width: 250, height: 20, content: '*任职资格', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r5_i1', type: ElementType.INPUT, x: 60, y: 870, width: 450, height: 80, content: '', style: { backgroundColor: 'white', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },

  { id: 'r5_l2', type: ElementType.TEXT, x: 540, y: 845, width: 250, height: 20, content: '*任职资格自查', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r5_cb1', type: ElementType.TEXT, x: 540, y: 870, width: 300, height: 20, content: '○ 学历+专业+经验等是否齐全', style: { fontSize: '12px', color: '#000000', justifyContent: 'flex-start' } },
  { id: 'r5_cb2', type: ElementType.TEXT, x: 540, y: 895, width: 300, height: 20, content: '○ 能力特质，是否清晰明确', style: { fontSize: '12px', color: '#000000', justifyContent: 'flex-start' } },
  { id: 'r5_cb3', type: ElementType.TEXT, x: 540, y: 920, width: 300, height: 20, content: '○ 必要的附加要求是否明确', style: { fontSize: '12px', color: '#000000', justifyContent: 'flex-start' } },

  // Row 6 (Responsibilities)
  { id: 'r6_l1', type: ElementType.TEXT, x: 60, y: 970, width: 250, height: 20, content: '*工作职责', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r6_i1', type: ElementType.INPUT, x: 60, y: 995, width: 450, height: 80, content: '', style: { backgroundColor: 'white', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },

  { id: 'r6_l2', type: ElementType.TEXT, x: 540, y: 970, width: 250, height: 20, content: '*自查项', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r6_cb1', type: ElementType.TEXT, x: 540, y: 995, width: 300, height: 20, content: '○ 职责数量在3-5项', style: { fontSize: '12px', color: '#000000', justifyContent: 'flex-start' } },
  { id: 'r6_cb2', type: ElementType.TEXT, x: 540, y: 1020, width: 300, height: 20, content: '○ 各职责聚焦，不重复', style: { fontSize: '12px', color: '#000000', justifyContent: 'flex-start' } },
  { id: 'r6_cb3', type: ElementType.TEXT, x: 540, y: 1045, width: 300, height: 20, content: '○ 清晰描述做什么及达成成果', style: { fontSize: '12px', color: '#000000', justifyContent: 'flex-start' } },

  // Row 7 (Other)
  { id: 'r7_l1', type: ElementType.TEXT, x: 60, y: 1095, width: 250, height: 20, content: '*其他要求', style: { fontSize: '12px', color: '#000000', fontWeight: '500', justifyContent: 'flex-start' } },
  { id: 'r7_i1', type: ElementType.INPUT, x: 60, y: 1120, width: 840, height: 60, content: '', style: { backgroundColor: 'white', borderRadius: '3px', borderColor: '#e0e0e6', color: '#000000' } },
];

const App: React.FC = () => {
  const [elements, setElements] = useState<CanvasElement[]>(initialElements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addElement = useCallback((type: ElementType, x: number, y: number) => {
    const meta = COMPONENT_REGISTRY[type];
    const newElement: CanvasElement = {
      id: `el-${Date.now()}`,
      type,
      x,
      y,
      width: meta.defaultWidth,
      height: meta.defaultHeight,
      content: meta.defaultContent,
      style: { ...meta.defaultStyle, position: 'absolute', left: 0, top: 0 },
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleGenerateLayout = useCallback((newElements: CanvasElement[]) => {
    setElements(newElements);
    setSelectedId(null);
  }, []);

  const handleClearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      setElements([]);
      setSelectedId(null);
    }
  };

  const handleExport = () => {
    const json = JSON.stringify(elements, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'naive-prototype.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleElementClick = useCallback((element: CanvasElement) => {
    // Interactive logic for "Add" button to duplicate the recruitment position block
    if (element.type === ElementType.BUTTON && element.content === '添加') {
      const templateStartY = 390;
      // Identify template elements from initial set (Recruitment Position Block)
      // Range: y >= 390 (start of card)
      const templateElements = initialElements.filter(el => el.y >= templateStartY);
      
      if (templateElements.length === 0) return;

      // Determine where to place the new block (after the last element on canvas)
      // We look at all current elements to find the absolute bottom
      const maxY = Math.max(...elements.map(el => el.y + el.height), 0);
      const startY = maxY + 40; // 40px margin

      // Determine the next sequence number
      const seqRegex = /☑ 序号 (\d+)/;
      const currentSeqNums = elements
        .map(el => {
           const match = el.content.match(seqRegex);
           return match ? parseInt(match[1]) : 0;
        });
      const nextSeq = (Math.max(...currentSeqNums, 0)) + 1;

      // Clone and adjust positions
      const newBlock = templateElements.map(el => {
        const newEl = { ...el };
        newEl.id = `${el.id}_copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        // Shift Y position relative to the new start point
        newEl.y = el.y - templateStartY + startY;
        
        // Update sequence number text if matched
        if (newEl.content.match(seqRegex)) {
           newEl.content = `☑ 序号 ${nextSeq}`;
        }
        
        return newEl;
      });

      setElements(prev => [...prev, ...newBlock]);
      
      // Auto scroll to bottom (optional, but good UX)
      setTimeout(() => {
        const container = document.querySelector('.overflow-auto');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    }
    
    // Interactive logic for "Delete" button
    if (element.type === ElementType.BUTTON && element.content === '删除') {
      const btnY = element.y;
      
      // Find the main card container for the block (approx height 850 in template)
      // We look for a card that vertically encloses the button and is large enough to be the container
      const blockCard = elements.find(el => 
        el.type === ElementType.CARD && 
        el.y <= btnY && 
        (el.y + el.height) >= btnY &&
        el.height > 200 // heuristic: block containers are large
      );

      if (!blockCard) {
        // If we can't find the block container, we assume it's an isolated button or error
        return;
      }

      const blockTop = blockCard.y;
      const blockBottom = blockCard.y + blockCard.height;
      const shiftAmount = (blockBottom - blockTop) + 40; // Height + 40px margin used in "Add"

      // 1. Filter out elements in the block
      const remainingElements = elements.filter(el => 
        el.y < blockTop || el.y >= blockBottom
      );

      // 2. Shift elements below the deleted block upwards
      const shiftedElements = remainingElements.map(el => {
        if (el.y >= blockBottom) {
          return { ...el, y: el.y - shiftAmount };
        }
        return el;
      });

      // 3. Renumber remaining blocks
      const seqRegex = /☑ 序号 (\d+)/;
      
      // Find all sequence headers and sort them by Y position to determine their new order
      const sequenceHeaders = shiftedElements
        .filter(el => el.type === ElementType.TEXT && seqRegex.test(el.content))
        .sort((a, b) => a.y - b.y);

      const renumberedElements = shiftedElements.map(el => {
        if (el.type === ElementType.TEXT && seqRegex.test(el.content)) {
          const index = sequenceHeaders.findIndex(header => header.id === el.id);
          if (index !== -1) {
            return { ...el, content: `☑ 序号 ${index + 1}` };
          }
        }
        return el;
      });

      setElements(renumberedElements);
      setSelectedId(null);
    }
  }, [elements]);

  return (
    <div className="flex flex-col h-screen w-screen bg-white font-sans text-[#000000]">
      {/* Header - Naive UI Style */}
      <header className="h-14 bg-white border-b border-[#efeff5] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#18a058] rounded-[3px] flex items-center justify-center text-white font-bold shadow-sm">
            N
          </div>
          <h1 className="font-medium text-[#1f2225] text-lg tracking-tight">ProtoGen <span className="text-[#18a058]">Naive</span></h1>
          <span className="bg-[#e7f5ee] text-[#18a058] text-[10px] px-1.5 py-0.5 rounded-[2px] font-bold border border-[#18a058]/20">
            UI KIT
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleClearCanvas}
            className="flex items-center gap-2 px-3 py-1.5 text-[#666] hover:text-[#d03050] hover:bg-[#fff0f0] rounded-[3px] text-sm transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <div className="h-4 w-px bg-[#efeff5] mx-1"></div>
           <button 
             onClick={() => alert("Code export feature coming soon!")}
             className="flex items-center gap-2 px-3 py-1.5 text-[#666] hover:text-[#18a058] hover:bg-[#f5fcf7] rounded-[3px] text-sm transition-colors"
           >
            <Code size={16} />
            Export Code
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#18a058] text-white rounded-[3px] text-sm hover:bg-[#36ad6a] shadow-sm transition-colors"
          >
            <Download size={16} />
            Export JSON
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <LeftPanel />
        
        <Canvas 
          elements={elements} 
          onAddElement={addElement}
          onSelectElement={setSelectedId}
          selectedId={selectedId}
          onUpdateElement={updateElement}
          onElementClick={handleElementClick}
        />

        <PropertiesPanel 
          selectedElement={elements.find(el => el.id === selectedId) || null}
          onUpdateElement={updateElement}
          onDeleteElement={deleteElement}
          onGenerateLayout={handleGenerateLayout}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      </div>

      {/* Status Bar */}
      <div className="h-7 bg-white border-t border-[#efeff5] flex items-center justify-between px-4 text-[11px] text-[#999] shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Layers size={12} /> Elements: {elements.length}
          </span>
          <span className="flex items-center gap-1.5">
            <BoxSelect size={12} /> Selected: {selectedId || 'None'}
          </span>
        </div>
        <div>
          {isGenerating ? (
            <span className="text-[#18a058] flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 bg-[#18a058] rounded-full animate-pulse"></span>
              AI Processing...
            </span>
          ) : (
            <span>Ready</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;