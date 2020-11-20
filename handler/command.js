const { readdirSync } = require("fs");

const ascii = require("ascii-table");

// Creates a table in console for load status
// NO THIS DOES NOT FULLY WORK, IT LOOKS FOR IF CODE IS IN THE FILE, THIS DOES NOT MEAN IT WILL RUN CORRECTLY OR EVEN WORK
const table = new ascii().setHeading("Command", "Load Status");

module.exports = (client) => {
    // Search the command folder DIR for every command file
    readdirSync("./commands/").forEach(dir => {
        // Sets VAR for every file ending with ".js"
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js'));

        // For each file, in commands var
        for(let file of commands){
            // Pulls file from the DIR
            let pull = require(`../commands/${dir}/${file}`);

            // If pull has a name
            if(pull.name){
                // Set name and pull status
                client.commands.set(pull.name, pull);
                // if code, mark as working
                table.addRow(file, "✅");
            }else{
                // If command doesnt work, mark as not working then continue 
                table.addRow(file, "❌ --> This command isn't working...")
                continue;
            }

            // If has aliases, pull array for aliases
            if(pull.aliases && Array.isArray(pull.aliases))
                // For each alias, set aliases to pull name
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });

    // Log table as a string
    console.log(table.toString());
}