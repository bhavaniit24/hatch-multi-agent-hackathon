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
        """Fetch stock data from multiple APIs based on input parameters.
        
        Args:
            inputs (Dict[str, Any]): Contains parameters like symbols, timeframe, etc.
            config (RunnableConfig): Configuration for the execution
            
        Returns:
            Dict[str, Any]: Collected data from all APIs
        """
        results = {}
        symbols = inputs.get('symbols', [])
        timeframe = inputs.get('timeframe', '1d')
        
        for api in self.apis:
            try:
                if api == 'alpha_vantage':
                    results['alpha_vantage'] = self._fetch_alpha_vantage(symbols, timeframe)
                elif api == 'polygon':
                    results['polygon'] = self._fetch_polygon(symbols, timeframe)
                elif api == 'finhub':
                    results['finhub'] = self._fetch_finhub(symbols, timeframe)
            except Exception as e:
                self.update_state(f'error_{api}', str(e))
        
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