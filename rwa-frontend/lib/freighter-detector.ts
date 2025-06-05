// Freighter wallet detection utilities using official Freighter API
// This file provides robust detection using Freighter's own API methods

import { isConnected, isAllowed } from '@stellar/freighter-api';

export interface FreighterDetectionResult {
  isInstalled: boolean;
  isReady: boolean;
  isAllowed?: boolean;
  version?: string;
  error?: string;
}

/**
 * Use Freighter's own API to detect if it's available
 * This is the preferred method as it uses Freighter's official API
 */
export async function detectFreighterViaAPI(): Promise<FreighterDetectionResult> {
  try {
    console.log('Testing Freighter via official API...');
    
    // Test 1: Try to check if Freighter is connected
    const connectionResult = await isConnected();
    console.log('Connection check result:', connectionResult);
    
    if (connectionResult.error) {
      // If we get a specific error, it might tell us about the state
      if (connectionResult.error.includes('not installed') || 
          connectionResult.error.includes('not found')) {
        return {
          isInstalled: false,
          isReady: false,
          error: 'Freighter extension not installed. Please install from https://freighter.app/'
        };
      }
      
      return {
        isInstalled: true,
        isReady: false,
        error: `Freighter error: ${connectionResult.error}`
      };
    }

    // Test 2: Try to check if Freighter allows access
    let allowedResult;
    try {
      allowedResult = await isAllowed();
      console.log('Permission check result:', allowedResult);
    } catch (error) {
      console.log('Permission check failed:', error);
      // This is okay, permission might not be granted yet
    }

    return {
      isInstalled: true,
      isReady: true,
      isAllowed: allowedResult?.isAllowed || false,
      version: 'detected-via-api'
    };

  } catch (error) {
    console.error('Freighter API detection failed:', error);
    
    // If the API calls themselves fail, it likely means Freighter isn't installed
    return {
      isInstalled: false,
      isReady: false,
      error: 'Freighter extension not found. Please install Freighter from Chrome Web Store.'
    };
  }
}

/**
 * Simple API-based check
 */
export async function isFreighterAvailableViaAPI(): Promise<boolean> {
  try {
    const result = await isConnected();
    // If we get any response (even an error), Freighter is installed
    return !result.error?.includes('not installed');
  } catch (error) {
    return false;
  }
}

/**
 * Initialize Freighter using API detection with retry
 */
export async function initializeFreighterViaAPI(retries: number = 3): Promise<FreighterDetectionResult> {
  for (let i = 0; i < retries; i++) {
    console.log(`Freighter API detection attempt ${i + 1}...`);
    
    const result = await detectFreighterViaAPI();
    
    if (result.isInstalled) {
      console.log('Freighter detected via API:', result);
      return result;
    }

    if (i < retries - 1) {
      console.log('Retrying in 1 second...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const finalResult = await detectFreighterViaAPI();
  console.error('Freighter API detection failed after retries:', finalResult);
  return finalResult;
}

/**
 * Manual test using API methods for debugging
 */
export async function manualAPITest() {
  console.log('=== Manual Freighter API Test ===');
  
  const tests = {
    connectionTest: null as any,
    permissionTest: null as any,
    errors: [] as string[]
  };
  
  try {
    tests.connectionTest = await isConnected();
  } catch (error) {
    tests.errors.push(`Connection test error: ${error}`);
  }
  
  try {
    tests.permissionTest = await isAllowed();
  } catch (error) {
    tests.errors.push(`Permission test error: ${error}`);
  }
  
  console.table(tests);
  return tests;
}
