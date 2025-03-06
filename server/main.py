from orchestration import run_analysis
import asyncio

async def main():
    # Sample stock symbols to analyze
    symbols = ['AAPL', 'GOOGL', 'MSFT']
    
    # Specify the timeframe for analysis (e.g., '1d' for daily data)
    timeframe = '1d'
    
    try:
        # Run the analysis workflow
        results = await run_analysis(symbols, timeframe)
        
        if results['status'] == 'success':
            print('\nAnalysis completed successfully!')
            print('\nFinal Report:')
            print(results['report'])
            print('\nDetailed Analysis:')
            print(results['analysis'])
            print('\nStrategy Results:')
            print(results['strategy'])
        else:
            print('\nAnalysis failed with errors:')
            for error in results['errors']:
                print(f'- {error}')
                
    except Exception as e:
        print(f'\nAn unexpected error occurred: {str(e)}')

import asyncio

if __name__ == "__main__":
    asyncio.run(main())