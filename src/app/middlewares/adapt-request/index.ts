type $AdaptRequestInterface = {
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    method: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    body: Object|undefined,
    // eslint-disable-next-line @typescript-eslint/ban-types
    headers: Object|undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function adaptRequest(req:any= {}, res:any, next:any){
    Object.freeze({
        path: req.path,
        method: req.method,
        params: req.params,
        query: req.query,
        body: req.body,
        headers: req.headers
    } as $AdaptRequestInterface)
    next()
}