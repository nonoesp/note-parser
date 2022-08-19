import * as React from 'react'
import Dropzone from './components/Dropzone'
import { useAppState } from 'state'
import { parseNote, noteLinesAsText, getExpenses, Line, getLineExpense } from './state/utils'
import { useKeyboardShortcuts } from 'hooks'
import { Display } from './components/display'
import { app } from 'state'
import { TipTap } from './components/tiptap'

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
                    (<div style={{ position: 'relative' }}>
                        <TipTap />
                        <Display
                            lines={lines}
                            editable={false}
                            onInput={null}
                        />
                    </div>) :
                    <Dropzone />}
                {/* <br />

                {expenses.length ? (
                    <div>
                    <p>Expenses</p>
                    <div style={{fontFamily: `monospace`}}>
                    {expenses.map((l: Line, index: number) => {
                        const expense = getLineExpense(l)
                        return (
                    <div key={index}>
                        {l.date.year}.{l.date.month.toString().padStart(2, `0`)}.{l.date.day.toString().padStart(2, `0`)}
                        &nbsp;·&nbsp;
                        {`${expense.value}${expense.unit}`}
                    </div>
                )})}</div></div>) : null} */}
            </div>

        </>
    )
}

const AppWrapper: React.FC = () => {
    return <App />
}

export default AppWrapper