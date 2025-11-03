/**
 * @file Lista de países con sus códigos de marcación telefónica.
 * Utilizado para el selector de país en el formulario de empleado.
 */

export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  dial_code: string; // Código de marcación internacional
}

export const countries: Country[] = [
  { name: 'Costa Rica', code: 'CR', dial_code: '+506' },
  { name: 'United States', code: 'US', dial_code: '+1' },
  { name: 'Mexico', code: 'MX', dial_code: '+52' },
  { name: 'Colombia', code: 'CO', dial_code: '+57' },
  { name: 'Spain', code: 'ES', dial_code: '+34' },
  { name: 'Argentina', code: 'AR', dial_code: '+54' },
  { name: 'Panama', code: 'PA', dial_code: '+507' },
  { name: 'Nicaragua', code: 'NI', dial_code: '+505' },
  { name: 'Honduras', code: 'HN', dial_code: '+504' },
  { name: 'El Salvador', code: 'SV', dial_code: '+503' },
  { name: 'Guatemala', code: 'GT', dial_code: '+502' },
];
