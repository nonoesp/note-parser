import * as React from 'react'
import { useState } from 'react'
import styles from './collapsible.module.css'

export function Collapsible(props): JSX.Element {

    const [open, setOpen] = useState(props.open || false)

    const toggle =  () => {
        setOpen(!open)
    }

    return <>
        <div>
            <div onClick={toggle} class={styles.header}>
                {props.header}
            </div>
            {open && <div class={styles.contents}>{props.contents}</div>}
        </div>
    </>
}