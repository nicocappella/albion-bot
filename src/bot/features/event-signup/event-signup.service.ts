import { Injectable, Logger } from '@nestjs/common';
import type {
  Message,
  NewsChannel,
  TextChannel,
  ThreadChannel,
} from 'discord.js';
import { parseEventoArgsUTC, type EventCommandArgs } from './event-signup.parser';

interface SignupThreadRecord {
  postId: string;
  threadId: string;
  channelId: string;
  lugar: string;
  epoch: number;
}

interface ThreadMessageContext {
  message: Message;
  parentMessage: Message;
  thread: SignupThreadRecord;
}

@Injectable()
export class EventSignupService {
  private readonly logger = new Logger(EventSignupService.name);
  private readonly threads = new Map<string, SignupThreadRecord>();

  private readonly slotLines = [
    '**(1)** Maza 1h:',
    '**(2)** GA(Caballero):',
    '**(3)** Incubo(Demonio):',
    '**(4)** Maza 1h(Guardian):',
    '**(5)** Santificador(Clérigo):',
    '**(6)** Exaltado(Clérigo):',
    '**(7)** Caido(Clérigo):',
    '**(8)** Invocador oscuro(Clérigo):',
    '**(9)** Locus o Enraizado(Juez):',
    '**(10)** Juradores(Demonio):',
    '**(11)** Tallada(Clérigo):',
    '**(12)** Púas(Clérigo):',
    '**(13)** Rompereinos(Clérigo):',
    '**(14)** Cazaespiritu(Clérigo):',
    '**(15)** Brazales(Clérigo):',
    '**(16)** Brazales(Clérigo):',
    '**(17)** Brazales(Clérigo):',
    '**(18)** Brazales(Clérigo):',
    '**(19)** Brazales(Clérigo)/Torre movil:',
    '**(20)** Basilisco:',
  ];

  parseCommand(text: string) {
    return parseEventoArgsUTC(text);
  }

  parseFromParts(lugar: string, dayRaw: string | undefined, timeRaw: string) {
    const parts = [lugar];
    if (dayRaw && dayRaw.trim().length > 0) {
      parts.push(dayRaw.trim());
    }
    parts.push(timeRaw);

    return parseEventoArgsUTC(`crear-evento ${parts.join(' | ')}`);
  }

  buildSignupMessage(
    lugar: string,
    utcLabel: string,
    epoch: number,
    dayLabel: string,
  ): string {
    const lines = [
      '@everyone',
      '',
      '**PT 1**',
      '',
      ...this.slotLines,
      '',
      `**📍 Lugar:** ${lugar}`,
      `**📅 Día:** ${dayLabel}`,
      `**🕒 Horario (UTC):** ${utcLabel} — <t:${epoch}:R>`,
      '',
      '**Buen día, escriban aquí para inscribirse.**',
      '*(Ejemplo: 1, 2 o 3)*',
    ];

    return lines.join('\n');
  }

  buildThreadName(lugar: string, utcLabel: string): string {
    return `CTA • ${lugar} • ${utcLabel}`;
  }

  async createEventMessage(
    channel: TextChannel | NewsChannel,
    parsed: EventCommandArgs,
  ): Promise<{
    postId: string;
    threadId: string;
    thread: ThreadChannel;
    threadName: string;
  }> {
    const content = this.buildSignupMessage(
      parsed.lugar,
      parsed.utcLabel,
      parsed.epoch,
      parsed.dayLabel,
    );

    const post = await channel.send({ content });

    const threadName = this.buildThreadName(parsed.lugar, parsed.utcLabel);
    const thread = await post.startThread({
      name: threadName,
      autoArchiveDuration: 60,
    });

    await thread.send(
      `@everyone\n**📍 Lugar:** ${parsed.lugar}\n**📅 Día:** ${parsed.dayLabel}\n**🕒 Horario (UTC):** ${parsed.utcLabel} — <t:${parsed.epoch}:R>`,
    );

    this.trackThread({
      postId: post.id,
      threadId: thread.id,
      channelId: post.channelId,
      lugar: parsed.lugar,
      epoch: parsed.epoch,
    });

    return {
      postId: post.id,
      threadId: thread.id,
      thread,
      threadName,
    };
  }

