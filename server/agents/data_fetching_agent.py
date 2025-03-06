from typing import Dict, Any, List
from langchain.schema import BaseMessage
from langchain_core.runnables import RunnableConfig
import requests
import pandas as pd
from datetime import datetime, timedelta
from config import ALPHA_VANTAGE_API_KEY, POLYGON_API_KEY, FINHUB_API_KEY
from config import ALPHA_VANTAGE_BASE_URL, POLYGON_BASE_URL, FINHUB_BASE_URL
from .base_agent import BaseAgent

class DataFetchingAgent(BaseAgent):
    """Agent responsible for fetching stock market data from multiple APIs."""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.apis = self.config['apis']
        self.timeout = self.config['request_timeout']
        self.retry_attempts = self.config['retry_attempts']
    
    async def run(self, inputs: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
        """Fetch and analyze market data to discover potential stocks.
        
        Args:
            inputs (Dict[str, Any]): Contains preferences, timeframe, and AI config
            config (RunnableConfig): Configuration for the execution
            
        Returns:
            Dict[str, Any]: Collected and analyzed market data
        """
        results = {}
        preferences = inputs.get('preferences', {})
        timeframe = inputs.get('timeframe', '1d')
        ai_config = inputs.get('ai_config', {})
        
        try:
            # Get market overview and sector performance
            market_data = self._fetch_market_overview()
            
            # Use preferences to filter sectors and get top performing stocks
            preferred_sectors = preferences.get('preferred_sectors', [])
            risk_tolerance = preferences.get('risk_tolerance', 'moderate')
            
            # Get potential stocks based on market analysis and preferences
            potential_stocks = self._discover_potential_stocks(market_data, preferred_sectors, risk_tolerance)
            
            # Fetch detailed data for potential stocks
            for symbol in potential_stocks[:20]:  # Limit to top 20 for detailed analysis
                try:
                    stock_data = {}
                    if 'alpha_vantage' in self.apis:
                        stock_data.update(self._fetch_alpha_vantage([symbol], timeframe))
                    if 'polygon' in self.apis:
                        stock_data.update(self._fetch_polygon([symbol], timeframe))
                    if 'finhub' in self.apis:
                        stock_data.update(self._fetch_finhub([symbol], timeframe))
                    
                    results[symbol] = stock_data
                except Exception as e:
                    self.update_state(f'error_fetching_{symbol}', str(e))
                    continue
            
        except Exception as e:
            self.update_state('error_market_analysis', str(e))
        
        return results
    
    def _fetch_alpha_vantage(self, symbols: List[str], timeframe: str) -> Dict[str, Any]:
        """Fetch data from Alpha Vantage API."""
        data = {}
        for symbol in symbols:
            params = {
                'function': 'TIME_SERIES_DAILY',
                'symbol': symbol,
                'apikey': ALPHA_VANTAGE_API_KEY,
                'outputsize': 'full'
            }
            response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params, timeout=self.timeout)
            data[symbol] = response.json()
        return data
    
    def _fetch_polygon(self, symbols: List[str], timeframe: str) -> Dict[str, Any]:
        """Fetch data from Polygon API."""
        data = {}
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)  # Default to 30 days
        
        for symbol in symbols:
            endpoint = f'{POLYGON_BASE_URL}/aggs/ticker/{symbol}/range/1/day/{start_date.strftime("%Y-%m-%d")}/{end_date.strftime("%Y-%m-%d")}'
            headers = {'Authorization': f'Bearer {POLYGON_API_KEY}'}
            response = requests.get(endpoint, headers=headers, timeout=self.timeout)
            data[symbol] = response.json()
        return data
    
    def _fetch_finhub(self, symbols: List[str], timeframe: str) -> Dict[str, Any]:
        """Fetch data from Finhub API."""
        data = {}
        for symbol in symbols:
            params = {
                'symbol': symbol,
                'token': FINHUB_API_KEY
            }
            response = requests.get(f'{FINHUB_BASE_URL}/quote', params=params, timeout=self.timeout)
            data[symbol] = response.json()
        return data
    
    def process_message(self, message: BaseMessage) -> Dict[str, Any]:
        """Process messages from other agents requesting data.
        
        Args:
            message (BaseMessage): Message containing data request
            
        Returns:
            Dict[str, Any]: Processed data based on the request
        """
        content = message.content
        if isinstance(content, dict):
            return self.run(content, RunnableConfig())
        return {}