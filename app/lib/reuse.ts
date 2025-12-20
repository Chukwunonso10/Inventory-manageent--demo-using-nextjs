import { stackServerApp } from "@/stack/server";

export async function getCurrentUser() {
    const user = await stackServerApp.getUser()
    console.log(user)
}