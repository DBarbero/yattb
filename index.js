import Botgram from 'botgram'
import dotenv from 'dotenv'

import Todo from './classes/todo/todo'
import { keyboard, helpText } from './consts'

dotenv.load()

const { TELEGRAM_BOT_TOKEN, ADMIN_ID } = process.env

if (!TELEGRAM_BOT_TOKEN) {
  console.error('Error 404: Telegram Bot Token Not Found');
  process.exit(1);
}

const bot = new Botgram(TELEGRAM_BOT_TOKEN)

/* Bot state */
bot.context({ todoList: new Todo(), chats: {} })

bot.all((msg, reply, next) => {
  const chatId = msg.chat.id
  if (msg.from.id === parseInt(ADMIN_ID))
    msg.hasPrivileges = true
  if (msg.context.chats[chatId.toString()] === undefined) {
    msg.context.chats = {...msg.context.chats, [chatId.toString()]: { todoList: new Todo() }}
    console.log(`new chat todo list created for ${msg.chat.id}`);
  }
  next()
})

bot.command('start', (msg, reply, next) => {
  console.log(`New chat started ${JSON.stringify(msg.chat)}`);
  console.log(`Received a /start command from ${JSON.stringify(msg.from)}`)
  reply.text(`Welcome, I'm yet another telegram todo bot \u{1F604}\n I'm here to help you complete your tasks \u{270c}`)
  reply.text(helpText)
})

bot.command('help', (msg, reply, next) => {
  reply.keyboard(keyboard, true).text(helpText)
})

bot.command('list', (msg, reply, next) => {
  const { todoList } = getTodoList(msg)
  reply.text(`______TO DO LIST_____\n ${todoList.showTodos()}`)
})

bot.command('add', (msg, reply, next) => {
  const { todoList } = getTodoList(msg)
  console.log(`Received a /add command from ${msg.from.username}:${msg.from.id}`);
  let todoText = msg.args()
  console.log(`Todo text: ${todoText}`);
  if (todoText.length > 0) {
    todoList.addTodo(todoText)
    console.log(todoList.showTodos());
  }
  reply.text(`______TO DO LIST_____\n ${todoList.showTodos()}`)
})

bot.command('del', (msg, reply, next) => {
  const { todoList } = getTodoList(msg)
  let index = msg.args()
  if (index.length)
    todoList.deleteByIndex(index)
  reply.text(`______TO DO LIST_____\n ${todoList.showTodos()}`)
})

/* Admin mode */
bot.command('quit_bot', (msg, reply, next) => {
  if (msg.hasPrivileges)
    reply.text('Shutting down the bot...')
    process.exit(1)
})

bot.command('pwd', (msg, reply, next) => {
  if (msg.hasPrivileges)
  reply.text(`Bot is running from ${require('path').resolve(__dirname)}`)
})

bot.text((msg, reply, next) => { reply.text(`\u{1F614} Sorry, I'm a simple AI. I'm not programmed to answer that...`) })

bot.command((msg, reply) => reply.text("Invalid command."))

/* Helper */
const getTodoList = (msg) => {
  const { id } = msg.chat
  return msg.context.chats[id.toString()]
}
