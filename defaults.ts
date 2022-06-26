const idLike = "[a-zA-Z0-9\\-_]+";
const pathname = "/" + [
  `(std|x|-|v\\d+)?`,
  `:id(@${idLike}/${idLike}|${idLike}){@:version}?`,
  `(es\\d+)?`,
  `([^/]+/unoptimized)?`,
  `([^/]+/optimized)?`,
  ":file*",
].join("/");

export const defaultPatterns = [{ pathname }];

export const defaultRules = [{
  source: "*",
  target: "{id}@^{version}",
}];
