import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ExpenseCategoryLabel } from "../../models/Expense";
import { ActivityStatusLabel } from "../../models/Activity";

// jsPDF's built-in fonts (helvetica) only encode WinAnsi/Latin-1, which doesn't
// cover č/ć/đ/š/ž. We strip these to their plain equivalents before drawing so
// the PDF renders without garbled boxes. For a fully diacritic-correct PDF we
// would need to embed a Unicode TTF.
const DIACRITIC_MAP = {
    "č": "c", "Č": "C", "ć": "c", "Ć": "C",
    "š": "s", "Š": "S", "ž": "z", "Ž": "Z",
    "đ": "d", "Đ": "D"
};

function asciiSafe(value) {
    if (value === null || value === undefined) return "";
    const text = String(value);
    return text.replace(/[čČćĆšŠžŽđĐ]/g, ch => DIACRITIC_MAP[ch] || ch);
}

function formatDate(value) {
    if (!value) return "-";
    try { return asciiSafe(new Date(value).toLocaleDateString("sr-Latn-RS")); }
    catch { return asciiSafe(value); }
}

function formatMoney(value) {
    const n = Number(value) || 0;
    return `${n.toFixed(2)} EUR`;
}

function addSectionHeader(doc, title, y) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(asciiSafe(title), 14, y);
    doc.setDrawColor(180);
    doc.line(14, y + 1.5, 196, y + 1.5);
    doc.setFont("helvetica", "normal");
    return y + 8;
}

function ensureSpace(doc, currentY, neededHeight) {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (currentY + neededHeight > pageHeight - 15) {
        doc.addPage();
        return 20;
    }
    return currentY;
}

const pdfService = {
    generatePlanReport(plan, destinations = [], activities = [], expenses = [], checklistItems = []) {
        const doc = new jsPDF({ unit: "mm", format: "a4" });

        // Title
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(asciiSafe(plan.name || "Plan putovanja"), 14, 20);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(90);
        doc.text(`${formatDate(plan.startDate)} - ${formatDate(plan.endDate)}`, 14, 27);
        doc.setTextColor(0);

        let y = 36;

        // Plan basics
        y = addSectionHeader(doc, "Osnovni podaci", y);
        doc.setFontSize(10);
        const totalSpent = (expenses || []).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        const remaining = (Number(plan.budget) || 0) - totalSpent;

        const basics = [
            ["Budzet", formatMoney(plan.budget)],
            ["Ukupno trosenje", formatMoney(totalSpent)],
            ["Preostalo", formatMoney(remaining)]
        ];
        if (plan.description) basics.push(["Opis", asciiSafe(plan.description)]);
        if (plan.notes) basics.push(["Napomene", asciiSafe(plan.notes)]);

        autoTable(doc, {
            startY: y,
            head: [],
            body: basics,
            theme: "plain",
            styles: { fontSize: 10, cellPadding: 1.5 },
            columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
            margin: { left: 14, right: 14 }
        });
        y = doc.lastAutoTable.finalY + 8;

        // Destinations
        if (destinations.length > 0) {
            y = ensureSpace(doc, y, 30);
            y = addSectionHeader(doc, `Destinacije (${destinations.length})`, y);
            autoTable(doc, {
                startY: y,
                head: [["Naziv", "Lokacija", "Dolazak", "Odlazak"]],
                body: destinations.map(d => [
                    asciiSafe(d.name),
                    asciiSafe(d.location),
                    formatDate(d.arrivalDate),
                    formatDate(d.departureDate)
                ]),
                styles: { fontSize: 9, cellPadding: 2 },
                headStyles: { fillColor: [13, 110, 253], textColor: 255 },
                margin: { left: 14, right: 14 }
            });
            y = doc.lastAutoTable.finalY + 8;
        }

        // Activities (grouped by date)
        if (activities.length > 0) {
            y = ensureSpace(doc, y, 30);
            y = addSectionHeader(doc, `Aktivnosti (${activities.length})`, y);

            const grouped = {};
            for (const a of activities) {
                const key = a.date || "—";
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(a);
            }
            const sortedDates = Object.keys(grouped).sort();

            for (const date of sortedDates) {
                y = ensureSpace(doc, y, 20);
                doc.setFontSize(11);
                doc.setFont("helvetica", "bold");
                doc.text(formatDate(date), 14, y);
                doc.setFont("helvetica", "normal");
                y += 2;

                autoTable(doc, {
                    startY: y,
                    head: [["Vreme", "Naziv", "Lokacija", "Status", "Trosak"]],
                    body: grouped[date]
                        .slice()
                        .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                        .map(a => [
                            asciiSafe(a.time || "-"),
                            asciiSafe(a.name),
                            asciiSafe(a.location || "-"),
                            asciiSafe(ActivityStatusLabel[a.status] || "-"),
                            formatMoney(a.estimatedCost)
                        ]),
                    styles: { fontSize: 9, cellPadding: 2 },
                    headStyles: { fillColor: [25, 135, 84], textColor: 255 },
                    margin: { left: 14, right: 14 }
                });
                y = doc.lastAutoTable.finalY + 6;
            }
        }

        // Expenses
        if (expenses.length > 0) {
            y = ensureSpace(doc, y, 30);
            y = addSectionHeader(doc, `Troskovi (${expenses.length})`, y);
            autoTable(doc, {
                startY: y,
                head: [["Datum", "Naziv", "Kategorija", "Iznos"]],
                body: expenses
                    .slice()
                    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
                    .map(e => [
                        formatDate(e.date),
                        asciiSafe(e.name),
                        asciiSafe(ExpenseCategoryLabel[e.category] || "-"),
                        formatMoney(e.amount)
                    ]),
                foot: [["", "", "Ukupno", formatMoney(totalSpent)]],
                styles: { fontSize: 9, cellPadding: 2 },
                headStyles: { fillColor: [220, 53, 69], textColor: 255 },
                footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: "bold" },
                margin: { left: 14, right: 14 }
            });
            y = doc.lastAutoTable.finalY + 8;
        }

        // Checklist
        if (checklistItems.length > 0) {
            y = ensureSpace(doc, y, 30);
            const completedCount = checklistItems.filter(i => i.completed).length;
            y = addSectionHeader(doc, `Checklist (${completedCount}/${checklistItems.length})`, y);
            autoTable(doc, {
                startY: y,
                head: [["", "Stavka"]],
                body: checklistItems.map(i => [
                    i.completed ? "[x]" : "[ ]",
                    asciiSafe(i.text)
                ]),
                styles: { fontSize: 10, cellPadding: 2 },
                headStyles: { fillColor: [108, 117, 125], textColor: 255 },
                columnStyles: { 0: { cellWidth: 10, halign: "center" } },
                margin: { left: 14, right: 14 }
            });
            y = doc.lastAutoTable.finalY + 8;
        }

        // Footer with page numbers
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Strana ${i} / ${totalPages}`,
                doc.internal.pageSize.getWidth() - 14,
                doc.internal.pageSize.getHeight() - 8,
                { align: "right" }
            );
            doc.text(
                `Generisano: ${new Date().toLocaleString("sr-Latn-RS")}`,
                14,
                doc.internal.pageSize.getHeight() - 8
            );
        }

        const safeName = asciiSafe(plan.name || "plan")
            .replace(/[^a-zA-Z0-9_-]+/g, "_")
            .substring(0, 50);
        doc.save(`${safeName}_${formatDate(plan.startDate)}.pdf`);
    }
};

export default pdfService;