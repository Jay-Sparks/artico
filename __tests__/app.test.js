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

describe("GET /api/articles", () => {
    it("returns an array of objects", () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body.articles)).toBe(true)
                const articles = response.body.articles
                expect(articles.length).toBe(13)
                articles.forEach((article) => {
                    expect(article).toBeObject()
                })
            })
    })
    it("article objects contain the correct properties and NOT a body", () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles
                expect(articles.length).toBe(13)
                articles.forEach((article) => {
                    expect(article).toHaveProperty('author')
                    expect(article).toHaveProperty('title')
                    expect(article).toHaveProperty('article_id')
                    expect(article).toHaveProperty('topic')
                    expect(article).toHaveProperty('created_at')
                    expect(article).toHaveProperty('votes')
                    expect(article).toHaveProperty('article_img_url')
                    expect(article).not.toHaveProperty('body')
                })
            })
    })
    it("articles are sorted by date in descending order by default", () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toBeSortedBy('created_at', {descending: true})
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
                expect(article).toHaveProperty('comment_count')
                expect(article.comment_count).toBe(11)
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
})


describe("GET /api/articles/:article_id/comments", () => {
    it("returns an array of comment objects with the correct properties", () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body.comments)).toBe(true)
                const comments = response.body.comments
                expect(comments.length).toBe(11)
                comments.forEach((comment) => {
                    expect(comment).toBeObject()
                    expect(comment).toHaveProperty('comment_id')
                    expect(comment).toHaveProperty('votes')
                    expect(comment).toHaveProperty('created_at')
                    expect(comment).toHaveProperty('author')
                    expect(comment).toHaveProperty('body')
                    expect(comment).toHaveProperty('article_id')
                })
            })
    })
    it("comments are sorted by date in descending order", () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response) => {
                expect(response.body.comments).toBeSortedBy('created_at', {descending: true})
            })
    })
})


describe("POST /api/articles/:article_id/comments", () => {
    it("returns a comment object with the correct properties", () => {
        return request(app)
            .post("/api/articles/3/comments")
            .send({
                username: "rogersop",
                body: "Lorum Ipsum Doughnuts Cupcake nutella dolar marshmallow",
            })
            .expect(201)
            .then((response) => {
                const comment = response.body.comment
                expect(comment).toHaveProperty('body')
                expect(comment).toHaveProperty('votes')
                expect(comment).toHaveProperty('author')
                expect(comment).toHaveProperty('article_id')
                expect(comment).toHaveProperty('created_at')
            })
        })
    it("comment is stored correctly in database", () => {
        return request(app)
            .post("/api/articles/4/comments")
            .send({
                username: "rogersop",
                body: "Lorum Ipsum Doughnuts Cupcake nutella dolar marshmallow",
            })
            .expect(201)
            .then((response) => {
                return db.query('SELECT * FROM comments WHERE article_id = 4')
                    .then((returnedComments) => {
                        const commentObj = JSON.parse(JSON.stringify(returnedComments.rows[0]))
                        expect(commentObj).toEqual(expect.objectContaining(response.body.comment))
                        expect(commentObj).toHaveProperty('body')
                        expect(commentObj).toHaveProperty('votes')
                        expect(commentObj).toHaveProperty('author')
                        expect(commentObj).toHaveProperty('article_id')
                        expect(commentObj).toHaveProperty('created_at')
                    })
            })
    })
})


describe("PATCH /api/articles/:article_id", () => {
    it("returns an article object with the correct vote property updated", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes : 1 })
            .expect(200)
            .then((response) => {
                expect(response.body.article).toMatchObject({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 101,
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                  })
            })
    })
    it("decrements the value when passed a negative number", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes : -10 })
            .expect(200)
            .then((response) => {
                expect(response.body.article).toMatchObject({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 90,
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                  })
            })
    })
})

describe("DELETE /api/comments/:comment_id", () => {
    it("comment no longer exists in comments table and returns a 204 status", () => {
        return request(app)
            .delete('/api/comments/7')
            .expect(204)
            .then(() => {
                return db.query('SELECT * FROM comments WHERE comment_id = 7')
                    .then(({rows}) => {
                        expect(rows.length === 0).toBe(true)
                    }) 
            })
    })
})

describe("GET /api/users", () => {
    it("returns an array of user objects", () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                const users = response.body.users
                expect(users.length).toBe(4)
                users.forEach((user) => {
                    expect(user).toBeObject()
                })
            })
    })
    it("user objects contain the correct properties", () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                const users = response.body.users
                expect(users.length).toBe(4)
                users.forEach((user) => {
                    expect(user).toHaveProperty('username')
                    expect(user).toHaveProperty('name')
                    expect(user).toHaveProperty('avatar_url')
                })
            })
    })
})


describe("GET /api/articles?topic", () => {
    it("take a topic query that returns only the associated articles", () => {
        return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles
                expect(articles).toHaveLength(1)
                articles.forEach((article) => {
                    expect(article.topic).toBe("cats")
                })
            })
    })
    it("returns an empty array when given a topic that exists but is not associated", () => {
        return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then((response) => {
                const { articles } = response.body
                expect(articles.length).toBe(0)
            })
    })
})


describe("GET /api/articles?sort_by", () => {
    it("takes a sort_by query that returns the articles sorted by a valid column", () => {
        return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles
                expect(articles).toHaveLength(13)
                expect(articles).toBeSortedBy("author", {descending: true})
            })
    })
    it("takes an order query that returns the articles sorted in ascending order defaulting to descending", () => {
        return request(app)
            .get('/api/articles?sort_by=author&order=asc')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles
                expect(articles).toHaveLength(13)
                expect(articles).toBeSortedBy("author", {ascending: true})
            })
    })
    it("order query defaults to descending", () => {
        return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles
                expect(articles).toHaveLength(13)
                expect(articles).toBeSortedBy("author", {descending: true})
            })
    })
})


describe("GET /api/users/:username", () => {
    it("returns a user object", () => {
        return request(app)
            .get('/api/users/rogersop')
            .expect(200)
            .then((response) => {
                const userObj = response.body
                expect(userObj === Object(userObj)).toEqual(true)
            })
    })
    it("Object contains correct properties", () => {
        return request(app)
            .get('/api/users/rogersop')
            .expect(200)
            .then((response) => {
                const user = response.body.user
                expect(user).toMatchObject(
                    {
                        username: 'rogersop',
                        name: 'paul',
                        avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                    }
                )
        })
    })
    it("returns an object with only one user", () => {
        return request(app)
            .get('/api/users/rogersop')
            .expect(200)
            .then((response) => {
                const userArr = Object.values(response.body)
                expect(userArr.length).toBe(1)
            })
    })
})