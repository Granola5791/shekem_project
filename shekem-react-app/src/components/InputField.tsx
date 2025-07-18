import React from 'react'

interface InputFieldProps {
    buttonText?: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number';
    onSubmit?: (value: string) => void;
}

const InputField = ({ buttonText = 'Submit', placeholder = 'Enter text here', type = 'text', onSubmit} : InputFieldProps) => {
    return (
        <div>
            <input type={type} placeholder={placeholder} />
            <button type="submit" onClick={(e) => onSubmit?.(e.currentTarget.value)}>{buttonText}</button>
        </div>
    )
}

export default InputField