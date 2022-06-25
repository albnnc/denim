import { cache, denoGraph } from "./deps.ts";
import { ModGraph } from "./types.ts";

export async function buildModGraph(
  ...roots: string[]
): Promise<ModGraph> {
  const { modules } = await denoGraph
    .createGraph(roots, { load: createLoader() })
    .then((v) => v.toJSON());
  const graph = modules.reduce(
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
    {} as ModGraph,
  );
  Object.keys(graph).forEach((specifier) => {
    const node = graph[specifier];
    node.deps.forEach((v) => graph[v].parents.add(specifier));
  });
  return graph;
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
