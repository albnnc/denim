export interface ModGraphNode {
  parents: Set<string>;
  deps: Set<string>;
}

export type ModGraph = Record<string, ModGraphNode>;

export interface ModMeta {
  specifier: string;
  matches: Record<string, string>;
  id: string;
  version: string;
}

export interface TransformRule {
  source: string;
  target: string;
}

export interface Config {
  transforms?: TransformRule[];
}
