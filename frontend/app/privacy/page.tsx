"use client";

import { Card } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <div className="space-y-4 text-gray-600">
            <p className="mb-2">We collect information that you provide directly to us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Profile information (organization, role)</li>
              <li>Livestock data and records</li>
              <li>Usage data and preferences</li>
              <li>Communication data (support inquiries, feedback)</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <div className="space-y-4 text-gray-600">
            <p>We use the collected information for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing and maintaining the service</li>
              <li>Processing and completing transactions</li>
              <li>Sending administrative information</li>
              <li>Providing customer support</li>
              <li>Improving and personalizing the service</li>
              <li>Analyzing usage patterns and trends</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              We implement appropriate security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure data backups</li>
              <li>Physical security measures</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
          <div className="space-y-4 text-gray-600">
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers and partners</li>
              <li>Legal authorities when required</li>
              <li>Other users (with your permission)</li>
              <li>Analytics providers (anonymized data)</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
          <div className="space-y-4 text-gray-600">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request data deletion</li>
              <li>Opt-out of communications</li>
              <li>Export your data</li>
              <li>Withdraw consent</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain your session</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns</li>
              <li>Improve performance</li>
            </ul>
            <p>
              You can control cookie preferences through your browser settings.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
          <p className="text-gray-600 mb-4">
            Our service is not intended for children under 13. We do not knowingly
            collect personal information from children under 13. If you believe we
            have collected information from a child under 13, please contact us.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
          <p className="text-gray-600 mb-4">
            Your information may be transferred to and processed in countries other
            than your country of residence. We ensure appropriate safeguards are in
            place for international data transfers.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to Privacy Policy</h2>
          <p className="text-gray-600 mb-4">
            We may update this privacy policy from time to time. We will notify you
            of any changes by posting the new policy on this page and updating the
            "last updated" date.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="text-gray-600">
            For questions about this privacy policy, please contact us at{' '}
            <a href="mailto:privacy@tupassistant.com" className="text-primary hover:underline">
              privacy@tupassistant.com
            </a>
          </p>
        </Card>

        <div className="text-center text-gray-600 text-sm">
          <p>Last updated: February 15, 2025</p>
        </div>
      </div>
    </div>
  );
}