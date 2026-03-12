"use client";

import {
  Settings2,
  Globe,
  GraduationCap,
  MessageSquare,
  Mic,
  Palette,
  LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AVAILABLE_LANGUAGES,
  AVAILABLE_VOICES,
  AVAILABLE_PROFICIENCY_LEVELS,
  AVAILABLE_TOPICS,
} from "@/lib/constants";

import { ModeToggle } from "./ModeToggle";
import SidebarHeader from "./SidebarHeader";

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">
      <Icon className="h-3.5 w-3.5 text-primary opacity-80" />
      {children}
    </div>
  );
}

function LeftSidebar() {
  const disabled = false;

  const triggerClass = cn(
    "h-10 w-full justify-between",
    "text-sm font-medium rounded-lg",
    "border-border hover:border-primary/40 transition-colors",
    disabled && "opacity-50 cursor-not-allowed",
  );

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <SidebarHeader icon={Settings2} title="Configuration" />
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        <div>
          <SectionLabel icon={Globe}>Language</SectionLabel>
          <Select value={""} onValueChange={() => {}} disabled={disabled}>
            <SelectTrigger className={triggerClass}>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.id} value={lang.code}>
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{lang.name}</span>
                      <span className="text-xs text-muted-foreground truncate opacity-70">{lang.region}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <SectionLabel icon={GraduationCap}>Skill Level</SectionLabel>
          <Select value={""} onValueChange={() => {}} disabled={disabled}>
            <SelectTrigger className={triggerClass}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_PROFICIENCY_LEVELS.map((level) => (
                <SelectItem key={level.id} value={level.label}>
                  <span className="text-sm font-medium">{level.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <SectionLabel icon={MessageSquare}>Conversation Topic</SectionLabel>
          <Select value={""} onValueChange={() => {}} disabled={disabled}>
            <SelectTrigger className={triggerClass}>
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_TOPICS.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  <span className="text-sm">{topic}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <SectionLabel icon={Mic}>AI Voice Persona</SectionLabel>
          <Select value={""} onValueChange={() => {}} disabled={disabled}>
            <SelectTrigger className={triggerClass}>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_VOICES.map((voice) => (
                <SelectItem key={voice.id} value={voice.name}>
                  <div className="flex items-center justify-between w-full gap-4">
                    <span className="font-medium">{voice.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded font-semibold">
                      {voice.category}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-none border-t bg-sidebar/80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Palette className="h-3.5 w-3.5" />
            <span>Appearance</span>
          </div>
          <ModeToggle />
        </div>
      </div>
    </aside>
  );
}

export default LeftSidebar;