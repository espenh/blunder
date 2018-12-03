import React from "react";
import MonacoEditor from "react-monaco-editor";
import SamplePlayerCode from '!raw-loader!./models/samplePlayer.ts';
import ChessTypesCode from '!raw-loader!./models/chessContracts.d.ts';
import { editor } from "monaco-editor";
import * as editorApi from "monaco-editor/esm/vs/editor/editor.api";
import { transpileModule } from "typescript";

export class Editor extends React.Component {

    private editor!: editor.IStandaloneCodeEditor;

    constructor(props: any) {
        super(props);
        window.addEventListener("resize", this.updateLayout);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.updateLayout);
    }

    private updateLayout = () => {
        this.editor.layout();
        this.editor.render();
    }

    public componentDidMount() {
        console.log("MOUNT!");
        console.log(SamplePlayerCode);
    }

    private editorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: typeof editorApi) => {
        console.log('editorDidMount', editor);
        this.editor = editor;
        editor.focus();

        monaco.languages.typescript.typescriptDefaults.addExtraLib(ChessTypesCode);
    }
    private onChange = (newValue: any, e: any) => {
        const output = transpileModule(newValue, {
            compilerOptions: {
                target: 2
            }
        });
        console.log('onChange', newValue, e);
        console.log("output", output);
    }

    public render() {
        const code = SamplePlayerCode;

        const options: editor.IEditorConstructionOptions = {
            selectOnLineNumbers: true,
            minimap: {
                enabled: false
            }
        };
        return <div className="editor-container">
            <MonacoEditor
                language="typescript"
                theme="vs-dark"
                value={code}
                options={options}
                onChange={this.onChange}
                editorDidMount={this.editorDidMount}
            />
        </div>;
    }
}