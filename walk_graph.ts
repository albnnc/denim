import { getMeta } from "./get_meta.ts";
import { Graph } from "./types.ts";

export interface WalkGraphOptions {
  graph: Graph;
  root: string;
  visit: (
    specifier: string,
    depth: number,
    transitional: boolean,
  ) => boolean | undefined | void;
}

export function walkGraph(
  {
    graph,
    root,
    visit,
  }: WalkGraphOptions,
) {
  const walk = (specifier = root, depth = 0, supplementary = false) => {
    const shouldStop = visit(specifier, depth, supplementary);
    if (shouldStop) {
      return;
    }
    graph[specifier].deps.forEach((v) => {
      const supplementary = getMeta(specifier)?.id === getMeta(v)?.id;
      walk(v, depth + 1, supplementary);
    });
  };
  walk();
}
