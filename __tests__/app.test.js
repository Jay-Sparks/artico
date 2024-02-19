const { app } = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')

const testData = require('../db/data/test-data')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    db.end();
})

describe("GET /api", () => {
    it("returns a JSON object that includes a description, query & example response", () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then((response) => {
                expect(response.body.endpoints).toHaveProperty("GET /api/topics")
                const endpoints = response.body.endpoints
                const endpointArr = Object.values(endpoints)
                endpointArr.forEach((endpoint) => {
                    expect(endpoint).toHaveProperty('description')
                    expect(endpoint).toHaveProperty('queries')
                    expect(endpoint).toHaveProperty('exampleResponse')
                })
            })
    })
    it("returns a 404 status if summoned with an incorrect url", () => {
        return request(app)
            .get('/apx')
            .expect(404)
            .then((response) => {
                expect(response.res.statusMessage).toBe('Not Found')
            })
    })
})

describe("GET /api/topics", () => {
    it("returns an array of objects", () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body.topics)).toBe(true)
                const topics = response.body.topics
                topics.forEach((topic) => {
                    expect(topic === Object(topic)).toBe(true)
                })
            })
    })
    it("topic objects contain the slug & description properties", () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const topics = response.body.topics
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty('slug')
                    expect(topic).toHaveProperty('description')
                })
            })
    })
    it("returns a 404 status if summoned with an incorrect url", () => {
        return request(app)
            .get('/api/not-topics')
            .expect(404)
            .then((response) => {
                expect(response.res.statusMessage).toBe('Not Found')
            })
    })
})