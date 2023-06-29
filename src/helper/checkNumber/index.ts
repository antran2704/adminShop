const handleCheckValidNumber = (value: string) => {
    const regexNumber = /^[0-9]+$/g;
    
    if (!regexNumber.test(value)) {
        return false;
    }

    return true;
}

export default handleCheckValidNumber;