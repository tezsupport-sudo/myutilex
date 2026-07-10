import { PDFDocument } from 'pdf-lib';

export interface PDFInputField {
  id: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'checkbox';
  defaultValue: any;
  options?: { label: string; value: any }[];
  helpText?: string;
}

export interface PDFPlugin {
  id: string;
  name: string;
  description: string;
  inputs: PDFInputField[];
  process: (
    files: File[],
    inputs: Record<string, any>
  ) => Promise<{
    blob: Blob;
    url: string;
    fileName: string;
    pageCount: number;
    infoList?: string[];
  }>;
}

// Parse page ranges like "1-3, 5, 7-10" into 0-indexed page numbers
function parsePageRange(rangeStr: string, maxPages: number): number[] {
  const pages: number[] = [];
  const parts = rangeStr.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.toLowerCase() === 'all') {
      for (let i = 0; i < maxPages; i++) {
        pages.push(i);
      }
      continue;
    }

    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (!isNaN(start) && !isNaN(end)) {
        const from = Math.max(1, Math.min(start, maxPages));
        const to = Math.max(1, Math.min(end, maxPages));
        
        if (from <= to) {
          for (let i = from; i <= to; i++) {
            pages.push(i - 1); // 0-indexed
          }
        } else {
          for (let i = from; i >= to; i--) {
            pages.push(i - 1);
          }
        }
      }
    } else {
      const pageNum = parseInt(trimmed, 10);
      if (!isNaN(pageNum)) {
        const page = Math.max(1, Math.min(pageNum, maxPages));
        pages.push(page - 1); // 0-indexed
      }
    }
  }

  // Deduplicate and filter out of bounds
  return Array.from(new Set(pages)).filter(p => p >= 0 && p < maxPages);
}

const pdfMergerPlugin: PDFPlugin = {
  id: 'pdf-merger',
  name: 'Secure Local PDF Merger & Extractor',
  description: 'Merge multiple PDF documents or extract selected page ranges into a new document. Runs 100% client-side inside browser memory.',
  inputs: [
    {
      id: 'operation',
      label: 'Select Operation',
      type: 'select',
      defaultValue: 'merge',
      options: [
        { label: 'Merge Multiple PDFs (Combine documents)', value: 'merge' },
        { label: 'Extract Pages from PDF (Split / Cut ranges)', value: 'extract' }
      ],
      helpText: 'Merge combines multiple files in chosen order. Extract cuts specific pages out of the first selected file.'
    },
    {
      id: 'pageRange',
      label: 'Pages to Extract',
      type: 'text',
      defaultValue: '1-2, 4',
      helpText: 'Use format like "1-3, 5, 7" or "all". Only used in Extract mode.'
    }
  ],
  process: async (files: File[], inputs: Record<string, any>) => {
    if (files.length === 0) {
      throw new Error('Please select at least one PDF file.');
    }

    const operation = inputs.operation || 'merge';

    if (operation === 'merge') {
      const mergedPdf = await PDFDocument.create();
      const infoList: string[] = [];

      for (const file of files) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pageCount = pdfDoc.getPageCount();
          
          // Copy all pages
          const pagesToCopy = Array.from({ length: pageCount }, (_, i) => i);
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pagesToCopy);
          
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          infoList.push(`Combined ${file.name} (${pageCount} pages)`);
        } catch (err) {
          throw new Error(`Failed to load or process document "${file.name}": ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const outputDoc = await PDFDocument.load(mergedPdfBytes);

      return {
        blob,
        url,
        fileName: 'merged-document.pdf',
        pageCount: outputDoc.getPageCount(),
        infoList
      };

    } else {
      // Extract Pages Mode
      const file = files[0];
      const pageRangeStr = inputs.pageRange || 'all';

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const totalPages = pdfDoc.getPageCount();

        const pageIndexesToExtract = parsePageRange(pageRangeStr, totalPages);
        if (pageIndexesToExtract.length === 0) {
          throw new Error(`No valid pages found in range "${pageRangeStr}". Total pages in document: ${totalPages}.`);
        }

        const extractedPdf = await PDFDocument.create();
        const copiedPages = await extractedPdf.copyPages(pdfDoc, pageIndexesToExtract);
        copiedPages.forEach((page) => extractedPdf.addPage(page));

        const extractedPdfBytes = await extractedPdf.save();
        const blob = new Blob([extractedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const pageDisplayStr = pageIndexesToExtract.map(p => p + 1).join(', ');
        const infoList = [
          `Source document: ${file.name} (${totalPages} pages)`,
          `Extracted page range: "${pageRangeStr}"`,
          `Selected pages extracted: [${pageDisplayStr}]`
        ];

        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

        return {
          blob,
          url,
          fileName: `${baseName}-extracted.pdf`,
          pageCount: extractedPdf.getPageCount(),
          infoList
        };
      } catch (err) {
        throw new Error(`Failed to extract pages from "${file.name}": ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }
};

export const PDF_PLUGINS: Record<string, PDFPlugin> = {
  'pdf-merger': pdfMergerPlugin
};
