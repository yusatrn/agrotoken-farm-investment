'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PaymentProcessor, INVESTMENT_PACKAGES } from '@/lib/payment'

export default function PaymentValidationTestPage() {
  const [userAddress, setUserAddress] = useState<string>('')
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const connectWallet = async () => {
    try {
      addLog('🔍 Connecting to Freighter wallet...')
      const freighter = await import('@stellar/freighter-api')
      const isConnected = await freighter.isConnected()
      
      if (!isConnected.isConnected) {
        addLog('❌ Freighter wallet not connected')
        return
      }
      
      const result = await freighter.getAddress()
      setUserAddress(result.address)
      addLog(`✅ Connected: ${result.address}`)
    } catch (error) {
      addLog(`❌ Connection failed: ${error}`)
    }
  }

  const testPaymentValidation = async (amount: string, shouldFail: boolean = false) => {
    if (!userAddress) {
      addLog('❌ Please connect wallet first')
      return
    }

    setIsLoading(true)
    try {
      const paymentProcessor = new PaymentProcessor('testnet')
      addLog(`🧪 Testing payment with ${amount} XLM (Expected to ${shouldFail ? 'FAIL' : 'SUCCEED'})...`)
      
      const result = await paymentProcessor.processInvestmentPayment(
        userAddress,
        'organic-farm-basic',
        amount,
        'XLM'
      )

      if (result.success) {
        addLog(`✅ Payment SUCCEEDED: ${result.transactionHash}`)
        addLog(`🎉 Farm tokens: ${result.farmTokens}`)
      } else {  
        addLog(`❌ Payment FAILED: Transaction unsuccessful`)
      }
    } catch (error: any) {
      addLog(`❌ Payment FAILED: ${error.message}`)
      if (!shouldFail) {
        addLog(`⚠️ Unexpected failure - this test was expected to succeed`)
      } else {
        addLog(`✅ Expected failure - validation working correctly`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            🧪 Payment Validation Testing
          </h1>
          <p className="text-lg text-gray-600">
            Test different payment amounts to validate business rules
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎮 Test Controls
              </CardTitle>
              <CardDescription>
                Connect wallet and run validation tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Wallet Connection */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Wallet Connection</h3>
                {!userAddress ? (
                  <Button onClick={connectWallet} className="w-full">
                    Connect Freighter Wallet
                  </Button>
                ) : (
                  <div>
                    <Badge variant="default" className="mb-2">Connected</Badge>
                    <p className="text-sm text-gray-600 break-all">{userAddress}</p>
                  </div>
                )}
              </div>

              {/* Investment Package Info */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Test Package: Organic Farm Basic</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Minimum XLM:</strong> {INVESTMENT_PACKAGES[0].minimumInvestment.XLM}</p>
                  <p><strong>Expected Return:</strong> {INVESTMENT_PACKAGES[0].expectedReturn}% APY</p>
                  <p><strong>Duration:</strong> {INVESTMENT_PACKAGES[0].duration} days</p>
                </div>
              </div>

              {/* Test Scenarios */}
              <div className="space-y-2">
                <h3 className="font-semibold">Test Scenarios</h3>
                
                <Button 
                  onClick={() => testPaymentValidation('0.1', true)}
                  disabled={!userAddress || isLoading}
                  variant="outline"
                  className="w-full justify-start"
                >
                  ❌ Test Below Minimum (0.1 XLM) - Should Fail
                </Button>

                <Button 
                  onClick={() => testPaymentValidation('5', true)}
                  disabled={!userAddress || isLoading}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  ❌ Test Below Minimum (5 XLM) - Should Fail
                </Button>

                <Button 
                  onClick={() => testPaymentValidation('10', false)}
                  disabled={!userAddress || isLoading}
                  variant="default"
                  className="w-full justify-start bg-green-600 hover:bg-green-700"
                >
                  ✅ Test Minimum Amount (10 XLM) - Should Succeed
                </Button>

                <Button 
                  onClick={() => testPaymentValidation('25', false)}
                  disabled={!userAddress || isLoading}
                  variant="default"
                  className="w-full justify-start bg-green-600 hover:bg-green-700"
                >
                  ✅ Test Above Minimum (25 XLM) - Should Succeed
                </Button>
              </div>

              <Button onClick={clearLogs} variant="outline" className="w-full">
                🗑️ Clear Logs
              </Button>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Test Results
              </CardTitle>
              <CardDescription>
                Real-time test execution logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500">No tests run yet. Connect wallet and run tests...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Info */}
        <div className="mt-8 text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
                <Badge variant={isLoading ? "default" : "secondary"}>
                  {isLoading ? "🔄 Testing..." : "✅ Ready"}
                </Badge>
                <span>Network: Testnet</span>
                <span>Min Investment: 10 XLM</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
