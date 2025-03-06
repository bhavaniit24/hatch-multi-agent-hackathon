import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY")
FINHUB_API_KEY = os.getenv("FINHUB_API_KEY")

# API Endpoints
ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"
POLYGON_BASE_URL = "https://api.polygon.io/v2"
FINHUB_BASE_URL = "https://finnhub.io/api/v1"

# Agent Configuration
AGENT_CONFIG = {
    "data_fetching": {
        "apis": ["alpha_vantage", "polygon", "finhub"],
        "request_timeout": 30,
        "retry_attempts": 3,
    },
    "data_processing": {
        "batch_size": 100,
        "normalization": True,
        "cleaning_rules": ["remove_nulls", "handle_outliers"],
    },
    "analysis": {
        "metrics": [
            "price_momentum",
            "volume_analysis",
            "volatility",
            "moving_averages",
            "relative_strength",
        ]
    },
    "strategy": {
        "ranking_factors": [
            "performance",
            "risk_metrics",
            "market_sentiment",
            "technical_indicators",
        ],
        "weight_scheme": {
            "performance": 0.4,
            "risk_metrics": 0.3,
            "market_sentiment": 0.2,
            "technical_indicators": 0.1,
        },
    },
    "reporting": {
        "format": "detailed",
        "include_charts": True,
        "explanation_depth": "comprehensive",
    },
}
