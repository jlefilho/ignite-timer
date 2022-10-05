import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { HandPalm, Play } from "phosphor-react";
import * as zod from 'zod'

import { CyclesContext } from "../../contexts/CyclesContext";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

import {   
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from "./styles";

//Zod Validation
const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(1, 'Informe a tarefa'),
	minutesAmount: zod.number()
	.min(5, 'O intervalo precisa ser de no mínimo 5 minutos.')
	.max(60, 'O intervalo precisa ser de no máximo 60 minutos.')
})

// interface NewCycleFromData {
//     task: string
//     minutesAmount: number
// }

type NewCycleFromData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {	
	const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)

	//Hook Form  
	const newCycleForm = useForm<NewCycleFromData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 0
		}
	})

	const { handleSubmit, watch, /*reset*/ } = newCycleForm	

	const task = watch('task')
	const isSubmitDisabled = !task

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(createNewCycle)}>
				
				<FormProvider {...newCycleForm}>	{/*acting like Form Context*/}
					<NewCycleForm />
				</FormProvider>
				<Countdown />
				
				{ activeCycle ? (
					<StopCountdownButton
						type="button"
						onClick={interruptCurrentCycle}                            
					>
						<HandPalm size={24}/>
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton
						type="submit"
						disabled={isSubmitDisabled}     
					>
						<Play size={24}/>
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	)
}