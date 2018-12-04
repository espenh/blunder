import React from "react";
import MonacoEditor from "react-monaco-editor";
import SamplePlayerCode from '!raw-loader!./../models/samplePlayer.ts';
import ChessTypesCode from '!raw-loader!./../models/chessContracts.d.ts';
import { editor } from "monaco-editor";
import * as editorApi from "monaco-editor/esm/vs/editor/editor.api";
import { transpileModule } from "typescript";

export class Editor extends React.Component {

    private editor!: editor.IStandaloneCodeEditor;

    public state: {
        code: string
    } = {
            code: SamplePlayerCode
        };

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

    private editorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: typeof editorApi) => {
        this.editor = editor;
        editor.focus();

        monaco.languages.typescript.typescriptDefaults.addExtraLib(ChessTypesCode);
    }
    private onChange = (newValue: string, e: any) => {
        this.setState({
            code: newValue
        });

        const output = transpileModule(newValue, {
            compilerOptions: {
                target: 2
            }
        });
    }

    public render() {
        const code = this.state.code;

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