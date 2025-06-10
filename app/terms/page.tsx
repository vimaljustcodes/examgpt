import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back to ExamGPT
        </Link>

        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-black mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using ExamGPT ("the Service"), you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ExamGPT is an AI-powered study assistant designed to help students with their academic needs. The service
              provides:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>AI-generated explanations and study materials</li>
              <li>Practice questions and exam preparation</li>
              <li>Subject-specific guidance across multiple disciplines</li>
              <li>Chat history and conversation memory (for Pro users)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">3. User Accounts and Subscriptions</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Free Tier:</strong> Anonymous users receive 10 free messages per month based on IP address.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Pro Subscriptions:</strong> Paid users receive unlimited messages, chat history, and additional
              features. Subscriptions are billed monthly or as a one-time lifetime payment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Generate harmful, illegal, or inappropriate content</li>
              <li>Attempt to reverse engineer or exploit the AI system</li>
              <li>Share your account credentials with others</li>
              <li>Use the service for commercial purposes without permission</li>
              <li>Submit content that violates intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">5. Academic Integrity</h2>
            <p className="text-gray-700 leading-relaxed">
              ExamGPT is designed to assist with learning and understanding. Users are responsible for ensuring their
              use of the service complies with their institution's academic integrity policies. We encourage using
              ExamGPT as a study aid rather than for completing assignments directly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">6. Payment and Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Payments are processed securely through DodoPayments. Monthly subscriptions can be cancelled at any time.
              Lifetime subscriptions are non-refundable after 7 days of purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              ExamGPT provides AI-generated content for educational purposes. While we strive for accuracy, we cannot
              guarantee the correctness of all information provided. Users should verify important information
              independently.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes via
              email or through the service interface.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">9. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:support@examgpt.com" className="text-blue-600 hover:underline">
                support@examgpt.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
