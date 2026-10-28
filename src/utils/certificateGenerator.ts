import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Downloads a DOM element as a high-resolution PDF document.
 * Configured with 2x scale for crisp Islamic typography, borders, and gold seals.
 */
export async function downloadCertificateAsPdf(
  elementId: string,
  fileName: string = 'Piagam-Penghargaan-Taqwim.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Certificate element with id "${elementId}" not found.`);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#090d16',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');

    // Landscape A4 orientation
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF certificate:', error);
    return false;
  }
}

/**
 * Downloads a DOM element as a high-resolution PNG image.
 */
export async function downloadCertificateAsImage(
  elementId: string,
  fileName: string = 'Piagam-Penghargaan-Taqwim.png'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Certificate element with id "${elementId}" not found.`);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#090d16',
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return true;
  } catch (error) {
    console.error('Failed to generate Image certificate:', error);
    return false;
  }
}
