"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type SensorData = {
  id: string;
  temperature: number;
  soilMoisture: number;
  timestamp?: any;
};

export default function DashboardPage() {
  const [data, setData] = useState<SensorData[]>([]);
  const [status, setStatus] = useState<"loading" | "connected" | "error">(
    "loading",
  );

  useEffect(() => {
    async function loadData() {
      try {
        const snapshot = await getDocs(collection(db, "sensors"));

        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SensorData[];

        result.sort((a, b) => {
          const timeA = a.timestamp?.toMillis?.() ?? 0;
          const timeB = b.timestamp?.toMillis?.() ?? 0;
          return timeB - timeA;
        });

        setData(result);
        setStatus("connected");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    }

    loadData();

    
  }, []);

  const latest = data[0];

  const temperature = latest?.temperature ?? 0;
  const soilMoisture = latest?.soilMoisture ?? 0;

  const averageTemperature =
    data.length > 0
      ? (
          data.reduce((sum, item) => sum + Number(item.temperature || 0), 0) /
          data.length
        ).toFixed(1)
      : "0";

  const averageMoisture =
    data.length > 0
      ? (
          data.reduce((sum, item) => sum + Number(item.soilMoisture || 0), 0) /
          data.length
        ).toFixed(1)
      : "0";

  function formatDate(timestamp: any) {
    if (!timestamp) return "-";

    try {
      return timestamp.toDate().toLocaleString("th-TH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  }

  const chartData = [...data].reverse().map((item) => ({
      time: item.timestamp?.toDate().toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }),

      temperature: Number(item.temperature),
      soilMoisture: Number(item.soilMoisture),
    }));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <span className="text-lg">S</span>
            </div>

            <div>
              <h1 className="text-sm font-bold">Sensor Monitor</h1>

              <p className="text-[11px] text-slate-400">IoT Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "connected"
                    ? "bg-emerald-500"
                    : status === "error"
                      ? "bg-red-500"
                      : "bg-amber-500"
                }`}
              />

              <span className="text-xs font-medium text-emerald-700">
                {status === "connected"
                  ? "Connected"
                  : status === "error"
                    ? "Error"
                    : "Connecting"}
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            LIVE MONITORING
          </div>

          <h2 className="text-3xl font-bold tracking-tight">
            Environmental Dashboard
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            ติดตามข้อมูลจาก Sensor แบบเรียลไทม์
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {/* Temperature */}
          <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
            <div className="h-1 bg-orange-400" />

            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Temperature
                  </p>

                  <p className="mt-3 text-4xl font-bold text-slate-900">
                    {temperature}
                    <span className="ml-1 text-xl font-medium text-orange-500">
                      °C
                    </span>
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                  🌡️
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">Average</span>

                <span className="text-sm font-semibold text-orange-600">
                  {averageTemperature} °C
                </span>
              </div>
            </div>
          </div>

          {/* Moisture */}
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
            <div className="h-1 bg-blue-500" />

            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Soil Moisture
                  </p>

                  <p className="mt-3 text-4xl font-bold text-slate-900">
                    {soilMoisture}
                    <span className="ml-1 text-xl font-medium text-blue-500">
                      %
                    </span>
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  💧
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">Average</span>

                <span className="text-sm font-semibold text-blue-600">
                  {averageMoisture} %
                </span>
              </div>
            </div>
          </div>

          {/* Records */}
          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
            <div className="h-1 bg-violet-500" />

            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Records
                  </p>

                  <p className="mt-3 text-4xl font-bold text-slate-900">
                    {data.length}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-2xl">
                  📊
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">
                  Firestore collection
                </span>

                <p className="mt-1 text-sm font-semibold text-violet-600">
                  sensors
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
            <div className="h-1 bg-emerald-500" />

            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Sensor Status
                  </p>

                  <p className="mt-3 text-3xl font-bold text-emerald-600">
                    Online
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <span className="h-4 w-4 animate-pulse rounded-full bg-emerald-500" />
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">
                  Database connection
                </span>

                <p className="mt-1 text-sm font-semibold text-emerald-600">
                  Firestore Connected
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

  <div className="mb-6 flex items-start justify-between">

    <div>
      <h3 className="text-lg font-semibold text-slate-900">
        Sensor Trends
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        การเปลี่ยนแปลงของอุณหภูมิและความชื้นในดิน
      </p>
    </div>

    <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
      Latest readings
    </div>

  </div>

  <div className="h-[360px] w-full">

    <ResponsiveContainer width="100%" height="100%">

      <LineChart
        data={chartData}
        margin={{
          top: 10,
          right: 10,
          left: -10,
          bottom: 0,
        }}
      >

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e2e8f0"
          vertical={false}
        />

        <XAxis
          dataKey="time"
          tick={{
            fontSize: 12,
            fill: "#94a3b8",
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{
            fontSize: 12,
            fill: "#94a3b8",
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        />

        <Legend />

        <Line
          type="monotone"
          dataKey="temperature"
          name="Temperature (°C)"
          stroke="#f97316"
          strokeWidth={3}
          dot={false}
          activeDot={{
            r: 5,
          }}
        />

        <Line
          type="monotone"
          dataKey="soilMoisture"
          name="Soil Moisture (%)"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={false}
          activeDot={{
            r: 5,
          }}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

</div>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Table */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Latest Readings
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  ข้อมูล Sensor ล่าสุด
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                {data.length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs text-slate-400">
                    <th className="px-6 py-3 font-medium">Time</th>

                    <th className="px-6 py-3 font-medium">Temperature</th>

                    <th className="px-6 py-3 font-medium">Soil Moisture</th>

                    <th className="px-6 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data.slice(0, 8).map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(item.timestamp)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-orange-500">
                          {item.temperature} °C
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-500">
                          {item.soilMoisture} %
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Normal
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {data.length === 0 && (
                <div className="p-10 text-center text-sm text-slate-400">
                  No sensor data
                </div>
              )}
            </div>
          </section>

          {/* System */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="font-semibold">System Status</h3>

              <p className="mt-1 text-xs text-slate-400">สถานะระบบ</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Firestore
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">Database</p>
                </div>

                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Sensor</p>

                  <p className="mt-0.5 text-xs text-slate-400">Device</p>
                </div>

                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  Active
                </span>
              </div>

              <div className="rounded-xl bg-violet-50 p-4">
                <p className="text-xs text-violet-500">Collection</p>

                <p className="mt-1 font-semibold text-violet-700">sensors</p>
              </div>

              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-xs text-orange-500">Latest update</p>

                <p className="mt-1 text-sm font-semibold text-orange-700">
                  {formatDate(latest?.timestamp)}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
