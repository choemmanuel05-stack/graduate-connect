import React, { useState, useEffect } from 'react';
import { Upload, Save, User, BookOpen, Briefcase, Link } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  validatePhone, validateUrl, validateLinkedIn, validateGitHub,
  validateGPA, validateGraduationYear, normalizeUrl,
} from '../utils/validators';

// Inline error helper
const FieldErr: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '0.25rem' }}>⚠ {msg}</p> : null;

const GraduateProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const data: any = await api.get('/graduates/profile/');
      setProfile(data);
    } catch {
      setProfile({ full_name: user?.fullName || '', phone: '', bio: '', university: '', degree: '', field_of_study: '', graduation_year: '', gpa: '', skills: '', linkedin_url: '', github_url: '', portfolio_url: '', is_available: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate before saving
    const errs: Record<string, string> = {};
    if (profile?.phone) { const e = validatePhone(profile.phone); if (e) errs.phone = e; }
    if (profile?.gpa) { const e = validateGPA(String(profile.gpa)); if (e) errs.gpa = e; }
    if (profile?.graduation_year) { const e = validateGraduationYear(String(profile.graduation_year)); if (e) errs.graduation_year = e; }
    if (profile?.linkedin_url) { const e = validateLinkedIn(profile.linkedin_url); if (e) errs.linkedin_url = e; }
    if (profile?.github_url) { const e = validateGitHub(profile.github_url); if (e) errs.github_url = e; }
    if (profile?.portfolio_url) { const e = validateUrl(profile.portfolio_url, 'Portfolio URL'); if (e) errs.portfolio_url = e; }

    if (Object.keys(errs).length > 0) { setFieldErrors(errs); setMessage('Please fix the errors below'); return; }
    setFieldErrors({});
    setSaving(true);
    setMessage('');
    try {
      const formData = new FormData();
      // Normalize URLs before saving
      const toSave = { ...profile };
      if (toSave.linkedin_url) toSave.linkedin_url = normalizeUrl(toSave.linkedin_url);
      if (toSave.github_url) toSave.github_url = normalizeUrl(toSave.github_url);
      if (toSave.portfolio_url) toSave.portfolio_url = normalizeUrl(toSave.portfolio_url);
      Object.entries(toSave).forEach(([k, v]) => {
        if (v !== null && v !== undefined) formData.append(k, String(v));
      });
      if (cvFile) formData.append('cv', cvFile);
      if (photoFile) formData.append('profile_photo', photoFile);
      await api.put('/graduates/profile/', formData);
      setMessage('Profile saved successfully!');
    } catch {
      setMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProfile((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* Photo */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            {profile?.photo_url
              ? <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
              : <User size={32} className="text-blue-400" />
            }
          </div>
          <div>
            <label className="cursor-pointer flex items-center gap-2 text-sm text-[#0A66C2] hover:underline">
              <Upload size={14} /> Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
            </label>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/* Personal Info */}
        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            <User size={14} /> Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input name="full_name" value={profile?.full_name || ''} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input name="phone" value={profile?.phone || ''} onChange={handleChange}
                placeholder="+237 677 123 456"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <FieldErr msg={fieldErrors.phone} />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">Bio</label>
            <textarea name="bio" value={profile?.bio || ''} onChange={handleChange} rows={3}
              placeholder="Tell employers about yourself..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </section>

        {/* Education */}
        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            <BookOpen size={14} /> Education
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">University</label>
              <input name="university" value={profile?.university || ''} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Degree</label>
              <select name="degree" value={profile?.degree || ''} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select degree</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Field of Study</label>
              <input name="field_of_study" value={profile?.field_of_study || ''} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Graduation Year</label>
              <input name="graduation_year" type="number" value={profile?.graduation_year || ''} onChange={handleChange}
                placeholder="e.g. 2024" min="1950" max="2030"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <FieldErr msg={fieldErrors.graduation_year} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">GPA <span className="text-gray-400 font-normal">(0.0 – 4.0)</span></label>
              <input name="gpa" type="number" step="0.01" min="0" max="4" value={profile?.gpa || ''} onChange={handleChange}
                placeholder="e.g. 3.75"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <FieldErr msg={fieldErrors.gpa} />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            <Briefcase size={14} /> Skills
          </h2>
          <input name="skills" value={profile?.skills || ''} onChange={handleChange}
            placeholder="e.g. Python, React, SQL, Communication"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
        </section>

        {/* CV Upload */}
        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            <Upload size={14} /> CV / Resume
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {profile?.cv_url
              ? <a href={profile.cv_url} target="_blank" rel="noreferrer" className="text-[#0A66C2] text-sm hover:underline">View current CV</a>
              : <p className="text-gray-400 text-sm">No CV uploaded yet</p>
            }
            <label className="mt-2 cursor-pointer inline-flex items-center gap-2 text-sm text-[#0A66C2] hover:underline">
              <Upload size={14} /> {profile?.cv_url ? 'Replace CV' : 'Upload CV'}
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setCvFile(e.target.files?.[0] || null)} />
            </label>
            {cvFile && <p className="text-xs text-green-600 mt-1">Selected: {cvFile.name}</p>}
            <p className="text-xs text-gray-400 mt-1">PDF, DOC up to 10MB</p>
          </div>
        </section>

        {/* Links */}
        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            <Link size={14} /> Links
          </h2>
          <div className="space-y-3">
            <div>
              <input name="linkedin_url" value={profile?.linkedin_url || ''} onChange={handleChange}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <FieldErr msg={fieldErrors.linkedin_url} />
            </div>
            <div>
              <input name="github_url" value={profile?.github_url || ''} onChange={handleChange}
                placeholder="https://github.com/yourname"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <FieldErr msg={fieldErrors.github_url} />
            </div>
            <div>
              <input name="portfolio_url" value={profile?.portfolio_url || ''} onChange={handleChange}
                placeholder="https://yourportfolio.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <FieldErr msg={fieldErrors.portfolio_url} />
            </div>
          </div>
        </section>

        {/* Available toggle */}
        <div className="flex items-center gap-3 mb-6">
          <input type="checkbox" id="available" name="is_available" checked={profile?.is_available || false}
            onChange={handleChange} className="w-4 h-4 text-blue-600" />
          <label htmlFor="available" className="text-sm text-gray-700">I am open to job opportunities</label>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
};

export default GraduateProfile;
