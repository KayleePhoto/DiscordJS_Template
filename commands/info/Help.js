const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    // Name of the command
    name: "help",
    // Category of the file is apart of || The folder name that the command file is in
    category: "info",
    // Sets other cmd names that run the command
    aliases: ['h'],
    // Describes the command
    description: "Tells you the commads currently able to be used",
    // Shows how to use the command, <> = required [] = optional
    usage: 'help [command name]',
    // Runs the command
    run: async (client, message, args) => {
        // Checks for args
        if(args[0]){
            // If there is an arg, It pulls info for command listed !help help
            return getCMD(client, message, args[0]);
        }else{
            // If no arg, List all commands
            return getALL(client, message);
        }
    }
}

// Creates the getAll command fuction
function getALL(client, message){
    // Creates an array for categorys to not be shown
    let excludeCategoryArr = [];
    // If member does not have the "KICK_MEMBERS" permission, push moderation folder and hide from user
    if(!message.member.hasPermission("KICK_MEMBERS")) excludeCategoryArr.push('moderation')
    // Creates embed with random color, and server icon
    const embed = new RichEmbed()
        .setColor("RANDOM")
        .setThumbnail(message.guild.iconURL)

    // Creates a var named commands, that lists all commands under its proper category
    const commands = (category) => {
        return client.commands
            // If command category matches category name and is not excluded from user view
            .filter(cmd => cmd.category === category && !excludeCategoryArr.includes(cmd.category))
            // Map commands, inside proper category, with there name |- `help`
            .map(cmd => `**|-** \`${cmd.name}\``)
            // joins with a new line
            .join("\n");
    }

    // Lists the info for the command within categories
    const info = client.categories
        // filters out excluded categories
        .filter(category => !excludeCategoryArr.includes(category))
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        // reduces into string by category
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));
}

// Creates function getCMD
function getCMD(client, message, input){
    // Creates a blank embed
    const embed = new RichEmbed()
    
    // Grabs the command name and makes it lowercase, if it doesn't work, it runs client fetching and searches for the CMD name in lowercase
    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    // Var for no existing command by that give name or aliases
    let info = `No Information found for command **${input.toLowerCase()}**`;

    // If no CMD, sends message with red color and description of the string of the Var info
    if(!cmd){
        return message.channel.send(embed.setColor("#ff0000").setDescription(info));
    }
    
    // If command category is equal to moderation, and member does not have permission "KICK_MEMBERS", send message for missing permission
    if(cmd.category === 'moderation' && !message.member.hasPermission("KICK_MEMBERS")) {
        return message.channel.send("You dont have the permissions to use these")
    }
    
    // If cmd has name, list command name
    if(cmd.name) info = `**Command Name -** ${cmd.name}`;
    // If cmd has aliases, list all avaliable aliases
    if(cmd.aliases) info += `\n**Aliases -** ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    // If cmd has description, list given description
    if(cmd.description) info += `**\nDescription -** ${cmd.description}`;
    // if cmd has category, list category
    if(cmd.category) info += `**\nCategory -** ${cmd.category}`;
    // If cmd has usage, list usage and set footer
    if(cmd.usage) {
        info += `**\nUsage -** ${cmd.usage}`
        embed.setFooter(`Syntax <> = Required, [] = Optional`);
    }

    // Sets embed thumbnail as server icon
    embed.setThumbnail(message.guild.iconURL);

    // Sends command info with color of "GREEN"
    return message.channel.send(embed.setColor("GREEN").setDescription(info));
}