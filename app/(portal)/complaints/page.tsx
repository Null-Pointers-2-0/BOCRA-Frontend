"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import PortalHeader from "@/components/PortalHeader";
import { 
  FileText, 
  MagnifyingGlass,
  UploadSimple,
  Warning,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Minus,
  ShieldCheck,
  Ruler,
  Phone,
  Envelope,
  DeviceMobile,
  Broadcast,
  Package,
  SignOut
} from "@phosphor-icons/react";

export default function Complaints() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  const [isClient, setIsClient] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceSector: "",
    issueType: "",
    description: "",
    complaintId: "",
    complaintCompany: "",
    customCompanyName: "",
    billingIssue: "",
    equipmentIssue: "",
    contractIssue: "",
    repairIssue: ""
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);

  const serviceSectors = ["Telecommunications", "Broadcasting", "Postal Services"];
  const regulatedCompanies = [
    "Botswana Telecommunications Corporation",
    "Orange Botswana",
    "Liquid Telecom",
    "Botswana Television",
    "Radio Botswana",
    "Yarona FM",
    "Duma FM",
    "Gabz FM",
    "Botswana Post",
    "Courier companies",
    "Other company"
  ];

  const billingIssues = ["Incorrect charges", "Overbilling", "Unexplained fees", "Billing disputes", "Late payment penalties", "Deposit issues"];
  const equipmentIssues = ["Faulty equipment", "Poor signal quality", "Service interruptions", "Installation problems", "Equipment not working", "Replacement issues"];
  const contractIssues = ["Contract termination", "Contract terms", "Early termination fees", "Service level agreement breaches", "Unauthorized contract changes", "Contract renewal issues"];
  const repairIssues = ["Service outages", "Connection problems", "Repair delays", "Poor customer service", "Technical support issues", "Maintenance problems"];

  const activeComplaints = [
    { id: "BOC-2023-112", title: "Mobile network coverage issues", status: "investigating", sector: "telecommunications", icon: DeviceMobile },
    { id: "BOC-2023-108", title: "TV signal quality problems", status: "resolved", sector: "broadcasting", icon: Broadcast },
    { id: "BOC-2023-095", title: "Package delivery delays", status: "pending", sector: "postal", icon: Package }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Complaint submitted:', formData);
    setFormData({
      serviceSector: "",
      issueType: "",
      description: "",
      complaintId: "",
      complaintCompany: "",
      customCompanyName: "",
      billingIssue: "",
      equipmentIssue: "",
      contractIssue: "",
      repairIssue: ""
    });
    setCurrentStep(1);
    setUploadedFiles([]);
  };

  const handleFeedbackSubmit = () => {
    console.log('Feedback submitted:', selectedFeedback);
    setSelectedFeedback(null);
  };

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case "telecommunications": return "border-blue-600 bg-blue-50 text-blue-700";
      case "broadcasting": return "border-green-600 bg-green-50 text-green-700";
      case "postal": return "border-rose-600 bg-rose-50 text-rose-700";
      default: return "border-blue-600 bg-blue-50 text-blue-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investigating": return "border-amber-600 bg-amber-50 text-amber-700";
      case "resolved": return "border-green-600 bg-green-50 text-green-700";
      case "pending": return "border-blue-600 bg-blue-50 text-blue-700";
      default: return "border-slate-600 bg-slate-50 text-slate-700";
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-24 md:pb-0">
      <PortalHeader 
        title="File a Complaint"
        subtitle="If you're having issues with your telecommunications, broadcasting, or postal services, we're here to ensure your rights are protected."
        showNewApplicationButton={false}
      />
      <div className="pt-24 md:pt-0 p-4 md:p-8 space-y-8">
      <section className={`rounded-xl bg-gradient-to-r from-blue-600/10 to-transparent p-8 border border-blue-600/5 ${isDarkMode ? 'bg-blue-600/5' : ''}`}>
        <h2 className={`text-3xl font-black ${isDarkMode ? 'text-slate-900' : 'text-gray-900'} sm:text-4xl`}>How can we help you today?</h2>
        <p className={`mt-2 max-w-2xl text-lg ${isDarkMode ? 'text-slate-600' : 'text-gray-600'}`}>
          If you're having issues with your telecommunications, broadcasting, or postal services, we're here to ensure your rights are protected.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? 'bg-white border-slate-200' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-4">
              <MagnifyingGlass size={20} className="text-blue-700" />
              <h3 className="text-lg font-bold">Quick Status Check</h3>
            </div>
            <div className="flex gap-2">
              <input 
                className={`w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400' : 'border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400'}`} 
                placeholder="Enter Complaint ID (e.g., BOC-2023-456)" 
                type="text"
                value={formData.complaintId}
                onChange={(e) => handleInputChange('complaintId', e.target.value)}
              />
              <button className="rounded-lg bg-blue-700 px-6 py-2 text-sm font-bold text-white hover:bg-blue-800 transition-colors">Track</button>
            </div>
          </section>

          <section className={`rounded-xl p-8 shadow-sm border ${isDarkMode ? 'bg-white border-slate-200' : 'bg-white border-gray-200'}`}>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={24} className="text-blue-700" />
                <h3 className="text-xl font-bold">Submit a New Complaint</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Step {currentStep} of {totalSteps}</span>
                <div className="flex gap-1">
                  {[...Array(totalSteps)].map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full ${index < currentStep ? 'bg-blue-600' : index === currentStep - 1 ? 'bg-blue-400' : 'bg-slate-300'}`} />
                  ))}
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Service Sector</label>
                      <select className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`} value={formData.serviceSector} onChange={(e) => handleInputChange('serviceSector', e.target.value)}>
                        {serviceSectors.map(sector => <option key={sector} value={sector}>{sector}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Company</label>
                      <select className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`} value={formData.complaintCompany} onChange={(e) => handleInputChange('complaintCompany', e.target.value)}>
                        <option value="">Select a company...</option>
                        {regulatedCompanies.map((company) => <option key={company} value={company}>{company}</option>)}
                      </select>
                    </div>
                  </div>

                  {formData.complaintCompany === "Other company" && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Enter Company Name</label>
                      <input type="text" className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400' : 'border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400'}`} placeholder="Type the company name" value={formData.customCompanyName} onChange={(e) => handleInputChange('customCompanyName', e.target.value)} />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Billing Issues</label>
                      <select className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`} value={formData.billingIssue} onChange={(e) => handleInputChange('billingIssue', e.target.value)}>
                        <option value="">Select a billing issue...</option>
                        {billingIssues.map((issue, index) => <option key={index} value={issue}>{issue}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Equipment Problems</label>
                      <select className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`} value={formData.equipmentIssue} onChange={(e) => handleInputChange('equipmentIssue', e.target.value)}>
                        <option value="">Select an equipment issue...</option>
                        {equipmentIssues.map((issue, index) => <option key={index} value={issue}>{issue}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Contract Issues</label>
                      <select className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`} value={formData.contractIssue} onChange={(e) => handleInputChange('contractIssue', e.target.value)}>
                        <option value="">Select a contract issue...</option>
                        {contractIssues.map((issue, index) => <option key={index} value={issue}>{issue}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Repair & Connection Issues</label>
                      <select className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`} value={formData.repairIssue} onChange={(e) => handleInputChange('repairIssue', e.target.value)}>
                        <option value="">Select a repair/connection issue...</option>
                        {repairIssues.map((issue, index) => <option key={index} value={issue}>{issue}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-semibold">Detailed Description</label>
                    <textarea className={`w-full rounded-lg border p-3 text-sm focus:border-blue-600 focus:ring-blue-600 ${isDarkMode ? 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400' : 'border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400'}`} placeholder="Please describe the issue in detail, including dates and any prior communication with the provider..." rows={4} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold text-slate-700">Upload Supporting Documents</h4>
                    <p className="text-sm text-slate-500 mt-1">Provide evidence to support your complaint</p>
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-semibold">Supporting Evidence</label>
                    <div className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors hover:border-blue-600 ${isDarkMode ? 'border-slate-200' : 'border-gray-200'}`}>
                      <UploadSimple size={40} className="mb-2 text-slate-400" />
                      <p className="text-sm font-medium">Drag & drop files here, or <span className="text-blue-600 cursor-pointer">browse</span></p>
                      <p className="mt-1 text-xs text-slate-400">Upload receipts, screenshots, or correspondence (PDF, PNG, JPG up to 10MB)</p>
                      <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">Choose Files</label>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className={`flex items-center justify-between rounded-lg border p-3 ${isDarkMode ? 'border-slate-200 bg-slate-50' : 'border-gray-200 bg-gray-50'}`}>
                            <span className="text-sm font-medium">{file.name}</span>
                            <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 transition-colors">
                              <SignOut size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className={`rounded-xl border-2 p-6 ${isDarkMode ? 'bg-amber-900/30 border-amber-600 text-amber-200' : 'bg-amber-50 border-amber-400 text-amber-900'}`}>
                <div className="flex items-start gap-3">
                  <div className={`rounded-full p-2 ${isDarkMode ? 'bg-amber-800' : 'bg-amber-200'}`}>
                    <Warning size={20} className={isDarkMode ? 'text-amber-300' : 'text-amber-700'} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-amber-100' : 'text-amber-900'}`}>Important Information Before Submitting</h4>
                    <div className={`space-y-2 text-sm ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                      <p>• By submitting, you agree that BOCRA may share this information with the relevant service provider for investigation.</p>
                      <p>• Try to resolve directly with your provider - speak to customer service managers/senior representatives.</p>
                      <p>• Get full names, positions of managers, and record time/date of conversations.</p>
                      <p>• Keep copies of written complaints, contracts, bills, and correspondence (no original documents).</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button type="button" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} className={`rounded-lg px-6 py-3 font-bold transition-colors ${currentStep === 1 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-600 text-white hover:bg-slate-700'}`} disabled={currentStep === 1}>Previous</button>
                {currentStep < totalSteps ? (
                  <button type="button" onClick={() => setCurrentStep(currentStep + 1)} className="rounded-lg bg-blue-700 px-8 py-3 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-800 transition-colors">Next Step</button>
                ) : (
                  <button type="submit" className="rounded-lg bg-green-600 px-8 py-3 font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors">Submit Case</button>
                )}
              </div>
            </form>
          </section>

          <section className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? 'bg-white border-slate-200' : 'bg-white border-gray-200'}`}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold">My Active Complaints</h3>
              <a className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors" href="#">View All</a>
            </div>
            <div className="space-y-4">
              {activeComplaints.map((complaint, index) => {
                const Icon = complaint.icon;
                return (
                  <div key={index} className={`flex items-center justify-between rounded-lg border p-4 ${isDarkMode ? 'border-slate-100' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full p-2 ${getSectorColor(complaint.sector)}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{complaint.id}</p>
                        <p className="text-xs text-slate-500">{complaint.title}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(complaint.status)}`}>{complaint.status}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl bg-blue-700 p-6 text-white">
            <h3 className="mb-4 text-xl font-bold">Knowledge Center</h3>
            <div className="space-y-4">
              <div className="group cursor-pointer rounded-lg bg-white/10 p-4 transition-colors hover:bg-white/20">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-amber-300" />
                  <h4 className="font-bold">Know Your Rights</h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-blue-100">Understand what you are entitled to as a consumer under Botswana laws.</p>
              </div>
              <div className="group cursor-pointer rounded-lg bg-white/10 p-4 transition-colors hover:bg-white/20">
                <div className="flex items-center gap-3">
                  <Ruler size={20} className="text-green-300" />
                  <h4 className="font-bold">Before You Lodge</h4>
                </div>
                <ul className="mt-2 space-y-2 text-xs text-blue-100">
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-amber-300 flex-shrink-0 mt-0.5" /><span>Contact provider customer support first.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-amber-300 flex-shrink-0 mt-0.5" /><span>Keep your reference number.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-amber-300 flex-shrink-0 mt-0.5" /><span>Allow 14 days for their resolution.</span></li>
                </ul>
              </div>
            </div>
          </section>

          <section className={`rounded-xl p-6 shadow-sm border ${isDarkMode ? 'bg-white border-slate-200' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={20} className="text-green-600" />
              <h3 className="text-lg font-bold">Rate Our Service</h3>
            </div>
            <p className={`mb-4 text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Was your complaint <strong>BOC-2023-112</strong> resolved satisfactorily?</p>
            <div className="flex justify-between gap-2">
              <button type="button" onClick={() => setSelectedFeedback(1)} className={`flex-1 rounded-lg border p-2 text-center transition-colors ${selectedFeedback === 1 ? 'border-rose-600 bg-rose-50 text-rose-600' : isDarkMode ? 'border-slate-200 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                <ThumbsDown size={20} className={selectedFeedback === 1 ? 'text-rose-600' : 'text-rose-400'} />
              </button>
              <button type="button" onClick={() => setSelectedFeedback(2)} className={`flex-1 rounded-lg border p-2 text-center transition-colors ${selectedFeedback === 2 ? 'border-orange-400 bg-orange-50 text-orange-400' : isDarkMode ? 'border-slate-200 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                <Minus size={20} className={selectedFeedback === 2 ? 'text-orange-400' : 'text-orange-400'} />
              </button>
              <button type="button" onClick={() => setSelectedFeedback(3)} className={`flex-1 rounded-lg border p-2 text-center transition-colors ${selectedFeedback === 3 ? 'border-amber-400 bg-amber-50 text-amber-400' : isDarkMode ? 'border-slate-200 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                <ThumbsUp size={20} className={selectedFeedback === 3 ? 'text-amber-400' : 'text-amber-400'} />
              </button>
              <button type="button" onClick={() => setSelectedFeedback(4)} className={`flex-1 rounded-lg border p-2 text-center transition-colors ${selectedFeedback === 4 ? 'border-green-600 bg-green-50 text-green-600' : isDarkMode ? 'border-slate-200 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                <Heart size={20} className={selectedFeedback === 4 ? 'text-green-600' : 'text-green-600'} />
              </button>
            </div>
            <button onClick={handleFeedbackSubmit} className={`mt-4 w-full rounded-lg py-2 text-xs font-bold transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Submit Feedback</button>
          </section>

          <div className="relative overflow-hidden rounded-xl bg-slate-900 p-6 text-white shadow-xl">
            <div className="relative z-10">
              <h4 className="text-lg font-bold">Need direct help?</h4>
              <p className="mt-1 text-sm text-slate-400">Our agents are online Mon-Fri.</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm"><Phone size={16} className="text-amber-300" /><span>Toll Free: 0800 600 000</span></div>
                <div className="flex items-center gap-2 text-sm"><Envelope size={16} className="text-blue-300" /><span>consumers@bocra.org.bw</span></div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-600/20 blur-2xl"></div>
            <div className="absolute left-1/2 -bottom-4 h-16 w-16 rounded-full bg-rose-600/10 blur-xl"></div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
