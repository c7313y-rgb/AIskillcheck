import type { CategoryKey, CourseBase, Package } from "../data/types";

type VisualVariant = "preview" | "course" | "package";

function getVisualTone(categories: readonly CategoryKey[]): string {
  if (categories.includes("automation")) return "automation";
  if (categories.includes("data")) return "data";
  if (categories.includes("governance")) return "governance";
  if (categories.includes("business")) return "business";
  return "literacy";
}

const ACCENT_LABEL: Record<string, string> = {
  automation: "Agent",
  data: "Data",
  governance: "Trust",
  business: "Growth",
  literacy: "Basics",
};

interface CourseVisualProps {
  item: (CourseBase & { categories: readonly CategoryKey[] }) | Package;
  variant?: VisualVariant;
}

function hasCategories(item: CourseVisualProps["item"]): item is CourseBase {
  return "categories" in item;
}

export function CourseVisual({ item, variant = "course" }: CourseVisualProps) {
  const categories = hasCategories(item) ? item.categories : [];
  const tone = getVisualTone(categories);
  const label = hasCategories(item) ? item.tag : item.target;
  const accent = ACCENT_LABEL[tone];

  return (
    <div className={`card-visual ${variant}-visual tone-${tone}`} aria-hidden="true">
      <span className="visual-kicker">{label}</span>
      <strong>{accent}</strong>
      <small>{item.title}</small>
      <div className="visual-bars">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
