import Command from "./Command";

export default class Ping extends Command {

  protected isMyMessage(cmd: string): boolean {
    return cmd.toLowerCase() === "ping";
  }

  protected action(args: import("discord.js").Message | import("discord.js").PartialMessage): string {
    return "Pong";
  }
  
}