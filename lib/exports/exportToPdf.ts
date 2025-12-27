import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type PDFRow = (string | number)[];

export function exportToPDF<T extends PDFRow>({
  title,
  headers,
  data,
  filename
}: {
  title: string;
  headers: string[];
  data: T[];
  filename: string;
}) {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text(title, 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [headers],
    body: data
  });

  doc.save(`${filename}.pdf`);
}
