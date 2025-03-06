from typing import Dict, Any, List
from langchain.schema import BaseMessage
from langchain_core.runnables import RunnableConfig
from .base_agent import BaseAgent

class ReportingAgent(BaseAgent):
    """Agent responsible for generating human-readable reports for selected stocks."""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.format = self.config['format']
        self.include_charts = self.config['include_charts']
        self.explanation_depth = self.config['explanation_depth']
    
    async def run(self, inputs: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
        """Generate detailed reports for the top-ranked stocks.
        
        Args:
            inputs (Dict[str, Any]): Ranked stocks and analysis from StrategyAgent
            config (RunnableConfig): Configuration for the execution
            
        Returns:
            Dict[str, Any]: Detailed reports for each selected stock
        """
        try:
            top_stocks = inputs.get('top_stocks', [])
            ranking_metrics = inputs.get('ranking_metrics', {})
            
            reports = {
                'summary': self._generate_summary(top_stocks, ranking_metrics),
                'detailed_reports': self._generate_detailed_reports(top_stocks),
                'market_context': self._generate_market_context(ranking_metrics)
            }
            
            return reports
        except Exception as e:
            self.update_state('error_reporting', str(e))
            return {}
    
    def _generate_summary(self, top_stocks: List[Dict[str, Any]], metrics: Dict[str, Any]) -> Dict[str, str]:
        """Generate an executive summary of the analysis results."""
        return {
            'overview': f"Analysis of {metrics.get('total_stocks_analyzed', 0)} stocks completed",
            'top_performers': f"Top {len(top_stocks)} stocks identified with scores ranging from {metrics.get('score_range', {}).get('min', 0):.2f} to {metrics.get('score_range', {}).get('max', 0):.2f}",
            'methodology': f"Analysis based on {', '.join(metrics.get('ranking_factors_used', []))}"
        }
    
    def _generate_detailed_reports(self, top_stocks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate detailed analysis reports for each selected stock."""
        detailed_reports = []
        
        for stock in top_stocks:
            report = {
                'symbol': stock['symbol'],
                'rank': stock['rank'],
                'overall_score': stock['score'],
                'analysis': self._generate_stock_analysis(stock),
                'recommendation': self._generate_recommendation(stock)
            }
            detailed_reports.append(report)
        
        return detailed_reports
    
    def _generate_stock_analysis(self, stock: Dict[str, Any]) -> Dict[str, str]:
        """Generate detailed analysis for a single stock."""
        return {
            'technical_analysis': self._format_technical_analysis(stock),
            'risk_assessment': self._format_risk_assessment(stock),
            'market_sentiment': self._format_market_sentiment(stock)
        }
    
    def _format_technical_analysis(self, stock: Dict[str, Any]) -> str:
        """Format technical analysis details."""
        score = stock.get('score', 0)
        if score > 0.8:
            return "Strong technical indicators suggesting upward momentum"
        elif score > 0.6:
            return "Positive technical signals with potential for growth"
        elif score > 0.4:
            return "Neutral technical indicators with mixed signals"
        else:
            return "Weak technical signals suggesting caution"
    
    def _format_risk_assessment(self, stock: Dict[str, Any]) -> str:
        """Format risk assessment details."""
        score = stock.get('score', 0)
        if score > 0.7:
            return "Low risk profile with stable metrics"
        elif score > 0.5:
            return "Moderate risk with acceptable volatility"
        else:
            return "Higher risk profile requiring close monitoring"
    
    def _format_market_sentiment(self, stock: Dict[str, Any]) -> str:
        """Format market sentiment analysis."""
        score = stock.get('score', 0)
        if score > 0.8:
            return "Strong positive market sentiment"
        elif score > 0.6:
            return "Generally positive market outlook"
        elif score > 0.4:
            return "Neutral market sentiment"
        else:
            return "Cautious market sentiment"
    
    def _generate_recommendation(self, stock: Dict[str, Any]) -> Dict[str, str]:
        """Generate investment recommendations based on analysis."""
        score = stock.get('score', 0)
        
        if score > 0.8:
            action = "Strong Buy"
            rationale = "Exceptional performance metrics and positive indicators across all analyzed factors"
        elif score > 0.6:
            action = "Buy"
            rationale = "Strong performance with some room for growth"
        elif score > 0.4:
            action = "Hold"
            rationale = "Stable performance but monitoring recommended"
        else:
            action = "Watch"
            rationale = "Current metrics suggest waiting for improved conditions"
        
        return {
            'action': action,
            'rationale': rationale
        }
    
    def _generate_market_context(self, metrics: Dict[str, Any]) -> Dict[str, str]:
        """Generate broader market context for the analysis."""
        return {
            'market_conditions': "Analysis performed under current market conditions",
            'factors_considered': f"Analysis incorporated {len(metrics.get('ranking_factors_used', []))} key factors",
            'confidence_level': self._calculate_confidence_level(metrics)
        }
    
    def _calculate_confidence_level(self, metrics: Dict[str, Any]) -> str:
        """Calculate confidence level in the analysis."""
        score_range = metrics.get('score_range', {})
        if score_range:
            spread = score_range.get('max', 0) - score_range.get('min', 0)
            if spread > 0.5:
                return "High confidence in differentiation between stocks"
            elif spread > 0.3:
                return "Moderate confidence in analysis results"
            else:
                return "Analysis shows minimal differentiation between stocks"
        return "Insufficient data for confidence assessment"
    
    def process_message(self, message: BaseMessage) -> Dict[str, Any]:
        """Process messages from other agents containing ranking results.
        
        Args:
            message (BaseMessage): Message containing ranking results
            
        Returns:
            Dict[str, Any]: Generated reports
        """
        content = message.content
        if isinstance(content, dict):
            return self.run(content, RunnableConfig())
        return {}