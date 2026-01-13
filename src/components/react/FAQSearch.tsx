import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import { useFAQStore, type FAQ } from "../../store/faqStore";

export default function FAQSearch() {
  const { faqs, isLoading } = useFAQStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(faqs.map(f => f.category)))];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesQuery =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A9CE3C]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-none w-full mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
      {/* Search and Category Filter */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="How can we help you today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#A9CE3C] focus:bg-white outline-none transition-all text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-4 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredFaqs.map((faq) => (
            <motion.div
              layout
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 ${activeId === faq.id
                  ? "border-[#A9CE3C] shadow-2xl shadow-[#A9CE3C]/10"
                  : "border-slate-100 shadow-sm hover:shadow-md"
                }`}
            >
              <button
                onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6 group"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activeId === faq.id ? "bg-[#A9CE3C] text-white" : "bg-slate-50 text-[#A9CE3C] group-hover:bg-[#A9CE3C]/10"
                    }`}>
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#A9CE3C] uppercase tracking-widest mb-1 block">
                      {faq.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                      {faq.question}
                    </h3>
                  </div>
                </div>
                <div className={`p-2 rounded-full transition-colors ${activeId === faq.id ? "bg-[#A9CE3C]/10 text-[#A9CE3C]" : "text-slate-300 group-hover:text-slate-900"
                  }`}>
                  {activeId === faq.id ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </div>
              </button>

              <motion.div
                initial={false}
                animate={{ height: activeId === faq.id ? "auto" : 0, opacity: activeId === faq.id ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 md:px-8 pb-8 pt-2">
                  <div className="h-px bg-slate-100 mb-6" />
                  <div className="flex gap-6">
                    <div className="w-12 shrink-0 hidden md:flex items-start justify-center pt-1">
                      <MessageCircle className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredFaqs.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              We couldn't find any FAQs matching your search criteria. Please try different keywords.
            </p>
          </div>
        )}
      </div>

      {/* Support CTA */}
      <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A9CE3C] blur-[120px] opacity-20 -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Still have questions?</h3>
            <p className="text-slate-400 max-w-md">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
          </div>
          <a
            href="mailto:support@lantarciptamedia.com"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#A9CE3C] hover:bg-[#96B835] text-white rounded-2xl font-bold transition-all shadow-lg shadow-[#A9CE3C]/20"
          >
            Contact Support
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
