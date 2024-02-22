const { app } = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')

const testData = require('../db/data/test-data')

beforeEach(() => { return seed(testData) })
afterAll(() => {db.end()})

describe("Error status codes", () => {
    it("GET /incorrect-url returns a 404 status", () => {
        return request(app)
            .get('/apx')
            .expect(404)
            .then((response) => {
                expect(response.res.statusMessage).toBe('Not Found')
            })
    })
    it("GET /api/articles/:article_id returns a 404 status if no articles can be found with ID", () => {
        return request(app)
            .get('/api/articles/99999999')
            .expect(404)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Not Found")
            })
    })
    it("GET /api/articles/:article_id returns a 400 status for an invalid article_id", () => {
        return request(app)
            .get('/api/articles/not-a-num')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("GET /api/articles/:article_id/comments returns a 404 status if no comments can be found", () => {
        return request(app)
            .get('/api/articles/2/comments')
            .expect(404)
            .then((response) => {
                expect(JSON.parse(response.text)).toEqual({ msg: "No comments found"})
            })
    })
    it("GET /api/articles/:article_id/comments returns a 400 status for an invalid article_id", () => {
        return request(app)
            .get('/api/articles/not-a-num/comments')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("POST /api/articles/:article_id/comments returns a 400 status for an invalid article_id", () => {
        return request(app)
            .post('/api/articles/not-a-num/comments')
            .send({
                username: "rogersop",
                body: "Lorum Ipsum Doughnuts Cupcake nutella dolar marshmallow",
            })
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("POST /api/articles/:article_id/comments returns a 400 status for an article_id that does not exist", () => {
        return request(app)
            .post('/api/articles/99999/comments')
            .send({
                username: "rogersop",
                body: "Lorum Ipsum Doughnuts Cupcake nutella dolar marshmallow",
            })
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("POST /api/articles/:article_id/comments returns a 400 status for an incomplete/invalid request body", () => {
        return request(app)
            .post('/api/articles/5/comments')
            .send({
                username: "rogersop",
                content: "Lorum Ipsum Doughnuts Cupcake nutella dolar marshmallow",
            })
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })

    it("POST /api/articles returns a 404 status if the topic does not exist", () => {
        return request(app)
            .post('/api/articles')
            .send({
                title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
                topic: "unknown",
                author: "rogersop",
                body: "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
                article_img_url: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700",
              })
            .expect(404)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Not Found")
            })
    })
    it("POST /api/articles returns a 404 status if the user does not exist", () => {
        return request(app)
            .post('/api/articles')
            .send({
                title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
                topic: "cats",
                author: "unkown",
                body: "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
                article_img_url: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700",
              })
            .expect(404)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Not Found")
            })
    })
    it("POST /api/articles returns a 400 status if the request does not contain a title", () => {
        return request(app)
            .post('/api/articles')
            .send({
                title: "",
                topic: "coding",
                author: "jessjelly",
                body: "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
                article_img_url: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700",
              })
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("POST /api/articles returns a 400 status if the request does not contain a body", () => {
        return request(app)
            .post('/api/articles')
            .send({
                title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
                topic: "coding",
                author: "jessjelly",
                body: "",
                article_img_url: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700",
              })
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })


    it("POST /api/articles/:article_id/comments returns a 404 status if the username does not exist", () => {
        return request(app)
            .post('/api/articles/5/comments')
            .send({
                username: "grumpy19",
                body: "Lorum Ipsum Doughnuts Cupcake nutella dolar marshmallow",
            })
            .expect(404)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Not Found")
            })
    })




    it("PATCH /api/articles/:article_id returns a 404 status if the article_id does not exist", () => {
        return request(app)
            .patch('/api/articles/555555')
            .send({ inc_votes : 1 })
            .expect(404)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Not Found")
            })
    })
    it("PATCH /api/articles/:article_id returns a 400 status for an invalid article_id", () => {
        return request(app)
            .patch('/api/articles/not-a-num')
            .send({ inc_votes : 1 })
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("PATCH /api/articles/:article_id returns a 400 status for an incomplete/invalid request body", () => {
        return request(app)
            .patch('/api/articles/8')
            .send({ upVotes : 1 })
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("PATCH /api/comments/:comment_id returns a 400 status for an incomplete/invalid request body", () => {
        return request(app)
            .patch('/api/articles/8')
            .send({ upVotes : 1 })
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("DELETE /api/comments/:comment_id returns a 400 status for an invalid id ", () => {
        return request(app)
            .delete('/api/comments/notAnId')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("DELETE /api/comments/:comment_id returns a 404 status when comment_id does not exist", () => {
        return request(app)
            .delete('/api/comments/999999')
            .expect(404)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Not Found")
            })
    })
    it("GET /api/articles?topic returns a 404 when given a valid topic that is not present in the article data", () => {
        return request(app)
            .get('/api/articles?topic=mystery')
            .expect(404)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Not Found")
            })
    })
    it("GET /api/articles?topic returns a 404 when given an invalid topic", () => {
        return request(app)
            .get('/api/articles?topic=1234')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("GET /api/articles?sort_by=not-a-column returns a 400 when given an invalid table column", () => {
        return request(app)
            .get('/api/articles?sort_by=not-a-column')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("GET /api/articles?sort_by/order=alphabetical returns a 400 when given an invalid order", () => {
        return request(app)
            .get('/api/articles?sort_by=author&order=alphabetical')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
    it("GET /api/users/:username returns a 404 status if no username exists", () => {
        return request(app)
            .get('/api/users/not-a-username')
            .expect(404)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Not Found")
            })
    })
    it("GET /api/users/:username returns a 400 status for an invalid username", () => {
        return request(app)
            .get('/api/users/99999')
            .expect(400)
            .then((response) => {
                const error = response.body
                expect(error.msg).toBe("Bad Request")
            })
    })
})
