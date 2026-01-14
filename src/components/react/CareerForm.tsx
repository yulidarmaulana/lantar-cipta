import React, { useState } from 'react';
import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
import {
  Check,
  User,
  Briefcase,
  Network,
  Cpu,
  FileText,
  Upload,
  Smartphone,
  MonitorSmartphone,
  Loader2
} from 'lucide-react';
import { useApplicationStore } from '../../store/applicationStore';

export default function CareerForm() {
  const { submitApplication } = useApplicationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  const handlePositionChange = (checked: boolean | string, id: string) => {
    if (checked === true) {
      setSelectedPositions(prev => [...prev, id]);
    } else {
      setSelectedPositions(prev => prev.filter(pos => pos !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (selectedPositions.length === 0) {
      alert('Please select at least one position.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const cvFile = formData.get('cv') as File;

    if (!cvFile || cvFile.size === 0) {
      alert('Please upload your CV.');
      return;
    }

    setIsSubmitting(true);

    const applicationData = {
      nik: formData.get('nik') as string,
      full_name: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      education: formData.get('education') as string,
      birth_date: formData.get('birthDate') as string,
      positions: selectedPositions,
    };

    const result = await submitApplication(applicationData, cvFile);

    if (result.success) {
      alert('Thank you for your application! Our recruitment team will review your CV and contact you soon.');
      form.reset();
      setSelectedPositions([]);
    } else {
      alert(`Error: ${result.error || 'Failed to submit application. Please check if Supabase Bucket "resumes" is created and public.'}`);
    }

    setIsSubmitting(false);
  };

  return (
    <form className="space-y-6" id="career-form" onSubmit={handleSubmit} name="career-form">
      {/* Personal Information */}
      <div>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-300 to-green-600 flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Personal Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label.Root
              htmlFor="nik"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              NIK <span className="text-red-500">*</span>
            </Label.Root>
            <input
              type="number"
              id="nik"
              name="nik"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A9CE3C] focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="Enter your NIK"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label.Root
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </Label.Root>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A9CE3C] focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label.Root
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email <span className="text-red-500">*</span>
            </Label.Root>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A9CE3C] focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label.Root
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number <span className="text-red-500">*</span>
            </Label.Root>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A9CE3C] focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="Enter your phone number"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label.Root
              htmlFor="education"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Education <span className="text-red-500">*</span>
            </Label.Root>
            <select
              id="education"
              name="education"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A9CE3C] focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400"
              disabled={isSubmitting}
            >
              <option value="">Last Education</option>
              <option value="s3">S3</option>
              <option value="s2">S2</option>
              <option value="s1">S1</option>
              <option value="d3">D3</option>
              <option value="d2">D2</option>
              <option value="d1">D1</option>
              <option value="sma">SMA</option>
              <option value="smk">SMK</option>
            </select>
          </div>

          <div>
            <Label.Root
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date of Birth <span className="text-red-500">*</span>
            </Label.Root>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A9CE3C] focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-300 to-green-600 flex items-center justify-center mr-3">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Applying for Position
          </h2>
        </div>
        <div className="space-y-6">
          <div>
            <Label.Root className="block text-sm font-medium text-gray-700 mb-3">
              Position : <span className="text-red-500">*</span>
            </Label.Root>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'frontend', label: 'Frontend Developer', icon: Cpu },
                { id: 'backend', label: 'Backend Developer', icon: Network },
                { id: 'fullstack', label: 'Fullstack Developer', icon: MonitorSmartphone },
                { id: 'uiux', label: 'UI/UX Designer', icon: Smartphone },
                { id: 'pm', label: 'Project Manager', icon: Briefcase },
                { id: 'analyst', label: 'System Analyst', icon: FileText },
              ].map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.id}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-all cursor-pointer group ${selectedPositions.includes(service.id)
                        ? 'border-[#A9CE3C] bg-[#A9CE3C]/5'
                        : 'border-gray-200 hover:border-[#A9CE3C] hover:bg-[#A9CE3C]/5'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Checkbox.Root
                      id={service.id}
                      name="positions"
                      value={service.id}
                      checked={selectedPositions.includes(service.id)}
                      onCheckedChange={(checked) => handlePositionChange(checked, service.id)}
                      disabled={isSubmitting}
                      className="w-5 h-5 flex items-center justify-center border-2 border-gray-300 rounded data-[state=checked]:bg-[#A9CE3C] data-[state=checked]:border-[#A9CE3C] transition-colors shrink-0"
                    >
                      <Checkbox.Indicator>
                        <Check className="w-4 h-4 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#A9CE3C]/10 flex items-center justify-center shrink-0 transition-colors">
                      <IconComponent className={`w-4 h-4 transition-colors ${selectedPositions.includes(service.id) ? 'text-[#A9CE3C]' : 'text-gray-600 group-hover:text-[#A9CE3C]'
                        }`} />
                    </div>
                    <Label.Root
                      htmlFor={service.id}
                      className="text-sm font-medium text-gray-700 cursor-pointer flex-1 group-hover:text-gray-900 transition-colors"
                    >
                      {service.label}
                    </Label.Root>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label.Root
                htmlFor="cv"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Upload className="w-4 h-4 mr-2 text-gray-500" />
                Upload CV / Resume <span className="text-red-500 ml-1">*</span>
              </Label.Root>
              <div className="relative">
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  required
                  accept=".pdf,.doc,.docx"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A9CE3C] focus:border-[#A9CE3C] transition file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#A9CE3C]/10 file:text-[#A9CE3C] hover:file:bg-[#A9CE3C]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX. Max size: 5MB.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-green-300 to-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:shadow-xl active:scale-95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <span>Submit Application</span>
          )}
        </button>
      </div>
    </form>
  );
}
