"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush,
  BarChart, Bar,
  PieChart, Pie, Cell,
  TooltipProps
} from "recharts";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// =========================
// Type Definitions
// =========================
interface ChartData {
  date: string;
  positive?: number;
  neutral?: number;
  negative?: number;
  positiveCount?: number;
  neutralCount?: number;
  negativeCount?: number;
}

interface TrendItem {
  _id: { date: string; label: "positive" | "neutral" | "negative" };
  avgScore: number;
  count?: number;
}

interface CustomPayload {
  dataKey: string;
  name: string;
  value: number;
  stroke: string;
}

type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: CustomPayload[];
  label?: string;
};

// =========================
// Custom Tooltip
// =========================
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        padding: "12px",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.3)",
        fontSize: "14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        color: "#fff",
      }}>
        <p style={{ fontWeight: 600 }}>
          {new Date(label || "").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
        {payload.map((p: CustomPayload) => (
          <p key={p.dataKey} style={{ color: p.stroke, margin: 0 }}>
            {p.name}: {(p.value! * 100).toFixed(1)}%{" "}
            {p.dataKey === "positive" ? "😊" : p.dataKey === "neutral" ? "😐" : "😠"}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// =========================
// Main Component
// =========================
export default function FeedbackTrendPage() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<ChartData[]>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<"line" | "bar" | "pie">("line");
  const router = useRouter();

  const COLORS = ["#4caf50", "#ff9800", "#f44336"];

  // =========================
  // Fetch Data
  // =========================
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/feedback/trend?range=${range}`)
      .then(res => res.json())
      .then(json => {
        const grouped: Record<string, ChartData> = {};
        let totalPositive = 0, totalNeutral = 0, totalNegative = 0;

        (json.data as TrendItem[]).forEach((item) => {
          const { date, label } = item._id;
          if (!grouped[date]) grouped[date] = { date };
          grouped[date][label] = item.avgScore;
          if (item.count !== undefined) grouped[date][`${label}Count`] = item.count;

          if (label === "positive") totalPositive += item.count || 1;
          if (label === "neutral") totalNeutral += item.count || 1;
          if (label === "negative") totalNegative += item.count || 1;
        });

        setData(Object.values(grouped));
        setPieData([
          { name: "Positive", value: totalPositive },
          { name: "Neutral", value: totalNeutral },
          { name: "Negative", value: totalNegative },
        ]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching trend data:", err);
        setLoading(false);
      });
  }, [range]);

  // =========================
  // Styles
  // =========================
  const glassCard = {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(18px)",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)"
  };

  const chartBtn = (isActive: boolean) => ({
    padding: "10px 18px",
    marginRight: "10px",
    borderRadius: "10px",
    border: "none",
    background: isActive
      ? "linear-gradient(135deg, #6b73ff, #000dff)"
      : "rgba(255,255,255,0.15)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 500,
    boxShadow: isActive ? "0 4px 15px rgba(107,115,255,0.5)" : "none",
    transition: "all 0.3s ease"
  });

  // =========================
  // UI
  // =========================
  return (
    <div style={{
      minHeight: "100vh",
      padding: "30px",
     background: "linear-gradient(135deg, #1f1c2c, #928dab)",
      fontFamily: "'Inter', sans-serif",
      color: "#fff"
    }}>
      <h2 style={{ marginBottom: "20px", fontSize: "1.8rem", fontWeight: 700 }}>
        Feedback Sentiment Trends
      </h2>

      {/* Range Selector */}
      <div style={glassCard}>
        <label style={{ marginRight: "10px" }}>Select Range:</label>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            outline: "none"
          }}
        >
          <option value="7d">Past 7 Days</option>
          <option value="30d">Past 30 Days</option>
          <option value="1y">Past Year</option>
        </select>
      </div>

      {/* Quick Stats */}
      <div style={{ ...glassCard, display: "flex", justifyContent: "space-around" }}>
        {pieData.map((p, i) => (
          <div key={p.name} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", margin: 0 }}>{p.name}</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: COLORS[i] }}>
              {p.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Type Selector */}
      <div style={{ ...glassCard, display: "flex", flexWrap: "wrap" }}>
        {["line", "bar", "pie"].map((chart) => (
          <button
            key={chart}
            style={chartBtn(activeChart === chart)}
            onClick={() => setActiveChart(chart as any)}
          >
            {chart.charAt(0).toUpperCase() + chart.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts */}
      {loading ? (
        <p>Loading trend data...</p>
      ) : (
        <div style={{ ...glassCard, overflow: "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChart}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              {activeChart === "line" && (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                    <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })} tick={{ fill: "#fff" }} />
                    <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fill: "#fff" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Brush dataKey="date" height={30} stroke="#8884d8" />
                    <Line type="monotone" dataKey="positive" stroke="#4caf50" name="Positive" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="neutral" stroke="#ff9800" name="Neutral" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="negative" stroke="#f44336" name="Negative" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {activeChart === "bar" && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                    <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })} tick={{ fill: "#fff" }} />
                    <YAxis tick={{ fill: "#fff" }} />
                    <Tooltip />
                    <Legend />
                    <Brush dataKey="date" height={30} stroke="#8884d8" />
                    <Bar dataKey="positiveCount" fill="#4caf50" />
                    <Bar dataKey="neutralCount" fill="#ff9800" />
                    <Bar dataKey="negativeCount" fill="#f44336" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeChart === "pie" && (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Back Button */}
      <button
        style={{
          ...chartBtn(false),
          width: "100%",
          marginTop: "20px",
          background: "linear-gradient(135deg, #ff7eb3, #ff758c)"
        }}
        onClick={() => router.push("/")}
      >
        Back to Feedback
      </button>
    </div>
  );
}
