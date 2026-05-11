import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';

type LeadStatus =
    | 'New'
    | 'In Process'
    | 'Dead Lead'
    | 'Qualified'
    | 'Interested In Quote'
    | 'Quotes sent'
    | 'Lost/Not Interested'
    | 'Hot'
    | 'Warm'
    | 'Cold'
    | 'Future Prospects'
    | 'Convert To account'
    | 'Existing Account';

interface Lead {
    id: number;
    enquiryId?: string;
    name: string;
    destination: string;
    nights: number;
    pax: number;
    status: LeadStatus;
    timeInfo: string;
    channel?: string;
    statusNote: string;
    value: number;
    isApproximate?: boolean;
    warning?: string;
    branch?: string;
    leadStatus?: string;
    leadMobileCountry?: string;
    leadMobile?: string;
    leadOwner?: string;
    leadCity?: string;
    leadCountry?: string;
    leadType?: string;
    leadSource?: string;
    leadBirthdate?: string;
    leadArea?: string;
    agencyAddress?: string;
    keyPersonName?: string;
    keyPersonDesignation?: string;
    keyPersonEmail?: string;
    keyPersonNationality?: string;
    keyPersonBirthdate?: string;
    keyPersonMobileCountry?: string;
    keyPersonMobile?: string;
}

interface EditLeadPageProps {
    lead: Lead;
    onBack: () => void;
    onSave: (lead: Lead) => void;
}

