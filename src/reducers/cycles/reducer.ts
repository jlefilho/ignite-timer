import { produce } from 'immer'

import { ActionTypes } from "./actions"

export interface Cycle {
	id: string
	task: string
	minutesAmount: number
	startDate: Date
	interruptedDate?: Date
	finishedDate?: Date
}

interface CyclesState {
	cycles: Cycle[]
	activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: any) {
    switch (action.type) {
        case ActionTypes.ADD_NEW_CYCLE:
            /*
            Before adding immer
            // return {
            //     ...state,
            //     cycles: [...state.cycles, action.payload.newCycle],
            //     activeCycleId: action.payload.newCycle.id
            // }
            */
            return produce(state, draft => {
                draft.cycles.push(action.payload.newCycle)
                draft.activeCycleId = action.payload.newCycle.id
            })
        break
        case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
            /*
            Before adding immer
            // return {
            //     ...state,
            //     cycles: state.cycles.map(cycle => {
            //         if (cycle.id === state.activeCycleId){
            //             return {...cycle, interruptedDate: new Date} //inserting cycle prop interruptedDate
            //         } else {
            //             return cycle
            //         }
            //     }),
            //     activeCycleId: null
            // }
            */

            const currentCycleIndex = state.cycles.findIndex(cycle => {
                return cycle.id === state.activeCycleId
            })

            if (currentCycleIndex < 0) {
                return state
            }

            return produce(state, draft => {
                draft.cycles[currentCycleIndex].interruptedDate = new Date()
                draft.activeCycleId = null
            })
        }
        break
        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
            /*
            Before adding immer
            return {
                ...state,
                cycles: state.cycles.map(cycle => {
                    if (cycle.id === state.activeCycleId){
                        return {...cycle, finishedDate: new Date} 
                    } else {
                        return cycle
                    }
                }),
                activeCycleId: null
            }
            */

            const currentCycleIndex = state.cycles.findIndex(cycle => {
                return cycle.id === state.activeCycleId
            })

            if (currentCycleIndex < 0) {
                return state
            }

            return produce(state, draft => {
                draft.cycles[currentCycleIndex].finishedDate = new Date()
                draft.activeCycleId = null
            })
        }            
        break
        default: return state
    }		
}