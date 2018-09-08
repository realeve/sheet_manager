import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  方正细等线简体: {
    normal: "方正细等线简体.ttf",
    bold: "方正细等线简体.ttf",
    italics: "方正细等线简体.ttf",
    bolditalics: "方正细等线简体.ttf"
  }
};

const pdf = config => {
  let defaultConfig = {
    orientation: "portrait",
    pageSize: "A4",
    download: "open",
    title: document.title,
    extension: ".pdf",
    filename: "*"
  };

  config = Object.assign(defaultConfig, config);
  config.extension = ".pdf";

  let data = config;
  let rows = [];

  if (config.header) {
    rows.push(
      data.header.map(d => {
        return {
          text: typeof d === "string" ? d : d + "",
          style: "tableHeader"
        };
      })
    );
  }

  data.body.forEach((item, i) => {
    rows.push(
      item.map(d => {
        return {
          text: typeof d === "string" ? d : d + "",
          style: i % 2 ? "tableBodyEven" : "tableBodyOdd"
        };
      })
    );
  });

  if (config.footer) {
    rows.push(
      data.footer.map(d => {
        return {
          text: typeof d === "string" ? d : d + "",
          style: "tableFooter"
        };
      })
    );
  }

  let doc = {
    pageSize: config.pageSize,
    pageOrientation: config.orientation,
    content: [{
      table: {
        headerRows: 1,
        body: rows
      },
      layout: "headerLineOnly"
    }],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: "#2d4154", //'white',
        fillColor: "white", //'#2d4154',
        alignment: "center",
        margin: [8, 3, 8, 3]
      },
      tableBodyEven: {
        fontSize: 10,
        margin: [8, 3, 8, 3]
      },
      tableBodyOdd: {
        fontSize: 10,
        fillColor: "#f3f3f3",
        margin: [8, 3, 8, 3]
      },
      tableFooter: {
        bold: true,
        fontSize: 12,
        color: "white",
        fillColor: "#2d4154",
        margin: [8, 3, 8, 3]
      },
      title: {
        alignment: "center",
        fontSize: 20
      },
      message: {}
    },
    defaultStyle: {
      fontSize: 10,
      font: "方正细等线简体"
    }
  };

  if (config.message) {
    doc.content.push({
      text: config.message,
      style: "message",
      alignment: "left",
      margin: [0, 20, 0, 6]
    });
  }

  if (config.title) {
    doc.content.unshift({
      text: config.title,
      style: "title",
      margin: [0, 0, 0, 6]
    });
  }

  if (config.customize) {
    config.customize(doc);
  }

  if (config.download === "open") {
    pdfMake.createPdf(doc).open();
  } else {
    pdfMake.createPdf(doc).download(config.title + config.extension);
  }
};

export default pdf;
