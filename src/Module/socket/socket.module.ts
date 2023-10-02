import { Module } from "@nestjs/common";
import { DiscordBotSocket } from "./discord.bot.socket";
import { CustomerChatSocket } from "./customer.chat.socket";
import { CustomerChatService } from "./customers/customer.chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerChats } from "./customers/entities/customer.chat.entity";
// import { PurchaseSocket } from "./customers/purchase.socket";
// import { Receipt } from "../receipts/entities/receipt.entity";
// import { ReceiptDetail } from "../receipt-detail/entities/receipt-detail.entity";
import { JwtService } from '../jwt/jwt.service';
import { UserSocketGateway } from "./users/user.socket";
import { Receipt } from "../receipts/entities/receipt.entity";
import { ReceiptDetail } from "../receipts/entities/receipt-detail.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([CustomerChats, Receipt, ReceiptDetail])
    ],
    providers: [DiscordBotSocket, CustomerChatSocket, CustomerChatService, JwtService, UserSocketGateway]

})
export class SocketModule { }