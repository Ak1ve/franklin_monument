import { Html, Head, Main, NextScript } from 'next/document'
import { useRouter } from 'next/router'
import {signIn, useSession} from "next-auth/react";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-gradient-to-r from-sky-50/50 to-sky-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
