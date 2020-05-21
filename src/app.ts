import Discord from "discord.js"
import config from "../config.json"
import RollDice from "./commands/RollDice"
import HelpMessage from "./commands/HelpMessage"
import DeathRollGame from "./commands/DeathRollGame"
import FudgeRoll from "./commands/FudgeRoll"
import TicTacToe from "./commands/TicTacToe";

const { token, prefix } = config;
const bot = new Discord.Client();

const commands = [new HelpMessage(), new TicTacToe(),  new FudgeRoll(), new DeathRollGame(), new RollDice()];

for (let i = 1; i < commands.length ; i++) {
  commands[i].setNextCommand(commands[i-1]);
}

const chain = commands[commands.length - 1];

bot.on("message", (message) => {
  const { content, channel } = message

  if (!content.startsWith(prefix)) {
    return;
  }
  message.content = message.content.substring(prefix.length).toLowerCase();
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