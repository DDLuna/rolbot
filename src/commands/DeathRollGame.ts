import Command from "./Command"
import Discord from "discord.js"

export default class DeathRollGame extends Command {

  private players: string[];

  constructor(nextCommand: Command) {
    super(nextCommand);
    this.players = [];
  }

  protected isMyMessage(cmd: string): boolean {
    switch(cmd) {
      case "players":
      case "whostarts?":
      case "start":
      case "addme":
      case "removeme":
      case "add":
      case "remove":
        return true;
      default:
        return false;
    };
  }

  protected action(message: Discord.Message | Discord.PartialMessage): string {
    const { content, author } = message;
    const { username } = author;
    const [command, ...args] = content.split(/[ ]+/);
    
    switch(command) {
      case "players":
        return this.players.length > 0 ? "Players: " + this.players.join(", ") : 'There are no players u.u';
      case "start":
        shuffle(this.players);
        return `Orden: ${this.players.join(", ")}\nType !d1000000 to start`;
      case "addme":
        if (this.players.includes(username)) {
          return "You're already a player";
        }
        this.players.push(username);
        return "Added " + username + "\nCurrent players: " + this.players.join(", ");
      case "removeme":
        if (!this.players.includes(username)) {
          return "You're not a player, but pretend I removed you anyway";
        }
        this.players = this.players.filter(player => player !== username);
        return "Removed " + username + "\nPlayers: " + this.players.join(", ");
      case "add":
        this.players = this.players.concat(args);
        return "Added" + (args.length > 1 ? "s " : " ") + args.join(", ") + "\nPlayers: " + this.players.join(", ");
      case "remove":
        this.players = this.players.filter(player => !args.includes(player));
        return "Removed" + (args.length > 1 ? "s " : " ") + args.join(", ") + "\nPlayers: " + this.players.join(", ");
    }
  }
}

const shuffle = (a: any[]): any[] => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}