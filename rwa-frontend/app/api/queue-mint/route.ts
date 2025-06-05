// API route for queuing token minting operations
// This route adds a minting request to a queue for background processing

import { NextRequest, NextResponse } from 'next/server';

// In-memory queue for minting operations
// In production, this would use a persistent queue/database
const mintingQueue = new Map<string, {
  address: string;
  amount: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  timestamp: number;
  processingAttempts: number;
  lastProcessed?: number;
  error?: string;
  transactionHash?: string;
}>();

// Process queue every 2 minutes (don't process in API handler to avoid timeouts)
let isQueueProcessorInitialized = false;

function initQueueProcessor() {
  if (isQueueProcessorInitialized) return;
  
  // Set up interval to process queue items
  setInterval(() => {
    processQueuedMintRequests();
  }, 2 * 60 * 1000); // Every 2 minutes
  
  isQueueProcessorInitialized = true;
  console.log('🔄 Background minting queue processor initialized');
}

// This would call the mint-tokens API to process each item
async function processQueuedMintRequests() {
  console.log(`⏱️ Processing minting queue: ${mintingQueue.size} items`);
  
  // Find items that need processing
  const now = Date.now();
  const itemsToProcess = [...mintingQueue.entries()].filter(([, item]) => {
    // Only process queued items or failed items with < 3 attempts and last attempt > 5 minutes ago
    return (
      item.status === 'queued' || 
      (item.status === 'failed' && 
       item.processingAttempts < 3 && 
       (!item.lastProcessed || now - item.lastProcessed > 5 * 60 * 1000))
    );
  });
  
  if (itemsToProcess.length === 0) {
    console.log('No items need processing');
    return;
  }
  
  console.log(`Processing ${itemsToProcess.length} queue items`);
  
  // Process each item
  for (const [id, item] of itemsToProcess) {
    try {
      console.log(`Processing mint request ${id} for ${item.address}, amount: ${item.amount}`);
      mintingQueue.set(id, {
        ...item,
        status: 'processing',
        processingAttempts: item.processingAttempts + 1,
        lastProcessed: now
      });
      
      // Call the mint-tokens API from the server
      const res = await fetch(new URL('/api/mint-tokens', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In production, add an internal API key for security
          'X-Internal-API-Key': process.env.INTERNAL_API_KEY || 'development-key'
        },
        body: JSON.stringify({
          destinationAddress: item.address,
          amount: item.amount,
          source: 'queue',
          requestId: id
        })
      });
      
      const result = await res.json();
      
      if (result.success) {
        mintingQueue.set(id, {
          ...item,
          status: 'completed',
          transactionHash: result.transactionHash,
          lastProcessed: now
        });
        console.log(`✅ Queued mint successful for ${id}: ${result.transactionHash}`);
      } else {
        mintingQueue.set(id, {
          ...item,
          status: 'failed',
          error: result.error || 'Unknown error',
          lastProcessed: now
        });
        console.error(`❌ Queued mint failed for ${id}: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error processing queue item ${id}:`, error);
      mintingQueue.set(id, {
        ...item,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
        lastProcessed: now
      });
    }
  }
}

// Initialize the queue processor
if (typeof window === 'undefined') { // Only run on server-side
  initQueueProcessor();
}

// API route handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body = await request.json();
    const { address, amount } = body;
    
    // Validate required fields
    if (!address || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create unique ID for this request
    const queueId = `mint-${address}-${amount}-${Date.now()}`;
    
    // Add to queue
    mintingQueue.set(queueId, {
      address,
      amount,
      status: 'queued',
      timestamp: Date.now(),
      processingAttempts: 0
    });
    
    console.log(`📝 Added minting request to queue: ${queueId}`);
    
    // Return success response with queue ID
    return NextResponse.json({
      success: true,
      message: 'Minting request queued successfully',
      queueId
    });
  } catch (error) {
    console.error('Error adding to minting queue:', error);
    return NextResponse.json(
      { success: false, error: 'Server error processing request' },
      { status: 500 }
    );
  }
}

// Endpoint to check queue status
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const queueId = url.searchParams.get('queueId');
    
    if (!queueId) {
      // Admin endpoint to see all queue items (would require auth in production)
      // Count items by status
      const stats = {
        total: mintingQueue.size,
        queued: 0,
        processing: 0,
        completed: 0,
        failed: 0
      };
      
      for (const item of mintingQueue.values()) {
        stats[item.status]++;
      }
      
      return NextResponse.json({ success: true, stats });
    }
    
    // Check specific queue item
    const queueItem = mintingQueue.get(queueId);
    
    if (!queueItem) {
      return NextResponse.json(
        { success: false, error: 'Queue item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      status: queueItem.status,
      transactionHash: queueItem.transactionHash,
      error: queueItem.error,
      queuedAt: queueItem.timestamp,
      address: queueItem.address,
      amount: queueItem.amount
    });
  } catch (error) {
    console.error('Error checking queue status:', error);
    return NextResponse.json(
      { success: false, error: 'Server error processing request' },
      { status: 500 }
    );
  }
}
