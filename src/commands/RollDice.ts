import Command from "./Command";
import Discord from "discord.js";

export default class RollDice extends Command {
  
  protected isMyMessage(cmd: string): boolean {
    return !!cmd.match(/^([1-9][0-9]*)?[dD][0-9]+$/);
  }

  protected action(message: Discord.Message | Discord.PartialMessage): string {
    let results: number;
    const { content, author } = message;
    if (content.startsWith("d")) {
      results = rollDices(1, parseInt(content.substring(1), 10));
    } else {
      results = rollDices(...findNumbers(content));
    }
    let skull = "";
    if (results === 1) {
      skull = " ☠"
    }
    return results.toString() + ` <@!${author.id}>${skull}`;
  }
}

const rollDices = (amount: number, sides: number): number => {
  let total = 0;
  for (let i = 0; i < amount; i++) {
    total += Math.floor(Math.random() * sides + 1);
  }
  return total;
}

const findNumbers = (message: string): [number, number] => {
  let i = 0;
  while (message[i] !== "d") {
    i++;
  }
  return [
    parseInt(message.substring(0, i), 10),
    parseInt(message.substring(i + 1, message.length), 10)
  ];
}
