import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAppState, app } from 'state'
import styles from './tiptap.module.css'
import { plainTextToHtml } from 'state/utils'

export function TipTap(): JSX.Element {

  const { appState } = useAppState();

  const {
    updateText,
  } = app

  const content = appState.text

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
  })

  React.useEffect(() => {
    if (editor && !editor.isFocused) {
      // editor.commands.setContent(plainTextToHtml(appState.text))
      editor.commands.setContent(appState.text)
    }
  }, [appState])  

  React.useEffect(() => {

    if (!editor) return

    const handleUpdate = ({editor}) => {
      let html = editor.getHTML()
      html = html == `<p></p>` ? `` : html
      updateText(html)
    }

    editor.on('update', handleUpdate)

    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor])

  return (
    <EditorContent
      className={styles.editor}
      editor={editor}
    />
  )
}