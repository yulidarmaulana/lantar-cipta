import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Tag, Search, Filter } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Sistem Informasi Manajemen",
    category: "Software Development",
    description: "Pengembangan sistem manajemen terpadu untuk efisiensi operasional perusahaan.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tags: ["Web", "Management", "Enterprise"]
  },
  {
    id: 2,
    title: "Aplikasi Mobile Pelayanan",
    category: "Mobile App",
    description: "Aplikasi berbasis Android untuk mempermudah akses pelayanan publik bagi warga.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    tags: ["Android", "UI/UX", "Service"]
  },
  {
    id: 3,
    title: "Virtual Panorama",
    category: "Multimedia",
    description: "Produksi konten panorama virtual 360 derajat untuk tur digital interaktif.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    tags: ["360 VR", "Multimedia", "Interactive"]
  },
  {
    id: 4,
    title: "Sistem Informasi Geografis",
    category: "Software Development",
    description: "Pemetaan aset dan visualisasi data spasial menggunakan teknologi GIS terkini.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tags: ["GIS", "Mapping", "Analysis"]
  },
  {
    id: 5,
    title: "Video Profile Perusahaan",
    category: "Multimedia",
    description: "Produksi video sinematik untuk memperkuat branding dan identitas perusahaan.",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=800",
    tags: ["Video", "Branding", "Creative"]
  },
  {
    id: 6,
    title: "Audit Jaringan Instansi",
    category: "Networking",
    description: "Optimalisasi infrastruktur jaringan dan peningkatan keamanan server.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800",
    tags: ["Network", "Security", "Hardware"]
  }
];

const categories = ["All", "Software Development", "Mobile App", "Multimedia", "Networking"];

export default function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === category
                  ? "bg-[#A9CE3C] text-white shadow-lg shadow-[#A9CE3C]/30"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#A9CE3C] focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 group"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="flex gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-[#A9CE3C] text-sm font-bold uppercase tracking-wider mb-2">
                  <Tag className="w-3 h-3" />
                  {project.category}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#A9CE3C] transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>

                <button className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#A9CE3C] transition-colors group/btn">
                  View Case Study
                  <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-500">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}
