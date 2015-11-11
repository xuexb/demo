/**
 * 异步
 * @author xiaowu
 */

function wait(t) {
    return new Promise((r) => setTimeout(r, t));
}

async function asyncMania() {
    console.log("1");
    await wait(1000);
    console.log("2");
}

asyncMania()
    .then(() => console.log("3"));