export function EditLeadPage({ lead, onBack, onSave }: EditLeadPageProps) {
    const [formData, setFormData] = useState<Lead>(lead);

    const isFormValid = () => {
        return (
            formData.name &&
            formData.leadMobile &&
            formData.leadCountry &&
            formData.leadType &&
            formData.agencyAddress &&
            formData.keyPersonName &&
            formData.keyPersonDesignation &&
            formData.keyPersonEmail &&
            formData.keyPersonNationality &&
            formData.keyPersonMobile &&
            formData.destination &&
            formData.value > 0
        );
    };

    const handleSave = () => {
        if (isFormValid()) {
            onSave(formData);
        }
    };

    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: '#f5f7fb' }}>
            {/* Header */}
            <div className="bg-white px-8 py-6" style={{ borderBottom: '1px solid #eceef5' }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" style={{ color: '#70778a' }} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-semibold" style={{ color: '#1d2433' }}>Edit Lead</h1>
                            <p className="text-sm mt-1" style={{ color: '#70778a' }}>{formData.enquiryId}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={!isFormValid()}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#5b57d9' }}
                    >
                        <Save className="w-4 h-4" />
                        Update Lead
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-auto">
                <div className="mx-auto py-6">
                    <div className="space-y-6">
                        {/* Information Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6" style={{ border: '1px solid #eceef5' }}>
                            <h3 className="text-lg font-semibold mb-6 pb-3" style={{ color: '#1d2433', borderBottom: '1px solid #eceef5' }}>
                                Information
                            </h3>
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Enquiry ID
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.enquiryId}
                                            disabled
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', backgroundColor: '#f9fafb', color: '#70778a' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Branch
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.branch}
                                            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                            placeholder="Delhi"
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Lead Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter lead name"
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Lead Status
                                        </label>
                                        <select
                                            value={formData.leadStatus}
                                            onChange={(e) => setFormData({ ...formData, leadStatus: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        >
                                            <option value="None">None</option>
                                            <option value="Hot">Hot</option>
                                            <option value="Warm">Warm</option>
                                            <option value="Cold">Cold</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Mobile Number <span className="text-red-600">*</span>
                                        </label>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={formData.leadMobileCountry}
                                                disabled
                                                className="w-36 px-4 py-2.5 rounded-lg text-sm"
                                                style={{ border: '1px solid #eceef5', backgroundColor: '#f9fafb', color: '#70778a' }}
                                            />
                                            <input
                                                type="tel"
                                                value={formData.leadMobile}
                                                onChange={(e) => setFormData({ ...formData, leadMobile: e.target.value })}
                                                placeholder="Enter mobile number"
                                                className="flex-1 px-4 py-2.5 rounded-lg text-sm"
                                                style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Lead Owner
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.leadOwner}
                                            onChange={(e) => setFormData({ ...formData, leadOwner: e.target.value })}
                                            placeholder="Enter lead owner"
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Lead City
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.leadCity}
                                            onChange={(e) => setFormData({ ...formData, leadCity: e.target.value })}
                                            placeholder="Enter city"
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Lead Country <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.leadCountry}
                                            onChange={(e) => setFormData({ ...formData, leadCountry: e.target.value })}
                                            placeholder="Enter country"
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Lead Type <span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            value={formData.leadType}
                                            onChange={(e) => setFormData({ ...formData, leadType: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        >
                                            <option value="">- Select -</option>
                                            <option value="Individual">Individual</option>
                                            <option value="Corporate">Corporate</option>
                                            <option value="Group">Group</option>
                                            <option value="Agency">Travel Agency</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Lead Source
                                        </label>
                                        <select
                                            value={formData.leadSource}
                                            onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        >
                                            <option value="">- Select -</option>
                                            <option value="WhatsApp">WhatsApp</option>
                                            <option value="Email">Email</option>
                                            <option value="Web Form">Web Form</option>
                                            <option value="Phone">Phone</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="Facebook">Facebook</option>
                                            <option value="Referral">Referral</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Lead Birthdate
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.leadBirthdate}
                                            onChange={(e) => setFormData({ ...formData, leadBirthdate: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Lead Area
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.leadArea}
                                            onChange={(e) => setFormData({ ...formData, leadArea: e.target.value })}
                                            placeholder="Enter area"
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                        Agency Address <span className="text-red-600">*</span>
                                    </label>
                                    <textarea
                                        value={formData.agencyAddress}
                                        onChange={(e) => setFormData({ ...formData, agencyAddress: e.target.value })}
                                        placeholder="Enter agency address"
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-lg text-sm resize-none"
                                        style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Key Person Information Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6" style={{ border: '1px solid #eceef5' }}>
                            <h3 className="text-lg font-semibold mb-6 pb-3" style={{ color: '#1d2433', borderBottom: '1px solid #eceef5' }}>
                                Key Person Information
                            </h3>
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Key Person Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.keyPersonName}
                                            onChange={(e) => setFormData({ ...formData, keyPersonName: e.target.value })}
                                            placeholder="Enter name"
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Key Person Designation <span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            value={formData.keyPersonDesignation}
                                            onChange={(e) => setFormData({ ...formData, keyPersonDesignation: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        >
                                            <option value="">- Select -</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Director">Director</option>
                                            <option value="CEO">CEO</option>
                                            <option value="Executive">Executive</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Key Person Email <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.keyPersonEmail}
                                            onChange={(e) => setFormData({ ...formData, keyPersonEmail: e.target.value })}
                                            placeholder="Enter email"
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Key Person Nationality <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.keyPersonNationality}
                                            onChange={(e) => setFormData({ ...formData, keyPersonNationality: e.target.value })}
                                            placeholder="Enter nationality"
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Key Person Birthdate
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.keyPersonBirthdate}
                                            onChange={(e) => setFormData({ ...formData, keyPersonBirthdate: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Mobile <span className="text-red-600">*</span>
                                        </label>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={formData.keyPersonMobileCountry}
                                                disabled
                                                className="w-36 px-4 py-2.5 rounded-lg text-sm"
                                                style={{ border: '1px solid #eceef5', backgroundColor: '#f9fafb', color: '#70778a' }}
                                            />
                                            <input
                                                type="tel"
                                                value={formData.keyPersonMobile}
                                                onChange={(e) => setFormData({ ...formData, keyPersonMobile: e.target.value })}
                                                placeholder="Enter mobile number"
                                                className="flex-1 px-4 py-2.5 rounded-lg text-sm"
                                                style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trip Details Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6" style={{ border: '1px solid #eceef5' }}>
                            <h3 className="text-lg font-semibold mb-6 pb-3" style={{ color: '#1d2433', borderBottom: '1px solid #eceef5' }}>
                                Trip Details
                            </h3>
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Destination <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.destination}
                                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                            placeholder="e.g., Bali"
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Estimated Value (₹) <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.value || ''}
                                            onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                                            placeholder="120000"
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Nights <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.nights}
                                            onChange={(e) => setFormData({ ...formData, nights: parseInt(e.target.value) || 1 })}
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                            Pax <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.pax}
                                            onChange={(e) => setFormData({ ...formData, pax: parseInt(e.target.value) || 1 })}
                                            className="w-full px-4 py-2.5 rounded-lg text-sm"
                                            style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#1d2433' }}>
                                        Pipeline Status <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                                        className="w-full px-4 py-2.5 rounded-lg text-sm"
                                        style={{ border: '1px solid #eceef5', color: '#1d2433' }}
                                    >
                                        <option value="New">New</option>
                                        <option value="In Process">In Process</option>
                                        <option value="Dead Lead">Dead Lead</option>
                                        <option value="Qualified">Qualified</option>
                                        <option value="Interested In Quote">Interested In Quote</option>
                                        <option value="Quotes sent">Quotes sent</option>
                                        <option value="Lost/Not Interested">Lost/Not Interested</option>
                                        <option value="Hot">Hot</option>
                                        <option value="Warm">Warm</option>
                                        <option value="Cold">Cold</option>
                                        <option value="Future Prospects">Future Prospects</option>
                                        <option value="Convert To account">Convert To account</option>
                                        <option value="Existing Account">Existing Account</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}