import { colors } from "./deps.ts";
import { ModGraph } from "./types.ts";
import { walkModGraph } from "./walk_mod_graph.ts";

export function formatModGraph(graph: ModGraph, root: string) {
  let data = "";
  walkModGraph({
    graph,
    root,
    visit: (specifier, depth, repeat) => {
      const indent = new Array(depth).fill("  ").join("");
      data += indent +
        (repeat ? colors.dim(specifier) : specifier) +
        "\n";
    },
  });
  return data;
}
