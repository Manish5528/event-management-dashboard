import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "src", "data", "users.json");

type User = { username: string; password: string };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const fileData = fs.readFileSync(usersFile, "utf8");
    const users: User[] = JSON.parse(fileData);

    const existingUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!existingUser) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login successful",
      user: existingUser,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
