//********************TO INVOKE THE API ONLY WHEN USER STOPPED TYPING ATLEAST FOR 1 SECOND********************
const debounce = (func, delay=1000) => {

    let timeoutId;              //for setTimeout function as it returns integer value as id, before completion
    return ((...args) => {     //using spread as we may need more than 1 argument
        if (timeoutId) {            //timeoutId is undefined only for the first time
            clearTimeout(timeoutId) //clearing the setTimeout using timeoutId before API getting called. 
        }

        // setTimeout. not setInterval
        timeoutId = setTimeout(() => {
            func.apply(null, args)  // to get and pass all arguments separately to func, we use apply()
        }, delay)

    })
};