import * as userService from "@/services/user-service";
import { NextRequest, NextResponse } from "next/server";

export async function getUsers(request: NextRequest) {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function createUser(request: NextRequest) {
  try {
    const userData = await request.json();
    const newUser = await userService.createUser(userData);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 400 }
    );
  }
}
