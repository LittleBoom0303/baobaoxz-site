import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1f1f1f] py-8 mt-16">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div>
          © 2026 BBXZ. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/subscribe" className="hover:text-white transition-colors">
            Subscribe
          </Link>
          <Link href="/membership" className="hover:text-white transition-colors">
            会员
          </Link>
          <a
            href="mailto:contact@baobaoxz.com"
            className="hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
