import { checkTransformRuleSelector } from "./check_transform_rule_selector.ts";
import { defaultRules } from "./defaults.ts";
import { collections, semver } from "./deps.ts";
import { getModMeta } from "./get_mod_meta.ts";
import { isParent } from "./is_parent.ts";
import { isTopLevel } from "./is_top_level.ts";
import { ModGraph, ModMeta, TransformRule } from "./types.ts";
import { walkModGraph } from "./walk_mod_graph.ts";

export interface TransformModGraphOptions {
  graph: ModGraph;
  root: string;
  rules?: TransformRule[];
}

export function transformModGraph(
  {
    graph,
    root,
    rules = defaultRules,
  }: TransformModGraphOptions,
): Record<string, string> {
  const transforms: Record<string, string> = {};
  const metas = Object.keys(graph)
    .map((v) => getModMeta(v))
    .filter(Boolean) as ModMeta[];
  const metasById = collections.groupBy(metas, (v) => v.id);
  const metasBySpecifier = collections.groupBy(metas, (v) => v.specifier);
  const targets = new Set<string>();
  walkModGraph({
    graph,
    root,
    visit: (specifier) => {
      const meta = metasBySpecifier[specifier]?.[0];
      if (
        !meta ||
        targets.has(specifier) ||
        Array.from(targets).some((v) =>
          isParent({
            parent: v,
            child: specifier,
            graph,
          })
        )
      ) {
        return;
      }
      const ruleToApply = rules.find((v) =>
        checkTransformRuleSelector(v.source, meta)
      );
      if (!ruleToApply) {
        return;
      }
      const targetSelector = ruleToApply.target
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
          checkTransformRuleSelector(targetSelector, v) &&
          !isParent({ parent: v.specifier, child: specifier, graph }) &&
          !isParent({ parent: specifier, child: v.specifier, graph }) &&
          isTopLevel(v.specifier, graph)
        );
      if (targetMeta) {
        targets.add(targetMeta.specifier);
        transforms[specifier] = targetMeta.specifier;
        return true;
      }
    },
  });
  return transforms;
}
