'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SimpleTestPage() {
  const [result, setResult] = useState<string>('');

  const testSimpleFreighter = () => {
    const checks = [];
    
    // Basic window object check
    if (typeof window !== 'undefined') {
      checks.push(`✓ Window object available`);
      
      if ((window as any).freighter) {
        checks.push(`✓ window.freighter exists`);
        checks.push(`  Type: ${typeof (window as any).freighter}`);
        checks.push(`  Methods: ${Object.keys((window as any).freighter || {}).join(', ')}`);
      } else {
        checks.push(`✗ window.freighter NOT found`);
      }
      
      if ((window as any).FreighterApi) {
        checks.push(`✓ window.FreighterApi exists`);
      } else {
        checks.push(`✗ window.FreighterApi NOT found`);
      }
      
      if ((window as any).stellar?.freighter) {
        checks.push(`✓ window.stellar.freighter exists`);
      } else {
        checks.push(`✗ window.stellar.freighter NOT found`);
      }

      // Check chrome extensions
      if ((window as any).chrome?.runtime) {
        checks.push(`✓ Chrome extensions API available`);
      } else {
        checks.push(`✗ Chrome extensions API NOT available`);
      }

      // Check for extension scripts in DOM
      const scripts = Array.from(document.querySelectorAll('script'));
      const freighterScripts = scripts.filter(s => 
        s.src.includes('freighter') || s.innerHTML.includes('freighter')
      );
      
      if (freighterScripts.length > 0) {
        checks.push(`✓ Found ${freighterScripts.length} Freighter-related scripts`);
      } else {
        checks.push(`✗ No Freighter scripts found in DOM`);
      }

      // Check for extension meta tags
      const metas = Array.from(document.querySelectorAll('meta'));
      const freighterMetas = metas.filter(m => 
        m.name?.includes('freighter') || m.content?.includes('freighter')
      );
      
      if (freighterMetas.length > 0) {
        checks.push(`✓ Found ${freighterMetas.length} Freighter meta tags`);
      } else {
        checks.push(`✗ No Freighter meta tags found`);
      }

      // Browser info
      checks.push(`\nBrowser Info:`);
      checks.push(`  User Agent: ${navigator.userAgent}`);
      checks.push(`  URL: ${window.location.href}`);
      checks.push(`  Protocol: ${window.location.protocol}`);
      checks.push(`  Total Scripts: ${scripts.length}`);

    } else {
      checks.push(`✗ Window object NOT available (SSR?)`);
    }
    
    setResult(checks.join('\n'));
  };

  const openFreighterStore = () => {
    window.open('https://freighter.app/', '_blank');
  };

  const openChromeExtensions = () => {
    window.open('chrome://extensions/', '_blank');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Simple Freighter Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testSimpleFreighter}>
              Run Simple Test
            </Button>
            <Button variant="outline" onClick={openFreighterStore}>
              Install Freighter
            </Button>
            <Button variant="outline" onClick={openChromeExtensions}>
              Chrome Extensions
            </Button>
          </div>

          {result && (
            <Alert>
              <AlertDescription>
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {result}
                </pre>
              </AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Run Simple Test" to check Freighter status</li>
              <li>If Freighter is not found, click "Install Freighter" to install the extension</li>
              <li>After installation, refresh this page and test again</li>
              <li>If still not working, click "Chrome Extensions" to verify Freighter is enabled</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
