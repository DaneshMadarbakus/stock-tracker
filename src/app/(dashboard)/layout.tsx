import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../../stack";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
        {children}
      </StackTheme>
    </StackProvider>
  );
}