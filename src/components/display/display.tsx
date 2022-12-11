import * as React from 'react'
import styles from './display.module.css'

import { getLineSummary, getLineWeight } from 'state/utils'

export function Display(props): JSX.Element {

    return (
        <div className={styles.display}>
            {props.lines && (
                props.lines.map((line, index) => {
                    return (
                        <div className={styles.grid} key={index}>
                            <div className={styles.text}>
                                {/* {line.text} */}
                            </div>
                            <div className={styles.type} data-type={line.type}>
                                {line.type} ·
                            </div>
                            <div className={styles.value}>
                                {getLineSummary(line)}
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}