import { getUsers, createUser } from "@/controllers/user-controller";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return getUsers(request);
}

export async function POST(request: NextRequest) {
  return createUser(request);
}
