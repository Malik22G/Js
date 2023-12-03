import Link from "next/link";

export default function FooterSection() {
  return (
    <div className="flex pt-2 pb-4 gap-4 justify-center border-t bg-deepblue">
      <Link
        className="text-neutral-100 hover:text-primary"
        href="/aszf.pdf"
        target="_blank"
        download
      >
        ÁSZF
      </Link>
      <Link
        className="text-neutral-100 hover:text-primary"
        href="/gdpr.pdf"
        download
        target="_blank"
      >
        GDPR
      </Link>
      <a
        className="text-neutral-100 hover:text-primary"
        target="_blank"
        rel="noreferrer"
        href="https://blog.neery.net"
      >
        Blog
      </a>
    </div>
  );
}
