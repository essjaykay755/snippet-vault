import { LegalLayout } from "@/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Last updated: February 2024
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By using SnippetVault, you agree to these terms. Please read them
            carefully.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Account Terms</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>You must sign in using a valid Google account</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must not use the service for any illegal purposes</li>
            <li>You must not abuse or attempt to harm the service</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Code Snippets</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>You retain all rights to your code snippets</li>
            <li>You must not store or share malicious code</li>
            <li>You must not violate any intellectual property rights</li>
            <li>We may remove content that violates these terms</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Service Availability</h2>
          <p className="text-muted-foreground leading-relaxed">
            We strive to maintain high availability but do not guarantee
            uninterrupted access. We reserve the right to modify or discontinue
            the service at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about these terms, please contact:{" "}
            <a
              href="mailto:essjaykay755@gmail.com"
              className="text-primary hover:underline"
            >
              essjaykay755@gmail.com
            </a>
          </p>
          <p className="text-sm text-muted-foreground mt-8">
            Made with ❤️ and ☕️ by Subhojit Karmakar
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
