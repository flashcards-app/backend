import request from 'supertest'
import httpStatus from 'http-status'
import app from '../../src/index'

describe('Auth Endpoint [API]', async () => {
    let stub

    beforeEach(async () => {
        stub = request(app)
    })

    describe('GET /v1/auth/login', () => {
        it('should respond with 400 error when no email or password was sent', () => {
            return stub
                .get('/v1/auth/login')
                .expect(httpStatus.BAD_REQUEST)
        })
    })

    describe('GET /v1/auth/login', () => {
        it('should respond with 400 error when invalid email sent', () => {
            return stub
                .get('/v1/auth/login')
                .query({
                    email:    'invalid',
                    password: '123456'
                })
                .expect(httpStatus.BAD_REQUEST)
        })
    })

    describe('GET /v1/auth/login', () => {
        it('should respond with 401 error when non-existing email sent', () => {
            return stub
                .get('/v1/auth/login')
                .query({
                    email:    'email@email.com',
                    password: '123456'
                })
                .expect(httpStatus.UNAUTHORIZED)
        })
    })

    describe('GET /v1/auth/login', () => {
        it("should respond with 401 error when password don't match to given email", () => {
            return stub
                .get('/v1/auth/login')
                .query({
                    email:    'david.cohen@email.com',
                    password: '123123'
                })
                .expect(httpStatus.UNAUTHORIZED)
        })
    })

    describe('GET /v1/auth/login', () => {
        it("should respond with 200 status code for correct email and password", () => {
            return stub
                .get('/v1/auth/login')
                .query({
                    email:    'david.cohen@email.com',
                    password: '123456'
                })
                .expect(httpStatus.OK)
        })
    })
})
