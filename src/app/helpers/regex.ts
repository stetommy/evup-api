const regexDict={
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    IT_phone: /^(([+])39)?((3[1-6][0-9]))(\d{7})$/,
    CH_phone: /^(?:(?:|0{1,2}|\+{0,2})41(?:|\(0\))|0?)((?:7[0-9])|(?:[1-6]\d))(?:\d{3})(?:\d{2})(?:\d{2})$/,
}

export default function regex(){
    return Object.freeze({
        isEmailValid:isEmailValid,
        isPasswordValid:isPasswordValid,
        isPhoneValid:isPhoneValid,
    })
    
    function isEmailValid(email:string):boolean{
        return !!email.match(regexDict.email)
    }

    function isPasswordValid(password:string):boolean{
        return !!password.match(regexDict.password)
    }

    function isPhoneValid(phone:string):boolean{
        return !!phone.match(regexDict.IT_phone) || !!phone.match(regexDict.CH_phone);
    }
}