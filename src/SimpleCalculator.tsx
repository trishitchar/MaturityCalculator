import React, { useState } from "react";
import { Calculator, AlertTriangle } from "lucide-react";

interface Result {
  return: number;
  payment: number;
  method: string;
  prediction: string;
}

const SimpleCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(1000);
  const [interestRateYear, setInterestRateYear] = useState<number>(12.2);
  const [threshold, setThreshold] = useState<number>(-10);
  const [buffer, setBuffer] = useState<number>(10);
  const [returnsText, setReturnsText] = useState<string>(
    "60, 40, 20, 5, 0, -5, -10, -10.01, -20, -30, -40, -60, -80, -100, -200"
  );

  const [results, setResults] = useState<Result[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  function generateMaturityTable(): void {
    const interestRateMonth = interestRateYear / 12;
    const returns: number[] = returnsText
      .split(",")
      .map((r) => parseFloat(r.trim()))
      .filter((r) => !isNaN(r));

    const newResults: Result[] = [];
    const newWarnings: string[] = [];

    returns.forEach((ret) => {
      let payment: number;
      let method: string;
      let prediction: string;

      if (ret >= threshold) {
        payment = principal + (principal * interestRateMonth) / 100;
        method = "Interest";
        prediction = "Protected";
      } else {
        const haveToPayPer = ret + buffer;
        const haveToPay = (principal * haveToPayPer) / 100;
        payment = principal + haveToPay;
        method = "Buffer";
        prediction = "At Risk ";

        if (payment < 0) {
          newWarnings.push(`Payment for ${ret}% can not be negative - set to 0`);
          payment = 0;
        }
      }

      newResults.push({
        return: ret,
        payment: parseFloat(payment.toFixed(4)),
        method,
        prediction,
      });
    });

    setResults(newResults);
    setWarnings(newWarnings);
  }

  const protectedCount = results.filter((r) => r.prediction.includes("Protected")).length;
  const atRiskCount = results.filter((r) => r.prediction.includes("At Risk")).length;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Maturity Table Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="border border-gray-300 rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Principal ($)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Interest Rate Year (%)</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={interestRateYear}
                onChange={(e) => setInterestRateYear(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Threshold (%)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Buffer (%)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={buffer}
                onChange={(e) => setBuffer(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Returns (comma separated)</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
              value={returnsText}
              onChange={(e) => setReturnsText(e.target.value)}
            />
          </div>
          <button
            onClick={generateMaturityTable}
            className="w-full cursor-pointer flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            <Calculator className="w-4 h-4" />
            Generate Table
          </button>
        </div>

        <div className="border border-gray-300 rounded-xl p-6 shadow text-sm space-y-3">
          <h2 className="text-xl font-semibold mb-2">Info & Summary</h2>
          <div>
            <p>
              <strong>Interest Rate Month:</strong> {(interestRateYear / 12).toFixed(4)}%
            </p>
            <p>
              <strong>Monthly Interest:</strong> ${((principal * interestRateYear) / 12 / 100).toFixed(4)}
            </p>
          </div>
          <div>
            <p>
              <strong>Logic:</strong>
            </p>
            <p>• If return ≥ {threshold}%: Protected (Principal + Interest)</p>
            <p>• If return &lt; {threshold}%: At Risk (Buffer formula)</p>
            <hr className="border border-gray-200 mt-4 mb-2" />
          </div>
          {results.length > 0 && (
            <div>
              <p>
                <strong>Current Results:</strong>
              </p>
              <p>Total: {results.length} scenarios</p>
              <p className="text-green-600">Protected: {protectedCount}</p>
              <p className="text-orange-600">At Risk: {atRiskCount}</p>
            </div>
          )}
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 mt-1" />
            <div>
              {warnings.map((w, i) => (
                <div key={i}>{w}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="border border-gray-300 rounded-xl shadow mb-6">
          <div className="flex justify-between items-center p-4 border-b border-gray-300 flex-col sm:flex-row lg:gap-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Results ({results.length}) - {protectedCount} Protected, {atRiskCount} At Risk
            </h2>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Return (%)</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Payment ($)</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Method</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Prediction</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i}>
                    <td className={`border border-gray-300 px-3 py-2 ${r.return >= threshold ? "text-green-600" : "text-red-600"}`}>
                      {r.return}%
                    </td>
                    <td className="border border-gray-300 px-3 py-2 font-mono">${r.payment}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          r.method === "Interest"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {r.method}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <span className={r.prediction.includes("Protected") ? "text-green-600" : "text-orange-600"}>
                        {r.prediction}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleCalculator;