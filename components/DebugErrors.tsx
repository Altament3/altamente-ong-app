"use client";

import { useEffect } from "react";

export default function DebugErrors() {
  useEffect(() => {
    // Marcador visible: si esto aparece, React SÍ está funcionando
    const banner = document.createElement("div");
    banner.textContent = "✅ React está funcionando";
    banner.style.cssText =
      "position:fixed;top:0;left:0;right:0;background:#059669;color:white;padding:8px;text-align:center;z-index:99999;font-size:14px;";
    document.body.prepend(banner);

    // Capturar lo que React reporta por console.error (los errores de
    // hidratación no siempre disparan window.onerror)
    const originalError = window.console.error;
    window.console.error = (...args: any[]) => {
      alert("CONSOLE ERROR: " + args.map((a) => String(a)).join(" | "));
      originalError(...args);
    };

    function handleError(event: ErrorEvent) {
      alert("ERROR: " + event.message + "\n" + (event.error?.stack || ""));
    }
    function handleRejection(event: PromiseRejectionEvent) {
      alert("PROMISE ERROR: " + JSON.stringify(event.reason));
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      window.console.error = originalError;
    };
  }, []);

  return null;
}