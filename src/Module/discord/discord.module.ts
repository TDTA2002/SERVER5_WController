import { Global, Module } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Global() // Đặt phạm vi là global
@Module({
    imports: [],
    controllers: [],
    providers: [DiscordService],
    exports: [DiscordService]
})
export class DiscordModule {}
