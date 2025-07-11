export default function exportCSV(results: { return: number; payment: number; method: string; prediction: string }[]) {
  const csv = [
    "Underlying Return (%),Payment at Maturity ($),Method,Prediction",
    ...results.map((r) => `${r.return},${r.payment},${r.method},${r.prediction}`),
  ].join("\n");

  // making blob for downloadding
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "maturity-table.csv";
  a.click();
  URL.revokeObjectURL(url);
}
