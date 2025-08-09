export const mockUsage = {
  dataSources: { current: 5, limit: 10 },
  aiQueries: { current: 1250, limit: 2500 },
  dashboards: { current: 8, limit: 15 },
  teamMembers: { current: 3, limit: 5 },
};

export const mockInvoices = [
  {
    id: "inv_001",
    number: "INV-2025-001",
    date: "2025-01-15",
    amount: 399,
    status: "paid",
    description: "Growth Plan - January 2025",
  },
  {
    id: "inv_002",
    number: "INV-2025-002",
    date: "2025-02-15",
    amount: 399,
    status: "paid",
    description: "Growth Plan - Feb 2025",
  },
  {
    id: "inv_003",
    number: "INV-2025-003",
    date: "2025-03-15",
    amount: 399,
    status: "overdue",
    description: "Growth Plan - Feb 2025",
  },
];

export const plans = [
  {
    name: "Professional",
    price: 199,
    features: [
      "3 Data Sources",
      "AI KPI Monitoring",
      "Basic Predictions",
      "Email alerts",
      "Standard Support",
    ],
    current: false,
  },
  {
    name: "Growth",
    price: 399,
    features: [
      "7 Data Sources",
      "Advance AI predictions",
      "Automated Actions",
      "Custom Dashboards",
      "Priority Support",
    ],
    current: true,
  },
  {
    name: "Enterprise",
    price: 899,
    features: [
      "Unlimited Data Sources",
      "Full AI brain capabilities",
      "Custom AI Models",
      "Dedicated Customer support manager",
      "24/7 premium support",
    ],
    current: false,
  },
];
