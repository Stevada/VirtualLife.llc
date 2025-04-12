import { Sidebar } from "@/components/sidebar"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border p-4 flex items-center">
          <Link href="/" className="mr-4">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Introduction</h2>
            <p>
              Welcome to VirtualLife.ai. We respect your privacy and are committed to protecting your personal data. This
              privacy policy will inform you about how we look after your personal data when you visit our website and
              tell you about your privacy rights and how the law protects you.
            </p>
            <p>
              This privacy policy aims to give you information on how VirtualLife.ai collects and processes your personal
              data through your use of this website, including any data you may provide through this website when you
              sign up for an account, create a character, or engage with our AI characters.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">The Data We Collect About You</h2>
            <p>
              Personal data, or personal information, means any information about an individual from which that person
              can be identified. It does not include data where the identity has been removed (anonymous data).
            </p>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped
              together as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Identity Data</strong> includes username, password, and optional profile information.
              </li>
              <li>
                <strong>Contact Data</strong> includes email address.
              </li>
              <li>
                <strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type
                and version, time zone setting and location, browser plug-in types and versions, operating system and
                platform, and other technology on the devices you use to access this website.
              </li>
              <li>
                <strong>Usage Data</strong> includes information about how you use our website and services.
              </li>
              <li>
                <strong>Content Data</strong> includes information and content that you provide when creating characters
                or engaging in conversations with AI characters.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal
              data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>
                Where it is necessary for our legitimate interests and your interests and fundamental rights do not
                override those interests.
              </li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
            <p>Purposes for which we will use your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To register you as a new user</li>
              <li>To provide and improve our services</li>
              <li>To manage our relationship with you</li>
              <li>To administer and protect our business and this website</li>
              <li>To train and improve our AI models</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally
              lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your
              personal data to those employees, agents, contractors and other third parties who have a business need to
              know.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data,
              including the right to request access, correction, erasure, restriction, transfer, to object to
              processing, to portability of data and (where the lawful ground of processing is consent) to withdraw
              consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
              privacy@VirtualLife.ai
            </p>
          </section>

          <div className="text-sm text-muted-foreground pt-8">
            <p>Last updated: April 12, 2025</p>
          </div>
        </div>
      </main>
    </div>
  )
}
