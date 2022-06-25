import { ModGraph } from "./types.ts";
import { walkModGraph } from "./walk_mod_graph.ts";

export interface IsParentOptions {
  parent: string;
  child: string;
  graph: ModGraph;
}

export function isParent({ parent, child, graph }: IsParentOptions) {
  let res = false;
  walkModGraph({
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
