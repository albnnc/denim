import { Graph } from "./types.ts";
import { getMeta } from "./get_meta.ts";

export function isTransitional(specifier: string, graph: Graph) {
  const meta = getMeta(specifier);
  return Array.from(graph[specifier].parents).some((v) => {
    const parentMeta = getMeta(v);
    return meta?.id !== parentMeta?.id;
  });
}
