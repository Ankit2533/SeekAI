'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

const Provider = ({ children, session }) => (
  

  <ThemeProvider attribute='class'>
  <SessionProvider session={session}>
    {children}
  </SessionProvider>
  </ThemeProvider>

)

export default Provider;