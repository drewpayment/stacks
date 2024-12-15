

declare global {
  const Deno: {
    readTextFile(path: string): Promise<string>;
    env: {
      get(key: string): string | undefined;
    };
  } | undefined;
}


export type Deno = object | undefined;