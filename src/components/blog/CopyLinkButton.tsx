"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = window.location.href;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={copyLink}
      className="w-11 h-11 rounded-full bg-white border border-brand-200 text-gray-400 hover:text-brand-600 hover:border-brand-400 flex items-center justify-center transition-all relative group shadow-sm"
      aria-label="Copiar link do artigo"
    >
      {copied ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <Link2 className="w-5 h-5" />
      )}
      <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {copied ? "Link copiado!" : "Copiar link"}
      </span>
    </button>
  );
}
