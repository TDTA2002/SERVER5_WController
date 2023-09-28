import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { JwtService } from 'src/utils/jwt';
import { DiscordService } from "../discord/discord.service";
import { User } from "../user/entities/user.entity";
import { CustomerService } from "./customer.service";


interface SocketClient {
    user: User,
    socket: Socket,
    textChannelDiscordId: String
}

enum ChatType {
    ADMIN = "ADMIN",
    USER = "USER"
}

@WebSocketGateway({
    cors: true
})
export class CustomerGateway implements OnModuleInit {
    socketClients: SocketClient[] = [];
    constructor(private readonly jwt: JwtService, private readonly discord: DiscordService, private readonly customerService: CustomerService) { }

    @WebSocketServer()
    server: Server

    onModuleInit() {
        this.server.on("connect", async (socket) => {
            if (String(socket.handshake.query.token) == "admin") {
                console.log("admin connected")
                return
            }
            let userDecode = this.jwt.verifyToken(String(socket.handshake.query.token))
            // this.discord.createTextChannel(String(userDecode.firstName + userDecode.lastName))
            if (!userDecode) {
                socket.emit("connectStatus", "Bạn không có quyền truy cập!")
            } else {
                let customerSerRes = await this.customerService.findChatHistory(userDecode.id);

                // Lưu lại socket để có thể sử dụng về sau
                let newSocketClient = {
                    user: userDecode,
                    socket,
                    textChannelDiscordId: customerSerRes.status ? customerSerRes.data[0].textChannelDiscordId : (await this.discord.createTextChannel(String(userDecode.firstName + " " + userDecode.lastName))).id
                }

                this.socketClients.push(newSocketClient)

                if (!customerSerRes.status) {
                    // nhắn 1 tin chào khách - save to db, send to discord channel
                    let serResChat = await this.customerService.create({
                        adminId: "ad2264aa-8240-40f4-ada3-d827c6078bb5",
                        content: "Xin chào bạn cần giúp đỡ gì",
                        textChannelDiscordId: newSocketClient.textChannelDiscordId,
                        time: String(Date.now()),
                        type: ChatType.ADMIN,
                        userId: newSocketClient.user.id
                    })

                    let channel = this.discord.getTextChannel(newSocketClient.textChannelDiscordId);
                    channel.send(`Admin: ${serResChat.data.content}`)

                    let customerSerRes2 = await this.customerService.findChatHistory(userDecode.id);

                    socket.emit("historyMessage", customerSerRes2.data)
                } else {
                    socket.emit("historyMessage", customerSerRes.data)
                }


                // trả về cho người dùng
                socket.emit("connectStatus", `Chào mừng ${String(userDecode.firstName + " " + userDecode.lastName)} đã kết nối!`)
            }
            // console.log(`Client có socket id là: ${socket.id} vừa kết nối!`)

        })
    }

    @SubscribeMessage('onMessage')
    async onMessage(@MessageBody() body: any) {
        let socketClient = this.socketClients.find(client => client.socket.id == body.socketId)
        let newChatRecourd = {
            adminId: "",
            content: body.content,
            textChannelDiscordId: String(socketClient.textChannelDiscordId),
            time: String(Date.now()),
            type: ChatType.USER,
            userId: body.userId
        }

        await this.customerService.create(newChatRecourd);
        let chatHistory = await this.customerService.findChatHistory(newChatRecourd.userId);
        this.discord.getTextChannel(String(socketClient.textChannelDiscordId)).send(`${socketClient.user.firstName + "" + socketClient.user.lastName}:  ${newChatRecourd.content}`)
        socketClient.socket.emit("historyMessage", chatHistory.data)
    }

    @SubscribeMessage('onAdminMessage')
    async adminSendMessage(@MessageBody() body: any) {
        let socketClient = this.socketClients.find(client => client.textChannelDiscordId == body.channelId)
        let newChatRecourd = {
            adminId: "",
            content: body.content,
            textChannelDiscordId: String(socketClient.textChannelDiscordId),
            time: String(Date.now()),
            type: ChatType.ADMIN,
            userId: socketClient.user.id
        }

        await this.customerService.create(newChatRecourd);
        let chatHistory = await this.customerService.findChatHistory(newChatRecourd.userId);
        console.log("đã vào!", chatHistory.data.length)
        console.log('socketClient', socketClient)
        socketClient.socket.emit("historyMessage", chatHistory.data)
    }

}