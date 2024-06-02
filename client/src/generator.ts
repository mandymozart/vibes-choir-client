type GeneratorReturnTable = string[][] | never;
type GeneratorInterface = {
  name: string;
  name_external: string;
  description: string;
  status_func: () => string[][] | never;
  status_list_func: () => string[][] | never;
  assets: GeneratorInterface[] | GeneratorAction[];
};

type GeneratorAction = {
  name: string | never;
  description: string;
  range:
    | {
        type: GeneratorFloat | GeneratorInt | GeneratorChar | never;
        value: number;
        min: number | never;
        max: number | never;
      }
    | never;
  prompt_msg: string;
  prompt_func: () => string[][] | never;
  execute: (param: number) => string[][] | never;
};
