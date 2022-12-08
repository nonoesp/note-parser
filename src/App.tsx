import * as React from 'react'
import Dropzone from './components/Dropzone'
import { useAppState } from 'state'
import { parseNote, noteLinesAsText, getExpenses, Line, getLineExpense } from './state/utils'
import { useKeyboardShortcuts } from 'hooks'
import { Display } from './components/display'
import { app } from 'state'
import { TipTap } from './components/tiptap'
import { Report } from './components/report'

function App(): JSX.Element {
    useKeyboardShortcuts();
    const { appState } = useAppState();

    const {
        updateText,
    } = app

    const lines = parseNote(appState.text);
    const expenses = getExpenses(lines);

    return (
        <>
            <div className="wrapper">
                <p>Note Parser ⚡️</p>
                <br />
                {appState.text ?
                (<div style={{position: 'relative'}}>
                    <TipTap/>
                    <Display
                        lines={lines}
                        editable={false}
                        onInput={null}
                    />
                </div>):
                <Dropzone />
                }
                
                <Report />
                <div className="footer">
                    A thing by <a href="https://nono.ma">Nono Martínez Alonso</a>
                </div>
            </div>
        </>
    )
}

const AppWrapper: React.FC = () => {
    return <App />
}

export default AppWrapper