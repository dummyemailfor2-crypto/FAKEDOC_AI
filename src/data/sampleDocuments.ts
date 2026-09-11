import { SampleDocument } from '../types';

export const createPassportSvg = (
  holderFullName: string,
  docNumber: string,
  mrzString: string,
  isTampered: boolean = false
): string => {
  const parts = holderFullName.trim().split(' ');
  const surname = parts[1] || 'CHEN';
  const givenNames = parts[0] || 'SARAH';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" rx="12" fill="#0f223d"/>
    <rect x="15" y="15" width="570" height="370" rx="8" fill="#fcfaf2" stroke="#d5c8a3" stroke-width="2"/>
    <!-- Guilloche patterns -->
    <pattern id="guilloche" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0,20 Q10,0 20,20 T40,20" fill="none" stroke="#e9dec0" stroke-width="1.2"/>
      <path d="M0,20 Q10,40 20,20 T40,20" fill="none" stroke="#e9dec0" stroke-width="1.2"/>
    </pattern>
    <rect x="25" y="25" width="550" height="350" fill="url(#guilloche)" opacity="0.6"/>
    <!-- Header -->
    <text x="50" y="60" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#1b2a47" letter-spacing="1.5">FEDERAL PASSPORT</text>
    <text x="50" y="78" font-family="Arial, sans-serif" font-size="11" fill="#6b7280">TYPE: P  •  CODE: GBR  •  PASSPORT NO: ${docNumber}</text>
    <!-- Photo Area -->
    <rect x="50" y="100" width="130" height="170" rx="4" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1"/>
    <!-- Stylized Portrait Face -->
    <circle cx="115" cy="160" r="38" fill="#e2a174"/>
    <!-- Hair -->
    <path d="M77 155 Q115 105 153 155 Q150 120 115 118 Q80 120 77 155 Z" fill="#2d3748"/>
    <!-- Eyes and Mouth -->
    <circle cx="102" cy="158" r="3.5" fill="#1f2937"/>
    <circle cx="128" cy="158" r="3.5" fill="#1f2937"/>
    <path d="M107 178 Q115 186 123 178" fill="none" stroke="#991b1b" stroke-width="2"/>
    <!-- Shoulders -->
    <path d="M65 240 Q115 210 165 240 L165 270 L65 270 Z" fill="#1e3a8a"/>
    <!-- Document Info Fields -->
    <text x="210" y="115" font-family="Arial, sans-serif" font-size="10" fill="#6b7280">SURNAME / NOM</text>
    <text x="210" y="132" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#111827">${surname}</text>
    <text x="210" y="155" font-family="Arial, sans-serif" font-size="10" fill="#6b7280">GIVEN NAMES / PRENOMS</text>
    <text x="210" y="172" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#111827">${givenNames}</text>
    <text x="210" y="195" font-family="Arial, sans-serif" font-size="10" fill="#6b7280">NATIONALITY / NATIONALITE</text>
    <text x="210" y="210" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#1f2937">BRITISH CITIZEN</text>
    <text x="390" y="195" font-family="Arial, sans-serif" font-size="10" fill="#6b7280">DATE OF BIRTH</text>
    <text x="390" y="210" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#1f2937">14 MAY 1991</text>
    <text x="210" y="235" font-family="Arial, sans-serif" font-size="10" fill="#6b7280">DATE OF EXPIRY</text>
    <text x="210" y="250" font-family="${isTampered ? 'Courier, monospace' : 'Arial, sans-serif'}" font-size="${isTampered ? '15' : '13'}" font-weight="bold" fill="${isTampered ? '#dc2626' : '#1f2937'}">${isTampered ? '28 NOV 2039 [TAMPERED]' : '28 NOV 2031'}</text>
    <text x="390" y="235" font-family="Arial, sans-serif" font-size="10" fill="#6b7280">AUTHORITY</text>
    <text x="390" y="250" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#1f2937">IPS GLASGOW</text>
    ${isTampered ? '<rect x="205" y="232" width="180" height="24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>' : ''}
    <!-- MRZ (Machine Readable Zone) -->
    <rect x="40" y="295" width="520" height="75" rx="4" fill="#f3f4f6" stroke="#d1d5db" stroke-width="1"/>
    <text x="50" y="325" font-family="'Courier New', monospace" font-size="14" font-weight="bold" fill="#111827" letter-spacing="3">${mrzString.slice(0, 44)}</text>
    <text x="50" y="352" font-family="'Courier New', monospace" font-size="14" font-weight="bold" fill="#111827" letter-spacing="3">${mrzString.slice(44)}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

export const createVisaSvg = (bearerName: string, visaNumber: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" rx="8" fill="#1e293b"/>
    <rect x="15" y="15" width="570" height="370" rx="6" fill="#fdfbf7" stroke="#94a3b8" stroke-width="1.5"/>
    <!-- Visa seal watermark -->
    <circle cx="450" cy="180" r="80" fill="none" stroke="#fed7aa" stroke-width="8" stroke-dasharray="6,4" opacity="0.5"/>
    <text x="450" y="185" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#f97316" opacity="0.6" text-anchor="middle">OFFICIAL VISA DEPT</text>
    <!-- Header -->
    <text x="40" y="55" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0f172a" letter-spacing="1">SCHENGEN ENTRY VISA</text>
    <text x="40" y="75" font-family="Arial, sans-serif" font-size="12" fill="#64748b">CATEGORY: MULTIPLE ENTRY (TYPE C)  •  VISA NO: ${visaNumber}</text>
    <!-- Face Photo -->
    <rect x="40" y="95" width="125" height="165" rx="3" fill="#f1f5f9" stroke="#cbd5e1"/>
    <circle cx="102" cy="155" r="36" fill="#d97706" opacity="0.75"/>
    <path d="M70 148 Q102 108 134 148 Q130 115 102 112 Q74 115 70 148 Z" fill="#1e293b"/>
    <circle cx="92" cy="152" r="3" fill="#0f172a"/>
    <circle cx="112" cy="152" r="3" fill="#0f172a"/>
    <path d="M96 172 Q102 178 108 172" fill="none" stroke="#7f1d1d" stroke-width="1.5"/>
    <path d="M55 235 Q102 205 150 235 L150 260 L55 260 Z" fill="#334155"/>
    <!-- Details -->
    <text x="190" y="115" font-family="Arial, sans-serif" font-size="10" fill="#64748b">BEARER</text>
    <text x="190" y="133" font-family="Courier, monospace" font-size="16" font-weight="bold" fill="#dc2626">${bearerName}</text>
    <text x="190" y="160" font-family="Arial, sans-serif" font-size="10" fill="#64748b">VALID FROM / UNTIL</text>
    <text x="190" y="176" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#0f172a">10 JAN 2025 - 09 JAN 2026</text>
    <text x="190" y="205" font-family="Arial, sans-serif" font-size="10" fill="#64748b">PASSPORT NO</text>
    <text x="190" y="221" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#0f172a">DE99481023</text>
    <text x="190" y="250" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#dc2626">SUSPICIOUS: FONT MISMATCH &amp; SPLICED NAME FIELD</text>
    <!-- Machine readable footer -->
    <rect x="35" y="295" width="530" height="70" rx="3" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="45" y="325" font-family="'Courier New', monospace" font-size="13" font-weight="bold" fill="#0f172a" letter-spacing="2">VNUTO&lt;&lt;${bearerName.replace(/\s+/g, '&lt;')}<<<<<<<<<<<<<<<<<<</text>
    <text x="45" y="350" font-family="'Courier New', monospace" font-size="13" font-weight="bold" fill="#0f172a" letter-spacing="2">${visaNumber}&lt;8UTO9105142M2601095<<<<<<<<<<<<<<02</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

// Reference portrait for matching face comparison
export const sampleFaceMatching = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
  <rect width="300" height="360" fill="#f8fafc"/>
  <circle cx="150" cy="150" r="75" fill="#e2a174"/>
  <path d="M80 145 Q150 50 220 145 Q215 80 150 78 Q85 80 80 145 Z" fill="#2d3748"/>
  <circle cx="125" cy="145" r="6" fill="#1f2937"/>
  <circle cx="175" cy="145" r="6" fill="#1f2937"/>
  <path d="M135 185 Q150 198 165 185" fill="none" stroke="#991b1b" stroke-width="3"/>
  <path d="M50 310 Q150 250 250 310 L250 360 L50 360 Z" fill="#1e3a8a"/>
</svg>`);

// Reference portrait for non-matching face comparison
export const sampleFaceNonMatching = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
  <rect width="300" height="360" fill="#f1f5f9"/>
  <circle cx="150" cy="150" r="70" fill="#a16207"/>
  <rect x="80" y="70" width="140" height="50" rx="10" fill="#0f172a"/>
  <circle cx="125" cy="145" r="7" fill="#0f172a"/>
  <circle cx="175" cy="145" r="7" fill="#0f172a"/>
  <line x1="130" y1="185" x2="170" y2="185" stroke="#451a03" stroke-width="4"/>
  <path d="M50 320 Q150 260 250 320 L250 360 L50 360 Z" fill="#047857"/>
</svg>`);

// Biometric Fingerprint reference SVG (Sarah Chen - Right Index Loop pattern)
export const sampleFingerprintMatching = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="300" viewBox="0 0 240 300">
  <rect width="240" height="300" rx="12" fill="#090d16"/>
  <g fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" opacity="0.85">
    <!-- Concentric Loops and Minutiae Ridges -->
    <path d="M120 40 C75 40 45 75 45 130 C45 200 80 255 120 270 C160 255 195 200 195 130 C195 75 165 40 120 40 Z"/>
    <path d="M120 60 C85 60 60 90 60 135 C60 195 90 240 120 250 C150 240 180 195 180 135 C180 90 155 60 120 60 Z"/>
    <path d="M120 80 C95 80 75 105 75 140 C75 185 100 220 120 230 C140 220 165 185 165 140 C165 105 145 80 120 80 Z"/>
    <path d="M120 100 C105 100 90 118 90 145 C90 178 108 202 120 210 C132 202 150 178 150 145 C150 118 135 100 120 100 Z"/>
    <path d="M120 120 C112 120 105 130 105 150 C105 170 115 185 120 190 C125 185 135 170 135 150 C135 130 128 120 120 120 Z"/>
    <!-- Core and delta points -->
    <path d="M115 145 Q120 138 125 145 Q120 160 115 145"/>
    <path d="M68 200 Q75 180 72 165"/>
    <path d="M172 200 Q165 180 168 165"/>
    <path d="M52 140 Q55 110 70 85"/>
    <path d="M188 140 Q185 110 170 85"/>
  </g>
  <!-- Biometric Landmark Minutiae Points -->
  <circle cx="120" cy="142" r="3.5" fill="#34d399"/>
  <circle cx="98" cy="120" r="3" fill="#34d399"/>
  <circle cx="142" cy="122" r="3" fill="#34d399"/>
  <circle cx="105" cy="175" r="3" fill="#34d399"/>
  <circle cx="138" cy="172" r="3" fill="#34d399"/>
  <circle cx="78" cy="148" r="3" fill="#34d399"/>
  <circle cx="162" cy="145" r="3" fill="#34d399"/>
  <text x="120" y="288" font-family="monospace" font-size="9" fill="#94a3b8" text-anchor="middle">REF #GBR-9105-FP01 • RIGHT INDEX</text>
</svg>`);

// Non-matching biometric fingerprint SVG (Unknown / Mismatched thumbprint - Arch pattern)
export const sampleFingerprintNonMatching = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="300" viewBox="0 0 240 300">
  <rect width="240" height="300" rx="12" fill="#180b0b"/>
  <g fill="none" stroke="#f87171" stroke-width="2.2" stroke-linecap="round" opacity="0.85">
    <!-- Plain Arch / Tented Arch pattern -->
    <path d="M40 220 Q120 110 200 220"/>
    <path d="M48 200 Q120 95 192 200"/>
    <path d="M56 180 Q120 80 184 180"/>
    <path d="M64 160 Q120 65 176 160"/>
    <path d="M72 140 Q120 50 168 140"/>
    <path d="M80 120 Q120 35 160 120"/>
    <path d="M90 100 Q120 20 150 100"/>
    <path d="M100 80 Q120 10 140 80"/>
    <line x1="120" y1="30" x2="120" y2="260" stroke="#f87171" stroke-width="2"/>
    <path d="M40 250 Q120 180 200 250"/>
  </g>
  <!-- Mismatched Minutiae -->
  <circle cx="120" cy="90" r="3.5" fill="#ef4444"/>
  <circle cx="85" cy="140" r="3" fill="#ef4444"/>
  <circle cx="155" cy="140" r="3" fill="#ef4444"/>
  <circle cx="68" cy="180" r="3" fill="#ef4444"/>
  <circle cx="172" cy="180" r="3" fill="#ef4444"/>
  <text x="120" y="288" font-family="monospace" font-size="9" fill="#fca5a5" text-anchor="middle">REF #SUBJ-UNMATCHED • PLAIN ARCH</text>
</svg>`);

