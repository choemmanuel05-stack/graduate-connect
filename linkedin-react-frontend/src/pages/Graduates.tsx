import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, ExternalLink, FileText, MapPin, Star } from 'lucide-react';
import api from '../services/api';

interface Graduate {
  id: number; full_name: string; university: string; degree: string;
  field_of_study: string; graduation_year: number; gpa: number | null;
  skills: string; skills_list: string[]; bio: string;
  linkedin_url: string; github_url: string; cv_url: string | null;
  photo_url: string | null; is_available: boolean;
}

const Graduates: React.FC = () => {
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [selected, setSelected] = useState<Graduate | null>(null);

  useEffect(() => {
    const t = setTimeout(loadGraduates, 350);
    return () => clearTimeout(t);
  }, [search, skill]);

  const loadGraduates = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/graduates/', { params: { search, skill } });
      setGraduates(res.results || []);
    } catch {
      setGraduates([
        { id: 1, full_name: 'Alice Mbeki', university: 'University of Yaoundé I', degree: 'Bachelor', field_of_study: 'Computer Science', graduation_year: 2024, gpa: 3.8, skills: 'Python, React, Django, SQL', skills_list: ['Python', 'React', 'Django', 'SQL'], bio: 'Passionate full-stack developer with 2 years of project experience.', linkedin_url: '', github_url: '', cv_url: null, photo_url: null, is_available: true },
        { id: 2, full_name: 'Jean-Paul Nkomo', university: 'University of Douala', degree: 'Master', field_of_study: 'Data Science', graduation_year: 2023, gpa: 3.6, skills: 'Python, ML, SQL, Tableau', skills_list: ['Python', 'ML', 'SQL', 'Tableau'], bio: 'Data scientist specializing in predictive modeling for African markets.', linkedin_url: '', github_url: '', cv_url: null, photo_url: null, is_available: true },
        { id: 3, full_name: 'Marie Fotso', university: 'ESSEC Douala', degree: 'Bachelor', field_of_study: 'Business Administration', graduation_year: 2024, gpa: 3.5, skills: 'Marketing, Excel, Communication', skills_list: ['Marketing', 'Excel', 'Communication'], bio: 'Business graduate with strong analytical and leadership skills.', linkedin_url: '', github_url: '', cv_url: null, photo_url: null, is_available: true },
        { id: 4, full_name: 'Samuel Biya', university: 'ENSP Yaoundé', degree: 'Master', field_of_study: 'Electrical Engineering', graduation_year: 2023, gpa: 3.9, skills: 'MATLAB, AutoCAD, Python, Circuit Design', skills_list: ['MATLAB', 'AutoCAD', 'Python', 'Circuit Design'], bio: 'Electrical engineer with expertise in power systems and renewable energy.', linkedin_url: '', github_url: '', cv_url: null, photo_url: null, is_available: false },
      ]);
    } finally { setLoading(false); }
  };

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = ['from-blue-500 to-blue-700', 'from-teal-500 to-teal-700', 'from-purple-500 to-purple-700', 'from-orange-500 to-orange-700'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap size={16} className="text-teal-500" />
          <span className="text-xs font-semibold text-teal-600 uppercase tracking-widest">Talent Pool</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Graduate Directory</h1>
        <p style={{ color: '#94A3B8' }}>Discover talented graduates ready for their next opportunity</p>
      </div>

      {/* Filters */}
      <div className="surface p-3 mb-6 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, university, field..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-10" />
        </div>
        <div className="relative sm:w-48">
          <input type="text" placeholder="Filter by skill..."
            value={skill} onChange={e => setSkill(e.target.value)}
            className="input" />
        </div>
      </div>

      {!loading && (
        <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
          <span style={{ fontWeight: 700, color: '#E2E8F0' }}>{graduates.length}</span> graduates found
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-52 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger graduates-grid">
          {graduates.map((grad, idx) => (
            <div key={grad.id} onClick={() => setSelected(grad)}
              className="profile-card animate-fade-up cursor-pointer group">
              {/* Color header */}
              <div className={`profile-card-header bg-gradient-to-br ${avatarColors[idx % avatarColors.length]}`} />
              <div className="px-5 pb-5">
                {/* Avatar overlapping header */}
                <div className={`avatar w-14 h-14 text-lg -mt-7 mb-3 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]}`}>
                  {grad.photo_url
                    ? <img src={grad.photo_url} alt={grad.full_name} className="w-full h-full object-cover rounded-full" />
                    : initials(grad.full_name)
                  }
                </div>

                <div className="flex items-start justify-between mb-1">
                  <h3 style={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.9375rem', lineHeight: 1.3 }}>
                    {grad.full_name}
                  </h3>
                  {grad.is_available && (
                    <span className="badge badge-green flex-shrink-0 ml-2">Open</span>
                  )}
                </div>

                <p style={{ fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '0.25rem' }}>{grad.degree} · {grad.field_of_study}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
                  <GraduationCap size={11} />
                  <span className="truncate">{grad.university}</span>
                  {grad.graduation_year && <span className="flex-shrink-0">· {grad.graduation_year}</span>}
                </div>

                {grad.gpa && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 mb-3">
                    <Star size={10} fill="currentColor" /> GPA {grad.gpa}
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {grad.skills_list.slice(0, 3).map(s => (
                    <span key={s} className="skill-chip">{s}</span>
                  ))}
                  {grad.skills_list.length > 3 && (
                    <span className="skill-chip text-gray-400">+{grad.skills_list.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal overflow-hidden">
            {/* Modal header with gradient */}
            <div className="h-20 bg-gradient-to-br from-blue-600 to-teal-600 relative">
              <button onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                ×
              </button>
            </div>
            <div className="px-6 pb-6">
              <div className="avatar w-16 h-16 text-xl -mt-8 mb-4">
                {selected.photo_url
                  ? <img src={selected.photo_url} alt={selected.full_name} className="w-full h-full object-cover rounded-full" />
                  : initials(selected.full_name)
                }
              </div>

              <div className="flex items-start justify-between mb-1">
                <h2 className="text-xl font-bold text-gray-900">{selected.full_name}</h2>
                {selected.is_available && <span className="badge badge-green">Open to work</span>}
              </div>
              <p className="text-sm text-gray-500 mb-1">{selected.degree} in {selected.field_of_study}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                <GraduationCap size={11} /> {selected.university}
                {selected.graduation_year && ` · ${selected.graduation_year}`}
                {selected.gpa && <span className="ml-2 text-amber-600 flex items-center gap-0.5"><Star size={10} fill="currentColor" /> {selected.gpa}</span>}
              </div>

              {selected.bio && <p className="text-sm text-gray-600 mb-4 leading-relaxed">{selected.bio}</p>}

              <div className="divider" />

              {selected.skills_list.length > 0 && (
                <div className="mb-4">
                  <p className="section-header">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills_list.map(s => <span key={s} className="skill-chip">{s}</span>)}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {selected.cv_url && (
                  <a href={selected.cv_url} target="_blank" rel="noreferrer" className="btn btn-primary text-sm py-2">
                    <FileText size={14} /> View CV
                  </a>
                )}
                {selected.linkedin_url && (
                  <a href={selected.linkedin_url} target="_blank" rel="noreferrer" className="btn btn-secondary text-sm py-2">
                    <ExternalLink size={14} /> LinkedIn
                  </a>
                )}
                {selected.github_url && (
                  <a href={selected.github_url} target="_blank" rel="noreferrer" className="btn btn-secondary text-sm py-2">
                    <ExternalLink size={14} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Graduates;
