import {
  LucideIcon,
  Croissant,
  Home,
  List,
  FileText,
  Settings,
  Coffee,
  Pizza,
  Cookie,
  Cake,
  Cross,
  Users,
  BicepsFlexed,
  BriefcaseBusiness,
  Anchor,
  House,
  Binary,
  DollarSign,
  Calendar,
  GraduationCap,
  ListCheck,
  BookOpen,
} from "lucide-react";

export const dashboardLink = {
  href: "/dashboard",
  label: "Dashboard",
  icon: Home,
};

export const generalLinks = [
  { href: "/tasks", label: "Tasks", icon: List },
  { href: "/notes", label: "Notes", icon: FileText },
];

export const workspaceLinks: Record<
  string,
  Array<{ href: string; label: string; icon: LucideIcon }>
> = {
  DEFAULT: [],
  DEV: [{ href: "/projects", label: "Projects", icon: Binary }],
  FAITH: [
    { href: "/bible-studies", label: "Bible Studies", icon: BookOpen },
    { href: "/prayers", label: "Prayers", icon: ListCheck },
    { href: "/sermons", label: "Sermons", icon: FileText },
  ],
  FAMILY: [{ href: "/events", label: "Events", icon: Calendar }],
  FITNESS: [{ href: "/workouts", label: "Workouts", icon: BicepsFlexed }],
  PERSONAL: [],
  SCHOOL: [{ href: "/courses", label: "Courses", icon: GraduationCap }],
  WORK: [{ href: "/projects", label: "Projects", icon: BriefcaseBusiness }],
};

export const ICON_MAP: Record<string, LucideIcon> = {
  Croissant,
  Coffee,
  Pizza,
  Cookie,
  Cake,
  Cross,
  Users,
  BicepsFlexed,
  BriefcaseBusiness,
  Anchor,
  House,
  Binary,
  DollarSign,
};
