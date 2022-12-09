import * as React from 'react'
import styles from './report.module.css'
import { app } from 'state'
import { useAppState } from 'state'
import { parseNote, getLineDate, getExpenses, Line, getLineExpense, months } from '../../state/utils'

// import { getLineSummary, getLineWeight } from 'state/utils'

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

    let currentDate : {day: number, month: number, year: number} = {
        day: -1,
        month: -1,
        year: -1,
    };
    let runningMonthlyExpenses = 0;
    let runningYearlyExpenses = 0;

    return (
        <div className={styles.report}>
            {expenses.length ? (
                <div>
                <div>
                {expenses.map((l: Line, index: number) => {
                    const expense = getLineExpense(l)
                    const date = getLineDate(l, `yyyy-mm-dd`).split(`.`).join(`-`)

                    if (expense.unit == '$') {
                        expense.value = (expense.value as number) * 0.98
                        expense.unit = '€'
                    }
                    runningMonthlyExpenses += expense.value as number
                    runningYearlyExpenses += expense.value as number

                    let totalMonth;
                    if (currentDate.month > -1 && currentDate.month != l.date.month ||
                        currentDate.month > -1 && currentDate.year > -1 && currentDate.year != l.date.year) {
                        totalMonth = <div key={`${index}-total-month`} class={styles.total}>{months[currentDate.month-1]} · {runningMonthlyExpenses.toFixed(2)}€</div>
                            runningMonthlyExpenses = 0
                    }

                    let totalYear;
                    if (currentDate.year > -1 && currentDate.year != l.date.year) {
                            totalYear = <div key={`${index}-total-year`} class={styles.total}>{currentDate.year} · {runningYearlyExpenses.toFixed(2)}€</div>
                            runningYearlyExpenses = 0
                    }                    

                    let year;
                    if (currentDate.year != l.date.year) {
                        currentDate.year = l.date.year
                
                        year = <div key={`${index}-year`} class={styles.year}>{l.date.year}</div>
                        currentDate.month = -1
                    }

                    let totalEnd;
                    let totalYearEnd;
                    if (index == expenses.length-1) {
                        totalEnd = <div key={`${index}-total-month`} class={styles.total}>{months[currentDate.month-1]} · {runningMonthlyExpenses.toFixed(2)}€</div>
                        totalYearEnd = <div key={`${index}-total-year`} class={styles.total}>{currentDate.year} · {runningYearlyExpenses.toFixed(2)}€</div>
                    }

                    let month;
                    if (currentDate.month != l.date.month) {
                        currentDate.month = l.date.month
                        month = <div key={`${index}-month`} class={styles.month}>{months[l.date.month-1]}</div>
                        currentDate.day = -1
                    }
                    
                    let day;
                    if (currentDate.day != l.date.day) {
                        currentDate.day = l.date.day
                        day = <div key={`${index}-day`} class={styles.day}>{l.date.day}</div>
                    }

                    let expenseItem = (
                    <div key={index} class={styles.expense}>
                        {`${(expense.value as number).toFixed(2)}${expense.unit}`} <span style={{opacity: 0.2}}>({runningMonthlyExpenses.toFixed(2)}) {l.text}</span>
                    </div>
                    )

                    return (
                    <>
                {totalMonth}
                {totalYear}
                {year}
                {month}
                {day}
                {expenseItem}
                {totalEnd}
                {totalYearEnd}
                </>
            )})}</div></div>) : null}
        </div>
    )
}