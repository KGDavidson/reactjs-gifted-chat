import React, {Component, CSSProperties, createRef} from 'react'
import ChatBubble from './ChatBubble'
import ChatInput, { RenderComposerProps, RenderInputToolbarProps, RenderSendProps } from './ChatInput'
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

export interface User {
  _id: string | number
  name?: string
  avatar?: string | number | ((e: any) => JSX.Element)
}

export interface Message {
  _id: string | number
  text: string
  createdAt: Date | number
  user: User
  image?: string
  video?: string
  audio?: string
  system?: boolean
  sent?: boolean
  received?: boolean
  pending?: boolean
}

interface GiftedChatProps {
  user: {
    _id: string | number,
    name: string
  },
  loadEarlier: boolean,
  onLoadEarlier: ()=>void;
  inverted: boolean,
  renderAvatarOnTop: boolean,
  showAvatarForEveryMessage: boolean,
  showUserAvatar: boolean,
  showReceipientAvatar: boolean,
  avatarSize: number,
  onPressAvatar: null | ((e)=>void),
  onPressBubble: null | ((e)=>void),
  timezone,
  timeFormat: string,
  dateFormat: string,
  textStyle: {},
  imageStyle: {},
  timeStyle: {},
  dateStyle: {},
  tickStyle: {},
  hasInputField: boolean,
  onSend: (message)=>void,
  alwaysShowSend: boolean,
  renderSend: (args: RenderSendProps)=> JSX.Element,
  placeholder: string,
  text: string,
  onInputTextChanged: (e)=>void,
  renderComposer: (args: RenderComposerProps)=> JSX.Element,
  renderInputToolbar: (args: RenderInputToolbarProps)=>JSX.Element,
  textInputStyle: {},
  sendButtonStyle: {},
  sendButtonDisabledStyle: {},
  maxInputLength: number,
  messageIdGenerator: (message?) => string,
  isTyping: boolean, 
  isLoadingEarlier: boolean,
  messages: Message[], 
  maxHeight: number,
  renderAccessory: ()=> JSX.Element,
  renderChatEmpty: ()=> JSX.Element
}

// React component to render a complete chat feed
export default class GiftedChat extends Component<GiftedChatProps> {
  static defaultProps = {
    inverted: true,
    hasInputField: true,
    loadEarlier: false,
    isLoadingEarlier: false,
    isTyping: false,
    alwaysShowSend: false,
    textInputStyle: {},
    placeholder: 'Enter your message',
    renderAvatarOnTop: false,
    showAvatarForEveryMessage: false,
    showUserAvatar: false,
    onPressAvatar: null,
    onPressBubble: null,
    showReceipientAvatar: true,
    avatarSize: 50,
    messageIdGenerator: uuidv4,
    timezone: moment.tz.guess(),
    timeFormat: 'LT',
    dateFormat: 'll',
    textStyle: {},
    imageStyle: {},
    timeStyle: {},
    dateStyle: {},
    tickStyle: {},
    sendButtonStyle: {},
    sendButtonDisabledStyle: {},
    renderChatEmpty: null
  }

  private chat: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
    this.chat = createRef();
  }

  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate(prevProps) {
    if (this.lastMessageId(prevProps) !== this.lastMessageId(this.props)) {
      this.scrollToBottom()
    }
  }

  lastMessageId(props) {
    const { inverted, messages } = props
    const messagesCount = messages.length
    return messagesCount === 0 ? null : (inverted ? messages[0] : messages[messagesCount - 1])._id
  }

  scrollToBottom() {
    if (!this.chat.current) return;
    const scrollHeight = this.chat.current.scrollHeight
    const height = this.chat.current.clientHeight
    const maxScrollTop = scrollHeight - height
    this.chat.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }

  renderMessages(messages: any[]) {
    const {
      user,
      inverted,
      renderAvatarOnTop,
      showAvatarForEveryMessage,
      showUserAvatar,
      showReceipientAvatar,
      avatarSize,
      onPressAvatar,
      onPressBubble,
      timezone,
      timeFormat,
      dateFormat,
      textStyle,
      imageStyle,
      timeStyle,
      dateStyle,
      tickStyle
    } = this.props

    const messageNodes: JSX.Element[] = []
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
          onPressBubble={onPressBubble}
          timezone={timezone}
          timeFormat={timeFormat}
          dateFormat={dateFormat}
          textStyle={textStyle}
          imageStyle={imageStyle}
          timeStyle={timeStyle}
          dateStyle={dateStyle}
          tickStyle={tickStyle}
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
      renderSend,
      placeholder,
      text,
      onInputTextChanged,
      renderComposer,
      renderInputToolbar,
      textInputStyle,
      sendButtonStyle,
      sendButtonDisabledStyle,
      maxInputLength,
      messageIdGenerator
    } = this.props

    return hasInputField
      ? (
      <ChatInput
        onSend={(newText) => {
          const message = {
            _id: messageIdGenerator(),
            text: newText,
            user,
            createdAt: new Date()
          }
          onSend(message)
        }}
        alwaysShowSend={alwaysShowSend}
        renderSend={renderSend}
        placeholder={placeholder}
        renderComposer={renderComposer}
        renderInputToolbar={renderInputToolbar}
        textInputStyle={textInputStyle}
        text={text}
        onInputTextChanged={onInputTextChanged}
        sendButtonStyle={sendButtonStyle}
        sendButtonDisabledStyle={sendButtonDisabledStyle}
        maxInputLength={maxInputLength}
      />
        )
      : null
  }

  renderTyping() {
    return (
      <div style={styles.typingWrapper as CSSProperties}>
        <div id="wave">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    )
  }

  render() {
    const { isTyping, isLoadingEarlier, messages, maxHeight, renderAccessory, renderChatEmpty } = this.props
    const chatHistoryStyle = Object.assign({ maxHeight }, styles.chatHistory)
    return (
      <div id="chat-panel" style={styles.chatPanel as CSSProperties} onScroll={this.handleScroll}>
        <div
          ref={this.chat}
          className="chat-history"
          style={chatHistoryStyle as CSSProperties}
        >
          {isLoadingEarlier && (
            <div className="loader-container">
              <div className="loader" />
            </div>
          )}
          <div className="chat-messages">{this.renderMessages(messages)}</div>
          {messages.length === 0 && renderChatEmpty && renderChatEmpty()}
          {isTyping && this.renderTyping()}
        </div>
        {renderAccessory != null ? renderAccessory() : null}
        {this.renderInputField()}
      </div>
    )
  }
}


