import { LegalLayout } from "@/components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Last updated: February 2024
          </p>
          <p className="text-muted-foreground leading-relaxed">
            At SnippetVault, we take your privacy seriously. This policy
            explains how we collect, use, and protect your personal information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Information We Collect</h2>
          <div className="space-y-2">
            <h3 className="font-semibold">Account Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Google account information (when you sign in)</li>
              <li>Email address</li>
              <li>Profile name and picture</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Usage Data</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Code snippets you create and store</li>
              <li>Tags and categories you create</li>
              <li>Your preferences and settings</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How We Use Your Data</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>To provide and maintain the service</li>
            <li>To improve user experience</li>
            <li>To communicate important updates</li>
            <li>To prevent abuse and maintain security</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures to protect your
            data. Your code snippets are stored securely and are only accessible
            to you unless you explicitly share them.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For privacy-related questions, please contact:{" "}
            <a
              href="mailto:essjaykay755@gmail.com"
              className="text-primary hover:underline"
            >
              essjaykay755@gmail.com
            </a>
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
