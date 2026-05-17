import { useState, useEffect } from "react";
import { KeyRound, Copy, RefreshCw, Check } from "lucide-react";
import { motion } from "motion/react";

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let res = "";
    for (let i = 0; i < length; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeNumbers, includeSymbols, includeUppercase]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <KeyRound className="w-8 h-8 text-teal-400" />
          Password Generator
        </h2>
        <p className="text-neutral-400">Create strong, secure passwords instantly.</p>
      </div>

      <div className="glass-panel border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-8">
        {/* Output */}
        <div className="relative group">
          <div className="w-full bg-neutral-900 border border-neutral-700/50 rounded-2xl p-6 pr-24 text-xl md:text-3xl font-mono text-white break-all flex items-center min-h-[100px]">
             {password}
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <button 
              onClick={generatePassword}
              className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              onClick={copyToClipboard}
              className="p-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-300 font-medium tracking-wide">Password Length</span>
              <span className="text-black font-bold bg-yellow-500 px-3 py-1 rounded-lg">{length}</span>
            </div>
            <input 
              type="range" 
              min="8" max="64" 
              value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-800/50">
            {[
              { label: "Uppercase", state: includeUppercase, set: setIncludeUppercase },
              { label: "Numbers", state: includeNumbers, set: setIncludeNumbers },
              { label: "Symbols", state: includeSymbols, set: setIncludeSymbols },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${
                  opt.state ? "bg-yellow-500 border-yellow-500 text-black" : "bg-neutral-800 border-neutral-700 group-hover:border-neutral-600"
                }`}>
                  {opt.state && <Check className="w-4 h-4" />}
                </div>
                <span className={`text-sm font-medium ${opt.state ? "text-white" : "text-neutral-400"}`}>
                  {opt.label}
                </span>
                <input 
                  type="checkbox" 
                  checked={opt.state} 
                  onChange={(e) => opt.set(e.target.checked)} 
                  className="hidden" 
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
