import Discord from "discord.io";
import fs from "fs";

let token = "";
try {
  token = fs.readFileSync("./token.txt").toString();
} catch (err) {
  console.log(err);
}

let players: string[] = [];

const bot = new Discord.Client({
  token,
  autorun: true,
});

bot.on("ready", (event) => {
  console.log("Connected");
  console.log("Logged as: " + bot.username + " (" + bot.id + ")");
});

bot.on("message", (user, userId, channelId, message, event) => {
  if (message.startsWith("!")) {
    const [command, ...args] = message.substring(1).split(/[ ]+/);
    switch(command) {
      case "ping":
        bot.sendMessage({
          to: channelId,
          message: "pong!",
        });
        return;
      case 'u':
        bot.sendMessage({
          to: channelId,
          message: players[Math.floor(Math.random() * players.length + 1)]
        });
        return;
      case "start":
        shuffle(players);
        bot.sendMessage({
          to: channelId,
          message: "Orden: " + players.join(", ") + "\n!d1000000",
        });
        return;
      case "add":
        players = players.concat(args);
        bot.sendMessage({
          to: channelId,
          message: "Agregado" + (args.length > 1 ? "s " : " ") + args.join(", ") + "\nJugadores: " + players.join(", "),
        })
        return;
      case "remove":
        players = players.filter(player => !args.includes(player));
        bot.sendMessage({
          to: channelId,
          message: "Removido" + (args.length > 1 ? "s " : " ") + args.join(", ") + "\nJugadores: " + players.join(", "),
        });
        return;
      case "shutdown":
        bot.disconnect();
        return
    }
  
    if (command.match(/^ *([1-9][0-9]*)?(d|D)[0-9]+ *$/)) {
      let results: number;
      if (command.toLowerCase().startsWith("d")) {
        results = rollDices(1, parseInt(command.substring(1), 10));
      } else {
        results = rollDices(...findNumbers(command));
      }

      bot.sendMessage({
        to: channelId,
        message: results + " " + user,
      });
      return;
    }
  }
});

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