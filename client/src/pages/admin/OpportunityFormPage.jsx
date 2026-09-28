import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdSave } from 'react-icons/md';
import {
  createOpportunity,
  updateOpportunity,
  getOpportunityById,
} from '../../api/opportunityApi';
import { CATEGORIES, MODES, POPULAR_SKILLS, POPULAR_INTERESTS } from '../../utils/constants';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import SkillsInput from '../../components/profile/SkillsInput';
import InterestsInput from '../../components/profile/InterestsInput';
import { PageLoader } from '../../components/common/Loader';
import { getErrorMessage } from '../../utils/helpers';

const EMPTY_FORM = {
  title: '',
  organization: '',
  description: '',
  category: '',
  mode: '',
  location: '',
  deadline: '',
  applicationUrl: '',
  eligibility: '',
  skills: [],
  interests: [],
  isSampleData: false,
  isActive: true,
};

const OpportunityFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const { data } = await getOpportunityById(id);
        setForm({
          ...data,
          deadline: data.deadline
            ? new Date(data.deadline).toISOString().split('T')[0]
            : '',
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return 'Title is required';
    if (!form.organization.trim()) return 'Organization is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.category) return 'Category is required';
    if (!form.mode) return 'Mode is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      if (!payload.deadline) delete payload.deadline;
      if (isEdit) {
        await updateOpportunity(id, payload);
      } else {
        await createOpportunity(payload);
      }
      navigate('/admin/opportunities');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <MdArrowBack size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Opportunity' : 'Add New Opportunity'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEdit ? 'Update the opportunity details' : 'Fill in the details to publish a new opportunity'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Basic Information</h2>
          <Input
            id="opp-title"
            label="Title"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Opportunity title"
            required
          />
          <Input
            id="opp-org"
            label="Organization"
            value={form.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
            placeholder="Organization or company name"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={5}
              placeholder="Describe the opportunity in detail..."
              className="input-field resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eligibility Criteria
            </label>
            <textarea
              value={form.eligibility}
              onChange={(e) => handleChange('eligibility', e.target.value)}
              rows={2}
              placeholder="Who can apply? Any specific requirements?"
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Classification */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Classification</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="opp-category"
              label="Category"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              options={CATEGORIES}
              placeholder="Select Category"
              required
            />
            <Select
              id="opp-mode"
              label="Mode"
              value={form.mode}
              onChange={(e) => handleChange('mode', e.target.value)}
              options={MODES}
              placeholder="Select Mode"
              required
            />
            <Input
              id="opp-location"
              label="Location"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Location (e.g., Remote, City, Hybrid)"
            />
            <Input
              id="opp-deadline"
              label="Deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
            />
            <div className="sm:col-span-2">
              <Input
                id="opp-url"
                label="Application URL"
                type="url"
                value={form.applicationUrl}
                onChange={(e) => handleChange('applicationUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Skills & Interests */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Skills & Interests (for matching)</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
            <SkillsInput
              skills={form.skills}
              onChange={(skills) => handleChange('skills', skills)}
              suggestions={POPULAR_SKILLS}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Related Interests</label>
            <InterestsInput
              interests={form.interests}
              onChange={(interests) => handleChange('interests', interests)}
              suggestions={POPULAR_INTERESTS}
            />
          </div>
        </div>

        {/* Options */}
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold text-gray-900">Options</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isSampleData}
              onChange={(e) => handleChange('isSampleData', e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded"
            />
            <span className="text-sm text-gray-700">
              Label as <strong>DEMO DATA</strong> (test fixture for development, not a real opportunity)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded"
            />
            <span className="text-sm text-gray-700">Active (visible to students)</span>
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={saving} size="lg">
            <MdSave size={18} />
            {isEdit ? 'Save Changes' : 'Publish Opportunity'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OpportunityFormPage;
