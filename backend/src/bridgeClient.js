import axios from "axios";
const baseURL = "https://api.bridge.xyz/v0";
export default function makeBridgeClient(apiKey) {
  return axios.create({
    baseURL,
    headers: { "Api-Key": apiKey },
    timeout: 15000
  });
}
