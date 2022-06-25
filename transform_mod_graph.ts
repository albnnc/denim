import { checkRule } from "./check_rule.ts";
import { defaultPatterns, defaultRules } from "./defaults.ts";
import { collections, semver } from "./deps.ts";
import { getDepMeta } from "./get_mod_meta.ts";
import { isParent } from "./is_parent.ts";
import { ModGraph, ModMeta, Rule } from "./types.ts";
import { walkModGraph } from "./walk_mod_graph.ts";

export interface TransformModGraphOptions {
  graph: ModGraph;
  root: string;
  patterns?: URLPatternInit[];
  rules?: Rule[];
}

export function transformModGraph(
  {
    graph,
    root,
    patterns = defaultPatterns,
    rules = defaultRules,
  }: TransformModGraphOptions,
): Record<string, string> {
  const transforms: Record<string, string> = {};
  const metas = Object.keys(graph)
    .map((v) => getDepMeta(v, patterns))
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
          !isParent({ parent: v.specifier, child: specifier, graph }) &&
          !isParent({ parent: specifier, child: v.specifier, graph })
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
