import React, {CSSProperties} from 'react'
import Linkify from 'react-linkify'
import initials from 'initials'
import moment from 'moment-timezone'
import { get } from 'lodash'
import { Message, User } from '.'

export interface RenderMessageProps {
  message: Message,
  children: (string | JSX.Element | false | undefined)[]
}

export interface RenderAvatarProps {
  user: User, 
  avatarSize: number, 
  renderAvatarOnTop: boolean, 
  onPressAvatar: (e) => void
}

export interface RenderMessageTextProps {
  message: Message
  textContent: string[],
  textStyle: {}
}

export interface RenderBubbleProps {
  message: Message,
  onMessageClick: (e)=>void,
  sentByMe: boolean,
  showAvatar: boolean,
  avatarSize: number,
  renderAvatarOnTop: boolean,
  onPressAvatar: (e)=>void,
  emptyAvatar: JSX.Element | null,
  children: (string | JSX.Element | false | undefined)[],
  chatbubbleStyles: {},
  chatbubbleWrapperStyles: {}
  renderAvatar: (args: RenderAvatarProps) => JSX.Element,
}

function Check() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function DoubleCheck() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 7L12 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function Clock() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 13H12V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22C16.9706 22 21 17.9706 21 13C21 8.02944 16.9706 4 12 4C7.02944 4 3 8.02944 3 13C3 17.9706 7.02944 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function generateEmptyAvatarStyle(avatarSize) {
  return {
    width: avatarSize,
    height: avatarSize
  }
}

function stringToHslColor(str, s, l) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return `hsl(${hash % 360}, ${s}%, ${l}%)`
}

const styles = {
  chatbubbleRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  avatarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  avatarWrapperTop: {
    justifyContent: 'flex-start'
  },
  chatbubbleWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  recipientChatbubbleWrapper: {
    justifyContent: 'flex-start'
  },
  chatbubble: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    maxWidth: '65%',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: '#0084FF'
  },
  recipientChatbubble: {
    backgroundColor: '#36bd33'
  },
  p: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
    margin: 0
  },
  a: {
    color: '#FFFF00'
  },
  image: {
    objectFit: 'contain',
    width: 300
  },
  systemMessageRow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  dateRow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  date: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '500',
    margin: 0
  },
  time: {
    color: '#EEEEEE',
    fontSize: 15,
    fontWeight: '300',
    margin: 0
  },
  timeSystem: {
    color: '#666666'
  },
  tick: {
    width: 15,
    height: 15
  }
}

interface ChatBubbleProps {
  message: Message,
  renderMessage: (args: RenderMessageProps)=>JSX.Element,
  renderBubble: (args: RenderBubbleProps)=>JSX.Element,
  renderMessageText: (args: RenderMessageTextProps)=>JSX.Element,
  previous,
  next,
  user: User,
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
}

export default class ChatBubble extends React.Component<ChatBubbleProps> {
  static defaultProps = {
    renderMessage: (args: RenderMessageProps) => (
      <div id={`chat_row_wrapper_${args.message._id}`}>
        {args.children}
      </div>
    ),
    renderBubble: (args: RenderBubbleProps) => (
      <div style={styles.chatbubbleRow as CSSProperties} id={`chat_row_${args.message._id}`} onClick={args.onMessageClick}>
        {!args.sentByMe && args.showAvatar ? args.renderAvatar({
          user: args.message.user, 
          avatarSize: args.avatarSize, 
          renderAvatarOnTop: args.renderAvatarOnTop, 
          onPressAvatar: args.onPressAvatar
          }) : args.emptyAvatar}
        <div style={args.chatbubbleWrapperStyles as CSSProperties}>
          <div style={args.chatbubbleStyles as CSSProperties} id={`chat_bubble_${args.message._id}`}>
            {args.children}
          </div>
          {args.sentByMe && args.showAvatar ? args.renderAvatar({
            user: args.message.user, 
            avatarSize: args.avatarSize, 
            renderAvatarOnTop: args.renderAvatarOnTop, 
            onPressAvatar: args.onPressAvatar
          }) : args.emptyAvatar}
        </div>
      </div>
    ),
    renderMessageText: (args: RenderMessageTextProps) => (
      <Linkify properties={{ style: styles.a, target: '_blank' }}>
        {args.textContent.map((text, i) => {
          const key = `bubble_${args.message._id}_para_${i}`
          if (text.length === 0) {
            return <br key={key} />
          }
          return <p key={key} style={args.textStyle}>{text}</p>
        })}
      </Linkify>
    )
  }

