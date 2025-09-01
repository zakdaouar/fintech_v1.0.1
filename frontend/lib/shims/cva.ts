export type VariantProps<T> = any;

type Variants = Record<string, Record<string, string>>;
type DefaultVariants = Record<string, any>;
type CompoundVariant = Record<string, any> & { class?: string };

export function cva(
  base?: string | string[],
  options?: {
    variants?: Variants;
    defaultVariants?: DefaultVariants;
    compoundVariants?: CompoundVariant[];
  }
) {
  const baseClasses = Array.isArray(base) ? base : [base ?? ""];
  const variants = options?.variants ?? {};
  const defaults = options?.defaultVariants ?? {};
  const compounds = options?.compoundVariants ?? [];

  return (props?: Record<string, any>) => {
    const all = { ...defaults, ...(props || {}) };
    const out: string[] = [...baseClasses];

    for (const key of Object.keys(variants)) {
      const val = all[key];
      const map = variants[key];
      if (val != null && map && typeof map[val] === "string") {
        out.push(map[val]);
      }
    }

    for (const cv of compounds) {
      const { class: cls, ...conds } = cv || {};
      const ok = Object.entries(conds).every(([k, v]) => all[k] === v);
      if (ok && cls) out.push(cls);
    }

    if (typeof all.class === "string") out.push(all.class);
    return out.filter(Boolean).join(" ").trim();
  };
}

export default cva;