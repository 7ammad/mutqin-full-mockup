export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mutqin",
    "alternateName": "مُتْقِن",
    "url": "https://mutqin.sa",
    "logo": "https://mutqin.sa/logo.png",
    "description": "The unified platform for continuing medical education in Saudi Arabia",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SA",
      "addressRegion": "Riyadh",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@mutqin.sa",
      "contactType": "Customer Service",
      "areaServed": "SA",
    },
    "sameAs": [
      // Add social media links if available
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

