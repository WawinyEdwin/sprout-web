import BrandHeader from "../auth/_components/BrandHeader";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-slate-800">
      <BrandHeader />
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Effective Date: 9 Aug, 2025</p>

      <p className="mb-4">
        Sprout AI ("we," "us," "our") is committed to protecting your privacy.
        This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you use our software services, including
        our custom dashboard platform connecting over 100+ data integrations. By
        accessing or using our services, you agree to the terms of this Privacy
        Policy.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <h3 className="font-semibold mt-4 mb-1">1.1 Personal Information</h3>
      <ul className="list-disc pl-6 mb-4">
        <li>Full name</li>
        <li>Email address</li>
        <li>Job title and department (if applicable)</li>
        <li>Company name (if applicable)</li>
        <li>Account login credentials</li>
      </ul>

      <h3 className="font-semibold mt-4 mb-1">1.2 Data From Integrations</h3>
      <ul className="list-disc pl-6 mb-4">
        <li>Financial transaction data</li>
        <li>Sales performance metrics</li>
        <li>Marketing campaign data</li>
        <li>Other business operational metrics</li>
      </ul>

      <h3 className="font-semibold mt-4 mb-1">
        1.3 Automatically Collected Information
      </h3>
      <ul className="list-disc pl-6 mb-4">
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Device information</li>
        <li>Usage data (e.g., pages visited, time spent on pages)</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Provide, operate, and maintain our dashboard and services</li>
        <li>Process and display your connected data integrations</li>
        <li>
          Communicate with you, including customer support and service updates
        </li>
        <li>Improve and personalize your experience</li>
        <li>Monitor and analyze usage trends and preferences</li>
        <li>Detect and prevent fraud or unauthorized access</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Data Sharing and Disclosure
      </h2>
      <p className="mb-4">
        We do not sell your personal information. We may share your information
        with:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Service Providers</li>
        <li>Legal Requirements</li>
        <li>Business Transfers</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
      <p className="mb-4">
        We implement reasonable administrative, technical, and physical
        safeguards to protect your personal information from unauthorized
        access, disclosure, alteration, and destruction. However, no method of
        transmission over the internet or electronic storage is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Data Rights</h2>
      <p className="mb-4">
        Depending on your location, you may have certain rights regarding your
        personal information. To exercise your rights, please contact us at:
        privacy@sproutai.co.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Cookies and Tracking Technologies
      </h2>
      <p className="mb-4">
        We use cookies and similar tracking technologies to enhance your
        experience, analyze usage, and deliver personalized content. You can
        manage or disable cookies via your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Data Retention</h2>
      <p className="mb-4">
        We retain your personal information only as long as necessary to provide
        services, comply with legal obligations, resolve disputes, and enforce
        our agreements.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. International Data Transfers
      </h2>
      <p className="mb-4">
        Since we operate in the United States, your information may be processed
        and stored in the U.S. or other countries. We take appropriate measures
        to ensure your data is protected.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Children’s Privacy</h2>
      <p className="mb-4">
        Our services are not directed to individuals under the age of 13. We do
        not knowingly collect personal information from children.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        10. Changes to This Privacy Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We will notify you
        of any material changes by posting the updated policy and updating the
        “Effective Date”.
      </p>

      <section>
        <h2 className="text-xl font-semibold mb-2">13. Contact Us</h2>
        <p>Email: privacy@sproutai.co</p>
      </section>

      <p className="mt-6 italic">
        Thank you for choosing Sprout AI. We look forward to helping you gain
        actionable insights and drive your business growth.
      </p>
    </div>
  );
}
