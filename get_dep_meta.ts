import { collections } from "./deps.ts";
import { semver } from "./deps.ts";
import { DepMeta } from "./types.ts";

const DEFAULT_VERSION = "latest";

export function getDepMeta(
  specifier: string,
  patterns: URLPatternInit[],
): DepMeta | undefined {
  if (specifier.startsWith("file://")) {
    return undefined;
  }
  const prepared = patterns.map((v) => new URLPattern(v)).reverse();
  const matches = prepared.reduce(
    (p, v) => p ?? getMatches(specifier, v),
    undefined as undefined | Record<string, string>,
  ) ?? {};
  const id = matches.id;
  const version = semver.coerce(matches.version)?.toString() ||
    DEFAULT_VERSION;
  if (!id || !version) {
    return undefined;
  }
  return { specifier, matches, id, version };
}

function getMatches(
  specifier: string,
  pattern: URLPattern,
): Record<string, string> | undefined {
  const executed = pattern.exec(specifier);
  return executed
    ? collections.filterKeys(
      Object.values(executed).reduce((p, v) => ({ ...p, ...v?.groups }), {}),
      (v: string) => isNaN(parseInt(v)),
    )
    : undefined;
}
