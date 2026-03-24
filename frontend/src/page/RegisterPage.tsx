import { RegisterLeft } from "@/components/register-left";
import { RegisterRight } from "@/components/register-right";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 md:p-10 border">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterLeft />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 border">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterRight />
          </div>
        </div>
      </div>
    </div>
  )
}
