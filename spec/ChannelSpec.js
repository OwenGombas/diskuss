var app = require('../server'),
    request = require('supertest');

describe('Valid app', function() {
    const agent = request.agent(app);
    let id;
    it('connects to server', function(done){
        agent.post('/users/register/toto/')
			.end(function(err, res) {
				expect(200);
				id = res.body.id;
				expect(id).not.toBeUndefined();
				done()
			})
    })
    
    it('joins a channel', function(done) {
        agent.put('/user/' + id + '/channels/channel-1/join/')
            .end(function(err, res) {
                expect(200);
                const user = res.body;
                expect(user).not.toBeUndefined();
                expect(user.id).toEqual(id);
				done()
            })
    })
    
    it('talks in channel', function(done) {
        agent.put('/user/' + id + '/channels/channel-1/say/')
            .send({ message: 'Hello, world!' })
            .end(function(err, res) {
                expect(200)
                const user = res.body;
                expect(user).not.toBeUndefined();
                expect(user.id).toEqual(id);
				done()
            })
    })
    
    it('checks for notices', function(done) {
        agent.get('/user/' + id + '/notices/')
            .end(function(err, res) {
                expect(200)
                const notices = res.body
                expect(notices).not.toBeUndefined()
                expect(notices.length).toEqual(2)
				if (notices.length > 0) {
					expect(notices[0]['type']).toEqual('channelJoin');
					expect(notices[0]['nick']).toEqual('toto');
					expect(notices[0]['channel']).toEqual('channel-1');
					
					if (notices.length > 1) {
						expect(notices[1]['type']).toEqual('channelMessage');
						expect(notices[1]['nick']).toEqual('toto');
						expect(notices[1]['channel']).toEqual('channel-1');
					}
				}
				done()
            })
    })
    
    it('disconnects', function(done) {
        agent.del('/user/' + id + '/disconnect/')
            .end(function(err, res) {
                expect(200)
                const version = res.body.version
                expect(version).not.toBeUndefined()
				done()
            })
    })
});

describe('Invalid app', function() {
    // TODO Invalid actions
})
