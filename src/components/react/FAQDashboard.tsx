import React, { useState } from 'react';
import { useFAQStore, type FAQ } from '../../store/faqStore';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  HelpCircle,
  MessageSquare,
  Type,
  PlusCircle,
  AlertCircle,
  MoveUp,
  MoveDown
} from 'lucide-react';

const CATEGORIES = ["General", "Services", "Support", "Technical"];

export default function FAQDashboard() {
  const { faqs, isLoading, addFAQ, updateFAQ, deleteFAQ } = useFAQStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<FAQ, 'id' | 'created_at'>>({
    question: '',
    answer: '',
    category: CATEGORIES[0],
    order: 0
  });

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: CATEGORIES[0],
      order: faqs.length > 0 ? Math.max(...faqs.map(f => f.order)) + 1 : 0
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order
    });
    setEditingId(faq.id);
    setIsAdding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        // Find the existing FAQ to keep created_at (though useFAQStore handles it)
        const existing = faqs.find(f => f.id === editingId);
        if (existing) {
          await updateFAQ({ ...formData, id: editingId, created_at: existing.created_at });
        }
      } else {
        await addFAQ(formData);
      }
      resetForm();
    } catch (err) {
      alert('Failed to save FAQ. Check your Supabase RLS settings.');
    }
  };

  const moveOrder = async (faq: FAQ, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex(f => f.id === faq.id);
    if (direction === 'up' && currentIndex > 0) {
      const other = faqs[currentIndex - 1];
      await updateFAQ({ ...faq, order: other.order });
      await updateFAQ({ ...other, order: faq.order });
    } else if (direction === 'down' && currentIndex < faqs.length - 1) {
      const other = faqs[currentIndex + 1];
      await updateFAQ({ ...faq, order: other.order });
      await updateFAQ({ ...other, order: faq.order });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A9CE3C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-slate-500">Manage Frequently Asked Questions for your customers.</p>
        </div>
        <div className="flex gap-4">
          {!isAdding && editingId === null && (
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  order: faqs.length > 0 ? Math.max(...faqs.map(f => f.order)) + 1 : 0
                });
                setIsAdding(true);
              }}
              className="inline-flex items-center gap-2 bg-[#A9CE3C] hover:bg-[#96B835] text-white padding-x-6 py-3 px-6 rounded-xl font-bold transition-all shadow-lg shadow-[#A9CE3C]/30"
            >
              <Plus className="w-5 h-5" />
              Add FAQ
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        {(isAdding || editingId !== null) && (
          <div className="lg:col-span-12 xl:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {editingId !== null ? <Edit2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                  {editingId !== null ? 'Edit FAQ' : 'New FAQ'}
                </h3>
                <button onClick={resetForm} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#A9CE3C]" />
                    Question
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] focus:border-transparent outline-none transition-all"
                    placeholder="Enter the question..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Type className="w-4 h-4 text-[#A9CE3C]" />
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none transition-all bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#A9CE3C]" />
                    Answer
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none transition-all resize-none"
                    placeholder="Provide a clear answer..."
                  ></textarea>
                </div>

                <div className="flex pt-4 gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#A9CE3C] hover:bg-[#96B835] text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingId !== null ? 'Update FAQ' : 'Publish FAQ'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 border border-gray-200 text-slate-600 hover:bg-gray-50 rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className={`${isAdding || editingId !== null ? 'xl:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          <div className="grid grid-cols-1 gap-4">
            {faqs.map((faq: FAQ, index: number) => (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl p-6 border transition-all duration-300 ${editingId === faq.id ? 'border-[#A9CE3C] ring-2 ring-[#A9CE3C]/10' : 'border-gray-100 hover:shadow-lg'
                  }`}
              >
                <div className="flex gap-6 items-start">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveOrder(faq, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-300 hover:text-[#A9CE3C] disabled:opacity-30"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveOrder(faq, 'down')}
                      disabled={index === faqs.length - 1}
                      className="p-1 text-slate-300 hover:text-[#A9CE3C] disabled:opacity-30"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[#A9CE3C] text-[10px] font-bold uppercase mb-1">{faq.category}</div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 truncate">{faq.question}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2">{faq.answer}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="p-2 text-slate-400 hover:text-[#A9CE3C] transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this FAQ?')) deleteFAQ(faq.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {faqs.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No FAQs yet</h3>
                <p className="text-slate-500">Your Supabase database table 'faqs' is empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
