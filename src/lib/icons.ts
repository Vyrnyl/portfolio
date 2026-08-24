import {
  BookOpen,
  Briefcase,
  Code2,
  GraduationCap,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { IconName } from "@/content/types";

/**
 * Every icon the site can render, keyed by name.
 *
 * Record<IconName, LucideIcon> makes the two lists — this one and IconName in
 * src/content/types.ts — fail the build the moment they disagree: a name with
 * no import here is a missing property, an import with no name in IconName
 * has nowhere to go in the object literal.
 *
 * Icons are imported one at a time, never `import * as icons from
 * "lucide-react"` — a barrel import pulls the whole library into the bundle
 * regardless of which icons are actually used, defeating tree-shaking.
 */
export const ICONS: Record<IconName, LucideIcon> = {
  // Practice principles — /skills
  Code2,
  Users,
  MessageCircle,
  Lightbulb,
  ShieldCheck,
  Rocket,
  BookOpen,
  Target,
  // Resume timeline — /resume
  Briefcase,
  GraduationCap,
  // Contact — /contact
  Mail,
  MapPin,
};

export type { IconName };
