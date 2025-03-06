'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, ExternalLink, RefreshCw, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Stock, useStockAnalysis } from '@/context/stock-analysis-context';

export function TopStockRecommendations() {
    const [activeTab, setActiveTab] = useState('all');
    const { preferences, isAnalyzing, analyzeStocks, lastUpdated, topStocks } = useStockAnalysis();

    const getTimeframeLabel = (timeframe: string) => {
        const labels: Record<string, string> = {
            '1month': '1 Month Timeframe',
            '3months': '3 Months Timeframe',
            '6months': '6 Months Timeframe',
            '1year': '1 Year Timeframe',
            '3years': '3 Years Timeframe',
            '5years': '5 Years Timeframe',
        };
        return labels[timeframe] || 'Custom Timeframe';
    };

    if (!topStocks || topStocks.length === 0) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Top 5 Recommended Stocks
                        </CardTitle>
                        <CardDescription>
                            AI-analyzed stocks with the highest investment potential based on your preferences
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={analyzeStocks} disabled={isAnalyzing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant="outline">{getTimeframeLabel(preferences.timeframe)}</Badge>
                    {preferences.performanceCriteria.includes('price') && (
                        <Badge variant="outline">Price Appreciation</Badge>
                    )}
                    {preferences.marketCap.includes('large') && <Badge variant="outline">Large Cap</Badge>}
                    <Badge variant="outline">{getRiskLabel(preferences.riskTolerance)}</Badge>
                    {preferences.dividendPreference && <Badge variant="outline">Dividend Focus</Badge>}
                    {activeTab !== 'all' && (
                        <Badge variant="outline" className="bg-primary/10">
                            {getSectorLabel(activeTab)}
                        </Badge>
                    )}
                </div>

                {lastUpdated && (
                    <p className="mb-4 text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</p>
                )}

                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4 w-full">
                        <TabsTrigger value="all">All Sectors</TabsTrigger>
                        <TabsTrigger value="tech">Technology</TabsTrigger>
                        <TabsTrigger value="finance">Financial</TabsTrigger>
                        <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <StockTable stocks={getFilteredStocks(topStocks, 'all')} />
                    </TabsContent>

                    <TabsContent value="tech">
                        <StockTable stocks={getFilteredStocks(topStocks, 'tech')} />
                    </TabsContent>

                    <TabsContent value="finance">
                        <StockTable stocks={getFilteredStocks(topStocks, 'finance')} />
                    </TabsContent>

                    <TabsContent value="healthcare">
                        <StockTable stocks={getFilteredStocks(topStocks, 'healthcare')} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

function StockTable({ stocks }: { stocks: Stock[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="pb-2 text-left font-medium">Rank</th>
                        <th className="pb-2 text-left font-medium">Symbol</th>
                        <th className="pb-2 text-left font-medium">Company</th>
                        <th className="pb-2 text-left font-medium">
                            <div className="flex items-center">
                                <span>AI Score</span>
                                <ArrowUpDown className="ml-1 h-3 w-3" />
                            </div>
                        </th>
                        <th className="pb-2 text-left font-medium">Price</th>
                        <th className="pb-2 text-left font-medium">Change</th>
                        <th className="pb-2 text-right font-medium">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, index) => (
                        <tr key={stock.symbol} className="border-b">
                            <td className="py-3 text-center font-medium">{index + 1}</td>
                            <td className="py-3 font-medium">{stock.symbol}</td>
                            <td className="py-3">{stock.name}</td>
                            <td className="py-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-16 rounded-full bg-secondary">
                                        <div
                                            className="h-full rounded-full bg-primary"
                                            style={{ width: `${stock.aiScore}%` }}
                                        />
                                    </div>
                                    <span className="text-xs">{stock.aiScore}</span>
                                </div>
                            </td>
                            <td className="py-3">${stock.price}</td>
                            <td className={`py-3 ${stock.change > 0 ? 'text-positive' : 'text-negative'}`}>
                                {stock.change > 0 ? '+' : ''}
                                {stock.change}%
                            </td>
                            <td className="py-3 text-right">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                    <Link href={`/stocks/${stock.symbol}`}>
                                        <ExternalLink className="h-4 w-4" />
                                        <span className="sr-only">View details for {stock.symbol}</span>
                                    </Link>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function getSectorLabel(sector: string): string {
    switch (sector) {
        case 'tech':
            return 'Technology Sector';
        case 'finance':
            return 'Financial Sector';
        case 'healthcare':
            return 'Healthcare Sector';
        default:
            return 'All Sectors';
    }
}

function getRiskLabel(value: number): string {
    switch (value) {
        case 1:
            return 'Very Conservative';
        case 2:
            return 'Conservative';
        case 3:
            return 'Moderate';
        case 4:
            return 'Aggressive';
        case 5:
            return 'Very Aggressive';
        default:
            return 'Moderate';
    }
}

function getFilteredStocks(topStocks: Stock[], sector: string): Stock[] {
    if (sector === 'all') {
        return topStocks.slice(0, 5);
    }

    const sectorMap: Record<string, string> = {
        tech: 'Technology',
        finance: 'Financial',
        healthcare: 'Healthcare',
    };

    return topStocks.filter(stock => stock.sector === sectorMap[sector]).slice(0, 5);
}

