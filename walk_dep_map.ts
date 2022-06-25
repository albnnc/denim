import { DepMap } from "./types.ts";

export function walkDepMap(
  { root, deps }: DepMap,
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
    deps[specifier].forEach((v) => walk(v, depth + 1));
  };
  walk();
}
