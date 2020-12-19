const fetch = require("node-fetch");
const AbortController = require("abort-controller");

const cancellableFetch = (url, delay) => async () => {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let timeoutId = null;
  const handler = (resolve, reject) => {
    timeoutId = setTimeout(controller.abort.bind(controller), delay);
  };

  const fetchRequest = fetch(url, options);
  const abortRequest = new Promise(handler);
  const requestList = [fetchRequest, abortRequest];

  let data = null;
  try {
    const response = await Promise.race(requestList);
    data = await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
  return data;
};

const {
  env: { URL },
} = process;

const ONE_SECOND = 1000;
const TEN_SECOND = 10 * ONE_SECOND;

const separator = () => console.log("-".repeat(40));
const dumpData = (data) => console.log(`[client] 👌 ${JSON.stringify(data)}`);
const showError = (error) => console.log(`[client] 🧨 ${error.message}`);

const fetchDataSuccess = cancellableFetch(URL, ONE_SECOND);
fetchDataSuccess().then(dumpData).catch(showError).finally(separator);

const fetchDataFailure = cancellableFetch(URL, TEN_SECOND);
fetchDataFailure().then(dumpData).catch(showError).finally(separator);
