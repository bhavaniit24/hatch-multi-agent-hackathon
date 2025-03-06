from typing import Dict, Any, List, Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END
# from langgraph.prebuilt import ToolExecutor
from agents.data_fetching_agent import DataFetchingAgent
from agents.data_processing_agent import DataProcessingAgent
from agents.analysis_agent import AnalysisAgent
from agents.strategy_agent import StrategyAgent
from agents.reporting_agent import ReportingAgent
from config import AGENT_CONFIG

class WorkflowState(TypedDict):
    """Type definition for the workflow state."""
    messages: Sequence[BaseMessage]
    current_step: str
    stock_data: Dict[str, Any]
    processed_data: Dict[str, Any]
    analysis_results: Dict[str, Any]
    strategy_results: Dict[str, Any]
    final_report: Dict[str, Any]
    errors: List[str]

def create_workflow(symbols: List[str], timeframe: str = '1d') -> StateGraph:
    """Create the stock analysis workflow graph.
    
    Args:
        symbols: List of stock symbols to analyze
        timeframe: Time period for analysis
        
    Returns:
        StateGraph: Configured workflow
    """
    # Initialize agents
    data_fetching = DataFetchingAgent(AGENT_CONFIG['data_fetching'])
    data_processing = DataProcessingAgent(AGENT_CONFIG['data_processing'])
    analysis = AnalysisAgent(AGENT_CONFIG['analysis'])
    strategy = StrategyAgent(AGENT_CONFIG['strategy'])
    reporting = ReportingAgent(AGENT_CONFIG['reporting'])
    
    # Create workflow graph
    workflow = StateGraph(WorkflowState)
    
    # Define state transitions
    def should_continue(state: WorkflowState) -> str:
        """Determine next step based on current state."""
        if state['errors']:
            return END
        return state['current_step']
    
    # Data fetching step
    async def fetch_data(state: WorkflowState) -> WorkflowState:
        try:
            inputs = {'symbols': symbols, 'timeframe': timeframe}
            state['stock_data'] = await data_fetching.run(inputs, {})
            state['current_step'] = 'process_data'
        except Exception as e:
            state['errors'].append(f'Data fetching error: {str(e)}')
        return state
    
    # Data processing step
    async def process_data(state: WorkflowState) -> WorkflowState:
        try:
            state['processed_data'] = await data_processing.run(state['stock_data'], {})
            state['current_step'] = 'analyze_data'
        except Exception as e:
            state['errors'].append(f'Data processing error: {str(e)}')
        return state
    
    # Analysis step
    async def analyze_data(state: WorkflowState) -> WorkflowState:
        try:
            state['analysis_results'] = await analysis.run(state['processed_data'], {})
            state['current_step'] = 'apply_strategy'
        except Exception as e:
            state['errors'].append(f'Analysis error: {str(e)}')
        return state
    
    # Strategy application step
    async def apply_strategy(state: WorkflowState) -> WorkflowState:
        try:
            state['strategy_results'] = await strategy.run(state['analysis_results'], {})
            state['current_step'] = 'generate_report'
        except Exception as e:
            state['errors'].append(f'Strategy error: {str(e)}')
        return state
    
    # Report generation step
    async def generate_report(state: WorkflowState) -> WorkflowState:
        try:
            state['final_report'] = await reporting.run(state['strategy_results'], {})
            state['current_step'] = END
        except Exception as e:
            state['errors'].append(f'Reporting error: {str(e)}')
        return state
    
    # Configure workflow edges
    workflow.add_node('fetch_data', fetch_data)
    workflow.add_node('process_data', process_data)
    workflow.add_node('analyze_data', analyze_data)
    workflow.add_node('apply_strategy', apply_strategy)
    workflow.add_node('generate_report', generate_report)
    
    # Set conditional transitions
    workflow.set_entry_point('fetch_data')
    workflow.add_conditional_edges(
        'fetch_data',
        should_continue,
        {'process_data': 'process_data', END: END}
    )
    workflow.add_conditional_edges(
        'process_data',
        should_continue,
        {'analyze_data': 'analyze_data', END: END}
    )
    workflow.add_conditional_edges(
        'analyze_data',
        should_continue,
        {'apply_strategy': 'apply_strategy', END: END}
    )
    workflow.add_conditional_edges(
        'apply_strategy',
        should_continue,
        {'generate_report': 'generate_report', END: END}
    )
    workflow.add_conditional_edges(
        'generate_report',
        should_continue,
        {END: END}
    )
    
    return workflow

# ... previous code remains unchanged ...

async def run_analysis(symbols: List[str], timeframe: str = '1d') -> Dict[str, Any]:
    """Run the complete stock analysis workflow.
    
    Args:
        symbols: List of stock symbols to analyze
        timeframe: Time period for analysis
        
    Returns:
        Dict[str, Any]: Analysis results and final report
    """
    # Create and compile workflow
    workflow = create_workflow(symbols, timeframe)
    app = workflow.compile()
    
    # Initialize state
    initial_state = {
        'messages': [],
        'current_step': 'fetch_data',
        'stock_data': {},
        'processed_data': {},
        'analysis_results': {},
        'strategy_results': {},
        'final_report': {},
        'errors': []
    }
    
    # Execute workflow using async API
    final_state = await app.ainvoke(initial_state)
    
    if final_state['errors']:
        return {'status': 'error', 'errors': final_state['errors']}
    
    return {
        'status': 'success',
        'report': final_state['final_report'],
        'analysis': final_state['analysis_results'],
        'strategy': final_state['strategy_results']
    }