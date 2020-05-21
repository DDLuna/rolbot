import Command from "./Command";
import Discord from "discord.js";

export default class TicTacToe extends Command {

  private table: string[][] ;

  constructor(command: Command = null) {
    super(command);
    this.table = [[' ', ' ', ' '],[' ', ' ', ' '],[' ', ' ', ' ']];
  }

  protected isMyMessage(cmd: string): boolean {
    return !!cmd.match( /^[oOxX]/) || cmd === 'tictactoe';
  }

  protected action(message: Discord.Message | Discord.PartialMessage): string {
    const {content, author } = message;

    if (content.split(/[ ]/)[0] == 'tictactoe') {
      this.table = [[' ', ' ', ' '],[' ', ' ', ' '],[' ', ' ', ' ']];
    } else if (content.match(/^[oOxX] [1-3][1-3] */)) {
      const [letter, position] = content.split(/[ ]/);

      const x = parseInt(position.substring(0, 1), 10) - 1;
      const y = parseInt(position.substring(1), 10) - 1;

      if (this.table[x][y] === ' ') {
        this.table[x][y] = letter.toUpperCase();
      }
    }

    let rows: string[] = [];

    for (let row of this.table) {
      let string = row.join('|');
      rows.push(`\``+ string + `\``);
    }

    let result = rows.join('\n');

    return `<@!${author.id}>\n` + result;
  }

}