export const sampleDocuments: SampleDocument[] = [
  {
    id: 'sample-passport-real',
    title: 'Valid International Passport',
    category: 'PASSPORT',
    expectedResult: 'REAL',
    description: 'Compliant ICAO 9303 TD3 standard passport with verified MRZ checksums and clean typography.',
    imageUrl: createPassportSvg(
      'SARAH CHEN',
      'N7821940',
      'P<GBRCHEN<<SARAH<<<<<<<<<<<<<<<<<<<<<<<<<<<<N7821940<5GBR9105144F3111288<<<<<<<<<<<<<<02',
      false
    ),
    sampleReferenceFace: sampleFaceMatching,
    sampleReferenceFingerprint: sampleFingerprintMatching,
    extracted: {
      documentType: 'Passport',
      documentNumber: 'N7821940',
      holderName: 'SARAH CHEN',
      nationality: 'British Citizen (GBR)',
      issuer: 'IPS Glasgow / United Kingdom',
      issueDate: '29 Nov 2021',
      expiryDate: '28 Nov 2031',
      dateOfBirth: '14 May 1991',
      mrzDetected: true,
      notes: 'Standard ICAO TD3 layout verified. Optical security alignment valid.'
    },
    alteredRegions: [],
    knownSha256: '8f434346648f6b96df89dda901c5176b10e6d059612d556b925284173ac54096'
  },
  {
    id: 'sample-visa-fake',
    title: 'Forged Travel Visa (Tampered)',
    category: 'VISA',
    expectedResult: 'FAKE',
    description: 'Altered Schengen visa document displaying spliced font anomalies and invalid security alignment.',
    imageUrl: createVisaSvg('MARCUS V. STEINER', 'V-55120938'),
    sampleReferenceFace: sampleFaceNonMatching,
    sampleReferenceFingerprint: sampleFingerprintNonMatching,
    extracted: {
      documentType: 'Visa',
      documentNumber: 'V-55120938',
      holderName: 'MARCUS V. STEINER',
      nationality: 'German (DEU)',
      issuer: 'Consular Affairs Division',
      issueDate: '10 Jan 2025',
      expiryDate: '09 Jan 2026',
      mrzDetected: true,
      notes: 'Anomalous font rendering detected in bearer field. Splicing indicators present.'
    },
    alteredRegions: [
      {
        id: 'alt-1',
        field: 'holderName',
        label: 'Bearer Name',
        originalOrExpected: 'VERIFIED RECIPIENT NAME (INSPECTION BASELINE)',
        alteredValue: 'MARCUS V. STEINER',
        technique: 'Digital Typography Splicing & Kerning Anomaly',
        severity: 'CRITICAL',
        confidence: 97,
        description: 'Mismatched Courier typewriter font overlaid onto high-security intaglio background. Inconsistent anti-aliasing edges and jagged raster baseline detected.',
        boundingBox: { x: 31, y: 31, width: 35, height: 7 }
      },
      {
        id: 'alt-2',
        field: 'watermark',
        label: 'Consular Watermark Seal',
        originalOrExpected: 'Continuous circular guilloche security seal',
        alteredValue: 'Interrupted / Cleared Pixel Zone',
        technique: 'Substrate Pattern Eradication',
        severity: 'HIGH',
        confidence: 94,
        description: 'Circular background seal is unnaturally cut off around the bearer text box, indicating digital cloning or image eraser tool application.',
        boundingBox: { x: 30, y: 26, width: 44, height: 20 }
      }
    ]
  },
  {
    id: 'sample-borderpass-real',
    title: 'Valid Border Pass & Travel Permit',
    category: 'BORDER PASS',
    expectedResult: 'REAL',
    description: 'Official border control transit permit with consistent cryptographic microprint.',
    imageUrl: createPassportSvg(
      'ELENA ROSTOVA',
      'BP-881920',
      'AC<UTOELENA<<ROSTOVA<<<<<<<<<<<<<<<<<<<<<<<<BP881920<2UTO9408221F2908204<<<<<<<<<<<<<<00',
      false
    ),
    sampleReferenceFace: sampleFaceMatching,
    sampleReferenceFingerprint: sampleFingerprintMatching,
    extracted: {
      documentType: 'Border Pass',
      documentNumber: 'BP-881920',
      holderName: 'ELENA ROSTOVA',
      nationality: 'Universal Transit (UTO)',
      issuer: 'International Border Management Service',
      issueDate: '01 Mar 2024',
      expiryDate: '28 Feb 2029',
      dateOfBirth: '22 Aug 1994',
      mrzDetected: true,
      notes: 'Machine-readable zone checksums valid. Substrate integrity intact.'
    },
    alteredRegions: [],
    knownSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'
  },
  {
    id: 'sample-national-id-fake',
    title: 'Manipulated National ID (Altered Date)',
    category: 'IDENTITY CARD',
    expectedResult: 'FAKE',
    description: 'Forged identity card with spliced expiry date and mismatched substrate guilloche pattern.',
    imageUrl: createPassportSvg(
      'ALEXANDER MUELLER',
      'ID-4491029',
      'I<DEUMUELLER<<ALEXANDER<<<<<<<<<<<<<<<<<<<<ID4491029<1DEU8503120M2512318<<<<<<<<<<<<<<04',
      true
    ),
    sampleReferenceFace: sampleFaceNonMatching,
    sampleReferenceFingerprint: sampleFingerprintNonMatching,
    extracted: {
      documentType: 'National Identity Card',
      documentNumber: 'ID-4491029',
      holderName: 'ALEXANDER MUELLER',
      nationality: 'Federal Republic of Germany (DEU)',
      issuer: 'Federal Ministry of the Interior',
      issueDate: '15 Jan 2018',
      expiryDate: '28 Nov 2039 [TAMPERED]',
      dateOfBirth: '12 Mar 1985',
      mrzDetected: true,
      notes: 'Digital tampering detected in date of expiry field. Spliced font baseline and irregular kerning.'
    },
    alteredRegions: [
      {
        id: 'alt-1',
        field: 'expiryDate',
        label: 'Date of Expiry',
        originalOrExpected: '28 NOV 2028 (10-Year Statutory Period)',
        alteredValue: '28 NOV 2039 [TAMPERED]',
        technique: 'Date Extension & Glyph Replacement',
        severity: 'CRITICAL',
        confidence: 98,
        description: 'Expiry year altered from 2028 to 2039. Exceeds statutory German identity card 10-year maximum validity. Baseline alignment is skewed by 3.2 degrees with mismatched pixel grid.',
        boundingBox: { x: 34, y: 57, width: 33, height: 7 }
      },
      {
        id: 'alt-2',
        field: 'mrzChecksum',
        label: 'MRZ Checksum Validation',
        originalOrExpected: 'Computed Checksum: 04 (for 2028)',
        alteredValue: 'Checksum Mismatch with Visual Date',
        technique: 'Visual Text & MRZ Checksum Discrepancy',
        severity: 'HIGH',
        confidence: 96,
        description: 'The Machine Readable Zone line 2 encodes an expiry date differing from the visually manipulated 2039 date on the upper card layer.',
        boundingBox: { x: 6, y: 81, width: 88, height: 10 }
      }
    ]
  },
  {
    id: 'sample-diplomatic-permit-real',
    title: 'Diplomatic Transit Authorization',
    category: 'TRAVEL PERMIT',
    expectedResult: 'REAL',
    description: 'Verified diplomatic transit authorization with authentic microprint and optical alignment.',
    imageUrl: createPassportSvg(
      'CLAIRE DELACOUR',
      'DP-0029184',
      'AC<FRADELACOUR<<CLAIRE<<<<<<<<<<<<<<<<<<<<<<DP0029184<4FRA9207185F3006301<<<<<<<<<<<<<<00',
      false
    ),
    sampleReferenceFace: sampleFaceMatching,
    sampleReferenceFingerprint: sampleFingerprintMatching,
    extracted: {
      documentType: 'Travel Permit',
      documentNumber: 'DP-0029184',
      holderName: 'CLAIRE DELACOUR',
      nationality: 'Republic of France (FRA)',
      issuer: 'Ministry for Europe and Foreign Affairs',
      issueDate: '01 Jul 2023',
      expiryDate: '30 Jun 2030',
      dateOfBirth: '18 Jul 1992',
      mrzDetected: true,
      notes: 'Diplomatic security crest verified. Security fibers and UV alignment consistent.'
    },
    alteredRegions: []
  }
];

