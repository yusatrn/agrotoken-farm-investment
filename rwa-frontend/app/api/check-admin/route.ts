// API route for checking if a wallet is an admin
import { NextRequest, NextResponse } from 'next/server';

// Admin public key - in production this would come from a secure source
const ADMIN_PUBLIC_KEY = process.env.CONTRACT_ADMIN_PUBLIC_KEY;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get address from query params
    const url = new URL(request.url);
    const address = url.searchParams.get('address');
    
    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address parameter is required' },
        { status: 400 }
      );
    }
    
    // Check if the address is the admin
    // In production, you would also check for multiple admins or roles
    const isAdmin = address === ADMIN_PUBLIC_KEY;
    
    return NextResponse.json({
      success: true,
      isAdmin
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { success: false, error: 'Server error checking admin status' },
      { status: 500 }
    );
  }
}
