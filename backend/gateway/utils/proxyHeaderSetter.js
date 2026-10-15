import proxy from "express-http-proxy";

export const setProxyHeader = (serviceUrl) => {
    return proxy(serviceUrl, {
        proxyReqOptDecorator: (proxyReqOpts, req) => {
            if (req.user) {
                proxyReqOpts.headers["x-user_id"] = req.user._id;
            }
            return proxyReqOpts;
        }
    })
}