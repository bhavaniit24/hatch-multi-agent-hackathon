from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uvicorn
from orchestration import run_analysis
import asyncio
from fastapi.middleware.cors import CORSMiddleware


# Define input models for request validation
class AISettings(BaseModel):
    model: str = "gpt-4o"
    temperature: float = 0.7


class InvestmentPreferences(BaseModel):
    timeframe: str = "1year"
    performanceCriteria: List[str] = ["price"]
    sectors: List[str] = []
    marketCap: List[str] = ["large"]
    riskTolerance: int = Field(3, ge=1, le=5)
    dividendPreference: bool = False


class AnalysisRequest(BaseModel):
    symbols: List[str]
    ai_settings: Optional[AISettings] = None
    investment_preferences: Optional[InvestmentPreferences] = None


class AnalysisResponse(BaseModel):
    status: str
    report: Optional[str] = None
    analysis: Optional[Dict[str, Any]] = None
    strategy: Optional[Dict[str, Any]] = None
    errors: Optional[List[str]] = None


# Create FastAPI app
app = FastAPI(
    title="Stock Analysis API",
    description="API for performing AI-driven stock analysis",
    version="1.0.0",
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/analyze")
async def analyze_stocks(request: AnalysisRequest = Body(...)):
    """
    Analyze stock symbols based on provided criteria and preferences.

    - **symbols**: List of stock ticker symbols to analyze
    - **ai_settings**: AI model configuration
    - **investment_preferences**: User's investment criteria and preferences
    """
    # Validate input
    if not request.symbols or len(request.symbols) == 0:
        raise HTTPException(
            status_code=400, detail="At least one stock symbol is required"
        )

    # Set defaults if not provided
    ai_settings = request.ai_settings or AISettings()
    investment_preferences = request.investment_preferences or InvestmentPreferences()

    try:
        # Convert timeframe format from frontend to what run_analysis expects
        timeframe_mapping = {
            "1day": "1d",
            "1week": "1wk",
            "1month": "1mo",
            "3month": "3mo",
            "6month": "6mo",
            "1year": "1y",
            "5year": "5y",
        }
        analysis_timeframe = timeframe_mapping.get(
            investment_preferences.timeframe, "1d"
        )

        # Run the analysis with additional context from preferences
        results = await run_analysis(
            request.symbols,
            analysis_timeframe,
            preferences={
                "performance_criteria": investment_preferences.performanceCriteria,
                "sectors": investment_preferences.sectors,
                "market_cap": investment_preferences.marketCap,
                "risk_tolerance": investment_preferences.riskTolerance,
                "dividend_preference": investment_preferences.dividendPreference,
            },
            ai_config={
                "model": ai_settings.model,
                "temperature": ai_settings.temperature,
            },
        )

        return results

    except Exception as e:
        return {"status": "error", "errors": [str(e)]}


@app.get("/api/health")
async def health_check():
    """Check if the API is running"""
    return {"status": "healthy"}


# Add some additional endpoints that might be useful
@app.get("/api/timeframes")
async def get_available_timeframes():
    """Get available timeframe options"""
    return {
        "timeframes": [
            {"id": "1day", "name": "1 Day"},
            {"id": "1week", "name": "1 Week"},
            {"id": "1month", "name": "1 Month"},
            {"id": "3month", "name": "3 Months"},
            {"id": "6month", "name": "6 Months"},
            {"id": "1year", "name": "1 Year"},
            {"id": "5year", "name": "5 Years"},
        ]
    }


@app.get("/api/sectors")
async def get_available_sectors():
    """Get available market sectors for filtering"""
    return {
        "sectors": [
            {"id": "technology", "name": "Technology"},
            {"id": "healthcare", "name": "Healthcare"},
            {"id": "financial", "name": "Financial"},
            {"id": "consumer", "name": "Consumer"},
            {"id": "industrial", "name": "Industrial"},
            {"id": "energy", "name": "Energy"},
            {"id": "utilities", "name": "Utilities"},
            {"id": "materials", "name": "Materials"},
            {"id": "realestate", "name": "Real Estate"},
            {"id": "communication", "name": "Communication"},
        ]
    }


# Entry point to run the API server
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
