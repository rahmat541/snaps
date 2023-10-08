import { getSafeJson } from '@metamask/utils';
// TODO: Upstream this to @metamask/utils
/**
 * Parse JSON safely.
 *
 * Does multiple kinds of validation and strips unwanted properties like
 * `__proto__` and `constructor`.
 *
 * @param json - A JSON string to be parsed.
 * @returns The parsed JSON object.
 * @template Type - The type of the JSON object. The type is not actually
 * checked, but it is used to infer the return type.
 */ export function parseJson(json) {
    return getSafeJson(JSON.parse(json));
}

//# sourceMappingURL=json.js.map