export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI ?? '',
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL ?? '',
});

export interface IConfig {
  port: number;
  mongoUri: string;
  discordWebhookUrl: string;
}
