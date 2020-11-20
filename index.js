// Pulls required info for fuctions
const { Client, Collection, RichEmbed } = require("discord.js");
const { config } = require("dotenv");

const fs = require("fs");

// Creates the User client and disables @everyone ability
const client = new Client({
    disableEveryone: true
});

// Creates arrays (collections) for the name and aliases
client.commands = new Collection();
client.aliases = new Collection();

// Creates categories
client.categories = fs.readdirSync("./commands/");

// The file for hidden tokens and secrets. Allows you so access them here
config({
    path: __dirname + "/.env"
});

// Command handler
// Searchs the commands folder, and lists out the commands.
// This is useful for the pre-made help command, and sending the list of commands in console
["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

// Checks for when the bot is online and ready
client.on("ready", () => {
    // Sends a message in console when its online.
    console.log("Sends a message when the bot turns on.");
    
    // Sets User status for the bot
    client.user.setPresence({
        // The status of the bot. Online, Idle, DND, invis
        status: "online",
        // Sets the game activity
        game: {
            // The name of the activity
            name: "NAME",
            // The type of activity. PLAYING, STREAMING, WATCHING, LISTENING
            type: "TYPE",
            // URL if you want to put a twitch link for STREAMING
            // Otherwise remove this
            url: "URL IF NEEDED"
        }
    });
});

// Checks for messages while the bot is online
client.on("message", async message => {
    // Set Prefix for the bot (!) !help Prefix + command_name
    const prefix = "PREFIX";
    
    // Checks if the message author is a Bot User
    if (message.author.bot) return;
    // Checks if message was sent in a server or DM
    if (!message.guild) return;
    
    // Checks if message starts with prefix (!) !help Prefix + command_name
    if (!message.content.startsWith(prefix)) return;
    // Checks if no message member, set message.member to the member it fetchs from the server list
    if (!message.member) message.member = await message.guild.fetchMember(message);

    // Slices prefix (!) off the message, then trims and splits at " " to create args prefix + command_name + arg 1 + arg 2 + ....
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    // Sets the command name seprate from args
    const cmd = args.shift().toLowerCase();
    
    // Checks for command Length !help = cmd.length > 0 | ! = cmd.length < 0
    if (cmd.length === 0) return;
    
    // creates VAR for command.get to fetch the command file
    let command = client.commands.get(cmd);
    // If not a command name, search for command with that alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    
    // If a command, runs command with presecs of client, message, and args
    if (command) 
        command.run(client, message, args);
});

// Logs the bot in
client.login(process.env.TOKEN);