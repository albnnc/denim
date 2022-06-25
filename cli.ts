import { log, path } from "./deps.ts";
import { buildDepMap, formatDepMap, transformDepMap } from "./mod.ts";

const root = "file:///" + path.resolve(Deno.args[0]);

log.info(`Building for "${root}"`);
const depMap = await buildDepMap(root);

log.info(`Formatting`);
console.log(formatDepMap(depMap));

const transformMap = transformDepMap(depMap);
console.log(transformMap);
