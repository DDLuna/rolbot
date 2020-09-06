import Discord from "discord.js"
import config from "../config.json"
import RollDice from "./commands/RollDice"
import HelpMessage from "./commands/HelpMessage"
import DeathRollGame from "./commands/DeathRollGame"
import FudgeRoll from "./commands/FudgeRoll"
import DevInfo from "./commands/DevInfo"

const { token, prefix } = config;
const bot = new Discord.Client();

const chain = new RollDice(new DeathRollGame(new FudgeRoll(new HelpMessage(new DevInfo(null)))));

bot.on("message", (message) => {
  const { content, channel } = message;
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