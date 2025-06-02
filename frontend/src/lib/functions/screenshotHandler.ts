import type BpmnModeler from 'bpmn-js/lib/Modeler';

export async function generatePngScreenshot(
  modelerInstance: BpmnModeler | null,
): Promise<string> {
  if (!modelerInstance) {
    console.warn("generatePngScreenshot: Modeler no inicializado.");
    return '';
  }

  try {
    const { svg } = await modelerInstance.saveSVG();
    if (!svg) {
      console.warn("generatePngScreenshot: saveSVG no devolvió contenido SVG.");
      return '';
    }

    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const svgDataUrl = reader.result as string;
        if (!svgDataUrl) {
          console.warn("generatePngScreenshot: FileReader no pudo convertir SVG blob a Data URL.");
          resolve('');
          return;
        }

        const image = new Image();
        image.onload = () => {
          const canvasElement = document.createElement('canvas');
          const scale = 2;
          canvasElement.width = image.width * scale;
          canvasElement.height = image.height * scale;

          const ctx = canvasElement.getContext('2d');
          if (!ctx) {
            console.warn("generatePngScreenshot: No se pudo obtener el contexto 2D del canvas.");
            resolve('');
            return;
          }

          ctx.scale(scale, scale);
          ctx.drawImage(image, 0, 0);
          const pngDataUrl = canvasElement.toDataURL('image/png');
          resolve(pngDataUrl);
        };

        image.onerror = () => {
          console.error("generatePngScreenshot: Error al cargar SVG Data URL en el objeto Image.");
          resolve('');
        };
        
        image.src = svgDataUrl;
      };

      reader.onerror = () => {
        console.error("generatePngScreenshot: Error del FileReader al leer SVG blob.");
        resolve('');
      };

      reader.readAsDataURL(svgBlob);
    });
  } catch (error) {
    console.error("Error generando screenshot PNG:", error);
    return '';
  }
}
