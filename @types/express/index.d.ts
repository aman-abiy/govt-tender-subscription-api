import express from "express"
import Account from "../../src/interfaces/Account";

declare global {
  namespace Express {
      interface Request {
          user?: Account,
          fileTimeStamp?: Number
      }
  }
}