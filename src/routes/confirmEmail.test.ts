import fetch from "node-fetch"

it("sends invalid back if bad id sent", async () => {
  const response = await fetch(`${process.env.TEST_HOST}/confirm/4200`)
  const text = await response.text()
  expect(text).toEqual("bad")
})