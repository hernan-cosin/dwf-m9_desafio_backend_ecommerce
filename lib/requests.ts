import type { NextApiRequest } from "next";

export function getOffsetAndLimitFromReq(
  req: NextApiRequest,
  maxLimit = 100,
  maxOffset
) {
  const queryLimit = parseInt(req.query.limit as string);
  const queryOffset = parseInt(req.query.offset as string);

  let limit = 5;

  if (queryLimit > 0 && queryLimit < maxLimit) {
    limit = queryLimit;
  } else if (queryLimit > maxLimit) {
    limit = maxLimit;
  }

  const offset = queryOffset <= maxOffset ? queryOffset : 0;

  return {
    limit,
    offset,
  };
}
