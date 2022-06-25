import { colors } from "./deps.ts";
import { ModMap } from "./types.ts";
import { walkModMap } from "./walk_mod_map.ts";

export function formatModMap(modMap: ModMap) {
  let data = "";
  walkModMap(modMap, (specifier, depth, repeat) => {
    const indent = new Array(depth).fill("  ").join("");
    data += indent +
      (repeat ? colors.dim(specifier) : specifier) +
      "\n";
  });
  return data;
}
