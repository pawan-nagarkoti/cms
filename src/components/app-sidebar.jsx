"use client";

import * as React from "react";
import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "CMS",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    // {
    //   name: "Acme Inc",
    //   logo: GalleryVerticalEnd,
    //   plan: "Enterprise",
    // },
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],
  navMain: [
    {
      title: "Manage Blog",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Category",
          url: "/dashboard/blog/category",
        },
        {
          title: "Tag",
          url: "/dashboard/blog/tag",
        },
        {
          title: "Blog Post",
          url: "/dashboard/blog",
        },
      ],
    },
    {
      title: "Manage Location",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Country",
          url: "/dashboard/location/country",
        },
        {
          title: "State",
          url: "/dashboard/location/state",
        },
        {
          title: "Cities",
          url: "/dashboard/location/cities",
        },
        {
          title: "Microcities",
          url: "/dashboard/location/microcities",
        },
      ],
    },
    {
      title: "Manage Project",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Builder",
          url: "/dashboard/builder",
        },
        {
          title: "Project",
          url: "/dashboard/project",
        },
      ],
    },
    {
      title: "Manage Properties",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Properties Categories",
          url: "/dashboard/propertyCategory",
        },
        {
          title: "Properties Sub Categories",
          url: "/dashboard/propertySubCategory",
        },
        {
          title: "Topologies",
          url: "/dashboard/topology",
        },
        {
          title: "Amenities",
          url: "/dashboard/amenities",
        },
        {
          title: "Facilities",
          url: "/dashboard/facility",
        },
        {
          title: "Properties",
          url: "/dashboard/property",
        },
      ],
    },
  ],
  projects: [
    {
      name: "To Do",
      url: "/dashboard/todo",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} className="mb-5" />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
