import jwt from "jsonwebtoken";

// Load and format keys from environment variables
const privateKey = process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n');
const publicKey = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n');

// Validation: Stop the app if keys are missing
if (!privateKey || !publicKey) {
  throw new Error("FATAL: JWT_PRIVATE_KEY or JWT_PUBLIC_KEY is missing in .env");
}

// console.log(privateKey);
// console.log(publicKey);

export function signJwt(object: Object, options?: jwt.SignOptions) {
  return jwt.sign(object, privateKey!, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(token: string): T | null {
  try {
    const decoded = jwt.verify(token, publicKey!, { algorithms: ["RS256"] }) as T;
    return decoded;
  } catch (e) {
    console.error("JWT Verification failed:", e);
    return null;
  }
}