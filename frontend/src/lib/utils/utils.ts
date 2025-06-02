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

export const sanitizeString = (str: string) => str.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ\-_]/g, '');

export function debounce<T extends (...args: any[]) => void>(
	fn: T,
	timeout: number
): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout>;

	return function (...args: Parameters<T>) {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => fn(...args), timeout);
	};
}
