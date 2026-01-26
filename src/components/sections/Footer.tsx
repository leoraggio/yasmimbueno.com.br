import Link from "next/link";
import { SiteSettingsData } from "@/types/strapi";

// Fallback data
const defaultData = {
  siteName: "Yasmim Bueno",
  footerCopyright: "Clínica de Psicologia. Todos os direitos reservados.",
  privacyPolicyLink: "#",
  termsLink: "#",
};

interface FooterProps {
  data?: SiteSettingsData;
}

export function Footer({ data }: FooterProps) {
  const siteName = data?.siteName || defaultData.siteName;
  const footerCopyright = data?.footerCopyright || defaultData.footerCopyright;
  const privacyPolicyLink = data?.privacyPolicyLink || defaultData.privacyPolicyLink;
  const termsLink = data?.termsLink || defaultData.termsLink;

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Política de Privacidade", href: privacyPolicyLink },
    { label: "Termos de Uso", href: termsLink },
    { label: "Recursos de Crise", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo & Copyright */}
        <div className="text-center md:text-left">
          <Link
            href="#"
            className="font-serif text-2xl tracking-wide font-semibold text-white"
          >
            {siteName}
          </Link>
          <p className="text-gray-400 text-sm mt-2">
            © {currentYear} {footerCopyright}
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex space-x-6 text-sm text-gray-400">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
