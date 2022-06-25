import { cache, denoGraph } from "./deps.ts";
import { DepMap } from "./types.ts";

export async function buildDepMap(root: string): Promise<DepMap> {
  const { modules, roots } = await denoGraph
    .createGraph(
      root,
      { load: createLoader() },
    )
    .then((v) => v.toJSON());
  return {
    root: roots[0],
    deps: modules.reduce(
      (prev, {
        specifier,
        dependencies = {},
        typesDependency: { specifier: types } = {},
      }) => {
        return ({
          ...prev,
          [specifier]: Object.values(dependencies)
            .map((v) => v.code?.specifier)
            .concat(types ? [types] : [])
            .sort()
            .filter((v) => v),
        });
      },
      {},
    ),
  };
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
