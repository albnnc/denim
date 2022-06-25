export interface ModMap {
  root: string;
  mods: Record<string, {
    parents: Set<string>;
    deps: Set<string>;
  }>;
}

export interface ModMeta {
  specifier: string;
  matches: Record<string, string>;
  id: string;
  version: string;
}

export interface Rule {
  source: string;
  target: string;
}

export interface Config {
  rules?: Rule[];
}
