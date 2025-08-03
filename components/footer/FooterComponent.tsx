import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// TypeScript interfaces
interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  displayText: string;
  platformText: string;
}

interface FooterLink {
  title: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: {
    src: string;
    alt: string;
  };
  productName?: string;
  description?: string;
  companyInfo?: {
    name: string;
    id?: string;
    address?: string;
  };
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  legalLinks?: FooterLink[];
  contactEmail?: string;
  paymentMethods?: Array<{
    name: string;
    src: string;
  }>;
  className?: string;
}

// Default social icons
const DiscordIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" className={className}>
    <path d="M9.60216 5.44677C9.60216 5.44677 10.7148 5.21397 12.0001 5.21397C13.2853 5.21397 14.398 5.44677 14.398 5.44677L14.8429 4.52891C14.9369 4.33509 15.1436 4.22196 15.3548 4.25602C17.5009 4.60213 19.5009 5.75 19.5009 5.75C19.5009 5.75 21.9992 8.25 21.9992 17.0673C22.0003 17.2261 21.9264 17.3801 21.7985 17.4725C20.1581 18.6572 18.1658 19.4353 17.362 19.7224C17.149 19.7985 16.9157 19.7127 16.7942 19.5205L16.2317 18.6301C16.0777 18.3864 16.1577 18.0622 16.407 17.9198L17.5824 17.2483L17.1069 16.8731C17.1069 16.8731 15.205 18.0247 12.0001 18.0247C8.79513 18.0247 6.89318 16.8731 6.89318 16.8731L6.4177 17.2483L7.59311 17.9198C7.84237 18.0622 7.92236 18.3864 7.76839 18.6301L7.20588 19.5205C7.08443 19.7127 6.85111 19.7985 6.63812 19.7224C5.83436 19.4353 3.84203 18.6572 2.20165 17.4725C2.07371 17.3801 1.99986 17.2261 2.00086 17.0673C2.00086 8.25 4.50085 5.75 4.50085 5.75C4.50085 5.75 6.50085 4.60187 8.64535 4.25602C8.8565 4.22196 9.0632 4.33509 9.15717 4.52891L9.60216 5.44677ZM17.2509 12.75C17.2509 13.8546 16.4674 14.75 15.5009 14.75C14.5344 14.75 13.7509 13.8546 13.7509 12.75C13.7509 11.6454 14.5344 10.75 15.5009 10.75C16.4674 10.75 17.2509 11.6454 17.2509 12.75ZM8.50085 14.75C9.46735 14.75 10.2509 13.8546 10.2509 12.75C10.2509 11.6454 9.46735 10.75 8.50085 10.75C7.53436 10.75 6.75085 11.6454 6.75085 12.75C6.75085 13.8546 7.53436 14.75 8.50085 14.75Z" fill="currentColor" fillRule="evenodd"/>
  </svg>
);

const RedditIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" className={className}>
    <path d="M19 1.25C17.4812 1.25 16.25 2.48122 16.25 4C16.25 5.51878 17.4812 6.75 19 6.75C20.5188 6.75 21.75 5.51878 21.75 4C21.75 2.48122 20.5188 1.25 19 1.25Z" fill="currentColor"/>
    <path d="M4.14048 8.25C2.55089 8.25 1.25 9.52826 1.25 11.1201C1.25 12.2307 1.88487 13.1893 2.80481 13.6659L3.29924 13.9221L6.9331 10.1856L6.64955 9.69441C6.1511 8.83088 5.21302 8.25 4.14048 8.25Z" fill="currentColor"/>
    <path d="M19.86 8.25C18.7875 8.25 17.8494 8.83088 17.3509 9.69441L17.0674 10.1856L20.7012 13.9221L21.1957 13.6659C22.1156 13.1893 22.7505 12.2307 22.7505 11.1201C22.7505 9.52826 21.4496 8.25 19.86 8.25Z" fill="currentColor"/>
    <path d="M16.9463 3.25L17 3.25C17.4142 3.25 17.75 3.58579 17.75 4C17.75 4.41422 17.4142 4.75 17 4.75C15.8003 4.75 14.976 4.75159 14.3568 4.83484C13.7591 4.91519 13.4661 5.05902 13.2626 5.26256C13.059 5.4661 12.9152 5.75914 12.8348 6.35676C12.7516 6.97595 12.75 7.80029 12.75 9C12.75 9.41422 12.4142 9.75 12 9.75C11.5858 9.75 11.25 9.41422 11.25 9L11.25 8.94631C11.25 7.81348 11.25 6.88775 11.3482 6.15689C11.4509 5.39294 11.6732 4.7306 12.2019 4.2019C12.7306 3.67321 13.3929 3.45093 14.1569 3.34822C14.8877 3.24996 15.8135 3.24998 16.9463 3.25Z" fill="currentColor" fillRule="evenodd"/>
    <path d="M12 8.25C9.37459 8.25 6.96692 9.01746 5.19692 10.2958C3.42791 11.5734 2.25 13.4037 2.25 15.5C2.25 17.5963 3.42791 19.4266 5.19692 20.7042C6.96692 21.9825 9.37459 22.75 12 22.75C14.6254 22.75 17.0331 21.9825 18.8031 20.7042C20.5721 19.4266 21.75 17.5963 21.75 15.5C21.75 13.4037 20.5721 11.5734 18.8031 10.2958C17.0331 9.01746 14.6254 8.25 12 8.25ZM7.90846 17.289C8.16308 16.9623 8.63434 16.9038 8.96106 17.1585C9.82307 17.8302 10.8715 18.2199 12 18.2199C13.1286 18.2199 14.177 17.8302 15.039 17.1585C15.3657 16.9038 15.837 16.9623 16.0916 17.289C16.3462 17.6157 16.2878 18.087 15.9611 18.3416C14.8528 19.2053 13.4839 19.7199 12 19.7199C10.5162 19.7199 9.14724 19.2053 8.03901 18.3416C7.71229 18.087 7.65385 17.6157 7.90846 17.289ZM9 12C8.17157 12 7.5 12.6716 7.5 13.5C7.5 14.3284 8.17157 15 9 15H9.00897C9.8374 15 10.509 14.3284 10.509 13.5C10.509 12.6754 9.82084 12 9 12ZM14.991 12C14.1626 12 13.491 12.6716 13.491 13.5C13.491 14.3284 14.1626 15 14.991 15H15C15.8284 15 16.5 14.3284 16.5 13.5C16.5 12.6754 15.8119 12 14.991 12Z" fill="currentColor" fillRule="evenodd"/>
  </svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" className={className}>
    <path d="M11.2582 8.23767C11.1447 5.63601 13.2575 3.25 16 3.25C17.0745 3.25 18.067 3.60755 18.8629 4.20937L21.8895 3.7582C22.1672 3.71679 22.4449 3.83404 22.6089 4.06201C22.7729 4.28998 22.7958 4.59048 22.6682 4.84067L20.7346 8.63307C20.4044 15.3809 14.8294 20.75 8.00005 20.75C5.70521 20.75 3.52189 20.2468 1.62451 19.1492C1.34284 18.9863 1.19837 18.6603 1.26684 18.3422C1.33531 18.0241 1.60109 17.7864 1.92484 17.7538C2.62749 17.683 3.68928 17.4806 4.55591 17.165C4.99281 17.0059 5.33383 16.8344 5.55154 16.6675C5.5727 16.6513 5.59165 16.6359 5.60862 16.6215C2.5742 13.2838 1.50804 8.17157 2.76751 3.89342C2.85052 3.61145 3.0906 3.40396 3.38162 3.36266C3.67264 3.32137 3.96096 3.45389 4.11913 3.70164C5.72891 6.22305 8.3663 8.09513 11.2582 8.23767Z" fill="currentColor"/>
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" className={className}>
    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>
    <path d="M16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M17.5078 6.5L17.4988 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
  </svg>
);

// Default configuration
const DEFAULT_SECTIONS: FooterSection[] = [
  {
    title: "Features",
    links: [
      { title: "AI Character Chat", href: "/discover" },
      { title: "Character Gallery", href: "/gallery" },
    ]
  },
  {
    title: "Popular",
    links: [
      { title: "Featured Characters", href: "/discover" },
    ]
  }
];

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Discord",
    href: "https://discord.gg/virtuallife",
    icon: <DiscordIcon className="w-5 h-5 mr-2 text-white" />,
    displayText: "VirtualLife",
    platformText: "on Discord"
  },
  // {
  //   name: "Reddit",
  //   href: "https://reddit.com/r/SpicyChat",
  //   icon: <RedditIcon className="w-5 h-5 mr-2 text-white" />,
  //   displayText: "SpicyChat",
  //   platformText: "on Reddit"
  // },
  // {
  //   name: "Twitter",
  //   href: "https://twitter.com/spicychat_ai",
  //   icon: <TwitterIcon className="w-5 h-5 mr-2 text-white" />,
  //   displayText: "@SpicyChat_AI",
  //   platformText: "on Twitter"
  // },
  {
    name: "Instagram",
    href: "https://instagram.com/virtuallife.ai",
    icon: <InstagramIcon className="w-5 h-5 mr-2 text-white" />,
    displayText: "@virtuallife.ai",
    platformText: "on Instagram"
  }
];

