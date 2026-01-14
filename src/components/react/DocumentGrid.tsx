import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDocumentStore } from '../../store/documentStore';
import {
  FileText,
  ExternalLink,
  Search,
  Download,
  Filter,
  Loader2
} from 'lucide-react';

export default function DocumentGrid() {
  const { documents, isLoading } = useDocumentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(documents.map(d => d.category)))];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#A9CE3C] mb-4" />
        <p className="text-slate-500 font-medium italic">Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Search and Category Filter */}
      <div className="flex flex-col items-center space-y-8">
        <div className="relative w-full max-w-2xl bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources, guides, or documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#A9CE3C] focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                  ? 'bg-[#A9CE3C] text-white shadow-lg shadow-[#A9CE3C]/20 scale-105'
                  : 'bg-white text-slate-600 border border-gray-100 hover:border-[#A9CE3C] hover:text-[#A9CE3C]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredDocuments.map((doc) => (
            <motion.div
              layout
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#A9CE3C]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-7 h-7 text-[#A9CE3C]" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-100">
                    {doc.file_type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{doc.file_size}</span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#A9CE3C] transition-colors line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
                  {doc.description}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{doc.category}</span>
                <a
                  href={doc.drive_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#A9CE3C] font-bold text-sm hover:underline group/link"
                >
                  Download
                  <Download className="w-4 h-4 group-hover/link:translate-y-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
            <Search className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No documents match your criteria</h3>
          <p className="text-slate-500">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}
