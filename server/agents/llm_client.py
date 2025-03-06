import os
# from openai import OpenAI
from typing import Dict, Any, List
from langfuse.openai import OpenAI

class LLMClient:
    """Client for handling OpenAI LLM interactions."""
    
    def __init__(self):
        self.endpoint = "https://models.inference.ai.azure.com"
        self.token = os.environ["GITHUB_TOKEN"]
        self.client = OpenAI(
            base_url=self.endpoint,
            api_key=self.token,
        )
    
    async def analyze_stock(self, stock_data: Dict[str, Any], ai_settings: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze stock data using the configured LLM.
        
        Args:
            stock_data (Dict[str, Any]): Stock data to analyze
            ai_settings (Dict[str, Any]): AI model configuration from frontend
            
        Returns:
            Dict[str, Any]: LLM analysis results
        """
        try:
            # Prepare the prompt with stock data
            prompt = self._prepare_stock_analysis_prompt(stock_data)
            
            # Get model settings from frontend or use defaults
            model_name = ai_settings.get('model', 'gpt-4o')
            temperature = ai_settings.get('temperature', 0.7)
            
            # Call OpenAI API
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert stock market analyst. Analyze the given stock data and provide insights."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=temperature,
                top_p=1.0,
                max_tokens=1000,
                model=model_name
            )
            
            # Extract and structure the analysis
            analysis = response.choices[0].message.content
            
            # Format the response to match the frontend expectations
            recommendation = {
                'symbol': stock_data['symbol'],
                'name': stock_data['name'],
                'price': stock_data['current_price'],
                'change': stock_data['price_change_percentage'],
                'aiScore': self._calculate_ai_score(analysis),
                'sector': stock_data['sector'],
                'reason': self._extract_key_insights(analysis)
            }
            
            return {
                'status': 'success',
                'analysis': analysis,
                'recommendation': recommendation,
                'model_used': model_name,
                'confidence': 1.0 - temperature
            }
            
        except Exception as e:
            print(f"Error in LLM analysis: {str(e)}")
            return {
                'status': 'error',
                'error': str(e),
                'analysis': None
            }
            
    def _calculate_ai_score(self, analysis: str) -> int:
        # Implement scoring logic based on sentiment and key metrics
        # Returns a score between 0-100
        # This is a simplified example
        positive_indicators = ['strong', 'growth', 'positive', 'recommend', 'buy']
        score = 50  # Base score
        
        for indicator in positive_indicators:
            if indicator in analysis.lower():
                score += 10
        
        return min(max(score, 0), 100)
    
    def _extract_key_insights(self, analysis: str) -> str:
        # Extract the most relevant insight from the analysis
        # This is a simplified example
        sentences = analysis.split('.')
        return sentences[0].strip() if sentences else "Analysis not available"
    
    def _prepare_stock_analysis_prompt(self, stock_data: Dict[str, Any]) -> str:
        """Prepare a prompt for stock analysis.
        
        Args:
            stock_data (Dict[str, Any]): Stock data to include in the prompt
            
        Returns:
            str: Formatted prompt for the LLM
        """
        # Format stock data into a clear prompt
        prompt = f"""Please analyze the following stock data and provide insights:

Stock Symbol: {stock_data.get('symbol')}
Current Price: ${stock_data.get('price')}
Price Change: {stock_data.get('change')}%
Sector: {stock_data.get('sector')}

Key Metrics:
- Market Cap: {stock_data.get('marketCap')}
- AI Score: {stock_data.get('aiScore')}
- Trading Volume: {stock_data.get('volume')}

Please provide:
1. Technical Analysis
2. Risk Assessment
3. Investment Recommendation
4. Key Factors Influencing the Stock"""
        
        return prompt