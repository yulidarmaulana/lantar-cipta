import React, { useState, useEffect } from 'react';
import { usePortfolioStore, type Project } from '../../store/portfolioStore';
import { supabase } from '../../lib/supabaseClient';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Image as ImageIcon,
  Layout,
  Type,
  ChevronRight,
  PlusCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';

const CATEGORIES = ["Software Development", "Mobile App", "Multimedia", "Networking"];

export default function PortfolioDashboard() {
  const { projects, isLoading: isStoreLoading, addProject, updateProject, deleteProject } = usePortfolioStore();
  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    category: CATEGORIES[0],
    description: '',
    image: '',
    tags: []
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
      if (!session) {
        window.location.href = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/login`;
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/login`;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: CATEGORIES[0],
      description: '',
      image: '',
      tags: []
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      image: project.image,
      tags: project.tags
    });
    setEditingId(project.id);
    setIsAdding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await updateProject({ ...formData, id: editingId });
      } else {
        await addProject(formData);
      }
      resetForm();
    } catch (err) {
      alert('Failed to save project. Check your Supabase RLS settings.');
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t: string) => t !== tagToRemove) });
  };

  if (isAuthLoading || isStoreLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A9CE3C]"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-slate-900">Portfolio Management</h2>
            <span className="px-3 py-1 bg-green-50 text-[#A9CE3C] text-[10px] font-bold uppercase rounded-full border border-green-100">
              Supabase Connected
            </span>
          </div>
          <p className="text-slate-500">Manage your projects stored in Supabase Database.</p>
        </div>
        <div className="flex gap-4">
          {!isAdding && editingId === null && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 bg-[#A9CE3C] hover:bg-[#96B835] text-white padding-x-6 py-3 px-6 rounded-xl font-bold transition-all shadow-lg shadow-[#A9CE3C]/30"
            >
              <Plus className="w-5 h-5" />
              Add Project
            </button>
          )}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-3 rounded-xl font-bold transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
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
                  {editingId !== null ? 'Edit Project' : 'New Project'}
                </h3>
                <button onClick={resetForm} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Type className="w-4 h-4 text-[#A9CE3C]" />
                    Project Title
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] focus:border-transparent outline-none transition-all"
                    placeholder="Enter project name..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Layout className="w-4 h-4 text-[#A9CE3C]" />
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
                      <ImageIcon className="w-4 h-4 text-[#A9CE3C]" />
                      Image URL
                    </label>
                    <input
                      required
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none transition-all"
                      placeholder="Image URL..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none transition-all resize-none"
                    placeholder="Short project overview..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tags (Enter to add)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#A9CE3C]/10 text-[#A9CE3C] text-xs font-bold rounded-lg border border-[#A9CE3C]/20">
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    onKeyDown={handleTagInput}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none transition-all"
                    placeholder="Add tags..."
                  />
                </div>

                <div className="flex pt-4 gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#A9CE3C] hover:bg-[#96B835] text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingId !== null ? 'Update' : 'Publish'}
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

        {/* Project List */}
        <div className={`${isAdding || editingId !== null ? 'xl:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project: Project) => (
              <div
                key={project.id}
                className={`bg-white rounded-2xl p-6 border transition-all duration-300 ${editingId === project.id ? 'border-[#A9CE3C] ring-2 ring-[#A9CE3C]/10' : 'border-gray-100 hover:shadow-lg'
                  }`}
              >
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <img src={project.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#A9CE3C] text-[10px] font-bold uppercase mb-1">{project.category}</div>
                    <h4 className="text-lg font-bold text-slate-900 truncate">{project.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-1">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-slate-400 hover:text-[#A9CE3C] transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this project?')) deleteProject(project.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No projects yet</h3>
                <p className="text-slate-500">Your Supabase database is empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
