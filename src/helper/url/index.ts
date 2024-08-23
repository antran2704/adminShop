import qs from "qs";

const parseQueryString = <T>(
  currentParam: T,
  options?: qs.IStringifyOptions,
) => {
  const parseParameters = qs.stringify(
    { ...currentParam },
    {
      indices: false, // false: a: ['b', 'c', 'd'] => a=b&a=c&a=d
      encode: false, // false: a: a%20b => a=a b
      addQueryPrefix: true, // true: a: 'b' => ?a=b
      filter: (_, value) => value || undefined,
      ...options,
    },
  );

  return parseParameters;
};

export { parseQueryString };
