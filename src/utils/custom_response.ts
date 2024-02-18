import { Response } from 'express';
import Account from '../interfaces/Account';

// class CustomResponse extends Response{
//     public user?: Account;
// }

class CustomResponse {
    public user?: Account;
}

export default CustomResponse