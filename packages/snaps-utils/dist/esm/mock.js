import crypto from 'crypto';
import EventEmitter from 'events';
import { DEFAULT_ENDOWMENTS } from './default-endowments';
const NETWORK_APIS = [
    'fetch',
    'Request',
    'Headers',
    'Response'
];
export const ALL_APIS = [
    ...DEFAULT_ENDOWMENTS,
    ...NETWORK_APIS,
    'WebAssembly'
];
/**
 * Get a mock snap API, that always returns `true` for requests.
 *
 * @returns A mocked snap provider.
 */ function getMockSnapGlobal() {
    // eslint-disable-next-line @typescript-eslint/require-await
    return {
        request: async ()=>true
    };
}
/**
 * Get a mock Ethereum provider, that always returns `true` for requests.
 *
 * @returns A mocked ethereum provider.
 */ function getMockEthereumProvider() {
    const mockProvider = new EventEmitter();
    // eslint-disable-next-line @typescript-eslint/require-await
    mockProvider.request = async ()=>true;
    return mockProvider;
}
/**
 * Check if a value is a constructor.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a constructor, or `false` otherwise.
 */ export const isConstructor = (value)=>Boolean(typeof value?.prototype?.constructor?.name === 'string');
/**
 * A function that always returns `true`.
 *
 * @returns `true`.
 */ const mockFunction = ()=>true;
class MockClass {
}
const handler = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    construct (Target, args) {
        return new Proxy(new Target(...args), handler);
    },
    get (_target, _prop) {
        return mockFunction;
    }
};
/**
 * Generate a mock class for a given value. The value is wrapped in a Proxy, and
 * all methods are replaced with a mock function.
 *
 * @param value - The value to mock.
 * @returns A mock class.
 */ const generateMockClass = (value)=>{
    return new Proxy(value, handler);
};
// Things not currently auto-mocked because of NodeJS, by adding them here we
// have types for them and can use that to generate mocks if needed.
const mockWindow = {
    crypto,
    SubtleCrypto: MockClass
};
/**
 * Generate a mock endowment for a certain class or function on the `globalThis`
 * object.
 *
 * @param key - The key to generate the mock endowment for.
 * @returns A mocked class or function. If the key is part of the default
 * endowments, the original value is returned.
 */ const generateMockEndowment = (key)=>{
    const globalValue = globalThis[key];
    // Default exposed APIs don't need to be mocked
    if (globalValue && DEFAULT_ENDOWMENTS.includes(key)) {
        return globalValue;
    }
    // Fall back to mockWindow for certain APIs not exposed in global in Node.JS
    const globalOrMocked = globalValue ?? mockWindow[key];
    const type = typeof globalOrMocked;
    const isFunction = type === 'function';
    if (isFunction && isConstructor(globalOrMocked)) {
        return generateMockClass(globalOrMocked);
    } else if (isFunction || !globalOrMocked) {
        // Fall back to function mock for now
        return mockFunction;
    }
    return globalOrMocked;
};
/**
 * Generate mock endowments for all the APIs as defined in {@link ALL_APIS}.
 *
 * @returns A map of endowments.
 */ export const generateMockEndowments = ()=>{
    return ALL_APIS.reduce((acc, cur)=>({
            ...acc,
            [cur]: generateMockEndowment(cur)
        }), {
        snap: getMockSnapGlobal(),
        ethereum: getMockEthereumProvider()
    });
};

//# sourceMappingURL=mock.js.map