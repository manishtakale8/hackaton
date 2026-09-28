import { useState, useEffect } from 'react';
import { MdSave, MdPerson, MdSchool, MdLocationOn, MdCode } from 'react-icons/md';
import { getProfile, updateProfile } from '../../api/profileApi';
import { CATEGORIES, DEGREES, POPULAR_SKILLS, POPULAR_INTERESTS } from '../../utils/constants';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import SkillsInput from '../../components/profile/SkillsInput';
import InterestsInput from '../../components/profile/InterestsInput';
import { PageLoader } from '../../components/common/Loader';
import { getErrorMessage } from '../../utils/helpers';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getProfile();
        setProfile(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (cat) => {
    const current = profile.preferredCategories || [];
    if (current.includes(cat)) {
      handleChange('preferredCategories', current.filter((c) => c !== cat));
    } else {
      handleChange('preferredCategories', [...current, cat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const { data } = await updateProfile(profile);
      setProfile(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  const completionPct = profile?.completionPercentage ?? 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-500 mt-1">
            Keep your profile updated to get better opportunity recommendations
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">{completionPct}%</div>
          <div className="text-xs text-gray-400">Complete</div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-700"
          style={{ width: `${completionPct}%` }}
        />
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
          ✅ Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <MdPerson size={20} className="text-orange-500" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="fullName"
              label="Full Name"
              value={profile?.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Your full name"
            />
            <Input
              id="profileEmail"
              label="Email"
              type="email"
              value={profile?.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
              disabled
            />
            <Input
              id="location"
              label="Location"
              value={profile?.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, State"
            />
            <Input
              id="bio"
              label="Bio (optional)"
              value={profile?.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="A short introduction about yourself"
            />
          </div>
        </div>

        {/* Education */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <MdSchool size={20} className="text-orange-500" />
            Education
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                id="college"
                label="College / University"
                value={profile?.college || ''}
                onChange={(e) => handleChange('college', e.target.value)}
                placeholder="Your college or university name"
              />
            </div>
            <Select
              id="degree"
              label="Degree"
              value={profile?.degree || ''}
              onChange={(e) => handleChange('degree', e.target.value)}
              options={DEGREES}
              placeholder="Select Degree"
            />
            <Input
              id="branch"
              label="Branch / Major"
              value={profile?.branch || ''}
              onChange={(e) => handleChange('branch', e.target.value)}
              placeholder="e.g., Computer Science"
            />
            <Select
              id="currentYear"
              label="Current Year"
              value={profile?.currentYear || ''}
              onChange={(e) => handleChange('currentYear', parseInt(e.target.value) || '')}
              options={[1, 2, 3, 4, 5, 6, 7].map(y => ({ value: y, label: `Year ${y}` }))}
              placeholder="Select Year"
            />
            <Input
              id="graduationYear"
              label="Expected Graduation Year"
              type="number"
              min="2024"
              max="2035"
              value={profile?.graduationYear || ''}
              onChange={(e) => handleChange('graduationYear', parseInt(e.target.value) || '')}
              placeholder="e.g., 2026"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
            <MdCode size={20} className="text-orange-500" />
            Skills
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Skills are used to calculate your match score (40% weight)
          </p>
          <SkillsInput
            skills={profile?.skills || []}
            onChange={(skills) => handleChange('skills', skills)}
            suggestions={POPULAR_SKILLS}
          />
        </div>

        {/* Interests */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
            💡 Interests
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Interests affect your match score (30% weight)
          </p>
          <InterestsInput
            interests={profile?.interests || []}
            onChange={(interests) => handleChange('interests', interests)}
            suggestions={POPULAR_INTERESTS}
          />
        </div>

        {/* Preferred Categories */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
            🎯 Preferred Opportunity Types
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Category preference affects your match score (20% weight)
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryToggle(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  (profile?.preferredCategories || []).includes(cat)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" loading={saving} size="lg" className="w-full sm:w-auto">
          <MdSave size={18} />
          Save Profile
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
