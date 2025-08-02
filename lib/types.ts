export interface Integration {
  description: string;
  name: string;
  category: string;
  id: string;
  difficulty?: string;
  setupTime?: string;
  popularity?: string;
  key: string;
  metrics: IMetric[];
}
export interface UserIntegration {
  id: string;
  integration: Integration;
  lastSynced: string;
  connected: boolean;
}
export interface IMetric {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface IUser {
  email: string;
  completedOnboarding: boolean;
}

export type StoredUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  completedOnboarding: boolean;
  companyName: string;
  companyIndustry: string;
};

export interface AuthPayload {
  email: string;
  password: string;
  userMetadata?: {
    firstName: string;
    lastName: string;
    agreedToTerms: boolean;
    completedOnboarding: boolean;
    companyName: string;
    companyIndustry: string;
  };
}

export const INDUSTRY_OPTIONS = [
  {
    label: "Services",
    options: [
      {
        label: "Professional Services (Consulting, Legal, Accounting)",
        value: "professional_services",
      },
      { label: "Creative & Marketing Agencies", value: "creative_agency" },
      { label: "IT Services / MSPs", value: "it_services" },
      { label: "Repair & Maintenance", value: "repair_maintenance" },
    ],
  },
  {
    label: "Retail & E-commerce",
    options: [
      { label: "Retail (Brick & Mortar)", value: "retail" },
      { label: "E-commerce / Online Store", value: "ecommerce" },
      { label: "Dropshipping", value: "dropshipping" },
    ],
  },
  {
    label: "Hospitality",
    options: [
      { label: "Restaurants & Cafés", value: "restaurants" },
      { label: "Hotels & Lodging", value: "hotels" },
      { label: "Catering & Events", value: "catering" },
    ],
  },
  {
    label: "Health & Wellness",
    options: [
      { label: "Medical Practice / Clinics", value: "medical" },
      { label: "Fitness & Gyms", value: "fitness" },
      { label: "Beauty & Personal Care", value: "beauty" },
      { label: "Mental Health Services", value: "mental_health" },
    ],
  },
  {
    label: "Construction & Real Estate",
    options: [
      { label: "Construction / Contracting", value: "construction" },
      { label: "Real Estate (Sales or Rentals)", value: "real_estate" },
      { label: "Property Management", value: "property_management" },
    ],
  },
  {
    label: "Education & Training",
    options: [
      { label: "Private Tutors / Training Providers", value: "private_tutors" },
      { label: "Online Courses / eLearning", value: "elearning" },
      { label: "Schools / Daycares", value: "schools" },
    ],
  },
  {
    label: "Manufacturing & Logistics",
    options: [
      { label: "Light Manufacturing", value: "manufacturing" },
      { label: "Warehousing & Distribution", value: "warehousing" },
      { label: "Import/Export or Wholesale", value: "wholesale" },
    ],
  },
  {
    label: "Finance & Insurance",
    options: [
      { label: "Bookkeeping / Tax Services", value: "bookkeeping" },
      { label: "Financial Advisors", value: "financial_advisors" },
      { label: "Insurance Agents/Brokers", value: "insurance" },
    ],
  },
  {
    label: "Nonprofit & Community",
    options: [
      { label: "NGOs / Charities", value: "ngo" },
      { label: "Churches & Faith-based Orgs", value: "faith" },
      { label: "Community Initiatives", value: "community" },
    ],
  },
  {
    label: "Other",
    options: [
      { label: "Agriculture / Farming", value: "agriculture" },
      { label: "Media / Publishing", value: "media" },
      { label: "Government Services", value: "government" },
      { label: "Other (please specify)", value: "other" },
    ],
  },
];
