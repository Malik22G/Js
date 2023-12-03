import { Token } from "./auth";

export async function logIn({ token, owner }: Token) {
  await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      user: owner,
    }),
    cache: "no-cache",
  });
}

export async function logOut() {
  await fetch("/auth/logout", {
    method: "GET",
    cache: "no-cache",
  });
}
