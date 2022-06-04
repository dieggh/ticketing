import { useState } from "react";

export const useForm = (initState) => {

    const [state, setState] = useState( initState );

    const onChange = (value, field) => {
        setState({
            ...state,
            [field]: value
        });
    }

    const setFormValue = (form) =>{
        setState(form);
    }

    return {
        ...state,
        form: state,
        onChange,
        setFormValue
    }
}