import { StringOption } from 'necord';
import baseMaps from '@/../base.maps.json';

const EVENT_LOCATION_CHOICES = baseMaps.map((m) => ({
  name: m.name,
  value: m.value,
}));

export class CrearEventoDto {
  @StringOption({
    name: 'lugar',
    description: 'Lugar del evento (seleccioná un mapa priorizado de la lista)',
    required: true,
    choices: EVENT_LOCATION_CHOICES,
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
