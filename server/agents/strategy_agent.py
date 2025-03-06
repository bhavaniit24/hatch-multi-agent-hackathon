from typing import Dict, Any, List
from langchain.schema import BaseMessage
from langchain_core.runnables import RunnableConfig
import pandas as pd
from .base_agent import BaseAgent

class StrategyAgent(BaseAgent):
    """Agent responsible for applying investment strategies and ranking stocks."""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.ranking_factors = self.config['ranking_factors']
        self.weight_scheme = self.config['weight_scheme']
    
    async def run(self, inputs: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
        """Apply investment strategies and rank stocks.
        
        Args:
            inputs (Dict[str, Any]): Analysis results from AnalysisAgent
            config (RunnableConfig): Configuration for the execution
            
        Returns:
            Dict[str, Any]: Top 5 ranked stocks with scores
        """
        try:
            preferences = inputs.get('preferences', {})
            
            # Adjust ranking factors based on user preferences
            if preferences.get('risk_tolerance'):
                risk_level = preferences['risk_tolerance']
                if risk_level == 'conservative':
                    self.ranking_factors = ['risk_metrics', 'technical_indicators']
                    self.weight_scheme = {
                        'risk_metrics': 0.7,
                        'technical_indicators': 0.3
                    }
                elif risk_level == 'moderate':
                    self.ranking_factors = ['performance', 'risk_metrics', 'technical_indicators']
                    self.weight_scheme = {
                        'performance': 0.4,
                        'risk_metrics': 0.3,
                        'technical_indicators': 0.3
                    }
                elif risk_level == 'aggressive':
                    self.ranking_factors = ['performance', 'market_sentiment', 'technical_indicators']
                    self.weight_scheme = {
                        'performance': 0.5,
                        'market_sentiment': 0.3,
                        'technical_indicators': 0.2
                    }
            
            # Convert analysis results to a format suitable for ranking
            stock_scores = self._calculate_stock_scores(inputs)
            
            # Rank stocks based on composite scores
            ranked_stocks = self._rank_stocks(stock_scores)
            
            # Adjust number of top stocks based on preferences
            limit = preferences.get('max_recommendations', 5)
            top_stocks = self._get_top_stocks(ranked_stocks, limit=limit)
            
            return {
                'top_stocks': top_stocks,
                'ranking_metrics': self._get_ranking_metrics(top_stocks)
            }
        except Exception as e:
            self.update_state('error_strategy', str(e))
            return {}
    
    def _calculate_stock_scores(self, analysis_results: Dict[str, Any]) -> Dict[str, float]:
        """Calculate composite scores for each stock based on analysis metrics."""
        stock_scores = {}
        
        for stock, metrics in analysis_results.items():
            score = 0.0
            
            # Performance score (based on momentum and moving averages)
            if 'performance' in self.ranking_factors:
                perf_score = self._calculate_performance_score(metrics)
                score += perf_score * self.weight_scheme['performance']
            
            # Risk metrics score (based on volatility)
            if 'risk_metrics' in self.ranking_factors:
                risk_score = self._calculate_risk_score(metrics)
                score += risk_score * self.weight_scheme['risk_metrics']
            
            # Market sentiment score (based on volume and RSI)
            if 'market_sentiment' in self.ranking_factors:
                sentiment_score = self._calculate_sentiment_score(metrics)
                score += sentiment_score * self.weight_scheme['market_sentiment']
            
            # Technical indicators score
            if 'technical_indicators' in self.ranking_factors:
                tech_score = self._calculate_technical_score(metrics)
                score += tech_score * self.weight_scheme['technical_indicators']
            
            stock_scores[stock] = score
        
        return stock_scores
    
    def _calculate_performance_score(self, metrics: Dict[str, Any]) -> float:
        """Calculate performance score based on momentum and moving averages."""
        score = 0.0
        
        if 'momentum' in metrics:
            momentum_data = metrics['momentum']
            score += 1.0 if momentum_data.get('momentum_trend') == 'positive' else 0.0
        
        if 'moving_averages' in metrics:
            ma_data = metrics['moving_averages']
            trend = ma_data.get('trend', '')
            if trend == 'strong_uptrend':
                score += 1.0
            elif trend == 'potential_reversal_up':
                score += 0.5
        
        return score / 2.0  # Normalize to [0,1]
    
    def _calculate_risk_score(self, metrics: Dict[str, Any]) -> float:
        """Calculate risk score based on volatility metrics."""
        score = 0.0
        
        if 'volatility' in metrics:
            vol_data = metrics['volatility']
            volatility = vol_data.get('volatility', float('inf'))
            # Lower volatility = higher score
            score = 1.0 - min(volatility / 100, 1.0)  # Normalize high volatility
        
        return score
    
    def _calculate_sentiment_score(self, metrics: Dict[str, Any]) -> float:
        """Calculate market sentiment score based on volume and RSI."""
        score = 0.0
        
        if 'volume' in metrics:
            volume_data = metrics['volume']
            if volume_data.get('volume_trend') == 'increasing':
                score += 0.5
        
        if 'relative_strength' in metrics:
            rsi_data = metrics['relative_strength']
            rsi = rsi_data.get('rsi', 50)
            # Optimal RSI range (40-60)
            if 40 <= rsi <= 60:
                score += 0.5
        
        return score
    
    def _calculate_technical_score(self, metrics: Dict[str, Any]) -> float:
        """Calculate technical analysis score."""
        score = 0.0
        weight = 1.0 / len(metrics)  # Equal weight for each indicator
        
        for indicator, data in metrics.items():
            if indicator == 'moving_averages':
                if data.get('trend') in ['strong_uptrend', 'potential_reversal_up']:
                    score += weight
            elif indicator == 'relative_strength':
                if data.get('rsi_trend') != 'overbought':
                    score += weight
        
        return score
    
    def _rank_stocks(self, stock_scores: Dict[str, float]) -> List[tuple]:
        """Rank stocks based on their composite scores."""
        return sorted(stock_scores.items(), key=lambda x: x[1], reverse=True)
    
    def _get_top_stocks(self, ranked_stocks: List[tuple], limit: int = 5) -> List[Dict[str, Any]]:
        """Get the top N ranked stocks with their scores."""
        return [{
            'symbol': stock[0],
            'score': stock[1],
            'rank': idx + 1
        } for idx, stock in enumerate(ranked_stocks[:limit])]
    
    def _get_ranking_metrics(self, top_stocks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Get additional metrics about the ranking process."""
        return {
            'total_stocks_analyzed': len(top_stocks),
            'score_range': {
                'min': min(stock['score'] for stock in top_stocks),
                'max': max(stock['score'] for stock in top_stocks)
            },
            'ranking_factors_used': self.ranking_factors
        }
    
    def process_message(self, message: BaseMessage) -> Dict[str, Any]:
        """Process messages from other agents containing analysis results.
        
        Args:
            message (BaseMessage): Message containing analysis results
            
        Returns:
            Dict[str, Any]: Ranked stocks and strategies applied
        """
        content = message.content
        if isinstance(content, dict):
            return self.run(content, RunnableConfig())
        return {}