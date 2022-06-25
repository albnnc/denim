import { log, path } from "./deps.ts";
import { buildModMap, formatModMap, transformModMap } from "./mod.ts";

const root = "file:///" + path.resolve(Deno.args[0]);

log.info(`Building for "${root}"`);
const modMap = await buildModMap(root);

log.info(`Formatting`);
console.log(formatModMap(modMap));

const transformMap = transformModMap(modMap);
console.log(transformMap);
