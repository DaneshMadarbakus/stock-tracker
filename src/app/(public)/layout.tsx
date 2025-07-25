export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Public navigation could go here */}
      <main className="flex-1">
        {children}
      </main>
      {/* Public footer could go here */}
    </div>
  );
}