  trackThread(record: SignupThreadRecord): void {
    this.threads.set(record.threadId, record);
  }

  getThreadById(threadId: string): SignupThreadRecord | undefined {
    return this.threads.get(threadId);
  }

  async handleThreadMessage({
    message,
    parentMessage,
    thread,
  }: ThreadMessageContext): Promise<string | null> {
    this.logger.debug(
      `Procesando mensaje en thread ${thread.threadId} para ${thread.lugar}`,
    );

    const userId = message.author.id;
    const userTag = `<@${userId}>`;
    const raw = message.content.trim();
    const lower = raw.toLowerCase();

    const lines = parentMessage.content.split('\n');

    const updatePostContent = async (updatedLines: string[]): Promise<void> => {
      await parentMessage.edit({ content: updatedLines.join('\n') });
    };

    const removeSpecificMatch = lower.match(/^-(\d{1,2})$/);
    if (removeSpecificMatch) {
      const slotNumber = Number.parseInt(removeSpecificMatch[1], 10);

      const idx = this.findSlotIndex(lines, slotNumber);
      if (idx === -1) {
        return 'No se encontró ese número de slot en la lista.';
      }

      if (!lines[idx].includes(userTag)) {
        return `No estás asignado en el slot ${slotNumber}.`;
      }

      lines[idx] = lines[idx].replace(/:\s*.*/, ':');
      await updatePostContent(lines);
      return `🗑️ ${userTag} eliminado del slot ${slotNumber}.`;
    }

    if (/^(-|leave|salir)$/.test(lower)) {
      const currentIndex = lines.findIndex((line) => line.includes(userTag));
      if (currentIndex === -1) {
        return 'No estás asignado en ningún slot.';
      }

      const slotMatch = lines[currentIndex].match(/^\*\*\((\d{1,2})\)\*\*/);
      const currentSlot = slotMatch ? Number.parseInt(slotMatch[1], 10) : '?';

      lines[currentIndex] = lines[currentIndex].replace(/:\s*.*/, ':');
      await updatePostContent(lines);

      return `🗑️ ${userTag} eliminado del slot ${currentSlot}.`;
    }

    const match = raw.match(/^(\d{1,2})\s*(?:[+:\-]\s*)?(.*)$/i);
    if (!match) {
      return 'Formato inválido. Ej: 1, 2 o 3';
    }

    const slotNumber = Number.parseInt(match[1], 10);
    const roleText = (match[2] || '').trim();

    const targetIndex = this.findSlotIndex(lines, slotNumber);
    if (targetIndex === -1) {
      return 'No se encontró ese número de slot en la lista.';
    }

    const currentIndexOfUser = lines.findIndex((line) =>
      line.includes(userTag),
    );
    if (currentIndexOfUser !== -1 && currentIndexOfUser !== targetIndex) {
      lines[currentIndexOfUser] = lines[currentIndexOfUser].replace(
        /:\s*.*/,
        ':',
      );
    }

    const existingMentionMatch = lines[targetIndex].match(/<@(\d+)>/);
    const someoneElseInSlot =
      existingMentionMatch && existingMentionMatch[1] !== userId;

    if (someoneElseInSlot) {
      return 'Ese slot ya está ocupado por otra persona.';
    }

    if (lines[targetIndex].includes(':')) {
      lines[targetIndex] = lines[targetIndex].replace(
        /:\s*.*/,
        `: ${userTag}${roleText ? ` (${roleText})` : ''}`,
      );
    } else {
      lines[targetIndex] = `${lines[targetIndex]}: ${userTag}${
        roleText ? ` (${roleText})` : ''
      }`;
    }

    await updatePostContent(lines);
    return `✅ ${userTag} asignado al slot ${slotNumber}${
      roleText ? ` (${roleText})` : ''
    }.`;
  }

  private findSlotIndex(lines: string[], slotNumber: number): number {
    return lines.findIndex((line) => line.startsWith(`**(${slotNumber})**`));
  }
}
