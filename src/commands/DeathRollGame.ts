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
        return this.players.length > 0 ? "Jugadores: " + this.players.join(", ") : 'No hay jugadores u.u';
      case 'whostarts?':
        return this.players.length > 0 ? 'Tira ' + this.players[Math.floor(Math.random() * this.players.length)] : 'No hay jugadores u.u';
      case "start":
        shuffle(this.players);
        return `Orden: ${this.players.join(", ")}\n!d1000000`;
      case "addme":
        if (this.players.includes(username)) {
          return "Ya eres un jugador";
        }
        this.players.push(username);
        return "Agregado " + username + "\nJugadores: " + this.players.join(", ");
      case "removeme":
        if (!this.players.includes(username)) {
          return "No estas incluido entre los jugadores";
        }
        this.players = this.players.filter(player => player !== username);
        return "Removido " + username + "\nJugadores: " + this.players.join(", ");
      case "add":
        this.players = this.players.concat(args);
        return "Agregado" + (args.length > 1 ? "s " : " ") + args.join(", ") + "\nJugadores: " + this.players.join(", ");
      case "remove":
        this.players = this.players.filter(player => !args.includes(player));
        return "Removido" + (args.length > 1 ? "s " : " ") + args.join(", ") + "\nJugadores: " + this.players.join(", ");
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