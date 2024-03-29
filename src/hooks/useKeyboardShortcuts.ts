import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { app } from 'state'

export function useKeyboardShortcuts() {
  useHotkeys('command+z,ctrl+z', () => {
    app.undo()
  })

  useHotkeys('command+shift+z,ctrl+shift+z', () => {
    app.redo()
  })

  useHotkeys('enter', () => {
    const {
      updateText,
    } = app

    if (app.state.appState.text == ``) {
      updateText(`2022`);
    }
  })

  // useHotkeys('command+c,ctrl+c', () => {
  //   app.copySvg()
  // })

  // useHotkeys('command+shift+c,ctrl+shift+c', () => {
  //   app.copyStyles()
  // })

  // useHotkeys('e,backspace', () => {
  //   app.resetDoc()
  // })
}