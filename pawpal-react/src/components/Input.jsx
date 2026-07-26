function Input({label,type,placeholder,value,onChange,name}) 
{
    return (
        <div className="inputField">
            <label>{label}</label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default Input;