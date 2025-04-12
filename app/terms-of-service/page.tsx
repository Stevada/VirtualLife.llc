import { Sidebar } from "@/components/sidebar"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border p-4 flex items-center">
          <Link href="/" className="mr-4">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold">Terms of Service</h1>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Introduction</h2>
            <p>
              Welcome to VirtualLife.ai. These terms and conditions outline the rules and regulations for the use of our
              website and services.
            </p>
            <p>
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use
              VirtualLife.ai if you do not agree to take all of the terms and conditions stated on this page.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">License to Use</h2>
            <p>
              Unless otherwise stated, VirtualLife.ai and/or its licensors own the intellectual property rights for all
              material on VirtualLife.ai. All intellectual property rights are reserved.
            </p>
            <p>
              You may view and/or use the website for your own personal use subject to restrictions set in these terms
              and conditions.
            </p>
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Republish material from VirtualLife.ai</li>
              <li>Sell, rent or sub-license material from VirtualLife.ai</li>
              <li>Reproduce, duplicate or copy material from VirtualLife.ai</li>
              <li>Redistribute content from VirtualLife.ai</li>
              <li>Use VirtualLife.ai in any way that is unlawful, illegal, fraudulent or harmful</li>
              <li>Use VirtualLife.ai for any purpose that is prohibited by these terms of service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">User Accounts</h2>
            <p>
              When you create an account with us, you guarantee that the information you provide is accurate, complete,
              and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate
              termination of your account on the service.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account and password, including but not
              limited to the restriction of access to your computer and/or account. You agree to accept responsibility
              for any and all activities or actions that occur under your account and/or password.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">User-Generated Content</h2>
            <p>
              Our service allows you to create AI characters, engage in conversations, and generate content. You are
              solely responsible for the content you create, including its legality, reliability, and appropriateness.
            </p>
            <p>By posting content on or through our service, you represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The content is yours (you own it) and/or you have the right to use it and the right to grant us the
                rights and license as provided in these terms.
              </li>
              <li>
                The content does not violate the privacy rights, publicity rights, copyrights, contract rights or any
                other rights of any person or entity.
              </li>
              <li>
                The content does not contain material that is false, intentionally misleading, defamatory, obscene,
                hateful, discriminatory, or otherwise objectionable.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">AI-Generated Content</h2>
            <p>
              You understand that the AI characters and content generated through our service are created using
              artificial intelligence technology. While we strive to ensure the quality and appropriateness of
              AI-generated content, we cannot guarantee that it will always be accurate, appropriate, or aligned with
              your expectations.
            </p>
            <p>
              VirtualLife.ai reserves the right to moderate, filter, or remove any AI-generated content that violates our
              content policies or these terms of service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Limitation of Liability</h2>
            <p>
              In no event shall VirtualLife.ai, nor its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your access to or use of or inability to access or use the service;</li>
              <li>Any conduct or content of any third party on the service;</li>
              <li>Any content obtained from the service; and</li>
              <li>Unauthorized access, use or alteration of your transmissions or content.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision
              is material, we will provide at least 30 days' notice prior to any new terms taking effect. What
              constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at: terms@VirtualLife.ai</p>
          </section>

          <div className="text-sm text-muted-foreground pt-8">
            <p>Last updated: April 12, 2025</p>
          </div>
        </div>
      </main>
    </div>
  )
}
