'use client';

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CurrencyPair {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
}

const initialData: CurrencyPair[] = [
  { pair: "ADA/USD", price: 0.485, change: 0.0125, changePercent: 2.65 },
  { pair: "SOL/USD", price: 98.75, change: 3.45, changePercent: 3.62 },
  { pair: "XRP/USD", price: 0.6125, change: 0.005, changePercent: 0.81 },
  { pair: "MATIC/USD", price: 0.895, change: 0.0275, changePercent: 3.17 },
];

export function CurrencyPairs() {
  const [pairs, setPairs] = useState(initialData);
  const [colors, setColors] = useState<boolean[]>(initialData.map(() => true));

  useEffect(() => {
    const intervals = pairs.map((_, index) => {
      const intervalTime = 1000 + Math.random() * 2000;

      return setInterval(() => {
        // Toggle color direction
        setColors(prev => {
          const newColors = [...prev];
          newColors[index] = !newColors[index];
          return newColors;
        });

        // Update price data
        setPairs(prev => {
          const newPairs = [...prev];
          const changeAmount = (Math.random() - 0.5) * (newPairs[index].price * 0.01);
          newPairs[index].price = parseFloat((newPairs[index].price + changeAmount).toFixed(2));
          newPairs[index].change = parseFloat(changeAmount.toFixed(2));
          newPairs[index].changePercent = parseFloat(((changeAmount / newPairs[index].price) * 100).toFixed(2));
          return newPairs;
        });
      }, intervalTime);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="glass-card rounded-2xl p-6 bg-gray-900/70 backdrop-blur-md border border-gray-800 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Currency Pairs</h2>
        <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse-slow" />
      </div>

      <div className="flex flex-col gap-4">
        {pairs.map((currency, index) => {
          const isPositive = colors[index];
          const colorClass = isPositive ? "text-green-500" : "text-red-500";

          return (
            <div
              key={currency.pair}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 shadow-md transition duration-300"
            >
              {/* Left: Icon and Label */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-600 shadow-inner">
                  <span className="text-sm font-bold text-white">
                    {currency.pair.split('/')[0].slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{currency.pair}</p>
                  <p className="text-sm text-gray-400">24h Volume: 2.4B</p>
                </div>
              </div>

              {/* Right: Price and Change */}
              <div className="text-right">
                <p className={`text-sm font-bold ${colorClass}`}>
                  ${currency.price.toLocaleString()}
                </p>
                <div className={`flex items-center gap-1 text-sm ${colorClass}`}>
                  {isPositive ? (
                    <TrendingUp className={`h-4 w-4 ${colorClass}`} />
                  ) : (
                    <TrendingDown className={`h-4 w-4 ${colorClass}`} />
                  )}
                  <span>
                    {currency.change > 0 ? "+" : "-"}
                    {Math.abs(currency.change).toFixed(2)} (
                    {currency.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
