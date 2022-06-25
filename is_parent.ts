import { Graph } from "./types.ts";
import { walkGraph } from "./walk_graph.ts";

export interface IsParentOptions {
  parent: string;
  child: string;
  graph: Graph;
}

export function isParent({ parent, child, graph }: IsParentOptions) {
  let res = false;
  walkGraph({
    graph,
    root: parent,
    visit: (specifier) => {
      if (specifier === child) {
        res = true;
        return true;
      }
    },
  });
  return res;
}
