import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const normalize = (str: string) =>
	str
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();

export function timeSince(dateISO: string) {
	return formatDistanceToNow(new Date(dateISO), { addSuffix: true, locale: es });
}

export function getToken(): string | undefined {
	return document.cookie
		.split('; ')
		.find((row) => row.startsWith('token='))
		?.split('=')[1];
}
