import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';

const TwistzzEarningsReport = () => {
  // Tournament comparison data
  const tournamentComparisonData = [
    {
      tournament: "ESL Pro League S17",
      oldShare: 20000,
      newShare: 16000
    },
    {
      tournament: "BLAST Premier Fall",
      oldShare: 8500,
      newShare: 6800
    },
    {
      tournament: "IEM Katowice",
      oldShare: 40000,
      newShare: 32000
    },
    {
      tournament: "IEM Cologne",
      oldShare: 40000,
      newShare: 32000
    },
    {
      tournament: "PGL Major Antwerp",
      oldShare: 50000,
      newShare: 40000
    }
  ];

  // Impact of different models on $500k prize pool
  const modelImpactData = [
    {
      model: "Pre-2025 Model",
      playerShare: 50000
    },
    {
      model: "Standard (80/20)",
      playerShare: 40000
    },
    {
      model: "PGL (50/50)",
      playerShare: 25000
    },
    {
      model: "IEM Melbourne (30/70)",
      playerShare: 15000
    }
  ];

  // Yearly earnings projection
  const yearlyProjectionData = [
    {
      year: "Pre-2025 Model",
      earnings: 158500
    },
    {
      year: "Standard 80/20",
      earnings: 126800
    },
    {
      year: "Extreme 50/50",
      earnings: 79250
    },
    {
      year: "IEM Melbourne 30/70",
      earnings: 47550
    }
  ];

  // Percentage decrease by model
  const percentageDecreaseData = [
    {
      model: "Standard 80/20",
      decrease: 20
    },
    {
      model: "PGL 50/50",
      decrease: 50
    },
    {
      model: "IEM Melbourne 30/70",
      decrease: 70
    }
  ];

  // Tournament earnings breakdown by tournament tier
  const earningsBreakdownData = [
    { name: 'S-Tier (Majors)', value: 90000, color: '#8884d8' },
    { name: 'A-Tier (ESL/BLAST)', value: 40000, color: '#83a6ed' },
    { name: 'B-Tier', value: 20000, color: '#8dd1e1' },
    { name: 'C-Tier', value: 8500, color: '#82ca9d' },
  ];

  // Prize retention comparison
  const retentionData = [
    {
      category: 'Pre-2025 Model',
      retention: 100,
      loss: 0,
    },
    {
      category: 'Standard 80/20',
      retention: 80,
      loss: 20,
    },
    {
      category: 'PGL 50/50',
      retention: 50, 
      loss: 50,
    },
    {
      category: 'IEM Melbourne 30/70',
      retention: 30,
      loss: 70,
    },
  ];

  // Career earnings trend
  const careerTrendData = [
    { year: '2020', earnings: 120000 },
    { year: '2021', earnings: 140000 },
    { year: '2022', earnings: 180000 },
    { year: '2023', earnings: 158500 },
    { year: '2024 (Est.)', earnings: 126800 },
    { year: '2025 (Proj.)', earnings: 101440 },
  ];

  // Colors
  const BRAND_COLORS = {
    primary: '#6366f1',       // Indigo
    secondary: '#ec4899',     // Pink
    accent: '#8b5cf6',        // Purple
    success: '#10b981',       // Emerald
    warning: '#f59e0b',       // Amber
    danger: '#ef4444',        // Red
    info: '#3b82f6',          // Blue
    neutral: '#6b7280',       // Gray
  };
  
  const CHART_COLORS = [
    BRAND_COLORS.primary,
    BRAND_COLORS.success,
    BRAND_COLORS.warning,
    BRAND_COLORS.danger,
    BRAND_COLORS.info,
    BRAND_COLORS.accent
  ];

  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
              {entry.name}: {entry.value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              })}
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };

  const CustomPercentageTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-3">Tournament Earnings Impact Analysis</h1>
              <h2 className="text-2xl font-medium mb-2">2025 Club Share Model</h2>
              <p className="text-white/90">Prepared for: Russel "Twistzz" Van Dulken</p>
              <p className="text-white/80">March 8, 2025</p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold">T</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Executive Summary Card */}
          <section className="mb-12">
            <div className="flex items-center space-x-2 mb-5">
              <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Executive Summary</h2>
            </div>
            <div className="bg-indigo-50 rounded-xl p-6 border-l-4 border-indigo-500 shadow-sm">
              <p className="text-gray-700 mb-4 leading-relaxed">
                This report analyzes the financial impact of the 2025 "Club Share" prize distribution model on your tournament earnings compared to the pre-2025
                system. The analysis examines historical tournament performances and projects how the new prize distribution structure would affect similar results in the future.
              </p>
              <div className="mt-5">
                <h3 className="font-bold text-lg mb-3 text-indigo-700">Key Findings:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100 flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">20% Reduction</p>
                      <p className="text-gray-600 text-sm">Under the standard 80/20 split, your tournament earnings would decrease by approximately 20%</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100 flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Up to 70% Loss</p>
                      <p className="text-gray-600 text-sm">More extreme splits (like IEM Melbourne's 70/30) could reduce your earnings by up to 70% for the same placement</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100 flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">$31,700 Annual Impact</p>
                      <p className="text-gray-600 text-sm">Based on your recent tournament history, this represents a potential annual reduction of $31,700 under the standard model</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100 flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Variable Impact</p>
                      <p className="text-gray-600 text-sm">The impact varies significantly based on each tournament's specific club share percentage</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Career Earnings Trend */}
          <section className="mb-12">
            <div className="flex items-center space-x-2 mb-5">
              <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Career Earnings Trend</h2>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <p className="text-gray-600 mb-6">
                Your historical earnings trend and projected impact of the new club share model:
              </p>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={careerTrendData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BRAND_COLORS.primary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={BRAND_COLORS.primary} stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" stroke="#666" />
                    <YAxis tickFormatter={formatCurrency} stroke="#666" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      name="Tournament Earnings" 
                      stroke={BRAND_COLORS.primary} 
                      fillOpacity={1} 
                      fill="url(#colorEarnings)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Tournament-by-Tournament Analysis */}
          <section className="mb-12">
            <div className="flex items-center space-x-2 mb-5">
              <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Tournament Analysis</h2>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <p className="text-gray-600 mb-6">
                Comparison of your estimated earnings from recent major tournaments under both the pre-2025 model and the new 80/20 club share model:
              </p>
              <div className="h-96 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={tournamentComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="tournament" angle={-45} textAnchor="end" height={80} tick={{ fill: '#666' }} />
                    <YAxis tickFormatter={formatCurrency} tick={{ fill: '#666' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Bar dataKey="oldShare" name="Pre-2025 Model" fill={BRAND_COLORS.primary} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="newShare" name="2025 Club Share (80/20)" fill={BRAND_COLORS.success} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
                      <th className="py-3 px-4 text-left font-medium">Tournament</th>
                      <th className="py-3 px-4 text-right font-medium">Team Prize</th>
                      <th className="py-3 px-4 text-right font-medium">Pre-2025 Share</th>
                      <th className="py-3 px-4 text-right font-medium">2025 Share (80/20)</th>
                      <th className="py-3 px-4 text-right font-medium">Difference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-800">ESL Pro League S17 (2023)</td>
                      <td className="py-3 px-4 text-right text-gray-600">$200,000</td>
                      <td className="py-3 px-4 text-right font-medium text-indigo-600">$20,000</td>
                      <td className="py-3 px-4 text-right text-gray-800">$16,000</td>
                      <td className="py-3 px-4 text-right text-red-500 font-medium">-$4,000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-800">BLAST Premier Fall (2023)</td>
                      <td className="py-3 px-4 text-right text-gray-600">$85,000</td>
                      <td className="py-3 px-4 text-right font-medium text-indigo-600">$8,500</td>
                      <td className="py-3 px-4 text-right text-gray-800">$6,800</td>
                      <td className="py-3 px-4 text-right text-red-500 font-medium">-$1,700</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-800">IEM Katowice 2022</td>
                      <td className="py-3 px-4 text-right text-gray-600">$400,000</td>
                      <td className="py-3 px-4 text-right font-medium text-indigo-600">$40,000</td>
                      <td className="py-3 px-4 text-right text-gray-800">$32,000</td>
                      <td className="py-3 px-4 text-right text-red-500 font-medium">-$8,000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-800">IEM Cologne 2022</td>
                      <td className="py-3 px-4 text-right text-gray-600">$400,000</td>
                      <td className="py-3 px-4 text-right font-medium text-indigo-600">$40,000</td>
                      <td className="py-3 px-4 text-right text-gray-800">$32,000</td>
                      <td className="py-3 px-4 text-right text-red-500 font-medium">-$8,000</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-800">PGL Major Antwerp 2022</td>
                      <td className="py-3 px-4 text-right text-gray-600">$500,000</td>
                      <td className="py-3 px-4 text-right font-medium text-indigo-600">$50,000</td>
                      <td className="py-3 px-4 text-right text-gray-800">$40,000</td>
                      <td className="py-3 px-4 text-right text-red-500 font-medium">-$10,000</td>
                    </tr>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-3 px-4 text-gray-800">Total</td>
                      <td className="py-3 px-4 text-right text-gray-800">$1,585,000</td>
                      <td className="py-3 px-4 text-right text-indigo-700">$158,500</td>
                      <td className="py-3 px-4 text-right text-gray-800">$126,800</td>
                      <td className="py-3 px-4 text-right text-red-600">-$31,700</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          
          {/* Distribution Models Data Visualization */}
          <section className="mb-12">
            <div className="flex items-center space-x-2 mb-5">
              <div className="w-1 h-8 bg-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Distribution Models Comparison</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Revenue Retention by Model</h3>
                <p className="text-gray-600 mb-4">
                  Percentage of prize money retained by players vs. organizations under different models:
                </p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={retentionData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                      stackOffset="expand"
                      barSize={30}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis 
                        type="number" 
                        domain={[0, 100]} 
                        tickFormatter={formatPercentage} 
                        tick={{ fill: '#666' }}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="category" 
                        scale="band" 
                        width={120}
                        tick={{ fill: '#666' }}
                      />
                      <Tooltip content={<CustomPercentageTooltip />} />
                      <Legend />
                      <Bar dataKey="retention" name="Player Retention" stackId="a" fill={BRAND_COLORS.success} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="loss" name="Org Share" stackId="a" fill={BRAND_COLORS.danger} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Major Tournament Prize Share</h3>
                <p className="text-gray-600 mb-4">
                  How a $500,000 tournament prize would be distributed to you under different models:
                </p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={modelImpactData}
                      margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="model" angle={-15} textAnchor="end" height={60} tick={{ fill: '#666' }} />
                      <YAxis tickFormatter={formatCurrency} tick={{ fill: '#666' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="playerShare" 
                        name="Player Share from $500k Prize" 
                        fill={BRAND_COLORS.accent}
                        background={{ fill: '#eee' }}
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Percentage Decrease by Model</h3>
                <p className="text-gray-600 mb-4">
                  The percentage decrease in earnings varies dramatically by tournament model:
                </p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={percentageDecreaseData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="decreaseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BRAND_COLORS.danger} stopOpacity={0.8}/>
                          <stop offset="100%" stopColor={BRAND_COLORS.warning} stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="model" tick={{ fill: '#666' }} />
                      <YAxis tickFormatter={formatPercentage} tick={{ fill: '#666' }} />
                      <Tooltip content={<CustomPercentageTooltip />} />
                      <Bar 
                        dataKey="decrease" 
                        name="Percentage Decrease" 
                        fill="url(#decreaseGradient)" 
                        radius={[4, 4, 0, 0]}
                      >
                        {percentageDecreaseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          {/* Projected Annual Impact */}
          <section className="mb-12">
            <div className="flex items-center space-x-2 mb-5">
              <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Projected Annual Impact</h2>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <p className="text-gray-600 mb-4">
                If we apply the different club share models to your historical tournament performance, here's how your annual earnings would be affected:
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={yearlyProjectionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" tick={{ fill: '#666' }} />
                      <YAxis tickFormatter={formatCurrency} tick={{ fill: '#666' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="earnings" 
                        name="Projected Annual Earnings" 
                        fill={BRAND_COLORS.success} 
                        radius={[4, 4, 0, 0]}
                      >
                        {yearlyProjectionData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? BRAND_COLORS.primary : 
                                 index === 1 ? BRAND_COLORS.success : 
                                 index === 2 ? BRAND_COLORS.warning : 
                                 BRAND_COLORS.danger} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={earningsBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {earningsBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          {/* Conclusion and Recommendations */}
          <section className="mb-10">
            <div className="flex items-center space-x-2 mb-5">
              <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Conclusion and Recommendations</h2>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
              <p className="text-gray-700 mb-5 leading-relaxed">
                The introduction of the Club Share model in 2025 represents a significant financial impact on player tournament earnings. Based on the analysis:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800">Standard Impact</h3>
                  </div>
                  <p className="text-gray-600 text-sm">The common 80/20 split implemented by ESL would reduce your tournament earnings by approximately 20%</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800">Variable Impact</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Some tournaments (IEM Melbourne, PGL) are implementing more extreme splits that could reduce your take from tournament wins by 50-70%</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800">Financial Planning</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Based on your tournament history, this could represent a loss of $31,700+ annually under the standard model, and potentially more under extreme splits</p>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-3 text-indigo-700">Recommendations:</h3>
              <div className="bg-white rounded-lg p-5 shadow-sm border border-indigo-100">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Review compensation structures with your organization to potentially offset tournament earnings reductions</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Prioritize tournaments with more favorable player/club split ratios when possible</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Consider additional revenue streams (content creation, sponsorships) to diversify income sources</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Monitor how different tournament organizers implement their club share models, as these may evolve</p>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-600">
            <div className="flex flex-col items-center">
              <div className="flex space-x-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              </div>
              <p className="text-sm mb-1">Analysis based on historical tournament data and announced 2025 prize distribution models</p>
              <p className="text-sm opacity-75">Data current as of March 8, 2025</p>
              <p className="text-xs mt-4 opacity-50">CONFIDENTIAL DOCUMENT - For Russel "Twistzz" Van Dulken only</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default TwistzzEarningsReport;