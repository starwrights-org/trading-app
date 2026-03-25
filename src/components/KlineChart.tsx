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
      chartInstance.current = echarts.init(chartRef.current, undefined, {
        renderer: 'canvas',
      });
    }

    const chart = chartInstance.current;

    // 准备数据
    const dates = data.map(d => d.time);
    const ohlc = data.map(d => [d.open, d.close, d.low, d.high]);
    // HK convention: red=up, green=down
    const upColor = '#ef4444';
    const downColor = '#22c55e';
    const volumes = data.map((d) => {
      const isUp = d.close >= d.open;
      return {
        value: d.volume,
        itemStyle: {
          color: isUp ? upColor + '99' : downColor + '99',
        }
      };
    });

    const isDarkTheme = theme === 'dark' || theme === 'midnight';
    const textColor = isDarkTheme ? '#9ca3af' : '#6b7280';
    const gridColor = isDarkTheme ? '#333333' : '#e5e7eb';
    const crosshairLabelBg = isDarkTheme ? '#374151' : '#1f2937';

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: isDarkTheme ? '#ffffff60' : '#00000040',
            width: 0.5,
          },
          lineStyle: {
            color: isDarkTheme ? '#ffffff40' : '#00000030',
            width: 0.5,
            type: 'dashed',
          },
          label: {
            backgroundColor: crosshairLabelBg,
            color: '#f3f4f6',
            fontSize: 10,
            padding: [4, 6],
          },
        },
        confine: true,
        backgroundColor: isDarkTheme ? '#1f2937ee' : '#ffffffee',
        borderColor: gridColor,
        borderWidth: 1,
        padding: [8, 12],
        textStyle: {
          color: isDarkTheme ? '#f3f4f6' : '#1f2937',
          fontSize: 12,
        },
        extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);',
        formatter: (params: unknown) => {
          const paramArr = params as Array<{ seriesType: string; seriesName: string; axisValue: string; data: number[] | { value: number } }>;
          const candlestick = paramArr.find((p) => p.seriesType === 'candlestick');
          const volume = paramArr.find((p) => p.seriesName === '成交量');
          if (!candlestick) return '';
          
          const [open, close, low, high] = candlestick.data as number[];
          const change = close - open;
          const changePercent = ((change / open) * 100).toFixed(2);
          const isUp = change >= 0;
          const color = isUp ? upColor : downColor;
          
          return `
            <div style="font-size:12px;line-height:1.6;">
              <div style="font-weight:600;margin-bottom:4px;">${candlestick.axisValue}</div>
              <div>开: ${open.toFixed(2)}</div>
              <div>高: <span style="color:${upColor}">${high.toFixed(2)}</span></div>
              <div>低: <span style="color:${downColor}">${low.toFixed(2)}</span></div>
              <div>收: <span style="color:${color}">${close.toFixed(2)}</span></div>
              <div>涨跌: <span style="color:${color}">${isUp ? '+' : ''}${change.toFixed(2)} (${isUp ? '+' : ''}${changePercent}%)</span></div>
              ${volume ? `<div>成交量: ${((volume.data as { value: number }).value / 10000).toFixed(0)}万</div>` : ''}
            </div>
          `;
        }
      },
      axisPointer: {
        link: [{ xAxisIndex: 'all' }],
        label: {
          backgroundColor: crosshairLabelBg,
        }
      },
      grid: [
        {
          left: 48,
          right: 12,
          top: 12,
          height: '55%',
        },
        {
          left: 48,
          right: 12,
          top: '72%',
          height: '18%',
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: dates,
          boundaryGap: true,
          axisLine: { lineStyle: { color: gridColor } },
          axisLabel: { color: textColor, fontSize: 10, margin: 8 },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            show: true,
            label: { show: true },
          },
        },
        {
          type: 'category',
          gridIndex: 1,
          data: dates,
          boundaryGap: true,
          axisLine: { lineStyle: { color: gridColor } },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: textColor, fontSize: 10, margin: 4 },
          splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.5 } },
          axisPointer: {
            show: true,
            label: { show: true },
          },
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 60,
          end: 100,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          preventDefaultMouseMove: false,
          // Better touch feel on mobile
          minSpan: 10,
          maxSpan: 100,
        },
      ],
      series: [
        {
          name: symbol,
          type: 'candlestick',
          data: ohlc,
          itemStyle: {
            color: upColor,        // 涨（红 - 港股惯例）
            color0: downColor,     // 跌（绿 - 港股惯例）
            borderColor: upColor,
            borderColor0: downColor,
          },
          barMaxWidth: 12,
          barMinWidth: 2,
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
          barMaxWidth: 12,
          barMinWidth: 2,
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
    <div 
      ref={chartRef} 
      style={{ width: '100%', height: '350px', touchAction: 'pan-y' }} 
    />
  );
}
