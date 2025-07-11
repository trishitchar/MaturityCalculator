export function exportPDF(
  results: { return: number; payment: number; method: string; prediction: string }[],
  parameters: {
    principal: number;
    interestRateYear: number;
    interestRateMonth: number;
    threshold: number;
    buffer: number;
  }
) {
  const printContent = `
    <div style="font-family: Arial; padding: 20px;">
      <h1>Maturity Payment Table</h1>
      <p>Generated: ${new Date().toLocaleDateString()}</p>

      <h2>Parameters</h2>
      <p>Principal: $${parameters.principal}</p>
      <p>Interest Rate: ${parameters.interestRateYear}% per year</p>
      <p>Monthly Rate: ${parameters.interestRateMonth.toFixed(4)}%</p>
      <p>Threshold: ${parameters.threshold}%</p>
      <p>Buffer: ${parameters.buffer}%</p>

      <h2>Summary</h2>
      <p>Total: ${results.length} scenarios</p>
      <p>Protected: ${results.filter((r) => r.prediction.includes("Protected")).length}</p>
      <p>At Risk: ${results.filter((r) => r.prediction.includes("At Risk")).length}</p>

      <h2>Results</h2>
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <tr style="background: #f0f0f0;">
          <th style="padding: 8px;">Underlying Return (%)</th>
          <th style="padding: 8px;">Payment at Maturity ($)</th>
          <th style="padding: 8px;">Method</th>
          <th style="padding: 8px;">Prediction</th>
        </tr>
        ${results
          .map(
            (r) => `
          <tr>
            <td style="padding: 8px;">${r.return}</td>
            <td style="padding: 8px;">${r.payment}</td>
            <td style="padding: 8px;">${r.method}</td>
            <td style="padding: 8px; color: ${r.prediction.includes("Protected") ? "green" : "orange"};">
              ${r.prediction}
            </td>
          </tr>
        `
          )
          .join("")}
      </table>
    </div>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }
}
