import { ModGraph } from "./types.ts";

export interface WalkModGraphOptions {
  graph: ModGraph;
  root: string;
  visit: (
    specifier: string,
    depth: number,
    repeat: boolean,
  ) => boolean | undefined | void;
}

export function walkModGraph(
  {
    graph,
    root,
    visit,
  }: WalkModGraphOptions,
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
