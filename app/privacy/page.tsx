import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Sunward Travel',
};

export default function PrivacyPage() {
  return (
    <div className="py-16 px-4 max-w-3xl mx-auto">
      <h1 className="font-display font-700 text-4xl text-ink mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg text-mist">
        <p>Last updated: August 2026</p>
        
        <h2>1. Analytics and Tracking</h2>
        <p>
          We use Google Analytics to understand how visitors use our website, which helps us improve our content and user experience. 
          This analytics service uses cookies to collect data about your visit, such as pages viewed, time spent on the site, 
          and general geographic location. We use this data in an aggregated way and do not attempt to identify you personally.
        </p>

        <h2>2. Affiliate Links</h2>
        <p>
          Sunward Travel partners with travel providers (such as Klook, Kiwitaxi, and Travelpayouts). 
          When you click on an affiliate link and navigate to a partner&apos;s website, we track that outbound click to measure 
          the performance of our recommendations. 
        </p>
        <p>
          Once you leave our site and visit a partner, their privacy policy and cookie rules apply. We do not collect or store 
          your personal booking information, payment details, or passwords for these third-party services.
        </p>

        <h2>3. Third-Party Services</h2>
        <p>
          We may embed third-party content or use services that have their own data collection policies. 
          For example, our flight search functionality is powered by Travelpayouts, which may set its own cookies 
          and collect search data when you interact with the search widget.
        </p>

        <h2>4. Data Handling</h2>
        <p>
          We do not require users to create accounts, and we do not collect personal data like names or email addresses 
          unless you explicitly provide them (for instance, by subscribing to a newsletter, if available). 
          Any data we collect is handled carefully and is used solely to provide and improve our services.
        </p>

        <h2>5. Your Choices</h2>
        <p>
          You can use our cookie consent banner to opt out of analytics tracking. This will not affect your ability 
          to access or read the content on Sunward Travel.
        </p>
      </div>
    </div>
  );
}
