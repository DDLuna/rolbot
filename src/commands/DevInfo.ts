import Command from "./Command"
import Discord from "discord.js"

export default class DevInfo extends Command {

  protected isMyMessage(cmd: string): boolean {
    return cmd === "info" || cmd === "dev";
  }
  protected action(message: Discord.Message | Discord.PartialMessage): string {
    return "Developed by Damian Luna 🌑, you can find the source code here: https://github.com/DDLuna/rolbot"
  }

}