import { toast } from "sonner";

/**
 * Downloads a PDF document.
 * If docUrl exists, downloads from docUrl.
 * If no docUrl exists, generates a downloadable PDF file fallback.
 */
export const downloadPdfDocument = (
  docName?: string,
  docUrl?: string,
  staffName?: string
) => {
  const fileName = docName || `${staffName ? staffName.replace(/\s+/g, "_") : "Staff"}_Document.pdf`;

  if (docUrl) {
    const link = document.createElement("a");
    link.href = docUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`ডকুমেন্ট ডাউনলোড শুরু হয়েছে: ${fileName}`);
    return;
  }

  // Fallback: Generate a sample PDF Blob if no URL is provided (e.g. for mock data)
  const pdfHeader = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 85 >>
stream
BT
/F1 14 Tf
50 700 TD
(Staff Document: ${fileName}) Tj
0 -20 TD
(${staffName ? "Belongs to: " + staffName : "Official Staff Document"}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000214 00000 n
trailer
<< /Root 1 0 R /Size 5 >>
startxref
350
%%EOF`;

  const blob = new Blob([pdfHeader], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast.success(`ডকুমেন্ট সফলভাবে ডাউনলোড হয়েছে: ${fileName}`);
};
