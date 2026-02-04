import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FlyPath",
  alternates: { canonical: "/app" },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
}
