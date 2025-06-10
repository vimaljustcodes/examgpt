import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back to ExamGPT
        </Link>

        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-black mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">1. Information We Collect</h2>

            <h3 className="text-lg font-medium text-black mb-3">Account Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">When you create an account, we collect:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Email address</li>
              <li>Name (if provided)</li>
              <li>University and course information (optional)</li>
              <li>Country and academic year (optional)</li>
            </ul>

            <h3 className="text-lg font-medium text-black mb-3">Usage Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">We automatically collect:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Chat messages and AI responses</li>
              <li>IP address (for rate limiting anonymous users)</li>
              <li>Device and browser information</li>
              <li>Usage patterns and feature interactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use collected information to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide personalized AI responses based on your academic profile</li>
              <li>Maintain chat history and conversation memory</li>
              <li>Process payments and manage subscriptions</li>
              <li>Improve our AI models and service quality</li>
              <li>Enforce rate limits and prevent abuse</li>
              <li>Send important service updates and notifications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share information only
              in these limited circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Service Providers:</strong> With trusted partners who help operate our service (Clerk for
                authentication, Supabase for data storage, DodoPayments for payment processing)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights and users' safety
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger or acquisition
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure database storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Limited employee access to personal data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">5. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">We retain your data as follows:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>
                <strong>Account Data:</strong> Until you delete your account
              </li>
              <li>
                <strong>Chat History:</strong> Indefinitely for Pro users, or until account deletion
              </li>
              <li>
                <strong>Anonymous Usage:</strong> IP-based rate limiting data for 30 days
              </li>
              <li>
                <strong>Payment Data:</strong> As required by financial regulations
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">6. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Export your chat history</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use essential cookies for authentication and service functionality. We do not use tracking cookies for
              advertising purposes. Anonymous users are tracked by IP address solely for rate limiting purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              ExamGPT is designed for students 13 years and older. We do not knowingly collect personal information from
              children under 13. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">9. International Users</h2>
            <p className="text-gray-700 leading-relaxed">
              ExamGPT is operated from the United States. By using our service, you consent to the transfer and
              processing of your data in the US, which may have different privacy laws than your country.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">10. Changes to Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. We will notify users of significant changes via email or
              through the service interface. Continued use of the service after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For privacy-related questions or to exercise your rights, contact us at{" "}
              <a href="mailto:privacy@examgpt.com" className="text-blue-600 hover:underline">
                privacy@examgpt.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
