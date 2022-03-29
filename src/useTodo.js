import { useEffect, useState } from 'react';

export default function useTodo(key, initialValue) {
    const [list, setList] = useState(() => {
        //get list from localstorage or return initialvalue 
        return getLocalstorage(key, initialValue)
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(list))
    }, [list])

    return [list, setList]
}

function getLocalstorage(key, initialValue){
    const storedValue = JSON.parse(localStorage.getItem(key))
    if (storedValue) return storedValue
    if (initialValue instanceof Function) return initialValue()
    return initialValue 
}