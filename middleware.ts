import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Middleware - Path:", req.nextUrl.pathname);
  console.log("Middleware - Usuario:", user?.email);

  // Proteger rutas /admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      console.log("Middleware - No autenticado, redirigiendo a /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (user.email !== "mujeresenbici2026@gmail.com") {
      console.log("Middleware - Email no autorizado:", user.email);
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    console.log("Middleware - Acceso permitido a /admin");
  }

  // Si va a /login pero ya está autenticado, redirigir a /admin
  if (req.nextUrl.pathname === "/login" && user?.email === "mujeresenbici2026@gmail.com") {
    console.log("Middleware - Usuario ya autenticado, redirigiendo de /login a /admin");
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/page.tsx", "/login"], // Ahora también matchea /login
};