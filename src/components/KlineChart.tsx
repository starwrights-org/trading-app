'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface KlineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface KlineChartProps {
  data: KlineData[];
  symbol: string;
  theme?: string;
}

export default function KlineChart({ data, symbol, theme = 'dark' }: KlineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, theme);
    }

    const chart = chartInstance.current;

    // 准备数据
    const dates = data.map(d => d.time);
    const ohlc = data.map(d => [d.open, d.close, d.low, d.high]);
    const volumes = data.map((d, i) => {
      const isUp = d.close >= d.open;
      return {
        value: d.volume,
        itemStyle: {
          color: isUp ? '#22c55e' : '#ef4444',
        }
      };
    });

    // 颜色配置（绿涨红跌）
    const upColor = '#22c55e';
    const downColor = '#ef4444';
    const bgColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
    const gridColor = theme === 'dark' ? '#333333' : '#e5e7eb';

    const option = {
      backgroundColor: 'transparent',
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        borderColor: gridColor,
        textStyle: {
          color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
        },
        formatter: (params: any) => {
          const candlestick = params.find((p: any) => p.seriesType === 'candlestick');
          const volume = params.find((p: any) => p.seriesName === '成交量');
          if (!candlestick) return '';
          
          const [open, close, low, high] = candlestick.data;
          const change = close - open;
          const changePercent = ((change / open) * 100).toFixed(2);
          const isUp = change >= 0;
          const color = isUp ? upColor : downColor;
          
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${candlestick.axisValue}</div>
              <div>开: <span style="color: ${textColor}">${open.toFixed(2)}</span></div>
              <div>高: <span style="color: ${upColor}">${high.toFixed(2)}</span></div>
              <div>低: <span style="color: ${downColor}">${low.toFixed(2)}</span></div>
              <div>收: <span style="color: ${color}">${close.toFixed(2)}</span></div>
              <div>涨跌: <span style="color: ${color}">${isUp ? '+' : ''}${change.toFixed(2)} (${isUp ? '+' : ''}${changePercent}%)</span></div>
              ${volume ? `<div>成交量: ${(volume.data.value / 10000).toFixed(0)}万</div>` : ''}
            </div>
          `;
        }
      },
      axisPointer: {
        link: [{ xAxisIndex: 'all' }],
        label: {
          backgroundColor: '#777',
        }
      },
      grid: [
        {
          left: '10%',
          right: '5%',
          top: '5%',
          height: '55%',
        },
        {
          left: '10%',
          right: '5%',
          top: '70%',
          height: '20%',
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: dates,
          scale: true,
          boundaryGap: true,
          axisLine: { lineStyle: { color: gridColor } },
          axisLabel: { color: textColor, fontSize: 10 },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
        },
        {
          type: 'category',
          gridIndex: 1,
          data: dates,
          scale: true,
          boundaryGap: true,
          axisLine: { lineStyle: { color: gridColor } },
          axisLabel: { show: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: { show: false },
          axisLine: { lineStyle: { color: gridColor } },
          axisLabel: { color: textColor, fontSize: 10 },
          splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          splitLine: { show: false },
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 50,
          end: 100,
        },
        {
          show: false,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: '5%',
          start: 50,
          end: 100,
        }
      ],
      series: [
        {
          name: symbol,
          type: 'candlestick',
          data: ohlc,
          itemStyle: {
            color: upColor,      // 涨（绿）
            color0: downColor,   // 跌（红）
            borderColor: upColor,
            borderColor0: downColor,
          },
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
        }
      ]
    };

    chart.setOption(option);

    // 响应式
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, symbol, theme]);

  // 主题切换时重新初始化
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
  }, [theme]);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        暂无K线数据
      </div>
    );
  }

  return (
    <div ref={chartRef} style={{ width: '100%', height: '350px' }} />
  );
}
