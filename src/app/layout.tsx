"use client";

import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              color: "#e2e8f0",
              border: "1px solid #475569",
              borderRadius: "10px",
              fontSize: "14px",
              backdropFilter: "blur(8px)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
            },
            success: {
              duration: 3000,
              style: {
                background: "rgba(6, 78, 59, 0.95)",
                color: "#d1fae5",
                border: "1px solid #10b981",
                backdropFilter: "blur(8px)",
                boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2)",
              },
              iconTheme: {
                primary: "#34d399",
                secondary: "rgba(6, 78, 59, 0.95)",
              },
            },
            error: {
              duration: 5000,
              style: {
                background: "rgba(127, 29, 29, 0.95)",
                color: "#fecaca",
                border: "1px solid #ef4444",
                backdropFilter: "blur(8px)",
              },
              iconTheme: {
                primary: "#f87171",
                secondary: "rgba(127, 29, 29, 0.95)",
              },
            },
            loading: {
              style: {
                background: "rgba(30, 41, 59, 0.95)",
                color: "#e2e8f0",
                border: "1px solid #475569",
                backdropFilter: "blur(8px)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
