function Button({ children, className = "", type = "button", ...props }) {
    return (
        <button
            className={`simpleButton${className ? ` ${className}` : ""}`}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;