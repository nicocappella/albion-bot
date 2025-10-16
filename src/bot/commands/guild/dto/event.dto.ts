import { StringOption } from 'necord';

export class CrearEventoDto {
  @StringOption({
    name: 'lugar',
    description: 'Lugar del evento',
    required: true,
    choices: [
      { name: 'Bridgewatch Portal', value: 'Bridgewatch Portal' },
      { name: 'Arthur Rest', value: 'Arthur Rest' },
      { name: 'HO Frontspring Volcano', value: 'HO Frontspring Volcano' },
    ],
  })
  lugar!: string;

  @StringOption({
    name: 'hora_utc',
    description: 'Horario en formato HH:mm (UTC)',
    required: true,
  })
  horaUtc!: string;

  @StringOption({
    name: 'dia',
    description: 'Día o desplazamiento (0 = hoy, 1 = mañana)',
    required: false,
  })
  dia?: string;
}
