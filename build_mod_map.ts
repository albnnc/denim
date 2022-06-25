import { cache, denoGraph } from "./deps.ts";
import { ModMap } from "./types.ts";

export async function buildModMap(root: string): Promise<ModMap> {
  const { modules, roots } = await denoGraph
    .createGraph(
      root,
      { load: createLoader() },
    )
    .then((v) => v.toJSON());
  const modMap = {
    root: roots[0],
    mods: modules.reduce(
      (prev, {
        specifier,
        dependencies = {},
        typesDependency: { specifier: types } = {},
      }) => {
        const deps = new Set(
          Object.values(dependencies)
            .map((v) => v.code?.specifier)
            .concat(types ? [types] : [])
            .sort()
            .filter(Boolean) as string[],
        );
        return ({
          ...prev,
          [specifier]: {
            // We're going to fill parents later.
            parents: new Set<string>(),
            deps,
          },
        });
      },
      {} as ModMap["mods"],
    ),
  };
  Object.keys(modMap.mods).forEach((modSpecifier) => {
    const mod = modMap.mods[modSpecifier];
    for (const depSpecifier of mod.deps) {
      modMap.mods[depSpecifier].parents.add(modSpecifier);
    }
  });
  return modMap;
}

function createLoader() {
  return async (
    specifier: string,
  ): Promise<denoGraph.LoadResponse | undefined> => {
    if (specifier.startsWith("file://")) {
      const content = await Deno.readTextFile(new URL(specifier));
      return { kind: "module", specifier, content };
    }
    // ?
    if (specifier.endsWith(".d.ts")) {
      return undefined;
    }
    const file = await cache.cache(specifier);
    const content = await Deno.readTextFile(file.path);
    return {
      kind: "module",
      specifier,
      content,
      headers: file.meta.headers,
    };
  };
}
