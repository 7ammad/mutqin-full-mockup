export function MedicalOrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "Mutqin",
    "alternateName": "مُتْقِن",
    "url": "https://mutqin.sa",
    "description": "Accredited continuing medical education platform aligned with SCFHS standards",
    "medicalSpecialty": [
      "Continuing Medical Education",
      "CME",
      "Medical Training",
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Saudi Arabia",
    },
    "accreditation": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "SCFHS Aligned",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Saudi Commission for Health Specialties",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

