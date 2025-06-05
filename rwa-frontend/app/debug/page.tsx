'use client';

import { useEffect, useState } from 'react';
import { detectFreighterViaAPI, initializeFreighterViaAPI, manualAPITest } from '@/lib/freighter-detector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DebugInfo {
  browser: any;
  freighterStatus: any;
  windowObjects: any;
  errors: string[];
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const errors: string[] = [];
    
    try {
      // Browser info
      const browserInfo = {
        userAgent: navigator.userAgent,
        isChrome: navigator.userAgent.includes('Chrome'),
        isFirefox: navigator.userAgent.includes('Firefox'),
        url: window.location.href,
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        readyState: document.readyState,
        scriptsCount: document.querySelectorAll('script').length
      };

      // Check window objects
      const windowObjects = {
        freighter: !!(window as any).freighter,
        FreighterApi: !!(window as any).FreighterApi,
        stellar: !!(window as any).stellar,
        chrome: !!(window as any).chrome,
        chromeRuntime: !!(window as any).chrome?.runtime
      };      // Test Freighter via API
      let freighterStatus;
      try {
        freighterStatus = await detectFreighterViaAPI();
      } catch (error) {
        freighterStatus = { error: error instanceof Error ? error.message : 'Unknown error' };
        errors.push(`Freighter API detection error: ${error}`);
      }

      // Manual API test
      let manualTest;
      try {
        manualTest = await manualAPITest();
      } catch (error) {
        manualTest = { error: error instanceof Error ? error.message : 'Manual API test failed' };
        errors.push(`Manual API test error: ${error}`);
      }

      setDebugInfo({
        browser: browserInfo,
        freighterStatus: { ...freighterStatus, manualTest },
        windowObjects,
        errors
      });

    } catch (error) {
      errors.push(`General error: ${error}`);
      setDebugInfo({
        browser: {},
        freighterStatus: {},
        windowObjects: {},
        errors
      });
    }
    
    setIsLoading(false);
  };
  const testFreighterConnection = async () => {
    try {
      const result = await initializeFreighterViaAPI(5);
      alert(`Freighter API Test Result:\nInstalled: ${result.isInstalled}\nReady: ${result.isReady}\nVersion: ${result.version}\nError: ${result.error || 'None'}`);
    } catch (error) {
      alert(`API test failed: ${error}`);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Freighter API Debug Information</h1>
        <div className="space-x-2">
          <Button onClick={runDiagnostics} disabled={isLoading}>
            {isLoading ? 'Running...' : 'Refresh Diagnostics'}
          </Button>          <Button onClick={testFreighterConnection} variant="outline">
            Test API Connection
          </Button>
        </div>
      </div>

      {debugInfo && (
        <div className="grid gap-6">
          {/* Browser Information */}
          <Card>
            <CardHeader>
              <CardTitle>Browser Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(debugInfo.browser).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span className="text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Window Objects */}
          <Card>
            <CardHeader>
              <CardTitle>Window Objects Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(debugInfo.windowObjects).map(([key, available]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <span className="font-medium">{key}:</span>
                    <Badge variant={available ? "default" : "destructive"}>
                      {available ? "Available" : "Missing"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Freighter Status */}
          <Card>
            <CardHeader>
              <CardTitle>Freighter API Detection Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Installed:</span>
                    <Badge variant={debugInfo.freighterStatus.isInstalled ? "default" : "destructive"}>
                      {debugInfo.freighterStatus.isInstalled ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Ready:</span>
                    <Badge variant={debugInfo.freighterStatus.isReady ? "default" : "destructive"}>
                      {debugInfo.freighterStatus.isReady ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                
                {debugInfo.freighterStatus.version && (
                  <p><strong>Version:</strong> {debugInfo.freighterStatus.version}</p>
                )}
                
                {debugInfo.freighterStatus.error && (
                  <p className="text-red-600"><strong>Error:</strong> {debugInfo.freighterStatus.error}</p>
                )}

                {debugInfo.freighterStatus.manualTest && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">Manual Test Results</summary>
                    <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
                      {JSON.stringify(debugInfo.freighterStatus.manualTest, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Errors */}
          {debugInfo.errors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {debugInfo.errors.map((error, index) => (
                    <li key={index} className="text-red-600 text-sm">
                      • {error}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Ensure Freighter extension is installed from <a href="https://freighter.app/" target="_blank" className="text-blue-600 underline">https://freighter.app/</a></li>
                <li>Check that Freighter is enabled in your browser extensions</li>
                <li>Try refreshing the page after installing/enabling Freighter</li>
                <li>Open browser DevTools (F12) and check Console for errors</li>
                <li>Try running <code className="bg-gray-100 px-1">window.testFreighter()</code> in browser console</li>
                <li>If using Chrome, check chrome://extensions/ to verify Freighter is active</li>
                <li>Try disabling other wallet extensions temporarily</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
