import React from 'react'

function Picture(props): JSX.Element {
    return (
        <>
            <div
              className="picture"
              style={{
                  backgroundImage: `url('${props.image}')`,
              }}
            ></div>
            Name
        </>
    )
}

const PictureWrapper: React.FC = (props) => {
    return <Picture {...props}/>
}

export default PictureWrapper