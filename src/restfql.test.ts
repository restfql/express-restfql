import request from "supertest";
import express, { Express, Request, Response } from 'express';
import { restfql } from "./restfql";

describe("restfql", () => {
    let server: any;
    let app: Express;
    const fullMessage = {
        message: 'Hello World!', 
        description: "awesome description",
        tags:{
            mandatory: ["mand_tag1","mand_tag1"],
            optional:  ["opt_tag1","opt_tag1"],
        }
    }
    beforeAll(async () => {
        app = express()
        app.use(restfql)
        app.get('/', (req: Request, res: Response) => {
          res.json(fullMessage);
        });
        server = app.listen(3000)
    })
    afterAll(async () => {
        server.close()
    })
    
    it("should return full response if no filter", async() => {
        await request(app)
            .get('/')
            .expect(200,fullMessage)
    })
    
    it("should return first level of query filter", async() => {
        await request(app)
            .get('/')
            .query({ fql: '{message}' })
            .expect(200,{message: fullMessage.message})
    })
    
    it("should return second level of query filter", async() => {
        await request(app)
            .get('/')
            .query({ fql: '{tags{mandatory}}' })
            .expect(200,{tags:{mandatory:fullMessage.tags.mandatory}})
    })
})