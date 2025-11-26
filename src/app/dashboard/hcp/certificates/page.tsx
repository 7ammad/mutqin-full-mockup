"use client";

import CertificatePortfolio from '@/components/hcp/CertificatePortfolio';

export default function HCPCertificatesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--label)] mb-2">
                    My Certificates
                </h1>
                <p className="text-[var(--secondary-label)]">
                    View and download your CME certificates
                </p>
            </div>
            <CertificatePortfolio />
        </div>
    );
}

