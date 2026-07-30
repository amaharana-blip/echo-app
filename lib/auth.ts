import { getSession } from "@auth0/nextjs-auth0";
import { db } from "./db";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) return null;

  const user = await db.user.findUnique({
    where: { auth0Id: session.user.sub },
    include: { team: true },
  });

  if (!user) {
    return db.user.create({
      data: {
        auth0Id: session.user.sub,
        email: session.user.email,
        name: session.user.name ?? session.user.email,
        role: "EMPLOYEE",
      },
      include: { team: true },
    });
  }

  return user;
}

export async function requireRole(minRole: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthenticated");

  const hierarchy = ["EMPLOYEE", "MANAGER", "ADMIN"];
  if (hierarchy.indexOf(user.role) < hierarchy.indexOf(minRole)) {
    throw new Error("Forbidden");
  }

  return user;
}
