import type { ComponentProps } from "react";

import { ICONS, type IconName } from "@/lib/icons";

type Props = ComponentProps<(typeof ICONS)[IconName]> & {
  name: IconName;
};

/**
 * Renders one icon from the site's icon registry by name.
 *
 * Defaults to ui-rules.md §3's size (18) and stroke (1.9), so an ordinary
 * call site gets a consistent mark without repeating both props — pass
 * either to override for one spot. The footer's ArrowUpRight stays a direct
 * lucide-react import rather than routing through here: "an outbound-link
 * arrow" was never added to IconName, and it already renders at a
 * deliberately smaller 14.
 *
 * Decorative by default: lucide-react sets aria-hidden itself unless an
 * accessibility prop (aria-label, aria-labelledby, role…) is passed, so an
 * icon inside an already-labelled control — a button carrying its own
 * aria-label, say — needs nothing extra here.
 */
export function Icon({ name, size = 18, strokeWidth = 1.9, ...props }: Props) {
  const IconComponent = ICONS[name];

  return <IconComponent size={size} strokeWidth={strokeWidth} {...props} />;
}
