import { useState } from "react";
import Sidebar, { type DashboardPage } from "./Sidebar";

type DashboardLayoutProps = {
  children: (
    activePage: DashboardPage,
    setActivePage: (page: DashboardPage) => void,
  ) => React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState<DashboardPage>("dashboard");

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((current) => !current)}
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className="min-w-0 flex-1">
        {children(activePage, setActivePage)}
      </div>
    </div>
  );
}
