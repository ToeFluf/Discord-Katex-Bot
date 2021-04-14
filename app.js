const { Client, MessageAttachment } = require('discord.js');
require('dotenv').config();
const katex = require('katex');
const nodeHtmlToImage = require('node-html-to-image');
const fs = require('fs');

const client = new Client();

client.on('ready', () => {
  console.log('Bot is ready');
});

client.on('message', renderKatex);
client.on('messageUpdate', (old, msg) => {
    console.log(old.mentions);
    renderKatex(msg)
});

/*  TODO
    - Clean function from the errors
    - slash calls
    - have it work in DMs?
*/
function renderKatex(msg){
    if(msg.author.bot) {
        return
    }
    if(msg.content.startsWith("$$") && msg.content.endsWith("$$")) {
        try{
            var text = katex.renderToString(msg.content.substring(2,msg.content.length - 2), {displayMode: true, strict:false});
            fs.readFile("./katex.min.css", 'utf8', async (e, css) =>{
                if(e){
                    let text = "\`Got an error: " + e + "\'";
                    msg.reply(text);
                    console.log(text);
                    return
                }
                var buffer = await nodeHtmlToImage({html: `<!DOCTYPE html><html><head><style> ${css} </style></head><body><br> ${text} <br></body></html>`});

                // Send the attachment in the message channel with a content
                msg.channel.send(`${msg.author}, here is the result!`, new MessageAttachment(buffer, "katex.jpeg"));
                console.log("completed action with text: " + msg.content);
            });
            //msg.reply("```" + text + "```");
        }catch(e){
            let text = "\`Got an error: " + e + "\'";
            msg.reply(text);
            console.log(text);
        }
    }
}

client.login(process.env.BOT_TOKEN)
