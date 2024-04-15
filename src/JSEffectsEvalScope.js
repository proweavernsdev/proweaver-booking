const formFields = {}
let fieldGetSetter = null

function field(id){
    return formFields[id]
}


export function initFormFields( fieldGetSet ) {
    fieldGetSetter = fieldGetSet
}

export function evalThis(current, func){
    const f = fieldGetSetter

    console.log(func)
    
    function watch(fields,func){
        if(!fields.includes(current.id)) return
        func()
    }
    new Function('',func)()
}


