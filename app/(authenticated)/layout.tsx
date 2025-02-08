import { Providers } from "./_components/layout/providers";
import { AuthCheck } from "./_components/layout/auth-check";
import { LayoutContent } from "./_components/layout/layout-content";
import { ReactNode } from "react";

export default function AuthenticatedLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal?: ReactNode;
}) {
  return (
    <Providers>
      <AuthCheck>
        <LayoutContent modal={modal}>{children}</LayoutContent>
      </AuthCheck>
    </Providers>
  );
}
