const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');

const nodemon = require('nodemon');
const command = require('./handlers/command');

const client = new Client();

require('./utils/functions')(client);

client.commands = new Collection();
client.aliases = new Collection();
client.config = require('./config')
client.mongoose = require('./utils/mongoose');

client.categories = fs.readdirSync('./commands/');

config({
    path: `${__dirname}/.env`
});

['command'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

fs.readdir('./events/', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        let evtName = file.split('.')[0];
        console.log(`Loaded event '${evtName}'`);
        client.on(evtName, evt.bind(null, client));
    });
});


client.mongoose.init();
client.login(process.env.TOKEN);

// DO NOT TOUCH INDEX.JS I WILL KILL YOU