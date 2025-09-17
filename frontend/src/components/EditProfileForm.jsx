import React, { useState } from 'react'
import useProfileStore from '../store/profileStore'
import CreatableSelect from 'react-select/creatable'

const EditProfileForm = ({ onClose }) => {
  const { profile, updateProfile } = useProfileStore()
  const [formData, setFormData] = useState({ ...profile })
  const [preview, setPreview] = useState(profile.avatar || '')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSkillChange = (index, key, value) => {
    const newSkills = [...formData.skills]
    newSkills[index][key] = key === 'value' ? Number(value) : value
    setFormData((prev) => ({ ...prev, skills: newSkills }))
  }

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: '', value: 0 }],
    }))
  }

  const removeSkill = (index) => {
    const newSkills = [...formData.skills]
    newSkills.splice(index, 1)
    setFormData((prev) => ({ ...prev, skills: newSkills }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }))
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 2-column grid for most inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium">Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {preview && (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-24 h-24 mt-2 rounded-full object-cover border"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium">College</label>
              <input name="college" value={formData.college} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium">Year</label>
              <input name="year" value={formData.year} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium">Branch</label>
              <input name="branch" value={formData.branch} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium">Stream</label>
              <input name="stream" value={formData.stream} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </div>
          </div>

          {/* Interests and Goals using react-select */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Interests</label>
              <CreatableSelect
                isMulti
                value={formData.interests.map(i => ({ label: i, value: i }))}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    interests: selected.map((item) => item.value),
                  }))
                }
                placeholder="Search or add interests"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Goals</label>
              <CreatableSelect
                isMulti
                value={formData.goals.map(i => ({ label: i, value: i }))}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    goals: selected.map((item) => item.value),
                  }))
                }
                placeholder="Search or add goals"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-2">Skills & Competency (%)</label>
            <div className="space-y-3">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                    placeholder="Skill Name"
                    className="flex-1 border px-2 py-1 rounded-md"
                  />
                  <input
                    type="number"
                    value={skill.value}
                    onChange={(e) => handleSkillChange(index, 'value', e.target.value)}
                    placeholder="Competency %"
                    className="w-24 border px-2 py-1 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSkill} className="text-blue-600 text-sm">
                + Add Skill
              </button>
            </div>
          </div>

          {/* Submit & Cancel */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileForm