function Input({label,type,placeholder,value,onChange,name, ...props}) 
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
                {...props}
            />
        </div>
    );
}

export default Input;