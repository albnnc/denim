import { semver } from "./deps.ts";
import { ModMeta } from "./types.ts";

const ruleRegExp = /^@?(.+)@(.+)$/;

export function checkRule(
  rule: string,
  depMeta: ModMeta,
) {
  if (rule === "*") {
    return true;
  }
  ruleRegExp.lastIndex = 0;
  const [_, id, version] = ruleRegExp.exec(rule) ?? [];
  return (
    (id === "*" || id === depMeta.id) &&
    (version === "*" || semver.satisfies(depMeta.version, version))
  );
}
