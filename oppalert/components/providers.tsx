"use client";

// NextAuth has been removed. This provider is now a simple passthrough.
export const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
