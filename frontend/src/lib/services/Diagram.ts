import { toast } from 'store/toast';

type DiagramData = {
	id: string;
	name: string;
	bpmnXml: string;
	screenShot: string;
};

type UpdatePayload = {
	name: string;
	bpmnXml: string;
	screenShot: string;
};

export const updatedDiagram = async (id: string, data: UpdatePayload) => {
	const res = await fetch(`/api/proxy/update/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!res.ok) {
		const errorBody = await res.json().catch(() => ({}));
		toast.error(errorBody?.error ?? 'Error al actualizar el diagrama');
		return;
	}

	toast.success('Diagrama actualizado correctamente');
	return res.json();
};

export const getDiagramById = async (id: string): Promise<DiagramData | null> => {
	try {
		const res = await fetch(`/api/proxy/process/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const responseData = await res.json().catch(() => null);

		if (!res.ok) {
			toast.error(responseData?.error ?? `Error al obtener el diagrama (ID: ${id}).`);
			return null;
		}

		if (!responseData) {
			toast.error(`Respuesta inesperada al obtener el diagrama (ID: ${id}).`);
			return null;
		}

		return responseData as DiagramData;
	} catch (error: any) {
		console.error('Error en getDiagramById service:', error);
		toast.error(error.message || 'Error de conexión al obtener el diagrama.');
		return null;
	}
};
