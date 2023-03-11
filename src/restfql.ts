import { Request, Response } from 'express';
import gql from 'graphql-tag';

const filterResponse = (response: any, model: any, acc: any) =>{
    for (const field of model.selectionSet.selections) {
        acc[field.name.value] = field.selectionSet? filterResponse(response[field.name.value], field, {}) : response[field.name.value]
    }
    return acc
}
export const restfql: (req: Request, res: Response, next: any) => void = (req: Request, res: Response, next: any) => {
    let originalJson = res.json;
    res.json = (args: any) => {
        if(!req.query.fql)
            return originalJson.apply(args)
        const fql = gql`${req.query.fql}`
        return originalJson.apply(res,[filterResponse(args, fql.definitions[0], {})]);
    };
    next();
};
