export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Profile Settings</h3>
          <p className="text-muted-foreground">Account management coming soon...</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Notifications</h3>
          <p className="text-muted-foreground">Notification preferences coming soon...</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Data & Privacy</h3>
          <p className="text-muted-foreground">Privacy settings coming soon...</p>
        </div>
      </div>
    </div>
  );
}