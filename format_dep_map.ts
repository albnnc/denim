import { colors } from "./deps.ts";
import { DepMap } from "./types.ts";
import { walkDepMap } from "./walk_dep_map.ts";

export function formatDepMap(depMap: DepMap) {
  let data = "";
  walkDepMap(depMap, (specifier, depth, repeat) => {
    const indent = new Array(depth).fill("  ").join("");
    data += indent +
      (repeat ? colors.dim(specifier) : specifier) +
      "\n";
  });
  return data;
}
