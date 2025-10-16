import { StringOption } from 'necord';

export class CrearEventoDto {
  @StringOption({
    name: 'lugar',
    description: 'Lugar del evento',
    required: true,
    choices: [
      { name: 'Bridgewatch Portal', value: 'brigdewatch-portal' },
      { name: 'Arthur Rest', value: 'arthur-rest' },
      { name: 'HO Frontspring Volcano', value: 'ho-frontspring-volcano' },
    ],
  })
  lugar!: string;
  @StringOption({
    name: 'dia',
    description: 'Día o desplazamiento (hoy, mañana, lunes, +2, etc.)',
    required: true,
  })
  dia?: string;
  @StringOption({
    name: 'hora_utc',
    description: 'Horario en formato HH:mm (UTC)',
    required: true,
  })
  horaUtc!: string;
}
