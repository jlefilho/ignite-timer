import { differenceInSeconds } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { CyclesContext } from "../../../../contexts/CyclesContext";
import { CyclesContextProvider } from "../../../../contexts/CyclesContext";
import { CountdownContainer, Separator } from "./styles";

export function Countdown() {
	//Context Hook
    const {
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed 
    } = useContext(CyclesContext)	

    //Convert minutes to seconds
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0    

    //Decreasing countdown
    useEffect(() => {
        let interval: any
    
        if (activeCycle) {
            interval = setInterval(()=> {
                const secondsDifference = differenceInSeconds(
                    new Date(),
                    new Date (activeCycle.startDate)
                )
                               
                if (secondsDifference >= totalSeconds) {
                    markCurrentCycleAsFinished()
                    setSecondsPassed(totalSeconds)
                    clearInterval(interval)                   
                } else {
                    setSecondsPassed(secondsDifference) 
                }
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setSecondsPassed])

    //Seconds passed
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    //Convert seconds to minutes/seconds
    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    //Fill the countdown fields when algorithmism < 2 (9 -> 09)
    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    //Setting countdown as document title
    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    return (
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    )
}