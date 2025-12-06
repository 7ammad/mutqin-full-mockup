"use client";

import CertificatePortfolio from '@/components/hcp/CertificatePortfolio';

export default function HCPCertificatesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                
                <p className="text-[var(--secondary-label)]">
                    View and download your CME certificates
                </p>
            </div>
            <CertificatePortfolio />
        </div>
    );
}

