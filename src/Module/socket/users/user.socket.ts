import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { User } from "src/Module/user/entities/user.entity";
import { JwtService } from "src/utils/jwt";


interface ClientType {
    user: User,
    socket: Socket
}

@WebSocketGateway(3001, { cors: true })
export class UserSocketGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    clients: ClientType[] = [];
    constructor(private readonly jwt: JwtService) { }

    onModuleInit() {
        this.server.on("connect", (socket: Socket) => {

            /* Xóa người dùng khỏi clients nếu disconnect */
            socket.on("disconnect", () => {
                this.clients = this.clients.filter(client => client.socket.id != socket.id)
            })

            /* Xác thực người dùng */
            let token: string = String(socket.handshake.query.token);
            let user = (this.jwt.verifyToken(token) as User);
            if (token == "undefined" || !user) {
                socket.emit("connectStatus", "Xác thực người dùng thất bại!")
                socket.disconnect();
            } else {
                this.clients.push({
                    socket,
                    user
                })
            }

        })
    }
}