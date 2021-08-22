
const Message = ({variant, children}) => {
    return (
        <div className={`alert alert-${variant || 'info'}`}>
            {children}
        </div>
    )
}

export default Message
