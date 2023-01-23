import request from "supertest"

import { WebApplication } from "../src/main";

test("App test",async () => {
    await request(WebApplication)
})