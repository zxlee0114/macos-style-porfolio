import { Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Resume = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="resume" />
        <h2>Resume.pdf</h2>

        <a
          href="files/resume.pdf"
          className="cursor-pointer"
          download
          title="Donwload Resume"
        >
          <Download className="icon" />
        </a>
      </div>

      <Document file="files/resume.pdf">
        <Page pageNumber={1} renderAnnotationLayer renderTextLayer />
      </Document>
    </>
  );
};

const ResumeWindow = WindowWrapper(Resume, "resume");
export default ResumeWindow;
