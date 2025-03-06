from abc import ABC, abstractmethod
from typing import Dict, Any, List
from langchain.schema import BaseMessage
from langchain_core.runnables import RunnableConfig
from langchain.agents import AgentExecutor
from langchain_core.messages import HumanMessage

class BaseAgent(ABC):
    """Base class for all agents in the stock market analysis system."""
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize the base agent with configuration.
        
        Args:
            config (Dict[str, Any]): Agent-specific configuration
        """
        self.config = config
        self.state: Dict[str, Any] = {}
        
    @abstractmethod
    async def run(self, inputs: Dict[str, Any], config: RunnableConfig) -> Dict[str, Any]:
        """Execute the agent's main functionality.
        
        Args:
            inputs (Dict[str, Any]): Input data for the agent
            config (RunnableConfig): Configuration for the execution
            
        Returns:
            Dict[str, Any]: Output from the agent's execution
        """
        pass
    
    def update_state(self, key: str, value: Any) -> None:
        """Update the agent's state.
        
        Args:
            key (str): State key to update
            value (Any): New value for the state
        """
        self.state[key] = value
    
    def get_state(self, key: str) -> Any:
        """Get a value from the agent's state.
        
        Args:
            key (str): State key to retrieve
            
        Returns:
            Any: Value from the state
        """
        return self.state.get(key)
    
    def create_message(self, content: str) -> HumanMessage:
        """Create a message for inter-agent communication.
        
        Args:
            content (str): Message content
            
        Returns:
            HumanMessage: Formatted message for communication
        """
        return HumanMessage(content=content)
    
    @abstractmethod
    def process_message(self, message: BaseMessage) -> Dict[str, Any]:
        """Process incoming messages from other agents.
        
        Args:
            message (BaseMessage): Incoming message
            
        Returns:
            Dict[str, Any]: Processed result
        """
        pass