export const initialSecureDocuments: any[] = [
  {
    id: 'SEC-DOC-001',
    title: 'Sarah Chen - Diplomatic Passport (Verified)',
    fileName: 'passport_sarah_chen_gbr.pdf',
    fileFormat: 'PDF / ICAO TD3',
    fileSizeBytes: 2457600,
    documentType: 'Passport',
    holderName: 'SARAH CHEN',
    documentNumber: 'N7821940',
    securityClassification: 'SECRET',
    encryptionStatus: 'AES-256-GCM SEALED',
    sha256: '8f434346648f6b96df89dda901c5176b10e6d059612d556b925284173ac54096',
    vaultedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    retentionUntil: new Date(Date.now() + 3600000 * 24 * 365 * 5).toISOString(),
    verifiedStatus: 'REAL',
    imageUrl: sampleDocuments[0].imageUrl,
    tags: ['Biometric Verified', 'ICAO-9303', 'Diplomatic'],
    accessLogsCount: 14,
    custodianBadge: 'EXP-8891'
  },
  {
    id: 'SEC-DOC-002',
    title: 'Marcus V. Steiner - Forged Visa Seizure Archive',
    fileName: 'seized_forged_visa_steiner.pdf',
    fileFormat: 'PDF / High-Res Scan',
    fileSizeBytes: 3891200,
    documentType: 'Entry Visa',
    holderName: 'MARCUS V. STEINER',
    documentNumber: 'V-55120938',
    securityClassification: 'TOP SECRET',
    encryptionStatus: 'AES-256-GCM SEALED',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    vaultedAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    retentionUntil: new Date(Date.now() + 3600000 * 24 * 365 * 10).toISOString(),
    verifiedStatus: 'FAKE',
    imageUrl: sampleDocuments[1].imageUrl,
    tags: ['Forensic Evidence', 'Interpol Seizure', 'Font Splicing'],
    accessLogsCount: 29,
    custodianBadge: 'EXP-8891'
  },
  {
    id: 'SEC-DOC-003',
    title: 'Elena Rostova - Transit Border Pass Validated',
    fileName: 'border_pass_elena_rostova.svg',
    fileFormat: 'SVG / Vector Specimen',
    fileSizeBytes: 1048576,
    documentType: 'Border Pass',
    holderName: 'ELENA ROSTOVA',
    documentNumber: 'BP-881920',
    securityClassification: 'CONFIDENTIAL',
    encryptionStatus: 'SHA-256 SIGNED',
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    vaultedAt: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    retentionUntil: new Date(Date.now() + 3600000 * 24 * 365 * 3).toISOString(),
    verifiedStatus: 'REAL',
    imageUrl: sampleDocuments[2].imageUrl,
    tags: ['Transit Authority', 'Biometric Linked'],
    accessLogsCount: 8,
    custodianBadge: 'EXP-8891'
  }
];

export const defaultInspectorProfile = {
  name: 'Dr. Evelyn Vance, D.Sc.',
  badgeId: 'EXP-8891-FORENSIC',
  clearanceLevel: 'Tier 3 Senior Forensic Specialist',
  agency: 'International Document Security Agency',
  department: 'Biometrics & Anti-Fraud Division',
  documentsVerified: 1482,
  fraudDetectedCount: 167,
  activeSessionId: 'SESS-' + Date.now().toString(36).toUpperCase(),
  lastLogin: new Date().toISOString()
};

export const defaultAppSettings = {
  ocrStrictness: 'STRICT' as const,
  tamperingSensitivity: 'HIGH' as const,
  biometricFaceThreshold: 85,
  biometricFingerprintThreshold: 90,
  autoVaultOnScreening: true,
  enableAIFallback: true,
  defaultDocumentFormat: 'AUTO_DETECT',
  alertSound: true
};

