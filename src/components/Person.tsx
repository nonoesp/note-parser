import { setUncaughtExceptionCaptureCallback } from 'process';
import React, { useEffect, useState } from 'react'

function Person(): JSX.Element {
    // const [count, setCount] = useState(0);

    const count = useCount(10);
    const age = useCount(31);

    const width = useWindowWidth();
    useDocumentTitle(`Nono's App (${count.value})`)

    const [num, setNum] = useState(0);

    useEffect(() => {
      setNum(num + 10)
      // return count
    }, [width])

    return (
        <>
        <div
            style={{cursor: "pointer"}}
            onClick={count.onClick}
        >
            <i>Button</i>
        </div>
            Persons {count.value}
            <br />
            <div>Width: {width}</div>
            <div onClick={age.onClick}>Age is {age.value}</div>
            <div>
              Num: {num}
            </div>
        </>
    )
}

// Define a Custom Hook
// By convention, custom hook names always start with `use`
function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        // Handler
        const handleResize = () => setWidth(window.innerWidth)
        // Subscribe
        window.addEventListener('resize', handleResize)
        return () => {
            // Unsubscribe
            window.removeEventListener('resize', handleResize)
        }
    })

    return width;
}

function useCount(initialValue) {
  const [value, setValue] = useState(initialValue)

  function handleAdd() {
    setValue(value + 1)
    console.log(`handleAdd..`);
  }

  return {
    value,
    onClick: handleAdd
  }

}

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  })  
}

const PersonWrapper: React.FC = () => {
    return <Person />
}

export default PersonWrapper