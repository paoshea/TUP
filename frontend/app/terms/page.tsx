"use client";

import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing and using TUP Assistant, you accept and agree to be bound by the terms
            and provision of this agreement.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="text-gray-600 mb-4">
            TUP Assistant provides a livestock management platform that includes evaluation tools,
            show management features, and data analytics capabilities. The service is provided
            "as is" and may be updated or modified at any time.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              To access certain features of the service, you must register for an account.
              You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate account information</li>
              <li>Maintain the security of your account</li>
              <li>Promptly update any changes to your account information</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">4. Privacy Policy</h2>
          <p className="text-gray-600 mb-4">
            Your use of TUP Assistant is subject to our Privacy Policy. Please review our
            Privacy Policy, which also governs the site and informs users of our data
            collection practices.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">5. User Data</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              You retain all rights to your data. By using our service, you grant us a license to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Store and backup your data</li>
              <li>Display your data within the service</li>
              <li>Modify your data per your instructions</li>
              <li>Use anonymized data for service improvements</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">6. Subscription and Payments</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Paid subscriptions are available on a monthly or annual basis. By subscribing, you agree:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To pay all applicable fees</li>
              <li>That subscriptions automatically renew unless cancelled</li>
              <li>Refunds are subject to our refund policy</li>
              <li>Prices may change with notice</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
          <p className="text-gray-600 mb-4">
            We reserve the right to terminate or suspend access to our service immediately,
            without prior notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            In no event shall TUP Assistant, nor its directors, employees, partners, agents,
            suppliers, or affiliates, be liable for any indirect, incidental, special,
            consequential or punitive damages.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            We reserve the right to modify these terms at any time. We will notify users
            of any material changes via email or service notification. Continued use of
            the service constitutes acceptance of updated terms.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
          <p className="text-gray-600">
            Questions about the Terms of Service should be sent to us at{' '}
            <a href="mailto:legal@tupassistant.com" className="text-primary hover:underline">
              legal@tupassistant.com
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