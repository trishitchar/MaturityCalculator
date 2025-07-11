export function exportDOCX(
  results: { return: number; payment: number; method: string; prediction: string }[],
  parameters: {
    principal: number;
    interestRateYear: number;
    interestRateMonth: number;
    threshold: number;
    buffer: number;
  }
) {
  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .protected { color: green; }
          .at-risk { color: orange; }
        </style>
      </head>
      <body>
        <h1>Maturity Payment Table</h1>
        <p>Generated: ${new Date().toLocaleDateString()}</p>

        <h2>Parameters</h2>
        <p>Principal: $${parameters.principal}</p>
        <p>Interest Rate (Year): ${parameters.interestRateYear}%</p>
        <p>Interest Rate (Month): ${parameters.interestRateMonth.toFixed(4)}%</p>
        <p>Threshold: ${parameters.threshold}%</p>
        <p>Buffer: ${parameters.buffer}%</p>

        <h2>Summary</h2>
        <p>Total Scenarios: ${results.length}</p>
        <p>Protected: ${results.filter((r) => r.prediction.includes("Protected")).length}</p>
        <p>At Risk: ${results.filter((r) => r.prediction.includes("At Risk")).length}</p>

        <h2>Results</h2>
        <table>
          <tr>
            <th>Underlying Return (%)</th>
            <th>Payment at Maturity ($)</th>
            <th>Method</th>
            <th>Prediction</th>
          </tr>
          ${results
            .map(
              (r) => `
            <tr>
              <td>${r.return}</td>
              <td>${r.payment}</td>
              <td>${r.method}</td>
              <td class="${r.prediction.includes("Protected") ? "protected" : "at-risk"}">${r.prediction}</td>
            </tr>
          `
            )
            .join("")}
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "maturity-report.docx";
  a.click();
  URL.revokeObjectURL(url);
}
