import { Graph } from "./types.ts";

export interface WalkGraphOptions {
  graph: Graph;
  root: string;
  visit: (
    specifier: string,
    depth: number,
    repeat: boolean,
  ) => boolean | undefined | void;
}

export function walkGraph(
  {
    graph,
    root,
    visit,
  }: WalkGraphOptions,
) {
  const accessed = new Set<string>();
  const walk = (specifier = root, depth = 0) => {
    if (accessed.has(specifier)) {
      visit(specifier, depth, true);
      return;
    }
    accessed.add(specifier);
    const shouldStop = visit(specifier, depth, false);
    if (shouldStop) {
      return;
    }
    graph[specifier].deps.forEach((v) => walk(v, depth + 1));
  };
  walk();
}
