import { MongoClient } from "mongodb";
import { env } from "../config/env"

const client = new MongoClient(env.MONGO_URI, {maxPoolSixe: 10 })
const db = client.db("JOBserch")

export const users = db.collection("user");
export const jobs = db.collection("jobs")

export async function connectDB() {
    await client.connect();
}

export async function closeDB() {
    await client.close(
        
    )
}