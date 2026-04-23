"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { TeamSwitcher } from "./team-switcher";
import { UserMenu } from "./user-menu";
import type { Role } from "@/lib/generated/prisma/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  SparklesIcon,
  HomeIcon,
  Settings2Icon,
  MessageCircleQuestionIcon,
} from "lucide-react";

const data = {
  navMain: [
    { title: "Home", url: "/", icon: <HomeIcon /> },
    { title: "Ask AI", url: "#", icon: <SparklesIcon /> },
  ],
  navSecondary: [
    { title: "Settings", url: "/settings", icon: <Settings2Icon /> },
    { title: "Help", url: "/help", icon: <MessageCircleQuestionIcon /> },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; role: Role };
}) {
  const pathname = usePathname();
  const navSecondary =
    user.role === "ADMIN"
      ? data.navSecondary
      : data.navSecondary.filter((i) => i.url !== "/settings");
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
        <NavMain items={data.navMain} pathname={pathname} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary
          items={navSecondary}
          pathname={pathname}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu user={user} role={user.role} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
