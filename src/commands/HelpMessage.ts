import Command from "./Command"
import Discord from "discord.js"

export default class HelpMessage extends Command {

  private static readonly helpMessage = {
    embed: {
      color: 3447003,
      fields: [{
        name: "Comandos",
        value:
            "\n`!ping` Devuelve un Pong!" +
            "\n`!addme` Me agrega a la lista de jugadores" +
            "\n`!removeme` Me elimina de la lista de jugadores" +
            "\n`!add [name]` Agrega un jugador a la lista de jugadores" +
            "\n`!remove [name]` Elimina jugador de la lista de jugadores" +
            "\n`!players` Lista los jugadores" +
            "\n`!start` Inicia una ronda" +
            "\n`!whostarts?` Elige un jugador random para que tire" +
            "\n`!last` Rerolea con el ultimo numero"
      }],
    }
  };

  protected isMyMessage(cmd: string): boolean {
    return cmd.toLowerCase() === "help";
  }

  protected action(message: Discord.Message | Discord.PartialMessage): string {
    return HelpMessage.helpMessage.embed.fields[0].value;
  }
  
}