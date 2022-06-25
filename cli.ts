import { log, path } from "./deps.ts";
import { buildModGraph, formatModGraph, transformModGraph } from "./mod.ts";

const root = "file://" + path.resolve(Deno.args[0]);

log.info(`Building for "${root}"`);
const graph = await buildModGraph(root);

log.info(`Formatting`);
console.log(formatModGraph(graph, root));

const transformMap = transformModGraph({ graph, root });
console.log(transformMap);
