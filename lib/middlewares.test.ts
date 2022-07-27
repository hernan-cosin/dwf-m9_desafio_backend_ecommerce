import type { NextApiRequest } from "next";
import test from "ava";
import sinon from "sinon"
import {authMiddleware} from "./middlewares"
import {generate} from "lib/jwt"

// mock de request con un userId encriptado en el header authorization
const mockRequest = (userId?) => {
    const token = userId? generate({userId}) : "" 
    return {
      headers: { authorization: `${"bearer " + token}` },
    };
};

// mock de response con metodo status y send
const mockResponse = () => {
    const res = {} as any;
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub().returns(res);
    return res;
  };

//  test con userId encriptado correctamente
test("middlewares > should 200 with userId encrypted in header authorization", async (t) => {
    const req = mockRequest("abc");
    const res = mockResponse();

    const authMiddlewareCb = (req, res, decodedToken)=>{return decodedToken};
    
    const authMiddlewareFunction = authMiddleware(authMiddlewareCb);
    
    await authMiddlewareFunction(req, res)
        
    t.true(res.status.calledWith(200));
});

//  test sin userId encriptado en el token en el request
test("middlewares > should 401 with response token not found", async (t) => {
    const req = mockRequest();
    const res = mockResponse();

    const authMiddlewareCb = (req, res, decodedToken)=>{return decodedToken};
    
    const authMiddlewareFunction = authMiddleware(authMiddlewareCb);
    
    await authMiddlewareFunction(req, res)
    
    t.true(res.status.calledWith(401));
    t.true(res.send.calledWith({ message: 'token not found' }));
});
