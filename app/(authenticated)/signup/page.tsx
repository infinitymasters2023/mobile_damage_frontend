import { SignupComponent } from "@/components/login/SignupComponent";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />

      {/* The Reusable Component */}
      <SignupComponent />
    </div>
  );
}