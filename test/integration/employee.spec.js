import request from 'supertest'
import httpStatus from 'http-status'
import app from '../../src'

describe('Employee Endpoint [API]', async () => {
    let stub

    beforeEach(async () => {
        stub = request(app)
    })

    describe('GET /v1/employee', () => {
        it('should respond with 200', () => {
            return stub
                .get('/v1/employee')
                .expect(httpStatus.BAD_REQUEST)
        })
    })
})
