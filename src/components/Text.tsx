import * as React from 'react'

function Text(): JSX.Element {
    return (
        <>
            This is the new <span className="black">macOS Monterey</span> like it or not, and you'll eventually buy into it.
        </>
    )
}

const TextWrapper: React.FC = () => {
    return <Text />
}

export default TextWrapper