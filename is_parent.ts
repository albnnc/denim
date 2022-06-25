import { ModMap } from "./types.ts";
import { walkModMap } from "./walk_mod_map.ts";

export interface IsParentOptions {
  parent: string;
  child: string;
  modMap: ModMap;
}

export function isParent({ parent, child, modMap }: IsParentOptions) {
  let res = false;
  walkModMap({
    ...modMap,
    root: parent,
  }, (specifier) => {
    if (specifier === child) {
      res = true;
      return true;
    }
  });
  return res;
}
