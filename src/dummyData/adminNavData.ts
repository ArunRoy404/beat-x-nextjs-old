import * as Icons from "@hugeicons/core-free-icons"

export interface DummyNavItem {
  title: string
  url: string
  iconName: string
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export interface DummyNavGroup {
  label: string
  items: DummyNavItem[]
}

export const iconMap: Record<string, any> = {
  GridViewIcon: Icons.GridViewIcon,
  Analytics01Icon: Icons.Analytics01Icon,
  MusicNote01Icon: Icons.MusicNote01Icon,
  PodcastIcon: Icons.PodcastIcon,
  AudioBook01Icon: Icons.AudioBook01Icon,
  Video01Icon: Icons.Video01Icon,
  Mic01Icon: Icons.Mic01Icon,
  UserGroupIcon: Icons.UserGroupIcon,
  ShoppingBag01Icon: Icons.ShoppingBag01Icon,
  Calendar01Icon: Icons.Calendar01Icon,
  CreditCardIcon: Icons.CreditCardIcon,
  Package01Icon: Icons.Package01Icon,
  MoneyBag01Icon: Icons.MoneyBag01Icon,
  Shield01Icon: Icons.Shield01Icon,
  Invoice01Icon: Icons.Invoice01Icon,
  Settings05Icon: Icons.Settings05Icon,
}

export const adminNavData: DummyNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin/dashboard", iconName: "GridViewIcon" },
      { title: "Analytics", url: "/admin/dashboard/analytics", iconName: "Analytics01Icon" },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Music's & Songs", url: "/admin/dashboard/music-songs", iconName: "MusicNote01Icon" },
      { title: "Podcasts", url: "/admin/dashboard/podcasts", iconName: "PodcastIcon" },
      { title: "Audiobooks", url: "/admin/dashboard/audiobooks", iconName: "AudioBook01Icon" },
      { title: "Videos & Watch", url: "/admin/dashboard/videos-watch", iconName: "Video01Icon" },
    ],
  },
  {
    label: "Users",
    items: [
      { title: "Artist's", url: "/admin/dashboard/artists", iconName: "Mic01Icon" },
      { title: "Users", url: "/admin/dashboard/users", iconName: "UserGroupIcon" },
    ],
  },
  {
    label: "Store",
    items: [
      { title: "Shop & Products", url: "/admin/dashboard/shop-products", iconName: "ShoppingBag01Icon" },
      { title: "Tours & Events", url: "/admin/dashboard/tours-events", iconName: "Calendar01Icon" },
      { title: "Subscriptions", url: "/admin/dashboard/subscriptions", iconName: "CreditCardIcon" },
      { title: "Orders", url: "/admin/dashboard/orders", iconName: "Package01Icon" },
      { title: "Revenue", url: "/admin/dashboard/revenue", iconName: "MoneyBag01Icon" },
    ],
  },
  {
    label: "Platform",
    items: [
      { title: "Moderation", url: "/admin/dashboard/moderation", iconName: "Shield01Icon" },
      { title: "Sales Reports", url: "/admin/dashboard/sales-reports", iconName: "Invoice01Icon" },
      { title: "Settings", url: "/admin/dashboard/settings", iconName: "Settings05Icon" },
    ],
  },
]
