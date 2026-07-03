const prisma = require("../config/db");
const { jsPDF } = require("jspdf");
const autoTable = require("jspdf-autotable").default; // Note the .default here

exports.generateThreatReport = async (req, res) => {
  try {
    const { id } = req.params;
    const threat = await prisma.threatLog.findUnique({ where: { id } });

    if (!threat) return res.status(404).json({ message: "Report not found" });

    // 1. Initialize jsPDF
    const doc = new jsPDF();

    // 2. Add Header Text
    doc.setFontSize(22);
    doc.text("Cybersecurity Threat Report", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // 3. Use autoTable as a standalone function (Fixes your error)
    autoTable(doc, {
      startY: 40,
      head: [["Field", "Details"]],
      body: [
        ["Threat ID", threat.id],
        ["Detected Attack", threat.attackType],
        ["Confidence Score", `${(threat.confidence * 100).toFixed(2)}%`],
        ["Severity Level", threat.severity],
        ["Source IP", threat.sourceIp || "N/A"],
        ["Detection Time", new Date(threat.timestamp).toLocaleString()],
      ],
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] }, // Primary Blue color
    });

    // 4. Add Recommendations Section
    // Calculate final Y position from the table
    const finalY = doc.lastAutoTable.finalY;

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Mitigation Recommendations", 14, finalY + 20);

    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    const recommendationText =
      threat.recommendation || "No recommendation provided.";

    // Use splitTextToSize to wrap long text
    const splitText = doc.splitTextToSize(recommendationText, 180);
    doc.text(splitText, 14, finalY + 30);

    // 5. Convert to Buffer and Send
    const pdfBuffer = doc.output("arraybuffer");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Threat-Report-${id}.pdf`,
    );

    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("PDF Error:", error);
    res
      .status(500)
      .json({ message: "Error generating PDF", error: error.message });
  }
};
