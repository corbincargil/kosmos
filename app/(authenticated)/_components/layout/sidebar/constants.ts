import {
  LucideIcon,
  Croissant,
  ChartNoAxesCombined,
  Home,
  List,
  FileText,
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
  Code,
  Church,
  Heart,
  Dumbbell,
  BugIcon,
  Lightbulb,
  SquarePlus,
  CirclePlus,
  TrendingUp,
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
  FINANCE: [
    { href: "/budget", label: "Budget", icon: DollarSign },
    { href: "/finance/schwab", label: "Schwab", icon: ChartNoAxesCombined },
  ],
  FITNESS: [{ href: "/workouts", label: "Workouts", icon: BicepsFlexed }],
  PERSONAL: [],
  SCHOOL: [{ href: "/courses", label: "Courses", icon: GraduationCap }],
  WORK: [{ href: "/projects", label: "Projects", icon: BriefcaseBusiness }],
};

export const ICON_MAP: Record<string, LucideIcon> = {
  Anchor,
  BicepsFlexed,
  Binary,
  BriefcaseBusiness,
  BugIcon,
  Cake,
  CirclePlus,
  Church,
  Code,
  Coffee,
  Cookie,
  Croissant,
  Cross,
  DollarSign,
  Dumbbell,
  Heart,
  House,
  Lightbulb,
  Pizza,
  SquarePlus,
  TrendingUp,
  Users,
};
