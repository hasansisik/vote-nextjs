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
  Home,
  BarChart3,
  UserCog,
  FileText,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  Heart,
  MessageSquare,
  Search,
  Filter,
  Globe,
  Zap,
} from "lucide-react"
import { useSelector } from "react-redux"
import { useAppDispatch } from "@/redux/hook"
import { logout } from "@/redux/actions/userActions"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { isUserAdmin } from "@/lib/admin-utils"
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
      plan: "Kullanıcı",
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
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state.user);
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };
  
  // Create dynamic navigation data based on user role
  const getNavigationData = () => {
    const baseNavMain = [
      {
        title: "Ana Sayfa",
        url: "/dashboard",
        icon: Home,
        isActive: true,
        items: [],
      },
    ];

    // Add voting section for admin users
    if (isUserAdmin(user)) {
      baseNavMain.push({
        title: "Oylamalar",
        url: "/dashboard/votes",
        icon: BarChart3,
        isActive: false,
        items: [],
      });

      // Add menu management section for admin users
      baseNavMain.push({
        title: "Menü Yönetimi",
        url: "/dashboard/menus",
        icon: FileText,
        isActive: false,
        items: [],
      });

      // Add user management section for admin users
      baseNavMain.push({
        title: "Kullanıcı Yönetimi",
        url: "/dashboard/users",
        icon: UserCog,
        isActive: false,
        items: [],
      });

      // Add settings section for admin users
      baseNavMain.push({
        title: "Sistem Ayarları",
        url: "/dashboard/settings",
        icon: Settings2,
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
      {
        name: "Popüler Oylamalar",
        url: "/oylamalar?filter=popular",
        icon: TrendingUp,
      },
      {
        name: "Son Oylamalar",
        url: "/oylamalar?filter=recent",
        icon: Clock,
      },
      {
        name: "Favori Oylamalar",
        url: "/oylamalar?filter=favorites",
        icon: Heart,
      },
      {
        name: "Arama",
        url: "/search",
        icon: Search,
      },
      {
        name: "Profil",
        url: "/profile",
        icon: UserCog,
      },
      {
        name: "Hakkımızda",
        url: "/about",
        icon: Globe,
      },
    ];

    // Add admin quick access
    if (isUserAdmin(user)) {
      quickAccessProjects.push(
        {
          name: "Yeni Oylama Oluştur",
          url: "/dashboard/votes?create=true",
          icon: Plus,
        },
        {
          name: "Menü Ekle",
          url: "/dashboard/menus?create=true",
          icon: FileText,
        },
        {
          name: "İstatistikler",
          url: "/dashboard/stats",
          icon: PieChart,
        },
        {
          name: "Raporlar",
          url: "/dashboard/reports",
          icon: BarChart3,
        }
      );
    }

    // Dynamic teams based on user role
    const dynamicTeams = [
      {
        name: "VOTE Platform",
        logo: Vote,
        plan: isUserAdmin(user) ? 'Admin' : 'Kullanıcı',
      },
    ];

    return {
      ...data,
      navMain: baseNavMain,
      projects: quickAccessProjects,
      teams: dynamicTeams,
    };
  };

  const navigationData = getNavigationData();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={navigationData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || data.user} onLogout={handleLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
