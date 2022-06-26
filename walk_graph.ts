import { getMeta } from "./get_meta.ts";
import { Graph } from "./types.ts";

export interface WalkGraphOptions {
  graph: Graph;
  root: string;
  visit: (
    specifier: string,
    supplementary: boolean,
    depth: number,
  ) => boolean | undefined | void;
}

export function walkGraph(
  {
    graph,
    root,
    visit,
  }: WalkGraphOptions,
) {
  const walk = (specifier = root, supplementary = false, depth = 0) => {
    const shouldStop = visit(specifier, supplementary, depth);
    if (shouldStop) {
      return;
    }
    graph[specifier].deps.forEach((v) => {
      const priorMeta = getMeta(specifier);
      const nextMeta = getMeta(v);
      const supplementary = (
        priorMeta &&
        nextMeta &&
        priorMeta.id === nextMeta.id
      );
      walk(v, supplementary, depth + 1);
    });
  };
  walk();
}
