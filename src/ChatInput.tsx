import  React from 'react'

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

export interface RenderSendProps {
  key: string,
  style: {},
  onClick: (e)=>void,
  disabled: boolean,
  children: string | JSX.Element | JSX.Element[]
}

export interface RenderInputToolbarProps {
  style: {},
  children: JSX.Element[] | JSX.Element | string
}

export interface RenderComposerProps {
  key: string,
  value: string,
  style: {},
  placeholder: string,
  maxLength: number,
  onChange: (e) => void,
  onKeyUp: (e)=>void
}

interface ChatInputProps {
  renderSend: (args: RenderSendProps)=> JSX.Element,
  placeholder: string,
  renderComposer: (args: RenderComposerProps) => JSX.Element,
  renderInputToolbar: (args: RenderInputToolbarProps) => JSX.Element
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
    renderComposer: (args: RenderComposerProps) => <textarea key={args.key} value={args.value} maxLength={args.maxLength} onChange={args.onChange} onKeyUp={args.onKeyUp} placeholder={args.placeholder} style={args.style} />,
    renderSend: (args: RenderSendProps) => <button id="chat_input_send_button" type="submit" key={args.key} style={args.style} onClick={args.onClick} disabled={args.disabled}>{args.children}</button>,
    renderInputToolbar: (args: RenderInputToolbarProps) => <div className="chat-input" style={args.style}>{args.children}</div>
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

    const renderComposerProps: RenderComposerProps = {
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
    const sendButtonProps: RenderSendProps = {
      key: "renderSend",
      style: buttonStyle,
      onClick: this.onSend,
      disabled: buttonDisabled,
      children: 'Send'
    }
    const renderInputToolbarProps: RenderInputToolbarProps = {
      style: styles.chatInput,
      children: [
        renderComposer(renderComposerProps),
        renderSend(sendButtonProps)
      ]
    }
    return renderInputToolbar(
        renderInputToolbarProps,
      )
    
  }
}

