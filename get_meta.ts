import { defaultPatterns } from "./defaults.ts";
import { collections } from "./deps.ts";
import { semver } from "./deps.ts";
import { Meta } from "./types.ts";

const DEFAULT_VERSION = "latest";

export function getMeta(
  specifier: string,
): Meta | undefined {
  if (specifier.startsWith("file://")) {
    return undefined;
  }
  const prepared = defaultPatterns.map((v) => new URLPattern(v)).reverse();
  const matches = prepared.reduce(
    (p, v) => p ?? getMatches(specifier, v),
    undefined as undefined | Record<string, string>,
  ) ?? {};
  const id = matches.id;
  const file = matches.file || undefined;
  const version = semver.coerce(matches.version)?.toString() ||
    DEFAULT_VERSION;
  if (!id || !version) {
    return undefined;
  }
  return { specifier, matches, id, version, file };
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
