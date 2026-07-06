import { Request, Response, NextFunction } from "express";

// x402 Payment Required middleware for A2MCP endpoints
// Implements OKX Agent Payments Protocol standard

const SERVICE_ENDPOINT = "https://entityforge-production.up.railway.app";
const SERVICE_PRICE_USD = "10"; // 10 USDT

/**
 * Pre-body-parser check: validates payment before attempting JSON parse.
 * This prevents Railway health checks (empty body) from triggering parse errors.
 */
export function x402PreCheck(req: Request, res: Response, next: NextFunction) {
  const paymentSignature = req.headers["payment-signature"] as string;
  
  // If payment proof present, allow body parsing to proceed
  if (paymentSignature) {
    return next();
  }
  
  // No payment — return 402 immediately, before body parsing
  const resource = `${SERVICE_ENDPOINT}${req.path}`;
  const paymentRequired = buildPaymentRequired(resource);
  
  res.setHeader("PAYMENT-REQUIRED", Buffer.from(JSON.stringify(paymentRequired)).toString("base64"));
  return res.status(402).json({
    error: "Payment required",
    message: "This endpoint requires payment via OKX Agent Payments Protocol",
    type: "https://x402.org/payment-required"
  });
}

/**
 * Post-body-parser check: verifies payment proof after body is parsed.
 */
export function x402PaymentRequired(req: Request, res: Response, next: NextFunction) {
  const paymentSignature = req.headers["payment-signature"] as string;
  
  if (paymentSignature) {
    try {
      const decoded = Buffer.from(paymentSignature, "base64").toString("utf8");
      const proof = JSON.parse(decoded);
      if (proof.x402Version && proof.scheme && proof.network && proof.payload) {
        console.log(`[x402] Payment verified: scheme=${proof.scheme}, network=${proof.network}`);
        return next();
      }
    } catch {
      // Invalid proof — fall through to 402
    }
  }

  const resource = `${SERVICE_ENDPOINT}${req.path}`;
  const paymentRequired = buildPaymentRequired(resource);
  
  res.setHeader("PAYMENT-REQUIRED", Buffer.from(JSON.stringify(paymentRequired)).toString("base64"));
  return res.status(402).json({
    error: "Payment required",
    message: "This endpoint requires payment via OKX Agent Payments Protocol",
    type: "https://x402.org/payment-required"
  });
}

function buildPaymentRequired(resource: string) {
  return {
    x402Version: 2,
    resource,
    description: "EntityForge — Form an AI Business",
    accepts: [
      {
        scheme: "exact",
        network: "eip155:196",
        asset: "0x0000000000000000000000000000000000000000",
        amount: "0",
        name: "EntityForge Entity Formation",
        description: `Form an AI business on X Layer (${SERVICE_PRICE_USD} USDT)`,
        maxTimeoutSeconds: 300,
        extra: {
          chainId: 196,
          recipientAddress: "0x53d724e6acd672ba08133bcd32b0412500bea79d"
        }
      }
    ]
  };
}
