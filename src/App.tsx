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
                <p>File Parser ⚡️</p>
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
                
            </div>
            <div className="wrapper">
                <Report />
            </div>

        </>
    )
}
            {/* <Picture
                image="https://nono.imgix.net/img/u/profile-nono-ma.jpg?ixlib=php-3.3.1&w=800"
            />
            <Picture
                image="https://nono.imgix.net/img/u/post-yuval-noah-harari.jpg?ixlib=php-3.3.1"
            />
            <Picture
                image="https://nono.imgix.net/img/u/podcast-luis-ruiz-padron.jpg?ixlib=php-3.3.1&w=900"
            /> */}

const AppWrapper: React.FC = () => {
    return <App />
}

export default AppWrapper