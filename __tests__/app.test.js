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

describe("Error codes", () => {
    it("returns a 404 status if summoned with an incorrect api url", () => {
        return request(app)
            .get('/apx')
            .expect(404)
            .then((response) => {
                expect(response.res.statusMessage).toBe('Not Found')
            })
    })
    it("returns a 404 status if summoned with an incorrect topics url", () => {
        return request(app)
            .get('/api/not-topics')
            .expect(404)
            .then((response) => {
                expect(response.res.statusMessage).toBe('Not Found')
            })
    })
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
})

describe("GET /api/topics", () => {
    it("returns an array of objects", () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body.topics)).toBe(true)
                const topics = response.body.topics
                expect(topics.length).toBe(3)
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
                expect(topics.length).toBe(3)
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty('slug')
                    expect(topic).toHaveProperty('description')
                })
            })
    })
})


describe("GET /api/articles/:article_id", () => {
    it("returns an article object", () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const articleObj = response.body
                expect(articleObj === Object(articleObj)).toEqual(true)
            })
    })
    it("Object contains correct properties", () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const article = response.body.article
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('body')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
            })
    })
    it("returns an object with only one article", () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const articleArr = Object.values(response.body)
                expect(articleArr.length).toBe(1)
            })
    })
    it("returns a 400 status if no article is found with the given ID", () => {
        return request(app)
            .get('/api/articles/99999999')
            .expect(400)
            .then((response) => {
                expect(JSON.parse(response.text)).toEqual({ msg: "No articles found"})
            })
    })

})
