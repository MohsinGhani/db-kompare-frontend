import Image from "next/image";
import logo from "../../../public/assets/icons/logo.gif";
import CommonTypography from "../shared/Typography";
import { useRouter } from "next/navigation";
import { Navlinks } from "@/utils/navLinks";
const socialLinks = [
  { href: "/assets/icons/facebook.svg", alt: "Facebook" },
  { href: "/assets/icons/instagram.svg", alt: "Instagram" },
  { href: "/assets/icons/linkedin.svg", alt: "LinkedIn" },
];

export default function Footer() {
  const router = useRouter();
  return (
    <div className="md:h-80 h-96 bg-custom-gradient px-10 flex flex-col justify-center items-center">
      <div className="flex items-center gap-1 justify-center">
        <Image
          src={logo}
          alt="DB Logo"
          width={40}
          height={100}
          className="object-contain"
        />
        <CommonTypography className="text-2xl font-semibold text-black">
          DB Kompare
        </CommonTypography>
      </div>

      <div className="flex flex-col justify-center items-center border-b w-full border-[#DFDFDF] py-5">
        <ul className="flex gap-8 mb-6 text-sm font-normal">
          {Navlinks.map((link, idx) => (
            <li key={idx}>
              <button
                onClick={() => router.push(link.href)}
                className="text-[#535353] hover:font-semibold"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex gap-8">
          {socialLinks.map(({ href, alt }, idx) => (
            <Image
              key={idx}
              src={href}
              alt={alt}
              width={25}
              height={25}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </div>

      <p className="text-[#535353] text-sm text-center mt-4">
        Non-Copyrighted © 2024 Upload by DB Kompare
      </p>
    </div>
  );
}
