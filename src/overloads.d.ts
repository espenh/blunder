declare module "!raw-loader!*" {
    const content: string;
    export default content;
}

// TODO - This is just a placeholder for importing the transpile function from monaco.
// Doesn't work yet, but will be something like this.
declare module "monaco-editor/esm/vs/language/typescript/lib/typescriptServices" {
    export { transpileModule } from "typescript";
}