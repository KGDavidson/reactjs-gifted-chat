import * as React from 'react'
import ChatBubble from './ChatBubble'
import ChatInput from './ChatInput'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment-timezone'
import './loader.css'

const styles = {
  chatPanel: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  chatHistory: {
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  typingWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
}

// React component to render a complete chat feed
export default class GiftedChat extends React.Component {
  static defaultProps = {
    inverted: true,
    hasInputField: true,
    loadEarlier: false,
    isLoadingEarlier: false,
    isTyping: false,
    alwaysShowSend: false,
    sendButtonText: 'SEND',
    textInputStyle: {},
    placeholder: 'Enter your message',
    renderAvatarOnTop: false,
    showAvatarForEveryMessage: false,
    showUserAvatar: false,
    showReceipientAvatar: true,
    avatarSize: 50,
    messageIdGenerator: uuidv4,
    timezone: moment.tz.guess(),
    timeFormat: 'LT',
    dateFormat: 'll',
    textStyle: {},
    imageStyle: {},
    timeStyle: {},
    dateStyle: {}
  }

  constructor(props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages.length === 0 && this.props.messages.length > 0) {
      this.scrollToBottom()
    }
  }

  scrollToBottom() {
    const scrollHeight = this.chat.scrollHeight
    const height = this.chat.clientHeight
    const maxScrollTop = scrollHeight - height
    this.chat.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }

  renderMessages(messages) {
    const {
      user,
      inverted,
      renderAvatarOnTop,
      showAvatarForEveryMessage,
      showUserAvatar,
      showReceipientAvatar,
      avatarSize,
      onPressAvatar,
      timezone,
      timeFormat,
      dateFormat,
      textStyle,
      imageStyle,
      timeStyle,
      dateStyle
    } = this.props

    const messageNodes = []
    const lastMessageIndex = messages.length - 1
    for (let actualIndex = 0; actualIndex < messages.length; actualIndex++) {
      let message, prev, next
      if (inverted) {
        const index = lastMessageIndex - actualIndex
        message = messages[index]
        next = index > 0 ? messages[index - 1] : null
        prev = index < lastMessageIndex ? messages[index + 1] : null
      } else {
        message = messages[actualIndex]
        prev = actualIndex > 0 ? messages[actualIndex - 1] : null
        next = actualIndex < lastMessageIndex ? messages[actualIndex + 1] : null
      }

      messageNodes.push(
        <ChatBubble
          key={`message_${message._id}`}
          message={message}
          previous={prev}
          next={next}
          user={user}
          renderAvatarOnTop={renderAvatarOnTop}
          showAvatarForEveryMessage={showAvatarForEveryMessage}
          showUserAvatar={showUserAvatar}
          showReceipientAvatar={showReceipientAvatar}
          avatarSize={avatarSize}
          onPressAvatar={onPressAvatar}
          timezone={timezone}
          timeFormat={timeFormat}
          dateFormat={dateFormat}
          textStyle={textStyle}
          imageStyle={imageStyle}
          timeStyle={timeStyle}
          dateStyle={dateStyle}
        />
      )
    }
    return messageNodes
  }

  handleScroll(event) {
    if (event.target.scrollTop === 0) {
      const { loadEarlier, onLoadEarlier } = this.props
      if (loadEarlier) {
        onLoadEarlier()
      }
    }
  }

  renderInputField() {
    const {
      hasInputField,
      onSend,
      user,
      alwaysShowSend,
      sendButtonText,
      placeholder,
      text,
      onInputTextChanged,
      textInputStyle,
      messageIdGenerator
    } = this.props

    return hasInputField ? (
      <ChatInput
        onSend={newText => {
          const message = {
            _id: messageIdGenerator(),
            text: newText,
            user,
            createdAt: new Date()
          }
          onSend(message)
        }}
        alwaysShowSend={alwaysShowSend}
        sendButtonText={sendButtonText}
        placeholder={placeholder}
        textInputStyle={textInputStyle}
        text={text}
        onInputTextChanged={onInputTextChanged}
      />
    ) : null
  }

  renderTyping() {
    return (
      <div style={styles.typingWrapper}>
        <div id="wave">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    )
  }

  render() {
    const { isTyping, isLoadingEarlier, messages, maxHeight } = this.props
    const chatHistoryStyle = Object.assign(styles.chatHistory, { maxHeight })
    return (
      <div id="chat-panel" style={styles.chatPanel} onScroll={this.handleScroll}>
        <div
          ref={c => {
            this.chat = c
          }}
          className="chat-history"
          style={chatHistoryStyle}
        >
          {isLoadingEarlier && (
            <div className="loader-container">
              <div className="loader" />
            </div>
          )}
          <div className="chat-messages">{this.renderMessages(messages)}</div>
          {isTyping && this.renderTyping()}
        </div>
        {this.renderInputField()}
      </div>
    )
  }
}
