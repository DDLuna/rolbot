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
  let content = message.content;
  let user = message.author.username;

  if (content.match(/^[0-9]+ [a-z]+$/i)){
    last = content.split(' ')[0];
    last = last !== '1' ? last : null;
    return;
  }

  if (content.startsWith("!")) {
    const [command, ...args] = content.substring(1).trim().split(/[ ]+/);

    switch(command) {
      case "ping":
        message.channel.send("pong!");
        return;
      case 'ps':
        message.channel.send(players.length > 0 ? "Jugadores: " + players.join(", ") : 'No hay jugadores u.u');
        return;
      case 'rp':
        message.channel.send(players.length > 0 ? 'Tira ' + players[Math.floor(Math.random() * players.length)] : 'No hay jugadores u.u');
        return;
      case 'ls':
        if (last) {
          let rol = rollDices(1, parseInt(last, 10));
          message.channel.send(rol + " " + message.author.username);
        }
        return;
      case "start":
        shuffle(players);
        message.channel.send("Orden: " + players.join(", ") + "\n!d1000000");
        return;
      case "addme":
        if (players.includes(user)) {
          message.channel.send("Ya eres un jugador");
        } else {
          players = players.concat(user);
          message.channel.send("Agregado " + user + "\nJugadores: " + players.join(", "));
        }
        return;
      case "removeme":
        if (!players.includes(user)) {
          message.channel.send("No estas incluido entre los jugadores");
        } else {
          players = players.filter(player => player !== user);
          message.channel.send("Removido " + user + "\nJugadores: " + players.join(", "));
        }
        return;
      case "add":
        players = players.concat(args);
        message.channel.send("Agregado" + (args.length > 1 ? "s " : " ") + args.join(", ") + "\nJugadores: " + players.join(", "));
        return;
      case "remove":
        players = players.filter(player => !args.includes(player));
        message.channel.send("Removido" + (args.length > 1 ? "s " : " ") + args.join(", ") + "\nJugadores: " + players.join(", "));
        return;
      case "f":
      case "fudge":
        message.channel.send(rollFudge() + " " + message.author.username)
        return;
      case "shutdown":
        shutdown(message.channel);
        return;
    }

    if (command.match(/^([1-9][0-9]*)?[dD][0-9]+ *$/)) {
      let results: number;
      if (command.toLowerCase().startsWith("d")) {
        results = rollDices(1, parseInt(command.substring(1), 10));
      } else {
        results = rollDices(...findNumbers(command));
      }
      message.channel.send(results + " " + message.author.username);
      return;
    }
  }

  if (content.match(/silv(?:a|ita)/i) && user !== bot.user.username) {
    message.channel.send(silvaResponse());
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