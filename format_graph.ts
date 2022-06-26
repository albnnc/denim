import { colors } from "./deps.ts";
import { Graph } from "./types.ts";
import { walkGraph } from "./walk_graph.ts";

export function formatGraph(graph: Graph, root: string) {
  let data = "";
  walkGraph({
    graph,
    root,
    visit: (specifier, supplementary, depth) => {
      const indent = new Array(depth).fill("  ").join("");
      data += indent +
        (supplementary ? colors.dim(specifier) : specifier) +
        "\n";
    },
  });
  return data;
}
