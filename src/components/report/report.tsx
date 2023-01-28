import * as React from 'react'
import styles from './report.module.css'
import { app } from 'state'
import { useAppState } from 'state'
import { parseNote, getLineDate, getExpenses, Line, getLineExpense, months } from '../../state/utils'
import { Collapsible } from 'components/collapsible'

// import { getLineSummary, getLineWeight } from 'state/utils'

function structureExpenses(expenses) {

    const structured = {}

    Object.keys(expenses).map(k => expenses[k]).forEach(e => {
        const d = e.date;
        if (!structured.hasOwnProperty(d.year)) {
            structured[d.year] = {}
        }
        if (!structured[d.year].hasOwnProperty(d.month)) {
            structured[d.year][d.month] = {}
        }        
        if (!structured[d.year][d.month].hasOwnProperty(e.date.day)) {
            structured[d.year][d.month][d.day] = []
        }
        structured[d.year][d.month][d.day].push(e)
    })

    return structured
}

export function Report(props): JSX.Element {

    const { appState } = useAppState();
    
    const {
        updateText,
    } = app
    
    const lines = parseNote(appState.text);
    const expenses = getExpenses(lines);

    expenses.sort(
        (a,b) => {
            const dateA = getLineDate(a, `yyyy-mm-dd`).split(`.`).join(`-`)
            const dateB = getLineDate(b, `yyyy-mm-dd`).split(`.`).join(`-`)
            return dateA >= dateB ? 1 : -1
        }
    );

    const structuredExpenses = structureExpenses(expenses);

    const elements = []

    Object.keys(structuredExpenses).forEach(kYear => {
        
        const yearElements = []
        const year = structuredExpenses[kYear]
        let yearTotalAmount = 0
        let yearExpenseCount = 0

        Object.keys(year).forEach(kMonth => {

            const month = year[kMonth]
            let monthTotalAmount = 0
            let monthExpenseCount = 0
            const monthElements = []

            Object.keys(month).forEach(kDay => {

                const day = month[kDay]

                const dayElements = []
                let dayTotalAmount = 0
                let dayElementCount = 0

                day.forEach((line: Line, index) => {
                    const expense = getLineExpense(line)
                    if (expense.unit == `$`) {
                        expense.unit = `€`
                        expense.value = 0.95*(expense.value as number)
                    } else if (expense.unit == `BAT`) {
                        expense.unit = `€`
                        expense.value = 0.21*(expense.value as number)
                    }

                    // if (
                    //     line.text.includes('#food') &&
                    //     !line.text.includes('@paco')
                    // ) {
                        dayElementCount += 1
                        const text = <>{(expense.value as number).toFixed(2)}{expense.unit} <span style={{opacity: 0.2}}>{line.text}</span></>
                        dayElements.push(
                            <div
                                key={`expense-${index}`}
                                class={styles.expense}>
                                    {text}
                            </div>)
                        dayTotalAmount += expense.value as number
                    // }
                })

                monthTotalAmount += dayTotalAmount
                monthExpenseCount += dayElementCount

                const dayHeader = <>{kDay.toString().padStart(2, '0')} <span class={styles.dayDetails}>
                    {dayTotalAmount.toFixed(2)}€</span> <span class={styles.dayDetailsFaded}>{dayElementCount} items</span>
                    </>

                if (dayElementCount) {
                    monthElements.push(
                        <Collapsible
                            header={<div class={styles.day}>{dayHeader}</div>}
                            contents={<div>{dayElements}</div>}
                            open={true}
                        />)                
                }
            })

            yearTotalAmount += monthTotalAmount
            yearExpenseCount += monthExpenseCount
            
            const monthHeader = <>{months[kMonth]} <span class={styles.dayDetails}>
                {monthTotalAmount.toFixed(2)}€</span> <span class={styles.dayDetailsFaded}>{monthExpenseCount} items</span>
                </>
            yearElements.push(<Collapsible
                    header={<div key={`month-${kMonth}`} class={styles.month}>{monthHeader}</div>}
                    contents={<div>{monthElements}</div>}
                />)   
        })

        const yearHeader = <>{kYear} <span class={styles.dayDetails}>
        {yearTotalAmount.toFixed(2)}€</span> <span class={styles.dayDetailsFaded}>{yearExpenseCount} items</span>
        </>

        const yearElement = <Collapsible
            header={<div key={`report-${kYear}`} class={styles.yearTitle}>{yearHeader}</div>}
            contents={<div>{yearElements}</div>}
        />
        elements.push(<div key={`year-${kYear}`} class={styles.year}>{yearElement}</div>)
    })

    return <>
        <div class={styles.report}>
            {elements}
        </div>
    </>
}