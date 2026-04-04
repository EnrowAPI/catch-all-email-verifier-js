# Catch-All Email Verifier - JavaScript Library

[![npm version](https://img.shields.io/npm/v/catch-all-email-verifier.svg)](https://www.npmjs.com/package/catch-all-email-verifier)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Verify emails on catch-all domains with deterministic verification. Most verifiers mark catch-all emails as "risky" or "unknown" -- this one tells you if the specific mailbox actually exists.

Powered by [Enrow](https://enrow.io) -- deterministic email verification, not probabilistic.

## The catch-all problem

A catch-all (or accept-all) domain is configured to accept mail sent to any address at that domain, whether or not the specific mailbox exists. This means `anything@company.com` will not bounce at the SMTP level, so traditional email verifiers cannot distinguish real inboxes from non-existent ones. They return "accept-all", "risky", or "unknown" and leave you guessing.

Enrow uses deterministic verification techniques that go beyond SMTP handshake checks, resolving the actual mailbox existence on catch-all domains. The result is a clear valid/invalid verdict instead of an inconclusive shrug.

## Installation

```bash
npm install catch-all-email-verifier
```

Requires Node.js 18+. Zero dependencies.

## Simple Usage

```typescript
import { verifyCatchAll, getVerificationResult } from 'catch-all-email-verifier';

const verification = await verifyCatchAll({
  apiKey: 'your_api_key',
  email: 'tcook@apple.com',
});

const result = await getVerificationResult('your_api_key', verification.id);

console.log(result.email);          // tcook@apple.com
console.log(result.qualification);  // valid
console.log(result.isDeliverable);  // true
```

`verifyCatchAll` returns a verification ID. The verification runs asynchronously -- call `getVerificationResult` to retrieve the result once it's ready. You can also pass a `webhook` URL to get notified automatically.

## What you get back

```json
{
  "id": "ver_abc123",
  "email": "tcook@apple.com",
  "qualification": "valid",
  "isDeliverable": true,
  "checks": {
    "syntaxValid": true,
    "mxRecordsFound": true,
    "smtpConnectable": true,
    "mailboxExists": true,
    "isCatchAll": false,
    "isDisposable": false,
    "isRoleAccount": false
  },
  "metadata": {
    "domain": "apple.com",
    "mxProvider": "Google",
    "verifiedAt": "2024-12-01T12:00:00Z"
  },
  "creditsUsed": 0.25
}
```

## Bulk verification

```typescript
import { verifyCatchAllBulk, getVerificationResults } from 'catch-all-email-verifier';

const batch = await verifyCatchAllBulk({
  apiKey: 'your_api_key',
  verifications: [
    'tcook@apple.com',
    'satya@microsoft.com',
    'jensen@nvidia.com',
  ],
});

// batch.batchId, batch.total, batch.status

const results = await getVerificationResults('your_api_key', batch.batchId);
// results.results -- array of VerificationResult
```

Up to 5,000 verifications per batch. Pass a `webhook` URL to get notified when the batch completes.

## Error handling

```typescript
try {
  await verifyCatchAll({ apiKey: 'bad_key', email: 'test@test.com' });
} catch (error) {
  // error.message contains the API error description
  // Common errors:
  // - "Invalid or missing API key" (401)
  // - "Your credit balance is insufficient." (402)
  // - "Rate limit exceeded" (429)
}
```

## Getting an API key

Register at [app.enrow.io](https://app.enrow.io) to get your API key. You get **50 free credits** (= 200 free verifications) with no credit card required. Each verification costs **0.25 credits**.

Paid plans start at **$17/mo** up to **$497/mo**. See [pricing](https://enrow.io/pricing).

## Documentation

- [Enrow API documentation](https://docs.enrow.io)
- [Full Enrow SDK](https://github.com/enrow/enrow-js) -- includes email finder, phone finder, reverse email lookup, and more

## License

MIT -- see [LICENSE](LICENSE) for details.
