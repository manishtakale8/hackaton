import { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

const InterestsInput = ({ interests = [], onChange, suggestions = [] }) => {
  const [input, setInput] = useState('');

  const addInterest = (interest) => {
    const trimmed = interest.trim();
    if (!trimmed) return;
    const normalized = trimmed.toLowerCase();
    if (!interests.map(i => i.toLowerCase()).includes(normalized)) {
      onChange([...interests, trimmed]);
    }
    setInput('');
  };

  const removeInterest = (item) => {
    onChange(interests.filter((i) => i !== item));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addInterest(input);
    }
  };

  const availableSuggestions = suggestions.filter(
    (s) => !interests.map(i => i.toLowerCase()).includes(s.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {interests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <span
              key={interest}
              className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-sm px-3 py-1 rounded-full"
            >
              {interest}
              <button
                type="button"
                onClick={() => removeInterest(interest)}
                className="hover:text-red-500 transition-colors"
              >
                <MdClose size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an interest and press Enter..."
          className="input-field flex-1"
        />
        <button
          type="button"
          onClick={() => addInterest(input)}
          className="btn-outline px-3 py-2"
          disabled={!input.trim()}
        >
          <MdAdd size={18} />
        </button>
      </div>

      {availableSuggestions.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Suggestions:</p>
          <div className="flex flex-wrap gap-1.5">
            {availableSuggestions.slice(0, 10).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addInterest(s)}
                className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestsInput;
