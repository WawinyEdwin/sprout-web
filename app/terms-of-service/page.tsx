import Link from "next/link";
import BrandHeader from "../auth/_components/BrandHeader";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <BrandHeader />
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-6">Effective Date: 9 Aug, 2025</p>

      <div className="space-y-6 text-gray-800 leading-relaxed">
        <p>
          Welcome to Sprout AI ("we," "us," "our"). These Terms of Service
          ("Terms") govern your access to and use of our software services,
          website, and related products (collectively, the "Services"). By
          accessing or using our Services, you agree to be bound by these Terms.
          If you do not agree, please do not use our Services.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">1. Eligibility</h2>
          <p>
            You must be at least 18 years old to use our Services. By agreeing
            to these Terms, you represent and warrant that you meet this age
            requirement and have the legal capacity to enter into a contract.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            2. Account Registration
          </h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              Provide accurate, current, and complete information during
              registration.
            </li>
            <li>
              Maintain the security of your account credentials and notify us
              immediately of any unauthorized use.
            </li>
            <li>
              Be responsible for all activities conducted through your account.
            </li>
            <li>
              If you are registering on behalf of a business, you represent that
              you have authority to bind that business to these Terms.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Use of Services</h2>
          <h3 className="font-semibold">3.1 License</h3>
          <p>
            Subject to your compliance with these Terms, we grant you a limited,
            non-exclusive, non-transferable, revocable license to access and use
            our Services for your internal business purposes.
          </p>

          <h3 className="font-semibold mt-2">3.2 Restrictions</h3>
          <ul className="list-disc ml-5 space-y-1">
            <li>Use the Services for any unlawful or unauthorized purpose.</li>
            <li>
              Reverse engineer, decompile, or attempt to extract source code
              from our software.
            </li>
            <li>
              Interfere with or disrupt the integrity or performance of the
              Services.
            </li>
            <li>
              Use automated systems or software to extract data without our
              prior written consent.
            </li>
            <li>Circumvent any access controls or security measures.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            4. Data and Integrations
          </h2>
          <p>
            Our Services connect to numerous third-party platforms to collect
            and display your financial, sales, marketing, and other operational
            data. You are solely responsible for:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Maintaining valid accounts with such third parties.</li>
            <li>
              Ensuring you have the necessary rights and permissions to
              authorize Sprout AI to access and use your data from those
              services.
            </li>
          </ul>
          <p>
            We do not control these third-party platforms and are not
            responsible for their availability, accuracy, or policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Payment and Billing</h2>
          <p>
            [If applicable, insert details about subscription plans, payment
            terms, refunds, billing cycles, etc.]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            6. Intellectual Property
          </h2>
          <p>
            All content, trademarks, software, and technology associated with
            Sprout AI are the property of Sprout AI or its licensors. Nothing in
            these Terms grants you ownership rights to our intellectual
            property.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our{" "}
            <Link href="/privacy-policy" className="text-emerald-600 underline">
              Privacy Policy
            </Link>{" "}
            to understand how we collect, use, and protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            8. Disclaimers and Limitation of Liability
          </h2>
          <h3 className="font-semibold">8.1 Disclaimer</h3>
          <p>
            Our Services are provided "as is" and "as available" without
            warranties of any kind, whether express or implied.
          </p>
          <h3 className="font-semibold mt-2">8.2 Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, Sprout AI shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly, arising from your use of or
            inability to use the Services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Sprout AI and its
            officers, directors, employees, and agents from any claims, damages,
            liabilities, or expenses arising out of your use of the Services or
            violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">10. Termination</h2>
          <p>
            We may suspend or terminate your access to the Services at any time,
            with or without cause or notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            11. Governing Law and Dispute Resolution
          </h2>
          <p>
            These Terms are governed by the laws of the State of New York. Any
            disputes shall be resolved in the state or federal courts located in
            New York County, New York.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">12. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of
            material changes by posting the updated Terms on our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">13. Contact Us</h2>
          <p>Email: privacy@sproutai.co</p>
        </section>

        <p className="mt-6 italic">
          Thank you for choosing Sprout AI. We look forward to helping you gain
          actionable insights and drive your business growth.
        </p>
      </div>
    </div>
  );
}
