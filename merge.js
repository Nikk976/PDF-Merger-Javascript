const pdfParse = require("pdf-parse");
const fs = require("fs");

const getPageCount = async (pdfPath) => {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.numpages;
};

const mergePdfs = async (p1, p2, pdf1, pdf2) => {
  return new Promise(async (resolve,reject)=>{

    // Use dynamic import within the async function
    const PDFMergerModule = await import("pdf-merger-js");
    const PDFMerger = PDFMergerModule.default;
    const merger = new PDFMerger();
    
    const pdf1TPage = await getPageCount(p1);
    const pdf2TPage = await getPageCount(p2);
    
    if (!isNaN(pdf1) && !isNaN(pdf2)) {
      await merger.add(p1, `${pdf1} to ${pdf1TPage}`);
      await merger.add(p2, `${pdf2} to ${pdf2TPage}`);
      let d = new Date().getTime();
      await merger.save(`./public/${d}.pdf`);
      resolve(d);
    } else if (isNaN(pdf1) && !isNaN(pdf2)) {
      await merger.add(p1);
      await merger.add(p2, `${pdf2} to ${pdf2TPage}`);
      let d = new Date().getTime();
      await merger.save(`./public/${d}.pdf`);
      resolve(d);
    } else if (!isNaN(pdf1) && isNaN(pdf2)) {
      await merger.add(p1, `${pdf1} to ${pdf1TPage}`);
      await merger.add(p2);
      let d = new Date().getTime();
      await merger.save(`./public/${d}.pdf`);
      resolve(d);
    }
    
    await merger.add(p1);
    await merger.add(p2);
    let d = new Date().getTime();
    await merger.save(`./public/${d}.pdf`);
    resolve(d);
  })
};

// Export the async function
module.exports = { mergePdfs };
