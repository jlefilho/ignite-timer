import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleData {
    task: string
    minutesAmount: number
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

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    //Reducer Hooks
	const [cyclesState, dispatch] = useReducer(cyclesReducer,
		{
			cycles: [],
			activeCycleId: null
		}, 
		() => {
			const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')

			if (storedStateAsJSON) {
				return JSON.parse(storedStateAsJSON)
			}

			return {cycles: [], activeCycleId: null}
		}
	)

	const { cycles, activeCycleId } = cyclesState

	//Active cycle id check
	const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

	//State Hooks		
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
		if (activeCycle) {
			return differenceInSeconds(
				new Date(),
				new Date (activeCycle.startDate)
			)
		}	
			
		return 0
	})

	//Effect Hooks
	useEffect(() => {
		const stateJSON = JSON.stringify(cyclesState)

		localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
	}, [cyclesState])



    //Create new cycle
	function createNewCycle(data: CreateCycleData) {
		const newCycle:Cycle = {
			id: String(new Date().getTime()),
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date()            
		}
		
		dispatch(addNewCycleAction(newCycle))
		//Changed after Reducer creation
		// setCycles(state => [...state, newCycle])
		// setActiveCycleId(newCycle.id)
		setAmountSecondsPassed(0)		
	}
	
	//Stop current cycle
	function interruptCurrentCycle() {
		dispatch(interruptCurrentCycleAction())
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
		dispatch(markCurrentCycleAsFinishedAction())
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