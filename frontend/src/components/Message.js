import { useEffect } from "react"



const Message = ({message, isError, clearMessage}) => {
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            clearMessage();
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [message, clearMessage]);

    if (!message) {
        return null;
    }

    return (
        <div className="padding text-center">
            <p className={`${isError ? "error-message" : "success-message"}`}>{message}</p>
        </div>
    );
}


export default Message;