import { ModMap } from "./types.ts";

export function walkModMap(
  { root, mods }: ModMap,
  fn: (
    specifier: string,
    depth: number,
    repeat: boolean,
  ) => boolean | undefined | void,
) {
  const accessed = new Set<string>();
  const walk = (specifier = root, depth = 0) => {
    if (accessed.has(specifier)) {
      fn(specifier, depth, true);
      return;
    }
    accessed.add(specifier);
    const shouldStop = fn(specifier, depth, false);
    if (shouldStop) {
      return;
    }
    mods[specifier].deps?.forEach((v) => walk(v, depth + 1));
  };
  walk();
}
