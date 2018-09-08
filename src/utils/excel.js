import { saveAs } from "file-saver";
import JSZip from "jszip";

const excelStrings = {
  "_rels/.rels":
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
  "xl/_rels/workbook.xml.rels":
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
  "[Content_Types].xml":
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">  <Default Extension="xml" ContentType="application/xml"/>  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>  <Default Extension="jpeg" ContentType="image/jpeg"/>  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
  "xl/workbook.xml":
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">  <fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>  <workbookPr showInkAnnotation="0" autoCompressPictures="0"/>  <bookViews>    <workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>  </bookViews>  <sheets>    <sheet name="Sheet1" sheetId="1" r:id="rId1"/>  </sheets></workbook>',
  "xl/worksheets/sheet1.xml":
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">  <sheetData>    __DATA__  </sheetData></worksheet>',
  "xl/styles.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac x16r2" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main"><fonts count="2" x14ac:knownFonts="1"><font><sz val="11"/><color theme="1"/><name val="等线"/><family val="2"/><charset val="134"/><scheme val="minor"/></font><font><sz val="9"/><name val="等线"/><family val="2"/><charset val="134"/><scheme val="minor"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"><alignment vertical="center"/></xf></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment vertical="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="常规" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/><tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/><extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"><x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext><ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/></ext></extLst></styleSheet>`
};
/**
 *  config={
        header:[],
        body:[],
        filename:'name'
    }
 */
export default class Excel {
  constructor(config) {
    let filename = document.title;

    if (Reflect.has(config, "filename")) {
      filename = config.filename;
    }
    if (filename.includes("*")) {
      filename = filename.replace("*", document.title);
    }

    // Strip characters which the OS will object to
    filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");
    config.filename = filename + ".xlsx";
    this.config = config;
  }

  addRow(row) {
    let cells = row.map(item => {
      if (item === null || item === undefined) {
        item = "";
      }
      return typeof item === "number" ||
        (item.match && item.match(/^-?[0-9\.]+$/) && item.charAt(0) !== "0")
        ? '<c t="n"><v>' + item + "</v></c>"
        : '<c t="inlineStr"><is><t>' +
          (!item.replace ? item : item.replace(/&(?!amp;)/g, "&amp;")) + //.replace(/[\x00-\x1F\x7F-\x9F]/g, "") // remove control characters
            "</t></is></c>"; // they are not valid in XML
    });
    return "<row>" + cells.join("") + "</row>";
  }

  async save() {
    // Set the text
    let xml = "";
    let data = this.config;

    if (data.header) {
      xml += this.addRow(data.header);
    }

    data.body.forEach(item => {
      xml += this.addRow(item);
    });

    let zip = new JSZip();
    let _rels = zip.folder("_rels");
    let xl = zip.folder("xl");
    let xl_rels = zip.folder("xl/_rels");
    let xl_worksheets = zip.folder("xl/worksheets");

    zip.file("[Content_Types].xml", excelStrings["[Content_Types].xml"]);
    _rels.file(".rels", excelStrings["_rels/.rels"]);
    xl.file("workbook.xml", excelStrings["xl/workbook.xml"]);
    xl.file("styles.xml", excelStrings["xl/styles.xml"]);
    xl_rels.file(
      "workbook.xml.rels",
      excelStrings["xl/_rels/workbook.xml.rels"]
    );
    xl_worksheets.file(
      "sheet1.xml",
      excelStrings["xl/worksheets/sheet1.xml"].replace("__DATA__", xml)
    );
    let content = await zip.generateAsync({ type: "blob" });
    saveAs(content, data.filename);
  }
}
