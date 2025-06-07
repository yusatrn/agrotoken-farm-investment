// Compliance utilities for RWA contract
import { createContractClient } from './contract';
import { ComplianceData } from './types';

export interface ComplianceStatus {
  isCompliant: boolean;
  hasKyc: boolean;
  hasValidCompliance: boolean;
  expiresAt?: number;
  daysUntilExpiry?: number;
  issues: string[];
  recommendations: string[];
}

/**
 * Check comprehensive compliance status for an address
 */
export async function checkComplianceStatus(address: string): Promise<ComplianceStatus> {
  try {
    const contractClient = createContractClient();
    
    // Get compliance data and whitelist status
    const [complianceData, isWhitelisted] = await Promise.all([
      contractClient.getCompliance(address),
      contractClient.isWhitelisted(address)
    ]);

    const issues: string[] = [];
    const recommendations: string[] = [];
    const currentTime = Math.floor(Date.now() / 1000);

    // Check whitelist status
    if (!isWhitelisted) {
      issues.push('Address is not whitelisted for token transfers');
      recommendations.push('Contact the platform admin to add your address to the whitelist');
    }

    // Check basic compliance existence
    if (!complianceData) {
      issues.push('No compliance data found');
      recommendations.push('Complete KYC verification to enable token transfers');
      
      return {
        isCompliant: false,
        hasKyc: false,
        hasValidCompliance: false,
        issues,
        recommendations
      };
    }

    // Check KYC verification
    if (!complianceData.kyc_verified) {
      issues.push('KYC verification not completed');
      recommendations.push('Complete the KYC verification process');
    }

    // Check compliance expiry
    const daysUntilExpiry = Math.floor((complianceData.compliance_expiry - currentTime) / (24 * 60 * 60));
    let hasValidCompliance = complianceData.compliance_expiry > currentTime;

    if (complianceData.compliance_expiry <= currentTime) {
      issues.push('Compliance verification has expired');
      recommendations.push('Renew your KYC verification to continue using the platform');
    } else if (daysUntilExpiry <= 30) {
      recommendations.push(`Your compliance expires in ${daysUntilExpiry} days. Consider renewing soon.`);
    }

    const isCompliant = isWhitelisted && 
                       complianceData.kyc_verified && 
                       hasValidCompliance;

    return {
      isCompliant,
      hasKyc: complianceData.kyc_verified,
      hasValidCompliance,
      expiresAt: complianceData.compliance_expiry,
      daysUntilExpiry: daysUntilExpiry > 0 ? daysUntilExpiry : 0,
      issues,
      recommendations
    };
  } catch (error) {
    console.error('Error checking compliance status:', error);
    
    return {
      isCompliant: false,
      hasKyc: false,
      hasValidCompliance: false,
      issues: ['Unable to check compliance status'],
      recommendations: ['Please try again later or contact support']
    };
  }
}

/**
 * Get compliance requirements text for users
 */
export function getComplianceRequirements(): string {
  return `To transfer tokens on this platform, you need:

1. ✅ Whitelist Status: Your address must be whitelisted by the platform admin
2. ✅ KYC Verification: Complete Know Your Customer verification 
3. ✅ Valid Compliance: Your compliance status must not be expired
4. ✅ Accredited Investor Status: Required for certain token types

Contact platform administration for help with compliance setup.`;
}

/**
 * Format compliance expiry date for display
 */
export function formatComplianceExpiry(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get compliance status badge color
 */
export function getComplianceStatusColor(status: ComplianceStatus): 'green' | 'yellow' | 'red' {
  if (status.isCompliant) return 'green';
  if (status.hasKyc && !status.hasValidCompliance) return 'yellow';
  return 'red';
}

/**
 * Get compliance status text
 */
export function getComplianceStatusText(status: ComplianceStatus): string {
  if (status.isCompliant) return 'Fully Compliant';
  if (status.hasKyc && !status.hasValidCompliance) return 'Compliance Expired';
  if (status.hasKyc) return 'Pending Verification';
  return 'Not Compliant';
}
