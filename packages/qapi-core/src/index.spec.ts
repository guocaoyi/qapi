import cloud from '../index'

cloud.init({
  domain: 'http://127.0.0.1:10000',
  apiKey:
    '3b1768417b1e06340c815bfa6db11996-32a679469a4819bb8c3ac472b253abc2fc6ba249e437c56aeda2ef8e61769b035f9ad3f0bafec279',
})

describe('Budibase testing', () => {
  const db = cloud.database()

  it('新建 app', async () => {
    const result = await db.app().create({
      name: 'qm_act_demo_001',
      url: '/demo_001',
    })

    expect(result?.data?.data?._id).toBeTruthy()
  })

})
