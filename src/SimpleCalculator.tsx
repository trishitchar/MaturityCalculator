import React, { useState, useEffect } from "react";
import { Download, Calculator, AlertTriangle, RotateCcw } from "lucide-react";
import exportCSV from "./utils/exportCSV";
import { exportJSON } from "./utils/exportJSON";
import { exportDOCX } from "./utils/exportDOCX";
import { exportPDF } from "./utils/exportPDF";

interface Result {
  return: number;
  payment: number;
  method: string;
  prediction: string;
}

const SimpleCalculator: React.FC = () => {
  // default values for the calculator given 1000, 12.2, -10,10; 
  // i also added extra Underlying Return for testing values like -110.1 or -200 ...etc,
  const defaultValues = {
    principal: 1000,
    interestRateYear: 12.2,
    threshold: -10,
    buffer: 10,
    returnsText: "60, 40, 20, 5, 0, -5, -10, -10.01, -20, -30, -40, -60, -80, -100, -110, -110.1, -200"
  };

  const [principal, setPrincipal] = useState<number>(defaultValues.principal);
  const [interestRateYear, setInterestRateYear] = useState<number>(defaultValues.interestRateYear);
  const [threshold, setThreshold] = useState<number>(defaultValues.threshold);
  const [buffer, setBuffer] = useState<number>(defaultValues.buffer);
  const [returnsText, setReturnsText] = useState<string>(defaultValues.returnsText);

  const [interestRateYearStr, setInterestRateYearStr] = useState<string>(String(defaultValues.interestRateYear));
  const [thresholdStr, setThresholdStr] = useState<string>(String(defaultValues.threshold));
  const [bufferStr, setBufferStr] = useState<string>(String(defaultValues.buffer));

  const [results, setResults] = useState<Result[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const ir = parseFloat(interestRateYearStr);
    if (!isNaN(ir)) setInterestRateYear(ir);

    const th = parseFloat(thresholdStr);
    if (!isNaN(th)) setThreshold(th);

    const buf = parseFloat(bufferStr);
    if (!isNaN(buf)) setBuffer(buf);
  }, [interestRateYearStr, thresholdStr, bufferStr]);

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
          newWarnings.push(`Payment for ${ret}% cannot be negative - set to 0`);
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

  // initial table generation
  useEffect(() => {
    generateMaturityTable();
  }, []);

  const getParameters = () => ({
    principal,
    interestRateYear,
    interestRateMonth: interestRateYear / 12,
    threshold,
    buffer,
  });

  const handleExportCSV = () => exportCSV(results);
  const handleExportJSON = () => exportJSON(results, getParameters());
  const handleExportDOCX = () => exportDOCX(results, getParameters());
  const handleExportPDF = () => exportPDF(results, getParameters());

  // added reset so if user somehow forgets the previous value, also they can reload too..
  const resetToDefaults = () => {
    setPrincipal(defaultValues.principal);
    setInterestRateYear(defaultValues.interestRateYear);
    setThreshold(defaultValues.threshold);
    setBuffer(defaultValues.buffer);
    setReturnsText(defaultValues.returnsText);

    setInterestRateYearStr(String(defaultValues.interestRateYear));
    setThresholdStr(String(defaultValues.threshold));
    setBufferStr(String(defaultValues.buffer));
  };

  const protectedCount = results.filter((r) => r.prediction.includes("Protected")).length;
  const atRiskCount = results.filter((r) => r.prediction.includes("At Risk")).length;

  const exportButtons = [{ label: "CSV", handler: handleExportCSV },
    { label: "JSON", handler: handleExportJSON },
    { label: "DOCX", handler: handleExportDOCX },
    { label: "PDF", handler: handleExportPDF },
  ];

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
              //previously it was number but facing some issue while giving negetive input from my laptop keyboard, so I make it text input and added validation
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={principal}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                    setPrincipal(value === '' ? 0 : Number(value) || 0);
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Interest Rate Year (%)</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={interestRateYearStr}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                    setInterestRateYearStr(value);
                  }
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Threshold (%)</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={thresholdStr}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                    setThresholdStr(value);
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Buffer (%)</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={bufferStr}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                    setBufferStr(value);
                  }
                }}
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
          <div className="flex gap-2">
            <button
              onClick={generateMaturityTable}
              className="flex-1 cursor-pointer flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              <Calculator className="w-4 h-4" />
              Generate Table
            </button>
            <button
              onClick={resetToDefaults}
              className="cursor-pointer flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
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
            <div>
              {warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 mt-1" />
                  <div>{w}</div>
                </div>
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
            <div className="flex gap-2 mt-3 sm:mt-0">
              {exportButtons.map(({ label, handler }) => (
                <button
                  key={label}
                  onClick={handler}
                  className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100 cursor-pointer transition"
                >
                  <Download className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
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