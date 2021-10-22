import * as React from 'react'
import type { State } from 'types'
import { StateManager } from 'rko'
import type { StateSelector } from 'zustand'

export const initialState: State = {
	appState: {
		// text: 'Weight\n\n2021\n\nJan\n\n3\n66.3kg @panaderos (8:30)'
		// text: 'Sample\n\nInitial text'
    text: ``
	}
}

export const context = React.createContext<AppState>({} as AppState)

export class AppState extends StateManager<State> {
	
	updateText = (text: string) => {
		const { state } = this;
		// console.log(`✅ Text updated`);

    return this.setState({
      before: {
        appState: {
          text: state.appState.text
        }
      },
      after: {
        appState: {
          text
        }
      }
    })
	}

}

export const app = new AppState(initialState, "parser", 1)

export function useAppState(): State
export function useAppState<K>(selector: StateSelector<State, K>): K
export function useAppState<K>(selector?: StateSelector<State, K>) {
	if (selector) {
		return app.useStore(selector)
	}
	return app.useStore()
}