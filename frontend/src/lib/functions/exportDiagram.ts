import type BpmnModeler from 'bpmn-js/lib/Modeler';
import { sanitizeString } from '$lib/utils/utils';
import { toast } from 'store/toast';

export async function exportBpmnDiagram(
	modelerInstance: BpmnModeler | null,
	currentDiagramName: string
): Promise<void> {
	try {
		if (!modelerInstance) {
			toast.error('No es posible exportar: el editor no está inicializado.');
			return;
		}

		const { xml } = await modelerInstance.saveXML({ format: true });

		if (!xml) {
			toast.error('El XML está vacío o no se pudo generar para la exportación.');
			return;
		}

		const fileName = `bpmnsmart-${sanitizeString(currentDiagramName || 'diagram')}.xml`;
		const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		toast.success('Diagrama exportado correctamente.');
	} catch (err) {
		console.error('Error al exportar diagrama: ', err);
		toast.error('No se pudo exportar el diagrama. Verifique la consola.');
	}
}
