'use client';

import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';


export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    aiScore: number;
    sector: string;
    reason: string;
}

const inittopStocks: Stock[] = [
    {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        price: 877.35,
        change: 3.56,
        aiScore: 96,
        sector: 'Technology',
        reason: 'Strong AI market growth and dominant position in GPU market',
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 417.88,
        change: 0.78,
        aiScore: 94,
        sector: 'Technology',
        reason: 'Cloud business expansion and AI integration across product lines',
    },
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 173.57,
        change: 1.23,
        aiScore: 92,
        sector: 'Technology',
        reason: 'Strong ecosystem, consistent revenue growth, and robust cash flow',
    },
    {
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co.',
        price: 198.47,
        change: -0.23,
        aiScore: 89,
        sector: 'Financial',
        reason: 'Strong financial position, diversified revenue streams, and dividend growth',
    },
    {
        symbol: 'UNH',
        name: 'UnitedHealth Group Inc.',
        price: 527.33,
        change: 1.45,
        aiScore: 87,
        sector: 'Healthcare',
        reason: 'Market leader in healthcare services with consistent earnings growth',
    },
    {
        symbol: 'V',
        name: 'Visa Inc.',
        price: 274.56,
        change: 0.67,
        aiScore: 86,
        sector: 'Financial',
        reason: 'Global payment network with high margins and strong cash flow',
    },
    {
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        price: 147.52,
        change: 0.12,
        aiScore: 85,
        sector: 'Healthcare',
        reason: 'Diversified healthcare company with stable dividend growth',
    },
    {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 178.15,
        change: 2.34,
        aiScore: 84,
        sector: 'Technology',
        reason: 'E-commerce dominance and AWS cloud growth',
    },
];

type AISettings = {
    model: string;
    temperature: number;
};

type InvestmentPreferences = {
    timeframe: string;
    performanceCriteria: string[];
    sectors: string[];
    marketCap: string[];
    riskTolerance: number;
    dividendPreference: boolean;
};

type StockAnalysisContextType = {
    aiSettings: AISettings;
    setAISettings: (settings: AISettings) => void;
    preferences: InvestmentPreferences;
    setPreferences: (preferences: InvestmentPreferences) => void;
    isAnalyzing: boolean;
    analyzeStocks: () => void;
    lastUpdated: Date | null;
    topStocks: Stock[];
};

const defaultAISettings: AISettings = {
    model: 'gpt-4o',
    temperature: 0.7,
};

const defaultPreferences: InvestmentPreferences = {
    timeframe: '1year',
    performanceCriteria: ['price'],
    sectors: [],
    marketCap: ['large'],
    riskTolerance: 3,
    dividendPreference: false,
};

const StockAnalysisContext = createContext<StockAnalysisContextType | undefined>(undefined);

export function StockAnalysisProvider({ children }: { children: React.ReactNode }) {
    const [aiSettings, setAISettings] = useState<AISettings>(defaultAISettings);
    const [preferences, setPreferences] = useState<InvestmentPreferences>(defaultPreferences);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [topStocks, setTopStocks] = useState<Stock[]>([]);
    const { toast } = useToast();

    const analyzeStocks = async () => {
        setIsAnalyzing(true);

        try {
            const response = await fetch('http://localhost:8000/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbols: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META'],
                    ai_settings: aiSettings,
                    investment_preferences: preferences,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze stocks');
            }

            const data = await response.json();
            
            if (data.status === 'error') {
                throw new Error(data.errors?.[0] || 'Analysis failed');
            }

            // Update the top stocks with the analyzed data
            if (data.analysis?.recommendations) {
                setTopStocks(data.analysis.recommendations);
            } else {
                setTopStocks(inittopStocks);
            }

            setLastUpdated(new Date());
            toast({
                title: 'Analysis complete',
                description: 'Stock recommendations have been updated based on your preferences and AI settings.',
            });
        } catch (error) {
            toast({
                title: 'Analysis failed',
                description: error instanceof Error ? error.message : 'Failed to analyze stocks',
                variant: 'destructive',
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <StockAnalysisContext.Provider
            value={{
                aiSettings,
                setAISettings,
                preferences,
                setPreferences,
                isAnalyzing,
                analyzeStocks,
                lastUpdated,
                topStocks,
            }}
        >
            {children}
        </StockAnalysisContext.Provider>
    );
}

export function useStockAnalysis() {
    const context = useContext(StockAnalysisContext);
    if (context === undefined) {
        throw new Error('useStockAnalysis must be used within a StockAnalysisProvider');
    }
    return context;
}