const DEFAULT_LEGAL_LINKS: FooterLink[] = [
  { title: "Terms of Service", href: "/legal/terms" },
  { title: "Privacy Policy", href: "/legal/privacy" },
  // { title: "Legal", href: "/legal" },
  // { title: "Community Guidelines", href: "/legal/guidelines" }
];

const FooterComponent: React.FC<FooterProps> = ({
  logo = { src: "/favicon_io/favicon.ico", alt: "virtuallife.ai" },
  productName = "virtuallife.ai",
  description = "virtuallife.ai provides AI characters designed for adult entertainment and companionship.",
  companyInfo = {
    name: "Virtual Life LLC",
    id: "301443929",
    address: "1111B S Governors Ave STE 29179, Dover, DE 19904, United States"
  },
  sections = DEFAULT_SECTIONS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  legalLinks = DEFAULT_LEGAL_LINKS,
  contactEmail = "help@virtuallife.ai",
  paymentMethods = [
    // { name: "Visa", src: "/assets/visa.svg" },
    // { name: "MasterCard", src: "/assets/mastercard.svg" }
  ],
  className = ""
}) => {
  return (
    <div className={`bg-black mt-10 ${className}`}>
      <footer className="py-10 pb-20 px-6 bg-gradient-to-br from-purple-600/30 to-purple-600/0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {/* Company Info Section */}
          <div>
            <Link href="/" className="flex items-center">
              {/* <Image 
                alt={logo.alt}
                className="w-auto h-7"
                src={logo.src}
                width={150}
                height={28}
              /> */}
              <div>
                <span className="text-2xl font-bold">Virtual</span>
                <span className="text-2xl font-bold text-purple-500">Life</span>
                <span className="text-2xl font-bold">.ai</span>
              </div>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              {description}
            </p>
            <div className="mt-4 text-muted-foreground">
              <p>{companyInfo.name}</p>
              {companyInfo.id && <p className="mt-2">Company ID: {companyInfo.id}</p>}
              {companyInfo.address && <p className="mt-2">{companyInfo.address}</p>}
            </div>
          </div>

          {/* Feature Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h5 className="text-white font-bold text-lg mb-4">{section.title}</h5>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="hover:underline"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links Section */}
          <div>
            <h5 className="text-white font-bold text-lg mb-4">Socials</h5>
            <ul className="space-y-4">
              {socialLinks.map((social, index) => (
                <li key={index}>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline flex items-center"
                  >
                    {social.icon}
                    <span>
                      {social.displayText}{' '}
                      <span className="text-muted-foreground">{social.platformText}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 mb-2 flex flex-col md:flex-row items-end justify-between gap-4 py-4">
          <div className="text-sm text-muted-foreground w-full grow">
            <p className="font-semibold">
              © {productName} {new Date().getFullYear()} - All rights reserved
            </p>
            <div className="mt-2">
              {legalLinks.map((link, index) => (
                <React.Fragment key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {link.title}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="mx-2 inline-block text-muted-foreground">·</span>
                  )}
                </React.Fragment>
              ))}
              {/* Payment Security Information */}
              <span className="mx-2 inline-block text-muted-foreground">·</span>
              <Link
                href="https://stripe.com/docs/security"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:underline"
              >
                Payments handled securely by Stripe
              </Link>
              <span className="mx-2 inline-block text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">
                We do not store payment information
              </span>
              {contactEmail && (
                <>
                  <span className="mx-2 inline-block text-muted-foreground">·</span>
                  <Link
                    href={`mailto:${contactEmail}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {contactEmail}
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Payment Methods */}
          {paymentMethods && paymentMethods.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {paymentMethods.map((method, index) => (
                <Image
                  key={index}
                  alt={method.name}
                  className="h-10"
                  src={method.src}
                  width={60}
                  height={40}
                />
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default FooterComponent;