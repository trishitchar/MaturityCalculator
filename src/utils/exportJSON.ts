export function exportJSON(
  results: { return: number; payment: number; method: string; prediction: string }[],
  parameters: {
    principal: number;
    interestRateYear: number;
    interestRateMonth: number;
    threshold: number;
    buffer: number;
  }
) {
  const data = {
    parameters,
    results,
    generatedAt: new Date().toISOString(),
    totalScenarios: results.length,
    protectedCount: results.filter((r) => r.prediction.includes("Protected")).length,
    atRiskCount: results.filter((r) => r.prediction.includes("At Risk")).length,
  };

  // creating anoher blob for downloading
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "maturity-data.json";
  a.click();
  URL.revokeObjectURL(url);
}
