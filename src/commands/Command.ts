import Discord from "discord.js";

export default abstract class Command {

  private nextCommand: Command;

  constructor(nextCommand: Command) {
    this.nextCommand = nextCommand;
  }
  
  protected abstract isMyMessage(cmd: string): boolean;
  protected abstract action(message: Discord.Message | Discord.PartialMessage): string;

  public execute(cmd: string, args: Discord.Message | Discord.PartialMessage): string {
    return this.isMyMessage(cmd) ? this.action(args) : this.next(cmd, args);
  }

  protected next(message: string, args: Discord.Message | Discord.PartialMessage): string {
    return this.nextCommand ? this.nextCommand.execute(message, args) : "No reconozco ese comando";
  }
}
