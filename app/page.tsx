"use client";

import { useState, useEffect, useCallback } from "react";
import ActionButton from "@/components/action-button";
import ServoCard from "@/components/servo-card";

import {
  Cpu,
  PlayCircle,
  Activity,
  Square,
  RefreshCw,
  Settings2,
  SkipForward,
  SkipBack,
} from "lucide-react";

interface ServoState {
  [key: string]: number;
}

const PIN_MAP: Record<string, string> = {
  "12": "Index (Left)",
  "18": "Middle (Left)",
  "13": "Index (Right)",
  "19": "Middle (Right)",
};

export default function MarionnetteControl() {
  const [state, setState] = useState<ServoState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const isDisabled = !isConnected;
  const [isReceiverRunning, setIsReceiverRunning] = useState(false);

  type Toast = {
    id: number;
    type: "success" | "error";
    message: string;
  };

  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: "success" | "error", message: string) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (error && typeof error === "object" && "message" in error) {
      return String((error as { message: unknown }).message);
    }
    if (typeof error === "string") return error;
    return "Unknown error";
  }

  useEffect(() => {
    let socket: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      const WS_URL = `ws://${window.location.hostname}:8000/ws`;

      socket = new WebSocket(WS_URL);

      socket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);

        setState(null);

        reconnectTimeout = setTimeout(connect, 2000);
      };

      socket.onerror = () => {
        socket.close();
        setState(null);
      };

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "servo_update") {
            setState(msg.data);
          }
        } catch (err) {
          console.error("JSON parse error:", err);
        }
      };
    };

    connect();

    return () => {
      socket?.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  const sendCommand = useCallback(
    async (route: string) => {
      if (!isConnected) {
        addToast("error", "WebSocket not connected");
        return;
      }

      try {
        const res = await fetch(
          `http://${window.location.hostname}:8000${route}`,
          { method: "POST" },
        );

        let data = null;

        try {
          data = await res.json();
        } catch {
          // réponse non JSON
        }

        if (!res.ok) {
          throw new Error(
            data?.detail || data?.message || res.statusText || "Unknown error",
          );
        }

        if (route === "/start_receiver") setIsReceiverRunning(true);
        if (route === "/stop_receiver") setIsReceiverRunning(false);

        addToast("success", `${route} executed successfully`);
      } catch (err: unknown) {
        addToast("error", `${route} failed: ${getErrorMessage(err)}`);
      }
    },
    [isConnected],
  );

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Cpu className="text-blue-400 w-8 h-8" />
              Between Threads <span className="text-blue-400">OS</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Raspberry Pi Controller Dashboard
            </p>
          </div>

          <div
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-500 ${
              isConnected
                ? "bg-green-500/10 text-green-400 border-green-500/50"
                : "bg-red-500/10 text-red-400 border-red-500/50"
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
              }`}
            ></span>
            {isConnected ? "Online" : "Offline"}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Actions Panel */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium flex items-center gap-2 mb-4">
              <PlayCircle className="w-5 h-5 text-slate-400" />
              Quick action
            </h2>

            <ActionButton
              label="Start position"
              icon={<SkipForward size={18} className="text-blue-500" />}
              color="hover:bg-blue-500/20"
              onClick={() => sendCommand("/start")}
              disabled={isDisabled}
            />
            <ActionButton
              label={
                isReceiverRunning
                  ? "Stop real time control"
                  : "Launch real time control"
              }
              icon={
                isReceiverRunning ? (
                  <Square size={18} className="text-red-500" />
                ) : (
                  <Activity size={18} className="text-green-500" />
                )
              }
              color={
                isReceiverRunning
                  ? "hover:bg-red-500/20"
                  : "hover:bg-green-500/20"
              }
              onClick={() =>
                sendCommand(
                  isReceiverRunning ? "/stop_receiver" : "/start_receiver",
                )
              }
              disabled={isDisabled}
            />
            <ActionButton
              label="End position"
              icon={<SkipBack size={18} className="text-yellow-500" />}
              color="hover:bg-yellow-500/20"
              onClick={() => sendCommand("/end")}
              disabled={isDisabled}
            />
          </section>

          {/* Monitoring Panel */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-slate-400" />
              Servos states
            </h2>

            <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
              {!state ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 italic">
                  <RefreshCw className="w-10 h-10 animate-spin mb-4 opacity-20" />
                  <p>Waiting for data...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.entries(state).map(([pin, value]) => (
                    <ServoCard
                      key={pin}
                      name={PIN_MAP[pin] || `Servo ${pin}`}
                      value={value}
                    />
                  ))}
                </div>
              )}

              {state && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <details className="cursor-pointer group">
                    <summary className="text-[10px] uppercase tracking-widest text-slate-500 font-bold group-hover:text-slate-300 transition-colors">
                      Raw Data Inspector
                    </summary>
                    <pre className="mt-3 p-4 bg-black/40 rounded-lg text-[11px] text-blue-300 font-mono overflow-x-auto border border-white/5">
                      {JSON.stringify(state, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-lg border text-sm font-medium backdrop-blur-md transition-all
              ${
                toast.type === "success"
                  ? "bg-green-500/10 border-green-500/40 text-green-400"
                  : "bg-red-500/10 border-red-500/40 text-red-400"
              }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </main>
  );
}
