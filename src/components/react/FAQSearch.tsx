import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQ[];
}

export default function FAQSearch({ faqs }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;

    const query = searchQuery.toLowerCase();
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery, faqs]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="min-w-xl mx-auto mb-16 px-4">
        <div className="bg-white p-4 rounded-2xl shadow-xl border-2 border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation, guides, and resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg outline-hidden"
            />
          </div>
          {searchQuery && (
            <p className="mt-4 text-sm text-gray-500">
              Found {filteredFaqs.length} results for "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* FAQ List */}
      <div className="min-w-xl mx-auto space-y-4 px-4">
        <AnimatePresence mode="popLayout">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const originalIndex = faqs.findIndex(f => f.question === faq.question);
              const isOpen = openIndex === originalIndex;

              return (
                <motion.div
                  key={faq.question}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-colors shadow-xs"
                >
                  <button
                    onClick={() => toggleAccordion(originalIndex)}
                    className="w-full text-left p-6 focus:outline-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4 group-hover:text-blue-600 transition-colors">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">We couldn't find any FAQs matching your search query.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-blue-600 font-semibold hover:underline"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
