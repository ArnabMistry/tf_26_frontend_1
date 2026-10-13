import type { Metadata } from "next";
import OAuthCallbackClient from "./OAuthCallbackClient";

export const metadata: Metadata = {
  title: "Signing in",
  robots: { index: false, follow: false },
};

export default function OAuthCallbackPage() {
  return <OAuthCallbackClient />;
}
