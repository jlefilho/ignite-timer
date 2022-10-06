import { createContext, ReactNode, useReducer, useState } from "react";

interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface Cycle {
	id: string
	task: string
	minutesAmount: number
	startDate: Date
	interruptedDate?: Date
	finishedDate?: Date
}

interface CycleContextType {
	cycles: Cycle[]
	activeCycle: Cycle | undefined
	activeCycleId: string | null
	amountSecondsPassed: number
	markCurrentCycleAsFinished: () => void
	setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CycleContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

interface CyclesState {
	cycles: Cycle[]
	activeCycleId: string | null
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    //Reducer Hooks
	const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {
		switch (action.type) {
			case 'ADD_NEW_CYCLE':
				return {
					...state,
					cycles: [...state.cycles, action.payload.newCycle],
					activeCycleId: action.payload.newCycle.id
				}
			break
			case 'INTERRUPT_CURRENT_CYCLE':
				return {
					...state,
					cycles: state.cycles.map(cycle => {
						if (cycle.id === state.activeCycleId){
							return {...cycle, interruptedDate: new Date} //inserting cycle prop interruptedDate
						} else {
							return cycle
						}
					}),
					activeCycleId: null
				}
			break
			case 'MARK_CURRENT_CYCLE_AS_FINISHED':
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
			break
			default: return state
		}		
	}, {
		cycles: [],
		activeCycleId: null
	})

	
	//State Hooks		
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

	const { cycles, activeCycleId } = cyclesState

    //Active cycle id check
	const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    //Create new cycle
	function createNewCycle(data: CreateCycleData) {
		const newCycle:Cycle = {
			id: String(new Date().getTime()),
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date()            
		}
		
		dispatch({
			type: 'ADD_NEW_CYCLE',
			payload: {
				newCycle
			}
		})
		//Changed after Reducer creation
		// setCycles(state => [...state, newCycle])
		// setActiveCycleId(newCycle.id)
		setAmountSecondsPassed(0)		
	}
	
	//Stop current cycle
	function interruptCurrentCycle() {
		dispatch({
			type: 'INTERRUPT_CURRENT_CYCLE',
			payload: {
				activeCycleId
			}
		})
		//Changed after Reducer creation
		// setCycles(state => state.map(cycle => {
		// 	if (cycle.id === activeCycleId){
		// 		return {...cycle, interruptedDate: new Date} //inserting cycle prop interruptedDate
		// 	} else {
		// 		return cycle
		// 	}
		// }))
		// setActiveCycleId(null)
	}	
    
    //Mark cycle as finished
	function markCurrentCycleAsFinished() {
		dispatch({
			type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
			payload: {
				activeCycleId
			}
		})
		//Changed after Reducer creation
		// setCycles(state => state.map(cycle => {
		// 	if (cycle.id === activeCycleId){
		// 		return {...cycle, finishedDate: new Date} 
		// 	} else {
		// 		return cycle
		// 	}
		// }))
	}

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPassed(seconds)
	}

    return (
        <CyclesContext.Provider
            value={{
				cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
            }}
		>
            {children}
        </CyclesContext.Provider>
    )
}