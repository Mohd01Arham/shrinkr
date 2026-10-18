import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 50 },
    { duration: "30s", target: 50 },
    { duration: "5s", target: 0 },
  ],
};

export default function () {
  const res = http.get("http://localhost:3000/4SCz2G1", { redirects: 0 });
  check(res, { "status is 302": (r) => r.status === 302 });
}