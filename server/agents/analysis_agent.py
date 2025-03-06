from typing import Dict, Any, List
from langchain.schema import BaseMessage
from langchain_core.runnables import RunnableConfig
import pandas as pd
import numpy as np
from .base_agent import BaseAgent
from .llm_client import LLMClient  # Fixed import path

class AnalysisAgent(BaseAgent):
    """Agent responsible for analyzing stock market data and calculating metrics."""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.metrics = self.config['metrics']
        self.llm_client = LLMClient()
    
    async def run(self, inputs: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
        analysis_results = {}
        preferences = inputs.get('preferences', {})
        ai_settings = inputs.get('ai_settings', {})
        
        print(f"[AnalysisAgent] Starting analysis with AI settings: {ai_settings}")
        
        # Process stocks based on preferences
        stock_count = 0
        for api, data in inputs.items():
            if stock_count >= 5  or api in ['ai_settings']:
                break
                
            try:
                
                print(f"[AnalysisAgent] Calling LLM for {api} with data: {preferences}")
                llm_analysis = await self.llm_client.analyze_stock(preferences, ai_settings)
                print(f"[AnalysisAgent] LLM analysis for {api}: {llm_analysis}")
                
                analysis_results[api] = {
                    'llm_analysis': llm_analysis
                }
                stock_count += 1
                
            except Exception as e:
                error_msg = f"Error analyzing {api}: {str(e)}"
                print(f"[AnalysisAgent] {error_msg}")
                self.update_state(f'error_analysis_{api}', error_msg)
        
        return analysis_results
    
    def _calculate_momentum(self, df: pd.DataFrame) -> Dict[str, float]:
        """Calculate price momentum indicators."""
        try:
            # Calculate 14-day momentum
            df['momentum'] = df['close'].diff(14)
            return {
                'momentum_14d': df['momentum'].mean(),
                'momentum_trend': 'positive' if df['momentum'].mean() > 0 else 'negative'
            }
        except Exception:
            return {}
    
    def _analyze_volume(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze trading volume patterns."""
        try:
            avg_volume = df['volume'].mean()
            volume_trend = df['volume'].rolling(window=5).mean()
            return {
                'average_volume': avg_volume,
                'volume_trend': 'increasing' if volume_trend.iloc[-1] > volume_trend.iloc[0] else 'decreasing'
            }
        except Exception:
            return {}
    
    def _calculate_volatility(self, df: pd.DataFrame) -> Dict[str, float]:
        """Calculate price volatility metrics."""
        try:
            # Calculate daily returns
            daily_returns = df['close'].pct_change()
            return {
                'volatility': daily_returns.std() * np.sqrt(252),  # Annualized volatility
                'avg_daily_range': (df['high'] - df['low']).mean()
            }
        except Exception:
            return {}
    
    def _calculate_moving_averages(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Calculate various moving averages."""
        try:
            ma_20 = df['close'].rolling(window=20).mean().iloc[-1]
            ma_50 = df['close'].rolling(window=50).mean().iloc[-1]
            ma_200 = df['close'].rolling(window=200).mean().iloc[-1]
            
            return {
                'ma_20': ma_20,
                'ma_50': ma_50,
                'ma_200': ma_200,
                'trend': self._determine_trend(ma_20, ma_50, ma_200)
            }
        except Exception:
            return {}
    
    def _calculate_relative_strength(self, df: pd.DataFrame) -> Dict[str, float]:
        """Calculate relative strength indicators."""
        try:
            # Calculate 14-day RSI
            delta = df['close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            
            return {
                'rsi': rsi.iloc[-1],
                'rsi_trend': 'overbought' if rsi.iloc[-1] > 70 else 'oversold' if rsi.iloc[-1] < 30 else 'neutral'
            }
        except Exception:
            return {}
    
    def _determine_trend(self, ma_20: float, ma_50: float, ma_200: float) -> str:
        """Determine overall trend based on moving averages."""
        if ma_20 > ma_50 > ma_200:
            return 'strong_uptrend'
        elif ma_20 > ma_50 and ma_50 < ma_200:
            return 'potential_reversal_up'
        elif ma_20 < ma_50 < ma_200:
            return 'strong_downtrend'
        elif ma_20 < ma_50 and ma_50 > ma_200:
            return 'potential_reversal_down'
        return 'neutral'
    
    def process_message(self, message: BaseMessage) -> Dict[str, Any]:
        """Process messages from other agents containing data for analysis.
        
        Args:
            message (BaseMessage): Message containing data to analyze
            
        Returns:
            Dict[str, Any]: Analysis results
        """
        content = message.content
        if isinstance(content, dict):
            return self.run(content, RunnableConfig())
        return {}