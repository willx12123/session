import * as express from "express";

import { readDB } from "../utils/read-db";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userName, userPassword } = req.body;

  if (typeof userName !== "string" || typeof userPassword !== "string") {
    res.statusCode = 403;
    return res.json({ msg: "数据错误" });
  }

  try {
    const database = await readDB();
    const { users } = JSON.parse(database);
    if (Array.isArray(users)) {
      const currentUser = users.find((user) => user.userName === userName);
      if (!currentUser) {
        res.statusCode = 403;
        return res.json({ msg: "用户不存在" });
      }
      if (currentUser.userPassword === userPassword) {
        res.statusCode = 200;
        return res.json({ msg: "登陆成功" });
      } else {
        res.statusCode = 403;
        return res.json({ msg: "密码错误" });
      }
    }
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    return res.json({ msg: err });
  }
});

export default router;
