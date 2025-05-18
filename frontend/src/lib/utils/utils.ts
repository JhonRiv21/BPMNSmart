export const normalize = (str: string) =>
	str
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();
