import { checkTransformRuleSelector } from "./check_transform_rule_selector.ts";
import { defaultRules } from "./defaults.ts";
import { collections, semver } from "./deps.ts";
import { getMeta } from "./get_meta.ts";
import { isParent } from "./is_parent.ts";
import { isTransitional } from "./is_transitional.ts";
import { Graph, Meta, TransformRule } from "./types.ts";
import { walkGraph } from "./walk_graph.ts";

export interface TransformGraphOptions {
  graph: Graph;
  root: string;
  rules?: TransformRule[];
}

export function transformGraph(
  {
    graph,
    root,
    rules = defaultRules,
  }: TransformGraphOptions,
): Record<string, string> {
  const metas = Object.keys(graph)
    .map((v) => getMeta(v))
    .filter(Boolean) as Meta[];
  const metasById = collections.groupBy(metas, (v) => v.id);
  const metasBySpecifier = collections.groupBy(metas, (v) => v.specifier);
  const targets = new Set<string>();
  const transforms: Record<string, string> = {};
  rules.forEach((rule) => {
    walkGraph({
      graph,
      root,
      visit: (specifier, supplementary) => {
        if (targets.has(specifier)) {
          return true;
        }
        const meta = metasBySpecifier[specifier]?.[0];
        if (
          supplementary ||
          !meta ||
          !checkTransformRuleSelector(rule.source, meta)
        ) {
          return;
        }
        const targetSelector = rule.target
          .replace("{id}", meta.id)
          .replace("{version}", meta.version);
        const targetMeta = metasById[meta.id]
          ?.sort((a, b) =>
            semver.compare(b.version, a.version) ||
            a.specifier.length - b.specifier.length ||
            a.specifier.localeCompare(b.specifier)
          )
          .find((v) =>
            v.file === meta.file &&
            v.specifier !== specifier &&
            checkTransformRuleSelector(targetSelector, v) &&
            semver.gte(v.version, meta.version) &&
            isTransitional(v.specifier, graph) &&
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
  });
  return transforms;
}
