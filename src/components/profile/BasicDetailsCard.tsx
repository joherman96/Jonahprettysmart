import React from 'react';

interface BasicDetailsData {
  preferredName: string;
  pronouns: string;
  year: string;
  major: string;
  minor: string;
  photoUrl: string;
}

const BasicDetailsCard: React.FC<{
  data: BasicDetailsData;
  onChange: (updatedFields: Partial<BasicDetailsData>) => void;
}> = ({ data, onChange }) => {
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md space-y-6">
      {/* Preferred Name */}
      <div>
        <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700">
          Preferred Name
        </label>
        <input
          id="preferredName"
          name="preferredName"
          type="text"
          value={data.preferredName}
          onChange={e => onChange({ preferredName: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="What should we call you?"
          aria-required="true"
        />
      </div>

      {/* Pronouns */}
      <div>
        <label htmlFor="pronouns" className="block text-sm font-medium text-gray-700">
          Pronouns
        </label>
        <select
          id="pronouns"
          name="pronouns"
          value={data.pronouns}
          onChange={e => onChange({ pronouns: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-required="true"
        >
          <option value="">Select pronouns</option>
          <option value="she/her">she/her</option>
          <option value="he/him">he/him</option>
          <option value="they/them">they/them</option>
          <option value="other">other</option>
        </select>
        {data.pronouns === "other" && (
          <input
            type="text"
            value={data.pronouns === "other" ? "" : data.pronouns}
            onChange={e => onChange({ pronouns: e.target.value })}
            className="mt-2 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Please specify your pronouns"
          />
        )}
      </div>

      {/* Year in School */}
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
          Year in School
        </label>
        <select
          id="year"
          name="year"
          value={data.year}
          onChange={e => onChange({ year: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-required="true"
        >
          <option value="">Select year</option>
          <option value="first">First Year</option>
          <option value="sophomore">Sophomore</option>
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
          <option value="graduate">Graduate</option>
        </select>
      </div>

      {/* Major */}
      <div>
        <label htmlFor="major" className="block text-sm font-medium text-gray-700">
          Major
        </label>
        <input
          id="major"
          name="major"
          list="majorsList"
          value={data.major}
          onChange={e => onChange({ major: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Start typing your major"
          aria-required="true"
        />
        <datalist id="majorsList">
          <option value="Business Administration" />
          <option value="Computer Science" />
          <option value="Economics" />
          <option value="Biology" />
          <option value="English" />
          <option value="Psychology" />
          <option value="Engineering" />
          <option value="Mathematics" />
          <option value="Chemistry" />
          <option value="Political Science" />
        </datalist>
      </div>

      {/* Minor */}
      <div>
        <label htmlFor="minor" className="block text-sm font-medium text-gray-700">
          Minor
        </label>
        <input
          id="minor"
          name="minor"
          list="minorsList"
          value={data.minor}
          onChange={e => onChange({ minor: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Start typing your minor (optional)"
        />
        <datalist id="minorsList">
          <option value="Mathematics" />
          <option value="Psychology" />
          <option value="Spanish" />
          <option value="History" />
          <option value="Sociology" />
          <option value="Business" />
          <option value="Computer Science" />
          <option value="Art" />
          <option value="Music" />
          <option value="Philosophy" />
        </datalist>
      </div>

      {/* Profile Photo */}
      <div>
        <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">
          Profile Photo
        </label>
        <input
          id="profilePhoto"
          name="profilePhoto"
          type="file"
          accept="image/*"
          onChange={async e => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                onChange({ photoUrl: reader.result as string });
              };
              reader.readAsDataURL(file);
            }
          }}
          className="mt-1 block w-full text-sm text-gray-700"
        />
        {data.photoUrl && (
          <div className="mt-2">
            <img
              id="previewImg"
              src={data.photoUrl}
              alt="Profile preview"
              className="w-24 h-24 object-cover rounded-full border"
            />
            <label htmlFor="brightness" className="block text-xs text-gray-500 mt-2">
              Adjust Brightness
            </label>
            <input
              id="brightness"
              type="range"
              min="0.5"
              max="1.5"
              step="0.01"
              defaultValue="1"
              onChange={e => {
                const val = parseFloat(e.target.value);
                const imgEl = document.getElementById("previewImg") as HTMLImageElement;
                if (imgEl) {
                  imgEl.style.filter = `brightness(${val})`;
                }
              }}
              className="w-full mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicDetailsCard;