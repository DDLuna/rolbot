import Command from "./Command"
import Discord from "discord.js"

export default class FudgeRoll extends Command {

  protected isMyMessage(cmd: string): boolean {
    return cmd === "fudge" || cmd === "f";
  }

  protected action(message: Discord.Message | Discord.PartialMessage): string {
    return rollFudge() + ` <@!${message.author.id}>`
  }
  
}

const rollFudge = (): string => {
  let result = "(";
  let total = 0;
  for (let i = 0; i < 4; i++) {
    const num = Math.floor(Math.random() * 3);
    switch (num) {
      case 0:
        result = result.concat(" -");
        total--;
        break;
      case 1:
        result = result.concat("  ");
        break;
      case 2:
        result = result.concat(" +");
        total++;
        break;
    }
  }
  result = result.concat(" ) | total: " + total);
  return result;
}