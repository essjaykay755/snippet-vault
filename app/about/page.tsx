import { LegalLayout } from "@/components/LegalLayout";

export default function AboutPage() {
  return (
    <LegalLayout title="About">
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">About SnippetVault</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            SnippetVault is a modern code snippet manager designed to help
            developers organize and access their code snippets efficiently.
            Built with developers in mind, it combines powerful features with a
            clean, intuitive interface.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Core Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Smart Organization</h3>
              <p className="text-muted-foreground">
                Organize snippets by language and tags for quick access
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Instant Search</h3>
              <p className="text-muted-foreground">
                Find any snippet quickly with powerful search capabilities
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Syntax Highlighting</h3>
              <p className="text-muted-foreground">
                Beautiful syntax highlighting for multiple programming languages
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Cloud Sync</h3>
              <p className="text-muted-foreground">
                Access your snippets from anywhere with cloud synchronization
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold">About the Developer</h2>
          <div className="p-6 rounded-lg border bg-card">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hi! I'm Subhojit Karmakar, a passionate full-stack developer with
              a love for creating tools that make developers' lives easier.
              SnippetVault was born from my own need for a better way to
              organize code snippets.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-muted-foreground">
                Made with ❤️ and ☕️ by Subhojit Karmakar
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/essjaykay755"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub
                </a>
                <a
                  href="mailto:essjaykay755@gmail.com"
                  className="text-primary hover:underline"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
