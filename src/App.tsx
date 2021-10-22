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