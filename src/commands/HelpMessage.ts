import Command from "./Command"
import Discord from "discord.js"

export default class HelpMessage extends Command {

  private static readonly helpMessage = {
    embed: {
      color: 3447003,
      fields: [{
        name: "Comandos",
        value:
            "\n`!addme` Adds caller to players" +
            "\n`!removeme` Removes caller from players" +
            "\n`!add [<name>...]` Adds players to player's list" +
            "\n`!remove [<name>...]` Removes players from player's list" +
            "\n`!players` List current players" +
            "\n`!start` Starts a round of Death Roll",
      }],
    }
  };

  protected isMyMessage(cmd: string): boolean {
    return cmd === "help";
  }

  protected action(message: Discord.Message | Discord.PartialMessage): string {
    return HelpMessage.helpMessage.embed.fields[0].value;
  }
  
}