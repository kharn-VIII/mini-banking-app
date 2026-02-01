import { ConfigService } from "@nestjs/config";


export function getExchangeRateConfig(
    configService: ConfigService
): number {
    return Number(
        configService.getOrThrow<string>('EXCHANGE_RATE_USD_TO_EUR') || 0.92
    );
}