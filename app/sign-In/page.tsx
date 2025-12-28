
import { SignIn, SelectedTeamSwitcher, StackTheme } from "@stackframe/stack";
import Link from "next/link";


export default async function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="max-w-md w-full space-y-8" >
                <SignIn 
                fullPage={true}
                extraInfo={<>By signing in, you agree to our <a href="/terms">Terms</a></>} />
                <Link href="/">Go back home</Link>
            </div>
        </div>
    )
}