  renderAvatar(args: RenderAvatarProps) {
    const avatarStyle = Object.assign(
      {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
        borderRadius: args.avatarSize / 2,
        fontSize: args.avatarSize / 3,
        fontWeight: '600',
        backgroundColor: stringToHslColor(args.user.name, 50, 80),
        color: '#FFFFFF'
      },
      generateEmptyAvatarStyle(args.avatarSize)
    ) as CSSProperties
    if (args.onPressAvatar != null) {
      avatarStyle.cursor = 'pointer'
    }

    const wrapperStyle = Object.assign({}, styles.avatarWrapper, args.renderAvatarOnTop ? styles.avatarWrapperTop : {}) as CSSProperties
    return (
      <div
        id={`user_avatar_${args.user._id}`}
        style={wrapperStyle}
        onClick={() => {
          if (args.onPressAvatar != null) {
            args.onPressAvatar(args.user)
          }
        }}
      >
        {args.user.avatar != null
          ? (
          <img style={avatarStyle} src={args.user.avatar} alt={args.user.name} />
            )
          : (
          <div style={avatarStyle}>{initials(args.user.name || "")}</div>
            )}
      </div>
    )
  }

  render() {
    const {
      message,
      previous,
      next,
      user,
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
      tickStyle,
      renderMessage,
      renderBubble,
      renderMessageText,
    } = this.props
    const sentByMe = message.user._id === user._id
    const chatbubbleStyles = Object.assign({}, styles.chatbubble, sentByMe ? {} : styles.recipientChatbubble)
    const chatbubbleWrapperStyles = Object.assign({}, styles.chatbubbleWrapper, sentByMe ? {} : styles.recipientChatbubbleWrapper)
    const messageDate = moment(message.createdAt).tz(timezone)
    let displayDate = true
    if (previous != null) {
      const prevMessageDate = moment(previous.createdAt).tz(timezone)
      displayDate = !messageDate.isSame(prevMessageDate, 'day')
    }

    let showAvatar = showAvatarForEveryMessage || (showUserAvatar && sentByMe) || (showReceipientAvatar && !sentByMe)
    const emptyAvatar = showAvatar ? <div style={generateEmptyAvatarStyle(avatarSize)} /> : null
    if (showAvatar) {
      let compareWith = renderAvatarOnTop ? previous : next
      if (compareWith != null && get(compareWith, 'message.text') == null) {
        compareWith = null
      }
      showAvatar = compareWith == null || compareWith.user._id !== message.user._id
    }

    const isSystemMessage = message.system
    const textStyleToUse = Object.assign({}, styles.p, textStyle)
    const imageStyleToUse = Object.assign({}, styles.image, imageStyle)
    const timeStyleToUse = Object.assign({}, styles.time, isSystemMessage ? styles.timeSystem : { flex: 1 }, timeStyle)
    const dateStyleToUse = Object.assign({}, styles.date, dateStyle)
    const tickStyleToUse = Object.assign({}, styles.tick, tickStyle)
    const textContent = message.text.split('\n')
    const timeDisplay = <p style={timeStyleToUse}>{messageDate.format(timeFormat)}</p>
    let Status = ()=><></>
    if (message.received === true) {
      Status = DoubleCheck
    } else if (message.sent === true) {
      Status = Check
    } else if (message.pending === true) {
      Status = Clock
    }
    const onMessageClick = () => {
      if (onPressBubble != null) {
        onPressBubble(message)
      }
    }

    const renderMessageTextProps = {
      message,
      textContent,
      textStyle: textStyleToUse
    }

    const renderBubbleProps = {
      message,
      onMessageClick,
      showAvatar,
      sentByMe,
      avatarSize,
      renderAvatarOnTop,
      onPressAvatar,
      emptyAvatar,
      renderAvatar: this.renderAvatar,
      chatbubbleWrapperStyles,
      chatbubbleStyles,
      children: [
        message.image != null && <img src={message.image} style={imageStyleToUse} />,
        message.video != null && (
          <video controls>
            Your browser does not support the &lt;video&gt; tag.
            <source src={message.video} />
          </video>
        ),
        message.audio != null && (
          <audio controls>
            Your browser does not support the &lt;audio&gt; tag.
            <source src={message.audio} />
          </audio>
        ),
        renderMessageText(renderMessageTextProps),
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {timeDisplay}
          {Status != null && (
            <div style={tickStyleToUse}>
              <Status />
            </div>
          )}
        </div>
      ]
    }

    const renderMessageProps = {
      message,
      children: [
        (displayDate && (
          <div style={styles.dateRow as CSSProperties}>
            <p style={dateStyleToUse}>{messageDate.format(dateFormat)}</p>
          </div>
        )),
        (isSystemMessage && (
          <div style={styles.systemMessageRow as CSSProperties} id={`chat_system_${message._id}`}>
            {textContent.map((text, i) => {
              const key = `system_${message._id}_para_${i}`
              if (text.length === 0) {
                return <br key={key} />
              }
              return <p key={key} style={dateStyleToUse}>{text}</p>
            })}
            {timeDisplay}
          </div>
        )),
        (!isSystemMessage && (
          renderBubble(renderBubbleProps)
        ))
      ]
    }

    return (
      renderMessage(renderMessageProps)
    )
  }
}
