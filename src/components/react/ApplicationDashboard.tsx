import React, { useState } from 'react';
import { useApplicationStore, type Application } from '../../store/applicationStore';
import {
  FileText,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Filter,
  User,
  Briefcase
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  reviewed: { label: 'Reviewed', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
  accepted: { label: 'Accepted', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
};

export default function ApplicationDashboard() {
  const { applications, isLoading, updateStatus, deleteApplication } = useApplicationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.nik.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, status: Application['status']) => {
    try {
      await updateStatus(id, status);
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (app: Application) => {
    if (confirm(`Are you sure you want to delete the application from ${app.full_name}?`)) {
      try {
        await deleteApplication(app.id, app.cv_url);
      } catch (err) {
        alert('Failed to delete application.');
      }
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
      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or NIK..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-48 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#A9CE3C] outline-none transition-all bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                      <User className="w-7 h-7 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{app.full_name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">NIK: {app.nik}</span>
                        <span>•</span>
                        <span>{new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${STATUS_CONFIG[app.status].bg} ${STATUS_CONFIG[app.status].color}`}>
                    {React.createElement(STATUS_CONFIG[app.status].icon, { className: "w-4 h-4" })}
                    {STATUS_CONFIG[app.status].label}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-[#A9CE3C]" />
                    <span className="truncate">{app.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-[#A9CE3C]" />
                    {app.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <GraduationCap className="w-4 h-4 text-[#A9CE3C]" />
                    {app.education.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-[#A9CE3C]" />
                    DOB: {app.birth_date}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 lg:col-span-2">
                    <Briefcase className="w-4 h-4 text-[#A9CE3C]" />
                    <span className="font-medium text-slate-900">
                      Positions: {app.positions.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lg:w-72 flex flex-col gap-3 lg:border-l lg:pl-8 border-gray-100 pt-6 lg:pt-0">
                <a
                  href={app.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-lg shadow-slate-900/10"
                >
                  <Download className="w-4 h-4" />
                  View CV / Resume
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value as Application['status'])}
                    className="col-span-1 px-3 py-3 rounded-xl border border-gray-200 text-xs font-bold outline-none bg-white focus:ring-2 focus:ring-[#A9CE3C]"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => handleDelete(app)}
                    className="col-span-1 flex items-center justify-center gap-2 px-3 py-3 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs font-bold">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredApplications.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No applications found</h3>
            <p className="text-slate-500">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
