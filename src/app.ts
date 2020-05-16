import Discord from "discord.js";
import fs from "fs";

let token = "";
try {
  token = fs.readFileSync("./token.txt").toString();
} catch (err) {
  console.log(err);
}

let players: string[] = [];
let last: string;
const bot = new Discord.Client();

bot.on("message", (message) => {
  const { content, author, channel } = message
  const { username }  = author;

  if (content.match(/^[0-9]+ [a-z]+$/i)){
    last = content.split(' ')[0];
    last = last !== '1' ? last : null;
    return;
  }

  if (content.match(/silv(?:a|ita)/i) && author.username !== bot.user.username) {
    channel.send(silvaResponse());
    return;
  }

  if (!content.startsWith("!")) {
    return;
  }

    const [command, ...args] = content.substring(1).split(/[ ]+/);

    switch(command) {
      case "ping":
        channel.send("pong!");
        return;
      case 'ps':
        channel.send(players.length > 0 ? "Jugadores: " + players.join(", ") : 'No hay jugadores u.u');
        return;
      case 'rp':
        channel.send(players.length > 0 ? 'Tira ' + players[Math.floor(Math.random() * players.length)] : 'No hay jugadores u.u');
        return;
      case 'ls':
        if (last) {
          let rol = rollDices(1, parseInt(last, 10));
          channel.send(rol + " " + message.author.username);
        }
        return;
      case "start":
        shuffle(players);
        channel.send("Orden: " + players.join(", ") + "\n!d1000000");
        return;
      case "addme":
        if (players.includes(username)) {
          channel.send("Ya eres un jugador");
        } else {
          players = players.concat(username);
          channel.send("Agregado " + username + "\nJugadores: " + players.join(", "));
        }
        return;
      case "removeme":
        if (!players.includes(username)) {
          channel.send("No estas incluido entre los jugadores");
        } else {
          players = players.filter(player => player !== username);
          channel.send("Removido " + username + "\nJugadores: " + players.join(", "));
        }
        return;
      case "add":
        players = players.concat(args);
        channel.send("Agregado" + (args.length > 1 ? "s " : " ") + args.join(", ") + "\nJugadores: " + players.join(", "));
        return;
      case "remove":
        players = players.filter(player => !args.includes(player));
        channel.send("Removido" + (args.length > 1 ? "s " : " ") + args.join(", ") + "\nJugadores: " + players.join(", "));
        return;
      case "f":
      case "fudge":
        channel.send(rollFudge() + " " + username)
        return;
      case "shutdown":
        shutdown(channel);
        return;
    }

    if (command.match(/^([1-9][0-9]*)?[dD][0-9]+$/)) {
      let results: number;
      if (command.toLowerCase().startsWith("d")) {
        results = rollDices(1, parseInt(command.substring(1), 10));
      } else {
        results = rollDices(...findNumbers(command));
      }
      channel.send(results + " " + username);
      return;
  }
});

const silvaResponse = () => {
  let responses = [
      'Que grande este Silva',
      'Uh! Que pelotudes dijo Silva ahora?',
      'Que boludo este Sila por Dios!',
      'Ay lo tenes al pelotudo'
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

async function shutdown(channel: Discord.TextChannel | Discord.DMChannel): Promise<void> {
  await channel.send("Goodbye");
  bot.destroy();
}

const rollDices = (amount: number, sides: number): number => {
  let total = 0;
  for (let i = 0; i < amount; i++) {
    total += Math.floor(Math.random() * sides + 1);
  }
  return total;
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

const findNumbers = (message: string): [number, number] => {
  let i = 0;
  while (message[i].toLowerCase() !== 'd') {
    i++;
  }
  return [
    parseInt(message.substring(0, i), 10),
    parseInt(message.substring(i + 1, message.length), 10)
  ];
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

bot.on("ready", () => {
  console.log("Connected");
});

bot.login(token);