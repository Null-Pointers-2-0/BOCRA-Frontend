"use client";

import React, { useState } from 'react';
import { 
  X, 
  CaretLeft, 
  CaretRight, 
  Upload, 
  CheckCircle, 
  Circle,
  ChatsCircle,
  CloudArrowUp,
  Envelope,
  ChartLine,
  FileText,
  WarningCircle,
  IdentificationCard, 
  Bell, 
  User,
  Plus,
  Airplane,
  Network,
  ArrowsHorizontal,
  House,
  FolderOpen,
  Gear,
  PlusCircle,
  ArrowRight,
  FloppyDisk
} from '@phosphor-icons/react';

interface ApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  licenseTitle: string;
  licenseCategory: string;
}

export default function ApplicationDialog({ isOpen, onClose, licenseTitle, licenseCategory }: ApplicationDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Applicant Information
    companyName: '',
    registrationNumber: '',
    taxId: '',
    email: '',
    coverageArea: 'national',
    commencementDate: '',
    duration: '15',
    
    // Amateur Radio Base Station Details
    stationType: 'fixed',
    stationName: '',
    street: '',
    ward: '',
    siteAltitude: '',
    areaOfOperation: '',
    city: '',
    latitude: '',
    region: '',
    longitude: '',
    country: 'Botswana',
    numberOfSites: '1',
    serviceClass: '',
    stationClass: '',
    barsCertNo: '',
    
    // Amateur Equipment Details
    equipmentType: 'transceiver',
    callsign: '',
    approvalNumber: '',
    make: '',
    model: '',
    serialNumber: '',
    frequencyRange: '',
    bandwidth: '',
    preferredFrequencyBand: '',
    outputPower: '',
    totalPresetChannels: '',
    channelWidth: '',
    emissionClass: '',
    modulationType: '',
    rxSensitivity: '',
    rxSelectivity: '',
    
    // Amateur Antenna Details
    antennaType: '',
    antennaGain: '',
    polarization: '',
    antennaHeight: '',
    mainLobeAzimuth: '',
    beamWidth: '',
    feedType: '',
    feedLength: '',
    
    // Cellular Operational Site Details
    cellularStationName: '',
    cellularStreet: '',
    cellularWard: '',
    cellularSiteAltitude: '',
    cellularCity: '',
    cellularLatitude: '',
    cellularRegion: '',
    cellularLongitude: '',
    cellularCountry: 'Botswana',
    contactPersonAtSite: '',
    cellularServiceClass: '',
    cellularStationClass: '',
    siteTelNo: '',
    siteFaxNo: '',
    
    // Cellular Broadcasting Equipment
    cellularCallsign: '',
    cellularApprovalNumber: '',
    cellularMake: '',
    cellularModel: '',
    cellularSerialNumber: '',
    cellularFrequencyRange: '',
    cellularBandwidth: '',
    cellularPreferredFrequencyBand: '',
    cellularOutputPower: '',
    cellularTotalPresetChannels: '',
    cellularChannelWidth: '',
    cellularEmissionClass: '',
    cellularModulationType: '',
    
    // Cellular Antenna
    cellularAntennaType: '',
    cellularAntennaGain: '',
    cellularPolarization: '',
    cellularAntennaHeight: '',
    cellularMainLobeAzimuth: '',
    cellularBeamWidth: '',
    cellularFeedType: '',
    cellularFeedLength: '',
    
    // Point-to-Point Equipment
    p2pCallsign: '',
    p2pApprovalNumber: '',
    p2pMake: '',
    p2pModel: '',
    p2pSerialNumber: '',
    p2pFrequencyRange: '',
    p2pBandwidth: '',
    p2pPreferredFrequencyBand: '',
    p2pOutputPower: '',
    p2pTotalPresetChannels: '',
    p2pChannelWidth: '',
    p2pEmissionClass: '',
    p2pModulationType: '',
    p2pCapacity: '',
    p2pRxSelectivity: '',
    p2pThresh3: '',
    p2pThresh6: '',
    
    // Point-to-Point Antenna
    p2pAntennaType: '',
    p2pAntennaGain: '',
    p2pPolarization: '',
    p2pAntennaHeight: '',
    p2pMainLobeAzimuth: '',
    p2pBeamWidth: '',
    p2pFeedType: '',
    p2pFeedLength: '',
    
    // Point-to-Point Links
    transmitStation: '',
    receiveStation: '',
    preferredBand: '',
    hopLength: '',
    azimuth: '',
    
    // Aircraft Radio Base Station Details
    aircraftBaseStationName: '',
    aircraftBaseStreet: '',
    aircraftBaseWard: '',
    aircraftBaseSiteAltitude: '',
    aircraftBaseCity: '',
    aircraftBaseLatitude: '',
    aircraftBaseRegion: '',
    aircraftBaseLongitude: '',
    aircraftBaseCountry: 'Botswana',
    aircraftBaseContactPerson: '',
    aircraftBaseServiceClass: '',
    aircraftType: '',
    
    // Aircraft Base Station Equipment
    aircraftBaseEquipmentType: 'transceiver',
    aircraftBaseCallsign: '',
    aircraftBaseApprovalNumber: '',
    aircraftBaseMake: '',
    aircraftBaseModel: '',
    aircraftBaseSerialNumber: '',
    aircraftBaseFrequencyRange: '',
    aircraftBaseBandwidth: '',
    aircraftBasePreferredFrequencyBand: '',
    aircraftBaseOutputPower: '',
    aircraftBaseTotalPresetChannels: '',
    aircraftBaseChannelWidth: '',
    aircraftBaseEmissionClass: '',
    aircraftBaseModulationType: '',
    aircraftBaseRxSensitivity: '',
    aircraftBaseRxSelectivity: '',
    
    // Aircraft Base Station Antenna
    aircraftBaseAntennaType: '',
    aircraftBaseAntennaGain: '',
    aircraftBasePolarization: '',
    aircraftBaseAntennaHeight: '',
    aircraftBaseMainLobeAzimuth: '',
    aircraftBaseBeamWidth: '',
    aircraftBaseFeedType: '',
    aircraftBaseFeedLength: '',
    
    // Aircraft Station Details
    aircraftStationName: '',
    aircraftRegistrationMarks: '',
    aircraftAreaOfOperation: '',
    aircraftBaseStation: '',
    aircraftCityVillage: '',
    aircraftLatitude: '',
    aircraftRegion: '',
    aircraftLongitude: '',
    aircraftCountry: 'Botswana',
    aircraftContactPerson: '',
    aircraftServiceClass: '',
    aircraftAircraftType: '',
    aircraftCallsign: '',
    aircraftDateOfPurchase: '',
    
    // Aircraft Station Equipment
    aircraftEquipmentType: 'vhfTransmitter',
    aircraftApprovalNumber: '',
    aircraftMake: '',
    aircraftModel: '',
    aircraftSerialNumber: '',
    aircraftRequestedFrequencyRange: '',
    aircraftBandwidth: '',
    aircraftPreferredFrequencyBand: '',
    aircraftOutputPower: '',
    aircraftTotalPresetChannels: '',
    aircraftChannelWidth: '',
    aircraftEmissionClass: '',
    aircraftModulationType: '',
    aircraftOperationMethod: '',
    aircraftTransmissionType: '',
    
    // Aircraft Station Antenna
    aircraftAntennaType: '',
    aircraftAntennaGain: '',
    aircraftPolarization: '',
    aircraftAntennaHeight: '',
    aircraftMainLobeAzimuth: '',
    aircraftBeamWidth: '',
    aircraftFeedType: '',
    aircraftFeedLength: '',
    
    // Citizen Band Radio Base Station Details
    citizenStationType: 'fixed',
    citizenStationName: '',
    citizenBaseStation: '',
    citizenStreet: '',
    citizenWard: '',
    citizenSiteAltitude: '',
    citizenAreaOfOperation: '',
    citizenCity: '',
    citizenLatitude: '',
    citizenRegion: '',
    citizenLongitude: '',
    citizenCountry: 'Botswana',
    citizenNumberOfSites: '1',
    citizenServiceClass: '',
    citizenStationClass: '',
    citizenPurpose: '',
    
    // Citizen Band Equipment Details
    citizenEquipmentType: 'transceiver',
    citizenCallsign: '',
    citizenApprovalNumber: '',
    citizenMake: '',
    citizenModel: '',
    citizenSerialNumber: '',
    citizenFrequencyRange: '',
    citizenBandwidth: '',
    citizenPreferredFrequencyBand: '',
    citizenOutputPower: '',
    citizenTotalPresetChannels: '',
    citizenChannelWidth: '',
    citizenEmissionClass: '',
    citizenModulationType: '',
    citizenRxSensitivity: '',
    citizenRxSelectivity: '',
    
    // Citizen Band Antenna Details
    citizenAntennaType: '',
    citizenAntennaGain: '',
    citizenPolarization: '',
    citizenAntennaHeight: '',
    citizenMainLobeAzimuth: '',
    citizenBeamWidth: '',
    citizenFeedType: '',
    citizenFeedLength: '',
    
    // Point-to-Multipoint Operational Site Details
    pmNetwork: '',
    pmStationName: '',
    pmStreet: '',
    pmWard: '',
    pmSiteAltitude: '',
    pmCity: '',
    pmLatitude: '',
    pmRegion: '',
    pmLongitude: '',
    pmCountry: 'Botswana',
    pmContactPerson: '',
    pmServiceClass: '',
    pmStationClass: '',
    pmSiteTelNo: '',
    pmSiteFaxNo: '',
    
    // Point-to-Multipoint Broadcasting Transmitter
    pmCallsign: '',
    pmApprovalNumber: '',
    pmMake: '',
    pmModel: '',
    pmSerialNumber: '',
    pmFrequencyRange: '',
    pmBandwidth: '',
    pmPreferredFrequencyBand: '',
    pmOutputPower: '',
    pmTotalPresetChannels: '',
    pmChannelWidth: '',
    pmEmissionClass: '',
    pmModulationType: '',
    
    // Point-to-Multipoint Antenna
    pmAntennaType: '',
    pmAntennaGain: '',
    pmPolarization: '',
    pmAntennaHeight: '',
    pmMainLobeAzimuth: '',
    pmBeamWidth: '',
    pmFeedType: '',
    pmFeedLength: '',
    
    // Point-to-Multipoint Point-to-Point Equipment
    pm2pCallsign: '',
    pm2pApprovalNumber: '',
    pm2pMake: '',
    pm2pModel: '',
    pm2pSerialNumber: '',
    pm2pFrequencyRange: '',
    pm2pBandwidth: '',
    pm2pPreferredFrequencyBand: '',
    pm2pOutputPower: '',
    pm2pTotalPresetChannels: '',
    pm2pChannelWidth: '',
    pm2pEmissionClass: '',
    pm2pModulationType: '',
    pm2pCapacity: '',
    pm2pRxSelectivity: '',
    pm2pThresh3: '',
    pm2pThresh6: '',
    
    // Point-to-Multipoint Point-to-Point Antenna
    pm2pAntennaType: '',
    pm2pAntennaGain: '',
    pm2pPolarization: '',
    pm2pAntennaHeight: '',
    pm2pMainLobeAzimuth: '',
    pm2pBeamWidth: '',
    pm2pFeedType: '',
    pm2pFeedLength: '',
    
    // Point-to-Multipoint Links
    pmTransmitStation: '',
    pmReceiveStation: '',
    pmPreferredBand: '',
    pmHopLength: '',
    pmAzimuth: ''
  });

  const totalSteps = (licenseCategory === 'telecom' && (licenseTitle.includes('Amateur') || licenseTitle.includes('Cellular') || licenseTitle.includes('Aircraft') || licenseTitle.includes('Citizen'))) ? 5 : 
                   (licenseCategory === 'internet' && licenseTitle.includes('Point-to-Multipoint')) ? 5 : 4;

  const steps = (licenseCategory === 'telecom' && licenseTitle.includes('Amateur')) ? [
    { id: 1, title: 'Details', description: 'Applicant information' },
    { id: 2, title: 'Station', description: 'Base station details' },
    { id: 3, title: 'Documents', description: 'Upload required files' },
    { id: 4, title: 'Review', description: 'Review application' },
    { id: 5, title: 'Payment', description: 'Complete payment' }
  ] : (licenseCategory === 'telecom' && licenseTitle.includes('Cellular')) ? [
    { id: 1, title: 'Details', description: 'Applicant information' },
    { id: 2, title: 'Site Details', description: 'Operational site details' },
    { id: 3, title: 'Documents', description: 'Upload required files' },
    { id: 4, title: 'Review', description: 'Review application' },
    { id: 5, title: 'Payment', description: 'Complete payment' }
  ] : (licenseCategory === 'telecom' && licenseTitle.includes('Aircraft')) ? [
    { id: 1, title: 'Details', description: 'Applicant information' },
    { id: 2, title: 'Aircraft Station', description: 'Base & aircraft station details' },
    { id: 3, title: 'Documents', description: 'Upload required files' },
    { id: 4, title: 'Review', description: 'Review application' },
    { id: 5, title: 'Payment', description: 'Complete payment' }
  ] : (licenseCategory === 'telecom' && licenseTitle.includes('Citizen')) ? [
    { id: 1, title: 'Details', description: 'Applicant information' },
    { id: 2, title: 'CB Station', description: 'Base & operational site details' },
    { id: 3, title: 'Documents', description: 'Upload required files' },
    { id: 4, title: 'Review', description: 'Review application' },
    { id: 5, title: 'Payment', description: 'Complete payment' }
  ] : (licenseCategory === 'internet' && licenseTitle.includes('Point-to-Multipoint')) ? [
    { id: 1, title: 'Details', description: 'Applicant information' },
    { id: 2, title: 'P2MP Site', description: 'Operational site details' },
    { id: 3, title: 'Documents', description: 'Upload required files' },
    { id: 4, title: 'Review', description: 'Review application' },
    { id: 5, title: 'Payment', description: 'Complete payment' }
  ] : [
    { id: 1, title: 'Details', description: 'Applicant information' },
    { id: 2, title: 'Documents', description: 'Upload required files' },
    { id: 3, title: 'Review', description: 'Review application' },
    { id: 4, title: 'Payment', description: 'Complete payment' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveApplication = () => {
    const application = {
      id: `APP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      type: licenseTitle,
      category: licenseCategory,
      status: "pending",
      submittedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      progress: 25,
      description: `Application for ${licenseTitle}`,
      formData: { ...formData }
    };

    // Get existing applications from localStorage
    const existingApplications = JSON.parse(localStorage.getItem('bocra_applications') || '[]');
    
    // Add new application
    existingApplications.push(application);
    
    // Save back to localStorage
    localStorage.setItem('bocra_applications', JSON.stringify(existingApplications));
    
    return application;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepProgress = () => {
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FileText size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">New License Application</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{licenseTitle} - {licenseCategory}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between relative max-w-3xl mx-auto">
            {/* Progress Line Background */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full -translate-y-1/2"></div>
            {/* Active Progress Line */}
            <div 
              className="absolute top-1/2 left-0 h-1 bg-blue-600 rounded-full -translate-y-1/2 transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
            
            {/* Steps */}
            {steps.map((step, index) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-white dark:ring-slate-800 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {step.id}
                </div>
                <div className="text-center">
                  <span className={`text-[11px] font-bold tracking-tight block ${
                    currentStep >= step.id 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  <span className={`text-[10px] font-medium tracking-tight block ${
                    currentStep >= step.id 
                      ? 'text-blue-600/70 dark:text-blue-400/70' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {step.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Applicant Info */}
              <div className="lg:col-span-7 space-y-6">
                {/* Application Header Card */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Applicant Information</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    Please provide the registered entity details and primary contact information for this application.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 px-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                        placeholder="Enter company name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 px-1">
                          Registration Number
                        </label>
                        <input
                          type="text"
                          value={formData.registrationNumber}
                          onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          placeholder="BW-9920-X"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 px-1">
                          Tax ID
                        </label>
                        <input
                          type="text"
                          value={formData.taxId}
                          onChange={(e) => handleInputChange('taxId', e.target.value)}
                          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          placeholder="TIN-002931"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 px-1">
                        Primary Contact Email
                      </label>
                      <div className="relative">
                        <Envelope size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg pl-12 pr-4 py-3.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          placeholder="compliance@company.co.bw"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* License Type Section */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <WarningCircle size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">License Specifics</h3>
                      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase">
                        {licenseCategory.toUpperCase()} CATEGORY
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 px-1">
                        Coverage Area
                      </label>
                      <select
                        value={formData.coverageArea}
                        onChange={(e) => handleInputChange('coverageArea', e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      >
                        <option value="national">National Coverage (Greater Gaborone & Regional Hubs)</option>
                        <option value="regional">Regional Coverage (South-East District)</option>
                        <option value="local">Local Community Coverage</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 px-1">
                          Est. Commencement
                        </label>
                        <input
                          type="date"
                          value={formData.commencementDate}
                          onChange={(e) => handleInputChange('commencementDate', e.target.value)}
                          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 px-1">
                          Duration (Years)
                        </label>
                        <input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          min="1"
                          max="20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Document Prep & Summary */}
              <div className="lg:col-span-5 space-y-6">
                {/* File Drop Zone */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border-2 border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                    <CloudArrowUp size={32} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Upload Documents</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6 px-4">
                    Drag and drop your Business Certificate or Technical Plan here (PDF max 10MB)
                  </p>
                  <button className="px-6 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-full transition-colors">
                    Browse Files
                  </button>
                </div>

                {/* Checklist Card */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6">
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">
                    Required Documentation
                  </h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" weight="fill" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">Certificate of Incorporation</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Verified via CIPA Link</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Circle size={18} className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">Technical Network Plan</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Pending Upload</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Circle size={18} className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">Proof of Capital</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Pending Upload</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Quick Support */}
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white overflow-hidden relative">
                  <div className="relative z-10">
                    <h4 className="font-bold text-sm mb-2">Need Help?</h4>
                    <p className="text-xs opacity-90 leading-relaxed mb-4">
                      Chat with a regulatory officer about the technical requirements for this license.
                    </p>
                    <button className="flex items-center gap-2 text-xs font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors">
                      <ChatsCircle size={14} />
                      Open Live Chat
                    </button>
                  </div>
                  <WarningCircle size={80} className="absolute -bottom-4 -right-4 opacity-10" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && licenseCategory === 'telecom' && licenseTitle.includes('Amateur') && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                  <IdentificationCard size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Base Station Details</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete the technical specifications for your amateur radio station (You may need to consult your supplier to assist in completing this part)
                </p>
              </div>

              <div className="space-y-8">
                {/* Station Information */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <IdentificationCard size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    Station Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.stationType}
                        onChange={(e) => handleInputChange('stationType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="fixed">Fixed/Base</option>
                        <option value="mobile">Mobile</option>
                        <option value="portable">Portable</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Station Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.stationName}
                        onChange={(e) => handleInputChange('stationName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Base Station"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Street <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Station street address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ward
                      </label>
                      <input
                        type="text"
                        value={formData.ward}
                        onChange={(e) => handleInputChange('ward', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Ward name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Altitude (m)
                      </label>
                      <input
                        type="number"
                        value={formData.siteAltitude}
                        onChange={(e) => handleInputChange('siteAltitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="1000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Area of Operation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.areaOfOperation}
                        onChange={(e) => handleInputChange('areaOfOperation', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Gaborone and surrounding areas"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Gaborone"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Latitude
                      </label>
                      <input
                        type="text"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="-24.6571"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Region <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.region}
                        onChange={(e) => handleInputChange('region', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="South-East"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Longitude
                      </label>
                      <input
                        type="text"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="25.9087"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Botswana"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Sites <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.numberOfSites}
                        onChange={(e) => handleInputChange('numberOfSites', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Service Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.serviceClass}
                        onChange={(e) => handleInputChange('serviceClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Amateur"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Station Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.stationClass}
                        onChange={(e) => handleInputChange('stationClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Class A"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        BOCRA Cert. No.
                      </label>
                      <input
                        type="text"
                        value={formData.barsCertNo}
                        onChange={(e) => handleInputChange('barsCertNo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Certificate number"
                      />
                    </div>
                  </div>
                </div>

                {/* Equipment Details */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <WarningCircle size={16} className="text-green-600 dark:text-green-400" />
                    </div>
                    Equipment Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.equipmentType}
                        onChange={(e) => handleInputChange('equipmentType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="transceiver">Transceiver</option>
                        <option value="transmitter">Transmitter</option>
                        <option value="receiver">Receiver</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Callsign <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.callsign}
                        onChange={(e) => handleInputChange('callsign', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="A2ZXXX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Approval Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.approvalNumber}
                        onChange={(e) => handleInputChange('approvalNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Type approval number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Make <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.make}
                        onChange={(e) => handleInputChange('make', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Yaesu, Icom, Kenwood"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="FT-891, IC-7300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Serial Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.serialNumber}
                        onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Equipment serial number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency Range <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.frequencyRange}
                        onChange={(e) => handleInputChange('frequencyRange', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="144-146 / 430-440 MHz"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bandwidth (KHz) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.bandwidth}
                        onChange={(e) => handleInputChange('bandwidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="12.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Frequency Band <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.preferredFrequencyBand}
                        onChange={(e) => handleInputChange('preferredFrequencyBand', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="2m, 70cm, 6m"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Output Power <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.outputPower}
                        onChange={(e) => handleInputChange('outputPower', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="10W, 50W, 100W"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Preset Channels
                      </label>
                      <input
                        type="number"
                        value={formData.totalPresetChannels}
                        onChange={(e) => handleInputChange('totalPresetChannels', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Channel Width (MHz)
                      </label>
                      <input
                        type="text"
                        value={formData.channelWidth}
                        onChange={(e) => handleInputChange('channelWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="0.025"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Emission Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.emissionClass}
                        onChange={(e) => handleInputChange('emissionClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="F3E, G3E"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Modulation Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.modulationType}
                        onChange={(e) => handleInputChange('modulationType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="FM, SSB, Digital"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rx Sensitivity (dBm)
                      </label>
                      <input
                        type="text"
                        value={formData.rxSensitivity}
                        onChange={(e) => handleInputChange('rxSensitivity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="-110"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rx Selectivity
                      </label>
                      <input
                        type="text"
                        value={formData.rxSelectivity}
                        onChange={(e) => handleInputChange('rxSelectivity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="2.5 kHz"
                      />
                    </div>
                  </div>
                </div>

                {/* Antenna Details */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <Plus size={16} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    Antenna Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.antennaType}
                        onChange={(e) => handleInputChange('antennaType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Yagi, Dipole, Vertical"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Gain (dB) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.antennaGain}
                        onChange={(e) => handleInputChange('antennaGain', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="3, 6, 9"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Polarization <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.polarization}
                        onChange={(e) => handleInputChange('polarization', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select polarization</option>
                        <option value="vertical">Vertical</option>
                        <option value="horizontal">Horizontal</option>
                        <option value="circular">Circular</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Height (m) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.antennaHeight}
                        onChange={(e) => handleInputChange('antennaHeight', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Main Lobe Azimuth (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.mainLobeAzimuth}
                        onChange={(e) => handleInputChange('mainLobeAzimuth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Beam Width (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.beamWidth}
                        onChange={(e) => handleInputChange('beamWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="65"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Type
                      </label>
                      <input
                        type="text"
                        value={formData.feedType}
                        onChange={(e) => handleInputChange('feedType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Coaxial, Ladder line"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Length (m)
                      </label>
                      <input
                        type="number"
                        value={formData.feedLength}
                        onChange={(e) => handleInputChange('feedLength', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && licenseCategory === 'telecom' && licenseTitle.includes('Cellular') && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                  <IdentificationCard size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Operational Site Details</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete the technical specifications for your cellular operational site (You may need to consult your supplier to assist in completing this part)
                </p>
              </div>

              <div className="space-y-8">
                {/* Operational Site Information */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <IdentificationCard size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    Operational Site Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Station Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularStationName}
                        onChange={(e) => handleInputChange('cellularStationName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Cell Site Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Street <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularStreet}
                        onChange={(e) => handleInputChange('cellularStreet', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Site street address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ward
                      </label>
                      <input
                        type="text"
                        value={formData.cellularWard}
                        onChange={(e) => handleInputChange('cellularWard', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Ward name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Altitude (m)
                      </label>
                      <input
                        type="number"
                        value={formData.cellularSiteAltitude}
                        onChange={(e) => handleInputChange('cellularSiteAltitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="1000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularCity}
                        onChange={(e) => handleInputChange('cellularCity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Gaborone"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Latitude
                      </label>
                      <input
                        type="text"
                        value={formData.cellularLatitude}
                        onChange={(e) => handleInputChange('cellularLatitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="-24.6571"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Region <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularRegion}
                        onChange={(e) => handleInputChange('cellularRegion', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="South-East"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Longitude
                      </label>
                      <input
                        type="text"
                        value={formData.cellularLongitude}
                        onChange={(e) => handleInputChange('cellularLongitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="25.9087"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularCountry}
                        onChange={(e) => handleInputChange('cellularCountry', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Botswana"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Person at Site <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.contactPersonAtSite}
                        onChange={(e) => handleInputChange('contactPersonAtSite', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Site contact name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Service Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularServiceClass}
                        onChange={(e) => handleInputChange('cellularServiceClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Cellular"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Station Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularStationClass}
                        onChange={(e) => handleInputChange('cellularStationClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Class A"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Tel. No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.siteTelNo}
                        onChange={(e) => handleInputChange('siteTelNo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="+267 123 4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Fax No.
                      </label>
                      <input
                        type="tel"
                        value={formData.siteFaxNo}
                        onChange={(e) => handleInputChange('siteFaxNo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="+267 123 4568"
                      />
                    </div>
                  </div>
                </div>

                {/* Broadcasting Equipment */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <WarningCircle size={16} className="text-green-600 dark:text-green-400" />
                    </div>
                    Broadcasting Equipment
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Callsign <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularCallsign}
                        onChange={(e) => handleInputChange('cellularCallsign', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Cell Callsign"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Approval Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularApprovalNumber}
                        onChange={(e) => handleInputChange('cellularApprovalNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Type approval number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Make <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularMake}
                        onChange={(e) => handleInputChange('cellularMake', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Ericsson, Nokia, Huawei"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularModel}
                        onChange={(e) => handleInputChange('cellularModel', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Equipment model"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Serial Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularSerialNumber}
                        onChange={(e) => handleInputChange('cellularSerialNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Equipment serial number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency Range <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularFrequencyRange}
                        onChange={(e) => handleInputChange('cellularFrequencyRange', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="800-900 / 1800-1900 MHz"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bandwidth (KHz) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularBandwidth}
                        onChange={(e) => handleInputChange('cellularBandwidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="5000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Frequency Band <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularPreferredFrequencyBand}
                        onChange={(e) => handleInputChange('cellularPreferredFrequencyBand', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="900, 1800, 2100 MHz"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Output Power <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularOutputPower}
                        onChange={(e) => handleInputChange('cellularOutputPower', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="20W, 40W, 60W"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Preset Channels
                      </label>
                      <input
                        type="number"
                        value={formData.cellularTotalPresetChannels}
                        onChange={(e) => handleInputChange('cellularTotalPresetChannels', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Channel Width (MHz)
                      </label>
                      <input
                        type="text"
                        value={formData.cellularChannelWidth}
                        onChange={(e) => handleInputChange('cellularChannelWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Emission Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularEmissionClass}
                        onChange={(e) => handleInputChange('cellularEmissionClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="F3E, G3E"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Modulation Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularModulationType}
                        onChange={(e) => handleInputChange('cellularModulationType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="QPSK, 16QAM, 64QAM"
                      />
                    </div>
                  </div>
                </div>

                {/* Cellular Antenna */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <Plus size={16} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    Antenna Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularAntennaType}
                        onChange={(e) => handleInputChange('cellularAntennaType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Panel, Omni, Yagi"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Gain (dB) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cellularAntennaGain}
                        onChange={(e) => handleInputChange('cellularAntennaGain', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="15, 18, 21"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Polarization <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.cellularPolarization}
                        onChange={(e) => handleInputChange('cellularPolarization', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select polarization</option>
                        <option value="vertical">Vertical</option>
                        <option value="horizontal">Horizontal</option>
                        <option value="dual">Dual</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Height (m) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.cellularAntennaHeight}
                        onChange={(e) => handleInputChange('cellularAntennaHeight', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="30"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Main Lobe Azimuth (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.cellularMainLobeAzimuth}
                        onChange={(e) => handleInputChange('cellularMainLobeAzimuth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Beam Width (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.cellularBeamWidth}
                        onChange={(e) => handleInputChange('cellularBeamWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="65"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Type
                      </label>
                      <input
                        type="text"
                        value={formData.cellularFeedType}
                        onChange={(e) => handleInputChange('cellularFeedType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Coaxial, Waveguide"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Length (m)
                      </label>
                      <input
                        type="number"
                        value={formData.cellularFeedLength}
                        onChange={(e) => handleInputChange('cellularFeedLength', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="30"
                      />
                    </div>
                  </div>
                </div>

                {/* Point-to-Point Details */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <ArrowRight size={16} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    Point-to-Point Details
                  </h4>
                  
                  <div className="space-y-6">
                    {/* P2P Equipment */}
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-4">Equipment</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Callsign <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pCallsign}
                            onChange={(e) => handleInputChange('p2pCallsign', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="P2P Callsign"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Approval Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pApprovalNumber}
                            onChange={(e) => handleInputChange('p2pApprovalNumber', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Type approval number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Make <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pMake}
                            onChange={(e) => handleInputChange('p2pMake', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Equipment make"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Model <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pModel}
                            onChange={(e) => handleInputChange('p2pModel', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Equipment model"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Serial Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pSerialNumber}
                            onChange={(e) => handleInputChange('p2pSerialNumber', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Equipment serial number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Frequency Range <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pFrequencyRange}
                            onChange={(e) => handleInputChange('p2pFrequencyRange', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Frequency range"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bandwidth (KHz) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pBandwidth}
                            onChange={(e) => handleInputChange('p2pBandwidth', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Bandwidth"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Preferred Frequency Band <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pPreferredFrequencyBand}
                            onChange={(e) => handleInputChange('p2pPreferredFrequencyBand', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Preferred band"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Output Power <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pOutputPower}
                            onChange={(e) => handleInputChange('p2pOutputPower', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Output power"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Total Preset Channels
                          </label>
                          <input
                            type="number"
                            value={formData.p2pTotalPresetChannels}
                            onChange={(e) => handleInputChange('p2pTotalPresetChannels', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Channels"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Channel Width (MHz)
                          </label>
                          <input
                            type="text"
                            value={formData.p2pChannelWidth}
                            onChange={(e) => handleInputChange('p2pChannelWidth', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Channel width"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Emission Class <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pEmissionClass}
                            onChange={(e) => handleInputChange('p2pEmissionClass', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Emission class"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Modulation Type <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pModulationType}
                            onChange={(e) => handleInputChange('p2pModulationType', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Modulation type"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Capacity (Mbs/sec)
                          </label>
                          <input
                            type="text"
                            value={formData.p2pCapacity}
                            onChange={(e) => handleInputChange('p2pCapacity', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Data capacity"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Rx Selectivity
                          </label>
                          <input
                            type="text"
                            value={formData.p2pRxSelectivity}
                            onChange={(e) => handleInputChange('p2pRxSelectivity', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Rx selectivity"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Thresh (dBm)-3
                          </label>
                          <input
                            type="text"
                            value={formData.p2pThresh3}
                            onChange={(e) => handleInputChange('p2pThresh3', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Threshold -3dBm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Thresh (dBm)-6
                          </label>
                          <input
                            type="text"
                            value={formData.p2pThresh6}
                            onChange={(e) => handleInputChange('p2pThresh6', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Threshold -6dBm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* P2P Antenna */}
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-4">Antenna</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Antenna Type <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pAntennaType}
                            onChange={(e) => handleInputChange('p2pAntennaType', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Parabolic, Grid"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Antenna Gain (dB) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.p2pAntennaGain}
                            onChange={(e) => handleInputChange('p2pAntennaGain', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Antenna gain"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Polarization <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.p2pPolarization}
                            onChange={(e) => handleInputChange('p2pPolarization', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select polarization</option>
                            <option value="vertical">Vertical</option>
                            <option value="horizontal">Horizontal</option>
                            <option value="dual">Dual</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Antenna Height (m) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={formData.p2pAntennaHeight}
                            onChange={(e) => handleInputChange('p2pAntennaHeight', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Antenna height"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Main Lobe Azimuth (deg)
                          </label>
                          <input
                            type="number"
                            value={formData.p2pMainLobeAzimuth}
                            onChange={(e) => handleInputChange('p2pMainLobeAzimuth', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Azimuth"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Beam Width (deg)
                          </label>
                          <input
                            type="number"
                            value={formData.p2pBeamWidth}
                            onChange={(e) => handleInputChange('p2pBeamWidth', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Beam width"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Feed Type
                          </label>
                          <input
                            type="text"
                            value={formData.p2pFeedType}
                            onChange={(e) => handleInputChange('p2pFeedType', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Feed type"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Feed Length (m)
                          </label>
                          <input
                            type="number"
                            value={formData.p2pFeedLength}
                            onChange={(e) => handleInputChange('p2pFeedLength', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Feed length"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Point-to-Point Links */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                      <ArrowRight size={16} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Point-to-Point Links
                  </h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-slate-700">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Transmit Station</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Receive Station</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Band (MHz)</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Hop Length</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Azimuth</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-slate-700">
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={formData.transmitStation}
                              onChange={(e) => handleInputChange('transmitStation', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Transmit station"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={formData.receiveStation}
                              onChange={(e) => handleInputChange('receiveStation', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Receive station"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={formData.preferredBand}
                              onChange={(e) => handleInputChange('preferredBand', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Band"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={formData.hopLength}
                              onChange={(e) => handleInputChange('hopLength', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Length"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={formData.azimuth}
                              onChange={(e) => handleInputChange('azimuth', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Azimuth"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && licenseCategory === 'telecom' && licenseTitle.includes('Aircraft') && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                  <Airplane size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aircraft Station Details</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete the technical specifications for your aircraft radio base station and aircraft station
                </p>
              </div>

              <div className="space-y-8">
                {/* Base Station Details */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Airplane size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    Base Station Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Station Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseStationName}
                        onChange={(e) => handleInputChange('aircraftBaseStationName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Base station name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Street <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseStreet}
                        onChange={(e) => handleInputChange('aircraftBaseStreet', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Street address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ward
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseWard}
                        onChange={(e) => handleInputChange('aircraftBaseWard', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Ward name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Altitude (m)
                      </label>
                      <input
                        type="number"
                        value={formData.aircraftBaseSiteAltitude}
                        onChange={(e) => handleInputChange('aircraftBaseSiteAltitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="1000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseCity}
                        onChange={(e) => handleInputChange('aircraftBaseCity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Gaborone"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Latitude
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseLatitude}
                        onChange={(e) => handleInputChange('aircraftBaseLatitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="-24.6571"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Region <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseRegion}
                        onChange={(e) => handleInputChange('aircraftBaseRegion', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="South-East"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Longitude
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseLongitude}
                        onChange={(e) => handleInputChange('aircraftBaseLongitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="25.9087"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseCountry}
                        onChange={(e) => handleInputChange('aircraftBaseCountry', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Botswana"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Person at Site <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseContactPerson}
                        onChange={(e) => handleInputChange('aircraftBaseContactPerson', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Contact name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Service Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseServiceClass}
                        onChange={(e) => handleInputChange('aircraftBaseServiceClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Aeronautical"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Aircraft Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftType}
                        onChange={(e) => handleInputChange('aircraftType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Fixed Wing, Helicopter"
                      />
                    </div>
                  </div>
                </div>

                {/* Base Station Equipment */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <WarningCircle size={16} className="text-green-600 dark:text-green-400" />
                    </div>
                    Equipment
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.aircraftBaseEquipmentType}
                        onChange={(e) => handleInputChange('aircraftBaseEquipmentType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="transceiver">Transceiver</option>
                        <option value="transmitter">Transmitter</option>
                        <option value="receiver">Receiver</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Callsign <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseCallsign}
                        onChange={(e) => handleInputChange('aircraftBaseCallsign', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Base callsign"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Approval Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseApprovalNumber}
                        onChange={(e) => handleInputChange('aircraftBaseApprovalNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Approval number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Make <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseMake}
                        onChange={(e) => handleInputChange('aircraftBaseMake', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Equipment make"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseModel}
                        onChange={(e) => handleInputChange('aircraftBaseModel', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Equipment model"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Serial Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseSerialNumber}
                        onChange={(e) => handleInputChange('aircraftBaseSerialNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Serial number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency Range <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseFrequencyRange}
                        onChange={(e) => handleInputChange('aircraftBaseFrequencyRange', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="118-137 MHz"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bandwidth (KHz) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseBandwidth}
                        onChange={(e) => handleInputChange('aircraftBaseBandwidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="25"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Frequency Band <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBasePreferredFrequencyBand}
                        onChange={(e) => handleInputChange('aircraftBasePreferredFrequencyBand', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="VHF"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Output Power <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseOutputPower}
                        onChange={(e) => handleInputChange('aircraftBaseOutputPower', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="25W"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Preset Channels
                      </label>
                      <input
                        type="number"
                        value={formData.aircraftBaseTotalPresetChannels}
                        onChange={(e) => handleInputChange('aircraftBaseTotalPresetChannels', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="720"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Channel Width (MHz)
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseChannelWidth}
                        onChange={(e) => handleInputChange('aircraftBaseChannelWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="25"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Emission Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseEmissionClass}
                        onChange={(e) => handleInputChange('aircraftBaseEmissionClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="A3E"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Modulation Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseModulationType}
                        onChange={(e) => handleInputChange('aircraftBaseModulationType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="AM"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rx Sensitivity (dBm)
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseRxSensitivity}
                        onChange={(e) => handleInputChange('aircraftBaseRxSensitivity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="-118"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rx Selectivity
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseRxSelectivity}
                        onChange={(e) => handleInputChange('aircraftBaseRxSelectivity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Selectivity"
                      />
                    </div>
                  </div>
                </div>

                {/* Base Station Antenna */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <Plus size={16} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    Antenna
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseAntennaType}
                        onChange={(e) => handleInputChange('aircraftBaseAntennaType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Ground plane"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Gain (dB) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseAntennaGain}
                        onChange={(e) => handleInputChange('aircraftBaseAntennaGain', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Polarization <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.aircraftBasePolarization}
                        onChange={(e) => handleInputChange('aircraftBasePolarization', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select polarization</option>
                        <option value="vertical">Vertical</option>
                        <option value="horizontal">Horizontal</option>
                        <option value="dual">Dual</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Height (m) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.aircraftBaseAntennaHeight}
                        onChange={(e) => handleInputChange('aircraftBaseAntennaHeight', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="15"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Main Lobe Azimuth (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.aircraftBaseMainLobeAzimuth}
                        onChange={(e) => handleInputChange('aircraftBaseMainLobeAzimuth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Beam Width (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.aircraftBaseBeamWidth}
                        onChange={(e) => handleInputChange('aircraftBaseBeamWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="360"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Type
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseFeedType}
                        onChange={(e) => handleInputChange('aircraftBaseFeedType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Coaxial"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Length (m)
                      </label>
                      <input
                        type="number"
                        value={formData.aircraftBaseFeedLength}
                        onChange={(e) => handleInputChange('aircraftBaseFeedLength', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="20"
                      />
                    </div>
                  </div>
                </div>

                {/* Aircraft Station Details */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Airplane size={16} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    Aircraft Station Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Station Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftStationName}
                        onChange={(e) => handleInputChange('aircraftStationName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Aircraft station name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Registration Marks <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftRegistrationMarks}
                        onChange={(e) => handleInputChange('aircraftRegistrationMarks', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="A5-XXX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Area of Operation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftAreaOfOperation}
                        onChange={(e) => handleInputChange('aircraftAreaOfOperation', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Domestic, International"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Base Station <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBaseStation}
                        onChange={(e) => handleInputChange('aircraftBaseStation', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Home base"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City/Village <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftCityVillage}
                        onChange={(e) => handleInputChange('aircraftCityVillage', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="City/Village"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Latitude
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftLatitude}
                        onChange={(e) => handleInputChange('aircraftLatitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Latitude"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Region <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftRegion}
                        onChange={(e) => handleInputChange('aircraftRegion', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Region"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Longitude
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftLongitude}
                        onChange={(e) => handleInputChange('aircraftLongitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Longitude"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftCountry}
                        onChange={(e) => handleInputChange('aircraftCountry', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Botswana"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Person at Site <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftContactPerson}
                        onChange={(e) => handleInputChange('aircraftContactPerson', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Contact person"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Service Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftServiceClass}
                        onChange={(e) => handleInputChange('aircraftServiceClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Aeronautical"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Aircraft Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftAircraftType}
                        onChange={(e) => handleInputChange('aircraftAircraftType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Fixed Wing, Helicopter"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Callsign <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftCallsign}
                        onChange={(e) => handleInputChange('aircraftCallsign', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Aircraft callsign"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date of Purchase <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.aircraftDateOfPurchase}
                        onChange={(e) => handleInputChange('aircraftDateOfPurchase', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Aircraft Station Equipment */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                      <WarningCircle size={16} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Equipment
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.aircraftEquipmentType}
                        onChange={(e) => handleInputChange('aircraftEquipmentType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="vhfTransmitter">VHF Transmitter</option>
                        <option value="hfTransmitter">HF Transmitter</option>
                        <option value="emergencyTransmitter">Emergency Transmitter</option>
                        <option value="otherEquipment">Other Equipment</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Approval Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftApprovalNumber}
                        onChange={(e) => handleInputChange('aircraftApprovalNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Approval number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Make <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftMake}
                        onChange={(e) => handleInputChange('aircraftMake', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Equipment make"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftModel}
                        onChange={(e) => handleInputChange('aircraftModel', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Equipment model"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Serial Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftSerialNumber}
                        onChange={(e) => handleInputChange('aircraftSerialNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Serial number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Requested Frequency Range <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftRequestedFrequencyRange}
                        onChange={(e) => handleInputChange('aircraftRequestedFrequencyRange', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="118-137 MHz"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bandwidth (KHz) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftBandwidth}
                        onChange={(e) => handleInputChange('aircraftBandwidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="25"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Frequency Band <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftPreferredFrequencyBand}
                        onChange={(e) => handleInputChange('aircraftPreferredFrequencyBand', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="VHF"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Output Power <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftOutputPower}
                        onChange={(e) => handleInputChange('aircraftOutputPower', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="10W"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Preset Channels
                      </label>
                      <input
                        type="number"
                        value={formData.aircraftTotalPresetChannels}
                        onChange={(e) => handleInputChange('aircraftTotalPresetChannels', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="720"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Channel Width (MHz)
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftChannelWidth}
                        onChange={(e) => handleInputChange('aircraftChannelWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="25"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Emission Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftEmissionClass}
                        onChange={(e) => handleInputChange('aircraftEmissionClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="A3E"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Modulation Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftModulationType}
                        onChange={(e) => handleInputChange('aircraftModulationType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="AM"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Operation Method
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftOperationMethod}
                        onChange={(e) => handleInputChange('aircraftOperationMethod', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Operation method"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Transmission Type
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftTransmissionType}
                        onChange={(e) => handleInputChange('aircraftTransmissionType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Transmission type"
                      />
                    </div>
                  </div>
                </div>

                {/* Aircraft Station Antenna */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center">
                      <Plus size={16} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    Antenna
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftAntennaType}
                        onChange={(e) => handleInputChange('aircraftAntennaType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Whip"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Gain (dB) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftAntennaGain}
                        onChange={(e) => handleInputChange('aircraftAntennaGain', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Polarization <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.aircraftPolarization}
                        onChange={(e) => handleInputChange('aircraftPolarization', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select polarization</option>
                        <option value="vertical">Vertical</option>
                        <option value="horizontal">Horizontal</option>
                        <option value="dual">Dual</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Height (m) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.aircraftAntennaHeight}
                        onChange={(e) => handleInputChange('aircraftAntennaHeight', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="3"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Main Lobe Azimuth (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.aircraftMainLobeAzimuth}
                        onChange={(e) => handleInputChange('aircraftMainLobeAzimuth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Beam Width (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.aircraftBeamWidth}
                        onChange={(e) => handleInputChange('aircraftBeamWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="360"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Type
                      </label>
                      <input
                        type="text"
                        value={formData.aircraftFeedType}
                        onChange={(e) => handleInputChange('aircraftFeedType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Coaxial"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Length (m)
                      </label>
                      <input
                        type="number"
                        value={formData.aircraftFeedLength}
                        onChange={(e) => handleInputChange('aircraftFeedLength', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && licenseCategory === 'telecom' && licenseTitle.includes('Citizen') && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-4">
                  <WarningCircle size={40} className="text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Citizen Band Station Details</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete the technical specifications for your citizen band radio base station and operational site
                </p>
              </div>

              <div className="space-y-8">
                {/* Base Station Details */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                      <House size={16} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    Base Station Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.citizenStationType}
                        onChange={(e) => handleInputChange('citizenStationType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="fixed">Fixed/Base</option>
                        <option value="mobile">Mobile</option>
                        <option value="portable">Portable</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Station Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenStationName}
                        onChange={(e) => handleInputChange('citizenStationName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Station name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Base Station <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenBaseStation}
                        onChange={(e) => handleInputChange('citizenBaseStation', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Base station"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Street <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenStreet}
                        onChange={(e) => handleInputChange('citizenStreet', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Street address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ward
                      </label>
                      <input
                        type="text"
                        value={formData.citizenWard}
                        onChange={(e) => handleInputChange('citizenWard', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Ward name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Altitude (m)
                      </label>
                      <input
                        type="number"
                        value={formData.citizenSiteAltitude}
                        onChange={(e) => handleInputChange('citizenSiteAltitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="1000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Area of Operation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenAreaOfOperation}
                        onChange={(e) => handleInputChange('citizenAreaOfOperation', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Area of operation"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenCity}
                        onChange={(e) => handleInputChange('citizenCity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Gaborone"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Latitude
                      </label>
                      <input
                        type="text"
                        value={formData.citizenLatitude}
                        onChange={(e) => handleInputChange('citizenLatitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="-24.6571"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Region <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenRegion}
                        onChange={(e) => handleInputChange('citizenRegion', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="South-East"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Longitude
                      </label>
                      <input
                        type="text"
                        value={formData.citizenLongitude}
                        onChange={(e) => handleInputChange('citizenLongitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="25.9087"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenCountry}
                        onChange={(e) => handleInputChange('citizenCountry', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Botswana"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Sites <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.citizenNumberOfSites}
                        onChange={(e) => handleInputChange('citizenNumberOfSites', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Service Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenServiceClass}
                        onChange={(e) => handleInputChange('citizenServiceClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Citizen Band"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Station Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenStationClass}
                        onChange={(e) => handleInputChange('citizenStationClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Class A/B/C"
                      />
                    </div>
                    
                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Purpose - What this station will be used for: <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.citizenPurpose}
                        onChange={(e) => handleInputChange('citizenPurpose', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Describe the purpose of this citizen band radio station"
                      />
                    </div>
                  </div>
                </div>

                {/* Citizen Band Equipment */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <WarningCircle size={16} className="text-green-600 dark:text-green-400" />
                    </div>
                    Equipment
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.citizenEquipmentType}
                        onChange={(e) => handleInputChange('citizenEquipmentType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="transceiver">Transceiver</option>
                        <option value="transmitter">Transmitter</option>
                        <option value="receiver">Receiver</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Callsign <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenCallsign}
                        onChange={(e) => handleInputChange('citizenCallsign', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Citizen callsign"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Approval Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenApprovalNumber}
                        onChange={(e) => handleInputChange('citizenApprovalNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Approval number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Make <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenMake}
                        onChange={(e) => handleInputChange('citizenMake', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Equipment make"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenModel}
                        onChange={(e) => handleInputChange('citizenModel', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Equipment model"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Serial Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenSerialNumber}
                        onChange={(e) => handleInputChange('citizenSerialNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Serial number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency Range <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenFrequencyRange}
                        onChange={(e) => handleInputChange('citizenFrequencyRange', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="26.965-27.405 MHz"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bandwidth (KHz) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenBandwidth}
                        onChange={(e) => handleInputChange('citizenBandwidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Frequency Band <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenPreferredFrequencyBand}
                        onChange={(e) => handleInputChange('citizenPreferredFrequencyBand', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="27 MHz"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Output Power <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenOutputPower}
                        onChange={(e) => handleInputChange('citizenOutputPower', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="4W"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Preset Channels
                      </label>
                      <input
                        type="number"
                        value={formData.citizenTotalPresetChannels}
                        onChange={(e) => handleInputChange('citizenTotalPresetChannels', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="40"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Channel Width (MHz)
                      </label>
                      <input
                        type="text"
                        value={formData.citizenChannelWidth}
                        onChange={(e) => handleInputChange('citizenChannelWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Emission Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenEmissionClass}
                        onChange={(e) => handleInputChange('citizenEmissionClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="F3E"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Modulation Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenModulationType}
                        onChange={(e) => handleInputChange('citizenModulationType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="FM"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rx Sensitivity (dBm)
                      </label>
                      <input
                        type="text"
                        value={formData.citizenRxSensitivity}
                        onChange={(e) => handleInputChange('citizenRxSensitivity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="-116"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rx Selectivity
                      </label>
                      <input
                        type="text"
                        value={formData.citizenRxSelectivity}
                        onChange={(e) => handleInputChange('citizenRxSelectivity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Selectivity"
                      />
                    </div>
                  </div>
                </div>

                {/* Citizen Band Antenna */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <Plus size={16} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    Antenna
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenAntennaType}
                        onChange={(e) => handleInputChange('citizenAntennaType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Vertical"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Gain (dB) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.citizenAntennaGain}
                        onChange={(e) => handleInputChange('citizenAntennaGain', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="3"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Polarization <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.citizenPolarization}
                        onChange={(e) => handleInputChange('citizenPolarization', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select polarization</option>
                        <option value="vertical">Vertical</option>
                        <option value="horizontal">Horizontal</option>
                        <option value="dual">Dual</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Height (m) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.citizenAntennaHeight}
                        onChange={(e) => handleInputChange('citizenAntennaHeight', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Main Lobe Azimuth (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.citizenMainLobeAzimuth}
                        onChange={(e) => handleInputChange('citizenMainLobeAzimuth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Beam Width (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.citizenBeamWidth}
                        onChange={(e) => handleInputChange('citizenBeamWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="360"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Type
                      </label>
                      <input
                        type="text"
                        value={formData.citizenFeedType}
                        onChange={(e) => handleInputChange('citizenFeedType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Coaxial"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Length (m)
                      </label>
                      <input
                        type="number"
                        value={formData.citizenFeedLength}
                        onChange={(e) => handleInputChange('citizenFeedLength', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="15"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && licenseCategory === 'internet' && licenseTitle.includes('Point-to-Multipoint') && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                  <Network size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Point-to-Multipoint Operational Site Details</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete the technical specifications for your point-to-multipoint network
                </p>
              </div>

              <div className="space-y-8">
                {/* 1. OPERATIONAL SITE DETAILS */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Network size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    OPERATIONAL SITE DETAILS
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                      (You may need to consult your supplier to assist in completing this part of the form)
                    </span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Network <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmNetwork}
                        onChange={(e) => handleInputChange('pmNetwork', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Network name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Station Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmStationName}
                        onChange={(e) => handleInputChange('pmStationName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Station name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Street <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmStreet}
                        onChange={(e) => handleInputChange('pmStreet', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Street address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ward
                      </label>
                      <input
                        type="text"
                        value={formData.pmWard}
                        onChange={(e) => handleInputChange('pmWard', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Ward name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Altitude (m)
                      </label>
                      <input
                        type="number"
                        value={formData.pmSiteAltitude}
                        onChange={(e) => handleInputChange('pmSiteAltitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="1000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmCity}
                        onChange={(e) => handleInputChange('pmCity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Gaborone"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Latitude
                      </label>
                      <input
                        type="text"
                        value={formData.pmLatitude}
                        onChange={(e) => handleInputChange('pmLatitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="-24.6571"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Region <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmRegion}
                        onChange={(e) => handleInputChange('pmRegion', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="South-East"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Longitude
                      </label>
                      <input
                        type="text"
                        value={formData.pmLongitude}
                        onChange={(e) => handleInputChange('pmLongitude', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="25.9087"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmCountry}
                        onChange={(e) => handleInputChange('pmCountry', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Botswana"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Person at Site <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmContactPerson}
                        onChange={(e) => handleInputChange('pmContactPerson', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Contact name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Service Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmServiceClass}
                        onChange={(e) => handleInputChange('pmServiceClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Point-to-Multipoint"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Station Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmStationClass}
                        onChange={(e) => handleInputChange('pmStationClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Station class"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Tel. No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.pmSiteTelNo}
                        onChange={(e) => handleInputChange('pmSiteTelNo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="+267 XXXXXXX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Fax No.
                      </label>
                      <input
                        type="tel"
                        value={formData.pmSiteFaxNo}
                        onChange={(e) => handleInputChange('pmSiteFaxNo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="+267 XXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Broadcasting Transmitter */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <WarningCircle size={16} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    Broadcasting Transmitter
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Callsign <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmCallsign}
                        onChange={(e) => handleInputChange('pmCallsign', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Broadcast callsign"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Approval Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmApprovalNumber}
                        onChange={(e) => handleInputChange('pmApprovalNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Approval number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Make <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmMake}
                        onChange={(e) => handleInputChange('pmMake', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Equipment make"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmModel}
                        onChange={(e) => handleInputChange('pmModel', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Equipment model"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Serial Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmSerialNumber}
                        onChange={(e) => handleInputChange('pmSerialNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Serial number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency Range / Bandwidth (KHz) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.pmFrequencyRange}
                          onChange={(e) => handleInputChange('pmFrequencyRange', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Frequency range"
                        />
                        <span className="flex items-center text-gray-500">/</span>
                        <input
                          type="text"
                          value={formData.pmBandwidth}
                          onChange={(e) => handleInputChange('pmBandwidth', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Bandwidth"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Frequency Band <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmPreferredFrequencyBand}
                        onChange={(e) => handleInputChange('pmPreferredFrequencyBand', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Frequency band"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Output Power <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmOutputPower}
                        onChange={(e) => handleInputChange('pmOutputPower', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Output power"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Preset Channels
                      </label>
                      <input
                        type="number"
                        value={formData.pmTotalPresetChannels}
                        onChange={(e) => handleInputChange('pmTotalPresetChannels', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Channels"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Channel Width (MHz)
                      </label>
                      <input
                        type="text"
                        value={formData.pmChannelWidth}
                        onChange={(e) => handleInputChange('pmChannelWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Channel width"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Emission Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmEmissionClass}
                        onChange={(e) => handleInputChange('pmEmissionClass', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Emission class"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Modulation Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmModulationType}
                        onChange={(e) => handleInputChange('pmModulationType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Modulation type"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Antenna */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center">
                      <Plus size={16} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    Antenna
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmAntennaType}
                        onChange={(e) => handleInputChange('pmAntennaType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Antenna type"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Gain (dB) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pmAntennaGain}
                        onChange={(e) => handleInputChange('pmAntennaGain', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Antenna gain"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Polarization <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.pmPolarization}
                        onChange={(e) => handleInputChange('pmPolarization', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select polarization</option>
                        <option value="vertical">Vertical</option>
                        <option value="horizontal">Horizontal</option>
                        <option value="dual">Dual</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Antenna Height (m) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.pmAntennaHeight}
                        onChange={(e) => handleInputChange('pmAntennaHeight', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Antenna height"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Main Lobe Azimuth (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.pmMainLobeAzimuth}
                        onChange={(e) => handleInputChange('pmMainLobeAzimuth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Main lobe azimuth"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Beam Width (deg)
                      </label>
                      <input
                        type="number"
                        value={formData.pmBeamWidth}
                        onChange={(e) => handleInputChange('pmBeamWidth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Beam width"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Type
                      </label>
                      <input
                        type="text"
                        value={formData.pmFeedType}
                        onChange={(e) => handleInputChange('pmFeedType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Feed type"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feed Length (m)
                      </label>
                      <input
                        type="number"
                        value={formData.pmFeedLength}
                        onChange={(e) => handleInputChange('pmFeedLength', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Feed length"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. POINT-TO-POINT DETAILS */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                      <ArrowsHorizontal size={16} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    POINT-TO-POINT DETAILS
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                      (You may need to consult your supplier to assist in completing this part of the form)
                    </span>
                  </h4>
                  
                  {/* Equipment Subsection */}
                  <div className="mb-8">
                    <h5 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">Equipment</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Callsign <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pCallsign}
                          onChange={(e) => handleInputChange('pm2pCallsign', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="P2P callsign"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Approval Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pApprovalNumber}
                          onChange={(e) => handleInputChange('pm2pApprovalNumber', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Approval number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Make <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pMake}
                          onChange={(e) => handleInputChange('pm2pMake', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Equipment make"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Model <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pModel}
                          onChange={(e) => handleInputChange('pm2pModel', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Equipment model"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Serial Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pSerialNumber}
                          onChange={(e) => handleInputChange('pm2pSerialNumber', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Serial number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Frequency Range / Bandwidth (KHz) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.pm2pFrequencyRange}
                            onChange={(e) => handleInputChange('pm2pFrequencyRange', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Frequency range"
                          />
                          <span className="flex items-center text-gray-500">/</span>
                          <input
                            type="text"
                            value={formData.pm2pBandwidth}
                            onChange={(e) => handleInputChange('pm2pBandwidth', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Bandwidth"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Preferred Frequency Band <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pPreferredFrequencyBand}
                          onChange={(e) => handleInputChange('pm2pPreferredFrequencyBand', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Frequency band"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Output Power <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pOutputPower}
                          onChange={(e) => handleInputChange('pm2pOutputPower', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Output power"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Total Preset Channels
                        </label>
                        <input
                          type="number"
                          value={formData.pm2pTotalPresetChannels}
                          onChange={(e) => handleInputChange('pm2pTotalPresetChannels', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Channels"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Channel Width (MHz)
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pChannelWidth}
                          onChange={(e) => handleInputChange('pm2pChannelWidth', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Channel width"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Emission Class <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pEmissionClass}
                          onChange={(e) => handleInputChange('pm2pEmissionClass', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Emission class"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Modulation Type <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pModulationType}
                          onChange={(e) => handleInputChange('pm2pModulationType', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Modulation type"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Capacity (Mbs/sec)
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pCapacity}
                          onChange={(e) => handleInputChange('pm2pCapacity', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Capacity"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Rx Selectivity
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pRxSelectivity}
                          onChange={(e) => handleInputChange('pm2pRxSelectivity', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Rx selectivity"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Thresh (dBm)-3
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pThresh3}
                          onChange={(e) => handleInputChange('pm2pThresh3', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Threshold -3"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Thresh (dBm)-6
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pThresh6}
                          onChange={(e) => handleInputChange('pm2pThresh6', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Threshold -6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Antenna Subsection */}
                  <div className="mb-8">
                    <h5 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">Antenna</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Antenna Type <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pAntennaType}
                          onChange={(e) => handleInputChange('pm2pAntennaType', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Antenna type"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Antenna Gain (dB) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pAntennaGain}
                          onChange={(e) => handleInputChange('pm2pAntennaGain', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Antenna gain"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Polarization <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.pm2pPolarization}
                          onChange={(e) => handleInputChange('pm2pPolarization', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select polarization</option>
                          <option value="vertical">Vertical</option>
                          <option value="horizontal">Horizontal</option>
                          <option value="dual">Dual</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Antenna Height (m) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.pm2pAntennaHeight}
                          onChange={(e) => handleInputChange('pm2pAntennaHeight', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Antenna height"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Main Lobe Azimuth (deg)
                        </label>
                        <input
                          type="number"
                          value={formData.pm2pMainLobeAzimuth}
                          onChange={(e) => handleInputChange('pm2pMainLobeAzimuth', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Main lobe azimuth"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Beam Width (deg)
                        </label>
                        <input
                          type="number"
                          value={formData.pm2pBeamWidth}
                          onChange={(e) => handleInputChange('pm2pBeamWidth', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Beam width"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Feed Type
                        </label>
                        <input
                          type="text"
                          value={formData.pm2pFeedType}
                          onChange={(e) => handleInputChange('pm2pFeedType', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Feed type"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Feed Length (m)
                        </label>
                        <input
                          type="number"
                          value={formData.pm2pFeedLength}
                          onChange={(e) => handleInputChange('pm2pFeedLength', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          placeholder="Feed length"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. POINT-TO-POINT LINKS */}
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center">
                      <ArrowsHorizontal size={16} className="text-rose-600 dark:text-rose-400" />
                    </div>
                    POINT-TO-POINT LINKS
                  </h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-slate-800">
                          <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Transmit Station</th>
                          <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Receive Station</th>
                          <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Band (Mhz)</th>
                          <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Hop Length</th>
                          <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Azimuth</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 dark:border-slate-600 px-4 py-2">
                            <input
                              type="text"
                              value={formData.pmTransmitStation}
                              onChange={(e) => handleInputChange('pmTransmitStation', e.target.value)}
                              className="w-full px-3 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Transmit station"
                            />
                          </td>
                          <td className="border border-gray-300 dark:border-slate-600 px-4 py-2">
                            <input
                              type="text"
                              value={formData.pmReceiveStation}
                              onChange={(e) => handleInputChange('pmReceiveStation', e.target.value)}
                              className="w-full px-3 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Receive station"
                            />
                          </td>
                          <td className="border border-gray-300 dark:border-slate-600 px-4 py-2">
                            <input
                              type="text"
                              value={formData.pmPreferredBand}
                              onChange={(e) => handleInputChange('pmPreferredBand', e.target.value)}
                              className="w-full px-3 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Frequency"
                            />
                          </td>
                          <td className="border border-gray-300 dark:border-slate-600 px-4 py-2">
                            <input
                              type="text"
                              value={formData.pmHopLength}
                              onChange={(e) => handleInputChange('pmHopLength', e.target.value)}
                              className="w-full px-3 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Distance"
                            />
                          </td>
                          <td className="border border-gray-300 dark:border-slate-600 px-4 py-2">
                            <input
                              type="text"
                              value={formData.pmAzimuth}
                              onChange={(e) => handleInputChange('pmAzimuth', e.target.value)}
                              className="w-full px-3 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                              placeholder="Azimuth"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {((currentStep === 2 && !(licenseCategory === 'telecom' && (licenseTitle.includes('Amateur') || licenseTitle.includes('Cellular') || licenseTitle.includes('Aircraft') || licenseTitle.includes('Citizen'))) && !(licenseCategory === 'internet' && licenseTitle.includes('Point-to-Multipoint'))) || 
            (currentStep === 3 && ((licenseCategory === 'telecom' && (licenseTitle.includes('Amateur') || licenseTitle.includes('Cellular') || licenseTitle.includes('Aircraft') || licenseTitle.includes('Citizen'))) || (licenseCategory === 'internet' && licenseTitle.includes('Point-to-Multipoint'))))) && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                  <Upload size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upload Required Documents</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please upload all required documents to proceed with your application
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Document Upload Areas */}
                {[
                  { title: "Certificate of Incorporation", desc: "Business registration certificate", status: "uploaded" },
                  { title: "Technical Network Plan", desc: "Detailed technical specifications", status: "pending" },
                  { title: "Proof of Capital", desc: "Financial capability documents", status: "pending" },
                  { title: "Tax Clearance Certificate", desc: "Recent tax compliance certificate", status: "pending" }
                ].map((doc, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-slate-600">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{doc.title}</h4>
                      {doc.status === 'uploaded' ? (
                        <CheckCircle size={20} className="text-green-600 dark:text-green-400" weight="fill" />
                      ) : (
                        <Upload size={20} className="text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{doc.desc}</p>
                    <button className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
                      doc.status === 'uploaded'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                      {doc.status === 'uploaded' ? 'View Document' : 'Upload Document'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {((currentStep === 3 && !(licenseCategory === 'telecom' && (licenseTitle.includes('Amateur') || licenseTitle.includes('Cellular') || licenseTitle.includes('Aircraft') || licenseTitle.includes('Citizen')))) || 
            (currentStep === 4 && licenseCategory === 'telecom' && (licenseTitle.includes('Amateur') || licenseTitle.includes('Cellular') || licenseTitle.includes('Aircraft') || licenseTitle.includes('Citizen')))) && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-4">
                  <FileText size={40} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review Your Application</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please review all details before submitting
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8 space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">Applicant Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Company Name:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.companyName || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Registration Number:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.registrationNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Tax ID:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.taxId || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Email:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">License Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">License Type:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{licenseTitle}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Category:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{licenseCategory}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Coverage Area:</span>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{formData.coverageArea}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.duration} years</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Important:</strong> By submitting this application, you confirm that all provided information is accurate and complete.
                  </p>
                </div>
              </div>
            </div>
          )}

          {((currentStep === 4 && !(licenseCategory === 'telecom' && (licenseTitle.includes('Amateur') || licenseTitle.includes('Cellular') || licenseTitle.includes('Aircraft') || licenseTitle.includes('Citizen')))) || 
            (currentStep === 5 && licenseCategory === 'telecom' && (licenseTitle.includes('Amateur') || licenseTitle.includes('Cellular') || licenseTitle.includes('Aircraft') || licenseTitle.includes('Citizen')))) && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete the payment to submit your application
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-8">
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">Application Fee Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Application Processing Fee</span>
                      <span className="font-medium text-gray-900 dark:text-white">BWP 1,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">License Registration Fee</span>
                      <span className="font-medium text-gray-900 dark:text-white">BWP 5,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Administrative Charges</span>
                      <span className="font-medium text-gray-900 dark:text-white">BWP 500</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                        <span className="font-bold text-lg text-blue-600 dark:text-blue-400">BWP 6,500</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3 px-6 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors">
                    Pay Later
                  </button>
                  <button className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <FloppyDisk size={16} />
            Save Draft
          </button>
          
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <CaretLeft size={16} />
                Previous
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {currentStep === 1 ? 
                  'Next: ' + ((licenseCategory === 'telecom' && (licenseTitle.includes('Amateur') || licenseTitle.includes('Cellular') || licenseTitle.includes('Aircraft') || licenseTitle.includes('Citizen'))) || (licenseCategory === 'internet' && licenseTitle.includes('Point-to-Multipoint'))) ? 
                    (licenseTitle.includes('Amateur') ? 'Station Details' : licenseTitle.includes('Cellular') ? 'Site Details' : licenseTitle.includes('Aircraft') ? 'Aircraft Station' : licenseTitle.includes('Citizen') ? 'CB Station' : 'P2MP Site') : 
                    'Upload Documents' : 
                 currentStep === 2 ? 
                  'Next: ' + ((licenseCategory === 'telecom' && (licenseTitle.includes('Amateur') || licenseTitle.includes('Cellular') || licenseTitle.includes('Aircraft') || licenseTitle.includes('Citizen'))) || (licenseCategory === 'internet' && licenseTitle.includes('Point-to-Multipoint'))) ? 
                    'Upload Documents' : 'Review' : 
                 currentStep === 3 ? 
                  'Next: ' + ((licenseCategory === 'telecom' && (licenseTitle.includes('Amateur') || licenseTitle.includes('Cellular') || licenseTitle.includes('Aircraft') || licenseTitle.includes('Citizen'))) || (licenseCategory === 'internet' && licenseTitle.includes('Point-to-Multipoint'))) ? 
                    'Review' : 'Payment' : 
                 currentStep === 4 ? 
                  'Next: ' + ((licenseCategory === 'telecom' && (licenseTitle.includes('Amateur') || licenseTitle.includes('Cellular') || licenseTitle.includes('Aircraft') || licenseTitle.includes('Citizen'))) || (licenseCategory === 'internet' && licenseTitle.includes('Point-to-Multipoint'))) ? 
                    'Payment' : 'Submit' : 
                 'Submit'}
                <CaretRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => {
                  const application = saveApplication();
                  console.log('Application saved:', application);
                  onClose();
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                Submit Application
                <CheckCircle size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
