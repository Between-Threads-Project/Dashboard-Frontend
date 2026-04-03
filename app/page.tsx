"use client";

import { useState, useEffect, useCallback } from "react";
import ActionButton from "@/components/action-button";
import ServoCard from "@/components/servo-card";

import {
  Cpu,
  PlayCircle,
  Play,
  Activity,
  Square,
  RefreshCw,
  Settings2,
} from "lucide-react";

interface ServoState {
  [key: string]: number;
}

export default function MarionnetteControl() {
  const [state, setState] = useState<ServoState | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Remplace par l'IP de ta Raspberry si nécessaire
    const socket = new WebSocket(`ws://${window.location.host}/ws`);

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setState(data);
      } catch (err) {
        console.error("Erreur parsing JSON:", err);
      }
    };

    return () => socket.close();
  }, []);

  const sendCommand = useCallback(async (route: string) => {
    try {
      await fetch(route, { method: "POST" });
    } catch (err) {
      console.error(`Erreur lors de l'appel à ${route}:`, err);
    }
  }, []);

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
              className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
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
              icon={<Play size={18} className="text-green-500" />}
              color="hover:bg-green-500/20"
              onClick={() => sendCommand("/start")}
            />
            <ActionButton
              label="Launch"
              icon={<Activity size={18} className="text-blue-500" />}
              color="hover:bg-blue-500/20"
              onClick={() => sendCommand("/main")}
            />
            <ActionButton
              label="End position"
              icon={<Square size={18} className="text-red-500" />}
              color="hover:bg-red-500/20"
              onClick={() => sendCommand("/end")}
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
                  {Object.entries(state).map(([name, value]) => (
                    <ServoCard key={name} name={name} value={value} />
                  ))}
                </div>
              )}

              {/* Debug View */}
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
    </main>
  );
}
