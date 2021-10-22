import * as React from 'react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { app } from 'state'

function Dropzone(): JSX.Element {
    const {
        updateText,
    } = app

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('❌ File reading was aborted.')
            reader.onerror = () => console.log('❌ File reading has failed.')

            reader.onload = () => {
                let result = reader.result as string
                result = result.split('\n').map((s) => `<p>${s}</p>`).join(``)
                console.log(result);
                updateText(result)
            }
            reader.readAsText(file)
        })
    }, [])

    const {
        getRootProps, getInputProps, isDragActive
    } = useDropzone({ onDrop })

    return (
        <>
            <div className="zone dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop it!</p> :
                    <p>Drop files here or click to select files.</p>
            }
            </div>
        </>
    )
}

const DropzoneWrapper: React.FC = () => {
    return <Dropzone />
}

export default DropzoneWrapper