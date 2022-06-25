import { log, path } from "./deps.ts";
import { buildGraph, formatGraph, transformGraph } from "./mod.ts";

const root = "file://" + path.resolve(Deno.args[0]);

log.info(`Building for "${root}"`);
const graph = await buildGraph(root);
console.log(graph);

log.info(`Formatting`);
console.log(formatGraph(graph, root));

const transformMap = transformGraph({ graph, root });
console.log(transformMap);
