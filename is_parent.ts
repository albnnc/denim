import { DepMap } from "./types.ts";
import { walkDepMap } from "./walk_dep_map.ts";

export interface IsParentOptions {
  parent: string;
  child: string;
  depMap: DepMap;
}

export function isParent({ parent, child, depMap }: IsParentOptions) {
  let res = false;
  walkDepMap({
    ...depMap,
    root: parent,
  }, (specifier) => {
    if (specifier === child) {
      res = true;
      return true;
    }
  });
  return res;
}
