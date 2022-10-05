import { createContext, ReactNode, useState } from "react";

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

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    //State Hooks
	const [cycles, setCycles] = useState<Cycle[]>([])
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null)	
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

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
		
		setCycles(state => [...state, newCycle])
		setActiveCycleId(newCycle.id)
		setAmountSecondsPassed(0)
		// reset()
	}
	
	//Stop current cycle
	function interruptCurrentCycle() {        
		setCycles(state => state.map(cycle => {
			if (cycle.id === activeCycleId){
				return {...cycle, interruptedDate: new Date} //inserting cycle prop interruptedDate
			} else {
				return cycle
			}
		}))
		setActiveCycleId(null)
	}	
    
    //Mark cycle as finished
	function markCurrentCycleAsFinished() {
		setCycles(state => state.map(cycle => {
			if (cycle.id === activeCycleId){
				return {...cycle, finishedDate: new Date} 
			} else {
				return cycle
			}
		}))
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