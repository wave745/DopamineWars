import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartTimeFrame } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Chart, registerables } from "chart.js";
import { apiRequest } from "@/lib/queryClient";

Chart.register(...registerables);

export default function LiveChart() {
  const [timeFrame, setTimeFrame] = useState<ChartTimeFrame>("24H");
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { data: chartData } = useQuery({
    queryKey: [`/api/chart/${timeFrame}`],
  });

  // Clean up chart instance on unmount
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // Initialize and update chart when data changes
  useEffect(() => {
    if (!chartRef.current || !chartData) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // If chart already exists, destroy it
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new gradient
    const createGradient = (color: string) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, `${color}50`);
      gradient.addColorStop(1, `${color}01`);
      return gradient;
    };

    const greenGradient = createGradient('#10B981');
    const redGradient = createGradient('#EF4444');
    const purpleGradient = createGradient('#8B5CF6');
    const yellowGradient = createGradient('#FBBF24');

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Core Dopamine',
            data: chartData.coreDopamine,
            borderColor: '#10B981',
            backgroundColor: greenGradient,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            borderWidth: 3,
          },
          {
            label: 'Liquidation Moments',
            data: chartData.liquidationMoments,
            borderColor: '#EF4444',
            backgroundColor: redGradient,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            borderWidth: 3,
          },
          {
            label: 'Chill but Potent',
            data: chartData.chillPotent,
            borderColor: '#8B5CF6',
            backgroundColor: purpleGradient,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            borderWidth: 3,
          },
          {
            label: 'Fun, Fast Hits',
            data: chartData.funFastHits,
            borderColor: '#FBBF24',
            backgroundColor: yellowGradient,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            borderWidth: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#1F2937',
            titleColor: '#FFFFFF',
            bodyColor: '#9CA3AF',
            borderColor: '#3B82F6',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#1F293730',
              drawBorder: false,
            },
            ticks: {
              color: '#9CA3AF'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#9CA3AF'
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      },
    });

    // Simulate live updates for the chart
    const interval = setInterval(() => {
      if (chartInstance.current) {
        const datasets = chartInstance.current.data.datasets;
        
        datasets.forEach(dataset => {
          const data = dataset.data as number[];
          data.shift();
          
          // Add random value fluctuation based on last value 
          const lastValue = data[data.length - 1] as number;
          const newValue = Math.max(5, Math.min(90, lastValue + (Math.random() - 0.5) * 20));
          data.push(newValue);
        });
        
        chartInstance.current.update('none');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [chartData]);

  const handleTimeFrameChange = (newTimeFrame: ChartTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <section className="py-8 md:py-12 mb-12 bg-muted/30 rounded-xl backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 px-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-sans mb-2">
              <span className="text-[#10B981]">Live</span> Dopamine Index
            </h2>
            <p className="text-muted-foreground">Real-time emotional engagement tracking</p>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-3 text-sm">
            <Button 
              variant={timeFrame === "24H" ? "default" : "secondary"} 
              size="sm" 
              className="rounded-full"
              onClick={() => handleTimeFrameChange("24H")}
            >
              24H
            </Button>
            <Button 
              variant={timeFrame === "7D" ? "default" : "secondary"} 
              size="sm" 
              className="rounded-full"
              onClick={() => handleTimeFrameChange("7D")}
            >
              7D
            </Button>
            <Button 
              variant={timeFrame === "30D" ? "default" : "secondary"} 
              size="sm" 
              className="rounded-full"
              onClick={() => handleTimeFrameChange("30D")}
            >
              30D
            </Button>
          </div>
        </div>
        
        <div className="relative h-[300px] w-full p-4">
          <canvas ref={chartRef}></canvas>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-6 px-4">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-[#10B981]"></span>
            <span className="text-sm text-white">Core dopamine</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-[#EF4444]"></span>
            <span className="text-sm text-white">Liquidation moments</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-[#8B5CF6]"></span>
            <span className="text-sm text-white">Chill but potent</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-[#FBBF24]"></span>
            <span className="text-sm text-white">Fun, fast hits</span>
          </div>
        </div>
      </div>
    </section>
  );
}
