"use client";

import { Card } from '@/components/ui/card';

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Cookie Policy</h1>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
          <p className="text-gray-600 mb-4">
            Cookies are small text files that are placed on your device when you visit
            our website. They help us provide you with a better experience by:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Remembering your preferences</li>
            <li>Keeping you signed in</li>
            <li>Understanding how you use our service</li>
            <li>Improving our platform based on your behavior</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold mb-2">Essential Cookies</h3>
              <p>
                Required for the operation of our platform. They enable basic functions
                like page navigation and access to secure areas.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Functionality Cookies</h3>
              <p>
                Allow us to remember choices you make and provide enhanced features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Analytics Cookies</h3>
              <p>
                Help us understand how visitors interact with our platform by collecting
                and reporting information anonymously.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Performance Cookies</h3>
              <p>
                Collect information about how you use our platform, helping us improve
                its functionality.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Cookies</h2>
          <div className="space-y-4 text-gray-600">
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication and security</li>
              <li>Preferences and settings</li>
              <li>Analytics and performance</li>
              <li>Feature functionality</li>
              <li>Session management</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
          <div className="space-y-4 text-gray-600">
            <p>You can control cookies through your browser settings:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">Chrome:</span> Settings → Privacy and Security → Cookies
              </li>
              <li>
                <span className="font-semibold">Firefox:</span> Options → Privacy & Security → Cookies
              </li>
              <li>
                <span className="font-semibold">Safari:</span> Preferences → Privacy → Cookies
              </li>
              <li>
                <span className="font-semibold">Edge:</span> Settings → Privacy & Security → Cookies
              </li>
            </ul>
            <p className="mt-4">
              Please note that blocking some types of cookies may impact your
              experience of our platform.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Cookies</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              We may use third-party services that set cookies:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google Analytics (analytics)</li>
              <li>Stripe (payment processing)</li>
              <li>Intercom (customer support)</li>
            </ul>
            <p>
              These services have their own privacy policies and cookie management
              systems.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">6. Cookie Consent</h2>
          <p className="text-gray-600 mb-4">
            When you first visit our platform, we'll ask for your consent to set
            cookies. You can change your preferences at any time through our cookie
            settings panel.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
          <p className="text-gray-600 mb-4">
            We may update this Cookie Policy from time to time. Changes will be
            posted on this page with an updated revision date.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p className="text-gray-600">
            If you have questions about our Cookie Policy, please contact us at{' '}
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