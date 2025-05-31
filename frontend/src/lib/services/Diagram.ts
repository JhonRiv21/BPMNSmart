import { toast } from 'store/toast';

type Data = {
  name: string;
  bpmnXml: string;
  screenShot: string;
};

export const updatedDiagram = async (id: string, data: Data) => {
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
