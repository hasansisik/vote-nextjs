"use client"

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { loadUser } from '@/redux/actions/userActions';
import { Loader2 } from 'lucide-react';
import { isUserAdmin } from '@/lib/admin-utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, isAuthenticated } = useSelector((state: any) => state.user);

  useEffect(() => {
    // Check if user is authenticated (only on client side)
    if (typeof window === 'undefined') {
      return;
    }
    
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      router.push('/login');
      return;
    }

    // If we have a token but no user data, load user
    if (token && (!user || Object.keys(user).length === 0)) {
      dispatch(loadUser() as any).then((result: any) => {
        if (result.type === 'user/loadUser/rejected') {
          router.push('/login');
        }
      }).catch((error: any) => {
        router.push('/login');
      });
    }
  }, []); // Run only once on mount

  // Check user role and redirect normal users to home page
  useEffect(() => {
    // Only check role if user data is loaded and not loading
    if (user && Object.keys(user).length > 0 && !loading) {
      if (!isUserAdmin(user)) {
        router.push('/');
      }
    }
    // Don't redirect if still loading or if user data is being loaded
    // Let the first useEffect handle the loadUser call
  }, [user, loading, router]);

  // Show loading when loading or when we have token but no user data yet
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const shouldShowLoading = loading || (token && (!user || Object.keys(user).length === 0));
  
  if (shouldShowLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
           {children}
         </div>
       </SidebarInset>
    </SidebarProvider>
  )
}
