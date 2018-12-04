import { transpileModule, ScriptTarget } from "typescript";

export const compileTypeScript = (code: string) => {
    const output = transpileModule(code, {
        compilerOptions: {
            target: ScriptTarget.ES2015
        }
    });

    return output.outputText;
}