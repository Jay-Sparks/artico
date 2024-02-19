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

describe("GET /api/topics", () => {
    it("returns an array of objects", () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBe(true)
                const body = response.body
                body.forEach((obj) => {
                    expect(obj === Object(obj)).toBe(true)
                })
            })
    })
    it("topic objects contain the slug & description properties", () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const body = response.body
                body.forEach((obj) => {
                    expect(obj).toHaveProperty('slug')
                    expect(obj).toHaveProperty('description')
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