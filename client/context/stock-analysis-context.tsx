'use client';

import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

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
                    symbols: ['AAPL', 'GOOGL', 'MSFT'],
                    ai_settings: {
                        model: 'gpt-4o',
                        temperature: 0.7,
                    },
                    investment_preferences: {
                        timeframe: '1year',
                        performanceCriteria: ['price', 'growth'],
                        sectors: ['technology'],
                        marketCap: ['large'],
                        riskTolerance: 3,
                        dividendPreference: false,
                    },
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {}

        // Simulate API call to analyze stocks
        setTimeout(() => {
            setIsAnalyzing(false);
            setLastUpdated(new Date());

            toast({
                title: 'Analysis complete',
                description: 'Stock recommendations have been updated based on your preferences and AI settings.',
            });
        }, 2000);
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
