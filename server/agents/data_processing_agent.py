from typing import Dict, Any, List
from langchain.schema import BaseMessage
from langchain_core.runnables import RunnableConfig
import pandas as pd
import numpy as np
from .base_agent import BaseAgent

class DataProcessingAgent(BaseAgent):
    """Agent responsible for cleaning and normalizing stock market data."""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.batch_size = self.config['batch_size']
        self.normalization = self.config['normalization']
        self.cleaning_rules = self.config['cleaning_rules']
    
    async def run(self, inputs: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
        """Process and clean the stock market data.
        
        Args:
            inputs (Dict[str, Any]): Raw data from multiple APIs and user preferences
            config (RunnableConfig): Configuration for the execution
            
        Returns:
            Dict[str, Any]: Processed and cleaned data
        """
        processed_data = {}
        preferences = inputs.get('preferences', {})
        
        # Adjust cleaning rules based on user risk tolerance
        if preferences.get('risk_tolerance'):
            risk_level = preferences['risk_tolerance']
            if risk_level == 'conservative':
                self.cleaning_rules['handle_outliers'] = True
                self.cleaning_rules['remove_nulls'] = True
            elif risk_level == 'aggressive':
                self.cleaning_rules['handle_outliers'] = False
        
        for api, data in inputs.items():
            if api == 'preferences':
                continue
                
            try:
                df = self._convert_to_dataframe(data)
                df = self._apply_cleaning_rules(df)
                
                if self.normalization:
                    df = self._normalize_data(df)
                
                # Apply sector filtering if specified in preferences
                if preferences.get('preferred_sectors'):
                    df = self._filter_by_sectors(df, preferences['preferred_sectors'])
                
                processed_data[api] = df.to_dict(orient='records')
            except Exception as e:
                self.update_state(f'error_processing_{api}', str(e))
        
        return processed_data
    
    def _convert_to_dataframe(self, data: Dict[str, Any]) -> pd.DataFrame:
        """Convert API response data to pandas DataFrame."""
        # Handle different API response formats
        if isinstance(data, dict):
            return pd.DataFrame.from_dict(data, orient='index')
        elif isinstance(data, list):
            return pd.DataFrame(data)
        else:
            raise ValueError(f'Unsupported data format: {type(data)}')
    
    def _apply_cleaning_rules(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply cleaning rules to the DataFrame."""
        if 'remove_nulls' in self.cleaning_rules:
            df = df.dropna()
        
        if 'handle_outliers' in self.cleaning_rules:
            # Use IQR method to remove outliers
            Q1 = df.quantile(0.25)
            Q3 = df.quantile(0.75)
            IQR = Q3 - Q1
            df = df[~((df < (Q1 - 1.5 * IQR)) | (df > (Q3 + 1.5 * IQR))).any(axis=1)]
        
        return df
    
    def _normalize_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Normalize numerical columns in the DataFrame."""
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        if not numeric_columns.empty:
            df[numeric_columns] = (df[numeric_columns] - df[numeric_columns].mean()) / df[numeric_columns].std()
        return df
    
    def process_message(self, message: BaseMessage) -> Dict[str, Any]:
        """Process messages from other agents containing data for processing.
        
        Args:
            message (BaseMessage): Message containing data to process
            
        Returns:
            Dict[str, Any]: Processed data
        """
        content = message.content
        if isinstance(content, dict):
            return self.run(content, RunnableConfig())
        return {}