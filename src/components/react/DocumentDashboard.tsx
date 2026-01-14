import React, { useState } from 'react';
import { useDocumentStore, type Document } from '../../store/documentStore';
import {
  FileText,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Search,
  Filter,
  Loader2,
  X,
  Database
} from 'lucide-react';

export default function DocumentDashboard() {
  const { documents, isLoading, addDocument, updateDocument, deleteDocument } = useDocumentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = Array.from(new Set(documents.map(d => d.category)));

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const docData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      drive_url: formData.get('drive_url') as string,
      file_type: formData.get('file_type') as string,
      file_size: formData.get('file_size') as string,
    };

    try {
      if (editingDoc) {
        await updateDocument(editingDoc.id, docData);
      } else {
        await addDocument(docData);
      }
      setIsModalOpen(false);
      setEditingDoc(null);
    } catch (err) {
      alert('Failed to save document. Make sure the "documents" table exists in Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document link?')) {
      try {
        await deleteDocument(id);
      } catch (err) {
        alert('Failed to delete document.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#A9CE3C]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 md:w-48 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none transition-all bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button
            onClick={() => { setEditingDoc(null); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#A9CE3C] text-white rounded-xl font-bold hover:bg-[#96B835] transition-all shadow-lg shadow-[#A9CE3C]/20"
          >
            <Plus className="w-5 h-5" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                <FileText className="w-6 h-6 text-[#A9CE3C]" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => { setEditingDoc(doc); setIsModalOpen(true); }}
                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{doc.title}</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">{doc.description}</p>

            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{doc.category}</span>
              <span className="px-2 py-1 bg-[#A9CE3C]/10 text-[#A9CE3C] rounded text-[10px] font-bold uppercase">{doc.file_type}</span>
              <span className="text-[10px] text-gray-400 font-medium">{doc.file_size}</span>
            </div>

            <a
              href={doc.drive_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Open Drive Link
            </a>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No documents found</h3>
          <p className="text-slate-500 text-sm">Start by adding your first document link.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-2xl font-bold text-slate-900">{editingDoc ? 'Edit Document' : 'Add New Document'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                <input
                  name="title"
                  required
                  defaultValue={editingDoc?.title}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none"
                  placeholder="Technical Guide v1.0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                <textarea
                  name="description"
                  required
                  defaultValue={editingDoc?.description}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none h-24 resize-none"
                  placeholder="Detailed description of the document..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                  <input
                    name="category"
                    required
                    defaultValue={editingDoc?.category}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none"
                    placeholder="Technical"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">File Size</label>
                  <input
                    name="file_size"
                    required
                    defaultValue={editingDoc?.file_size}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none"
                    placeholder="5.2 MB"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Google Drive URL</label>
                <input
                  name="drive_url"
                  required
                  defaultValue={editingDoc?.drive_url}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none"
                  placeholder="https://drive.google.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">File Type</label>
                <select
                  name="file_type"
                  required
                  defaultValue={editingDoc?.file_type || 'PDF'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none bg-white"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="XLSX">XLSX</option>
                  <option value="ZIP">ZIP</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#A9CE3C] text-white py-4 rounded-xl font-bold hover:bg-[#96B835] transition-all shadow-lg shadow-[#A9CE3C]/30 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingDoc ? 'Update Document' : 'Add Document'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
