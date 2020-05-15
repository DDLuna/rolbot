import Discord from "discord.io";
import fs from "fs";

let token = "";
try {
  token = fs.readFileSync("./token.txt").toString();
} catch (err) {
  console.log(err);
}

const users = ["Dani", "Fede", "Brian", "Damo"];

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
    message = message.substring(1);
    switch(message) {
      case "ping":
        bot.sendMessage({
          to: channelId,
          message: "pong!",
        });
        return;
      case 'u':
        let i = Math.floor(Math.random() * 4 + 1);
        bot.sendMessage({
          to: channelId,
          message: users[i]
        });
        return;
      case "start":
        shuffle(users);
        bot.sendMessage({
          to: channelId,
          message: "Orden: " + users.join(",") + "\n!d1000000",
        });
        return;
    }
  
    if (message.match(/^ *([1-9][0-9]*)?(d|D)[0-9]+ *$/)) {
      message = message.trim();
      let results: number;
      if (message.toLowerCase().startsWith("d")) {
        results = rollDices(1, parseInt(message.substring(1), 10));
      } else {
        results = 0;
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