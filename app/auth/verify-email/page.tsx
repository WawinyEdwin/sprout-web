import { Brain } from "lucide-react";
import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-4">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12   rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold   bg-clip-text ">Sprout</span>
            <div className="text-xs text-emerald-600 font-medium -mt-1">
              Business Intelligence
            </div>
          </div>
        </Link>
      </div>
      <h1 className="text-2xl font-semibold">Verify Your Email</h1>
      <p>We&apos;ve sent a verification link to your email.</p>
      <p>
        Please click the link in your inbox to complete your sign-up. Then you
        can log in!
      </p>
    </div>
  );
}
