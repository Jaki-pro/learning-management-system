// config/navLinks.ts
import {
  Home,
  BookOpen,
  BarChart3,
  Settings,
  Users,
  Layers,
  FileText,
  MessageSquare,
  Bell,
  LogOut,
  UserCircle2,
  Code2,
  Database,
  FolderOpen,
  ClipboardList,
  CalendarDays,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Globe,
  LayoutDashboard,
} from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
  icon?: React.ElementType;
  children?: NavLink[]; // Optional for nested menus
};

export const navLinks: Record<string, NavLink[]> = {
  /** -------------------------------
   * 🌱 Default (unauthenticated user)
   * ------------------------------- */
  default: [
    { label: "Home", href: "/", icon: Home },
    { label: "Courses", href: "/courses", icon: BookOpen },
    { label: "About Us", href: "/about", icon: Users },
    { label: "Contact", href: "/contact", icon: MessageSquare },
    { label: "Login", href: "/login", icon: UserCircle2 },
  ],

  /** -------------------------------
   * 🎓 Student
   * ------------------------------- */
  student: [
    { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    {
      label: "My Courses",
      href: "/dashboard/student/courses",
      icon: BookOpen,
      children: [
        { label: "Active Courses", href: "/dashboard/student/courses/active" },
        { label: "Completed", href: "/dashboard/student/courses/completed" },
        { label: "Wishlist", href: "/dashboard/student/courses/wishlist" },
      ],
    },
    {
      label: "Progress",
      href: "/dashboard/student/progress",
      icon: BarChart3,
      children: [
        { label: "Course Progress", href: "/dashboard/student/progress/courses" },
        { label: "Certificates", href: "/dashboard/student/progress/certificates" },
      ],
    },
    {
      label: "Schedule",
      href: "/dashboard/student/schedule",
      icon: CalendarDays,
    },
    {
      label: "Career Center",
      href: "/dashboard/student/career",
      icon: Briefcase,
    },
    {
      label: "Profile",
      href: "/dashboard/student/profile",
      icon: UserCircle2,
    },
    {
      label: "Settings",
      href: "/settings",
      icon:Settings,
    },
  ],

  /** -------------------------------
   * 📣 Social Manager
   * ------------------------------- */
  "social-manager": [
    { label: "Dashboard", href: "/dashboard/social-manager", icon: LayoutDashboard },
    { label: "Analytics", href: "/dashboard/social-manager/analytics", icon: BarChart3 },
    {
      label: "Posts",
      href: "/dashboard/social-manager/posts",
      icon: FileText,
      children: [
        { label: "Create Post", href: "/dashboard/social-manager/posts/create" },
        { label: "Manage Posts", href: "/dashboard/social-manager/posts/manage" },
        { label: "Scheduled Posts", href: "/dashboard/social-manager/posts/scheduled" },
      ],
    },
    { label: "Engagement", href: "/dashboard/social-manager/engagement", icon: MessageSquare },
    { label: "Notifications", href: "/dashboard/social-manager/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
  ],

  /** -------------------------------
   * 💻 Developer
   * ------------------------------- */
  developer: [
    { label: "Dashboard", href: "/dashboard/developer", icon: LayoutDashboard },
    { label: "API Logs", href: "/dashboard/developer/api-logs", icon: Database },
    {
      label: "Integrations",
      href: "/dashboard/developer/integrations",
      icon:Code2 ,
      children: [
        { label: "Webhook Events", href: "/dashboard/developer/integrations/webhooks" },
        { label: "OAuth Clients", href: "/dashboard/developer/integrations/oauth" },
        { label: "SDK Access", href: "/dashboard/developer/integrations/sdk" },
      ],
    },
    {
      label: "Documentation",
      href: "/dashboard/developer/docs",
      icon:FileText,
    },
    {
      label: "System Status",
      href: "/dashboard/developer/status",
      icon:ShieldCheck ,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],

  /** -------------------------------
   * 🛠 Admin
   * ------------------------------- */
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard  },
    {
      label: "User Management",
      href: "/dashboard/admin/manage-users",
      icon:Users ,
      children: [
        { label: "All Users", href: "/dashboard/admin/manage-users" },
        { label: "Instructors", href: "/dashboard/admin/manage-users/instructors" },
        { label: "Students", href: "/dashboard/admin/manage-users/students" },
      ],
    },
    {
      label: "Course Management",
      href: "/dashboard/admin/courses",
      icon: Layers ,
      children: [
        { label: "All Courses", href: "/dashboard/admin/courses" },
        { label: "Add New", href: "/dashboard/admin/courses/new" },
        { label: "Categories", href: "/dashboard/admin/courses/categories" },
      ],
    },
    {
      label: "Reports",
      href: "/dashboard/admin/reports",
      icon: BarChart3,
      children: [
        { label: "Sales Reports", href: "/dashboard/admin/reports/sales" },
        { label: "Student Progress", href: "/dashboard/admin/reports/progress" },
        { label: "Instructor Performance", href: "/dashboard/admin/reports/instructors" },
      ],
    },
    {
      label: "Site Settings",
      href: "/dashboard/admin/site-settings",
      icon:Settings,
      children: [
        { label: "General", href: "/dashboard/admin/site-settings/general" },
        { label: "Appearance", href: "/dashboard/admin/site-settings/appearance" },
        { label: "Integrations", href: "/dashboard/admin/site-settings/integrations" },
      ],
    },
    {
      label: "Announcements",
      href: "/dashboard/admin/announcements",
      icon: Bell ,
    },
    {
      label: "Logout",
      href: "/auth/logout",
      icon: LogOut ,
    },
  ],
};
