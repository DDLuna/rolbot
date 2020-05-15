const Discord = require('discord.io');
const logger = require('winston');
const Math = require('mathjs');
const fs = require('fs')

let token = "";
try {
    token = fs.readFileSync("token.txt").toString();
} catch (err) {
    console.log("Failed to read token file: " + err);
}

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
   token: token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        const msg = cmd.toLowerCase();
        switch(msg) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            // Just add any case commands if you want to..
            case 'fudge':
                bot.sendMessage({
                    to: channelID,
                    message: rollFudge()
                });
                break;
            case 'f':
                bot.sendMessage({
                    to: channelID,
                    message: rollFudge()
                });
            break;
            case 'fubge':
                bot.sendMessage({
                    to: channelID,
                    message: '( + + + + ) | total: 4'
                });
                break;
            default:
                if (/^d[0-9]+$/.test(msg)) {
                    bot.sendMessage({
                        to: channelID,
                        message: rollDice(parseInt(msg.substring(1)), user)
                    });
                }
         }
     }
});

const rollFudge = () => {
    let rolls = [];
    let total = 0
    for (let i = 0; i < 4; i++) {
        rolls.push(Math.floor(Math.random(-1,2)));
        total +=rolls[i];
    }
    faces = "( "
    for (let i = 0; i < 4; i++) {
        switch (rolls[i]) {
            case -1:
                faces = faces.concat('- ');
                break;
            case 0:
                faces = faces.concat('  ');
                break;
            case 1:
                faces = faces.concat('+ ');
                break;
            default:
                faces = faces.concat('? ');
                break;
        }
    }
    return faces + ') | total: ' + total;
}

const rollDice = (range, name) => {
    if (range === 0) return "No se puede rolear cero!";
    return "Roleaste un " + Math.floor(Math.random(1, range + 1)) + " " + name + " (D" + range +")";
}