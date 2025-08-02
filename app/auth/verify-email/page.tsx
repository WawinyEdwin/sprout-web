import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Brain } from "lucide-react";
import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const email = (await searchParams).filters;
  // const resendConfirmation = async () => {};
  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-4">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Sprout
            </span>
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
      <Separator />
      <div className="">
        <p>I did not recieve an email</p>
        <Button variant={'outline'}>
          Resend Confirmation email
        </Button>
      </div>
    </div>
  );
}
