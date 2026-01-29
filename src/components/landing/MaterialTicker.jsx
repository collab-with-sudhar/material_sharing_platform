import React from 'react';
import { FileText, Eye, Download } from 'lucide-react';

const TickerItem = () => (
  <a href="#" className="flex-shrink-0 mx-2 group block">
    <div className="border border-black bg-white p-4 w-64 hover:bg-neon-pink transition-colors duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 border border-black group-hover:border-white transition-colors">
          <FileText className="w-5 h-5 group-hover:text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">QUANTITATIVE ANALYSIS for managerial applications</h3>
          <p className="text-xs text-gray-500 group-hover:text-black/70 truncate">quantitative analysis</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 group-hover:text-black/60">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 1</span>
            <span className="flex items-center gap-1"><Download className="w-3 h-3" /> 1</span>
          </div>
        </div>
      </div>
    </div>
  </a>
);

const MaterialTicker = () => (
  <section className="py-8 overflow-hidden border-y border-black">
    <div className="relative w-full">
      <div className="flex animate-scroll-left hover:pause w-max">
        {/* Render twice for seamless loop */}
        {[...Array(10)].map((_, i) => <TickerItem key={`a-${i}`} />)}
        {[...Array(10)].map((_, i) => <TickerItem key={`b-${i}`} />)}
      </div>
    </div>
  </section>
);

export default MaterialTicker;