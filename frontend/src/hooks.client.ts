import { goto } from '$app/navigation';
import { toast } from 'store/toast';

export const handleFetch: typeof fetch = async (input, init) => {
	const response = await fetch(input, init);

	if (response.status === 401) {
		toast.warning('Sesión expirada, ingrese nuevamente.');
		goto('/');
	}

	return response;
};
