import Discord from "discord.js"
import config from "../config.json"
import RollDice from "./commands/RollDice"
import HelpMessage from "./commands/HelpMessage"
import DeathRollGame from "./commands/DeathRollGame"
import FudgeRoll from "./commands/FudgeRoll"

const { token, prefix } = config;
const bot = new Discord.Client();

const silvaResponse = () => {
  let responses = [
    'Que grande este Silva',
    'Uh! Que pelotudes dijo Silva ahora?',
    'Que boludo este Silva por Dios!',
    'Ahí lo tenes al pelotudo'
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

const chain = new RollDice(new DeathRollGame(new FudgeRoll(new HelpMessage(null))));

bot.on("message", (message) => {
  const { content, author, channel } = message

  if (content.match(/silv(?:a|ita)/i) && author.username !== bot.user.username) {
    channel.send(silvaResponse());
    return;
  }

  if (!content.startsWith(prefix)) {
    return;
  }
  console.log(message.content);
  message.content = message.content.substring(prefix.length);
  console.log(message.content);
  const args = content.substring(1).split(/[ ]+/);
  const command = args[0];
  if (command === "shutdown") {
    channel.send("Goodbye").finally(() => bot.destroy());
    return;
  }
  channel.send(chain.execute(command, message));
});

bot.on("ready", () => {
  console.log(`Connected as ${bot.user.tag}`);
});

bot.login(token);