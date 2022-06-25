import { checkRule } from "./check_rule.ts";
import { defaultPatterns, defaultRules } from "./defaults.ts";
import { collections, semver } from "./deps.ts";
import { getDepMeta } from "./get_dep_meta.ts";
import { isParent } from "./is_parent.ts";
import { DepMap, DepMeta, Rule } from "./types.ts";
import { walkDepMap } from "./walk_dep_map.ts";

export interface TransformDepMapOptions {
  patterns?: URLPatternInit[];
  rules?: Rule[];
}

export function transformDepMap(
  depMap: DepMap,
  {
    patterns = defaultPatterns,
    rules = defaultRules,
  }: TransformDepMapOptions = {},
): Record<string, string> {
  const transforms: Record<string, string> = {};
  const metas = Object.keys(depMap.deps)
    .map((v) => getDepMeta(v, patterns))
    .filter(Boolean) as DepMeta[];
  const metasById = collections.groupBy(metas, (v) => v.id);
  const metasBySpecifier = collections.groupBy(metas, (v) => v.specifier);
  const targets = new Set<string>();
  walkDepMap(depMap, (specifier) => {
    const meta = metasBySpecifier[specifier]?.[0];
    if (
      !meta ||
      targets.has(specifier) ||
      Array.from(targets).some((v) =>
        isParent({
          parent: v,
          child: specifier,
          depMap,
        })
      )
    ) {
      return;
    }
    const targetRule = rules.find((v) => checkRule(v.source, meta));
    if (!targetRule) {
      return;
    }
    const targetRuleToken = targetRule.target
      .replace("{id}", meta.id)
      .replace("{version}", meta.version);
    const targetMeta = metasById[meta.id]
      ?.sort((a, b) =>
        semver.compare(b.version, a.version) ||
        a.specifier.length - b.specifier.length ||
        a.specifier.localeCompare(b.specifier)
      )
      .find((v) =>
        v.specifier !== specifier &&
        semver.gte(v.version, meta.version) &&
        checkRule(targetRuleToken, v) &&
        !isParent({ parent: v.specifier, child: specifier, depMap }) &&
        !isParent({ parent: specifier, child: v.specifier, depMap })
      );
    if (targetMeta) {
      targets.add(targetMeta.specifier);
      transforms[specifier] = targetMeta.specifier;
      return true;
    }
  });
  return transforms;
}

// export function transformDepMap(
//   depMap: DepMap,
//   {
//     patterns = defaultPatterns,
//     rules = defaultRules,
//   }: TransformDepMapOptions = {},
// ): Record<string, string> {
//   const dupes: Record<string, string> = {};
//   const metas = (
//     Object.keys(depMap.deps)
//       .map((v) => getDepMeta(v, patterns))
//       .filter(Boolean) as DepMeta[]
//   )
//     .sort((a, b) =>
//       semver.compare(b.version, a.version) ||
//       a.specifier.length - b.specifier.length ||
//       a.specifier.localeCompare(b.specifier)
//     );
//   const metasBySpecifier = collections.groupBy(metas, (v) => v.specifier);
//   const targets = new Set<string>();
//   walkDepMap(depMap, (specifier) => {
//     const meta = metasBySpecifier[specifier]?.[0];
//     if (
//       !meta ||
//       targets.has(specifier) ||
//       Array.from(targets).some((v) =>
//         isParent({
//           parent: v,
//           child: specifier,
//           depMap,
//         })
//       )
//     ) {
//       return;
//     }
//     const targetRule = rules.find((v) => checkRule(v.source, meta));
//     if (!targetRule) {
//       return;
//     }
//     const targetRuleToken = targetRule.target
//       .replace("{id}", meta.id)
//       .replace("{version}", meta.version);
//     // TODO: Consider adding host analysis.
//     const targetMeta = metas.find((v) =>
//       v.specifier !== specifier &&
//       semver.gte(v.version, meta.version) &&
//       checkRule(targetRuleToken, v) &&
//       !isParent({
//         parent: v.specifier,
//         child: specifier,
//         depMap,
//       }) &&
//       !isParent({
//         parent: specifier,
//         child: v.specifier,
//         depMap,
//       })
//     );
//     if (targetMeta) {
//       targets.add(targetMeta.specifier);
//       dupes[specifier] = targetMeta.specifier;
//       return true;
//     }
//   });
//   return dupes;
// }
