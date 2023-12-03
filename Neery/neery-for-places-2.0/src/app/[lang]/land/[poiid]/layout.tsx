import { cookies, headers } from "next/headers";
import RefererHandler from "./components/RefererHandler";

export default async function LandLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <RefererHandler referer={headers().get("referer")} cReferer={cookies().get("neery_referer")?.value}>
      {children}
    </RefererHandler>
  );
}
