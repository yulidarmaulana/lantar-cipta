import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, User, Briefcase, Network, Cpu, FileText, Upload, Smartphone, MonitorSmartphone } from 'lucide-react';

export default function RFQForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // In a real application, you would send this to your backend
    console.log('Form submitted:', data);

    // Show success message
    alert('Thank you for your request! We will contact you within 24 hours.');
    form.reset();
  };

  return (
    <form className="space-y-6" id="rfq-form" onSubmit={handleSubmit} name="rfq-form">
      {/* Contact Information */}
      <div>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-300 to-green-600 flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Contact Information
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Enter your NIK"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Enter your full name"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Enter your email"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label.Root
              htmlFor="education"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pendidikan <span className="text-red-500">*</span>
            </Label.Root>
            <select
              id="education"
              name="education"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            >
              <option value="">Pendidikan Terakhir</option>
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
              Tanggal Lahir <span className="text-red-500">*</span>
            </Label.Root>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      {/* Service Requirements */}
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
                    className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                  >
                    <Checkbox.Root
                      id={service.id}
                      name="services"
                      value={service.id}
                      className="w-5 h-5 flex items-center justify-center border-2 border-gray-300 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-colors shrink-0"
                    >
                      <Checkbox.Indicator>
                        <Check className="w-4 h-4 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                      <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
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
                  className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
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
          className="w-full bg-linear-to-r from-green-300 to-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:shadow-xl active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Submit Application</span>
          {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg> */}
        </button>
        {/* <p className="text-sm text-gray-500 text-center mt-4">
          By submitting this form, you agree to our Privacy Policy and Terms of
          Service.
        </p> */}
      </div>
    </form>
  );
}

