import { useState, useEffect, useRef } from "react";

interface FinnhubTradeData {
  s: string; // Symbol
  p: number; // Last price
  t: number; // UNIX milliseconds timestamp
  v: number; // Volume
  c?: string[]; // List of trade conditions (optional)
}

interface FinnhubWebSocketMessage {
  type: string;
  data: FinnhubTradeData[];
}

interface WebSocketState {
  price: number;
  previousPrice: number;
  timestamp: number;
  volume: number;
  isConnected: boolean;
  error: string | null;
}

interface WebSocketOptions {
  enabled?: boolean;
}

export function useFinnhubWebSocket(
  symbol: string,
  options: WebSocketOptions = {}
) {
  const enabled = options.enabled ?? true;
  const [state, setState] = useState<WebSocketState>({
    price: 0,
    previousPrice: 0,
    timestamp: 0,
    volume: 0,
    isConnected: false,
    error: null,
  });

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setState(prev => ({ ...prev, isConnected: false, error: null }));
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey) {
      setState(prev => ({ ...prev, error: "API key not found" }));
      return;
    }

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setState(prev => ({ ...prev, isConnected: true, error: null }));
      ws.send(JSON.stringify({ type: "subscribe", symbol }));
    };

    ws.onmessage = (event) => {
      try {
        const message: FinnhubWebSocketMessage = JSON.parse(event.data);
        if (message.type === "trade" && Array.isArray(message.data)) {
          message.data.forEach((trade) => {
            if (trade.s === symbol) {
              setState((prev) => ({
                ...prev,
                previousPrice: prev.price || trade.p,
                price: trade.p,
                timestamp: trade.t,
                volume: trade.v,
              }));
            }
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      setState(prev => ({ ...prev, isConnected: false }));
    };

    ws.onerror = () => {
      setState(prev => ({ ...prev, error: "WebSocket connection error" }));
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
      }
      ws.close();
      wsRef.current = null;
    };
  }, [enabled, symbol]);

  return {
    price: state.price,
    previousPrice: state.previousPrice,
    timestamp: state.timestamp,
    volume: state.volume,
    isConnected: state.isConnected,
    error: state.error,
  };
}