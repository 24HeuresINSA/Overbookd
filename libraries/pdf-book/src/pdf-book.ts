import {
  degrees,
  PageSizes,
  PDFDocument,
  type PDFEmbeddedPage,
  type PDFPage,
} from "pdf-lib";

export type BookOptions = {
  outerMargin: number;
  topMargin: number;
  bottomMargin: number;
};

const defaultBookOptions = {
  outerMargin: 10,
  topMargin: 30,
  bottomMargin: 30,
};

type PageArrangement = {
  leftPage?: PDFEmbeddedPage;
  rightPage?: PDFEmbeddedPage;
};

export class PDFBook {
  constructor(private readonly options: BookOptions = defaultBookOptions) {}

  async generateBooklet(
    pdf: string | Uint8Array | ArrayBuffer,
  ): Promise<string> {
    const document = await PDFDocument.load(pdf);
    const booklet = await this.toBooklet(document);
    return booklet.saveAsBase64();
  }

  async generateMultipleBooklets(
    pdfs: (string | Uint8Array | ArrayBuffer)[],
  ): Promise<string> {
    const outputPdf = await PDFDocument.create();

    for (const pdf of pdfs) {
      const document = await PDFDocument.load(pdf);
      const booklet = await this.toBooklet(document);
      const pages = await outputPdf.copyPages(
        booklet,
        booklet.getPageIndices(),
      );
      pages.forEach((page) => outputPdf.addPage(page));
    }

    return outputPdf.saveAsBase64();
  }

  private async toBooklet(inputPdf: PDFDocument): Promise<PDFDocument> {
    const outputPdf = await PDFDocument.create();

    const pages = inputPdf.getPages();
    const embededPages = await outputPdf.embedPages(pages);

    const arrangement = this.getBookletPageArrangement(embededPages);

    const bookletPageSize: [number, number] = [
      PageSizes.A4[1],
      PageSizes.A4[0],
    ];

    arrangement.forEach(({ leftPage, rightPage }, i) => {
      const newPage = outputPdf.addPage(bookletPageSize);
      const isOddPage = i % 2 == 0;
      this.copyPageToBooklet(leftPage, newPage, !isOddPage);
      this.copyPageToBooklet(rightPage, newPage, isOddPage);
      if (isOddPage) newPage.setRotation(degrees(180));
    });

    return outputPdf;
  }

  private getBookletPageArrangement(
    pages: PDFEmbeddedPage[],
  ): PageArrangement[] {
    const totalPageCount = Math.ceil(pages.length / 4) * 4;
    return Array(totalPageCount / 2)
      .fill(0)
      .map((_, i) => ({
        leftPage: pages.at(i),
        rightPage: pages.at(totalPageCount - i - 1),
      }));
  }

  private copyPageToBooklet(
    sourcePage: PDFEmbeddedPage | undefined,
    destPage: PDFPage,
    isLeftPage: boolean,
  ) {
    if (sourcePage === undefined) return;

    const { width, height } = destPage.getSize();
    const availableHeight =
      height - (this.options.topMargin + this.options.bottomMargin);
    const scale = Math.min(1, availableHeight / sourcePage.height);

    const x = isLeftPage
      ? this.options.outerMargin
      : width - this.options.outerMargin - sourcePage.width * scale;
    const y = this.options.topMargin;

    destPage.drawPage(sourcePage, { x, y, xScale: scale, yScale: scale });
  }
}
