import { ModGraph } from "./types.ts";
import { getModMeta } from "./get_mod_meta.ts";

export function isTopLevel(specifier: string, graph: ModGraph) {
  const meta = getModMeta(specifier);
  return Array.from(graph[specifier].parents).every((v) => {
    const parentMeta = getModMeta(v);
    return meta?.id !== parentMeta?.id;
  });
}
