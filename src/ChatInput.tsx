import  React, {CSSProperties} from 'react'

const styles = {
  chatInput: {
    display: 'flex',
    flexDirection: 'row'
  },
  inputStyle: {
    border: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ddd',
    fontSize: '16pt',
    outline: 'none',
    padding: '10px',
    width: '100%',
    marginRight: '5px'
  },
  sendButton: {
    minWidth: '80px'
  }
}


interface ChatInputProps {
  renderSend: (args: {
    style: {},
    onClick: (e)=>void,
    disabled: boolean,
    children: string | JSX.Element | JSX.Element[]
})=> JSX.Element,
  placeholder: string,
  renderComposer: (args: {
    value: string,
    style: {},
    placeholder: string,
    maxLength: number,
    onChange: (e) => void,
    onKeyUp: (e)=>void,
  }) => JSX.Element,
  renderInputToolbar: (
    args: {
      style: {},
    },
    children: JSX.Element[] | JSX.Element | string
  ) => JSX.Element
  textInputStyle: {},
  text: string,
  onInputTextChanged: (e)=>void,
  sendButtonStyle: {},
  sendButtonDisabledStyle: {},
  maxInputLength: number, 
  onSend: (message)=>void, 
  alwaysShowSend: boolean
}

export default class ChatInput extends React.Component<ChatInputProps, {message}> {
  static defaultProps = {
    renderComposer: (renderComposerProps) => <textarea {...renderComposerProps}/>,
    renderSend: (sendButtonProps) => <button id="chat_input_send_button" type="submit" {...sendButtonProps}/>,
    renderInputToolbar: (renderInputToolbarProps, children) => <div className="chat-input" {...renderInputToolbarProps}>{children}</div>
  }
  

  constructor(props) {
    super(props)
    this.onSend = this.onSend.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.state = { message: '' }
  }

  onSend() {
    const { text, onSend, alwaysShowSend } = this.props
    if (onSend) {
      const messageToUse = (text || this.state.message).trim()
      if (alwaysShowSend || messageToUse.length > 0) {
        onSend(messageToUse)
      }
    }
    this.setState({ message: '' })
  }

  onKeyUp(event) {
    if (!event.shiftKey && event.key === 'Enter') {
      event.stopPropagation()
      this.onSend()
    }
  }

  render() {
    const {
      alwaysShowSend,
      renderSend,
      placeholder,
      renderComposer,
      renderInputToolbar,
      textInputStyle,
      text,
      onInputTextChanged,
      sendButtonStyle,
      sendButtonDisabledStyle,
      maxInputLength
    } = this.props;
    const { message } = this.state
    const messageToUse = text || message
    const inputStyle = Object.assign({}, styles.inputStyle, textInputStyle)
    const buttonDisabled = !alwaysShowSend && messageToUse.trim().length === 0
    const buttonStyle = Object.assign({}, styles.sendButton, sendButtonStyle, buttonDisabled ? sendButtonDisabledStyle : {})
    const renderComposerProps = {
      key: "renderComposer",
      value: messageToUse,
      onChange: event => {
        if (text != null) {
          onInputTextChanged(event.target.value)
        } else {
          this.setState({ message: event.target.value })
        }
      },
      onKeyUp: this.onKeyUp,
      placeholder,
      maxLength: maxInputLength,
      style: inputStyle
    }
    const sendButtonProps = {
      key: "renderSend",
      style: buttonStyle,
      onClick: this.onSend,
      disabled: buttonDisabled,
      children: 'Send'
    }
    const renderInputToolbarProps = {
      style: styles.chatInput
    }
    return renderInputToolbar(
        renderInputToolbarProps,
        [
          renderSend(sendButtonProps),
          renderComposer(renderComposerProps)
        ]
      )
    
  }
}

