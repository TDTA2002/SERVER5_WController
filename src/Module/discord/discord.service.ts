import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChannelType, Client, GatewayIntentBits, Guild, TextChannel } from 'discord.js';
import { Socket, io } from 'socket.io-client'

@Injectable()
export class DiscordService implements OnModuleInit {
    client: Client<boolean>;
    wirelessControllerShop: string =
        'MTE1Mzk4ODkyNDQ4NjcyOTc2OA.GOq1v0.XzmHJjVWJKab0z1Uy3oEzUUNkLfTkHRRfoVNUQ';
    guildId: string = '699218721603977246';
    guild: Guild


    socketServer: Socket | null = null;
    constructor() { }

    onModuleInit() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
        
        this.client.login(this.wirelessControllerShop); //login

        this.client.on('ready', async () => {
            console.log("Discord Bot Miêu Shop Assittan Connected!")

            this.createGuild()
            this.socketServer = io("http://127.0.0.1:3000?token=admin")

            this.client.on('messageCreate', (message) => {
                
                if (!message.author.bot) {
                    this.socketServer.emit("onAdminMessage", {
                        channelId: message.channelId,
                        content: message.content
                    })
                }
                //this.customerGateway.adminSendMessage(channelId, content)
            })
        });
    }

    createGuild() {
        this.guild = this.client.guilds.cache.get(this.guildId);
    }

    async createTextChannel(channelName: string) {
        return await this.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText
        })
    }

    getTextChannel(channelId: string) {
        let channel = this.guild.channels.cache.get(channelId);
        return (channel as TextChannel)
    }
}