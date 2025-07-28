import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "src", "data", "users.json");

console.log(usersFile)

type User = { username: string; password: string };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(usersFile, JSON.stringify([]));
    }

    let fileData = fs.readFileSync(usersFile, "utf8");
     if (!fileData.trim()) fileData = "[]";
    const users: User[] = JSON.parse(fileData);
    console.log(users)

    if (users.some((u) => u.username === username)) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    const newUser = { username, password };
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
