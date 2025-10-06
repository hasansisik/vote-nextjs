"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  Menu,
  PieChart,
  Plus,
  Settings2,
  SquareTerminal,
  Users,
  Vote,
} from "lucide-react"
import { useSelector } from "react-redux"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Kullanıcı",
    email: "kullanici@example.com",
    avatar: "/avatars/default.jpg",
  },
  teams: [
    {
      name: "VOTE Platform",
      logo: Vote,
      plan: "Pro",
    },
  ],
  navMain: [
    {
      title: "Ana Sayfa",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [],
    },
  ],
  projects: [
    {
      name: "Hızlı Erişim",
      url: "#",
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSelector((state: any) => state.user);
  
  // Create dynamic navigation data based on user role
  const getNavigationData = () => {
    const baseNavMain = [
      {
        title: "Ana Sayfa",
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: true,
        items: [],
      },
    ];

    // Add voting section for admin users
    if (user?.role === 'admin') {
      baseNavMain.push({
        title: "Oylamalar",
        url: "/dashboard/votes",
        icon: Vote,
        isActive: false,
        items: [],
      });

      // Add menu management section for admin users
      baseNavMain.push({
        title: "Menü Yönetimi",
        url: "/dashboard/menus",
        icon: Menu,
        isActive: false,
        items: [],
      });

      // Add user management section for admin users
      baseNavMain.push({
        title: "Kullanıcı Yönetimi",
        url: "/dashboard/users",
        icon: Users,
        isActive: false,
        items: [],
      });
    }

    // Quick access projects
    const quickAccessProjects = [
      {
        name: "Tüm Oylamalar",
        url: "/oylamalar",
        icon: Vote,
      },
      {
        name: "Kategoriler",
        url: "/kategoriler",
        icon: BookOpen,
      },
    ];

    // Add admin quick access
    if (user?.role === 'admin') {
      quickAccessProjects.push(
        {
          name: "Yeni Oylama Oluştur",
          url: "/dashboard/votes?create=true",
          icon: Plus,
        },
        {
          name: "Menü Ekle",
          url: "/dashboard/menus?create=true",
          icon: Menu,
        }
      );
    }

    return {
      ...data,
      navMain: baseNavMain,
      projects: quickAccessProjects,
    };
  };

  const navigationData = getNavigationData();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
