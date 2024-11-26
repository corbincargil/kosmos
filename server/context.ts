// import type {
//   CreateNextContextOptions,
//   NextApiRequest,
// } from "@trpc/server/adapters/next";
// import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
// import prisma from "@/lib/prisma";
// import { getAuth } from "@clerk/nextjs/server";

// /**
//  * Creates context for an incoming request
//  * @see https://trpc.io/docs/v11/context
//  */
// export const createContext = async (
//   opts: CreateNextContextOptions | CreateWSSContextFnOptions
// ) => {
//   const auth = getAuth(opts.req as NextApiRequest);

//   return {
//     prisma,
//     auth,
//     userId: auth.userId,
//   };
// };

// export type Context = Awaited<ReturnType<typeof createContext>>;
